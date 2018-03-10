---
title: php基础1
date: 2018-03-09 19:58:36
tags: php basic
author: GT
---

> php (Hypertext Preprocessor), 超文本预处理器，是一种通用的开源脚本语言。
> 入门简单，使用广泛，主要用于Web开发。

## php的安装
用于搭建Web网站，需要服务器，数据库，后台脚本还有网页前端。
这里服务器windows下选用Apache，CentOS7以及Ubuntu下使用Nginx。
数据库使用MySQL5。
1. Windows下环境搭建
	1.1 使用Wamp或者XMP套件。简单快速，适合新手，不需要配置太多。
	1.2 自己下载Apache，MySQL以及php，并配置。
2. Linux下环境搭建
	CentOS7和Ubuntu 都是直接使用源安装更加方便。当然后面需要自己配置。
3. 测试是否搭建成功
	在网站根目录下新建php文件(phpinfo.php)：
	```
	<?php
	phpinfo();//输出配置信息
	?>
	```
	打开浏览器，localhost/phpinfo.php,就能看见输出的配置信息。
	<!-- more -->
4. php编辑器
使用eclipse 做为php和html的编辑器，需要下载插件
几个有用的插件：
	4.1 emment  提示代码
	4.2 Zen Coding 提示代码
	4.3 Php development tools 即，PDT，php的语言环境，否则嵌套html时报错
	4.4 或者不用PDT，而是下载phpEclipse插件
	这时，注意editor的选择,php文件使用php_editor或php_source_editor;
	html文件使用 php_source_editor。同时，可以安装aptana，方便创建模板。
	4.5 eclipse对html的语法检查很严格，导致在html文件中插入php时也会报错。
	解决方法：
	在eclipse->windows->validation->html 取消检查html语法
	4.6 html文档中不能解析php代码的问题
	在apache的配置文件httpd.conf加入:
	```
	AddHandler php5-script .php .html
	AddType text/html .php .html
	```
	然后重启apache.
	
## php基本语法

1. 变量
	声明： $美元符号
	php是弱类型语言，不需要向PHP声明该变量的数据类型。
	php会根据变量的值，自动判断变量数据类型。
	```php
	<?php
		$num=10;//数值型
		$str="hello world!";//字符串类型
	?>
	```
2. 字符串类型
	字符串单引号表示：可以输出包含变量的字符串，变量用变量值替换。
	字符串双引号表示：表示普通字符串，里面有变量时也是直接输出。并且没有字符串的转义。。。
	**注：输出引号时要使用\表示转义。**
	换行：\n

	字符串的拼接：用`.`拼接；
	```php
	$a="hello =";
	$b=" world";
	$c=$a.$b;
	```
	如果只是输出，那么也可以直接用`,`隔开
	``echo=$a,&b;``
3. 数组
	3.1 定义：
	在php中，有三种数组类型：
	3.1.1 索引数组--带有数字索引的数组
	创建索引数组,索引是自动分配的：
	``$cars=array("Volvo","BMW","SAAB");``
	或是手动分配：
	``$cars[2]="BMW";``
	3.1.2 关联数组-带有指定键的数组
	```php
	$arr=array("key1"=>"BWM","key2"=>"Benz");
	$arr['key3']="GEELY";
	```
	3.1.3 多维数组-包含一个或多个数组的数组
	```php
	$arr=array("key1"=>"BWM","key2"=>"Benz");
	...
	$arr2['name']=$arr;
	print_r($arr2);//可以输出格式化的数据
	```
	![QQ截图20180309211806](QQ截图20180309211806.png)	
	3.2 取数组单元：用数组名+key来取
	``echo $arr['002'];``
	3.3 获取数组的长度-`count()`函数
	``count($cars);``
	3.4 遍历数组
	3.4.1 遍历数组foreach
	foreach 是专门用于循环数组的，速度非常快
	foreach里面的键值的变量名($k,$v)为任意合法的变量名。
	```php
	$arry=arry('name'=>'zhangshan','age'=>24,'address'=>'beijing');
	foreach($arry as $k=>$v){
		echo $k,':',$v,'<br/>';
	}
	```
	只循环值：
	```php
	foreach($array as $v){
		echo $v,'<br/>';
	}
	```
	**注：foreach 方法不能只循环键**
	方法：`arry_keys()` --返回数组中所有的键名。
	3.4.2 for循环
	和其他语言一样
	```php
	<?php
	$cars=array("Volvo","BMW","Toyota");
	$arrlength=count($cars);
	for($x=0;$x<$arrlength;$x++){
		echo $cars[$x];
		echo "<br>";
	}
	?>
	```
