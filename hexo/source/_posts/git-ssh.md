---
title: GitHub ssh密钥问题
date: 2018-03-04 11:28:57
tags: git ssh github
author: GT
---
这里是笔记迁移，我自己搭建git服务器的时间已经过去了半年了，所以没有图示了。
环境：windows10, git bash

## Github 添加SSH密钥问题
这里主要演示如何用ssh关联Github。

### 创建ssh公钥和密钥

1. 创建ssh公钥和密钥
	在 git bash
	```bash
	ssh-keygen -t rsa -f /c/User/your_username/.ssh/id_rsa_ec  -C "username"
	```
	注:
	-t  表示加密类型 rsa
	-f  表示文件路径
	-C  注释，，，登陆时使用的用户名？(后面没有用到)

	**id_rsa_ec是私钥文件名**
	<!-- more -->

2. 添加到ssh-agent(ssh代理)
	```bash
	ssh-agent ssh-add ~/.ssh/id_rsa_ec
	```
	**非默认id-rsa文件需要将ssh添加到ssh-agent**

3. 在~/.ssh/下建立config文件，文件内容：
	```
		#user for myself github
		Host github_gt
		HostName github.com
		User git
		IdentityFile ~/.ssh/id_rsa

		#user for ecWeb_github
		Host github_ec
		HostName github.com
		User git
		IdentityFile ~/.ssh/id_rsa_ec
	```
	**注：可以只有1个，也可以有多个**
	**Host 表示别名，用于区分和确定当前 链接 的gitHub仓库**
	**IdentityFile 表示ssh私钥文件，会用它与之比对**

### ssh 方式 关联 github仓库
1. 将公钥添加到gitHub后台
	可以测试 ssh链接
	eg:
	```bash
	ssh -T git@github_ec
	```
	显示结果为：Hi 276073970! You've successfully authenticated, but GitHub does not provide shell access.
	其中，276073970 是 github仓库所有者的用户名

2. 初始化本地仓库
	```bash
	git init
	```

3. 关联本地仓库与远程仓库
	```bash
	git remote add origin git@github_ec:276073970/ecWeb.git
	```
	**其中的HOST就是用于git@HOST**
	注：
	关联本地仓库与远程仓库
	后面可以修改，在 ./.git/config文件
	修改:	url = git@github_ec:276073970/ecWeb.git

4. 提交文件
	```bash
	vim newfile
	git add newfile
	git commit -m "message" newfile
	git push -u origin master	#初次
	#git push 非第一次
	```
	**
	注:
	第一次push的时候可能需要先pull操作
	git pull origin master 
	指定remot分支 
	**
SSH方式密钥问题到这里就结束了。
***************************************************
附：

~/.ssh/config文件 

	#user for myself github

	Host github_gt

	HostName github.com

	User git

	IdentityFile ~/.ssh/id_rsa

	#user for ecWeb_github

	Host github_ec

	HostName github.com

	User git

	IdentityFile ~/.ssh/id_rsa_ec

	#user for github_aaa

	Host github_aaa

	HostName github.com

	User git

	IdentityFile ~/.ssh/id_rsa_aaa

./.git/config文件

[core]

	repositoryformatversion = 0

	filemode = false

	bare = false

	logallrefupdates = true

	symlinks = false

	ignorecase = true

	hideDotFiles = dotGitOnly

[remote "origin"]

	url = git@github_ec:276073970/ecWeb.git

	fetch = +refs/heads/*:refs/remotes/origin/*

[branch "master"]

	remote = origin

	merge = refs/heads/master