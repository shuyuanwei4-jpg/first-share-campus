# 第一股

[打开手机版网页 App](https://shuyuanwei4-jpg.github.io/first-share-campus/)

给大学生的五天投资故事。先在食堂和校园摊位认识钱、预算和出价，再用虚拟资金练习 A 股交易。课程进度保存在当前浏览器。

在 iPhone 上用 Safari 打开，从分享菜单添加到主屏幕。在 Android 上用 Chrome 打开，从浏览器菜单安装应用或添加到主屏幕。首次联网加载后，故事和模拟盘可离线使用。

## 编辑和部署

`src/` 包含故事、界面和模拟盘源码。修改后在仓库根目录运行 `node src/build.cjs index.html`。GitHub Pages 从 `main` 分支根目录发布。更新离线资源时，同步更新 `sw.js` 的缓存版本。

## 字体、图标和设计参考

- 中文标题采用站酷快乐体的网页子集，按 [SIL Open Font License 1.1](assets/OFL-ZCOOL.txt) 分发。[字体项目](https://github.com/googlefonts/zcool-kuaile)
- 底部导航使用 [Lucide 图标](https://lucide.dev/)，许可证随项目分发。[许可证](assets/LICENSE-LUCIDE.txt)
- 手机导航参考 [Mobbin](https://mobbin.com/) 的常驻入口，触摸反馈参考 [Cuberto](https://cuberto.com/)，故事里的探索取自 [Bruno Simon](https://bruno-simon.com/) 给人的操作反馈思路。版式和配色延续用户的 [作品集](https://shuyuanwei4-jpg.github.io/wei-shuyuan-portfolio/#signals)。
