---
title: Spring入门
author: GT
date: 2019-09-09 13:47:47
tags: Spring 入门
---

久仰Spring MVC大名，现在公司要求学习Spring框架，打算借这个机会将Spring系列的东西学习一遍。接下来的学习任务:

* Spring 
* Spring boot
* Mybatis

参考资料:

[1] [W3Cschool Spring 教程](https://www.w3cschool.cn/wkspring/)

本文CSDN地址: [#Spring 学习#入门](https://blog.csdn.net/HTMK_GT_MK/article/details/100892271)

这篇文章的项目代码地址：[Spring-Demo](github.com/HTMLgtMK/Spring-Demo.git)

<!-- more -->

## Spring 概述

 2019-09-09 14:18

**概述**

Spring 由Rod Johnson编写，于2003 年 6 月在首次在 Apache 2.0 Licence下发布，是目前最受欢迎的企业级Java应用程序开发框架。Spring是一个开源的轻量级Java平台。

**编程模型：[POJO, Plain Old Java Object](https://en.wikipedia.org/wiki/Plain_old_Java_object). **

`POJO`是一个简单的Java类，没有`extends`, `implements` or `@annotations` . 不需要遵守任何Java模型，约定或者框架的Java对象。在实际应用中，可能会有annotations存在。如下3种都不是POJO :

```java
public class Foo extends javax.servlet.http.HttpServlet { ... }
public class Foo implements javax.ejb.EntityBean { .. }
@javax.persistence.Entity public class Baz { ... }
```

`JavaBean`是一种可以被`serializable`，拥有一个`no-argument constructor`，并且允许用过`getter and setter or is` 来访问`properties`的 POJO . 下面是一个JavaBean的例子:

```java
<h:input value="#{MyBean.someProperty}" />

public class MyBean {
    private String someProperty;
    public String getSomeProperty() return someProperty;
    public void setSomeProperty(String someProperty) this.someProperty = someProperty;
}
```

**面向切面的程序设计(AOP)**: AOP( Aspect Oriented programming )是一种面向业务逻辑的编程方式，目的是为了减少模块间的耦合性。例如实现 persistent, transaction, security等。

面向对象模型(OOP)是面向对象的编程方式，目的是为了隔离实体，封装属性和操作， 例如 Employee, Student 。这两种方式的侧重点不同。

**控制反转(IoC) 与 依赖注入(DI)**: `控制反转(Invension of Control, IoC)`, 是OOP种的一种设计原则，用来减低计算机代码之间的耦合度。最常见的方式为 `依赖注入(Dependency Injection, DI)`，和 `依赖查找(Dependency Lookup)`。详细参考[控制反转](https://zh.wikipedia.org/wiki/控制反转).

## Spring 体系结构

2019-09-09 15:23

Spring 的体系结构如下:

![Sprint体系结构](arch1.png)

**Core Container**

* spring-core : 提供了框架的基本组成部分，包括 IoC 和 注解功能。
* spring-beans : 提供了 BeanFactory。
* context: 以一种类似于JNDI注册的方式访问对象。ApplicationContext是Context模块的焦点。
* spring-expression : 提供了强大的表达式语言，用于在运行时查询和操作对象。它是JSP2.1规范中定义的统一表达式语言的扩展。

**Data Access/Integration**

* JDBC : Java 和 DB的连接控制。
* ORM : 对象关系映射(Object Relation Mapping) 提供来对流行的对象关系映射API的集成，包括JPA, JDO和Hibernate。
* OXM
* JMS : 提供了 producer-consumer 的消息功能。
* transaction 

**Web**

* Web ：提供了面向Web的基本功能和面向Web应用上下文， eg: multipart files upload, servlet , etc.
* Web-MVC : 为Web应用提供来了模型视图控制(MVC)和 REST Web服务的实现。
* Web-Socket : 为 WebSocket-based 提供了支持，在Web应用程序中提供来Server和Client之间通信的两种方式。
* Web-Portlet : 提供来用于Portlet环境的MVC实现，并反映来spring-webmvc的功能。

## Spring 环境配置

2019-09-09 18:38

1. 安装jdk，配置环境变量; 安装IDE，如 eclipse 或者 IntelliJ IDEA。

2. 安装 Apache Commons Logging API.

   从 [http://commons.apache.org/logging/](http://commons.apache.org/logging/) 下载最新二进制版本，目前是`commons-logging-1.2-bin.tar.gz`，将其解压到`/usr/local/commons-logging-1.2`目录下。

3. 安装 Spring 框架库

   从 [http://repo.spring.io/release/org/springframework/spring](http://repo.spring.io/release/org/springframework/spring) 下载最新的Spring二进制框架文件，目前是  [spring-framework-5.1.9.RELEASE-dist.zip](https://repo.spring.io/release/org/springframework/spring/5.1.9.RELEASE/spring-framework-5.1.9.RELEASE-dist.zip)，将其解压到 `/usr/local/spring-framework-5.1.9.RELEASE`。

如果使用的 IDE 是 eclipse ,  那么将这些类库添加到`build path`， `add external jar`，不需要将这些类库添加到 `CLASSPATH` 环境变量，否则需要。



另外，也可以使用 maven 配置 spring. Spring 在 Maven Central 的位置为: [https://search.maven.org/search?q=g:org.springframework](https://search.maven.org/search?q=g:org.springframework). 由于 Spring 是高度模块化的，各个模块之间的耦合度很小甚至没有互相依赖。下面列出 Maven Central 中 Spring 的几个基本模块：

| Group ID                                                     | Artifact ID                                                  | Latest Version                                               | Updated     |
| ------------------------------------------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- | :---------- |
|                                                              |                                                              |                                                              |             |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-core](https://search.maven.org/search?q=a:spring-core) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-core/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-core&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-beans](https://search.maven.org/search?q=a:spring-beans) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-context](https://search.maven.org/search?q=a:spring-context) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-context-support](https://search.maven.org/search?q=a:spring-context-support) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-expression](https://search.maven.org/search?q=a:spring-expression) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-aop](https://search.maven.org/search?q=a:spring-aop) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-jdbc](https://search.maven.org/search?q=a:spring-jdbc) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-orm](https://search.maven.org/search?q=a:spring-orm) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-jms](https://search.maven.org/search?q=a:spring-jms) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-messaging](https://search.maven.org/search?q=a:spring-messaging) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-messaging/5.1.9.RELEASE/jar)[(82)](https://search.maven.org/search?q=g:org.springframework AND a:spring-messaging&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-oxm](https://search.maven.org/search?q=a:spring-oxm) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-web](https://search.maven.org/search?q=a:spring-web) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-webmvc](https://search.maven.org/search?q=a:spring-webmvc) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-websocket](https://search.maven.org/search?q=a:spring-websocket) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-aspect](https://search.maven.org/search?q=a:spring-aspects) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-instrument](https://search.maven.org/search?q=a:spring-instrument) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |
| [org.springframework](https://search.maven.org/search?q=g:org.springframework) | [spring-test](https://search.maven.org/search?q=a:spring-test) | [‎ 5.1.9.RELEASE](https://search.maven.org/artifact/org.springframework/spring-beans/5.1.9.RELEASE/jar)[(99+)](https://search.maven.org/search?q=g:org.springframework AND a:spring-beans&core=gav) | 02-Aug-2019 |

Maven 配置方法：在 `pom.xml`文件中，添加依赖: 

```xml
<properties>
	<org.springframework.version>5.1.9.RELEASE</org.springframework.version>
</properties>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>${org.springframework.version}</version>
    <scope>runtime</scope> <!-- 运行时范围，确保在任何特定于Spring的API上没有编译时依赖性 -->
</dependency>
<!-- 继续添加其他 spring 模块依赖, 如 spring-beans 等 -->
```

## Spring Hello World 实例

2019-09-09 20:56

这部分开始实际的编程。

1. 创建Java项目：用 eclipse 创建Java项目。

2. 添加必要的库：为HelloWorld项目添加必要spring依赖，如 spring-core, spring-beans, spring-context, 等。添加 common-logging 依赖。

   添加完后的项目如下：

   ![helloworld-project.png](helloworld-project.png)

3. 创建源文件：

   1. 在 src 目录下创建 **com.gthncz** 包，创建 源文件`HelloWorld.java`：

      ```java
      package com.gthncz;
      
      public class HelloWorld {
      	private String msg;
      
      	public String getMsg() {
      		return msg;
      	}
      
      	public void setMsg(String msg) {
      		this.msg = msg;
      	}
      }
      ```

   2. 在 com.gthncz  包下，创建 源文件 `MainApp.java`：

      ```
      package com.gthncz;
      
      import org.springframework.context.ApplicationContext;
      import org.springframework.context.support.ClassPathXmlApplicationContext;
      
      public class MainApp {
      	
      	public static void main(String[]  args) {
      		@SuppressWarnings("resource")
      		ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");
      		HelloWorld helloWold = (HelloWorld) context.getBean("helloWorld");
      		String msg = helloWold.getMsg();
      		System.out.println("Get message : " + msg);
      	}
      
      }
      ```

   这里使用框架API `ClassPathXmlApplicationContext`来创建应用程序的上下文。这个API加载beans的配置文件并最终基于所提供的API，它处理创建并初始化所有的对象，即在配置中指定的`Beans.xml`文件的beans 。

   第二步是使用`getBean(id)`方法获取所需的bean。

4. 创建bean配置文件

   该文件是一个XML文件，在`src`目录下创建：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
   	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
   	xsi:schemaLocation="http://www.springframework.org/schema/beans
          spring-beans.xsd">
   	
   	<!-- 出现错误: org.xml.sax.SAXParseException; lineNumber: 4; columnNumber: 57; cvc-elt.1: Cannot find the declaration of element 'beans'. 
   		原因: 命名空间错误。使用 spring-beans.xsd 创建的xml文件中的 xmlns 为 xmlns:p，改过来就好了，
   		另外, 	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd" 改过来
   	-->
   		
   	<bean id="helloWorld" class="com.gthncz.HelloWorld">
   		<property name="msg" value="Hello World!" />
   	</bean>
   	
   </beans>
   ```

   我在创建 `Beans.xml`文件时使用 `create from XSD schema`，使用 `springframework-5.1.9.RELEASE/schema/beans`中的 `beans.xsd`文件。注意需要修改 `namespace`, `xsi:schemaLocation`。

   通常开发人员保存该文件的名称为 **Beans.xml** 文件，当然你也可以设置成任何你喜欢的名称。但是你必须确保这个文件在 CLASSPATH 中是可用的，并在主应用程序中使用相同的名称，而在 MainApp.java 文件中创建应用程序的上下文。

   Beans.xml 用于给不同的 bean 分配唯一的 ID，并且控制不同值的对象的创建，而不会影响 Spring 的任何源文件。例如，使用下面的文件，你可以为 “message” 变量传递任何值，因此你就可以输出信息的不同值，而不会影响的 HelloWorld.java和MainApp.java 文件。当 Spring 应用程序被加载到内存中时，框架利用了上面的配置文件来创建所有已经定义的 beans，并且按照标签的定义为它们分配一个唯一的 ID。你可以使用标签来传递在创建对象时使用不同变量的值。

5. 运行程序

   运行结果:

   ![helloworld-result.png](helloworld-result.png)

到此，Hello World项目就结束了。 先回去睡了。。。

## Spring IoC容器

2019-09-10 08:28

Spring容器是Spring框架的核心。容器将创建对象（称为 Spring Bean），配置对象，并管理（通过依赖注入， DI）他们的从创建到销毁的整个生命周期。

![ioc1.jpg](ioc1.jpg)

上图是Spring的工作视图，Spring IoC容器利用Java 的 POJO类和配置元数据(Metadata)来生成和配置应用程序。Metadata 可以通过XML, Java注释 以及 Java Code来表示，Metadata指明了哪些类需要实例化。

**IoC容器**是具有依赖注入的容器。通常，我们使用`new`关键字新建Class Instance，控制权由程序员控制，而"控制反转"是指new实例工作不由程序员来完成，而是由Spring Container实现。

两种不同类型的Spring Container:

| 序号 |                         容器 & 描述                          |
| :--: | :----------------------------------------------------------: |
|  1   | `Spring BeanFactory`容器，是Spring中最简单的容器，给ID提供了最基本的支持。 |
|  2   | `Spring ApplicationContainer`容器，该容器添加了更多的企业特性，比如从一个属性文件中解析文本信息的能力。 |

`ApplicationContainer`容器的功能包括`BeanFactory`的所有功能，一般情况下建议使用`ApplicationContainer`。当然，`BeanFactory`仍然可以用于轻量级的应用程序，如移动设备或者基于applet的应用程序。在这些情况下BeanFactory的数据量和速度比ApplicationContainer更加显著。

### Spring BeanFactory 容器

2019-09-10 09:09

它是最简单的容器，提供DI支持，在`org.springframework.beans.factory.BeanFactory`中定义。

在Spring中，有大量对BeanFactory的实现，其中最常用的是**XmlBeanFactory**类。这个容器从XML文件中读取配置元数据，由这些元数据生成一个被配置化的系统或应用。

下面是一个使用 XmlBeanFactory的例子，其他文件使用前面的HelloWorld项目中的文件：

```java
package com.gthncz;

import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;

@SuppressWarnings("deprecation")
public class BeanFactoryDemo {

	public static void main(String[] args) {
		XmlBeanFactory factory = new XmlBeanFactory(new ClassPathResource("Beans.xml"));
		HelloWorld helloWorld = (HelloWorld) factory.getBean("helloWorld");
		System.out.println("Get Message: " + helloWorld.getMsg());
	}

}
```

执行输出：

![XmlBeanfactory-result.png](XmlBeanfactory-result.png)

注意到，我目前的Spring版本是5.1.9.RELEASE，在使用 XmlBeanFactory 时提示 `deprecation` warnning。StackOverflow 上面也有相关问题，但是大家都推荐使用 `ClassPathXmlApplicationContext`了。。。

### ApplicationContext 容器

2019-09-10 10:08

Application Context是BeanFactory的字接口，也被称为 `Spring 上下文`。

Application Context 具有 BeanFactory的全部功能，另外还增加了企业所需要的功能，比如从属性文件中解析文本信息和将事件传递给所指定的监听器。

最常用的 Application Context 接口实现如下，都是从XML文件中加载已被定义的bean：

* `FileSystemXmlApplicationContext `：需要提供XML文件的完整路径。
* `ClassPathXmlApplicationContext`：从 CLASSPATH 路径下查找XML配置文件，不需要完整路径，但是需要正确配置 CLASSPATH 环境变量。
* `WebXmlApplicationContext` ：该容器在一个Web应用程序的范围内加载在Xml文件中已经被定义的bean。

接下来是各个 Application Context的demo：

1. FileSystemApplicationContext

   ```java
   package com.gthncz;
   
   import org.springframework.context.ApplicationContext;
   import org.springframework.context.support.FileSystemXmlApplicationContext;
   
   public class FileSystemApplicationContextDemo {
   
   	public static void main(String[] args) {
   		@SuppressWarnings("resource")
   		ApplicationContext context = new FileSystemXmlApplicationContext("src/Beans.xml");
   		HelloWorld helloWorld = (HelloWorld) context.getBean("helloWorld");
   		System.out.println("Get Message: " + helloWorld.getMsg());
   	}
   
   }s
   ```

   执行输出：

   ![FileSystemXmlApplicationContext-result.png](FileSystemXmlApplicationContext-result.png)

   需要注意的是，前面的Beans.xml文件中 xsi:schemaLocation 位置只写了一个相对路径，需要改成完整的路径。

2. ClassPathXmlApplicationContext

   这个前面已经描述过了，这里不再赘述。

3. WebXmlApplicationContext

   TODO 后续添加。

### Spring Bean 定义

2019-09-10 11:20

Spring Bean是由容器用配置元数据创建的，例如，前面看到的XML中表单中的定义。

定义 bean 的属性：

| 属性                     | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| class                    | 强制的，指定用来创建 bean 的 类（packageName + className, 完整路径）。 |
| name                     | 指定唯一的 bean 标识符，可以使用 id 或name 属性来指定。      |
| scope                    | 指定由创建的对象的作用域。                                   |
| constructor-arg          | 用来注入依赖关系， TODO                                      |
| properties               | 用来注入依赖关系， TODO                                      |
| autowiring mode          | 用来注入依赖关系， TODO                                      |
| lazy-initialization mode | 延迟初始化的 bean 告诉 IoC 容器在它第一次被请求时创建实例，而不是在启动时创建实例。 |
| initialization 方法      | 在 bean 的所有必需的属性被容器设置之后，调用的回调方法。     |
| destruction 方法         | 当包含该 bean 的容器被销毁时，调用的回调方法。               |

**Bean 与 Spring 容器的关系**

![bean-spring-relation.jpg](bean-spring-relation.jpg)

**Spring 配置元数据**

Spring IoC 容器完全由实际编写的配置元数据的格式解藕。有3种配置元数据的方法：

* 基于 XML 的配置文件
* 基于 annotation 的配置
* 基于 Java 的配置

对于基于 XML 的配置，Spring 2.0 以后使用 Schema 的格式，使得不同类型的配置拥有了自己的命名空间，使得配置文件更具有扩展性。下面是一个更加完整的 XML 格式配置：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
    
    <!-- A simple bean definition -->
    <bean id="" class="" >
    	<!-- collaborators and configuration for this bean go here -->
    </bean>
    
    <!-- A bean definition with lazy init set on -->
    <bean id="" class="" lazy-init="true">
    	<!-- collaborators and configuration for this bean go here -->
    </bean>
    
    <!-- A bean definition with initialization method -->
    <bean id="" class="" init-method="..." >
    	<!-- collaborators and configuration for this bean go here -->
    </bean>
    
    <!-- A bean definition with destruction method -->
    <bean id="" class="" destroy-method="..." >
    	<!-- collaborators and configuration for this bean go here -->
    </bean>
    
    <!-- more bean definitions go here -->
    
</beans>
```

在上述示例中：

1. xmlns="http://www.springframework.org/schema/beans" 默认命名空间：它没有空间名，用于Spring Bean 的定义;
2. xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance", xsi 命名空间：这个命名空间用于为每个文档中命名空间指定相应的 Schema 样式文件，是标准组织定义的标准命名空间。

**Spring Bean Scope **(作用域)

当在 Spring 中定义一个 Bean 时， 必需声明这个 Bean 的 scope。Spring 框架支持5种作用域，如下：

|     scope      |                         description                          |
| :------------: | :----------------------------------------------------------: |
|   singleton    | 单例模式，Spring  IoC 容器中只存在一个 Bean 实例; **默认值 ** |
|   prototype    | 每次从容器中调用 Bean 时，都创建一个新的 Bean 实例，即每次调用 getBean() 时，相当于调用  newXXXBean() |
|    request     | 每次 HTTP 请求都会创建一个 Bean 实例，该 scope 仅作用于WebApplicationContext 环境 |
|    session     | 同一个 HTTP Session 共用一个 Bean 实例，不同 Session 使用不同 Bean 实例，该 scope 仅作用于 WebApplicationContext 环境 |
| global-session | 一般用于Portlet应用环境，该运用域仅适用于WebApplicationContext环境 |

以下是测试 `singleton` 和 `prototype` scope 的例子，其它 scope 在后面添加。

* Beans_scope.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="singletonBean" class="com.gthncz.HelloWorld" scope="singleton" >
		<property name="msg" value="Hello world !"></property>
	</bean>
	
	<bean id="prototypeBean" class="com.gthncz.HelloWorld" scope="prototype" >
		<property name="msg" value="Hello world !"></property>
	</bean>
	
	<bean id="requestBean" class="com.gthncz.HelloWorld" scope="request" >
		<property name="msg" value="Hello world !"></property>
	</bean>
	
	<bean id="sessionBean" class="com.gthncz.HelloWorld" scope="session" >
		<property name="msg" value="Hello world !"></property>
	</bean>
	
	<bean id="globalSessionBean" class="com.gthncz.HelloWorld" scope="global-session" >
		<property name="msg" value="Hello world !"></property>
	</bean>
	
</beans>
```

这里继续使用 HelloWorld 类，创建5个不同 scope 的 Bean。

* ScopeDemo.java文件

```java
package com.gthncz;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ScopeDemo {

	public static void main(String[] args) {
		@SuppressWarnings("resource")
		ApplicationContext context = new ClassPathXmlApplicationContext("Beans_scope.xml");
		
		/**
		 * test singleton scope
		 */
		HelloWorld singletonBean1 = (HelloWorld) context.getBean("singletonBean");
		HelloWorld singletonBean2 = (HelloWorld) context.getBean("singletonBean");
		// 比较两个对象的地址
		System.out.println("Singleton Bean is equal ?  " + (singletonBean1 == singletonBean2));
		
		/**
		 * test prototype scope
		 */
		HelloWorld prototypeBean1 = (HelloWorld) context.getBean("prototypeBean");
		HelloWorld prototypeBean2 = (HelloWorld) context.getBean("prototypeBean");
		System.out.println("Prototype Bean is equal ?  " + (prototypeBean1 == prototypeBean2));
		
		// more information about bean scope
	}

}
```

执行输出：

![scopedemo-result.png](scopedemo-result.png)

由结果可以看出，singleton scope 获取得到的 Bean 是单例模式，而 prototype scope 获取得到新实例。

**Spring Bean 生命周期**

Bean 的生命周期: Bean 的定义 -> Bean 的初始化 -> Bean 的使用 -> Bean 的销毁

在 Bean 的生命周期中的 初始化 和 销毁 阶段，存在方法回调，允许用户处理一些自己的逻辑。有两种不同的方式实现回调：Java 接口回调 ， XML 方法声明。

1. Java 接口回调

   `org.springframework.beans.factory.InitializingBean` 定义了 初始化回调。

   ```java
   public void afterPropertiesSet() throws Exception;
   ```

   `org.springframework.beans.factory.DisposableBean` 定义来 销毁回调。

   ```java
   public void destroy throws Exception;
   ```

2. XML 方法声明

   在 XML 配置文件中可以声明 `init-method` 属性和 `destroy-method` 属性。

   ```xml
   <bean id="lifeCircleBean" class="com.gthncz.LifeCircleBean" 
         init-method="xml_initialize" destroy-method="xml_destroy" >
       <property name="msg" value="value on xml" />
   </bean>
   ```

下面是 Spring Bean 生命周期回调方法的测试：

* Beans_lifecircle.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd"  >
	
	<bean id="lifeCircleBean" class="com.gthncz.LifeCircleBean" 
		init-method="xml_initialize" destroy-method="xml_destroy" >
		<property name="msg" value="value on xml" />
	</bean>
	
</beans>
```

XML 配置文件中指定了 init-method 和 destroy-method。

* LifeCircleBean.java

```java
package com.gthncz;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

public class LifeCircleBean implements InitializingBean, DisposableBean {

	private String msg;

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	/**
	 * implement of InitializingBean
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		System.out.println(" run on afterPropertiesSet ... ");
		System.out.println("Msg on afterPropertiesSet: " + this.msg);
	}

	/**
	 * implement of DisposableBean
	 */
	@Override
	public void destroy() throws Exception {
		System.out.println(" run on destroy ... ");
		System.out.println("Msg on destroy: " + this.msg);
	}
	
	/**
	 * implement of init-method which definite in xml
	 */
	public void xml_initialize() {
		System.out.println(" run on xml_initialize ... ");
		System.out.println("Msg on xml_initialize: " + this.msg);
	}
	
	/**
	 * implement of destroy-method which definite in xml
	 */
	public void xml_destroy() {
		System.out.println(" run on xml_destroy ... ");
		System.out.println("Msg on xml_destroy: " + this.msg);
	}

}
```

Bean 中实现了 Java 接口回调 和 XML 指定的回调方法。

* BeanLifeCircleDemo.java

```java
package com.gthncz;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BeanLifeCircleDemo {

	public static void main(String[] args) {
		@SuppressWarnings("resource")
		AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans_lifecircle.xml");
		LifeCircleBean lifeCircleBean = (LifeCircleBean) context.getBean("lifeCircleBean");
		System.out.println("Msg on main: " + lifeCircleBean.getMsg());
		// 需要注册一个在 AbstractApplicationContext 类中声明的关闭 hook 的 registerShutdownHook() 方法。它将确保正常关闭，并且调用相关的 destroy 方法。
		context.registerShutdownHook(); // 要使用 AbstractApplicationContext
	}

}
```

在这里，你需要注册一个在 AbstractApplicationContext 类中声明的关闭 hook 的 **registerShutdownHook()**  方法。它将确保正常关闭，并且调用相关的 destroy 方法。仅仅使用 ApplicationContext 接口类的话是没有这个方法的。

执行输出：

![BeanLifeCircleDemo-result.png](BeanLifeCircleDemo-result.png)

从输出的结果可以看出，Java 接口回调 运行在 XML 声明的方法前。当然，实际项目中，只需要实现一种回调就可以，并且建议使用 XML 声明的方法，因为这种方法更加灵活。

3. 默认的初始化和销毁方法

如果你有太多具有相同名称的初始化或者销毁方法的 Bean，那么你不需要在每一个 bean 上声明初始化方法和销毁方法。框架使用元素中的 `default-init-method` 和 `default-destroy-method` 属性提供了灵活地配置这种情况，如下所示：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd"
    default-init-method="init" 
    default-destroy-method="destroy">

   <bean id="..." class="...">
       <!-- collaborators and configuration for this bean go here -->
   </bean>

</beans>
```

### Spring Bean PostProcessor 后置处理器

2019-09-10 18:52

`Bean PostProcessor` 允许在调用 **初始化** 方法**前后**对 Bean 进行额外的处理。`org.springframework.beans.factory.config.BeanPostProcessor` 接口定义了2个方法，在这里可以实现自己的实例化逻辑，依赖解析逻辑等。

可以在Spring容器中插入一个或多个 PostProcessor ，通过设置 BeanPostProcessor 实现的 `Ordered` 接口提供的 `order` 属性来控制这些 BeanPostProcessor 接口的执行顺序。	

`ApplicationContext` 会自动检测由 `BeanPostProcessor`接口实现的 Bean ，注册这些 bean 为 PostProcessor，然后通过在容器中创建 bean，在适当的时候调用它。

下面是一个 PostProcessor 的例子：

* Beans_post_processor.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
	
	<bean id="helloWorld" class="com.gthncz.beans.HelloWorld" 
		init-method="initialize" destroy-method="destroy" >
		<property name="msg" value="Hello world !"></property>
	</bean>
	
	<!-- ApplicationContext 会自动检测由 BeanPostProcessor 接口的实现定义的 bean，注册这些 bean 为后置处理器，然后通过在容器中创建 bean，在适当的时候调用它。 -->
	<bean class="com.gthncz.beans.PostProcessorBean"></bean>
	
</beans>
```

在这个文件中指定了一个 PostProcessor，具体实现如下。

* PostProcessorBean.java

```java
package com.gthncz.beans;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

public class PostProcessorBean implements BeanPostProcessor {
	
	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		System.out.println(" run on postProcessBeforeInitialization : " + beanName);
		return BeanPostProcessor.super.postProcessBeforeInitialization(bean, beanName);
	}
	
	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		System.out.println(" run on postProcessAfterInitialization : " + beanName);
		return BeanPostProcessor.super.postProcessAfterInitialization(bean, beanName);
	}
	
}
```

这里实现了一个简单的 PostProcessor，只用于打印信息。

* BeanPostProcessorDemo.java

```java
package com.gthncz;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.gthncz.beans.HelloWorld;

public class BeanPostProcessorDemo {

	public static void main(String[] args) {
		@SuppressWarnings("resource")
		AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans_post_processor.xml");
		HelloWorld helloWorld = (HelloWorld) context.getBean("helloWorld");
		System.out.println("Msg on main : " + helloWorld.getMsg());
		context.registerShutdownHook();
	}

}
```

在 main 中不需要对 PostProcessor 作声明什么的，好像从没出现过一样。。。

执行输出：

![BeanPostProcessor-result.png](BeanPostProcessor-result.png)

从输出中看出，`postProcessBeforeInitialization`在 Bean initialize 前调用，`postProcessAfterInitialization`在 Bean initialize 后调用。

### Spring Bean 定义继承

2019-09-10 19:17

Spring Bean 定义的继承与 Java 类的继承无关，但是继承的概念是一样的。子 bean 的定义继承父定义的**配置数据**（仅仅是配置数据）。子定义可以根据需要重写一些值，或者添加其他值。但是子类赋值父类也有的属性并不能修改父类上属性的值。

当你使用基于 XML 的配置元数据时，通过使用父属性 `parent="parent-id"`，指定父 bean 作为该属性的值来表明子 bean 的定义。

下面是一个 Bean 继承的简单例子：

* Beans_extends.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd"
       default-init-method="initialize"
       default-destroy-method="destroy"
       >
		
	<bean id="helloWorld" class="com.gthncz.beans.HelloWorld">
		<property name="msg" value="Hello World!" />
	</bean>
	
	<bean id="helloChina" class="com.gthncz.beans.HelloChina" parent="helloWorld">
		<property name="msg2" value="Hello China!" />
	</bean>
	
</beans>
```

这里的 HelloChina Bean 指定了 HelloWorld 作为它的 parent，因此继承了 HelloWorld 拥有的属性值。

* HelloChina.java

```java
package com.gthncz.beans;

public class HelloChina {
	
	private static final String TAG = HelloChina.class.getSimpleName();
	
	private String msg;  // 值得注意的是，这里的 msg 在 parent 上是 private 类型的，但仍然可以继承到值
	private String msg2;
	
	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getMsg2() {
		return msg2;
	}

	public void setMsg2(String msg2) {
		this.msg2 = msg2;
	}
	
	public void initialize() {
		System.out.println(TAG + " run on initialize ... ");
	}
	
	public void destroy() {
		System.out.println(TAG + " run on destroy ... ");
	}

}
```

这里 HelloChina 类具有 HelloWorld 的属性 msg，并且拥有自己的属性 msg2。

* BeanExtendsDemo.java

```java
package com.gthncz;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.gthncz.beans.HelloChina;
import com.gthncz.beans.HelloWorld;

public class BeanExtendsDemo {

	public static void main(String[] args) {
		@SuppressWarnings("resource")
		AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans_extends.xml");
		HelloWorld helloWorld = (HelloWorld) context.getBean("helloWorld");
		System.out.println(" helloWorld' Msg : " + helloWorld.getMsg());
		HelloChina helloChina = (HelloChina) context.getBean("helloChina");
		System.out.println(" helloChina' Msg : " + helloChina.getMsg());
		System.out.println(" helloChina' Msg2 : " + helloChina.getMsg2());
		
		helloChina.setMsg("Hello GT!");
		System.out.println(" helloWorld' Msg : " + helloWorld.getMsg());  // 子类的属性赋值并没有改变父类上属性的值
		System.out.println(" helloChina' Msg : " + helloChina.getMsg());  
		
		context.registerShutdownHook();
	}
	
}
```

执行输出：

![BeanExtendsDemo-result.png](BeanExtendsDemo-result.png)

从输出上看，父类 HelloWorld 在子类 HelloChina 之前初始化，在其之后销毁。并且，HelloChina 并没有在 XML 配置 msg 的属性值，但是从父类 HelloWorld 中继承得到了属性值，输出结果为"Hello World"。

**Bean 定义模板**

你可以创建一个 Bean 定义模板，不需要花太多功夫它就可以被其他子 bean 定义使用。在定义一个 Bean 定义模板时，你不应该指定**类**的属性，而应该指定带 **true** 值的**抽象**属性，如下所示：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="beanTeamplate" abstract="true">
      <property name="message1" value="Hello World!"/>
      <property name="message2" value="Hello Second World!"/>
      <property name="message3" value="Namaste India!"/>
   </bean>

   <bean id="helloIndia" class="com.tutorialspoint.HelloIndia" parent="beanTeamplate">
      <property name="message1" value="Hello India!"/>
      <property name="message3" value="Namaste India!"/>
   </bean>

</beans>
```

父 bean 自身不能被实例化，因为它是不完整的，而且它也被明确地标记为抽象的(`abstract`)。当一个定义是抽象的，它仅仅作为一个纯粹的模板 bean 定义来使用的，充当子定义的父定义使用。

## Spring 依赖注入 DI

2019-09-10 20:38

Spring框架的核心功能之一就是通过依赖注入的方式来管理Bean之间的依赖关系。

**依赖注入 DI**

当编写一个复杂的 Java 应用程序时，应用程序类应该尽可能独立于其他 Java 类来增加这些类重用的可能性，并且在做单元测试时，测试独立于其他类的独立性。依赖注入（或有时称为布线）有助于把这些类粘合在一起，同时保持他们独立。

假设你有一个包含文本编辑器组件的应用程序，并且你想要提供拼写检查。标准代码看起来是这样的：

```java
public class TextEditor {
    private SpellChecker spellChecker;
    public TextEditor(){
        spellChecker = new SpellChecker();
    }
}
```

在这里我们所做的的就是创建一个 TextEditor 和 SpellChecker 之间的依赖关系。在控制反转的场景中，我们反而会做这样的事情：

```java
public class TextEditor {
    private SpellChecker spellChecker;
    public TextEditor(SpellChecker spellChecker){
        this.spellChecker = spellChecker;
    }
}
```

这里，TextEditor 不应该担心 SpellChecker 的实现。SpellChecker 将会独立实现，并且在 TextEditor 实例化的时候将提供给 TextEditor，整个过程是由 Spring 框架的控制。。因此，控制流通过依赖注入（DI）已经“反转”，因为你已经有效地委托依赖关系到一些外部系统。

依赖注入的第二种方法是通过 TextEditor 类的`Setter`方法，我们将创建 SpellChecker 实例，该实例将被用于调用 setter 方法来初始化 TextEditor 的属性。

下面是2种依赖注入DI的方法：

| 方法                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `Constructor-based DI` | 当容器调用带有多个 args 的 constructor 的 Class 时，实现基于构造函数的 DI，每个代表在其他类中的一个依赖关系。 |
| `Setter-based DI`      | 基于 setter 方法的 DI 是通过在调用无参数的构造函数或无参数的静态工厂方法实例化 bean 之后容器调用 beans 的 `setter` 方法来实现的。 |

可以混合这两种方法，基于构造函数和基于 setter 方法的 DI，然而，有强制性依存关系时使用基于构造函数的DI ，有可选依赖关系时使用基于 setter 的DI 是一个好的做法。

### Spring Constructor-based DI

2019-09-10 21:11

当容器调用带有一组参数的类构造函数时，基于构造函数的 DI 就完成了，其中每个参数代表一个对其他类的依赖。

简单的例子：

* Beans_DI.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

	<!-- Definition for TextEditor bean -->
	<bean id="textEditor" class="com.gthncz.beans.TextEditor" >
		<constructor-arg ref="spellChecker" ></constructor-arg>
	</bean>
	
	<!-- Definition for SpellChecker bean -->
	<bean id="spellChecker" class="com.gthncz.beans.SpellChecker" ></bean>

</beans>
```

用 `constructor-arg` 指定构造函数的参数。这里 有个问题，如果多个参数呢？

* SpellChecker.java

```java
package com.gthncz.beans;

public class SpellChecker {
	
	public SpellChecker() {
		System.out.println(" Inside SpellChecker constructor. ");
	}

	public void checkSpelling() {
		System.out.println(" Inside checkSpelling. ");
	}
	
}
```

* TextEditor.java

```java
package com.gthncz.beans;

public class TextEditor {
	private SpellChecker spellChecker;
	
	public TextEditor(SpellChecker spellChecker) {
		System.out.println(" Inside TextEditor constructor. ");
		this.spellChecker = spellChecker;
	}
	
	public void spellCheck() {
		spellChecker.checkSpelling();
	}

}
```

通过构造函数的参数传递依赖。

* ConstructorBasedDIDemo.java

```java
package com.gthncz;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.gthncz.beans.TextEditor;

public class ConstructorBasedDIDemo {
	
	public static void main(String[] args) {
		@SuppressWarnings("resource")
		AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans_DI.xml");
		TextEditor textEditor = (TextEditor) context.getBean("textEditor");
		textEditor.spellCheck();
		context.registerShutdownHook();
	}
	
}
```

执行输出：

![ConstrcutorBasedDIDemo-result.png](ConstrcutorBasedDIDemo-result.png)

从输出看，依赖项 SpellChecker 在 TextEditor 之前构造。

**构造函数参数解析**

如果存在不止一个参数时，当把参数传递给构造函数时，可能会存在歧义。要解决这个问题，那么构造函数的参数在 bean 定义中的顺序就是把这些参数提供给适当的构造函数的顺序就可以了。考虑下面的类：

```java
package x.y;
public class Foo {
   public Foo(Bar bar, Baz baz) {
      // ...
   }
}
```

```xml
<beans>
   <bean id="foo" class="x.y.Foo">
      <constructor-arg ref="bar"/>
      <constructor-arg ref="baz"/>
   </bean>

   <bean id="bar" class="x.y.Bar"/>
   <bean id="baz" class="x.y.Baz"/>
</beans>
```

如果是内置类型：

```java
package x.y;
public class Foo {
   public Foo(int year, String name) {
      // ...
   }
}
```

```xml
<beans>
   <bean id="exampleBean" class="examples.ExampleBean">
      <constructor-arg type="int" value="2001"/>
      <constructor-arg type="java.lang.String" value="Zara"/>
   </bean>
</beans>
```

使用 type 属性显式的指定了构造函数参数的类型，容器也可以使用与简单类型匹配的类型。

最后并且也是**最好的传递**构造函数参数的方式，使用 `index` 属性来显式的指定构造函数参数的索引。下面是基于索引为 0 的例子，如下所示：

```xml
<beans>
   <bean id="exampleBean" class="examples.ExampleBean">
      <constructor-arg index="0" value="2001"/>
      <constructor-arg index="1" value="Zara"/>
   </bean>
</beans>
```

最后，如果你想要向一个对象传递一个引用，你需要使用标签的 `ref` 属性，如果你想要直接传递值，那么你应该使用如上所示的 `value` 属性。

### Spring Setter-based DI

2019-09-11

当容器调用一个无参的构造函数或一个无参的静态 factory 方法来初始化你的 bean 后，通过容器在你的 bean 上调用设值函数，基于设值函数的 DI 就完成了。

使用简单的设值函数来完成注入：

* Beans_DI.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd" 
       default-init-method="initialize"
       default-destroy-method="destroy"
       >

	<!-- Definition for TextEditor bean -->
	<bean id="textEditor" class="com.gthncz.beans.TextEditor" >
		<constructor-arg ref="spellChecker" ></constructor-arg> <!-- Constrcutor-based DI -->
		<property name="autoComplement" ref="autoComplement" ></property> <!-- Setter-based DI -->
	</bean>
	
	<!-- Definition for SpellChecker bean -->
	<bean id="spellChecker" class="com.gthncz.beans.SpellChecker" ></bean>
	
	<!-- Definition for Autocomplement bean -->
	<bean id="autoComplement" class="com.gthncz.beans.AutoComplement"></bean>

</beans>
```

给 TextEdittor 添加了一个新的 属性 autoComplement, 通过在 XML 中配置属性完成注入，注意 autoComplement 是一个 对象引用，因此使用 `ref` 属性。

* AutoComplement.java

```java
package com.gthncz.beans;

public class AutoComplement {
	
	public AutoComplement() {
		System.out.println(" Inside AutoComplement constructor. ");
	}
	
	public void complete() {
		System.out.println(" Inside complete . ");
	}
	
	public void initialize() {
		System.out.println(" Inside AutoComplement initialize . ");
	}
	
	public void destroy() {
		System.out.println(" Inside AutoComplement destroy . ");
	}

}
```

* TextEditor.java

```java
package com.gthncz.beans;

public class TextEditor {
	private SpellChecker spellChecker;
	private AutoComplement autoComplement;
	
	public TextEditor(SpellChecker spellChecker) {
		System.out.println(" Inside TextEditor constructor. ");
		this.spellChecker = spellChecker;
	}
	
	public void spellCheck() {
		spellChecker.checkSpelling();
	}
	
	public void autoComplete() {
		autoComplement.complete();
	}

	public AutoComplement getAutoComplement() {
		System.out.println(" Inside TextEditor getAutoComplement. ");
		return autoComplement;
	}

    // a setter method to inject the dependency.
	public void setAutoComplement(AutoComplement autoComplement) {
		System.out.println(" Inside TextEditor setAutoComplement. ");
		this.autoComplement = autoComplement;
	}
	
	public void initialize() {
		System.out.println(" Inside TextEditor initialize . ");
	}
	
	public void destroy() {
		System.out.println(" Inside TextEditor destroy . ");
	}

}
```

通过 `Setter` 方法将属性值注入到属性 autoComplement 中。

* DIDemo.java

```java
package com.gthncz;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.gthncz.beans.TextEditor;

public class DIDemo {
	
	public static void main(String[] args) {
		@SuppressWarnings("resource")
		AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans_DI.xml");
		TextEditor textEditor = (TextEditor) context.getBean("textEditor");
		textEditor.autoComplete();
		textEditor.spellCheck();
		context.registerShutdownHook();
	}
	
}
```

这里基本上没有变化。

执行输出：

![DIDemo-result.png](DIDemo-result.png)

从输出可以看出，AutoComplement 被注入到 TextEditor 中。并且，Constructor-based DI 依赖项 SpellCheker 在 TextEditor 之前创建和初始化，而 Setter-based DI 依赖项 AutoComplement 在 TextEditor 创建之后 创建和初始化， 在运行前 TextEditor 才完成 initialize 。

### Spring  注入内部 Beans

2019-09-11 09:00

`inner beans` 是在其他 bean 的范围内定义的 bean。

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="outerBean" class="...">
      <property name="target">
         <bean id="innerBean" class="..."/>
      </property>
   </bean>

</beans>
```

### Spring 注入集合

2019-09-11 09:01

Spring 提供了4种类型的集合配置元素，可以用于传递 java.util 中的 `List`, `Set`, `Map`, `Properties`，如下所示：

| 元素      | 描述                                                         |
| --------- | ------------------------------------------------------------ |
| `<list>`  | 它有助于连线，如注入一列值，允许重复。                       |
| `<set>`   | 它有助于连线一组值，但不能重复。                             |
| `<map>`   | 它可以用来注入 key-value pair的集合，其中名称和值可以是任何类型。 |
| `<props>` | 它可以用来注入 key-value pair的集合，其中名称和值都是字符串类型。 |

一个简单的例子如下：

```java
package com.gthncz.beans;

import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

public class JavaCollection {
	private List<String> list;
	private Set<String> set;
	private Map<String, String> map;
	private Properties properties;
	public List<String> getList() {
		System.out.println(" List elements : " + this.list);
		return list;
	}
	public void setList(List<String> list) {
		this.list = list;
	}
	public Set<String> getSet() {
		System.out.println(" Set elements : " + this.set);
		return set;
	}
	public void setSet(Set<String> set) {
		this.set = set;
	}
	public Map<String, String> getMap() {
		System.out.println(" Map elements : " + this.map);
		return map;
	}
	public void setMap(Map<String, String> map) {
		this.map = map;
	}
	public Properties getProperties() {
		System.out.println(" Properties elements : " + this.properties);
		return properties;
	}
	public void setProperties(Properties properties) {
		this.properties = properties;
	}
	
}
```

这个类具有 `java.util`中4种元素类型，并利用 `Setter` 方式注入值。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xsi:schemaLocation="http://www.springframework.org/schema/beans 
		http://www.springframework.org/schema/beans/spring-beans.xsd ">

	<bean id="javaCollection" class="com.gthncz.beans.JavaCollection">
		<property name="list" >
			<list>
				<value>Russia</value>
				<value>Canada</value>
				<value>China</value>
				<value>China</value>
                <!-- <ref bean="bean-id"> -->
			</list>
		</property>
		
		<property name="set">
			<set>
				<value>Russia</value>
				<value>Canada</value>
				<value>China</value>
				<value>China</value>
			</set>
		</property>
		
		<property name="map">
			<map>
				<entry key="1" value="Russia"></entry>
				<entry key="2" value="Canada"></entry>
				<entry key="3" value="China"></entry>
				<entry key="4" value="American"></entry>
			</map>
		</property>
		
		<property name="properties">
			<props>
				<prop key="one" >Russia</prop>
				<prop key="two" >Canada</prop>
				<prop key="three">China</prop>
				<prop key="four">Amerian</prop>
			</props>
		</property>
		
        <!-- 注入空字符串  -->
        <!-- <property name="email" value="" /> -->
        
        <!-- 注入null -->
        <!-- <property name="email"><null/></property> -->
	</bean>

</beans>
```

这是 JavaCollection Bean 的配置文件，分别用 `<list>`, `<set>`, `<map>`, `<props>` 标签传递值。

另外，注意传入 `引用` ，`空字符串` 和 `null` 的方法。

```java
package com.gthncz;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.gthncz.beans.JavaCollection;

public class CollectionDIDemo {

	public static void main(String[] args) {
		@SuppressWarnings("resource")
		AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans_collection.xml");
		JavaCollection collection = (JavaCollection) context.getBean("javaCollection");
		collection.getList();
		collection.getSet();
		collection.getMap();
		collection.getProperties();
		context.registerShutdownHook();
	}

}
```

创建 JavaCollection Bean 并初始化 ，然后输出其元素值。

执行输出：

![CollectionDIDemo-result.png](CollectionDIDemo-result.png)

从输出结果看，成功将4种类型的元素值注入，并且 set 自动去除了重复元素值。

## Spring Beans Autowire 自动装配

`<bean>` 元素的 `autowire` 属性可以自动注入属性值，这样可以减少应用程序XML配置的`<constructor-arg>`, `<property>`数量。

**Autowire Mode**

Spring 存在 4 种不同的装配模式，可以使用 `<bean>` 元素的 `autowire` 属性来指定装配模式。

| Autowire Mode | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| no            | 默认的设置，表示没有自动装配，你应该对bean 显示的布线。      |
| byName        | 由属性名自动装配**属性值**。类似 ButterKnife 的注入，类中元素的名称要和 XML 配置文件中的 id 配置一样，即可自动装配。如果不存在或者存在多个相同名称的bean，则会抛出致命异常。 |
| byType        | 由属性数据类型自动装配**属性值**。如果不存在或者存在多个相同类型的bean，则会抛出致命异常。 |
| constructor   | 类似于 byType ，但该类型适用于**构造函数参数**类型。如果容器中没有一个constructor 参数类型的 bean， 则会抛出致命异常。 |
| autodetect    | 首先尝试通过 constructor 来自动装配，再尝试 byType 来自动装配。 |

**Autowire 的 局限性**

| Limitation   | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| 重写的可能性 | 总是可以通过 `<constructor-arg>` `<property>`指定依赖关系。  |
| 原始数据类型 | 不能自动装配所谓的简单类型，包括基本类型，字符串和类。       |
| 混乱的本质   | 自动装配不如显式装配精确，所以如果可能的话尽可能使用显式装配。 |

优点：autowire 可以显著的减少需要指定的属性或构造器参数。

### Spring autowire `ByName`

2019-09-11 11:41

在配置文件中，如果一个 bean 定义设置为自动装配 *byName*，并且它包含 *spellChecker* 属性（即，它有一个 *setSpellChecker(...)* 方法），那么 Spring 就会查找定义名为 *spellChecker* 的 bean，并且用它来设置这个属性。你仍然可以使用 `<property>` 标签连接其余的属性。下面的例子将说明这个概念。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans 
	http://www.springframework.org/schema/beans/spring-beans.xsd"
	default-init-method="initialize"
	default-destroy-method="destroy" >
	
	<bean id="textEditor" class="com.gthncz.beans.TextEditor" autowire="byName">
		<constructor-arg ref="spellChecker"></constructor-arg>
		<!-- <property name="autoComplement" ref="autoComplement"></property> -->
	</bean>
	
	<bean id="spellChecker" class="com.gthncz.beans.SpellChecker" ></bean>
	<bean id="autoComplement" class="com.gthncz.beans.AutoComplement" ></bean>
	
</beans>
```

执行运行正常输出。

### Spring autowire `byType`

Spring 容器看作 beans，在 XML 配置文件中 beans 的 *autowire* 属性设置为 *byType*。然后，如果它的 **type** 恰好与配置文件中 beans 名称中的一个相匹配，它将尝试匹配和连接它的属性。如果找到匹配项，它将注入这些 beans，否则，它将抛出异常。

```xml
<bean id="textEditor" class="com.gthncz.beans.TextEditor" autowire="byType">
    <constructor-arg ref="spellChecker"></constructor-arg>
    <!-- <property name="autoComplement" ref="autoComplement"></property> -->
</bean>
```

Spring autowire `constructor`

这种模式与 *byType* 非常相似，但它应用于构造器参数。Spring 容器看作 beans，在 XML 配置文件中 beans 的 *autowire* 属性设置为 *constructor*。然后，它尝试把它的构造函数的参数与配置文件中 beans 名称中的一个进行匹配和连线。如果找到匹配项，它会注入这些 bean，否则，它会抛出异常。

```xml
<bean id="textEditor" class="com.gthncz.beans.TextEditor" autowire="constructor">
    <!-- <constructor-arg ref="spellChecker"></constructor-arg>-->
    <property name="autoComplement" ref="autoComplement"></property>
</bean>
```

## Spring 基于 annotation 的配置

2019-09-11 14:13

可以使用注解来配置DI。在执行时，annotation 注入先于 XML 方式注入，因此，共存的 XML 注入会覆盖 annotaion 注入的效果。

使用 annotaion 注入，需要先在 Spring 配置文件中启用。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context-3.0.xsd">

   <context:annotation-config/>
   <!-- bean definitions go here -->

</beans>
```

一旦配置之后，就可以使用 annotaion 注入。几个重要的注解如下：

| 注解               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| @Required          | 应用于 Setter 方法，XML 配置中必需要存在这个属性值.。deprecated 。 |
| @Autowired         | 应用于 bean 属性, Setter，非Setter方法 ， constructor。      |
| @Qualifier         | 指定被连线的 bean, 与@Autowired 使用时可以消除混乱。         |
| JSR-250 Annotation | @PostConstruct, @PreDestroy, @Resource注解。非必需使用。     |

### Spring @Required 注解

`@Required` 注释应用于 bean 属性的 setter 方法，它表明受影响的 bean 属性在配置时必须放在 XML 配置文件中，否则容器就会抛出一个 BeanInitializationException 异常。下面显示的是一个使用 @Required 注释的示例。

```java
package com.gthncz.beans;

import org.springframework.beans.factory.annotation.Required;

@SuppressWarnings("deprecation")
public class Student {
	
	private String name;
	private int age;
	
	public String getName() {
		return name;
	}
	
	@Required
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	
	@Required
	public void setAge(int age) {
		this.age = age;
	}
}
```

Student类具有两个属性，分别在两个 Setter 方法上添加 @Required 注解。**注：**目前 @Required 注解 is deprecated 。原因是没有必要使用它了，@Autowired 注解足以。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context.xsd">

	<!-- 启用基于注解的连线 -->
	<context:annotation-config />
	
	<!-- beans definitions go here -->
	<bean id="student" class="com.gthncz.beans.Student" >
		<property name="name" value="Alice"></property>
		<property name="age" value="18"></property>
	</bean>

</beans>
```

配置文件中的 bean 必需配置 @Required 注解标识的属性。

```java
package com.gthncz;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.gthncz.beans.Student;

public class AnnotationDemo {

	public static void main(String[] args) {
		@SuppressWarnings("resource")
		AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans_annotation.xml");
		Student student = (Student) context.getBean("student");
		System.out.printf(" Student name: %s, age: %d ", student.getName(), student.getAge());
		context.registerShutdownHook();
	}

}
```

执行输出：

![AnnotationRequired-result.png](AnnotationRequired-result.png)

### Spring @Autowired 注解

@Autowired 注解可以用于 bean 属性，Setter 方法， 非 Setter 方法，constructor 方法。

1. @Autowired 用于Setter 方法

   当对一个 Setter 方法使用 @Autowired 注解时，Spring 会试图执行 `byType` 自动连接。

   ```java
   package com.tutorialspoint;
   import org.springframework.beans.factory.annotation.Autowired;
   public class TextEditor {
      private SpellChecker spellChecker;
      @Autowired
      public void setSpellChecker( SpellChecker spellChecker ){
         this.spellChecker = spellChecker;
      }
      public SpellChecker getSpellChecker( ) {
         return spellChecker;
      }
      public void spellCheck() {
         spellChecker.checkSpelling();
      }
   }
   ```

   给 Setter 方法添加了 @AutoWired 注解，相当于添加了 `byType` 模式 autowire 属性。

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context-3.0.xsd">
   
      <context:annotation-config/>
   
      <!-- Definition for textEditor bean without constructor-arg  -->
      <bean id="textEditor" class="com.tutorialspoint.TextEditor"></bean>
   
      <!-- Definition for spellChecker bean -->
      <bean id="spellChecker" class="com.tutorialspoint.SpellChecker"></bean>
   
   </beans>
   ```

   和 autowire 属性 `byType` 模式 一样，不需要在 textEditor bean 中显示布线指定依赖项 spellChecker。

2. @Autowired 用于bean属性

   可以对 bean 属性使用 `@Autowired` 注解，**可以消除 Setter 方法** 。应该还是类似于 `byType` 模式的 autowire 。

   ```java
   package com.tutorialspoint;
   import org.springframework.beans.factory.annotation.Autowired;
   public class TextEditor {
      @Autowired
      private SpellChecker spellChecker;
      public TextEditor() {
         System.out.println("Inside TextEditor constructor." );
      }  
      public SpellChecker getSpellChecker( ){
         return spellChecker;
      }  
      public void spellCheck(){
         spellChecker.checkSpelling();
      }
   }
   ```

   可以看到，这里去掉了 setSpellChecker 方法。

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context-3.0.xsd">
   
      <context:annotation-config/>
   
      <!-- Definition for textEditor bean -->
      <bean id="textEditor" class="com.tutorialspoint.TextEditor">
      </bean>
   
      <!-- Definition for spellChecker bean -->
      <bean id="spellChecker" class="com.tutorialspoint.SpellChecker">
      </bean>
   
   </beans>
   ```

   配置文件没有变化。

3. @Autowired 用于 constructor 方法

   也可以在 constructor 中使用 @Autowired。和 `constructor`模式的 `autowire` 属性 效果相同。

   ```java
   package com.tutorialspoint;
   import org.springframework.beans.factory.annotation.Autowired;
   public class TextEditor {
      private SpellChecker spellChecker;
      @Autowired
      public TextEditor(SpellChecker spellChecker){
         System.out.println("Inside TextEditor constructor." );
         this.spellChecker = spellChecker;
      }
      public void spellCheck(){
         spellChecker.checkSpelling();
      }
   }
   ```

   这里对构造函数添加了 @Autowired 注解。

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context-3.0.xsd">
   
      <context:annotation-config/>
   
      <!-- Definition for textEditor bean without constructor-arg  -->
      <bean id="textEditor" class="com.tutorialspoint.TextEditor">
      </bean>
   
      <!-- Definition for spellChecker bean -->
      <bean id="spellChecker" class="com.tutorialspoint.SpellChecker">
      </bean>
   
   </beans>
   ```

   配置文件没有变化。

4. @Autowired 的 (required=false) 选项

   默认情况下，@Autowired 注解意味着依赖是必需的，它类似于 @Required 注解。然而，你可以使用 @Autowired 的 **（required=false）** 选项关闭默认行为。

   ```java
   package com.tutorialspoint;
   import org.springframework.beans.factory.annotation.Autowired;
   public class Student {
      private Integer age;
      private String name;
      @Autowired(required=false)
      public void setAge(Integer age) {
         this.age = age;
      }  
      public Integer getAge() {
         return age;
      }
      @Autowired
      public void setName(String name) {
         this.name = name;
      }   
      public String getName() {
         return name;
      }
   }
   ```

   给 setAge 的 @Autowired 设置了 require=false 选项，因此可以在 XML 配置文件中不配置 age property。

### Spring @Qualifier 注解

当需要创建相同类型的 bean，或者是 bean 的属性中含有多个相同类型的 bean 属性，使用 @Autowired 难免会造成混乱。这种情况下，可以使用 `@Qualifier` 和 `@Autowired` 一起使用指定需要装配的 bean，以消除混乱。

```java
package com.gthncz.beans;
import org.springframework.beans.factory.annotation.Autowired;
public class Student {
	
	private String name;
	private int age;
	
	@Autowired
	public void setName(String name) {
		this.name = name;
	}

	@Autowired
	public void setAge(int age) {
		this.age = age;
	}

	public String getName() {
		return name;
	}
	
	public int getAge() {
		return age;
	}
	
}
```

```java
package com.gthncz.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class Profile {
	@Autowired
	@Qualifier("student1")
	private Student student1;
	
	public void printAge() {
		System.out.println(" Student1 age is : " + student1.getAge());
	}
	
	public void printName() {
		System.out.println(" Student1 name is : " + student1.getName());
	}

}
```

指定了使用 配置文件中的哪个 Student bean。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context.xsd">

	<!-- 启用基于注解的连线 -->
	<context:annotation-config />
	
	<!-- beans definitions go here -->
	<bean id="student" class="com.gthncz.beans.Student" >
		<property name="name" value="Alice" ></property>
		<property name="age" value="18" ></property>
	</bean>
	
	<bean id="student1" class="com.gthncz.beans.Student" >
		<property name="name" value="Bob" ></property>
		<property name="age" value="22" ></property>
	</bean>
	
	<bean id="profile" class="com.gthncz.beans.Profile" ></bean>

</beans>
```

主程序：

```java
package com.gthncz;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.gthncz.beans.Profile;
import com.gthncz.beans.Student;

public class AnnotationDemo {

	public static void main(String[] args) {
		@SuppressWarnings("resource")
		AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans_annotation.xml");
		Student student = (Student) context.getBean("student");
		System.out.printf(" Student name: %s, age: %d \n", student.getName(), student.getAge());
		Profile profile = (Profile) context.getBean("profile");
		profile.printName(); profile.printAge();
		context.registerShutdownHook();
	}

}
```

执行输出：

![AnnotationDemo-result.png](AnnotationDemo-result.png)

可以看到，结果输出了指定的 Student bean。

### Spring JSR-250 注解

包括 `@PostConstruct`, `PreDestory`和`@Resource`。其中，前两个相当于 XML bean属性`init-method`和`destroy-method`方法。这里只需要加入注解就可以。

@Resource 注释使用一个 `name` 属性，该属性以一个 bean 名称的形式被注入。你可以说，它遵循 **by-name** 自动连接语义，如下面的示例所示：

```java
package com.tutorialspoint;
import javax.annotation.Resource;
public class TextEditor {
   private SpellChecker spellChecker;
   @Resource(name= "spellChecker")
   public void setSpellChecker( SpellChecker spellChecker ){
      this.spellChecker = spellChecker;
   }
   public SpellChecker getSpellChecker(){
      return spellChecker;
   }
   public void spellCheck(){
      spellChecker.checkSpelling();
   }
}
```

如果没有明确地指定一个 ‘name’，默认名称源于字段名或者 setter 方法。在字段的情况下，它使用的是字段名；在一个 setter 方法情况下，它使用的是 bean 属性名称。

### Spring 基于 Java 的配置

2019-09-11 18:46

个人理解，基于 Java 的配置就是一种替代 XML 配置文件的方法。根据前面所学，一个 XML 配置文件内包含一个或多个 bean。可以进行 依赖配置 ，注入等。那么用 Java 配置也应该有这些配置方法。

1. `@Configuration` ： 用 @Configuration 注解的类表示为一个配置类，相当于 XML配置文件。

2. `@Bean`：用 @Bean 注解的类表示该类作为一个 Bean 对象，将返回一个 bean 对象。该类将被注册到 Spring 应用程序 Context。最简单可行的 @Configuration 类如下所示：

   ```java
   package com.gthncz.config;
   
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   
   import com.gthncz.beans.HelloWorld;
   
   @Configuration
   public class HelloWorldConfig {
   	private static final String TAG = HelloWorldConfig.class.getSimpleName();
   	
   	public HelloWorldConfig() {
   		System.out.println( TAG + " run on constructor. ");
   	}
   	
   	@Bean
   	public HelloWorld helloWorld() {
   		System.out.println( TAG + " run on helloWorld. ");
   		return new HelloWorld();
   	}
   	
   }
   ```

   @Configuration 注解表示 HelloWorldConfig 是一个配置类，@Bean 注解表示 helloWorld 将返回一个对象，并且将对象注册到 Spring 应用程序 Context。

   主程序：

   ```java
   package com.gthncz;
   
   import org.springframework.context.ApplicationContext;
   import org.springframework.context.annotation.AnnotationConfigApplicationContext;
   
   import com.gthncz.beans.HelloWorld;
   import com.gthncz.config.HelloWorldConfig;
   
   public class HelloWorldConfigDemo {
   
   	public static void main(String[] args) {
   		@SuppressWarnings("resource")
   		ApplicationContext context = new AnnotationConfigApplicationContext(HelloWorldConfig.class);
   		HelloWorld helloWorld = (HelloWorld) context.getBean("helloWorld"); // id 就是 Configuration 里面 @Bean 的方法名
   		helloWorld.setMsg(" GT : Hello World !");
   		System.out.println(" Msg : " + helloWorld.getMsg());
   	}
   
   }
   ```

   这里使用 `AnnotationConfigApplicationContext` 加载配置类 并提供给 Spring 容器。

   **注：可以加载各种配置类**：

   ```java
   public static void main(String[] args) {
      AnnotationConfigApplicationContext ctx = 
      new AnnotationConfigApplicationContext();
      ctx.register(AppConfig.class, OtherConfig.class);
      ctx.register(AdditionalConfig.class);
      ctx.refresh();
      MyService myService = ctx.getBean(MyService.class);
      myService.doStuff();
   }
   ```

   相当于将多个配置合并。

   执行输出：

   ![HelloWorldConfigDemo-result.png](HelloWorldConfigDemo-result.png)

   可以看出，Java 配置的方式 和 XML 配置的方式效果相同。

   **注入 Bean 的依赖**

   当 @Beans 依赖对方时，表达这种依赖性非常简单，只要有一个 bean 方法调用另一个，如下所示：

   ```java
   package com.tutorialspoint;
   import org.springframework.context.annotation.*;
   @Configuration
   public class AppConfig {
      @Bean
      public Foo foo() {
         return new Foo(bar());
      }
      @Bean
      public Bar bar() {
         return new Bar();
      }
   }
   ```

   这里是基于 constructor 方式的注入方法。另外，如果是基于 Setter 方式的注入方法，则不需要指定啥。。。如下：

   ```java
   package com.gthncz.config;
   
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   
   import com.gthncz.beans.AutoComplement;
   import com.gthncz.beans.SpellChecker;
   import com.gthncz.beans.TextEditor;
   
   @Configuration
   public class TextEditorConfig {
   	private static final String Tag = TextEditorConfig.class.getSimpleName();
   	
   	public TextEditorConfig() {
   		System.out.println(Tag + " run on constructor. ");
   	}
   	
   	@Bean
   	public TextEditor textEditor() {
   		System.out.println(Tag + " run on textEditor. ");
   		return new TextEditor(spellChecker());
   	}
   	
   	@Bean
   	public SpellChecker spellChecker() {
   		System.out.println(Tag + " run on spellChecker. ");
   		return new SpellChecker();
   	}
   	
   	@Bean
   	public AutoComplement autoComplement() {
   		System.out.println(Tag + " run on autoComplement. ");
   		return new AutoComplement();
   	}
   
   }
   ```

   这个配置对应于如下的 XML 配置：

   ```xml
   <beans>
   	<bean id="textEditor" class="com.gthncz.beans.TextEditor">
       	<constructor-arg ref="spellChecker"></constructor-arg> <!-- constructor-based DI -->
       </bean>
       
       <bean id="spellChecker" class="com.gthncz.beas.SpellChecker" ></bean>
       
       <!-- 注意，这个 autoComplement bean 并没有注入到 textEditor 中，可以使用 autowire 注入 -->
       <bean id="autoComplement" class="com.gthncz.beans.AutoComplement"></bean>
       
   </beans>
   ```

   主程序：

   ```java
   package com.gthncz;
   
   import org.springframework.context.ApplicationContext;
   import org.springframework.context.annotation.AnnotationConfigApplicationContext;
   
   import com.gthncz.beans.TextEditor;
   import com.gthncz.config.TextEditorConfig;
   
   public class TextEditorConfigDemo {
   
   	public static void main(String[] args) {
   		@SuppressWarnings("resource")
   		ApplicationContext context = new AnnotationConfigApplicationContext(TextEditorConfig.class);
   		TextEditor textEditor = (TextEditor) context.getBean("textEditor");
   		textEditor.spellCheck();
   		textEditor.autoComplete();  // 需要设置 @Autowired 注解，否则没有将 AutoComplement 注入到 TextEditor 中，报 NullPointerException
   	}
   
   }
   ```

   执行输出：

   ![TextEditorConfigDemo-result.png](TextEditorConfigDemo-result.png)

   从输出可以看出，spellChecker 已经被注入到 textEditor 中，但是 autoComplement 没有，因此抛出了 空指针异常。可以为 TextEditor 类中的 autoComplement 属性添加 @Autowired 注解。

3. `@Import`注解：**@import** 注解允许从另一个配置类中加载 @Bean 定义。

   考虑 ConfigA 类，如下所示：

   ```java
   @Configuration
   public class ConfigA {
       @Bean public A a() return new A();
   }
   ```

   可以在另一个 Bean 声明中哦你导入上述 Bean 声明，如下所示：

   ```java
   @Configuration
   @Import(ConfigA.class)
   public class ConfigB {
       @Bean public B a() return new A();
   }
   ```

   当实例化上下文时，不需要同时指定 ConfigA.class 和 ConfigB.class，只有 ConfigB.class 需要提供：

   ```java
   public static void main(String[] args) {
      ApplicationContext ctx = 
      new AnnotationConfigApplicationContext(ConfigB.class);
      // now both beans A and B will be available...
      A a = ctx.getBean(A.class);
      B b = ctx.getBean(B.class);
   }
   ```

   **生民周期回调**

   Java 配置方法中 与 XML 配置方法 配置`init-method` 和 `destroy-method` 类似的方法：

   ```java
   public class Foo(){
       public void init(){}
       public void destroy(){}
   }
   @Configuration
   public class AppConfig{
       @Bean(initMethod="init", destroyMethod="destroy")
       public Foo foo() return new Foo();
   }
   ```

   **Bean Scope**

   默认的 bean scope 是 `singleton`，但是可以通过 `@Scope` 注解指定：

   ```java
   @Configuration
   public class AppConfig{
       @Bean(initMethod="init", destroyMethod="destroy")
       @Scope("prototype")
       public Foo foo() return new Foo();
   }
   ```

   

## Spring 框架 AOP

### 基于 AOP 的 XML 架构

### 基于 AOP 的 @aspectj

## Spring JDBC

## Spring Transaction 管理

### 编程式 transaction 管理

### 声明式 transaction 管理

## Spring Web MVC 框架

2019-09-15 18:00

MVC 各个部分的功能不用多说，和其他的框架是一样的。Spring Web MVC 框架是围绕 `DispatcherServlet` 构建的。*DispatcherServlet* 用来处理所有的 HTTP 请求和响应。Spring Web MVC *DispatcherServlet* 的请求处理的工作流程如下图所示：

![mvc1.png](mvc1.png)

当一个 Http Request 传入时，处理的流程如下：

1. `DispatcherServlet` 拦截 Http Request，并扫描 `WEB-INF`下 `web.xml`文件中 `servlet-mapping`定义的所有`servlet`，查找匹配的Servlet，交由该Servlet处理。
2. 根据选择的 servlet，扫描 `WEB-INF` 下的 `<servlet-name>-servlet.xml`文件，交由 `<context:component-scan />` 扫描得到的 `Controller` 处理。*控制器*接受请求，并基于使用的 `GET` 或 `POST` 方法来调用适当的 service 方法。Service 方法将基于定义的业务逻辑设置模型数据，并返回 View 名称到 *DispatcherServlet* 中。
3. *DispatcherServlet* 会从 `ViewResolver` 获取帮助，为请求检取定义视图。
4. 一旦确定视图，*DispatcherServlet* 将把模型数据传递给视图，最后呈现在浏览器中。

上面所提到的所有组件，即 `HandlerMapping`、`Controller` 和 `ViewResolver` 是 `WebApplicationContext` 的一部分，而 *WebApplicationContext* 是带有一些对 web 应用程序必要的额外特性的 *ApplicationContext* 的扩展。

### Spring MVC HelloWeb 项目

2019-09-15 18:00

接下创建我们的 HelloWeb 项目，不得不吐槽，W3CSchool 的教程写的太垃圾了。。。看了半天才弄懂怎么搭，接下来我将我搭建的经验写下来。整个项基于 Eclipise IDE。

1. 创建 `Dynamic Web Project`  HelloWeb。这里需要安装 eclipse 插件：`Eclipse Java EE Developer Tools`, `Eclipse Java Web Developer Tools`，`Eclipse Web Developer Tools`

   创建后的项目结构如下：

   ![HelloWeb-Project-Structor.png](HelloWeb-Project-Structure.png)

   

   主要目录说明（参考[Dynamic Web projects and applications ](https://help.eclipse.org/neon/index.jsp?topic=%2Forg.eclipse.stardust.docs.wst%2Fhtml%2Fwst-integration%2Fdynamic-web-proj.html)）：

   * JavaSource：包含项目的 Java 资源，包括 `classes`, `beans`, `servlet`。当这些资源添加到项目后，将会自动编译并且生成文件添加到 `WEB-INF/classes` 目录。（然而看起来并没有。。）这些资源目录的内容将不会被打包到 `war` 文件，除非指定了选项。
   * WebContent：这是强制的 Web resource 目录，包括 `HTML`, `JSP`, `graphic files` 等等。如果文件不在这个目录下（或者这个目录的子目录下），那么当这个应用在 server 上运行时这些资源将不可用。 WebContent 目录代表着将会部署到 server 上的 `war` 文件的内容。
   * META-INF：这个目录包含 `MANIFEST.MF` 文件，用来映射依赖的 `jar` 文件的class path。
   * WEB-INF：这个目录遵守 *Sun Microsystems Java Servlet 2.3 Specification*，包含 Web 应用的 supporting Web resource，包括 `web.xml` 以及 `classes` 和 `lib` 目录。
   * /classse：包含 `servlet`, `utility classes` 以及 Java Compiler 的输出。
   * /lib：这个目录包含一些你的 Web 应用的依赖 jar 包。

   **注意：**基于 Maven 的 `maven-archetype-webapp` 构建的 Web 项目和这里的项目结构不相同。后面将会介绍如何基于 Maven 构建 Web 项目。

2. 创建一个 `servlet`和`servlet-mapping`。在 `WEB-INF/web.xml`文件内配置，完整文件如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <web-app id="WebApp_ID" version="2.4"
   	xmlns="http://java.sun.com/xml/ns/j2ee"
   	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   	xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd ">
   	
   	<display-name>Spring MVC Project</display-name>
   	
   	<servlet>
   		<servlet-name>HelloWeb</servlet-name>
   		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
   		<load-on-startup>1</load-on-startup>
   	</servlet>
   	
   	<servlet-mapping><!-- 表明哪些URLs将被DispatcherServlet处理 -->
   		<servlet-name>HelloWeb</servlet-name>
   		<url-pattern>/</url-pattern> <!-- 这个 Servlet 处理的路由 -->
   	</servlet-mapping>
   	
   </web-app>
   ```

3. 创建 Controller。在 *Java Resource/src/* 下创建package: com.gthncz。创建 `HelloController.java`：

   ```java
   package com.gthncz;
   
   import org.springframework.stereotype.Controller;
   import org.springframework.ui.ModelMap;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.bind.annotation.RequestParam;
   
   @Controller
   public class HelloController {
   	
   	@RequestMapping(name = "/hello", method = RequestMethod.GET)
   	public String helloWorld(@RequestParam(name = "name", required = false, defaultValue = "World") String name, ModelMap modal) {
   		modal.addAttribute("message", "Hello " + name +" !");
   		return "hello"; // 返回视图名称
   	}
   
   }
   ```

   这里的 `@Controller` 表明这是一个 控制器类。可以写 `@Controller(name = '/hello')`，表示这个 控制器下的方法 都在 `/hello` 这个路径下。 `@RequestMapping` 表明这是一个 `service`， `method = RequestMethod.GET` 属性表示 `helloWorld` 这个 service 作为 GET 方法默认的 service。同样的，可以定义 POST 默认的处理方法。

   在 service 内部可以实现 业务逻辑，并且通过 modelMap 将 message 这个属性传递到 View 中，最后返回一个字符串，内容为 需要渲染的 View 名称。

3. 创建 HelloWeb Servlet的配置文件 `WEB-INF/HelloWeb-servlet.xml`：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans
   	xmlns="http://www.springframework.org/schema/beans"
   	xmlns:context="http://www.springframework.org/schema/context"
   	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd 
   		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
   	
   	<!-- 激活 Spring MVC的注释功能，可以自动扫描 @Controller @RequestMapping 等注解 -->
   	<context:component-scan base-package="com.gthncz"></context:component-scan>
   	
   	<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
   		<property name="prefix" value="/WEB-INF/hello/"></property>
   		<property name="suffix" value=".jsp"></property>
   	</bean>
   	
   </beans>
   ```

   这个文件定义了 Java Beans等。利用 `context:component-scan` 标签将用于激活 Spring MVC 注释扫描功能，该功能允许使用注释，如 `@Controller` 和 `@RequestMapping` 等等。`InternalResourceViewResolver` 将使用定义的规则来解决 View 名称。按照上述定义的规则，一个名称为 **hello** 的逻辑视图将发送给位于 `/WEB-INF/jsp/hello.jsp` 中实现的视图。

4. 创建 JSP 视图。创建 `WEB-INF/hello/hello.jsp` 文件：

   ```jsp
   <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
   <!DOCTYPE html>
   <html>
   <head>
   <meta charset="UTF-8">
   <title>Spring MVC Project</title>
   </head>
   <body>
   	<h2>${message}</h2>
   </body>
   </html>
   ```

   对于不同的表示技术，Spring MVC 支持许多类型的视图。这些包括 JSP、HTML、PDF、Excel 工作表、XML、Velocity 模板、XSLT、JSON、Atom 和 RSS 提要、JasperReports 等等。但我们最常使用利用 JSTL 编写的 JSP 模板。其中，**${message}** 是我们在控制器内部设置的属性。你可以在你的视图中有多个属性显示。

5. 将需要的依赖包放到 `WEB-INF/lib` 目录下，这个工作可以在创建了项目后立即完成。HelloWeb 项目依赖的包有：

   ![HelloWeb-lib.png](HelloWeb-lib.png)

6. 最后，利用 eclipse 将项目导出为 `war` 文件部署到 server 上。

   导出方法: **Export**->**WAR file**。

   部署方法：我这里安装的 Tomcat v9.0。webapps 目录在 `/usr/share/tomcat/webapps/` 。直接将 `HelloWeb.war` 文件复制到 该目录下即可。Tomcat 默认运行端口为 8080，打卡浏览器运行: [127.0.0.1:8080/HelloWeb/hello](127.0.0.1:8080/HelloWeb/hello)。

   看到的效果为：

   ![HelloWeb-result.png](HelloWeb-result.png)

   

   ### Sprin MVC 表单

   2019-09-16  09:23

   

   接下来完成Spring MVC表单的编写和传值。

   1. 首先，在原有的 HelloWeb 项目下修改。将 HelloController 作为一个独立的访问路径，后面新建的 StudentController 作为另外一个独立的访问路径。修改后下项目结构如下：

      ![HelloWeb-Student-proj-structure.png](HelloWeb-Student-proj-structure.png)

      修改 HelloWeb-servlet.xml (只是修改了 prefix 的路径)：

      ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <beans
      	xmlns="http://www.springframework.org/schema/beans"
      	xmlns:context="http://www.springframework.org/schema/context"
      	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd 
      		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
      	
      	<!-- 激活 Spring MVC的注释功能，可以自动扫描 @Controller @RequestMapping 等注解 -->
      	<context:component-scan base-package="com.gthncz"></context:component-scan>
      	
      	<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
      		<property name="prefix" value="/WEB-INF/jsp/"></property>
      		<property name="suffix" value=".jsp"></property>
      	</bean>
      	
      </beans>
      ```

      修改 HelloController.java，设立独立访问路径：

      ```java
      package com.gthncz;
      
      import org.springframework.stereotype.Controller;
      import org.springframework.ui.ModelMap;
      import org.springframework.web.bind.annotation.RequestMapping;
      import org.springframework.web.bind.annotation.RequestMethod;
      import org.springframework.web.bind.annotation.RequestParam;
      
      @Controller
      @RequestMapping("/hello") /* 这里不是 name = "/hello"，表示将 hello 加入到 url 中 */
      public class HelloController {
      	
      	@RequestMapping(value = {"", "/", "/helloWorld"}, method = RequestMethod.GET)
      	public String helloWorld(@RequestParam(name = "name", required = false, defaultValue = "World") String name, ModelMap modal) {
      		modal.addAttribute("message", "Hello " + name +" !");
      		return "hello/hello"; // 返回视图名称
      	}
      
      }
      ```

      需要注意的是，`HelloController`的`@RequestMapping` 属性不是 `name = "/hello"` , 否则不会起效果。实际上，不写的话，默认属性是 `value` ， 即 `value = "/hello"` 应该是起作用的。这里是一种简写的方法，如果有其他属性比如 `method = RequestMethod.GET`的话，则需要指明属性 `value`。

      另外，由于 `hello.jsp` 文件位于 `/WEB-INF/jsp/hello/hello.jsp`，因此在返回视图名称的时候要返回相对于 `HelloWeb-servlet` 配置的前缀`/WEB-INF/jsp/`的路径。

      本来我的想法是分别使用两个Servlet 完成两种不同的业务逻辑，但是由于 `<url-pattern>`的不熟悉，放弃了这种方式，改由不同的 `Controller` 实现业务逻辑的分离。

   2. 编写 Beans， StudentController。

      * Student.java

      ```java
      package com.gthncz.beans;
      
      public class Student {
      	
      	private String name;
      	private int age;
      	
      	public String getName() {
      		return name;
      	}
      	public void setName(String name) {
      		this.name = name;
      	}
      	public int getAge() {
      		return age;
      	}
      	public void setAge(int age) {
      		this.age = age;
      	}
      	@Override
      	public String toString() {
      		return "Student [name=" + name + ", age=" + age + "]";
      	}
      }
      ```

      * StudentController.java

      ```java
      package com.gthncz;
      
      import org.springframework.stereotype.Controller;
      import org.springframework.ui.ModelMap;
      import org.springframework.web.bind.annotation.ModelAttribute;
      import org.springframework.web.bind.annotation.RequestMapping;
      import org.springframework.web.bind.annotation.RequestMethod;
      import org.springframework.web.servlet.ModelAndView;
      
      import com.gthncz.beans.Student;
      
      @Controller
      @RequestMapping("/student")
      public class StudentController {
      	
      	@RequestMapping(value = {"", "/", "/index"}, method = RequestMethod.GET)
      	public ModelAndView index() {
      		// ModelAndView(String viewName, String modelName, Object modelObject)
      		return new ModelAndView("student/student", "command", new Student()); 
      	}
      	
      	@RequestMapping(value = "/addStudent", method = RequestMethod.POST)
      	public String addStudent(@ModelAttribute("SpringWeb") Student student, ModelMap model) {
      		model.addAttribute("name", student.getName());
      		model.addAttribute("age", student.getAge());
      		return "student/result";
      	}
      
      }
      ```

      `StudentController`处理独立路径`/student`下的 service。index() 方法的 @RequestMapping 中属性 `value = {"", "/", "/index"}` 表示这三种 url 路径都将匹配到 index service：/HelloWeb/student, /HelloWeb/student/, /HelloWeb/student/index。

      index 传入 具有属性 `command` ，值为 `new Student()` 的 model 到前端 student.jsp 文件。`@ModelAttriute` 用在 service 参数上是为了可以直接从参数上取值，参考 [@ModelAttribute三种使用场景](https://blog.csdn.net/wxgxgp/article/details/81304570)。

   3. 编写 视图文件。

      ```jsp
      <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
      <%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"  %> <!-- 使用 Spring MVC 标签库 -->
      
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <title>Add Student</title>
      </head>
      <body>
      <h2>Student Information</h2>
      <form method="POST" action="/HelloWeb/student/addStudent">
      	<table>
      		<tr>
      			<td><label for="name">Name</label></td>
      			<td><input name="name" width="100px"/></td>
      		</tr>
      		<tr>
      			<td><label for="age">Age</label></td>
      			<td><input name="age" width="100px" /></td>
      		</tr>
      		<tr>
      			<td colspan="2"><input type="submit" value="Submit" /></td>
      		</tr>
      	</table>
      </form>
      <hr/>
      <form:form method="POST" action="#">
      	<!-- 绑定属性的path时候，后端需要传入 Command 对象 -->
      	<form:input path="name" placeholder="name" width="120px" type="text" />
      	<form:input path="age" placeholder="18" width="120px" type="number"/>
      </form:form>
      
      </body>
      </html>
      ```

      这里写了两个表单，一个是 HTML 的普通表单，另外一个是 Spring MVC 标签的表单。两个表单的作用相同。

      使用 Spring MVC表单的时候，需要声明使用 `taglib`，否则不起作用：

      ```jsp
      <%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"  %> <!-- 使用 Spring MVC 标签库 -->
      ```

      还有更多Spring表单标签，参考[Spring MVC的标签库](https://www.jianshu.com/p/796ec1926150)。

      页面效果如下：

      ![HelloWeb-Student-form.png](HelloWeb-Student-form.png)

      下面是提交后的页面：

      ```jsp
      <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <title>Submitted Student Information</title>
      </head>
      <body>
      <h2>Submitted Student Information</h2>
      <table>
          <tr>
              <td>Name</td>
              <td>${name}</td>
          </tr>
          <tr>
              <td>Age</td>
              <td>${age}</td>
          </tr>
      </table> 
      </body>
      </html>
      ```

      页面效果：

      ![HelloWeb-Student-form-result.png](HelloWeb-Student-form-result.png)

      因此，这里的表单数据可以被正常提交，并可以正确显示。

### Spring 页面重定向

2019-09-16 11:00

页面重定向使用 语句 `"redirect:/<controller>/<service>"` 实现，service 返回重定向字符串交由 ViewResolver 处理。

下面是一个页面重定向的例子（基于 StudentController 修改）：

1. 新建 service `redirect`：

   ```java
   package com.gthncz;
   
   import org.apache.log4j.Logger;
   import org.springframework.stereotype.Controller;
   import org.springframework.ui.ModelMap;
   import org.springframework.web.bind.annotation.ModelAttribute;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.servlet.ModelAndView;
   import org.springframework.web.servlet.mvc.support.RedirectAttributes;
   
   import com.gthncz.beans.Student;
   
   @Controller
   @RequestMapping("/student")
   public class StudentController {
   	private static Logger log = Logger.getLogger(StudentController.class);
   	
   	@RequestMapping(value = {"", "/", "/index"}, method = RequestMethod.GET)
   	public ModelAndView index() {
   		// ModelAndView(String viewName, String modelName, Object modelObject)
   		return new ModelAndView("student/student", "command", new Student()); 
   	}
   	
   	@RequestMapping(value = "/addStudent", method = { RequestMethod.POST, RequestMethod.GET })
   	public String addStudent(@ModelAttribute Student student, ModelMap model) {
   		log.info("redirected student: " + student.toString());
   		model.addAttribute("name", student.getName());
   		model.addAttribute("age", student.getAge());
   		return "student/result";
   	}
   	
   	@RequestMapping(value = "/redirect", method = RequestMethod.POST)
   	public String redirect(@ModelAttribute Student student, RedirectAttributes attrs) {
   		// attrs.addAttribute() 使用这个方法会将 参数 附加到 url 的后面，下面这个不会，而是暂存在 session 中
   		log.info(student.toString());
   		attrs.addFlashAttribute("student", student);
   		return "redirect:addStudent"; // 重定向到 addStudent, 重定向过去是 GET 方法
   	}
   
   }
   ```

   *redirect()* 方法 中接收了表单 student 的数据，利用 `@ModelAttribute` 绑定（自动根据名称绑定）。由于需要将接收到的数据转发出去，使用 `RedirectAttributes` 存储数据。如果使用`attrs.addAttribute()` 方法，添加的数据会自动添加在 url 的末尾；而使用 `attrs.addFlashAttribute()` 方法则是将数据暂存到 `session` 中，到达 target 后自动销毁，不会附加到 url 末尾。当然，直接将数据附加在 url 末尾也是可以的。

   这里直接使用 `"redirect:addStudent"` 重定向，内部是交由 ViewResolver 处理。也可以使用 ` new ModelAndView("redirect:addStudent")` 重定向。

   **注：**重定向的 status code 为 302，而 target service 接收到的是 一个  GET 方法，因此要 addStudent 的 `method` 属性要添加一条 `RequestMethod.GET`。

2. 修改表单 action 地址：

   ```jsp
   <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
   <%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"  %> <!-- 使用 Spring MVC 标签库 -->
   
   <!DOCTYPE html>
   <html>
   <head>
   <meta charset="UTF-8">
   <title>Add Student</title>
   </head>
   <body>
   <h2>Student Information</h2>
   <form method="POST" action="/HelloWeb/student/addStudent">
   	<table>
   		<thead>
   		<tr>
   			<td colspan=2> Direct post </td>
   		</tr>
   		</thead>
   		<tr>
   			<td><label for="name">Name</label></td>
   			<td><input name="name" width="100px"/></td>
   		</tr>
   		<tr>
   			<td><label for="age">Age</label></td>
   			<td><input name="age" width="100px" /></td>
   		</tr>
   		<tr>
   			<td colspan="2"><input type="submit" value="Submit" /></td>
   		</tr>
   	</table>
   </form>
   <hr/>
   <form:form method="POST" action="/HelloWeb/student/redirect">
   	<thead><tr><td colspan=2>Redirect post</td></tr></thead>
   	<!-- 绑定属性的path时候，后端需要传入 Command 对象 -->
   	<br/>
   	<form:input path="name" placeholder="name" width="120px" style="height: 26px;margin-bottom: 5px ;" type="text" /> <br/>
   	<form:input path="age" placeholder="18" width="120px" style="height: 30px;" type="number"/> </br>
   	<input type="submit" value="Submit" />
   </form:form>
   
   </body>
   </html>
   ```

   分成了两个表单，上面的表单是直接 POST 到 addStudent 方法；下面这个表单则是 POST 到 redirect 方法。

3. 执行截图：

   ![HelloWeb-Student-redirect-index.png](HelloWeb-Student-redirect-index.png)

   这是 首页，显示两个表单。下面填写下面这个表单并提交：

   ![HelloWeb-Student-redirect-result.png](HelloWeb-Student-redirect-result.png)

   可以看到，表单经过重定向 (302) 后交付到 addStudent 。

### Spring MVC 异常处理

2019-09-16 15:49

参考[SpringMVC中的统一异常处理](https://blog.csdn.net/eson_15/article/details/51731567).

系统中异常包括：编译时异常和运行时异常`RuntimeException`，前者通过捕获异常从而获取异常信息，后者主要通过规范代码开发、测试通过手段减少运行时异常的发生。在开发中，不管是DAO层、Service层还是Controller层，都有可能抛出异常，在Spring MVC中，能将所有类型的异常处理从各处理过程解耦出来，既保证了相关处理过程的功能较单一，也实现了异常信息的统一处理和维护。

这里我使用了 Spring 自带的 `SimpleMappingExceptionResolver` 来捕获异常的显示：

1. 定义一个 异常类：

   ```java
   package com.gthncz;
   
   public class SpringException extends RuntimeException {
   
   	private static final long serialVersionUID = 1L;
   	
   	private String exceptionMessage;
   
   	public SpringException(String exceptionMessage) {
   		super();
   		this.exceptionMessage = exceptionMessage;
   	}
   
   	public String getExceptionMessage() {
   		return exceptionMessage;
   	}
   
   	public void setExceptionMessage(String exceptionMessage) {
   		this.exceptionMessage = exceptionMessage;
   	}
   
   
   ```

2.  在 `StudentController` 的 `addStudent()`  方法上添加 `@ExceptionHandler` 

   ```java
   	@RequestMapping(value = "/addStudent", method = { RequestMethod.POST, RequestMethod.GET })
   	@ExceptionHandler({ SpringException.class }) /* 异常处理，可以多个，用‘,’ 分开 */
   	public String addStudent(@ModelAttribute Student student, ModelMap model) {
   		log.info("redirected student: " + student.toString());
   		if(student.getName().length() < 1) {
   			throw new SpringException("Given name is too short !");
   		}
   		if(student.getAge() < 0 ) {
   			throw new SpringException("Given age is illegal !");
   		}
   		model.addAttribute("name", student.getName());
   		model.addAttribute("age", student.getAge());
   		return "student/result";
   	}
   ```

   使用注解 `@ExceptionHandler` 表示使用的异常处理器，多个处理器使用 `,` 分开。为了效果我们内部抛出自定义异常。

3. 在 `HelloWeb-servlet.xml` 中配置 ExceptionHandler：

   ```xml
   	<!-- 处理异常 -->
   	<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
   		<!-- 定义默认的异常处理页面 -->
   	    <property name="defaultErrorView" value="error"/> <!-- /WEB-INF/jsp/error.jsp -->
   	    <!-- 定义异常处理页面用来获取异常信息的变量名，也可不定义，默认名为exception --> 
   	    <property name="exceptionAttribute" value="exception"/>
   	    <!-- 定义需要特殊处理的异常，这是重要点 --> 
   		<property name="exceptionMappings">
   			<props>
   				<!-- /WEB-INF/jsp/ExceptionPage.jsp -->
   				<prop key="com.gthncz.SpringException">ExceptionPage</prop>
   			</props>
   			<!-- 还可以有其他自定义异常 -->
   		</property>
   	</bean>
   ```

   声明使用自带的 `SimpleMappingExceptionResolver`，定义 `defaultErrorView`, `exceptionAttribute`, `exceptionMappings`。

4. 编写 defaul error view page, exception page：

   * error.jsp

   ```jsp
   <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
   <%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
   <!DOCTYPE html>
   <html>
   <head>
   <meta charset="UTF-8">
   <title>Spring Error Page</title>
   </head>
   <body>
   	<p>An error occured, please contact webmaster.</p>
   </body>
   </html>
   ```

   * ExceptionPage.jsp

   ```jsp
   <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
   <%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
   <!DOCTYPE html>
   <html>
   <head>
   <meta charset="UTF-8">
   <title>Spring Exception Handling</title>
   </head>
   <body>
   	<h2>Spring MVC Exception Handling</h2>
   	
   	<h3>${exception.exceptionMessage}</h3>
   </body>
   </html>
   ```

   这里的 变量名 `exception` 在 `HelloWeb-servlet.xml` 中配置。

5. 执行：

   ![HelloWeb-Student-Exception-index.png](HelloWeb-Student-Exception-index.png)

   输入 name: GT, Age : -1。根据 addStudent 的 业务逻辑，将会抛出 `Given age is illegal !` 的异常。

   ![HelloWeb-Student-Exception-result.png](HelloWeb-Student-Exception-result.png)

   可以看出，抛出的异常被捕获并打印出原因。

### Spring Log4j 的使用

2019-09-16 16:07

需要两个jar包：commons-logging.jar，log4j-core.jar 。在需要的类内使用：

```java
@Controller
@RequestMapping("/student")
public class StudentController {
	private static Logger log = Logger.getLogger(StudentController.class);
    // ...
    	@RequestMapping(value = "/redirect", method = RequestMethod.POST)
	public String redirect(@ModelAttribute Student student, RedirectAttributes attrs) {
		// attrs.addAttribute() 使用这个方法会将 参数 附加到 url 的后面，下面这个不会，而是暂存在 session 中
		log.info(student.toString());
		attrs.addFlashAttribute("student", student);
		return "redirect:addStudent"; // 重定向到 addStudent, 重定向过去是 GET 方法
	}
}
```

Log4J 还需要在 src 目录下定义配置`log4j.properties`：

```
# Define the root logger with appender file
log4j.rootLogger = DEBUG, FILE

# Define the file appender
log4j.appender.FILE=org.apache.log4j.FileAppender
# Set the name of the file
log4j.appender.FILE.File=/home/gt/Documents/java/HelloWeb/log.out

# Set the immediate flush to true (default)
log4j.appender.FILE.ImmediateFlush=true

# Set the threshold to debug mode
log4j.appender.FILE.Threshold=debug

# Set the append to false, overwrite
log4j.appender.FILE.Append=false

# Define the layout for file appender
log4j.appender.FILE.layout=org.apache.log4j.PatternLayout
log4j.appender.FILE.layout.conversionPattern=%m%n
```

当然，也可以使用 commons-logging 的日志功能:

```java
static Log log = LogFactory.getLog(MainApp.class.getName());
log.info("Going to create HelloWord Obj");
```



## 总结

2019-09-16 16:17

到此，W3CSchool 上的Spring 入门教程算是学完了。但是感觉这些知识还远远不够将来上手做项目。

现在也完全没有感受到 Spring 框架的便捷性。。倒是那么多的 配置文件 让人觉得头疼。。

现在还有几个问题没有解决：

* eclipse 中将 war 文件部署到 Tomcat 服务器

继续加油学习吧！接下来要学习 Spring Boot框架。