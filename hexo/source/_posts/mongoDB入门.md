---
title: mongoDB入门
date: 2018-07-04 09:37:59
tags: mongoDB 入门
---

## 概述

1. 开源 免费 技术支持

2. 使用案例：
	国外：ebay sourceforge github 
	国内：淘宝 京东 百度 360 大众点评
	
3. mongoDB中的概念
	1. mongoDB
	2. mongo
	3. 索引(index)
	4. 集合(Set)
	5. 复制集
	6. 分片(Slice)
	7. 数据均衡

<!-- more -->
	
4. mongoDB的搭建
	部署数据库服务
	1. 搭建简单的单机服务
	2. 搭建具有冗余容错功能的复制集
	3. 搭建大规模数据集群
	4. 完成集群的自动部署
	
5. mongoDB的使用
	1. 最基本的文档的读写更新删除
	2. 各种不同类型索引的创建与使用
	3. 复杂的聚合查询
	4. 对数据集合进行分片，在不同分片中维持数据均衡
	5. 数据备份与恢复
	6. 数据迁移
	
6. 简单运维
	1. 部署mongoDB集群
	2. 处理多种常见的故障
		1. 单节点失效，如何恢复工作
		2. 数据库意外被杀死，如何进行数据恢复
		3. 数据库拒绝服务，如何排查原因
		4. 数据库磁盘快满时如何处理

7. 网站
	1. 官网：[www.mongodb.org](www.mongodb.org)
		编译文件, 英文文档
	2. 国内官网：[www.mongoing.com](www.mongoing.com)
		中文翻译文档(不全)
	3. github: [github.com/mongodb](github.com/mongodb)
		mongoDB源码, mongoDB驱动

8. 数据库分类
	1. Sql数据库：支出Sql语言的数据库
		Oracle, Mysql
		有表，有事务支持
	2. NoSql数据库(Not Only SQL)：不支持Sql语言的数据库
		redis, mongoDB
	3. 比较
		|------------|-------------|
		| Sql数据库  | NoSql数据库 |
		|------------|-------------|
		| 实时一致性 |  简单便捷   |
		| 事务       |   方便扩展  |
		|多表联合查询| 更好的性能  |
		|------------|-------------|
		redis支持事务，mongoDb不支持事务。
		
## MongoDB的安装与部署
1. 从官网下载二进制文件或者下载源码自己编译

2. 源码说明
	![QQ截图20180704101612.png](QQ截图20180704101612.png)
	1. `mongod` 数据库的服务程序
	2. `mongo` 数据库的客户端
	3. `mongimport` 导入
		`mongexport` 导出
	4. `mongodump` 导出二进制
		`mongorestore` 导入二进制,一般用于作数据库的备份与恢复
	5. `mongooplog` 操作日志
	6. `mongostat` 数据库状态

3. 搭建简单的mongoDB服务器
	1. 创建数据库目录
		|-- mongodb_simple  数据库目录
		|  |-- data 		数据目录
		|  |-- log			日志目录
		|  |-- conf			配置目录
		|  |-- bin			数据库的二进制文件
		
	2. 将`mongod`拷贝到`./bin`目录
	3. 创建启动文件`./conf/mongod.conf`
	```conf
	port = 12345 	; 监听端口
	dbpath = data 	; 数据库数据目录, 可以是相对路径或绝对路径
	logpath = log/mongod.log ; 日志文件
	fork = true		; 启动后台进程
	```
	windows下的镜像自带有配置文件，位置为：`.\bin\mongod.cfg`
	默认监听端口为：`27017`, 并且`dbpath`和`logpath`需要写绝对路径。
		
	4. 启动mongod
	```shell
	$ ./bin/mongod -f conf/mongod.conf
	```
	-f 指定启动文件
	![QQ截图20180704103030.png](QQ截图20180704103030.png)
	
	或为保证数据库的安全性，使用下面的方式：
	```shell
	numactl --interleave=all bin/mongod -f conf/mongod.conf
	```
	5. windows下MongoDB配置服务
	1) 配置服务
	```cmd
	# 管理员权限的控制台
	mongod --config "D:\MongoDB\Server\4.0\conf\mongod.conf" --install --serverName "MongoDB"
	```
	2) 启动服务
	```cmd
	net start MongoDB
	```
	3) 停止服务
	```cmd
	net stop MongDB
	```
	4) 删除服务
	```cmd
	sc delete MongoDB
	```
	可以将`bin`目录添加到环境变量，这样不需要每次使用都进入mongoDB的安装目录。
	
