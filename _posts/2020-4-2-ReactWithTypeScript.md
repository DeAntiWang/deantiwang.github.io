---
layout: post
title: '记录一次React+TypeScript的开发历程'
date: 2020-4-2 
description: "React, TypeScript, Webpack, Babel, Sass"
tag: 学习笔记
--- 

# 记录一次React+TypeScript的开发历程

> 之前一直使用Vue框架，这次打算学习一下React顺便学习一下TypeScript，于是就有了这个项目。在开发过程中遇到了一些问题，感觉这些坑或者说刚开始学不知道的要注意的点，是有必要记录下来的。

## 建立一个React + TypeScript + Sass + Webpack的项目

### 初始化项目

首先我们用```$ yarn init```初始化一个项目，这样我们就在项目根目录得到一个```package.json```文件，这个文件是项目配置文件，我们需要对他进行一些改动, 向其json中加入如下代码：  

```json
"scripts": {
	"dev": "npx webpack --config webpack.config.js"
}
```

上面的配置作用是：指定项目运行命令  

### 下载依赖

其次，我们把需要的包都下载下来：

```shell
$ yarn add react react-dom core-js regenerator-runtime
$ yarn add -D @babel/core @bable/preset-env @babel/preset-react @babel/preset-typescript
$ yarn add -D typescript
$ yarn add -D @types/react @types/react-dom
$ yarn add -D node-sass
$ yarn add -D webpack webpack-cli
$ yarn add -D babel-loader css-loader sass-loader source-map-loader style-loader ts-loader
```

这些包都是干什么的呢？  

- 第一行：下载React相关  
- 第二行：下载Babel相关  
- 第三行：下载TypeScript  
- 第四行：下载TypeScript相关。

> ***为什么要下载```@types/xxx```包？***  
> 你可能会遇到```Could not find a declaration file for module 'xxx'```的问题，这个问题是因为TypeScript还不认识相关包，要想让typescript认识他们，就要下载相应的```@types/xxx```包。  

- 第五行：下载SaSS  
- 第六行：下载Webpack  
- 第七行：下载Webpack所需要的loader。

> ***为什么要下载loader？***  
> 因为Webpack是由Node.js编写的项目打包工具，这就意味着它只能认识JavaScript文件，要想让他认识其他类型的文件，就要使用到这些loader包去加载、编译、解析。  

### 项目的相关配置

#### 配置Webpack

在项目根目录中新建一个```webpack.config.js```文件，内容如下：

```javascript
module.exports = {
  mode: "development",
  watch: true,	// 让webpack监听项目，项目更新后立即进行重新编译，实现开发过程中的即时更新
  entry: "./src/index.tsx",	// 项目入口
  output: {		// 编译打包后的项目输出
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devtool: "source-map",
  module: {
    rules: [	// 配置解析规则，为被正则匹配到的文件指定不同的loader
      { test: /\.scss$/, use: [ "style-loader", "css-loader", "sass-loader" ] },	// loader链，从右至左解析输出文件
      { test: /\.tsx?$/, loader: "babel-loader" },
      { test: /\.tsx?$/, loader: "ts-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  }
};
```

> ***Webpack相关知识***  
> Webpack从项目入口开始检索依赖，将所有依赖性经过loader、编译之后，打包输出至出口文件  

#### 配置Babel

在项目根目录中新建一个```.babelrc```文件，内容如下：

```json
{
  "presets": [
    "@babel/react",
    "@babel/typescript",
    [
      "@babel/env",
      {
        "modules": false,
        "targets": {
          "chrome": "58",
          "ie": "11"
        }
      }
    ]
  ],
}
```

> ***为什么要用Babel？***  
> Babel可以帮我们把typescript文件编译成javascript文件，并且能够实现对某些浏览器的兼容编译，即编译成置顶环境支持的语法，可以理解为一个polyfill机。  

#### 配置TypeScript

在项目根目录中新建一个```tsconfig.json```文件，内容如下：

```json
{
  "compilerOptions": {
    "outDir": "dist/",
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es2015",
    "jsx": "react"
  },
  "include": [
    "./src/**/*"
  ]
}
```

### 开始开发

在配置完项目之后，我们的项目结构应该是这样的

