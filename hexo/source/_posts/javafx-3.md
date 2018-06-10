---
title: JavaFX 学习(3)
date: 2018-04-05 09:25:09
tags: JavaFX
author: GT
---

## JavaFX 学习
这篇博客主要记录JavaFX UI控件相关知识。
参考:
[1]. [第三篇 使用JavaFX UI组件](http://www.javafxchina.net/blog/docs/tutorial3/)

### 使用JavaFX UI控件
JavaFX UI控件的包在[javafx.scene.control](https://docs.oracle.com/javafx/2/api/javafx/scene/control/package-summary.html)

<!-- more -->

1. [标签Label](http://www.javafxchina.net/blog/?p=23)
	标签(Label)是一个不可编辑文本的控件，用于显示文本。
	1. 继承关系 `public class Label extends Labled`
		|-- java.lang.Object
		|  |-- javafx.scene.Node
		|  |  |-- javafx.scene.Parent
		|  |  |  |-- javafx.scene.control.Control
		|  |  |  |   |-- javafx.scene.control.Labeled
		|  |  |  |   |  |-- javafx.scene.control.Label
	2. 构造函数
		* `Label()` Creates an empty label
		* `Label(java.lang.String text)` Creates Label with supplied text.
		* `Label(java.lang.Striing text,Node graphic)` Creates a label wuth the supllied text and graphic
	
	3. 主要属性
		* labelFor - A Label can act as a label for a different Control or Node.
		* 继承自Labeled的的属性
			contextMenu, height, maxHeight, maxWidth, minHeight, minWidth, prefHeight, prefWidth, skinClassName, skin, tooltip, width
	4. 主要方法
		* `void setLabelFor(Node node)` `Node getLabelFor()`
		* 继承自Labeled的的方法
			alignmentProperty, contentDisplayProperty, ellipsisStringProperty, fontProperty, getAlignment, getContentBias, getContentDisplay, getEllipsisString, getFont, getGraphic, getGraphicTextGap, getLabelPadding, getText, getTextAlignment, getTextFill, getTextOverrun, graphicProperty, graphicTextGapProperty, isMnemonicParsing, isUnderline, isWrapText, labelPaddingProperty, mnemonicParsingProperty, setAlignment, setContentDisplay, setEllipsisString, setFont, setGraphic, setGraphicTextGap, setMnemonicParsing, setText, setTextAlignment, setTextFill, setTextOverrun, setUnderline, setWrapText, textAlignmentProperty, textFillProperty, textOverrunProperty, textProperty, underlineProperty, wrapTextProperty
	eg:
	```java
	public void start(Stage primaryStage) {
		try {
			Label label = new Label();
			label.setText("Hello World!");
			Scene scene = new Scene(label,400,400);
			scene.getStylesheets().add(getClass().getResource("application.css").toExternalForm());
			primaryStage.setScene(scene);
			primaryStage.show();
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	```
	![QQ截图20180405100100.png](QQ截图20180405100100.png)
	
2. [按钮Button](http://www.javafxchina.net/blog/?p=120)
	JavaFX API中的Button类用来处理用户点击一个按钮时执行一个动作。
	1. 继承关系
		|-- java.lang.Object 
		|  |-- javafx.scene.Node 
		|  |  |-- javafx.scene.Parent 
		|  |  |  |-- javafx.scene.control.Control 
		|  |  |  |  |-- javafx.scene.control.Labeled 
		|  |  |  |  |  |-- javafx.scene.control.ButtonBase 
		|  |  |  |  |  |   |-- javafx.scene.control.Button 
	2. 构造函数
		* `Button()` - 一个空的Button
		* `Button(String text)` - 一个指定文本标题的Button
		* `Button(String text, Node Grapgic)` - 一个指定文本标题和图标的Button
			也可以通过方法设置:
			* `setText(String text)` 设置文本标题
			* `setGraphic(Node graphic)` 指定图标
	3. 3种按钮模式
		* `Normal` 普通按钮
		* `Default` 默认按钮即为OK的意思，接受键VK_ENTER
		* `Cancel` 取消按钮即为Cancel的意思，接受键VK_ESC
	4. 添加Action监听器
		```java
		button.setOnAction(ActionEvent e){
			label.setText("Accepted");
		}
		```
	5. 添加视觉效果
		由于Button继承自Node类，因此可以为Button添加javafx.scene.effect包下的任何特殊效果。
		```java
		DropShadow shadow = new DropShadow();
		button.setEffect(shadow);//设置阴影效果
		```
3. [单选按钮（Radio Button）](http://www.javafxchina.net/blog/?p=133)
4. [开关按钮（Toggle Button）](http://www.javafxchina.net/blog/?p=127)
5. [复选框（Checkbox）](http://www.javafxchina.net/blog/?p=139)
6. [选择框（Choice Box）](http://www.javafxchina.net/blog/?p=150)
7. [文本框（Text Field）](http://www.javafxchina.net/blog/?p=155)
8. [密码框（Password Field）](http://www.javafxchina.net/blog/?p=165)
9. [滚动条（Scroll Bar）](http://www.javafxchina.net/blog/?p=173)
10. [滚动面板（Scroll Pane）](http://www.javafxchina.net/blog/?p=188)
11. [列表视图（List View）](http://www.javafxchina.net/blog/?p=209)
12. [表格视图（Table View）](http://www.javafxchina.net/blog/?p=226)
13. [树视图（Tree View）](http://www.javafxchina.net/blog/?p=250)
14. [树表视图（Tree Table View）](http://www.javafxchina.net/blog/?p=252)
15. [组合框（Combo Box）](http://www.javafxchina.net/blog/?p=254)
16. [分隔符（Separator）](http://www.javafxchina.net/blog/?p=256)
17. [滑块（Slider）](http://www.javafxchina.net/blog/?p=258)
18. [进度条和进度指示器（Progress Bar and Progress Indicator）](http://www.javafxchina.net/blog/?p=260)
19. [超链接（Hyperlink）](http://www.javafxchina.net/blog/?p=262)
20. [HTML编辑器（HTML Editor）](http://www.javafxchina.net/blog/?p=375)
21. [提示信息（Tooltip）](http://www.javafxchina.net/blog/?p=386)
22. [带有标题的面板和可折叠面板（Titled Pane and Accordion）](http://www.javafxchina.net/blog/?p=391)
23. [菜单（Menu）](http://www.javafxchina.net/blog/?p=400)
24. [颜色选择器（Color Picker）](http://www.javafxchina.net/blog/?p=410)
25. [日期选择器（Date Picker）](http://www.javafxchina.net/blog/?p=422)
26. [分页控件（Pagination Control）](http://www.javafxchina.net/blog/?p=434)
27. [文件选择框（File Chooser）](http://www.javafxchina.net/blog/?p=447)
28. [自定义UI控件（Customization of UI Controls）](http://www.javafxchina.net/blog/?p=459)
29. [嵌入式平台的UI控件（UI Controls on the Embedded Platforms）](http://www.javafxchina.net/blog/?p=469)

**实在是太多了，，，不一一搬运了。。。**

### 给UI控件添加样式
1. 定义样式
	一般来说，创建的样式表都应该以.css为后缀，
	并且应该与你JavaFX程序的main class放在同一个路径下。
	eg:
	```CSS
	.button{
		-fx-font: 32 aria
		-fx-backgroound-color: #ccccff
	}
	```
2. 使用样式
	```java
	Scene scene = new Scene(new Group(),400,400);
	scene.getStylesheets().add("path/stylesheet.css");
	```
3. 分配Class Style
	```java
	Button buttonAccept = new Button("Accept");
	buttonAccept.getStyleClass().add("button1");
	```
4. 分配ID Style
	```java
	Button buttonFont = new Button("Font");
	buttonFont.setId("font-button");
	```
5. 声明内联样式
	```java
	Button buttonColor = new Button("Color");
	buttonColor.setStyle("-fx-background-color: slateblue; -fx-text-fill: white;");
	```

-------------------------------------------------
我个人只是需要个界面，暂时还不需要了解太深入，日后再做研究。