4. 连接mongoDB服务器
	1. 方式1：使用`mongo`程序在shell控制台连接
	2. 方式2：在程序中使用mongodb驱动连接
	这里先描述方式1:
	1. 将`mongo`二进制文件拷贝到`./bin`目录
	2. 连接mongod
	```shell
	$ ./bin/mongo [options] [db address] [file names(ending in .js]
	```
	eg:
	```shell
	$ ./bin/mongo 127.0.0.1:12345/dbname -u user -p
	 password
	```
## mongoDB的基本使用

1. 查看所有数据库
	```shell
	show dbs
	```
2. 选择使用数据库
	```shell
	use dbname
	```
3. 删除数据库
	```shell
	db.dropDatabase()
	```
	在mongoDB中不需要手动创建数据库，
	会在需要的时候自动创建。

4. 插入数据
	db.dbname_collection.insert(JSON)
	eg:
	```shell
	db.imooc_collection.insert({x:1})
	```
	imooc_collection是一个数据集。
	
5. 查询数据
	db.dbname_collection.find([JSON])
	db.dbname_collection.findOne() 查询一条数据
	eg:
	```shell
	db.imooc_collection.find() # 查询所有数据
	db.imooc_collection.find({x:1}) # 查询x为1的是数据
	```
	mongoDB中默认主键为`_id`.
	`find()`支持`skip`(跳过多条数据), `limit`(限制数据条数),
	`sort`(数据排序)。
	```shell
	for(i=3; i<100; i++) db.imooc_collection.insert({x:i})
	```
	mongoDB可以支持JS语法插入数据。
	```shell
	db.imooc_collection.find().count()
	```
	对查询结果进行计数。
	```shell
	db.imooc_collection.find().skip(3).limit(2).sort({x:1})
	```

6. 数据更新
	db.dbname_collection.update(condition_JSON, data_JSON, insert_boolean, all_boolean)
	
	```shell
	db.imooc_collection.update({x:1}, {x:999})
	```
	更新全部x=1的数据为x=999
	
	案例1：
	```shell
	db.imooc_collection.insert({x:100, y:100, z:100})
	db.imooc_collection.update({z:100}, {y:99})
	```
	这种情况下更新的数据是：所有z=100的数据更新为y=99,
	而x,z的数据会被覆盖。
	
	如何更新一行中的某个元素？在update中使用`set`操作。
	```shell
	db.imooc_collection.insert({x:100, y:100, z:100})
	db.imooc_collection.update({z:100}, {$set:{y:99}})
	```
	![QQ截图20180704154503.png](QQ截图20180704154503.png)
	
	需求：如果更新一条数据时，数据不存在，则插入数据
	方法：设置update()的第三个参数为true.
	```shell
	db.imooc_collection.update({y:100}, {y:999}, true)
	```
	![QQ截图20180704154944.png](QQ截图20180704154944.png)
	
	mongoDB中默认更新第一条匹配的数据, 这样设计是为了防止误操作。
	![QQ截图20180704160303.png](QQ截图20180704160303.png)
	
	如何更新所有匹配的数据？使用`set`操作符，update第四个参数设置为true.
	```shell
	db.imooc_collection.update({c:1}, {$set: {c:2}}, false, true)
	```
	![QQ截图20180704160719.png](QQ截图20180704160719.png)
	
7. 数据删除
	db.dbname_collection.remove(JSON)
	与find()不同的是，remove为防止误操作，必须传入参数。
	与update()不同的是，remove默认删除所有匹配的数据。
	```shell
	db.imooc_collection.remove({c:2})
	```
	![QQ截图20180704161036.png](QQ截图20180704161036.png)
	
	对于某张表(数据集)使用删除操作，可以使用:
	db.dbname_collection.drop()
	```shell
	db.imooc_collection.drop()
	show tables
	```
	![QQ截图20180704161310.png](QQ截图20180704161310.png)
	
