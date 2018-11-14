---
title: Iris数据分析
date: 2018-08-09 10:55:33
tags: 机器学习, Iris数据分析
author: GT
---


之前在慕课网上学习了机器学习-实现简单神经网络，现在将记录项目实战经历。
该项目在我的github地址为: [IrisDatasetAnalysis](https://github.com/HTMLgtMK/IrisDatasetAnalysis)

该项目是关于Iris数据集的数据分析，主要功能是利用机器学习给数据分类。

<!-- more -->

## 环境准备
1. Ubuntu 18.04 LTS , kernel 4.15.0-30-generic
2. python 3.6.5
3. Anaconda Navigator 1.8, anaconda是一个开源的python发行版本，包含conda, Python等180多个科学包及其依赖项。
4. 编辑器: Jupyter, Anaconda安装时选择安装, 在anaconda-navigator中的Enviroment选项卡中选择base root->Open with Jupytor Notebook

## 数据集
数据是机器学习模型的原材料。
Irsis Dataset 是 鸢尾属植物数据集，包含三类不同的鸢尾属植物: Iris Setosa, Iris Versicolour, Iris Viginca. 数据包含4个独立的属性,这些属性变量测量植物的花朵,比如萼片长度, 萼片宽度,花瓣长度, 花瓣宽度.
部分数据如下:
![Selection_013.png](Selection_013.png)
每个收集了50个样本，因此这个数据集共包含了150个数据样本。
下载地址：[科大镜像](https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data)
我在下载后，将数据文件放在了`~/Documents/dataset/iris/iris.data`中。

## 构建简单的神经网络

该项目将利用python构建一个只有一层的神经网络，神经元的数学表示：
![Selection_001.png](Selection_001.png)
其中，**x**向量表示电信号，z表示细胞核处理后的电信号。

该项目将研究两种数据分类算法: 1). 感知器算法, 2). 适应性线性神经单元。

该项目神经学习的总体框架：![Selection_003.png](Selection_003.png)

### 感知器分类算法

所谓感知器，就是二类分类的线性分类模型，其输入为样本的特征向量，输出为样本的类别，取+1和-1二值，即通过样本的特征，就可以准确判断出该样本属于哪一类。因此，感知器要求能够解决的问题的特征空间是线性可分的，并且是二类分类。

感知器是神经学习和SVM算法的基础，后面将单独学习感知器的内容，这里先描述感知器算法的步骤。

**感知器算法步骤:** 
全局变量: 输入样本特征向量**x_**, 权重向量**w_**。
1. 将权向量**w_**初始化为零向量**0**,或把每个分量初始化为[0,1]之间的任意小数；
2. 将训练样本输入感知器，得到分类结果；
3. 根据分类结果修改权重向量；反复1-3步骤，更新权重向量。

具体:
1. 初始化：`z=w_^T x`(w_的转置与x的点积)；令 w0=-$threshold (表示阈值), x0=1固定。由z=w0*x0+w1*x1+w2*x2+..。+wm*xm，第一项即为阈值的相反数；由激活函数activate(z)可知:当z>=0时，激活函数activate(z)=+1;当在z<0时，activate(z)=-1。
![Selection_002.png](Selection_002.png)

2. 权重更新算法:
	1. wj = wj + delta(wj);
	2. delta(wj) = eta * (y-y')*xj
	其中，
	* eta: 学习速率，[0,1]之间的一个小数
	* y  : 输入样本的正确分类
	* y' : 感知器计算得到的分类
	* xj : 训练样本的第j个分量
	学习率是训练者根据自己的经验设置的，，eta会影响到整个模型的训练效果。
	eg:
	w_ = [0,0,0], x_ = [1,2,3], eta=0.3, y=1, y'=-1
	1. detla(w0) = 0.3 * (1-(-1))*1 = 0.6
	2. w0 = w0 + detla(w0) = 0.6
	同理,w1 = 1.2, w3 = 1.8. 更新后的权重向量为w_=[0.6,1.2,1.8]. 之后再将训练样本输入到模型中，再次进行新的运算，再改进模型。
	
3. 阈值的更新：当权重向量更新之后，也需要更新阈值$threshold, 若阈值为w_[0], 则直接更新w_[0]即可。`w_[0]=eta * (y - y')`

4. 迭代停止条件: 1). 达到指定的迭代次数, 2) 损失在可接受范围内。这里的损失即为一次迭代中错误分类的次数。