```
.
├── .babelrc
├── node_modules
|    └─ ...
├── package.json
├── tsconfig.json
├── webpack.config.js
└── yarn.lock
```
> ***什么是yarn.lock文件？***  
> yarn.lock文件中储存着你这个项目所需要用到的包的信息。这样别人想运行你的项目时，就不需要一个一个下载你项目中所用到的依赖，只需要运行一下```yarn install```就可以下载下来全部依赖，你就也不需要将巨大的node_modules文件上传至git仓库了。同理```package-lock.json```也是相同的作用，不过只是它是npm的依赖文件。  

首先我们需要一个```public/index.html```的入口文件，其内容如下：  

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>React Project</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <!-- bundle.js即在webpack中配置的编译出口文件 -->
  <script src="../dist/bundle.js"></script>
</body>
</html>
```

其次是```src/index.tsx```文件，即webpack中配置的项目入口文件，内容如下：

```typescript
import * as React from 'react';
import * as ReactDom from 'react-dom';

ReactDom.render(
	<div>Hello World!</div>,
	document.getElementById('root')
);
```

而开发过程中的scss代码均保存为.scss文件，webpack就可以自动将其编译输出为css文件。  

### 项目运行

还记得之前在```package.json```中配置的运行命令，现在我们在项目根目录下运行：  

```shell
$ yarn run dev
```

就可以让webpack监听项目目录，这样当文件发生变动时，webpack就可以自动将文件编译、打包、输出到```./dist```文件夹下。  
这时我们打开```public/index.html```即可成功运行看到```Hello World!```字样，项目就运行成功了。  

## 在项目中使用其他库

### React-router

下载依赖：  

```shell
yarn add react-router react-router-dom
yarn add -D @types/react-router @types/react-router-dom
```

```index.tsx```代码：

```typescript
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import Components
import MenuBar from "./components/MenuBar";
// import Pages
import Article from "./pages/Article";
import About from "./pages/About";
import ArticleList from "./pages/ArticleList";

ReactDom.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={MenuBar}/>
      <Route path="article" component={ArticleList}>
        <Route path=":id" component={Article} />
      </Route>
      <Route path="about" component={About} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
```

## 项目开发中遇到的坑

### *ReferenceError: regeneratorRuntime is not defined*

这是当你使用了```async/await```之后Babel产生的错误，解决这个错误只需要安装一个包，并且增加一些```.babelrc```配置就可以了。  

```bash
$ yarn add -D @babel/plugin-transform-runtime
```

在```.babelrc```文件中添加如下配置:  

```json
"plugins": [
	"@babel/plugin-transform-runtime"
]
```

### *Module parse failed: Unexpected character '@'*

没有添加css-loader/url-loader。  
下载loader:  

```bash
$ yarn add -D url-loader file-loader
```

在```webpack.config.js```中添加配置:  

```json
{ test: /\.css$/, use: [ "style-loader", "css-loader"] },
{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
```

另外，如果你在使用Next.js，注意要下载```@zeit/next-css```  

```bash
$ yarn add @zeit/next-css
```

并在```next.config.js```中添加配置:  

```javascript
const withCss = require('@zeit/next-css');

module.exports = withCss({
  webpack: function (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    });
    return config;
  }
});
```

如果有多个```withXxx```记得嵌套而不是并列：  

```javascript
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = withSass(withCss({
  webpack: function (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    });
    return config;
  }
}));
```

### React Input 输入中文的问题

问题描述: 在Uncontrolled Component下的onInput/onChange事件无法键入中文  
参考文章: [Controlled and uncontrolled component design pattern in React](https://itnext.io/controlled-and-uncontrolled-component-design-pattern-in-react-21e8d40e46e)  
解决方案:  

1. 使用CompositionEvent。在onCompositionStart/onCompositionUpdate的时候开启锁，onCompositionEnd的时候关闭锁，并在onChange的handler中判断:只有在锁关闭的时候更改Value。参考文章: [中文输入法与React文本输入框的问题与解决方案](https://segmentfault.com/a/1190000008023476)  

	> Chrome 53以后的版本中，onChange事件被调整到了onCompositionEnd之后执行，那么就需要在onCompositionEnd中对Chrome浏览器进行特判，并执行onChangeHandler中的逻辑.

2. 将Uncontrolled Component替换为Controlled Component。这个方法最简单粗暴，也是最有效的。