4. 函数
	4.1 函数定义:
	function 函数名([参数1],[参数2],...,[参数n]){
		//函数体，就是php语句
		return 某值/某式;
	}
	```php
	function add($a,$b){//加法
		return $a+$b;
	}
	```
	4.2 调用
	``$res=add(1,2);``
5. 打印函数
	5.1 print_r($var);
	5.2 var_dump($var);
	5.3 echo $str;
6. **php获取html表单数据 `$_GET` `$_POST`**
	6.1 $_GET是一个全局数组，在页面的不同部分都能够访问这个数组。
	可以获取地址栏中`?`后面的参数，并且可以自动放到$_GET数组中.
	6.2 $_POST也是一个全局数组，在页面的不同部分也能访问的到这个数组。
	可以获取前台`post`方式提交的表单数据。
	```html
	<!-- html页面 -->
	<form action="11.php" method="POST">
		<input type="text" name="title" value="" />
		<input type="textarea" name="content" value="" />
		<input type="submit" value="submit" />
	</form>
	```php
	<?php
	/*11.php*/
	var_dump($_GET);
	var_dump($_POST);
	?>
	```
7. 时间戳格式化函数 `date(format,timestamp)`
	* `time()`函数获取Unix时间戳秒数
	* d - 表示月里的某天（01-31）
	* m - 表示月（01-12）
	* Y - 表示年（四位数）
	* 1 - 表示周里的某天
	* h - 带有首位零的 12 小时小时格式
	* i - 带有首位零的分钟
	* s - 带有首位零的秒（00 -59）
	* a - 小写的午前和午后（am 或 pm）
	
	获取当前时间
	```php
	$yesterday = time();
	echo date("Y-m-d H:i:s",$yesterday);/其实默认timestamp=time()
	```
	![QQ截图20180310190259.png](QQ截图20180310190259.png)
	
	时间字符串转换成`int`时间戳
	``int strtotime(string);``
8. 超全局变量
	8.1. $_GET //地址栏上获得的值
	8.2. $_POST //POST表单发送的值
	8.3. $_REQUEST //既有GET,又有POST的内容(GET,POST的并集)

	8.4. $_SESSION //会话变量
	8.5. $_COOKIE //客户端标记
	8.6. $__FILES //上传的文件全局变量

	8.7. $_SERVER //web服务器的环境
	8.8. $_ENV //服务器操作系统的环境变量，如操作系统类型:windows,linux,mac等。

	8.9. $GOLBALS //引用全局作用域中可用的全部变量
9. php实现页面跳转的几种方法
	页面跳转可能是由于用户单击链接、按钮等引发的，也可能使系统自动产生的。
	
	9.1 `header()`函数
	`header()`函数的主要功能是将HTTP协议标头输出到浏览器。
	``void header(string string[,bool replace[,int http_response_code]])``
	可选的参数replace指明是替换之前一条类似标头还是添加一条相同类型的标头，默认为替换。
	第二个参数http_response_code强制将HTTP相应代码设置为指定值。
	header函数中Location类型的标头是一种特殊的header调用，常用于页面的跳转。
	**注：**
	1. `Location`和`:`之间不能有空格，否则不会有跳转。
	2. 在用`header`前不能有任何的输出,否则看不到任何输出。
	3. `header`后的PHP代码还会被执行，因此，常用exit.
	```php
	<?php
	  //重定向浏览器
	  header("Location://http:www.baidu.com");
	  //确保重定向后，后续代码不会被执行
	  exit;
	?>
	```
	9.2 `meta`标签
	`meta`标签是html中负责提供文档元信息的标签，在php程序中使用该标签，也可以实现页面跳转。
	若定义`http-equiv`为`refresh`，则打开该页面时根据`content`规定的值在一定的时间内跳转到相应的页面。
	若设置`content=`"秒数",`url`="网址",则定义了经过多长时间后页面跳转到指定的网址。
	```html
	<!DOCTYPE html5>
	<?php
	$url="http://www.baidu.com";//要跳转的地址
	?>
	<html>
	<head>
	<meta charset="utf-8" >
	<meta http-equiv="refresh" content="5; url=<?php echo $url; ?> " >
	</head>
	<body>
	页面只停留5s
	</body>
	</html>
	```
	9.3 javascript方法
	window.location.href 属性值设置window窗口的链接地址。
	```javascript
	<script language="javascript" type="text/javascript">
	window.location.href="<?php echo $url; ?>";
	</script>
	```
10. json数据
	json格式是一种很好的跨平台的格式。易于解析和编码。同样方便的xml格式。。
	10.1 `json_encode()`编码函数
	``string json_encode(mixed value,int option=0);``
	* mixed value:需要编码的变量，一般是数组。
	![QQ截图20180310200517.png](QQ截图20180310200517.png)
	
	10.2 `json_decode()`解码函数
	``mixed json_decode(string json_str,[bool assoc=false,int depth=512]);``
	* string json_str:需要解码的json字符串。
	![QQ截图20180310201117.png](QQ截图20180310201117.png)

11. php类与对象
	后面再续。。。
	
12. php数据库MySQL操作
	12.1 连接MySQL
	面向过程 方式：
	``mysqli_connection mysqli_connect([string $host,string $username,string $pwd,string $dbname,string port,string $socket])``
	面向对象 方式：
	``$mysqli_connection=new mysqli(string $host,string $username,string $pwd,string $dbname);
	
	连接数据库时可以不选定数据库，但是后面需要指定：
	`` bool mysqli_select_db(mysqli_link $conn,string $dbname);``
	``$mysqli_connection->select_db(string $dbname);`` 
	
	不使用数据库后要关闭数据库连接：
	`` bool mysqli_close(mysqli_link $conn);`` 关闭数据库连接
	`` $conn->close();``面向对象方式关闭数据库连接
	
	12.2 捕获错误信息
	`` string mysqli_error();`` 显示错误信息
	`` int mysqli_errno();``	显示错误类型
	`` $mysqli_link->error(); ``		显示错误信息
	
	12.3 query
	`` mixed mysqli_query(mysqli_link $conn,string $query[,int result_mode=0]);``
	返回的类型是数据库资源(mysql resource)类型。
	`string $query` 可以是增删改查任意类型。。。
	
	获取查询的数据:
	`` int mysqli_num_rows(mysqli_result $result); `` 获取选择的列数
	`` array|NULL mysqli_fetch_assoc(mysqli_result $result);`` 
	获取数据的第一行，以数组形式返回，列名为键值。
	`` array|NULL mysqli_fetch_row(mysqli_result $result);``
	获取数据的第一行，以数组形式返回，列顺序下标为键值。
	```php
