# 第一股

[打开手机版网页 App](https://shuyuanwei4-jpg.github.io/first-share-campus/)

给大学生的互动投资课程。先用五天校园故事认识钱、预算和出价，再分八课练习投资品种、选股、读图和买卖计划。学习进度保存在当前浏览器。[课程目录](https://shuyuanwei4-jpg.github.io/first-share-campus/#stories)

模拟盘带有可跳过和重看的新手引导。虚构个股用于练习报价与下单，上证指数历史样本用于练习读图。[模拟交易](https://shuyuanwei4-jpg.github.io/first-share-campus/#practice)

在 iPhone 上用 Safari 打开，从分享菜单添加到主屏幕。在 Android 上用 Chrome 打开，从浏览器菜单安装应用或添加到主屏幕。首次联网加载后，故事和模拟盘可离线使用。

## 编辑和部署

`src/` 包含故事、界面和模拟盘源码。修改后在仓库根目录运行 `node src/build.cjs index.html`。GitHub Pages 从 `main` 分支根目录发布。更新离线资源时，同步更新 `sw.js` 的缓存版本。

## 字体、图标和设计参考

- 英文展示字使用原有的 Bauhaus 93，中文优先使用苹方，其他设备可使用思源黑体（Noto Sans SC）或微软雅黑。标题和正文用 28、22、17、15、13 五档字号组织信息，字重以常规和半粗为主。[Apple 字体设计指南](https://developer.apple.com/design/human-interface-guidelines/typography)
- 底部导航使用 [Lucide 图标](https://lucide.dev/)，许可证随项目分发。[许可证](assets/LICENSE-LUCIDE.txt)
- 手机导航参考 [Mobbin](https://mobbin.com/) 的常驻入口，触摸反馈参考 [Cuberto](https://cuberto.com/)，故事里的探索取自 [Bruno Simon](https://bruno-simon.com/) 给人的操作反馈思路。版式和配色延续用户的 [作品集](https://shuyuanwei4-jpg.github.io/wei-shuyuan-portfolio/#signals)。
