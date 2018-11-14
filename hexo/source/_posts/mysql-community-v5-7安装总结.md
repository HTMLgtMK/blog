---
title: mysql-community-v5.7安装总结
date: 2018-10-27 19:01:59
tags: mysql5.7 安装
---

这两天在做移动网络技术的作业时, 需要用到MySQL, 因此就打算在自己的Deepin机器上装个MysSQL.
但是中间出现了许多问题, 在此记录以下.
环境: 4.15.0-29deepin-generic
MySQL版本: mysql  Ver 14.14 Distrib 5.7.21, for Linux (x86_64) using  EditLine wrapper

## 出现的问题

### 服务器拒绝连接 
<!-- more -->
1. 问题
首先使用命令`sudo apt-get  install mysql-server`安装了mysql-server, 整个过程没有出现问题.
使用命令`systemctl status mysql`查看mysql-server运行状态发现已经在运行中了, 行, 那开始连接数据库吧.
使用下面的命令连接:
```shell
mysql -h localhost -u root -p
```
结果如图:
![DeepinScreenshot_select-area_20181027191256.png](DeepinScreenshot_select-area_20181027191256.png)
`ERROR 1698 (28000): Access denied for user 'root'@'localhost'` 表示mysqld服务器拒绝本次连接.
根据经验, 这个情况一般是输入的密码错误, 但是刚安装的Mysql数据库的root密码是什么呢...查了资料后, 初次安装的root密码为空, 那表示我并没有输入错误啊,md...
我开始怀疑自己, 是不是之前什么时候安装过Mysql, 然后机器上还有上次未清理干净的文件在起着作用...
![9150e4e5ly1fsekqpgq1jj206o06odfs.jpg](9150e4e5ly1fsekqpgq1jj206o06odfs.jpg)
于是, 我决定使用大法修改root的密码, 步骤如下:
	1. 关闭mysql.service
	```shell
	sudo systemctl stop mysql.service
	```
	但是, 关了之后后面重启服务又出了问题, 后面再说.

	2. 加上参数skip-grant-table开启mysqld_safe
	```shell
	sudo mysqld_safe --skip-grant-table --skip-networking &
	```
	这里也可以直接修改`/etc/mysql/my.cnf`, 添加如下内容:
	```cnf
	[mysqld]
	skip-grant-table
	```
	然后再`systemctl start mysql`即可.


	3. 使用mysql clinet连接
	```shell
	mysql -h localhost -u root -p
	Enter password:
	```
	直接按enter键后就连接成功了.

	4. 修改root用户的密码
	用户表放在mysql.user中, 5.7版本中密码字段是`authentication_string`而不是`Password`.
	```SQL
	UPDATE user SET authentication_string=PASSWORD('new_password') WHERE User='root';
	flush privileges;
	```

	5. 退出然后去掉参数重新启动
	如果是使用命令行, 则直接找到进程号(`ps -aux | grep mysql`), `kill -9 pid`即可.
	如果是使用重启mysql服务的方式, 则直接`systemctl restart mysql`即可.
到这里, 我修改了root用户的密码, 那我使用刚修改的密码登录应该就是可以成功登录了.于是:
```shell
mysql -h localhost -u root -p
```
结果如图:
![DeepinScreenshot_select-area_20181027191256.png](DeepinScreenshot_select-area_20181027191256.png)
md...历史在重演...
![0ce9841846c24dd4bf80b7445eb18252.jpeg](0ce9841846c24dd4bf80b7445eb18252.jpeg)

难道是用上面的方法没有修改成功???=\_=, 于是又看到安装时的提示使用`mysqladmin`或者`mysql_secure_installation`设置密码.
然后又是一顿操作, 结果可想而知, 历史在重演...
![9150e4e5ly1ftsrdtznmgj206o06oglj.jpg](9150e4e5ly1ftsrdtznmgj206o06oglj.jpg)

