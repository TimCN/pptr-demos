
1. CDP 远程 
```sh
chrome 
```
```sh
## remote-debuggin-port
chrome --remote-debugging-port=9222 --user-data-dir=/tmp --headless https://www.jd.com
chrome --remote-debugging-port=9222
```
```sh
# 无痕模式
chrome --incognito 
```
1. 打开chrome开发者工具的开发者工具: option+command+i => 脱离Chrome（非涵盖在chrome左右下）=> option+command+i
```js
let Main = await import('./main/main.js');
// 进入页面
await Main.MainImpl.sendOverProtocol("Page.navigate",{url:"https://www.jd.com/"});
```
```js
// 视口调整
await Main.MainImpl.sendOverProtocol('Emulation.setDeviceMetricsOverride', {
  mobile: true,
  width: 412,
  height: 732,
  deviceScaleFactor: 2.625,
});
```

```js
// 截图
await Main.MainImpl.sendOverProtocol("Page.captureScreenshot");
```

```js
// 截图
await Main.MainImpl.sendOverProtocol("Page.close");
```


具体请参考[Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
