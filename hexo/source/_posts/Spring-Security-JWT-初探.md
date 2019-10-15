---
title: Spring Security + JWT 初探
date: 2019-10-15 15:11:09
tags: Spring-boot, Spring-security, JWT, Mybatis, Mybatis-generator
---

[SpringDemo](https://github.com/HTMLgtMK/Spring-Demo/tree/master/SecurityDemo) 是 Spring boot + Spring Security + JWT 整合的项目。
参考 [securing-spring-boot-with-jwts](https://github.com/freew01f/securing-spring-boot-with-jwts.git).

<!-- more -->

## Spring Security 框架

依赖： 

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

主要功能： 提供 链式过滤器（FilterChain） 支持。

1. 定义属性类 `WebSecurityConfig`，继承于 `WebSecurityConfigurerAdapter`.

2. 重载 `configure(HttpSecurity http)` 方法，设置拦截的 url 和 filters.

   到这里可以利用 curl 或者 浏览器 查看效果，访问 /users 路径会跳转到 /login。

## JWT 支持

依赖：

```xml
<dependency>
	<groupId>io.jsonwebtoken</groupId>
	<artifactId>jjwt</artifactId>
	<version>0.9.1</version>
</dependency>
```

主要功能：提供 JWT 的生成，验证（用户名，过期时间）。
以下是几个主要的类, 这几个类交互的过程（泳道图）：

```
/login:
  JwtLoginFilter          |     AuthenticationManager |   TokenAuthenticationProvider  | JWTAuthenticationService 
  获取username&password ---提交验证-->   调用AuthenticationProvider  --->  验证username&password
																|  验证成功		
  successfulAuthentication    <--------- 返回   <-------------    生成权限/角色
			-----------------------------------------------------------------------------------------------> 生成 JWT，写入HttpServletResponse
																|  验证失败
  unsuccessfulAuthentication  <--------- 返回	<---------------   BadCredentialsException 异常 
			异常信息写入 HttpServletResponse

```

1. JWTAuthenticationService
   功能：

- String generateJwt(String username)

  生成 JWT，将 username 放入 subject 中，并 claims : Authorization: ADMIN, AUTH_WRITE.

- void addAuthentication(HttpServletResponse response，String username)

  生成 JWT， 并将 JWT 写入到 response 中.

- Claims extranctClaims(String token) throws ExpiredJwtException

  将 token 转换成 JWT claims. 注：过期的 JWT 会抛出 ExpiredJwtException 异常.

- Authentication getAuthentication(HttpServletRequest request) throws ExpiredJwtException

  从 HttpServletRequest 中获取 header 中的 Authorization 域，将其转换成 Claims, 从中获取 GrantedAuthorities, 交由 UsernamePasswordAuthenticationToken 封装成 Authentication.

  注：过期的 JWT 会抛出 ExpiredJwtException 异常。

2. TokenAuthenticationProvider
   功能： 验证 未验证的 Authentication，授权权限/角色。
   继承于 AuthenticationProvider 接口，实现 authenticate 方法.

- Authentication authenticate(Authentication authentication) throws AuthenticationException

  从 Authentiation 中获取 username, password, 验证是否和 「数据库」 中的相同（这里只是直接写死的）。
  然后为 创建权限/角色，利用 UsernamePasswordAuthenticationToken 封装成 Authentication, 返回授权。

3. JwtLoginFilter
   继承抽象类 AbstractAuthenticationProcessingFilter，需要实现 attempAuthentication 方法。

- Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)

  首先从 HttpServletRequest 中获取 输入流内容，将 内容 转换成 AccountCrediential 类（封装了 username, password）. 
  如果输入流内容为空，在 内部 catch 了异常 MismatchedInputException， 直接向 HttpServletResponse 中写入 错误信息。

  然后利用 UsernamePasswordAuthenticationToken 封装 username, password , 交由 AuthenticationManager 验证。

  AuthenticationManager 使用 WebSecurityConfig 中定义的 TokenAuthenticationProvider 验证 username 和 password .

  AuthenticationManager 验证成功后，调用 successfulAuthentication 回调，里面包含的 Authentication 是 Authenticated = true 的，在 successfulAuthentication 中调用 JWTAuthenticationService.addAuthentication 生成 JWT，并写入到 HttpServletResponse 中.

  AuthenticationManager 验证失败后，调用 unsuccessfulAuthentication 回调，里面包含 AuthenticationException 异常，直接将 异常信息 写入到 HttpServletResponse 中.

- void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
  Authentication authResult)

  验证成功回调.

