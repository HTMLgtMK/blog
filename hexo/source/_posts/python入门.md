---
title: python入门
date: 2018-05-31 10:01:49
tags: python
author: GT
---

## python入门

1. 特点： 优雅, 明确, 简单

2. 适合领域:
	1. Web网站和各种网络服务
	2. 系统工具和脚本
	3. 作为“胶水”语言将其他语言开发的模块包装起来方便使用。
	
 不适合的领域:
	1. 贴近硬件的代码(首选C)
	2. 移动开发: IOS/Android
	3. 游戏开发(C/C++)
 实际应用: OpenStack 开源云计算平台
 
 缺点: python源码不能加密
	2.7版本和3.3版本不兼容
 优点: python可以跨平台
 
 <!-- more -->
 
3. 第一个程序:
	print 'hello world!' # python2.7版本
	print('hello world!') # python3.3版本
	
4. `py`文件的创建
	1. 创建`helloworld.py`, 文件内容:
		```python
		#!/sbin/bash
		print('hello world!')
		```
	2. 在cmd中运行
		```cmd
		> python helloworld.py
		```
	
### python中的数据类型

1. 整数
	Python可以处理任意大小的整数，当然包括负整数。
	表示方法和数学上的表示方式一样。eg：1, -100.
	
2. 浮点数
	`科学记数法`表示, 把`10`用`e`表示.eg：1.23x10^9就是 1.23e9.
	
3. 字符串
	字符串是以`''`或`""`括起来的任意文本。
	
4. 布尔值
	布尔值只有`True`和`False`两种值。注意大小写。
	
	布尔值可以用`and`,`or`和`not`运算。
	
5. 空值
	空值是Python里一个特殊的值，用`None`表示。
	None不能理解为0，因为0是有意义的，
	而None是一个特殊的空值。
	
6. python 还提供了列表、字典等多种数据类型，还允许自定义类型。

### python之print语句

1. `print`语句可以向屏幕输出指定的文字。
	python2.7版本下是 直接跟 字符串的, python3.3版本是需要使用`()`括起来。
	
2. prin语句可以跟上多个字符串，用逗号"," 隔开，就可以连成一串输出。
	print会一次打印每个字符串，遇到逗号`,`会输出一个空格` `, 
	因此，输出的字符串是这样拼起来的。
	
### python的注释

1. python的注释以`#`开头，后面的文字直到行尾都算注释。
	```python
	# 这一行都是注释
	print 'hello' # 这里也是注释
	```
	
2. 函数的注释
	```python
	def square(width):
		"返回平方数"
		return width*width
	```
	
### python的变量

1. 变量名必须是大小写英文，数字和下划线(_)的组合，
	并且不能用数字开头。
	```python
	a = 100 # 整数类型
	t_007 = 'T007' # 字符串类型
	```
	
2. 在python中，等号`=`是赋值语句，可以把任意数据类型赋值给变量，
	同一个变量可以反复赋值，而且可以是不同类型的变量。
	```python
	a = 123 # 整数类型
	a = 'imooc' # 字符串类型
	```
	python是动态语言。
	
3. 求等差数列前n项和:
	> 用变量 x1 表示等差数列的第一项，用 d 表示公差，请计算数列
	> 1 4 7 10 13 16 19 ...
	> 前 100 项的和。
	```python
	#!/usr/bin/python3
	x1 = 1
	d = 3
	n = 100
	# 等差数列求和公式
	# an = (n-1)*d + a1
	# Sn = (a1+an)*n/2 = d/2*(n^2) + (a1 - d/2 )*n
	# 	 = na1 + n(n-1)/2 * d
	Sn = n*x1 + n*(n-1)*d/2
	print(Sn)
	```
	** 数学公式真的很重要 **
	```python
	# 等比数列
	an = q^(n-1)a1;
	Sn = n*a1 (q = 1)
	Sn = a1*(1-q^n)/(1-q) ( q !== 1)
	```
	
### python中定义字符串

