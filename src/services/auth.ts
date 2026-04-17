// src/services/auth.ts
import { db, authReady } from '../config/cloudbase';

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function register(phone: string, gender: 'male' | 'female'): Promise<{ userId: string; coupleCode: string }> {
  await authReady; // 确保匿名登录完成

  const existing = await db.collection('users').where({ phone }).get();
  if (((existing.data as any[]) ?? []).length > 0) throw new Error('该手机号已注册，请直接登录');

  const code = generateCode();

  // 先建 couple，拿到自动生成的 _id 作为 coupleId
  const coupleResult: any = await db.collection('couples').add({
    code, status: 'pending', user1: '', user2: '', startDate: Date.now(),
  });
  const coupleId: string = coupleResult.docId ?? coupleResult.id ?? coupleResult._id;

  // 再建 user，拿到自动生成的 _id 作为 userId
  const userResult: any = await db.collection('users').add({
    phone, nickname: '', avatarUrl: '', coupleId, code, gender, createdAt: Date.now(),
  });
  const userId: string = userResult.docId ?? userResult.id ?? userResult._id;

  // 回写 couple.user1
  await db.collection('couples').doc(coupleId).update({ user1: userId });

  return { userId, coupleCode: code };
}

export async function login(phone: string, code: string): Promise<{ userId: string; coupleId: string; gender: 'male' | 'female' }> {
  await authReady;

  const res = await db.collection('users').where({ phone }).get();
  const users = (res.data as any[]) ?? [];
  if (users.length === 0) throw new Error('手机号未注册');

  const user = users[0];
  if (user.code !== code) throw new Error('情侣码错误');

  return { userId: user._id, coupleId: user.coupleId, gender: user.gender ?? 'male' };
}

export async function unbindCouple(userId: string, coupleId: string): Promise<void> {
  await authReady;

  // 清除旧 couple 文档里自己那侧
  const res: any = await db.collection('couples').doc(coupleId).get();
  const coupleData = (res.data as any[])?.[0];
  if (coupleData) {
    if (coupleData.user1 === userId) {
      await db.collection('couples').doc(coupleId).update({ user1: '', status: 'pending' });
    } else {
      await db.collection('couples').doc(coupleId).update({ user2: '', status: 'pending' });
    }
  }

  // 为自己创建全新的 couple 文档和 code
  const newCode = generateCode();
  const newCoupleResult: any = await db.collection('couples').add({
    code: newCode, status: 'pending', user1: userId, user2: '', startDate: Date.now(),
  });
  const newCoupleId: string = newCoupleResult.docId ?? newCoupleResult.id ?? newCoupleResult._id;

  // 更新用户记录
  await db.collection('users').doc(userId).update({ coupleId: newCoupleId, code: newCode });
}

export async function pairCouple(myUserId: string, partnerCode: string): Promise<string> {
  await authReady;

  const res = await db.collection('couples').where({ code: partnerCode, status: 'pending' }).get();
  const couples = (res.data as any[]) ?? [];
  if (couples.length === 0) throw new Error('情侣码无效或已使用');

  const coupleDoc = couples[0];
  if (coupleDoc.user1 === myUserId) throw new Error('不能和自己配对');

  const coupleId = coupleDoc._id;
  await db.collection('couples').doc(coupleId).update({ user2: myUserId, status: 'active' });
  await db.collection('users').doc(myUserId).update({ coupleId });
  return coupleId;
}