<?php
header("Content-Type:text/html;charset=utf-8");

function connect($host,$username,$pwd,$dbname){
	//连接数据库
	$conn=mysqli_connect($host,$username,$pwd);
	if(!$conn){
		echo "connect failed!","<br/>";
		return null;
	}
	//选择数据库
	if(!mysqli_select_db($conn,$dbname)){
		echo "select db failed!","<br/>";
		mysqli_close($conn);
		return null;
	}
	return $conn;//返回数据库连接
}
function close($conn){
	//关闭数据库
	mysqli_close($conn);
}
//====================================
$conn=connect("localhost","root","g**","db_test");
if(!$conn) exit();
$sql="SELECT * FROM `tb_test1`;";
$res=mysqli_query($conn,$sql);
if(0<mysqli_num_rows($res)){
	$res=mysqli_fetch_assoc($res);//获取列名作为数组key
	//$res=mysqli_fetch_row($res);//将列的顺序下标作为数组key
	var_dump($res);
}
close($conn);
?>
	```
	![QQ截图20180310213712.png](QQ截图20180310213712.png)
	
	12.4 数据库事务
	1. `` bool mysqli_autocommit(mysqli_link $conn,bool $mode);``
		设置是否自动提交,默认$mode=true;
	2. `` bool mysqli_multi_query(mysqli_link $conn,string $query);``
		一个进行多项query的方法。。。$query内以`;`分割不同query
	3. `` bool mysqli_next_result(mysqli_link $conn);``
		移动$conn指针，指向下一个query的执行结果。
	4. `` int mysqli_affect_rows(mysqli_link $conn);``
		获取query执行影响的行数。
	5. `` bool mysqli_commit(mysqli_link $conn);``
		提交事务
	6. `` bool mysqli_rollback(mysqli_link $conn);``
		回滚事务
	```php
$conn=connect("localhost","root","gt","db_test");
if(!$conn) exit();
mysqli_autocommit($conn,false);//关闭自动提交
$sql="UPDATE `tb_test2` SET `str`='hello!';";
$sql.="UPDATE `tb_test2` SET `str`='hello GT!';";
$res=mysqli_multi_query($conn,$sql);
if(!$res){
	echo mysqli_error($conn);
	close($conn);
	exit();
}
$res1=mysqli_affected_rows($conn)>0?true:false;
mysqli_next_result($conn);
$res2=mysqli_affected_rows($conn)>0?true:false;
if($res1 && $res2){
	mysqli_commit($conn);
	echo "commit transaction!<br/>";
}else{
	mysqli_rollback($conn);
	echo "rollback transaction!<br/>";
}
close($conn);
	```
	![QQ截图20180310231956.png](QQ截图20180310231956.png)
	![QQ截图20180310232157.png](QQ截图20180310232157.png)
	
=========================================================
这里只是简单的笔记，如果有错误恳请指正。
Email: GT_GameEmail@163.com