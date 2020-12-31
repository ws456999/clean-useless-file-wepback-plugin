# clean-useless-file-wepback-plugin

> find or delete useless files with webpack4 plugins

# Installation

```shell

npm install clean-useless-file-wepback-plugin

```

# config

```js

const UselessFile = require('clean-useless-file-wepback-plugin')

plugins: [
  new UselessFile({
    root: './src', // 项目目录
    out: './fileList.json', // 输出文件列表
    // clean?: false, // 是否删除文件,
    exclude: [
      /abc/g,
      'file-name'
    ] // 过滤文件，支持字符串匹配 或 正则匹配
  })
]


```