8. 创建索引
	查看集合的索引情况：db.dbname_collection.getIndexes()
	```shell
	db.imooc_collection.getIndexes()
	```
	![QQ截图20180704162226.png](QQ截图20180704162226.png)
	
	创建索引：
	db.dbname_collection.ensureIndex(JSON)
	```shell
	db.imooc_collection.ensureIndex({x:1})
	```
	1表示正序，-1代表负向排序。
	
## mongoDB常见的查询索引

db.collection.ensureIndex({param1},{param2})
param1: 索引的值。
param2: 索引的属性。

1. 索引的种类与使用
	1. _id索引
		_id是绝大多数集合默认建立的索引。
		对于每个插入的数据，mongoDb都会自动生成一条唯一的_id字段。
		
	2. 单键索引
		最普通的索引，并不会自动创建。
		使用`ensureIndex()`创建。
	
	3. 多键索引
		与单键索引创建形式相同，区别在于字段的值。
		单键索引：值为一个单一的值，例如字符串，数字或者日期。
		多键索引：值具有多个记录，例如数组。
		eg:
		```shell
		db.imooc_collection.insert({x:[1,2,3,4,5]})
		```
		x即为多键索引。
		
	4. 复合索引
		当查询条件不只有一个时，就需要创建复合索引。
		逻辑：插入{x:1,y:2,z:3}记录->按照x与y的值查询
			->创建索引：db.collection.ensureIndex({x:1, y:1})
			->使用{x:1, y:1}作为条件进行查询。
		```shell
		db.imooc_collection.ensureIndex({x:1, y:1})
		db.imooc_collection.find({x:1, y:2})
		```
	5. 过期索引
		是在一段时间后会过期的索引。
		在索引过期后，相应的数据会被删除。
		这适合存储一些在一段时间之后会失效的数据，
		比如用户的登陆信息，存储的日志。
		建立方法:db.collection.ensureIndex({time:1},{expireAfterSecond:10})
		`time`是键值，`expireAfterSecond`表示秒数。
		```shell
		db.imooc_collection.ensureIndex({time:1}, {expireAfterSecond:30})
		db.imooc_collection.insert({time: new Date()})
		db.imooc_collection.find()
		```
		过期索引的限制：
		1. 存储在过期索引字段的值必须是指定的事件类型。
			必须是ISODate或者ISODate数组，不能使用时间戳，否则不能自动删除。
		2. 如果指定了ISODate数组，则按照最小的时间进行删除。
		3. 过期索引不能是复合索引。
		4. 删除时间是不精确的。删除进程在后台每60s跑一次。
		
	6. 全文索引
		对字符串和字符数组创建全文可搜索的索引。
		适用情况：{author:"", title:"", article:""}
		创建方法：
		1. db.articles.ensureIndex({key:"text"})
		2. db.articles.ensureIndex({key_1:"text", key_2:"text"})
		3. db.articles.ensureIndex({"$**":"text"})
		```shell
		db.imooc_collection.ensureIndex({"article":"text"})
		```
		使用全文索引查询：
		db.article.find({$text: {$search:"coffe"}})
		db.article.find({$text: {$search:"aa bb cc"}} 使用空格分隔多个关键词（`或`查找）。
		db.article.find({$text: {$search:"aa bb -cc"}} 不包含cc
		db.article.find({$text: {$search:"\"aa\" \"bb\" \"cc\""}}  `与`查找
		```shell
		db.imooc_collection.insert({"article":"aa bb cc dd ee"})
		db.imooc_collection.insert({"article":"aa bb rr gg"})
		db.imooc_collection.insert({"article":"aa bb cc hh gg"})
		db.imooc_collection.find({$text: {$sarch:"aa"}})
		db.imooc_collection.find({$text: {$sarch:"aa rr"}})
		db.imooc_collection.find({$text: {$sarch:"\"aa\" \"rr\""}})
		```
		全文索引的相似度查询：
		`$meta`操作符: {score: {$meta:"textScore"}}
		写在查询条件后面可以返回查询结果的相似度。
		与`sort`一起使用，可以达到很好的实用效果。
		```shell
		db.imooc_collection.find({$text: {$search:"aa bb"}})
		db.imooc_collection.find({$text: {$search:"aa bb"}}, {score: {$meta: "textScore"}})
		db.imooc_collection.find({$text: {$search:"aa bb"}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"})
		```
		全文索引使用限制：
		1. 每次查询，只能指定一个$text查询
		2. $text拆线呢不能出现在$nor查询中
		3. 查询中如果包含了$text, hint不再起作用
		4. MongoDB的全文索引还不支持中文
		
	7. 地理位置索引
		概念：将一些点的位置存储在mongoDB中，创建索引后，
		可以按照位置来查找其他点。
		
		子分类：1) 2D索引，用于存储和查找平面上的点。
		2) 2DSphere索引，用于存储和查找球面上的点。
		
		查找方式：
		1) 查找距离某个点一定距离内的点。
		2) 查找包含在某个区域内的点。
		
		1. 2D索引
		db.collection.ensureIndex({w:"2d"})
		`w`是字段名, `2d`固定。
		```shell
		db.location.ensureIndex({"w":"2d"})
		```
		位置表示方式：经纬度[经度, 纬度]
		取值范围：经度[-180, 180] 纬度[-90, 90]
		```shell
		db.location.insert({w:[1,1]})
		db.location.insert({w:[1,2]})
		db.location.insert({w:[3,1]})
		db.location.insert({w:[100,80]})
		db.location.insert({w:[180,80]})
		```
		查询方式：
		1) `$near`查询：查询距离某个点最近的点。
		2) `$geoWithin`查询：查询某个形状内的点。
		
		`$near`查询：
		```shell
		db.location.find({w:{$near:[1,1]}})
		```
		$near默认会返回100个距离[1,1]的点，
		可以使用`$maxDistance`设置扫描半径。
		```shell
		db.location.find({w:{$near:[1,1], $maxDistance:10}})
		```
		同理也有`$minDistance`选项，但是2D索引中不支持这个。
		
		形状的表示：
		1) `$box`:矩形，使用`{$box:[[<x1>,<y1>],[<x2,<y2>>]]}`表示。
		使用两个坐标表示，第一个是左上角坐标，第二个是右下角坐标。
		
		2) `$center`:圆形，使用`{$center:[[<x1>,<y1>], r]}`表示。
		使用圆心和半径表示，第一个参数是圆心坐标，第二个参数是半径长度。
		
		3) `$polygon`:多边形，使用`{$polygon:[[<x1>,<y1>],[<x2>,<y2>],[<x3>,<y3>]]}`表示。
		参数为一个数组，数组内是点的坐标，组成一个多边形。

		`$geoWithin`查询：
		```shell
		db.location.find({w:{$geoWithin:{$box:[[0,0],[3,3]]}}})
		db.location.find({w:{$geoWithin:{$box:[[1,1],[2,3]]}}})
		db.location.find({w:{$geoWithin:{$center:[[0,0], 4]}})
		db.location.find({w:{$geoWithin:{$polygon:[[0,0], [1,1], [0,2], [2,2]]}}})
		```
		使用`geoNear查询`：
		geoNear使用`runCommand`命令进行使用，常用使用如下：
		```shell
		db.runCommand({
			geoNear:<collection>,
			near:[x,y],
			minDistance:(对2d索引无效),
			maxDistance: ,
			num: ,
			...
		 })
		```
		eg:
		```shell
		db.runCommand({geoNear:"location", near:[1,2], maxDistance:10, num:2})
		```
		2. 2DSphere索引
		db.collection.ensureIndex({w:"2dsphere"})
		位置表示方式：
		GeoJSON：描述一个点，一条直线，多边形等形状。
		格式：
		{type: "", coordinates:[<coordinates>]}
		支持$minDistance与$maxDisctance
		
