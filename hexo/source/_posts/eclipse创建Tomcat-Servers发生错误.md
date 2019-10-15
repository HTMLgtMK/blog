---
title: eclipse创建Tomcat Servers发生错误
date: 2019-09-16 20:15:59
tags: eclipse tomcat
---

最近在搭建 eclipse + Tomcat v9.0 的 Web 环境，但是遇到如下问题:

> > Could not load the Tomcat server configuration at /usr/share/tomcat/conf. The configuration may be corrupt or incomplete.

<!-- more -->

在网上找到一篇博客 [在配置项目运行服务器时遇到Could not load the Tomcat server configuration at /usr/local/apache-tomcat-8/conf问题](https://blog.csdn.net/erzhenaididi/article/details/88413642)，按照他的说法，是文件权限不够。

查看了tomcat 的配置文件权限，other 用户组中只有可读权限。将 `/etc/tomcat` 目录下的所有文件权限修改为 `777`。可以成功新建 Server。

鸣谢！