1. 使用`''`和`""`表示字符串, 使用`\`转义字符。

2. 如果一个字符串中含有许多需要转义的字符，
	对每一个字符都进行转义会很麻烦。为了避免这种情况，
	我们可以在字符串前面叫一个前缀`r`，表示这是一个`raw`字符串，
	里面的字符就不需要转义了。eg:
	```python
	#!/usr/bin/python3
	str = r'\(!~_~)/ \(~_~!)/'
	print(str)
	```
	但是r'...'表示法不能表示多行字符串，也不能表示包含`''`或`""`(外部为''时)的字符串。

3. 表示多行字符串(Doc注释的方法):
	```python
	'''
	line1
	line2
	line3
	'''
	# 等效于 '\nline1\nline2\nline3\n'
	```
4. python中的`Unicode`字符串。
	python的发布比Unicode的发布还早，因此最早的python只支出ASCII编码。
	python在后来添加了对Unicode的支持，以Unicode表示的字符串用`u'...'`表示。
	```python
	s = u'中文'
	print s
	```
	然而，经过测试，不加`u`也可以显示中文了。。。
	
5. 如果中文字符串在python环境中遇到`UnicodeDecodeError`,
	这是因为`.py`文件保存的格式有问题。可以在第一行添加注释:
	```python
	# -*- coding:utf-8 -*-
	```
	目的是告诉解释器，以UTF-8格式读取源代码。

### python中的布尔类型

1. python中将`0`,空字符串`''`和`None`看成`False`, 
	`其他数值`和`非空字符串`都堪称`True`.
	
2. 多个条件时使用的法则是`短路计算`。

### python中的list

`list`是python内置的数据类型。`list`是一种**有序**的**集合**,
可以随时添加和删除其中的元素。
和php中的`array`类型很类似。

1. 创建`list`对象, 直接用`[]`把所有元素括起来就可以创建。
	```python
	classmates = ['gt', 'aman', 'wah', 'lwj']
	print(classmates)
	```
	**list中可以包含各种类型数据**
	```python
	arr = ['gt', 1, 2, 3]
	```
	空list:
	```python
	l = []
	```
2. 访问list
	1. 按照索引访问list (从下标0开始)
		```python
		L = ['Adam', 'Lisa', 'Bart']
		print(L[0], L[1])
		```
		越界的话会报错: 
		> IndexError: list index out of range
	2. 倒序访问list
		可以使用`-1`这一索引表示最后一个元素。
		```python
		L = ['Adam', 'Lisa', 'Bart']
		print(L[-1]) # 倒数第一个元素
		print(L[-2]) # 倒数第二个元素
		print(L[-3]) # 倒数第三个元素
		```
3. 添加元素
	1. `append(Object)`方法, 将新元素添加到list的末尾。
		```python
		L = ['Adam', 'Lisa', 'Bart']
		L.append('pual')
		```
	2. `insert(index, Object)`方法, 将新元素插入到指定位置。
		索引范围为[0, L.length]
		```python
		L = ['Adam', 'Lisa', 'Bart'] 
		L.append(3, 'pual') # 等效于L.append('pual')
		L.insert(0, 'Deve') # 插入到第一
		```
4. 删除元素
	1. 使用`Item pop([index])`方法，默认`index`是最后一个元素。
		该方法会返回被移除的元素。
		```python
		L = ['Adam', 'Lisa', 'Bart', 'Bob', 'Deve']
		print(L.pop()) # 移除了Deve
		print(L.pop(2))# 移除了Bart
		```
		index越界时或者list为空时会报错: Index out of range .
5. 替换元素
	1. 直接使用索引赋值
		```python
		L = ['Adam', 'Lisa', 'Bart']
		L[2] = 'Paul'; # 等效于 L[-1] = 'Pual'
		```

### python中的tuple

`tuple`是python中另一种`有序列表`。但是，`tuple`(元组)一旦创建，
就不能再被修改。

1. 创建`tuple`
	1. 创建`tuple`的方法和创建`list`的唯一不同之处是用`()`替代了`[]`.
		可以按照list的方式正常访问。
		```python
		t = ('Adam', 'Lisa', 'Bart')
		print(t[0], t[1], t[2], t[-1], t[-2], t[-3])
		```
		由于tuple不能修改，因此也没有append(),pop()方法，
		也不能使用索引方式替换。
	2. 空元素tuple:
		```python
		t = ()
		print(t)
		```
	3. 单元素tuple
		直接使用``t = ('Adam') ``创建，输出的是'Adam'而不是tuple.
		这是因为`()`既可以表示tuple, 也可以表示运算的优先级。
		正是因为()定义单元素的tuple有歧义，所以python规定，
		单元素tuple需要多加一个逗号`,`,这样就避免了歧义。
		```python
		t = ('Adam',)
		print(t) # 打印输出时也添加了逗号, 为了更明确的指明是一个tuple
		```

2. "可变"的tuple
	```python
	t = ('a', 'b', ['A', 'B'])
	L = t[2]
	L[0] = 'X'
	L[1] = 'Y'
	```
	变的只是list的元素，而list并没有改变。
	tuple没有改变，是指tuple指向的list并没有改变，
	即：**指向'a', 就不能改成指向'b'.**但是这个list本身是可变的。

### python中的条件语句

python中没有`{}`, 代码块由相同缩进的代码标识。
python中的缩进习惯写法是 **4个空格，不要使用Tab，更不要混合Tab和空格**。
(不良习惯，还不如{}直观方便)
```python
age = 20
if age > 18 :
	print 'your age is ', age
	print 'adult'
