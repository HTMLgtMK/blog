---
title: eclipse创建maven项目错误
date: 2019-09-14 17:08:09
tags: eclipse maven
---

这里记录使用 eclipse 创建 maven 项目时发生的错误集合。

### 1. Unable to add module to the current project as it is not of packaging type 'pom'

今天想要使用 eclipse 创建一个基于`maven-archetype-webapp`的 web 项目，但是一直出现如下错误：

> >Unable to create project from archetype [org.apache.maven.archetypes:maven-archetype-webapp:1.4]
> >org.apache.maven.archetype.exception.InvalidPackaging: Unable to add module to the current project as it is not of packaging type 'pom'.

先说原因和解决方法：

**原因**：在创建项目的 workspace 目录下，存在一个 `pom.xml` 文件，导致 Maven 认为你创建的是一个 sub-module。

> >Are you running the command from a directory that has an existing pom.xml file in it? I think that may be confusing Maven, as it thinks you're trying to add your new project as a sub-module of the project in the working directory.

**解决方法**：删掉 pom.xml 文件就可以了。。

唉。。之前为了节省添加 spring 依赖的时间，备份了一份 pom.xml 文件到 workspace 目录下，结果反而浪费了不少时间。

上网搜资料，我以为是没有下载 `maven-archetype-webapp-1.4.jar` 成功，，毕竟是国外的镜像。于是尝试换了 `aliyun`的 maven 镜像，如下：

> >    <mirrors>
> >
> >    ​	<mirror>
> >    ​        <id>alimaven</id>
> >    ​        <name>aliyun maven</name>
> >    ​        <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
> >    ​        <mirrorOf>central</mirrorOf>
> >    ​    </mirror>
> >
> >    </mirrors>

结果创建项目的时候还是不行。 于是考虑使用 `mvn` 命令安装本地 `jar` 文件。

1. 从 [https://mvnrepository.com/artifact/org.apache.maven.archetypes/maven-archetype-webapp](https://mvnrepository.com/artifact/org.apache.maven.archetypes/maven-archetype-webapp) 下载 `maven-archetype-webapp-1.4.jar` 包到 `~/Downloads/` 目录。

2. 进入`～/Downloads/`目录，使用 `mvn` 命令安装 jar 文件

   ```shell
   mvn install:install-file -DgroupId=org.apache.maven.archetypes -DartifactId=maven-archetype-webapp -Dversion=1.4 -Dpackaging=jar -Dfile=maven-archetype-webapp-1.4.jar
   ```

可以看到 `maven-archetype-webapp-1.4.jar` 成功安装，但是创建项目仍然失败了。。

然后又有帖子说把 `mirror`  注释掉，可能存在 mirror  冲突的问题，结果还是不行。。最后删掉 `pom.xml` 文件后成功了。 emmm 用的 aliyun。