2. 索引属性
	重要的索引属性：名字，唯一性，稀疏性，是否定时删除
	
	1. 名称(`name`)属性
	```shell
	db.imooc_collection.ensureIndex({x:1})
	db.imooc_collection.ensureIndex({y:-1}) # 排序方向为负
	db.imooc_collection.getIndexes()
	```
	创建了索引x，使用getIndexes()获取索引，查看索引名称为：
	`"name":"x_1"` `"name":"y_-1`
	=> 索引的命名方式是`key_1`或者`key_-1`
	
	```shell
	db.imooc_collection.ensureIndex({x:1, y:-1})
	db.imooc_collection.getIndexes()
	```
	创建复合索引，获取复合索引名称为：`x_1_y_-1`
	=>索引的命名方式是：多个键之间使用`_`连接。
	mongoDB的索引最大长度是125，为此，key太多的情况下索引名称会很长。
	可以在创建索引的时候指定索引的名称：
	```shell
	db.imooc_collection.ensureIndex({x:1,y:1,z:1,m:1},{name:"normal_index"})
	db.imooc_collection.getIndexes()
	```
	查看索引名称为：`"name":"normal_index"`
	
	在删除索引时，也可以使用指定的名称删除:
	```shell
	db.imooc_collection.dropIndex("normal_index")
	```
	2. 唯一性(`unique`)属性
	db.collection.ensureIndex({},{unique:true/false})
	作用：如果为唯一索引，则在集合中不允许出现两个相同的记录。
	```shell
	db.imooc_collection.ensureIndex({m:1, n:1}, {unique:true})
	db.imooc_collection.insert({m:1, n:2})
	db.imooc_collection.insert({m:1, n:2}) # 报错: duplicate key
	```
	3. 稀疏性(`sparse`)和`expireAfterSeconds`指定
	db.collection.ensureIndex({}, {sparse:true/false})
	作用：默认创建的是非稀疏的，true/false表示了mongoDB处理数据时3的两种不同方法。。
	mongoDB在插入一条新记录时，如果某个字段原来不存在，
	mongoDB默认会新建该字段；如果不希望这种情况发生，则设置稀疏性为true.
	```shell
	db.imooc_collection.insert({"m":1})
	db.imooc_collection.insert({"n":1})
	db.imooc_collection.find({m:{$exists:true}})
	db.imooc_collection.find({m:{$exists:false}})
	```
	`$exists`操作符可以获取存在该字段的记录。
	```shell
	db.imooc_collection.ensureIndex({m:1},{sparse:true})
	db.imooc_collection.find({m:{$exists:false}}).hint("m_1")
	```
	创建m的稀疏索引, `hint`表示强制使用索引。
	4. 过期属性
	`expireAfterSecond`指定. TTL，过期索引。

