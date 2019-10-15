---
title: Spring-boot入门
date: 2019-09-18 08:21:12
tags: Spring-boot
---

接着上一篇[Spring入门](https://htmlgtmk.github.io/blog/2019/09/09/Spring入门) ，这里记录 Spring Boot 的学习。

参考：

[1] 官方文档 [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/2.1.8.RELEASE/reference/html/)

[2] 慕课网 [SpringBoot开发常用技术整合](https://www.imooc.com/learn/956)

Spring Boot 可以用来干什么？Spring Boot 可以干 Spring 可以干的所有事情，Spring Boot 是 Spring 的一个 ‘全家桶’，提供开发者一个企业级的开发框架。

<!-- more -->

Spring Boot (2.1.8) 系统要求：

* Java 8 - Java 12
* Spring Framework 5.1.9.RELEASE
* Maven 3.3+ or Gradle 4.4+

Servlet Container 要求：Tomcat 9.0 ， 或者  Jetty 9.4 ，或者 Undertow 2.0。

开发工具：Eclipse + Spring Tools Suite (STS) 插件。

一个典型的 Maven 依赖文件 `pom.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>com.example</groupId>
	<artifactId>myproject</artifactId>
	<version>0.0.1-SNAPSHOT</version>

	<!-- Inherit defaults from Spring Boot -->
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.1.8.RELEASE</version>
	</parent>

	<!-- Add typical dependencies for a web application -->
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
	</dependencies>

	<!-- Package as an executable jar -->
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>
    
</project>
```

Spring Boot 的 `groupId` 是 `org.springframework.boot`。从 `spring-boot-starter-parent` 和 `spring-boot-starter-web`继承了 依赖关系，可以显著减少 pom.xml 文件中的依赖，快速上手，但是对项目可能会增加不必要的依赖包。还有许多其他功能的 `Starters`, 参考 [spring-boot-starters](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters/README.adoc) 。

`spring-boot-cli` 的安装略过，这里不需要在命令行使用 Spring  Boot 。

## 创建 Spring Boot HelloWorld 项目

### 创建 HelloSpringBoot 项目 

使用 [https://start.spring.io/](https://start.spring.io/)  创建 Spring Boot 项目，其实在 eclipse 中创建 Spring Boot 项目也是 利用这个网站。

![start.spring.io.png](start.spring.io.png)

选择使用 `Maven` 或者 `Gradle`, 选择 Java 版本，选择 Spring Boot 版本，填写 package name。点击下载。将 zip 压缩包解压到项目路径。再在 eclipse 中导入这个项目即可。当然，直接在 eclipse 中创建也是可以的。

创建好的 Spring Boot 项目结构如下：

![HelloSpringBoot-Structure.png](HelloSpringBoot-Structure.png)

在 `src` 目录下 由 `src/main/java`, `src/test/java`, `src/main/resources`，还**需要手动添加 `src/main/webapp`目录**。自动生成的 pom.xml 文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.1.8.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.gthncz</groupId>
	<artifactId>HelloSpringBoot</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<packaging>war</packaging>
	<name>HelloSpringBoot</name>
	<description>Demo project for Spring Boot</description>

	<properties>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-tomcat</artifactId>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>
```

可以看到，配置比较简单。在 eclipse 中可以使用 `ctrl` 键看一下每个依赖具体的 pom 依赖。

### 创建 HelloController 控制器

新建 package `com.gthncz.controller`，新建 class `HelloController.java`：

```java
package com.gthncz.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController /* @RestController = @Controller + @ResponseBody */
// @Controller
@RequestMapping("/Hello")
public class HelloController {
	
	@RequestMapping("/")
	// @ResponseBody /* 表明这个直接返回字符串，不需要 ViewResolver 解析 */
	public Object hello() {
		return "Hello World !";
	}

}
```

这里直接返回 字符串，而不是一个 view 的名称。 `@ResponseBody` 表示该方法的返回的结果直接写入 HTTP 响应正文（`ResponseBody`）中，一般在异步获取数据时使用。而 `@RestController` 比较智能，可以自动识别是 视图名称还是 普通字符串，功能上 `@RestController` = `@Controller` + `@ResponseBody`。 `@RestController` 需要 `spring-boot-starter-web`的依赖。

在使用 `@RestController` 的时候，遇到如下问题：

> Error: Exception thrown by the agent : java.net.MalformedURLException: Local host name unknown: java.net.UnknownHostException: localhost.localdomain: localhost.localdomain: 未知的名称或服务
> sun.management.AgentConfigurationError: java.net.MalformedURLException: Local host name unknown: java.net.UnknownHostException: localhost.localdomain: localhost.localdomain: 未知的名称或服务
> 	at sun.management.jmxremote.ConnectorBootstrap.startRemoteConnectorServer(ConnectorBootstrap.java:480)
> 	at sun.management.Agent.startAgent(Agent.java:262)
> 	at sun.management.Agent.startAgent(Agent.java:452)
> Caused by: java.net.MalformedURLException: Local host name unknown: java.net.UnknownHostException: localhost.localdomain: localhost.localdomain: 未知的名称或服务
> 	at javax.management.remote.JMXServiceURL.<init>(JMXServiceURL.java:289)
> 	at javax.management.remote.JMXServiceURL.<init>(JMXServiceURL.java:253)
> 	at sun.management.jmxremote.ConnectorBootstrap.exportMBeanServer(ConnectorBootstrap.java:739)
> 	at sun.management.jmxremote.ConnectorBootstrap.startRemoteConnectorServer(ConnectorBootstrap.java:468)
> 	... 2 more

在`/etc/hosts` 文件中添加 `localhost.localdomain` 项到 `127.0.0.1` 和  `::1`对应项中。另外，在使用  `@Controller`+`@ResponseBody` 的时候没有遇到这个问题。

### 运行 Spring Boot 程序

在项目名称上或者 `XXXApplication.java` 上右键， 选择 `Run AS` -> `Spring Boot App`。console 输出如下：

![HelloSpringBoot-Hello-result-console.png](HelloSpringBoot-Hello-result-console.png)

输出显示已经启动了 tomcat，运行端口为 8080，打开浏览器，输入 `localhost:8080/Hello/`:

![HelloSpringBoot-Hello-result-browser.png](HelloSpringBoot-Hello-result-browser.png)

结果显示了 HelloController 的输出。

还可以直接从 terminal 上使用`mvn` 命令运行程序：

```shell
mvn spring-boot:run
```

这里 pom.xml 配置的 build plugin 是 `spring-boot-maven-plugin`，也可以使用 `jetty` 的 plugin，这样运行程序就是：

```shell
mvn  jetty:run
```

## Spring Boot构造并返回 JSON 对象

1. 创建一个 package `com.gthncz.pojo`， 创建类 `User.java`：

   ```java
   package com.gthncz.pojo;
   
   import java.util.Date;
   
   import com.fasterxml.jackson.annotation.JsonFormat;
   import com.fasterxml.jackson.annotation.JsonIgnore;
   import com.fasterxml.jackson.annotation.JsonInclude;
   import com.fasterxml.jackson.annotation.JsonInclude.Include;
   
   public class User {
   	
   	private String name;
   	@JsonIgnore /* 转换成 JSON 时不显示 */
   	private String password;
   	private int age;
   	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GTM+8", locale = "zh") /* 转换成中国人的时间习惯 */
   	private Date birthday;
   	@JsonInclude(Include.NON_NULL) /* 当 不为 null 时包含进 JSON 数据中 */
   	private String desc;
   	
   	public String getName() {
   		return name;
   	}
   	public void setName(String name) {
   		this.name = name;
   	}
   	
   	public String getPassword() {
   		return password;
   	}
   	public void setPassword(String password) {
   		this.password = password;
   	}
   	public int getAge() {
   		return age;
   	}
   	public void setAge(int age) {
   		this.age = age;
   	}
   	public Date getBirthday() {
   		return birthday;
   	}
   	public void setBirthday(Date birthday) {
   		this.birthday = birthday;
   	}
   	public String getDesc() {
   		return desc;
   	}
   	public void setDesc(String desc) {
   		this.desc = desc;
   	}
   
   }
   ```

   这里的 `User` Bean 不需要像 Spring MVC 配置 bean。这里的注解是 `Jackson`转 `json`时常用的几个注解：

   * `@JsonIgnore`: 转换成 json 数据时忽略这一项，常用在敏感数据上，如 password。
   * `@JsonFormat`: 将 `Date` 格式数据转换成 字符串格式数据。
   * `@JsonInclude`: 转换成 json 数据时需要满足的条件，如 `Include.NON_NULL`。

2. 创建 `UserController.java`:

   ```java
   package com.gthncz.controller;
   
   import java.util.Date;
   
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;
   
   import com.gthncz.pojo.User;
   
   @RestController
   @RequestMapping("/user")
   public class UserController {
   	
   	@RequestMapping("/getUser")
   	public Object getUser() {
   		User user = new User();
   		user.setName("GT");
   		user.setPassword("123456");
   		user.setAge(18);
   		user.setBirthday(new Date());
   		user.setDesc("This is a alternative option.");
   		return user;
   	}
   	
   }
   ```

   这里的 `getUser()` 方法 直接返回一个 `User` 对象即可。会自动转换成 JSON 格式数据。

3. 执行 Spring Boot App, 打开浏览器：

   ![HelloSpringBoot-User-result.png](HelloSpringBoot-User-result.png)

   可以看到，password 项被忽略了，而 desc 项因为有值，也被包括进来了。

## Spring Boot 基础技术点

### `@SpringBootApplication` ：Locating the Main Application Class

Spring 推荐 Main Application Class 位于 root package。`@SpringBootApplication` 注解常常位于 Main Application Class，显示的声明一个 `Search pacakge` 。使用 `@SpringBootApplication` 也可以限制 `Component Scan` 在自己的project 范围内。当然，不想用 `@SpringBootApplication` 也可以使用 `@EnableAutoConfiguration` + `@ComponentScan` 代替。

`@SpringBootAppliction` = `@EnableAutoConfiguration` + `@ComponentScan` + `@Configuraion`.

```java
package com.example.myapplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // same as @Configuration @EnableAutoConfiguration @ComponentScan
// @Configuration
// @EnableAutoConfiguration
// @Import({ MyConfig.class, MyAnotherConfig.class })
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
```

### 配置类

Spring Boot 偏爱 基于 Java 的配置。虽然可以使用 `@SpringApplication`+`XML Sources` 的方式，Spring Boot 仍然推荐主要的配置是一个单一的 `@Configuration` Class 。 通常 `main()` 方法所在的类是作为一个首要的 `@Configuration` 候选。

1. import 额外的配置类

   使用 `@Import` 注解可以导入额外的配置类。或者，可以使用 `@ComponentScan`自动的检测 Spring Component，包括 `@Configuration` 注解的类。

2. import XML 配置

   如果必需使用基于 XML 的配置，可以在 `@Configuraton` 配置类的基础上，，使用 `@ImportResource`注解来加载 XML 配置文件。

3. Auto-Configuration

   使用 auto-configuration 需要开添加 `@EnableAutoConfiguration` 或者 `@SpringApplication` 注解到一个 `@Configuraion`注解的类。

   auto-configuration 是 非侵入式的。如果想要查看当前哪些配置是 auto-configuration 的，可以在运行前添加 `--debug` 选项。

   去除某个自动配置的项，使用 `exclude` 属性：

   ```java
   import org.springframework.boot.autoconfigure.*;
   import org.springframework.boot.autoconfigure.jdbc.*;
   import org.springframework.context.annotation.*;
   
   @Configuration
   @EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class})
   public class MyConfiguration {
   }
   ```

4. 外部化配置（Externalize Properties）

   参考 [Spring Boot干货系列：（二）配置文件解析](http://tengj.top/2017/02/28/springboot2/)。

   Spring Boot 允许使用外部化配置，以方便在不同的环境中使用相同的应用程序代码。可以使用 properties文件，yaml 文件，环境变量和 command line 参数来外部化配置。

   配置的参数具有层次性，全部的 order 参考官方文档： [Externalized Configuration](https://docs.spring.io/spring-boot/docs/2.1.8.RELEASE/reference/html/boot-features-external-config.html)：

   1. Command line arguments.
   2. `ServletConfig` init parameters.
   3. Java 系统属性（`System.getProperties()`）
   4. OS 环境变量
   5. 在 packaged jar 外面的 `application-{profile}.properties` 文件和 YAML 文件
   6. 在 packaged jar 里面的 `application-{profile.properties}` 文件和YAML 文件
   7. 在 packaged jar 外面的应用属性 `application.properties` 文件和YAML 文件
   8. 在 packaged jar 里面的应用属性 `application.properties` 文件和YAML 文件
   9. 使用 `@PropertySource` 注解标志的 `@Configuration` 类

   属性值可以通过 `@Value` 注解直接注入到 bean 的属性，或者 使用 `@ConfigurationProperties` 来绑定结构化的对象。如下的例子：

   ```java
   import org.springframework.stereotype.*;
   import org.springframework.beans.factory.annotation.*;
   
   @Component
   /* 绑定结构化的bean，需要在 Spring boot 入口指明加载哪个Bean， @EnableConfigurationProperties({MyBean.class}) */
   @ConfigurationProperties(prefix = "com.gthncz") 
   public class MyBean {
   
       // @Value("${com.gthncz.name}") // 有了 @ConfigurationProperties 就不需要这个
       private String name;
   
       // ...
   
   }
   ```

   `application.properties` 文件：

   ```prop
   com.gthncz.name="GT"
   ```

   **`application.properties`** 配置

   `application.properties` 是一个全局的配置文件，默认的位置位于：

   1. `file:./config/`
   2. `file:./`
   3. `classpath:/config/`
   4. `classpath:/`

   这个列表按照优先级排序，也就是说，`src/main/resources/config`下`application.properties`覆盖`src/main/resources` 下 `application.properties` 中相同的属性，如图：

   ![application-properties-order.jpg](application-properties-order.jpg)

   可以通过指定 `spring.config.location` 来指定配置文件的位置。也可以通过 `@PropertySource` 来指定 Bean 绑定的 配置文件：

   `test.properties` 存放在 `src/main/resources` 下：

   ```properties
   com.md.name="哟西~"
   com.md.want="祝大家鸡年,大吉吧"
   ```

   新建 Bean 文件：

   ```java
   @Configuration
   @ConfigurationProperties(prefix = "com.md")
   @PropertySource("classpath:test.properties")
   public class ConfigTestBean {
       private String name;
       private String want;
       // ...
   }
   ```

   Spring Boot 针对不同的应用场景，如（开发环境，生产环境）可以使用不同的 profile (如端口的不同)。通过命名配置文件：`application-{profile}.properties`，如 `application-dev.properties`, `application-prod.properties`，在 `applucation.properties` 中指定使用一个或者多个profile,  还可以用 `spring.profiles.include`来叠加profile：

   ```properties
   spring.profiles.active=dev
   spring.profiles.include=proddb, prodmq
   ```

   另外，也可以使用 `@Profile("profile-name")` 注解一个 Class 来创建一个 profile 。

   在 `xxx.properties` 文件中引用变量：

   ```properties
   app.name=MyApp
   app.description=${app.name} is a Spring Boot application
   ```

   **YAML Properties**

   YAML 是一种类似 JSON 格式的 层次化的配置数据，例如：

   ```yaml
   environments:
   	dev:
   		url: https://dev.example.com
   		name: Developer Setup
   	prod:
   		url: https://another.example.com
   		name: My Cool App
   ```

   `YamlPropertiesFactoryBean` 加载 YAML 作为 `Properties` ，并且 `YamlMapFactoryBean` 加载 YAML 为 `MAP`。

   上面的例子转换成 properties 如下：

   ```properties
   environments.dev.url=https://dev.example.com
   environments.dev.name=Developer Setup
   environments.prod.url=https://another.example.com
   environments.prod.name=My Cool App
   ```

   **注：** YAML 文件不能使用 `@PropertySource` 注解引入。

   **配置 Random values**

   `RandomValuePropertySource` 对注入随机值非常有用，它可以产生 `integers`, `longs`, `uuids`, `strings`，如下：

   ```properties
   my.secret=${random.value}
   my.number=${random.int}
   my.bignumber=${random.long}
   my.uuid=${random.uuid}
   my.number.less.than.ten=${random.int(10)}
   my.number.in.range=${random.int[1024,65536]}
   ```

   **获取 Command line 上的属性**

   可以在 command line 上加上 `--<property>=<value>`，相当于 `xxx.properties` 配置文件中的 `<property>=<value>`，如：

   ```shell
   java -jar myproject.jar --server.port=8088
   ```

   相当于:

   ```properties
   server.port=8088
   ```

### Spring Beans 和 依赖注入 (DI)

可以使用 `@ComponentScan` 来检测所有的组件（`@Component`, `@Service`, `@Repository`, `@Controller` etc.） ，并自动注册为 Spring Beans。

使用 `@Autowired` 自动绑定依赖 ( to  do  constructor injection )。

### Spring Boot 热部署LiveReload -- Developer Tools

`spring-boot-devtools` module 可以实现代码的热部署：

```xml
<dependencies>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-devtools</artifactId>
		<!-- optional = true, 依赖不会传递，该项目依赖 devtools；
        	之后依赖boot的项目如果需要devtools, 需要重新引入; -->
		<optional>true</optional>
	</dependency>
</dependencies>
```

热部署，即修改页面后会立即生效。这个可以直接在 `application.properties` 文件中配置 `spring.thymeleaf.cache = false` 来实现。

使用 `devtools` 可以实现 类文件热部署，属性文件热部署。即 devtools 会监听 classpath 下的文件变动，并且会重启应用（发生在保存时机）。*注：*因为其采用的是虚拟机机制，该项重启是很快的。为什么重启很快？因为只加载了正在开发的Class，没有重新加载第三方的 jar 包。DevTools 使用了两个 classloader：

* base classloader：没有修改的文件（如第三方jar）则加载到 base classloader 。
* restart classloader：正在开发的Classes 则加载到 restart classloader 。

`application.properties` 配置文件中的内容

```properties
# 关闭缓存，即时刷新
# spring.freemarker.cache=false
spring.thymeleaf.cache=false

# 热部署生效
spring.devtools.restart.enabled=true
# 设置重启的目录，添加那个目录的文件需要 restart
spring.devtools.restart.additional-paths=src/main/java
# 排除哪个目录的文件修改不需要 restart
spring.devtools.restart.exclude=static/**, public/**
# classpath 目录下的 WEB-INF 文件夹内容修改不需要 restart
spring.devtools.restart.exclude=WEB-INF/**
```

DevTools 在 restart 过程中依赖 application context's shutdown hook 来关闭应用，如果设置了 `SpringApplication.setRegisterShutdownHook(false)` 则会失效。

### Spring logging

Spring Boot 使用 Commons Logging 打印日志，也提供了其他日志包的配置，如 `Java Util Logging`, `Log4J2`, `Logback`。

 日志输出格式： Date and Time , Log Level,  Process ID,  ---,  Thread Name, Logger Name, Log msg.

```shell
2019-03-05 10:57:51.112  INFO 45469 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet Engine: Apache Tomcat/7.0.52
2019-03-05 10:57:51.253  INFO 45469 --- [ost-startStop-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2019-03-05 10:57:51.253  INFO 45469 --- [ost-startStop-1] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 1358 ms
2019-03-05 10:57:51.698  INFO 45469 --- [ost-startStop-1] o.s.b.c.e.ServletRegistrationBean        : Mapping servlet: 'dispatcherServlet' to [/]
2019-03-05 10:57:51.702  INFO 45469 --- [ost-startStop-1] o.s.b.c.embedded.FilterRegistrationBean  : Mapping filter: 'h
```

Log Level: `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`。默认 debug 和 trace 是关闭的，可以在配置文件中开启：

```properties
debug=true
trace=true
```

**日志输出到文件**

```properties
# 输出到文件
logging.file=my.log
# 输出到目录下
logging.path=/var/log
```

### log4j 日志

参考[最详细的Log4j使用](https://www.jianshu.com/p/c6c543e4975e)

`pom.xml` 中引入 `log4j` 的 依赖：

```xml
<dependency>
	<groudId>org.slf4j</groudId>
    <artifactId>slf4j-api</artifactId>
    <version>${log4j.version}</version>
</dependency>
```

在 `src/main/resources/log4j.properties` 文件中配置 log4j ：

```properties
## Settings for log4j ##
log4j.rootLogger = debug,stdout,D,E

## Output log to console ##
log4j.appender.stdout = org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target = System.out
log4j.appender.stdout.layout = org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern = [%-5p] %d{yyyy-MM-dd HH:mm:ss,SSS} method:%l%n%m%n

### Output log that greater than DEBUG to ./log/debug.log ###
log4j.appender.D = org.apache.log4j.DailyRollingFileAppender
log4j.appender.D.File = ./log/debug.log
log4j.appender.D.Append = true
log4j.appender.D.Threshold = DEBUG 
log4j.appender.D.layout = org.apache.log4j.PatternLayout
log4j.appender.D.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n

### Output log that greater than ERROR to ./log/error.log ###
log4j.appender.E = org.apache.log4j.DailyRollingFileAppender
log4j.appender.E.File = ./logs/error.log 
log4j.appender.E.Append = true
log4j.appender.E.Threshold = ERROR 
log4j.appender.E.layout = org.apache.log4j.PatternLayout
log4j.appender.E.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n
```

在Java程序中的使用，常用的有4个级别的log：`ERROR`, `WARN`, `INFO`, `DEBUG`：

```java
@Controller
@RequestMapping("/login")
public class LoginController {	
	
    private static final Logger log = LoggerFactory.getLogger(LoginController.class);
    
    @RequestMapping(value = {"", "/"}, method = RequestMethod.GET)
	public String login(Model model){
		log.warn("Custom login.");
		return "login";
	}
}
```

在 Eclipse 的 Console 中打印出来的效果全是一个颜色的，因此直接看的效果也不是很好。。。还要结合 `logback.xml` 使用，可以实现对不同级别的日志用不同颜色显示。

## Spring Web Application

使用 `spring-boot-starter-web` 模块可以快速的使用 Spring Web 应用程序。可以使用 `spring-boot-starter-webflux`模块来构建响应式 web 应用程序。

使用 `@Controller` 或者 `@RestController` 处理 HTTP 请求，其中 `@RestController` 可以用于处理 JSON 数据。

`@PathVariable` 可以从 URL 中获取得到变量，如：

```java
@RequestMapping(value = "/{user}", method = RequestMethod.GET)
public User getUser(@PathVariable Long user){
    // ...
}
```

还可以使用 `@ModelAttriute` 和 `@RequestParam` 绑定变量。

`src/main/webapp`如果您的应用程序打包为jar，请不要使用该目录。虽然这个目录是一个通用的标准，它的工作原理只是 *war* 的包装，它是默默大多数构建工具忽略，如果你生成一个 *jar* 。

### 使用 JSP 技术的页面

参考[开发Web应用之 JSP 篇](http://tengj.top/2017/03/13/springboot5/)

首先需要导入 jsp 模板的依赖:

```xml
<!--WEB支持-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!--jsp页面使用jstl标签-->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
</dependency>

<!--用于编译jsp-->
<dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-jasper</artifactId>
    <scope>provided</scope>
</dependency>
```

创建 resource folder `src/main/webapp`, 创建 folder `src/main/webapp/WEB-INF`, `src/main/webapp/WEB-INF/jsp`，当前项目结构如图：

![springmvcjsp.png](springmvcjsp.png)

在 `application.properties` 或 `application.yml` 中配置 jsp 页面位置：

```yaml
spring:
  mvc:
    view:
      prefix: /WEB-INF/jsp/
      suffix: .jsp
```

然后在 Controller 中编写代码。这部分和 Spring MVC 中相同，因此省略。

### 使用 Thymeleaf 模板引擎

使用 Thymeleaf 模板引擎有许多优点，其中最优秀的就是可以使用非标准的 HTML 。下面看看怎么使用 Thymeleaf。

首先，引入 thymeleaf 的依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

然后在 `src/main/resources` 下创建 folder `src/main/resources/templates`，当前项目结构如下：

![springboot-thymeleaf.png](springboot-thymeleaf.png)

在 templates 创建 HTML 页面，thymeleaf 的具体用法查看[官方文档](https://www.thymeleaf.org/documentation.html)。如下是 login.html 的内容：

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	xmlns:th="https://www.thymeleaf.org" 
	xmlns:sec="https://www.thymeleaf.org/thymeleaf-extras-springsecurity3">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Login</title>
	<style>
		body {
			margin: 20px auto;
		}
	</style>
</head>
<body>
	<div th:if="${param.error}">
		Invalid username or password.
	</div>
	<div th:if="${param.logout}">
		You have been logged out.
	</div>

	<form th:action="@{/auth/login}" method="POST">
		<div><label>Username: <input type="text" name="username"  /></label></div>
		<div><label>Password: <input type="password" name="password" /></label></div>
		<div><button type="submit">Submit</button></div>
	</form>
</body>
</html>
```

具体的模板用法查看文档 ：）实在是太多了。

## Spring boot 多模块项目

参考[SpringBoot多模块项目实战](https://segmentfault.com/a/1190000011367492)

为了更好的划分功能和更好的复用功能，考虑使用多模块。

1. 首先，创建一个 maven 项目 `HelloSpringWeb`，作为主项目，可以删掉 `src` 目录，保留 pom.xml 文件, pom.xml 文件内容如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
     <modelVersion>4.0.0</modelVersion>
   
     <groupId>com.gthncz</groupId>
     <artifactId>HelloSpringWeb</artifactId>
     <version>0.0.1-SNAPSHOT</version>
     <packaging>pom</packaging>
     
     <properties>
       <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
       <maven.compiler.source>1.7</maven.compiler.source>
       <maven.compiler.target>1.7</maven.compiler.target>
     </properties>
     
     <parent>
     	<groupId>org.springframework.boot</groupId>
     	<artifactId>spring-boot-starter-parent</artifactId>
     	<version>2.1.8.RELEASE</version>
     	<relativePath/>
     </parent>
   
     <dependencies>
     	<dependency>
         <groupId>junit</groupId>
         <artifactId>junit</artifactId>
         <version>4.11</version>
         <scope>test</scope>
       </dependency>
   	
   	<!-- dependency for log -->    
   	<dependency>
   	    <groupId>commons-logging</groupId>
   	    <artifactId>commons-logging</artifactId>
   	    <version>1.2</version>
   	</dependency>
   	<dependency>
   	    <groupId>log4j</groupId>
   	    <artifactId>log4j</artifactId>
   	    <version>1.2.17</version>
   	</dependency>
   	
     	<dependency>
     		<groupId>org.springframework.boot</groupId>
     		<artifactId>spring-boot-starter-web</artifactId>
     	</dependency>
     	<dependency>
     		<groupId>org.springframework.boot</groupId>
     		<artifactId>spring-boot-starter-test</artifactId>
     		<scope>test</scope>
     	</dependency>
     	
     	<!-- mariadb jdbc dependency -->
    	<dependency>
   		<groupId>org.mariadb.jdbc</groupId>
   		<artifactId>mariadb-java-client</artifactId>
   	</dependency>
   	
   	<!-- mybatis dependency -->
   	<dependency>
   	    <groupId>org.mybatis.spring.boot</groupId>
   	    <artifactId>mybatis-spring-boot-starter</artifactId>
   	    <version>2.1.0</version>
   	</dependency>
   		
   	<!-- 
   	<dependency>
   		<groupId>org.mybatis</groupId>
   		<artifactId>mybatis</artifactId>
   		<version>3.5.2</version>
   	</dependency>
   	
   	<dependency>
   		<groupId>org.mybatis</groupId>
   		<artifactId>mybatis-spring</artifactId>
   		<version>2.0.2</version>
   	</dependency>
   	-->
   	
   	<!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
   	<dependency>
   	    <groupId>com.alibaba</groupId>
   	    <artifactId>druid</artifactId>
   	    <version>1.1.20</version>
   	</dependency>
   	
   	<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-core -->
   	<dependency>
   	    <groupId>com.fasterxml.jackson.core</groupId>
   	    <artifactId>jackson-core</artifactId>
   	    <version>2.9.10</version>
   	</dependency>
   	
   	<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind -->
   	<dependency>
   	    <groupId>com.fasterxml.jackson.core</groupId>
   	    <artifactId>jackson-databind</artifactId>
   	    <version>2.9.10</version>
   	</dependency>
   	
   	<!-- beautify beans -->
   	<dependency>
   		<groupId>org.projectlombok</groupId>
   		<artifactId>lombok</artifactId>
   		<version>1.18.10</version>
   	</dependency>
     </dependencies>
   
     <modules>
     	<module>hello-admin</module>
   	<module>hello-common</module>
   	<module>hello-security</module>
     </modules>
   
   </project>
   ```

   pom.xml 中 `<packaging>pom</packaging>` 表示打包类型为 `pom`，父项目的打包类型必须是 pom，同时以`<modules>`给出所有的子模块。

2. 在 `HelloSpringWeb` 里面创建 `maven module`：`hello-admin`, `hello-common`, `hello-security`. 以 `hello-admin` 为例，`hello-admin` 的 pom 文件如下：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
   	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
   	<modelVersion>4.0.0</modelVersion>
   
   	<artifactId>hello-admin</artifactId>
   	<name>hello-admin</name>
   	<description>HelloSpringWeb project Admin Module</description>
   
   	<parent>
   		<artifactId>HelloSpringWeb</artifactId>
   		<groupId>com.gthncz</groupId>
   		<version>0.0.1-SNAPSHOT</version>
   	</parent>
   
   	<properties>
   		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
   		<maven.compiler.source>1.7</maven.compiler.source>
   		<maven.compiler.target>1.7</maven.compiler.target>
   	</properties>
   
   	<dependencies>
   		<dependency>
   			<groupId>com.gthncz</groupId>
   			<artifactId>hello-common</artifactId>
   			<version>0.0.1-SNAPSHOT</version>
   		</dependency>
   
   		<dependency>
   			<groupId>com.gthncz</groupId>
   			<artifactId>hello-security</artifactId>
   			<version>0.0.1-SNAPSHOT</version>
   		</dependency>
   
   		<!--jsp页面使用jstl标签 -->
   		<dependency>
   			<groupId>javax.servlet</groupId>
   			<artifactId>jstl</artifactId>
   		</dependency>
   
   		<!--用于编译jsp -->
   		<dependency>
   			<groupId>org.apache.tomcat.embed</groupId>
   			<artifactId>tomcat-embed-jasper</artifactId>
   			<scope>provided</scope>
   		</dependency>
   
   	</dependencies>
   
   	<build>
   		<plugins>
   			<plugin>
   				<groupId>org.springframework.boot</groupId>
   				<artifactId>spring-boot-maven-plugin</artifactId>
   				<configuration>
   					<mainClass>com.gthncz.hello.HelloAdminApplication</mainClass>
   				</configuration>
   			</plugin>
   		</plugins>
   	</build>
   </project>
   ```

   子项目中需要指定 `parent` 为 `HelloSpringWeb`，这样就等于双向绑定了。这里 `hello-admin` 还依赖于 `hello-common` 项目，在 `<dependencies>` 中指定。在 Eclipse 中选中项目右键选择 `Maven->Update Project` 更新依赖。最后，各个子模块单独运行。

到这里 Spring boot 入门就算结束了，推荐一个开源项目用于练手：[mall](https://github.com/macrozheng/mall)。

## 总结

Spring boot 入门花了挺长的时间，并不是简单可以上手，简单复制粘贴就能搞定的事情，以后还要学的东西还很多：

* MyBatis+Druid
* Hibernate validator 验证框架
* Spring Security 安全框架
* JWT 
* OAuth 2 授权/认证框架
* Swagger UI 在线API文档
* Lombok 简化Bean框架

慢慢学吧。。