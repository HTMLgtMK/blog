---
title: 自己搭建git server
date: 2018-03-04 20:20:44
tags: git server
---
## 在自己的云主机搭建git服务器
环境： 
local: Windows10, git bash
remote: centOS7

这里是笔记迁移，大约是在半年前搭建的git server,故没有图示。

### 一、服务器端创建git用户
1. 安装git
	```bash
	yum -y install git # centOS  
	apt-get install git #ubuntu
	```
2. 创建git用户并且赋予权限
	<!-- more -->
	```bash
	$ adduser git
	```
	会在/home目录下看到一个git用户目录
3. 给git用户分配一个密码
	```bash
	$ passwd git 123456(你的密码)
	```
	这个密码用在你后面提交代码的时候使用(然而并没有用到。。。)
	
### 二、本机创建ssh key
git-bash中创建一个新的 ssh key
参考[GitHub ssh密钥问题](https://htmlgtmk.github.io/blog/2018/03/04/git-ssh/)

### 三、服务器上将ssh public key 添加到服务器
4. cd /home/git/
	git表示用户git
5. mkdir .ssh
	没有该目录就创建
6. 进入`.ssh`目录
	```bash
	cd .ssh
	```
7. 新建文件`authorized_keys`
	```bash
	vim authorized_keys
	```
8. **将public key串填入**
	如果有多个，则换行追加
	保存退出
9. 新建文件夹testgit测试
	在其它目录，比如网站根目录,我的是 /usr/share/nginx/html/,新建文件夹testgit测试
	```bash
	$ cd /usr/share/nginx/html/
	$ mkdir testgit
	$ cd testgit
	```

### 五、服务器端创建仓库(repository)测试
10. 新建git仓库
	```bash
	git init --bare testgit.git
	```
	新建git仓库，一定要是空仓库，--bare参数不能省略

11. 修改testgit目录权限
	```bash
	$ cd ..
	$ chmod -R 777 testgit
	```
	修改testgit目录权限
	也可以使用chown...自由发挥吧
	如果不修改，那么push的时候会有写入错误
	
### 六、本机上使用仓库
12. 创建空仓库
	```bash
	git init
	```
	在一个空目录里面创建一个空仓库
13. 添加远程仓库
	```bash
	git remote add origin \
	git@211.159.184.137:/usr/share/nginx/html/testgit/testgit.git
	```
	**其中211.159.184.137是云服务器的ip，可以在C:\Users\your_username\.ssh\config里面配置**
	```
	#user for my cloud server
	Host git_cloud
	HostName 211.159.184.137
	User git
	IdentityFile ~/.ssh/id_cloude_server
	```
	这时可以用git_cloud替代211.159.184.137

14. 提交文件
	```bash
	git add *
	git commit -m "message" *
	git push -u origin master
	```
	提交文件,不出意外能成功

### 七、使服务器内容自动更新

15. 进入创建的仓库目录
	```bash
	cd /usr/share/nginx/html/testgit/
	```
	进入创建的仓库目录，这时用ls看不到任何效果，
	但是确实已经提交了，要解决这个问题需要用到自动同步功能。
16. 自动同步功能
	```bash
	cd testgit.git/hooks
	```
	自动同步功能用到的是 git 的钩子功能
	这里我们创建post-receive文件
17. 新建post-receive文件
	```bash
	vim post-receive
	```
	新建`post-receive`文件,填入:
	```bash
	#!/bin/bash
	git --work-tree=/usr/share/nginx/html/testgit checkout -f
	```
	其中/usr/share/nginx/html/testgit 是自定义的，我放在网站里面可以直接访问
18. 修改文件权限
	```bash
	chmod a+x post-receive
	```
	修改文件权限，该文件应该具有可执行权限
19. 再次push就可以在服务器/usr/share/nginx/html/testgit上看到提交的文件了

参考资料:
1. [http://www.tangshuang.net/1693.html](http://www.tangshuang.net/1693.html)
2. [http://blog.csdn.net/baidu_30000217/article/details/51327289](http://blog.csdn.net/baidu_30000217/article/details/51327289)