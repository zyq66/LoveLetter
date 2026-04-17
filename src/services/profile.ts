// src/services/profile.ts
import { db, authReady } from '../config/cloudbase';

export interface Profile {
  // 基本信息
  birthday: number;       // timestamp，0 = 未设置
  bloodType: string;      // A / B / AB / O / ''
  mbti: string;           // INFJ 等 / ''
  height: string;         // '163' / ''

  // 饮食
  favFoods: string[];
  noFoods: string[];

  // 习惯 & 爱好
  habits: string[];
  hobbies: string[];

  // 生理期
  periodStart: number;    // 上次开始 timestamp，0 = 未设置
  periodCycle: number;    // 天数，默认 28

  // 备忘
  memo: string;
}

export const DEFAULT_PROFILE: Profile = {
  birthday: 0,
  bloodType: '',
  mbti: '',
  height: '',
  favFoods: [],
  noFoods: [],
  habits: [],
  hobbies: [],
  periodStart: 0,
  periodCycle: 28,
  memo: '',
};

export async function getProfile(userId: string): Promise<Profile> {
  await authReady;
  const res = await db.collection('profiles').where({ userId }).get();
  const doc = ((res.data as any[]) ?? [])[0];
  if (!doc) return { ...DEFAULT_PROFILE };
  const { _id, userId: _uid, coupleId: _cid, updatedAt: _u, ...fields } = doc;
  return { ...DEFAULT_PROFILE, ...fields };
}

export async function saveProfile(
  userId: string,
  coupleId: string,
  profile: Profile,
): Promise<void> {
  await authReady;
  const res = await db.collection('profiles').where({ userId }).get();
  const existing = ((res.data as any[]) ?? [])[0];
  const payload = { ...profile, userId, coupleId, updatedAt: Date.now() };
  if (existing) {
    await db.collection('profiles').doc(existing._id).update(payload);
  } else {
    await db.collection('profiles').add(payload);
  }
}
