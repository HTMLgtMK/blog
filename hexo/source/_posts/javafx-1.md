---
title: javaFX 学习(1)
date: 2018-04-04 10:09:54
tags: javaFX
author: GT
---

## JavaFX 学习
学习javaFx是由于我的无人超市项目需要读写标签，在windows环境下开发图形界面的需求。
教程地址: [第一篇 开始学习JavaFX](http://www.javafxchina.net/blog/docs/tutorial1/)

### JavaFX 优点:
1. 层级样式表（CSS）将外观和样式与业务逻辑实现进行了分离，如果你具有Web设计背景，
	或者你希望分离用户界面（UI）和后端逻辑，那么你可以通过FXML脚本语言来表述图形界面并且使用Java代码来表述业务逻辑。
	如果你希望通过非编码的方式来设计UI，则可以使用JavaFX Scene Builder。
	在你进行UI设计时，Scene Builder会创建FXML标记，它可以与一个集成开发环境（IDE）对接，这样开发人员可以向其中添加业务逻辑。

2. JavaFX库被写成了Java API，因此JavaFX应用程序可以调用各种Java库中的API。同时，JavaFX也具有跨平台兼容性。

<!-- more -->

### 关键特性
1. Java API: JavaFX是一个Java库。
2. FXML和Scene Builder: FXML是一种基于XML的声明式标记语言，用于描述JavaFX应用程序的用户界面。
	Scene Builder(交互式)生成的FXML标记可以与IDE对接，这样开发者可以添加业务逻辑。
3. WebView: 使用了WebKitHTML技术的Web组件，可用于JavaFX应用程序中潜入Web页面。
	在WebView中运行的JavaScript可以方便的调用JavaAPI， 并且JavaAPI也可以调用WebView中的JS。
4. 与Swing互操作
5. 内置的UI控件和CSS: JavaFX提供了开发一个全功能应用程序所需的所有主要控件。
	这些组件可以使用标准的Web技术如css进行装饰。
6. Modena主题
7. 3D图像处理能力
8. Canvas API: Canvas API允许在由一个图形元素(node)组成额JavaFX场景(Scene)的一个区域中直接绘图。
9. Printing API：JavaFX 8中加入了print包并且提供了打印功能公共类。
10. Rich Text支持
11. 多点触摸。。。
...

### 创建JavaFX应用程序
1. 进入JavaSE下载页面：
	[http://www.oracle.com/technetwork/java/javase/downloads/](http://www.oracle.com/technetwork/java/javase/downloads/)
	下载带有 JavaFX 8.n的Oracle® JDK 8。
	Certified System Configurations和Release Notes的链接也可以在这个页面中找到。
2. 创建JavaFX应用程序
3. 使用JavaFX Scene Builder看通过非编码方式设计JavaFX应用程序UI。
	* 从JavaFX 下载页面下载JavaFX Scene Builder：
		http://www.oracle.com/technetwork/java/javase/downloads/.
	* 根据《使用JavaFX Scene Builder（Getting Started with JavaFX Scene Builder）》教程来学习更多内容。
-----------------------------------------------------------

### 使用Eclipse创建JavaFX程序
1. 首先确保至少安装了jdk8，并配置好了环境变量。我选的是jdk8u161。
2. 安装Eclip，其它编辑器也可以，我选用了Eclipse。
	我选的是[Eclipse IDE for Java Developers ](http://www.eclipse.org/downloads/packages/eclipse-ide-java-developers/oxygen3)，下载安装后还需要安装`E(fx)clipse`插件。
	1. E(fx)clipse插件: http://download.eclipse.org/efxclipse/updates-released/2.1.0/site
	2. xtext插件: http://download.eclipse.org/modeling/tmf/xtext/updates/composite/releases/
	安装插件位置: Help -> Install new Software, 其他的自行百度。
	安装完插件需要重启Eclipse。到这里，环境就搭建好了。
3. 创建JavaFX应用程序
	1. File->new->Project->JavaFx->JavaFX Project
		![QQ截图20180404162006.png](QQ截图20180404162006.png)
	2. Next -> 输入Project Name,选择Jre，其它项默认，然后finish即可。
		![QQ截图20180404162138.png](QQ截图20180404162138.png)
	3. 生成的目录结构如图。
		![QQ截图20180404162403.png](QQ截图20180404162403.png)
	4. 此时可以点击运行程序，可以看到空白框。
		![QQ截图20180404162856.png](QQ截图20180404162856.png)