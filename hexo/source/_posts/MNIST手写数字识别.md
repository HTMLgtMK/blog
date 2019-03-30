---
title: MNIST手写数字识别
date: 2019-03-23 21:51:50
tags: LeNet-v5 CNN MNIST
---
学过了CNN，就像使用CNN完成一次手写数字的识别过程。
这次的CNN网络结果使用LeNet-v5网络结构，不使用tensorflow，
推导并编写代码，以便加深印象。

## CNN简介
### 卷积层+ReLu
### 池化层
### 全连接层

<!-- more -->

## LeNet-v5简介
LeNet-v5共有7层，具体如下：
* 输入图片: 32*32*1. 图片大小为32像素，1通道。
* 卷积层：2
* 池化层(降采样层)：2
* 全连接层：2
* 输出：1。手写数字识别中为10种数字的概率。

### 第一层 卷积层
* input image size: 28*28*1
* 卷积核: 5*5，6个
* 卷积模式: same
* 卷积步长: 1
* 卷积Padding: 0
* output image size: 28*28*6. 图片大小为28*28，共有6张Feature Map.

- 参数个数: ((5*5)+1)*6 = 156. 其中+1是因为需要加入一个偏置。
- 连接数: 156*(28*28) = 122304. 

### 第二层 平均池化层
* input image size: 28*28*6
* 卷积核: 2*2
* 卷积模式: valid
* 卷积步长: 2
* 卷积Padding: 0
* output image size: 14*14*6

### 第三层 卷积层
* input image size: 14*14*6. 图片大小为28*28，共有6张Feature
* 卷积核: 5*5, 16个
* 卷积模式: valid
* 卷积步长: 1
* 卷积Padding: 0
* output image size: 10*10*16

- 参数个数: ((5*5)+1)*16 = 416

### 第四层 最大池化层
* input image size: 10*10*16
* 卷积核: 2*2
* 卷积模式: valid
* 卷积步长: 2
* 卷积Padding: 0
* output image size: 5*5*16
**注:** 需要将这一层的输出图片拉直成一维的数据，以适应下一层的输入。

### 第五层 全连接层
* input image size: 5*5*16
* output: 120个单元
每个单元与第4层中全部400个单元之间进行全连接，
如同传统机器学习方法，FC5层计算输入向量与权重向量之间的点积，再加上一个偏置。

- 参数个数: 120*(5*5*16+1) = 48120
全连接层的功能是实现分类或者回归(前面的卷积层和池化层的功能是提取图片特征)

### 第六层 全连接层
* input: 120单元
* output: 84单元
每个单元与第5层中全部120个单元之间进行全连接

- 参数个数: 84*(120+1) = 10164

### 第七层 Output输出层
* input: 84单元
* output: 1种类别
输出层由`欧式径向基函数(Euclidean  Radial Basis Function, RBF)单元`组成，
每类一个单元，每个有84个输入。


## CNN推导
![tuidao_1.png](tuidao_1.png)
![tuidao_2.png](tuidao_2.png)
![tuidao_3.png](tuidao_3.png)
![tuidao_4.png](tuidao_4.png)
![tuidao_5.png](tuidao_5.png)
![tuidao_6.png](tuidao_6.png)
![tuidao_7.png](tuidao_7.png)

## tensorflow lenet实现
### 输入
```python
import tensorflow as tf
import tensorflow.contrib.slim as slim


class Lenet(object):

	def __init__(self):
		self.raw_images = tf.placeholder(tf.float32, 
							shape=[None, 784], name='images_input')
		self.raw_labels = tf.placeholder(tf.float32, 
							shape=[None, 10], name='labels_input')
		self.keep_prob = tf.placeholder(tf.float32, name='keep_prob')
		''' `{需要修改shape为网络输入的size}`'''
		self.images = tf.reshape(self.raw_images, shape=[-1, 28,28,1])
		...
		#### Train ####
		...
		#### `{计算accuracy}` ####
		...
		#### `{计算loss}` ####
	}
			
}
```

### Lenet 网络实现
这部分实验了好久，主要的问题是每次训练得到的accuracy过低, 只有0.1左右, 
一直以为是accuracy的计算方式问题或者是net结构问题, 调整了好久. 
最终参考github上面star数量最多的两位前辈的代码，终于跑出了像样的accuracy.