print 'END'
```

如果在`python的交互环境`下敲代码，还要特别留意缩进，
并且**退出缩进需要多敲一行回车**.
```python
age = 20
if age > 18 :
	print 'your age is ', age
	print 'adult'

print 'END'
```

1. if语句, 格式:
	```python
	if condition :
		actions
	```
	if语句中使用冒号`:`表示代码块的开始。
	python中的if语句condition部分不使用`()`(不直观，反感)

2. if-else 语句, 格式:
	```python
	if condition :
		actions1
	else :
		actions2
	```
	eg:
	```python
	score = 75
	if not score < 60 : # 布尔值的取反使用not
		print("passed")
	else :
		print("failed")
	```
3. if-elif-else 语句, 格式:
	```python
	if condition1 :
		actions1
	elif condition2 :
		actions2
	elif condition3 :
		actions3
	else :
		actions4
	```
	注意是`elif`不是`else if`(和其他语言不同，有点恶心。。)
	
### python中的循环

1. `for`循环, `list`和`tuple`的迭代器, 格式：
	```python
	for item in list :
		do actions with item...
	```
	eg:
	```python
	L = ['Adam', 'Lisa', 'Bart']
	for name in L :
		print(name)
	```

2. `while`循环, 不会迭代list或tuple的元素, 而是根据表达式判断循环结束, 格式:
	```python
	while condition :
		actions
	```
	eg:
	```python
	count = 100
	sum = 0
	while count>0 :
		sum += count
		count -= 1 # python里面没有--, ++等自增自减符号, 垃圾语言。。。
	
	print(sum)
	```

3. `break`退出循环
4. `continue`继续循环
5. 多重循环

6. for循环n次
	python中的循环条件和其它语言不一样(真tm难用。。。)，那个循环指定次数怎么搞？
	使用`range(start, end[, step])`函数，start默认为0， 最后一个元素不包括end，step是步长。
	```python
	for i in range(100) :
		print(i)
	```

### python中的字典 dict
dict的作用是建立一组key和一组value的映射关系，dict的key是不能重复的。
1. 声明字典 `dict`
	```python
	d = {
		'Adam' : 95,
		'Lisa' : 85,
		'Bart' : 59
	}
	```
	花括号`{}`表示这是一个dict, 然后按照**key : value**, 写出来即可。
	最后一个key: value的逗号可以省略。
	
2. `len()` 函数可以计算任意集合的大小
	```python
	print(len(d));
	```
	
3. dict的访问
	1. 使用`dict[key]`的形式访问对应的value。	
	与list访问有区别，list必须使用索引返回对应的元素，而dict使用key。
	如果key不存在，会直接报错: 
	>> KeyError : 'key'
	
	
	2. 要避免KeyError的发生，有两种方法:
	 1. 先判断key是否存在，使用`in`操作符
	 	```python
	 	if 'Paul' in d :
	 		print(d['paul'])
	 		
	 	```
	 	
	 2. 使用dict本省提供的`get()`方法，当key不存在时，返回`None`
	 	```python
	 	print(d.get('Bart'))
	 	print(d.get('Paul'))
	 	```
	 	
3. python中dict的特点
	1. 查找速度快，无论dict中有10个元素还是10万个元素，查找速度都一样。
	而list的查找速度随着元素的增加而逐渐下降。
	但是dict占用内存较大，还会浪费很多内容。list则相反。
	
	2. dict中存储的key-value是没有顺序的。打印的顺序不一定时创建时的顺序。
	3. dict中作为key的元素必须不可变。python中基本类型如字符串、整数、浮点数、tuple都是不可变的，
	都可以作为key。但是list是可变的，就不能作为key。不可变的限制仅作用于key，value是否可变无所谓。
	
3. python 更新dict
	使用赋值语句添加/更新dict。
	1. key-value不存在:
	```python
	d['Paul'] = 72
	```
	将新同学Paul的成绩添加进去。
	
	2. key已经存在:
	```python
	d['Paul'] = 60
	```
	 如果key已经存在，则赋值语句会用新的value替换掉原来的value.
	 
4. python 遍历dict
	dict也是一个集合，因此可以通过for循环实现遍历dict的key。
	```python
	for key in d :
		print(key, d[key])
	```
	
### python中的set
`set`持有一系列元素，set中的元素没有重复，而且是无序的。
1. 声明`set`
	调用`set()`并传入一个list，list的元素将作为set的元素。
	```python
	s = set(['A', 'B', 'C']);
	```
	如果传入的list中含有相同的元素，set会算作一个元素。
	打印set的结果可能跟传入的list中元素顺序不同，因为set中元素是无序的。
	
2. python 访问set
	由于set时无序集合，因此无法通过索引来访问。访问set中的某个元素实际上判断一个元素是否在set中。
	可以用`in` 操作符判断。
	```python
	s = set(['Adam', 'Lisa', 'Bart'])
	'Bart' in s # 返回True
	'Bill' in s # 返回False
	```

3. set的特点
	set的内部结构和dict很像，唯一区别就是不存储value，因此，判断一个元素是否在set中速度很快。
	set存储的元素和dict的key类似，必须时不变的对象。
	set存储的元素也是没有顺序的。
	
4. python 遍历set
	由于set也是一个集合，所以，遍历set和遍历list类似，都可以直接使用for循环实现。
	```python
	for name in s :
		print(name)
	```
	
5. python 更新set
	由于set存储的是一组不重复的无序元素，因此，更新set主要做两件事。
	一是把新的元素添加到set中，二是把已有的元素从set中删除。
	1. 使用`add()`方法添加元素
	```python
	s = set([1,2,3,4])
	s.add(5)
	print(s)
	```
	如果添加的元素已经存在于set中，add()不会报错，但是不会加进去了。
	
	2. 使用`update(list)`方法添加批量元素
	```python
	s.update([5,6,7])
	```

	2. 使用`remove()`方法删除set中的元素
	```python
	s = set([1,2,3,4])
	s.remove(4)
	print(s)
	```
	如果删除的元素不存在set中，remove()方法会报错: KeyError
	
### python中的函数

1. 内置函数
	1. 交互式命令行通过`help(abs)`查看`abs`函数的帮助信息
	2. 比较函数`cmp(x,y)`, 如果x < y,返回-1，如果x = y, 返回0， 如果x > y, 返回1
	3. * `int(x [,base])`函数将其它数据类型转化成整数。
	   * `long[x [,base]]`函数将x转换成长整数
	   * `float(x)`函数将x转换成一个浮点数
	   * `str(x)`将对象x转换成字符串
       * `repr(x)`将对象x转换成表达式字符串
	   * `tuple(x)`将序列x转换成一个元组
	   * `list(x)`将序列x转换成一个列表
	   * `chr(x)`将一个整数转换成一个字符
	   * `unichr(x)`将一个整数转换成Unicode字符
	   * `hex(x)`将一个整数转换成一个十六进制字符串
	
	```python
	int('123') # str -> int
	int(123.45) # float -> int
	int('123.45') # 报错： ValueError: invalid literal for int() with base 10: '123.45'
	```
	4. `str()`函数将其他类型转换成字符串。
	```python
	str(123.45)
	```
	
2. 定义函数
	在python中，使用`def`定义函数，格式如下：
		def 函数名(参数列表) :
			''' 函数说明，可无 '''
			# TODO 函数体
			return # return None 可以简写为 return.
	eg:
	```python
	def square_of_sum(L) :
		'''计算一个list中每个元素平方的和'''
		sum = 0
		for vo in L :
			sum += vo * vo
		return sum
	print(square_of_sum([1,2,3,4,5]))
	```
	
3. python函数返回多值
	python的函数可以返回多个值，(go 语言也是可以的，所以这两个语言都很怪。。。)。
	python返回值本质上是一个tuple。但是，在语法上，返回一个tuple可以省略括号，
	而多个变量可以同时接收一个tuple，按位置赋给对应的值。
	```python
	import math
	def move(x, y, step, angle) :
		nx = x + step * math.cos(angle)
		ny = y + step * math.sin(angle)
		return nx, ny
	# 接收返回值方式1, 直接将值赋给x, y
	x, y = move(100, 100, 60, math.pi/6)
	print(x, y)
	# 接收返回值方式2, 使用一个变量接收返回值
	r = move(100, 100, 60,math.pi/60)
	print(r)
	```
	
4. python 的递归函数
	和其它语言相同

5. python中函数的默认参数
	由于函数的参数按从左到右的顺序匹配，默认参数只能定义在必须参数的后面。
	`range()`函数的step参数就是默认参数为1。
	```python
	def power(x, n=2) :
		'''计算次数，默认计算平方'''
		res = 1
		for i in range(0, n) :
			res *= x
			
		return res
	
	power(2)
	power(2, 3)
	``

