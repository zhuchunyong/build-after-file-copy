# build-after-file-copy
webpack plugin. Copy the packaged file to the specified location
# BuildAfterFileCopy
## 下载
```sh
npm install build-after-file-copy
```
## 使用
```js
// webpack.config.js
const BuildAfterFileCopy = require("build-after-file-copy")

module.exports={
  plugins:[
    new BuildAfterFileCopy({
      from: "",
      to: "",
      filename: "",
      isMap: false,
    })
  ]
}
```
## options参数
* from: 打包后的文件目录，默认为打包的文件目录
* to: 文件复制的目的地，相对路径或绝对路径
* filename: 相对于from的路径，可以是数组
* isMap: 是否复制.map文件

例如：
```js
// webpack.config.js
const BuildAfterFileCopy = require("build-after-file-copy")

module.exports={
  plugins:[
    new BuildAfterFileCopy({
      //from: "",
      to: path.join(__dirname, "../abc"),
      filename: "./index.js",
      isMap: true,
    })
  ]
}
```