2. 解决
在懵逼多时后, 终于google到相关答案了...原来, 这个和MySQL的安全策略有关, 在skip-grant-table参数下进入mysql可以看到如下内容:
![DeepinScreenshot_deepin-terminal_20181027204051.png](DeepinScreenshot_deepin-terminal_20181027204051.png)
注意到`plugin`项目下`root`和其他项不同, 难道是这个???
![DeepinScreenshot_select-area_20181027204810.png](DeepinScreenshot_select-area_20181027204810.png) 
还真的是, `auth_socket`不支持密码登录, 它只匹配与当前用户创建的`unix socket`然后比对用户名是否相同...
于是, `mysql.server`是使用`root`权限开启的, 而`mysql -h localhost -u root -p`是在当前用户`gt`下执行的, root != gt, 因此连接被拒绝.
那么, 使用`sudo mysql -h localhost -u root -p`应该可以连接, 尝试一下:
![DeepinScreenshot_deepin-terminal_20181027205334.png](DeepinScreenshot_deepin-terminal_20181027205334.png)
连接成功了!!!好激动!
![836c2261a7f147e88dc017598b04b219.jpeg](836c2261a7f147e88dc017598b04b219.jpeg)
但是, 如果是普通程序需要调用`mysql`, 那就麻烦了.
`mysql_native_password`是支持密码登录的(是否强密码策略未深究~), 理论上修改`root`用户`plugin`成`mysql_native_password`就可以了, 尝试:
```shell
UPDATE user SET plugin='mysql_native_password' WHERE User='root';
flush privileges;
```
退出, 去掉`sudo`运行果然可以!!!
当然, 我觉得这样的设计挺不错的, 完全可以新建一个用户, 并赋予部分权限.
```shell
CREATE USER 'user_name' IDENTIFIED WITH mysql_native_password BY 'my_password'; # 创建新用户
GRANT ALL PRIVILEGES ON db_name@* TO `user_name`@`host` IDENTIFIED BY `password`; # 赋予权限
flush privileges;
```
然而, 这里又双叒叕出问题了...`Error: plugin mysql_native_password are not loaded`, md, 什么情况...
最终查了资料没弄清楚, 不过问题倒是解决了...先把`root`用户`plugin`修改成`mysql_native_password`, 再退出登录, 在该模式下创建新用户成功, 
最后将`root`的`plugin`修改回去...
(存在的疑问: GRANT用户权限后, 在user表中出现了多个相同的用户, bug? 后来考虑是由于每个相同user的privileges不同, 每个不同privileges的user作为一行.)
<br/>
到这里, 这个问题终于算是结束了!

### 不能连接socket
1. 问题
当使用`mysql -h localhost -u gt -p`进行连接时, 出现如下问题:
![DeepinScreenshot_select-area_20181027211728.png](DeepinScreenshot_select-area_20181027211728.png)
>> ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)
(模拟还原的场景), 连接错误, 提示不能通过socket连接到本地MySQL server, 查了以下`/var/run/mysqld`也确实不存在`mysqld.sock`文件, 甚至连`mysqld`目录都不存在...
![9150e4e5ly1flmlwi1e27g206o06ojre.gif](9150e4e5ly1flmlwi1e27g206o06ojre.gif)

2. 解决
思考后, 发现可能是`mysql.server`服务并没有启动, 或者是什么时候宕掉了. `ps -aux | grep mysql`果然没有发现相关进程的运行.
所以, 重新开启`mysql.server`服务即可:`sudo systemctl start mysql`(如果可以的话:) )

### 使用二进制文件安装mysql
由于前面密码错误的原因, 考虑是不是这个版本的问题, 于是从官网上下载了最新的二进制tar.gz安装包安装.
这个下载的安装包是`mariadb`的, 反正差不多. 解压到`/usr/local`中, 重命名目录名为`mysql`(否则后面需要修改`mysql.server`, `my.cnf`内容).
创建新用户mysql:mysql, 修改`data`为目录所属人, 执行程序:
```shell
nohup /usr/local/mysql/bin/mysqld_safe --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data --user=mysql &
```
然后可以使用`mysql -h localhost -u root -p`连接, 至于结果, 很诡异, 能登录进去, 而且, 每次登录进去就会创建一个新用户...后来也没有弄清楚是什么情况就删掉了...
<br/>
下面是彻底删除`apt-get`安装的程序的总结:
1. 先使用`apt-get purge`删除
```shell
sudo apt-get purge mysql*
sudo apt-get purge mariadb*
```
`remove`只是卸载了程序, 但是配置等文件还在. `purge`可以同时删除配置文件等数据.
另外, 使用了通配符`*`, 我们安装的时候可能是`apt-get install mysql-server`, 但是同时会安装许多dependencies, 使用通配符可以搞定.
如果安装过mariadb, 两句都要执行试试.

2. 再使用`dpkg -S`查找是否还有其他什么文件
```shell
sudo dpkg -S mariadb*
sudo dpkg -S mysql*
```
这样可以查看哪些`dependencies`被安装, 而没有卸载. 使用`sudo dpkg -r package_name`单独卸载.

## 感想
现在的技术和思想真的是进步的飞快, 这次也是被密码错误狠狠的打了一个耳光.
要进步, 要不断的学习.
![2016671011584723.png](2016671011584723.png)