- void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
  AuthenticationException failed)

  验证失败回调.

4. JwtAuthenticationFilter
   继承 GenericFilterBean ，实现 doFilter 方法.

- doFilter(ServletRequest request, ServletResponse response, FilterChain chain)

  从 HttpServletRequest 中获取 JWT Authentication, 如果 Authentication 不为空，则将 Authentication 设置到 
  SecurityContextHolder 中; 
  否则直接向 HttpServletResponse 中写入 JWT 已经过期的提示信息。

测试：

```shell
curl -H "Content-Type: application/json" -X POST localhost:8080/login -d '
{
	"username": "admin",
	"password": "123456"
}'
# 返回数据，将 data 中的 token 复制
curl -H "Content-Type: application/json" -H "Authorization: Bearer <JWT token>" -X GET localhost:8080/users
curl -H "Content-Type: application/json" -H "Authorization: Bearer <JWT token>" -X GET localhost:8080/user/GT
```

## lombok

依赖：

```xml
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<optional>true</optional>
</dependency>
```

主要功能：简化 Bean 的不必要的编写。
**注：** 需要在 IDE 中添加 lombok 插件。在官网上下载 `lombok.jar` 后，利用

```shell
java -jar lombok.jar
```

运行，选择需要添加插件的 IDE （eclipse, IDEA），完成安装， 重新启动 IDE。

## Mybatis-generator

这是一款可以自动生成 mapper.xml, model 以及 dao 的自动化插件。
需要在 `pom.xml` 中引入 `mybatis-generator` 的依赖，除此之外，还需要在 IDE 中安装 mybatis-generator 的插件。

```xml
<dependencies>
	<dependency>
			<groupId>org.mybatis.generator</groupId>
			<artifactId>mybatis-generator-core</artifactId>
			<version>1.3.5</version>
			<scope>provided</scope>
	</dependency>
</dependencies>
<build>
	<plugins>
			<!-- mvn mybatis-generator:generate -->
			<plugin>
				<groupId>org.mybatis.generator</groupId>
				<artifactId>mybatis-generator-maven-plugin</artifactId>
				<version>1.3.5</version>
				
				<configuration>
					<!-- generatorConfiguration.xml -->
					<configurationFile>src/main/resources/config/mybatis-generator.xml</configurationFile>
					<overwrite>true</overwrite>
				</configuration>
				
				<dependencies>
					<dependency>
						<groupId>org.mariadb.jdbc</groupId>
						<artifactId>mariadb-java-client</artifactId>
						<version>2.5.0</version>
					</dependency>
					<dependency>
						<groupId>org.mybatis.generator</groupId>
						<artifactId>mybatis-generator-core</artifactId>
						<version>1.3.5</version>
					</dependency>
				</dependencies>
			</plugin>
	</plugins>
</build>
```

在 Eclipse 中的 mybatis-generator 插件直接在 marketplace 中查找就有，安装后重启 IDE。

然后，编写 mybatis-generator 的配置文件，默认为 `src/main/resources/generatorConfig.xml`（其实在哪，叫啥无所谓）。
这个项目里放在了 `src/main/resources/config/mybatis-generator.xml`, 代码就不粘贴了。按照 
	* `jdbcConnection`: JDBC 配置
	* `javaModelGenerator`: 指定自动生成的 POJO 置于哪个包下
	* `sqlMapGenerator`: 指定自动生成的 mapper.xml 置于哪个包下 
	* `javaClientGenerator`: 指定自动生成的 DAO 接口置于哪个包下
	* `table`: 指定数据表名，可以使用 _ 和 % 通配符
配置。

配置好后，可以使用 `mvn mybatis-generator:generate` 生成，也可以使用 Eclipse 中的工具： 选中 mybatis-generator.xml -> 右键 -> Run As ->  Run Mybatis Generator.
运行就可以生成 mapper.xml, model 以及 dao.