6. python定义可变参数
	如果想让一个函数接受任意个参数，可以定义一个可变参数。
	```python
	def fn(*args) :
		print(args)
	```
	可变参数的名字前面有个`*`号，可以传入0个，1个或多个参数给可变参数。
	python的解释器把传入的一组参数组装成一个tuple传递给可变参数，
	因此，在函数内部把变量args看成一个tuple就可以了。
	```python
	def average(*args) :
		l = len(args)
		if l == 0 :
			return 0
		res = 0
		for vo in args :
			res += vo
		return float(res)/l
		
	print(average(1,2,3,4))
	```
	
### 对list进行切片
python提供了切片符`:`，可以取list中指定范围的元素。
1. 取前n个元素
```python
l = ['Adam', 'Lisa', 'Bart', 'Paul']
slice = l[0:n] # 表示取从第0个元素，不包括第n个元素，共n个元素
slice = l[:n] # 如果第一个索引是0，可以省略
```
	
2. 取中间的元素
```python
l = ['Adam', 'Lisa', 'Bart', 'Paul']
slice = l[n:m] # 取n-(m-1)之间的元素
slice = l[n:] # 取从n到末尾的全部元素
```

3. 取出有步长的切片
切片的第三个位置可以表示步长，表示每个step个元素取出一个元素。
```python
l = ['Adam', 'Lisa', 'Bart', 'Paul']
slice = l[::2] # 每两个元素取出一个，即隔1个元素取出一个元素
```
	