```python
# https://github.com/ganyc717/LeNet
def construct_net2(self,is_train=True):
	with slim.arg_scope([slim.conv2d], padding='VALID',
			weights_initializer=tf.truncated_normal_initializer(stddev=0.01),
			weights_regularizer=slim.l2_regularizer(1e-5)):
		net = slim.conv2d(self.images,6,[5,5],1,padding='SAME',scope='conv1')
		net = slim.max_pool2d(net, [2, 2], scope='pool2')
		net = slim.conv2d(net,16,[5,5],1,scope='conv3')
		net = slim.max_pool2d(net, [2, 2], scope='pool4')
		net = slim.conv2d(net,120,[5,5],1,scope='conv5')
		net = slim.flatten(net, scope='flat6')
		net = slim.fully_connected(net, 84, scope='fc7')
		net = slim.dropout(net, 0.5, is_training=is_train, scope='dropout8')
		digits = slim.fully_connected(net, 10, scope='fc9')
		return digits
	pass
```

```python
# https://github.com/xiao-data/lenet

def conv2d(self, images, filter, bias, strides=1, padding="VALID"):
	feat_map = tf.nn.conv2d(images, filter=filter, 
		strides=[1, strides, strides, 1], padding=padding)
	feat_map = tf.nn.bias_add(feat_map, bias)
	return tf.maximum(0.1*feat_map, feat_map)
	pass

def max_pool2d(self, images, strides=2):
	return tf.nn.max_pool(images, ksize=[1,strides,strides,1],
		strides=[1,strides,strides,1], padding="VALID")
	pass

def fc(self, image, weights, bias):
	feat_img = tf.add(tf.matmul(image, weights), bias)
	return tf.maximum(0.1*feat_img, feat_img)
	pass

def construct_net(self):
	weights = {
		'conv1': tf.Variable(tf.random_normal([5,5,1,6])),
		'conv3': tf.Variable(tf.random_normal([5,5,6,16])),
		'conv5': tf.Variable(tf.random_normal([5,5,16,120])),
		'fc1' : tf.Variable(tf.random_normal([120, 84])),
		'fc2' : tf.Variable(tf.random_normal([84, 10]))
	}
	bias = {
		'conv1': tf.Variable(tf.random_normal([6])),
		'conv3': tf.Variable(tf.random_normal([16])),
		'conv5': tf.Variable(tf.random_normal([120])),
		'fc1' : tf.Variable(tf.random_normal([84])),
		'fc2' : tf.Variable(tf.random_normal([10]))
	}

	conv1 = self.conv2d(self.images, weights['conv1'], bias['conv1'], padding='SAME')
	pool2 = self.max_pool2d(conv1)
	conv3 = self.conv2d(pool2, weights['conv3'], bias['conv3'])
	pool4 = self.max_pool2d(conv3)
	conv5 = self.conv2d(pool4, weights['conv5'], bias['conv5'])
	flatten = tf.contrib.layers.flatten(conv5)
	fc1 = self.fc(flatten, weights['fc1'], bias['fc1'])
	fc2 = self.fc(fc1, weights['fc2'], bias['fc2'])
	fc2 = tf.nn.dropout(fc2, keep_prob=self.keep_prob)
	return fc2
	pass
```

### Lenet 计算loss
使用cross_entropy作为loss函数, 并且加入l2_regularization, 使用Adam Optimizer.

```python
cross_entropy = tf.reduce_mean(
	tf.nn.softmax_cross_entropy_with_logits(
		labels=self.raw_labels, 
		logits=self.train_output))
l2_loss = tf.contrib.layers.apply_regularization(
	regularizer=tf.contrib.layers.l2_regularizer(0.0005), 
	weights_list = tf.trainable_variables())
self.loss = cross_entropy + l2_loss

# `{对与net2, 0.01学习率太高, 0.00001学习率差不多}`
self.train_op = tf.train.AdamOptimizer(1e-3)
	.minimize(self.loss) # `{科学计数法}`
```

