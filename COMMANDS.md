# 常用命令

## 开发

```bash
# 启动 Expo 开发服务器
npm start

# 指定平台启动
npm start -- --android
npm start -- --ios
```

## 依赖管理

```bash
# 安装依赖
npm install

# 安装 Expo 兼容版本的包（推荐用这个装 expo 生态的包）
npx expo install <package-name>
```

## EAS 构建

```bash
# Android APK（preview profile，生成可直接安装的 .apk）
eas build -p android --profile preview

# Android AAB（production profile，用于上架 Google Play）
eas build -p android --profile production

# iOS（需要 Apple 开发者账号）
eas build -p ios --profile production

# 查看构建历史
eas build:list
```

> 构建产物下载链接在命令执行完后输出，也可以在 https://expo.dev 控制台查看。

## EAS 配置

```bash
# 初始化 EAS（首次使用）
eas build:configure

# 登录 Expo 账号
eas login

# 查看当前登录状态
eas whoami
```

## 本地调试

```bash
# 清除 Metro 缓存重启
npm start -- --clear

# 重置所有缓存（遇到奇怪问题时用）
npx expo start --clear
```