4. 倒序切片
```python
>>> L = ['Adam', 'Lisa', 'Bart', 'Paul']
>>> L[-2 : ]
['Bart', 'Paul']
>>> L[-3:-1]
['Lisa', 'Bart','Paul']
```	

5. 对字符串进行切片
字符串'xxx'和Unicode字符串u'xxx'也可以看成是种list，每个元素就是一个字符。
因此，字符串可以用切片操作，切片操作结果仍然是字符串。
```python
>>> 'ABCDEFG'[:3]
'ABC'
>>> 'ABCDEFG'[-3:]
'EFG'
>>> 'ABCDEFG'[::2]
'ACEG'
```
其他语言中都有针对字符串的截取函数，而python中没有，对字符串的截取操作就是字符串切片。

### python中的迭代
1. 在Python中，如果给定一个`list`或`tuple`，我们可以通过`for循环`来遍历这个list或tuple，
	这种遍历我们成为`迭代（Iteration）`。

	在python中，迭代是通过`for ... in`完成的，而很多语言比如C和Java，
	是通过下标或者迭代器(`Iterator`)完成迭代。

	python中的for循环不仅可以用在list或tuple上，还可以作用在其他任何可迭代对象上。
	>> 注意: 集合是指包含一组元素的数据结构，我们已经介绍的包括：
	>> 1. 有序集合：list，tuple，str和unicode；
	>> 2. 无序集合：set
	>> 3. 无序集合并且具有 key-value 对：dict

