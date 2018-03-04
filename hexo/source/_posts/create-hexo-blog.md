---
title: Github Page + Hexo 建立个人Blog
date: 2018-03-03 20:19:07
tags: blog,hexo
author: GT
---
记录一下我的博客的创建过程。
主要步骤：
1. 安装hexo
1. 创建本地博客
1. 部署到github
注：github page支持的是静态网页。

<!-- more -->

参考：(建议先看)
1. [最简便的方法搭建Hexo-Github博客-基于Next主题](https://www.jianshu.com/p/5e9bd5e39ae6)

环境：win10

## 安装hexo
### hexo 简介
hexo 是一个快速、简洁且高效的博客框架。
* 需要node.js支持。
* 支持Markdown语法
### hexo 安装
* 安装[node.js](https://nodejs.org/en/)。 **已经安装好的可以跳过**
windows直接下载镜像安装即可。
测试安装成功：
```javascript
//create_server.js
var http=require('http');
http.createServer(function(req,res){
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.end("hello world!");
}).listen(8080,'127.0.0.1');
console.log("node.js server running at localhost:8080");
```
cmd运行
```cmd
node create_server.js # run the script
node.js server running at localhost:8080
```
在打开浏览器输入localhost:8080就可以看到hello world!输出。
其实，**安装node.js主要是后面要用到npm命令。**	
* 安装[hexo](https://hexo.io/)
windows下cmd运行:
```cmd
npm install hexo-cli -g # -g表示全局安装，否则只用于当前项目
```
到这里，hexo就安装完成了。

## 创建本地博客(local blog)
cmd运行 (提前进入选定要建立blog的目录)
```cmd
hexo init <folder> # 这里<folder>替换成你的Blog Project Name
cd <folder>
npm install
```
这个过程需要联网，会下载一些资源。命令执行结束后,<folder>目录下文件如下:
```
.
├── _config.yml 	# 站点的配置文件
├── package.json	# 依赖配置
├── scaffolds		# 模板文件夹
├── source			# 存放用户资源的地方。
|   ├── _drafts
|   └── _posts		# 存放文章。默认有一篇hello-world.md
└── themes			# 存放主题。默认为landscope，hexo会根据theme生成静态界面。
```
#### 运行hexo Server
cmd运行(在<folder>内)
```cmd
hexo s --debug # s是server的简写,debug可去掉
```
在浏览器输入:localhost:4000,看到界面
![QQ截图20180303211524.png](QQ截图20180303211524.png)

### 创建新文章(new post)
cmd下运行(<folder>下)
```cmd
hexo new "new-post-name"
```
new-post-name 替换成文章文件名，文件保存在_posts下，.md表示支持Markdown语法。
直接找到文件，用编辑器以文本方式打开编辑，保存。
运行hexo server,浏览器下查看最新blog。
**注：Markdown语法文件后缀为`<.md>`或者`<.markdown>`**
Markdown语法参考:[Mastering Markdown](https://guides.github.com/features/mastering-markdown/)

### 为Hexo Blog插入本地图片
参考：
1. [hexo生成博文插入图片](http://blog.csdn.net/sugar_rainbow/article/details/57415705)

* Markdown 插入图片语法为: 
```
![ImageHint](url) # 注意前面有个 `<感叹号 !>`
```
* 修改站点配置文件_config.yml
1. 修改 `post_asset_folder` 为 `true`
1. cmd运行(hexo blog folder)
```cmd
npm install hexo-asset-image --save
```
这是下载安装一个可以用来上传本地图片的插件。
1. `hexo new 'new-blog'`生成新`new-blog.md`时,会在`_posts`文件夹下生成一个new-post同名的文件夹new-post。
1. new-post.md中要插入的图片先放入new-post文件夹中,在new-post.md中输入:
```
![image-hint](imagename.extension)
```

## 部署到github
### 创建一个新repository
* 创建一个新repository,创建master分支
* 开启github page选项 
	Settings --> GitHub Pages --> Source --> master branch --> Save
![QQ截图20180303221901.png](QQ截图20180303221901.png)
![QQ截图20180303222000.png](QQ截图20180303222000.png)	
### 安装hexo deployer插件
cmd下运行(hexo blog folder)
```cmd
npm install hexo-deployer-git --save
```
### 修改站点配置文件_config.yml
修改站点名字(title)、描述信息(description)等。
```
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://yoursitedomain.com/
root: 
```
修改为:
```
url: http://your_github_username.github.io/your_repository_name
root: /your_repository_name/
```
** 注：这段必须修改，否则部署后会找不到样式资源。**
```
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: 
```
修改为:
```
deploy:
  type: git # use github
  repository: git@github_blog:HTMLgtMK/blog.git # use ssh or HTTPS
  branch: master # commit branch
  message: update	# default commit message
```
### 部署到github
cmd下运行(hexo blog folder)
```cmd
hexo d # d or deploy
```
### 浏览器查看结果
访问: [http://htmlgtmk.github.io/blog](http://htmlgtmk.github.io/blog)
http:your_github_username.github.io/your_repository_name

### 提交新Post
cmd下运行
```cmd
hexo new 'new-post'
hexo clean # clean hexo cache
hexo g # generate static web page
hexo d # deploy
```

** 建立个人Blog到这里就结束了  **

*******************************************
整理下建站过程所用命令
```cmd
#------------install hexo----------
node -v # 判断node.js是否安装成功
npm -v 
npm install hexo-cli -g # 安装hexo
#------------create local blog-----
hexo init <folder> # create hexo blog project
cd <folder>
npm install
hexo s # server , start hexo server
#------------upload image resource--
npm install hexo-asset-image --save # 安装image上传插件
#------------github deploy----------
npm install hexo-deployer-git --save # github deploy插件
hexo clean
hexo g # generate static web page
hexo d # deploy
```