3. 索引的匹配规则

4. 如何建立合适的索引

5. 索引建立的情况评估
索引好处：加快索引相关的查询。
索引坏处：增加磁盘空间消耗，降低写入性能。
	
	1. `mongostat`工具
	使用：``mongostat -h 127.0.0.1:27017``
	2. `profile`集合介绍
	
	3. 日志介绍
	
	4. `explain`分析
	db.collection.find().explain()

## mongoDB安全

1. mongoDB安全楔子
	1. 最安全的是物理隔离：不现实
	2. 网络隔离其次
	3. 防火墙再其次
	4. 用户名密码在最后
	
2. 开启权限认证
	1. auth开启
	在`mongod.conf`中附加：
	```auth = true```
	需要重启mongod服务。
	再在mongoDB中创建用户:
	1) 创建语法：`createUser`(2.6之前为addUser)
	```shell
	{
	user: "<name>",
	pwd: "<cleartext password>",
	customData: {<any information>},
	roles: [{role: "role", db: "<database>"}]
	}
	```
	角色类型：内建类型(read, readWrite, dbAdmin, dbOwner, userAdmin)
	eg:
	```shell
	db.createUser({user:"imooc", pwd:"imooc", customData:"示例",roles:[{role:"userAdmin", db:"admin"},{role:"read",db:"test"}]})
	```
	登陆：
	```shell
	$ mongod 127.0.0.1:27017/imooc -u imooc -p imooc
	```
	角色详解：
	1) 数据库角色：read, readWrite, dbAdmin, dbOwner, userAdmin
	2) 集群角色：clusterAdmin, clusterManager...
	3) 备份角色：backup, restore...
	4) 其它特殊权限：DBAdminAnyDatabase...
	mongoDB中创建用户角色：
	![QQ截图20180705164533.png](QQ截图20180705164533.png)
