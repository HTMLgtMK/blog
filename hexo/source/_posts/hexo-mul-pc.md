---
title: hexo博客在多个系统上同步
date: 2018-06-09 23:57:44
tags: hexo 同步
---

今天重新装了ubuntu系统，想要将windows中的hexo博客同步到ubuntu系统中，但是中间遇到了一些问题。
下面是同步的过程：

1. 将windows中hexo 博客源码上传到github，可以是hexo page中的一个分支。

2. 在ubuntu系统中，创建一个和 github page中名字相同的文件夹(blog)，进入该文件夹(blog)。

3. 使用git将hexo博客部分pull下来。
	```bash
	cd blog
	git init # 初始化本地仓库
	git remote add origin git@github.com:HTMLgtMK/blog.git # 添加远程仓库
	git fetch --all
	git reset --hard origin/hexo # 选择当前分支为hexo
	```
	
4. 遇到使用`hexo g`无法生成静态文件问题：
	<!-- more -->
	构建情况如图：
	![103170566_1.png](103170566_1.png)
	一些基本样式已经生成，但是post静态界面文件没有生成。
	**原因**: hexo 的一些插件尚未安装。
	1. 使用npm查看hexo插件的情况
	```bash
	npm ls --depth 0
	```
	![103170566_2.png](103170566_2.png)
	**解决**：逐一安装缺失的插件
	```bash
	npm install hexo-server --save
	npm install hexo-generator-index --save 
	...
	```
	安装完成后重新构建即可。
