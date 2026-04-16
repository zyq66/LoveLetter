// src/config/cloudinary.ts
// 在 https://cloudinary.com 注册免费账号后填入
export const CLOUDINARY_CLOUD_NAME = "REPLACE_ME";      // 你的 cloud name
export const CLOUDINARY_UPLOAD_PRESET = "REPLACE_ME";   // unsigned upload preset 名称

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
