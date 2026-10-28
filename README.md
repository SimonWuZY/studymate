# 小芽学习 · Study App Demo

根据 `PLAN.md` 实现的 P0 交互 demo，面向小学/初中学习者，用任务、错题与正向奖励形成学习闭环。

## 已实现

- **今日任务**：查看学习进度、连续打卡天数，完成任务后获得成长值。
- **错题本**：按科目和掌握状态筛选，通过相册或相机上传题目，标记掌握后获得成长值。
- **奖励兑换**：使用成长值兑换家庭奖励，查看积分流水。
- **本地持久化**：数据保存在设备上，刷新或重启后仍然保留；奖励页支持重置演示数据。
- **多端预览**：支持 iOS、Android 和 Web。

当前版本是可交互的前端 demo，不包含登录、Supabase 同步、远程通知和 OCR。示例数据仅用于体验，奖励记录不会发送给其他人。

## 技术栈

Expo · React Native · Expo Router · TypeScript · Zustand · AsyncStorage · Expo Image Picker

## 本地运行

推荐使用 Node.js 22 LTS。

```bash
npm install
npx expo start
```

启动后按 `i` 打开 iOS 模拟器、按 `a` 打开 Android 模拟器，或使用 Expo Go 扫码。也可以直接运行：

```bash
npm run ios
npm run android
npm run web
```

## 常用检查

```bash
npx tsc --noEmit
npm run lint
npx expo export --platform web
```

## 推送到 GitHub

仓库已完成本地初始提交。创建一个新的空 GitHub 仓库后，将下面的地址替换成你的仓库地址：

```bash
git remote add origin git@github.com:你的用户名/study-app.git
git branch -M main
git push -u origin main
```

## 后续接入

`.env.example` 已预留 Supabase 公共配置项。接入时复制为 `.env` 并填写；`.env` 已被 Git 忽略，不要提交真实密钥。详细产品与技术规划见 `PLAN.md`。