2. 索引迭代
	在Python中，迭代永远是取出元素本身，而非元素的索引。
	对于有序集合，元素确实是有索引的。有的时候有需要在for循环中拿到索引的需求，
	方法是使用`enumerate()`函数:
	```python
	>>> L = ['Adam', 'Lisa', 'Bart', 'Paul']
	>>> for index, name in enumerate(L) :
	...		print(index, '-', name)
	...		
	0 - Adam
	1 - Lisa
	2 - Bart
	3 - Paul
	```
	实际上enumerate()函数返回的是一个tuple。

	python内置函数`zip()`可以将两个list变成一个list：
	>> zip(seq1 [, seq2 [...]]) -> [(seq1[0], seq2[0] ...), (...)]
	
3. 迭代dict的value
	dict对象本身就是一个可迭代对象，使用for循环可以直接迭代dict，可以每次拿到一个key。
	
	如果只希望迭代dict的value值，可以使用dict对象的`values()`方法，
	可以将dict转换成一个包含所有value的list.
	```python
	d = {'Adam': 95, 'Lisa': 85, 'Bart': 72, 'Paul': 59}
	print(d.values())
	# [ 85, 95, 72, 59]
	for vo in d.values() :
		print(v)
	```
	dict处理values()方法外，还有一个`itervalues()`方法，用itervalues()方法代替values()方法效果完全一样。
	区别：
	1. values() 方法实际上把一个 dict 转换成了包含 value 的list。

	2. 但是 itervalues() 方法不会转换，它会在迭代过程中依次从 dict 中取出 value，
	所以 itervalues() 方法比 values() 方法节省了生成 list 所需的内存。

	3. 打印 itervalues() 发现它返回一个 <dictionary-valueiterator> 对象，这说明在Python中，
	for 循环可作用的迭代对象远不止 list，tuple，str，unicode，dict等，
	任何可迭代对象都可以作用于for循环，而内部如何迭代我们通常并不用关心。
	
4. 迭代dict的key和value
	使用dict对象的`items()`方法可以同时迭代dict的`key`和`value`值：
	```python
	d = {'Adam': 95, 'Lisa': 85, 'Bart': 72, 'Paul': 59}
	for key , value in d.items() :
		print(key, ':', value)
	```	
	items()方法返回的是一个tuple。dict对象也有`iteritems()`方法。
	
	
### 生成列表

1. 列表生成式 
	```python
	>>> [x*x for x in range(1, 11)]
	[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
	```
	前面的内容是对每个`v`都需要做的事（可以是一个函数），后面是for循环，有点像JS的eac函数。
	
2. 复杂表达式
	```python
	d = { 'Adam': 95, 'Lisa': 85, 'Bart': 59 }
	tds = ['<tr><td>%s</td><td>%s</td></tr>' %(name, score) for name, score in d.iteritems() ] 
	print('<tabele>')
	print('<tr><th>Name</th><th>Score</th></tr>')
	print('\n', join(tds))) # join()函数可以将一个list拼接成一个一个字符串
	print('</table>')
	```
	`join()`函数可以将一个list拼接成一个一个字符串， 亲测python3可能没有这个方法。
	
3. 条件过滤
	可以对列表生成式的for循环后面加上`if判断`，过滤for循环。
	```python
	>>> [x*x for x in rangge(1,11) if x%2 == 0]
	[4, 16, 36, 64, 100]
	```
	有了 if 条件，只有 if 判断为 True 的时候，才把循环的当前元素添加到列表中。
	
	eg:请编写一个函数，它接受一个 list，然后把list中的所有字符串变成大写后返回，非字符串元素将被忽略。
	1. isinstance(x, str) 可以判断变量 x 是否是字符串；
	2. 字符串的 upper() 方法可以返回大写的字母
	```python
	def toUppers(L):
    	return [vo.upper() for vo in L if isinstance(vo, str)]
    
	print toUppers(['Hello', 'world', 101])
	```
	
4. 多层表达式
	for循环可以嵌套，因此，在列表生成式中，也可以用多层 for 循环来生成列表。
	
	eg: 对于字符串 'ABC' 和 '123'，可以使用两层循环，生成全排列：
	```python
	>>> [m+n for m in 'ABC' for n in '123' ]
	['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']
	```
	翻译成循环代码：
	```python
	L = []
	for m in 'ABC' :
		for n in '123' :
			L.append(m+n)
	```
	
-----------------------------------------------------------

完结撒花!!!
