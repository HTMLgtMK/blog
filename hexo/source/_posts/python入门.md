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