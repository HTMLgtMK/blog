---
title: 'javaFX 学习(2)'
date: 2018-04-04 17:23:38
tags: javaFX
author: GT
---

## javaFX学习
这篇博客主要记录一下JavaFX应用程序的生命周期和要类。
JavaFX官方文档:[JavaFX参考文档](https://docs.oracle.com/javafx/2/api/overview-summary.html)

### JavaFX应用程序生命周期(life-cycle)
javaFX 应用程序的入口点是Application Class，程序运行时按如下顺序执行：
1. Constructs am instance of the specified Application class.
	继承了Application类的实例的构造函数。
2. Calls the `init` method.
	调用`init()`方法。
3. Calls the `start` method.
	调用`start()`方法。
	**注: start(Stage stage) 方法是抽象方法，必须重载。**
4. Wait for the application to finish, which happens when either of the following occurs:
	* the application calls `Platform.exit()`.
	* the last window has been closed and the `implictExit` attribute on Platform is true.
5. Calls the `stop` method.
	调用`stop()`方法。
	
<!-- more -->
	
### `javafx.stage.Stage`类的解析

1. 继承关系 `public class Stage extends Window`
	|- java.lang.Object
	| |- javafx.stage.Window
	| | |- javafx.stage.Stage
2. The JavaFX Stage class is the top level JavaFX container.
	The primary Stage is constructed by the platform. 
	Additional Stage objects may be constructed by the application.
	Stage objects must be constructed and modified on the JavaFX Application Thread. 
	Many of the Stage properties are read only because they can be changed externally by the underlying platform and therefore must not be bindable. 
	
	* `Stage`类是JavaFX中的顶级容器，类似Swing中的JWindow的顶级容器，代表一个窗口。
	* 最初的Stage是由Platform构造，其它Stage是由Application构造。
	* Stage对象必须在JavaFX Application线程中构造和操作。
	* 由于Stage可能被潜在的外部Platform修改，因此许多的Stage的属性都是只读的。
	
	2.1 Stage样式(Style)
		1. `StageStyle.DECORATED` -a stage with a solid white background and platform decorations
		2. `StageStyle.UNDECORATED` -a stage with a solid white background and no decorations.
		3. `StageStyle.TRANSPARENT` -a stage with a transparent background and no decorations.
		4. `StageStyle.UTILITY` -a stage with a solid white background and minimal platform decorations.
	
	2.2 Modality 舞台的模态
		1. `Modality.NONE` -a stage that does not block any other window.
		2. `Modality.WINDOW_MODAL` - a stage that blocks input events from being delivered  to all windows form its owner(parent) 
			to its root. Its root is the closest ancestor window without an owner.
		3. `Modality.APPLICATION_MODAL` -a stage that blocks input events from being delivered to all windows from the same application,
			except for those  from its child hierarchy.
		
		注: 使用`show()`方法会不会阻塞Caller，无论声明的是哪种模态类型；
			使用`showAndWait()`方法会阻塞Caller，需要等到窗口关闭后才能有返回值。
			
	2.3 主要方法和属性
		* `fullScreen` 只读布尔属性，specifies whether this Stage should be a full-screen,undecorated window.
		* 继承自`javafx.stage.Window`的属性:
			eventDispatcher, focused, height, onCloseRequest, onHidden, onHiding, onShowing, onShown, opacity, scene, showing, width, x, y
		* 构造方法
			* `Stage()` create a new instance of decorated Stage.
			* `Stage(StageStyle style)` create a new instance of Stage.
		* `void close()` Close this Stage.
		* `void setFullScreen(boolean value)` Sets the value of the propety fullScreen`.
		* `void setScene(Scene scene)` Specify the scene to be used on this stage.
		* `void setTitle(java.lang.String value)` Sets the value of propety title.
		* `void show()` Attempts to show this Window by setting visibility to true.
		* `void showAndWait()` Shows this stage and waits for it to be hidden (closed) before returning to the caller.
		* `void toBack()` Send the Window to the background.
		* `void toFront()` Bring the Window to the foreground.
		* 继承自`javafx.stage.Window`的方法:
			addEventFilter, addEventHandler, buildEventDispatchChain, centerOnScreen, eventDispatcherProperty, fireEvent, focusedProperty, getEventDispatcher, getHeight, getOnCloseRequest, getOnHidden, getOnHiding, getOnShowing, getOnShown, getOpacity, getScene, getWidth, getX, getY, heightProperty, hide, isFocused, isShowing, onCloseRequestProperty, onHiddenProperty, onHidingProperty, onShowingProperty, onShownProperty, opacityProperty, removeEventFilter, removeEventHandler, requestFocus, sceneProperty, setEventDispatcher, setEventHandler, setHeight, setOnCloseRequest, setOnHidden, setOnHiding, setOnShowing, setOnShown, setOpacity, setWidth, setX, setY, showingProperty, sizeToScene, widthProperty, xProperty, yProperty

### Threading线程
参考:
[1]. [javafx官方文档学习之一Application与Stage,Scene初探 作者: 浮沉雄鹰](https://blog.csdn.net/xby1993/article/details/17203977)

`Launch Thread`启动线程和`Application Thread`应用线程的区别
Lacunch Thread启动线程是javafx运行时触发的，它会负责构造Application对象和调用Application对象的init()方法，这意味着主State主场景是在launcher Thread线程中被构造的，（因为它是init方法的参数）故而我们可以不用管它，直接拿来用就可以了。但是launch Thread并不是UI线程。它的工作也就只是上面所说的。
Application Thread:相当于Swing中的UI事件分派线程EDT。

<table>
	<tr>
		<td>HostServices</td>
		<td>`getHostServices()`<br/> Gets the HostServices provider for this application. </td>
	</tr>
	<tr>
		<td>Application.Parameters</td>
		<td>`getParameters()`</br>Retrieves the parameters for this Application, including any arguments passed on the command line and any parameters specified in a JNLP file for an applet or WebStart application.</td>
	</tr>
	<tr>
		<td>void</td>
		<td>`init()`<br/> The application initialization method.</td>
	</tr>
	<tr>
		<td>static void</td>
		<td>`launch(java.lang.Class<? extends Application> appClass, java.lang.String... args)`<br/> Launch a standalone application. |</td>
	</tr>
	<tr>
		<td>static void</td>
		<td>`launch(java.lang.String... args)`<br/> Launch a standalone application. |</td>
	</tr>
	<tr>
		<td>void</td>
		<td>`notifyPreloader(Preloader.PreloaderNotification info)`<br/> Notifies the preloader with an application-generated notification. |</td>
	</tr>
	<tr>
		<td>abstract void</td>
		<td>`start(Stage primaryStage)`<br/> The main entry point for all JavaFX applications. |</td>
	</tr>
	<tr>
		<td>void</td>
		<td>`stop()`<br/> This method is called when the application should stop, and provides a convenient place to prepare for application exit and destroy resources. |</td>
	</tr>
</table>

示例代码:
```java
package application;
	
import javafx.application.Application;
import javafx.stage.Stage;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;

public class Main extends Application {
	@Override
	public void start(Stage primaryStage) {
		try {
			BorderPane root = new BorderPane();
			Scene scene = new Scene(root,400,400);
			scene.getStylesheets().add(getClass().getResource("application.css").toExternalForm());
			primaryStage.setScene(scene);
			primaryStage.show();
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		launch(args);
	}
}
```
注意：根节点的大小是随着Scene自适应的。
main()方法并不是必须有的，一般javafx程序是将javafx packager Tool嵌入到jar文件，
但是为了便于调试，还是写出来为好。

总之，看到这里让我学习JavaFX有了一定的信心，JavaFX和Android类库真的很相似！