### Lenet 计算accuracy
比较预测得到的输出和原始数据输入labels, 将[True, True, False,...]转换成float.
再计算总和求平均. 
**注意: 必须使用和计算loss时使用的output, 否则预测率很低 **

```python
# `{计算准确性需要使用同一次计算的输出, 否则会出现loss变低. 但是accuracy仍然不高的情况}`
self.prediction = tf.nn.softmax(self.train_output, 1)
correct_pred = tf.equal(
	tf.argmax(self.prediction, 1), 
	tf.argmax(self.raw_labels, 1))
self.train_accuracy = tf.reduce_mean(
	tf.cast(correct_pred, tf.float32))
```

### Lenet 训练
加载MNIST数据集, 分批次投喂给Lenet, 打印accuracy和loss.
```python
import tensorflow as tf
from tensorflow.examples.tutorials.mnist \
	import input_data
from lenet import Lenet

def main(argv):
	tf.reset_default_graph()
	# `{读取数据}`
	mnist = input_data.read_data_sets('MNIST_data/', one_hot=True)
	# `{训练}`
	lenet = Lenet()
	sess = tf.Session()

	is_trianed = False
	saver = tf.train.Saver()
	model_file = tf.train.latest_checkpoint("MNIST_model/")
	if model_file != None:
		saver.restore(sess, model_file)
		is_trianed = True
		print("restore variables from model file!")
	else:
		sess.run(tf.global_variables_initializer())

	if not is_trianed:
		for i in range(10000):
			batch = mnist.train.next_batch(50)
			if i % 100 == 0:
				train_accuracy, train_loss = sess.run(
					[lenet.train_accuracy, lenet.loss], 
					feed_dict={
					lenet.raw_images: mnist.validation.images[:1000] , lenet.raw_labels: mnist.validation.labels[:1000], lenet.keep_prob:1
					})
				print("After %d iteration, the loss is %g, the accuracy is %g" % (i, train_loss, train_accuracy))
			pass

		_, output = sess.run(
			[lenet.train_op,lenet.train_output],
			feed_dict={lenet.raw_images: batch[0], lenet.raw_labels:batch[1], lenet.keep_prob:1
		})
		# print(output)
		pass
	saver.save(sess, "MNIST_model/mnist.ckpt")
	pass

	print("Train model success! \
		Start test accuracy on test set!")
	# `{测试}`
	train_accuracy = sess.run(lenet.train_accuracy, feed_dict={
		lenet.raw_images: mnist.test.images, lenet.raw_labels: mnist.test.labels, lenet.keep_prob: 1
		})
	print("the mean accuracy of test set is %g" % (train_accuracy))
	print("Process End!")
	pass

if __name__ == '__main__':
	tf.app.run()
	pass
```

### 运行结果
![mean-accuracy.png](mean-accuracy.png)

```shell
~/python.exe E:/document/python/Lenet/Train.py
Extracting MNIST_data/train-images-idx3-ubyte.gz
Extracting MNIST_data/train-labels-idx1-ubyte.gz
Extracting MNIST_data/t10k-images-idx3-ubyte.gz
Extracting MNIST_data/t10k-labels-idx1-ubyte.gz
2019-03-30 21:40:19.775733: I C:\tf_jenkins\home\workspace\rel-win\M\windows\PY\36\tensorflow\core\platform\cpu_feature_guard.cc:137] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX AVX2
After 0 iteration, the loss is 26481.4, the accuracy is 0.112
After 100 iteration, the loss is 659.815, the accuracy is 0.164
After 200 iteration, the loss is 437.044, the accuracy is 0.263
After 300 iteration, the loss is 310.122, the accuracy is 0.384
After 400 iteration, the loss is 234.881, the accuracy is 0.469
After 500 iteration, the loss is 194.672, the accuracy is 0.559
...
After 9600 iteration, the loss is 18.8913, the accuracy is 0.949
After 9700 iteration, the loss is 18.5993, the accuracy is 0.946
After 9800 iteration, the loss is 18.8633, the accuracy is 0.943
After 9900 iteration, the loss is 18.4148, the accuracy is 0.94
Train model success! Start test accuracy on test set!
the mean accuracy of test set is 0.9504
Process End!

Process finished with exit code 0
```



