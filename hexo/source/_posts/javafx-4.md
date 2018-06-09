---
title: JavaFX 学习(4)
date: 2018-04-05 11:16:40
tags: JavaFX
author: GT
---

## JavaFX 学习
这篇博客主要记录JavaFX中布局相关技术。

参考:
[1]. [第五篇 使用JavaFX中的布局](http://www.javafxchina.net/blog/docs/tutorial5/)

主要有以下3个主题：
* 使用内置的布局面板 – 介绍内置的布局面板，以及为每个面板提供简单的示例。
* 调整节点大小和对齐的技巧 – 提供了覆盖节点的默认大小和位置的示例。
* 使用CSS调整布局面板样式 – 介绍如何使用CSS来自定义布局面板。

### 使用内置的布局面板
使用布局面板(Pane)来简化JavaFX应用程序中的用户界面的管理。

<!-- more -->

1. 边框面板(BorderPane)
	BorderPane布局面包被划分为5个区域来放置界面元素：上、下、左、右、中。
	图1-1显示了BorderPane的布局示意图。每个区域的大小是没有限制的。
	在你使用BorderPane时，如果不需要某个区域，你只要不为该区域设置内容，
	该区域则不会被分配显示空间，自然也就不会显示。
	![图1-1](5-1-1-border.png)
	BorderPane常用于定义一个非常经典的布局效果：上方是菜单栏和工具栏，下方是状态栏，左边是导航面板，右边是附加信息面板，中间是核心工作区域。
	eg：
	```java
	BorderPane border = new BorderPane();
	HBox hbox = addHBox()
	border.setTop(hbox);
	border.setLeft(addVBox());
	addStackPane(hbox); //添加一个堆栈面板到上方区域的HBox中

	border.setCenter(addGridPane());
	border.setRight(addFlowPane());
	border.setBottom(node);
	```
2. 水平盒子(HBox)
	HBox布局面板为将多个节点排列在一行中提供了一个简单的方法。
	图1-2是HBox的一个示例。	
	![图1-2](5-1-2-hbox.png)
	```java
	public HBox addHBox(){
	   HBox hbox = new HBox();
	   hbox.setPadding(new Insets(15, 12, 15, 12)); //节点到边缘的距离
	   hbox.setSpacing(10); //节点之间的间距
	   hbox.setStyle(“-fx-background-color: #336699;”); //背景色

	   Button buttonCurrent = new Button(“Current”);
	   buttonCurrent.setPrefSize(100, 20);

	   Button buttonProjected = new Button(“Projected”);
	   buttonProjected.setPrefSize(100, 20);
	   hbox.getChildren().addAll(buttonCurrent, buttonProjected);

	   return hbox;
	}
	```
3. 垂直盒子(VBox)
	VBox布局面板和HBox很类似，只是其包含的节点是排成一列。
	图1-4显示了一个VBox的示例。
	![图1-4](5-1-4-vbox.png)
	设置内边距(Padding)属性可以管理节点到VBox边缘的距离。
	设置间距(Spacing)属性可以管理节点之间的距离。
	设置外边距(Margin)属性可以为单个控件周围增加额外的空间。
	```java
	public VBox addVBox(); {
	   VBox vbox = new VBox();
	   vbox.setPadding(new Insets(10)); //内边距
	   vbox.setSpacing(8); //节点间距

	   Text title = new Text("Data");
	   title.setFont(Font.font("Arial", FontWeight.BOLD, 14));
	   vbox.getChildren().add(title);

	   Hyperlink options[] = new Hyperlink[] {
		   new Hyperlink("Sales"),
		   new Hyperlink("Marketing"),
		   new Hyperlink("Distribution"),
		   new Hyperlink("Costs")};

	   for (int i=0; i<4; i++){
		   VBox.setMargin(options[i], new Insets(0, 0, 0, 8)); //为每个节点设置外边距
		   vbox.getChildren().add(options[i]);
	   }

	   return vbox;
	}
	```
	![图1-5](5-1-5-vbox_in_border.png)
4. 堆栈面板(StackPan)
	StackPane布局面板将所有的节点放在一个堆栈中进行布局管理，
	后添加进去的节点会显示在前一个添加进去的节点之上。
	这个布局为将文本(Text)覆盖到一个图形(Shape)或者图像(Image)之上，
	或者将普通图形相互覆盖来创建更复杂的图形，提供了一个简单的方案。
	图1-6显示了一个帮助按钮，它是通过在一个具有渐变背景的矩形上堆叠一个问号标志来实现的。
	![图1-6](5-1-6-stack.png)
	```java
	public void addStackPane(HBox hb){
	   StackPane stack = new StackPane();
	   Rectangle helpIcon = new Rectangle(30.0, 25.0);
	   helpIcon.setFill(new LinearGradient(0,0,0,1, true, CycleMethod.NO_CYCLE,
		   new Stop[]{
		   new Stop(0,Color.web(“#4977A3”)),
		   new Stop(0.5, Color.web(“#B0C6DA”)),
		   new Stop(1,Color.web(“#9CB6CF”)),}));
	   helpIcon.setStroke(Color.web(“#D0E6FA”));
	   helpIcon.setArcHeight(3.5);
	   helpIcon.setArcWidth(3.5);

	   Text helpText = new Text(“?”);
	   helpText.setFont(Font.font(“Verdana”, FontWeight.BOLD, 18));
	   helpText.setFill(Color.WHITE);
	   helpText.setStroke(Color.web(“#7080A0”));

	   stack.getChildren().addAll(helpIcon, helpText);
	   stack.setAlignment(Pos.CENTER_RIGHT); //右对齐节点

	   StackPane.setMargin(helpText, new Insets(0, 10, 0, 0)); //设置问号居中显示
	   hb.getChildren().add(stack); // 将StackPane添加到HBox中
	   HBox.setHgrow(stack, Priority.ALWAYS); // 将HBox水平多余的所有空间都给StackPane，这样前面设置的右对齐就能保证问号按钮在最右边
	}
	```
	![图1-7](5-1-7-hbox_stack.png)
5. 网格面板(GridPane)
	GridPane布局面板使你可以创建灵活的基于行和列的网格来放置节点。
	节点可以被放置到任意一个单元格中，也可以根据需要设置一个节点跨越多个单元格(行或者列)。
	GridPane对于创建表单或者其他以行和列来组织的界面来说是非常有用的。
	![图1-8 GridPane 示例](5-1-8-grid.png)
	```java
	public GridPane addGridPane(){
	   GridPane grid = new GridPane();
	   grid.setHgap(10);
	   grid.setVgap(10);
	   grid.setPadding(new Insets(0, 10, 0, 10));

	   // 将category节点放在第1行,第2列
	   Text category = new Text(“Sales:”);
	   category.setFont(Font.font(“Arial”, FontWeight.BOLD, 20));
	   grid.add(category, 1, 0);

	   // 将chartTitle节点放在第1行,第3列
	   Text chartTitle = new Text(“Current Year”);
	   chartTitle.setFont(Font.font(“Arial”, FontWeight.BOLD, 20));
	   grid.add(chartTitle, 2, 0);

	   // 将chartSubtitle节点放在第2行,占第2和第3列
	   Text chartSubtitle = new Text(“Goods and Services”);
	   grid.add(chartSubtitle, 1, 1, 2, 1);

	   // 将House图标放在第1列，占第1和第2行
	   ImageView imageHouse = new ImageView(
		 new Image(LayoutSample.class.getResourceAsStream(“graphics/house.png”)));
	   grid.add(imageHouse, 0, 0, 1, 2);

	   // 将左边的标签goodsPercent放在第3行，第1列，靠下对齐
	   Text goodsPercent = new Text(“Goods\n80%”);
	   GridPane.setValignment(goodsPercent, VPos.BOTTOM);
	   grid.add(goodsPercent, 0, 2);

	   // 将饼图放在第3行，占第2和第3列
	   ImageView imageChart = new ImageView(
		 new Image(LayoutSample.class.getResourceAsStream(“graphics/piechart.png”)));
	   grid.add(imageChart, 1, 2, 2, 1);

	   // 将右边的标签servicesPercent放在第3行，第4列，靠上对齐
	   Text servicesPercent = new Text(“Services\n20%”);
	   GridPane.setValignment(servicesPercent, VPos.TOP);
	   grid.add(servicesPercent, 3, 2);

	   return grid;
	}
	```
	![图1-9](5-1-9-grid_in_border.png)
6. 流面板(FlowPane)
	FlowPane布局面板中包含的节点会连续地平铺放置，并且会在边界处自动换行(或者列)。
	这些节点可以在垂直方向(按列)或水平方向(按行)上平铺。
	垂直的FlowPane会在高度边界处自动换列，水平的FlowPane会在宽度边界处自动换行。
	![图1-10](5-1-10-flow.png)
	设置间隙属性(Gap)用于管理行和列之间的距离。设置内边距属性(Padding)用于管理节点元素和FlowPane边缘之间的距离。
	如图1-10所示，创建带有一系列的页面图标的水平FlowPane：
	```java
	public FlowPane addFlowPane(){
	   FlowPane flow = new FlowPane();
	   flow.setPadding(new Insets(5, 0, 5, 0));
	   flow.setVgap(4);
	   flow.setHgap(4);
	   flow.setPrefWrapLength(170); // 预设FlowPane的宽度，使其能够显示两列
	   flow.setStyle(“-fx-background-color: DAE6F3;”);

	   ImageView pages[] = new ImageView[8];
	   for (int i=0; i<8; i++){
		   pages[i] = new ImageView(
			   new Image(LayoutSample.class.getResourceAsStream(
			   “graphics/chart_”+(i+1)+”.png”)));
		   flow.getChildren().add(pages[i]);
	   }

	   return flow;
	}
	```
	![图1-11](5-1-11-flow_in_border.png)
7. 磁贴面板(TilePane)
	TilePane布局面板和FlowPane很相似。TilePane将其包含的节点都放在一个网格中，
	其中每格或者每块磁贴的大小都是一样的。
	节点可以按水平方向(行)进行排列，或者以垂直方向(列)进行排列。
	水平排列时会在TilePane的宽度边界处对Tile进行自动换行，垂直排列时会在TilePane的高度边界处对Tile进行自动换列。
	使用prefColumns和prefRows属性可以设定TilePane的首选大小。
	设置间隙属性(Gap)用来管理行和列之间间距。
	设置内边距属性(Padding)用来设管理节点元素和TilePane边缘之间的距离。
	```java
	TilePane tile = new TilePane();
	tile.setPadding(new Insets(5, 0, 5, 0));
	tile.setVgap(4);
	tile.setHgap(4);
	tile.setPrefColumns(2);
	tile.setStyle(“-fx-background-color: DAE6F3;”);

	ImageView pages[] = new ImageView[8];
	for (int i=0; i<8; i++){
		 pages[i] = new ImageView(
		   new Image(LayoutSample.class.getResourceAsStream(
		   “graphics/chart_”+(i+1)+”.png”)));
		 tile.getChildren().add(pages[i]);
	}
	```
8. 锚面板(AnchorPane)
	AnchorPane布局面板可以让你将节点锚定到面板的顶部、底部、左边、右边或者中间位置。
	当窗体的大小变化时，节点会保持与其锚点之间的相对位置。
	一个节点可以锚定到一个或者多个位置，并且多个节点可以被锚定到同一个位置。
	![图1-12](5-1-12-anchor.png)
	```java
	public AnchorPane addAnchorPane(GridPane grid){
	   AnchorPane anchorpane = new AnchorPane();

	   Button buttonSave = new Button(“Save”);
	   Button buttonCancel = new Button(“Cancel”);

	   HBox hb = new HBox();
	   hb.setPadding(new Insets(0, 10, 10, 10));
	   hb.setSpacing(10);
	   hb.getChildren().addAll(buttonSave, buttonCancel);

	   anchorpane.getChildren().addAll(grid,hb); //添加来自例1-5 的GridPane
	   AnchorPane.setBottomAnchor(hb, 8.0);
	   AnchorPane.setRightAnchor(hb, 5.0);
	   AnchorPane.setTopAnchor(grid, 10.0);

	   return anchorpane;
	}
	```
	下面的代码语句将BorderPane的中间区域替换为上面创建的AnchorPane。
	```java
	border.setCenter(addAnchorPane(addGridPane()));
	```
	![图1-13](5-1-13-anchor_in_border_big.png)

### 调整节点大小和对齐的技巧
UI控件(Control)和布局面板(Layout Pane)是可以调整大小的。
但是形状(Shape)、文本(Text)以及组(Group)是不可以调整大小的，它们在布局中被认为是刚性对象(Rigid Objects)。

...
-------------------------------------------------
注意对比Java Swing布局和Android 布局。

	