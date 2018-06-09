---
title: JavaFX 学习(5)
date: 2018-04-05 23:09:33
tags: JavaFX
---

## JavaFX 学习
这篇博客主要记录一些开发中遇到的问题。
有些初级的东西，一开始也不懂，还是记录下来。

1. java UI控件绑定fxml中的控件
	```java
	Pane pane = FXMLLoader.load(getClass().getResource("login.fxml"));
	Pane.lookup("#fx:id");//id选择器
	```
<!-- more -->
2. JavaFX中有Dialog控件，但是我在使用过程中发现关闭不了。。
	查了StackOverflow发现:
	> JavaFX dialogs can only be closed 'abnormally' (as defined above) in two situations: 
	> When the dialog only has one button, or
	> When the dialog has multiple buttons, as long as one of them meets one of the following requirements: 
	> The button has a ButtonType whose ButtonData is of type ButtonData.CANCEL_CLOSE. 
	> The button has a ButtonType whose ButtonData returns true when ButtonData.isCancelButton() is called.
	
	后来发现好多别人的代码都是用Stage实现Dialog。
	```java
	private Stage getLoginInfoDialog() {
		Stage dialog = new Stage(StageStyle.TRANSPARENT);
		ProgressIndicator pi = new ProgressIndicator();
		Text text = new Text("登陆中");
		VBox vbox = new VBox();
		vbox.setAlignment(Pos.CENTER);
		vbox.setSpacing(10);
		vbox.setPadding(new Insets(10,10,10,10));
		pi.setPadding(new Insets(10, 10, 10, 10));
		text.setFill(Color.WHITE);
		vbox.getChildren().addAll(pi,text);
		vbox.setStyle("-fx-background-color:#000000;-fx-border-radiu:10px;-fx-background-radiu:10px;");
		Scene scene = new Scene(vbox);
		dialog.setScene(scene);
		dialog.setOpacity(0.5);
		dialog.initModality(Modality.APPLICATION_MODAL);
		dialog.initOwner(this.stage);
		return dialog;
	}
	...
	dialog.hide();//关闭dialog
	```
	这里有个问题，ProgressIndicator不能居中显示，很是郁闷，后面再调试了。
3. 子线程不能操作Application Thread 问题
	其实早就想到了这个问题，但是不知道怎么解决。现在给出一个方案:
	```java
	//在子线程中，将需要操作Applicaton Thread的部分放在下面区块中
	Platform.runLater(new Runnable() {
						
		@Override
		public void run() {
			// TODO Auto-generated method stub
		}
	});
	```
4. JSON-lib jar包问题
	由于项目中需要解析json数据，很自然想到了JSONObject，但是这次下载的jdk似乎没有json-lib。
	我下载了json-lib-2.4-jdk15.jar后，加入build path,发现能够编译，但是运行出错。
	查了博客发现还少几个jar包。。。贴出来以备后面需要。。
	
	> java.lang.NoClassDefFoundError: org/apache/commons/lang/exception/NestableRuntimeException
	> 可以看出是因为缺少jar包，但是很明显我已经导入了，为什么还会报这个错呢？

	> commons-beanutils-1.8.0.jar不加这个包 , 出现Error:
	> java.lang.NoClassDefFoundError: org/apache/commons/beanutils/DynaBean 
	> commons-collections.jar 不加这个包 , 出现Error:
	> java.lang.NoClassDefFoundError: org/apache/commons/collections/map/ListOrderedMap
	> commons-lang-2.4.jar不加这个包 ,出现Error:
	> java.lang.NoClassDefFoundError: org/apache/commons/lang/exception/NestableRuntimeException
	> commons-logging-1.1.1.jar不加这个包 , 出现Error:
	> java.lang.NoClassDefFoundError: org/apache/commons/logging/LogFactory 
	> ezmorph-1.0.4.jar不加这个包 , 出现Error:
	> java.lang.NoClassDefFoundError: net/sf/ezmorph/Morpher 
	> json-lib-2.3-jdk15.jar不加这个包 ,出现Error: 
	> java.lang.NoClassDefFoundError: net/sf/json/JSONObject 
	
	相应jar包可到网上下载 