### 感知器分类算法代码实现
详见: [IrisDatasetAnalysis Perceptron.py](github.com/HTMLgtMK/IrisDatasetAnalysis/tree/master/code/Perceptron/Perceptron.py)

输入样本数据训练代码见:[IrisDatasetAnalysis Practice.py](github.com/HTMLgtMK/IrisDatasetAnalysis/tree/master/code/Perceptron/Practice.py)

算法迭代-出错曲线图如图:
![Selection_004.png](Selection_004.png)
算法分类结果图：
![Selection_005.png](Selection_005.png)

### 适应性线性神经单元分类算法

样本分类结果到分类超平面的距离公式:
![Selection_006.png](Selection_006.png)
将wj看做是自变量，而xj看作参数。
要使得该距离最小，应该求得J(w)的最小值，而J(w)在空间内呈现的是球状，可以通过求偏导数求得最小值。
![Selection_007.png](Selection_007.png)

算法在初始化时，所在的点w(w0,w1,w2,...,wn)是随机的一个点，分别对wj求得偏导数后k，若偏导数k大于0，则应该将对应wj减小，反之则应该增大。
![Selection_008.png](Selection_008.png) ![Selection_009.png](Selection_009.png)

适应性线性神经单元的激活函数不是单调步调函数，而是直接的net_input输出结果。

### 适应性线性神经单元分类算法代码实现
详见: [IrisDatasetAnalysis AddlineGD.py](github.com/HTMLgtMK/IrisDatasetAnalysis/tree/master/code/AdalineGD/AdalineGD.py)

输入样本数据训练代码见:[IrisDatasetAnalysis Practice.py](github.com/HTMLgtMK/IrisDatasetAnalysis/tree/master/code/AdalineGD/Practice.py)

算法迭代-出错曲线图如图:
![Selection_010.png](Selection_010.png)
算法分类结果图：
![Selection_011.png](Selection_011.png)

## 训练模型及数据可视化
前面描述了神经网络的搭建，但是没有数据输入，还是看不到效果，下面将数据文件中的数据输入到模型中，并以图形的方式展示训练效果和预测效果。

### 获取训练数据
数据包括花径长度，花瓣长度以及鸢尾属分类。其中前两项是X的内容，鸢尾属分类是y的内容。
数据存储在iris.data数据文件中，格式为.csv文件格式，即每行使用逗号`,`分割。
这里使用python的`pandas`类包读取数据文件。

```python
import pandas as pd
file = "~/Documents/dataset/iris/iris.data" # 数据文件路径
df = pd.read_csv(file, header=None)			# 读取数据，header=None表示数据文件第一行不是文件描述
df.head(10)									# 展示前10条数据
```
![Selection_012.png](Selection_012.png)

根据下载的数据文件描述，X取第0列和第2列，y取第4列:
```python
import numpy as np
X = df.iloc[:100,[0,2]].values
y = df.loc(:100, 4).values
# 将字符串转换成int数字
y = np.where(y == 'Iris-setosa', 1, -1)
print(X.shape, X[:2])
print(y.shape, y[:2])
```
![Selection_014.png](Selection_014.png)

展示训练数据:
```python
import matplotlib.pyplot as plt
plt.scatter(X[:50, 0], X[:50, 1], color='red', marker='o', label='setosa')
plt.scatter(X[50:100, 0], X[50:100, 1], color="blue", marker="x", label="versicolor")
plt.xlabel("花瓣长度")
plt.ylabel("花径长度")
plt.legend(loc="upper left")
plt.show()
```

### 训练模型

1. 感知器算法模型
```python3
ppn = Perceptron(eta=0.1, n_iter=10)
ppn.fit(X,y)
```

2. 适应性线性神经单元算法模型
```python3
adlGD = AdalineGD(eta = 0.001, n_iter=50)
adlGD.fit(X,y)
```
这里需要注意的是适应性线性神经单元的学习率要小，不然模型不能收敛，导致训练失败。

### 展示结果

1. 训练过程展示
	![Selection_004.png](Selection_004.png) ![Selection_010.png](Selection_010.png) 
2. 训练结果展示
	![Selection_005.png](Selection_005.png) ![Selection_011.png](Selection_011.png)


---
到这里机器学习入门-Iris数据分析就结束了，体验了一把机器学习的神奇。
当然，我存在下面的问题：1). python基础扎实，2). 机器学习理论薄弱，3). 数学能力弱。

日后要扎实学习，克服一个个困难！山不过来，我就过去！
