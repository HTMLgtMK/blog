---
title: opensuse failed to start load Kernel modules
date: 2019-09-09 08:25:19
tags: opensuse systemd-module-load scsi
---

起因：昨天，用`zypper update`更新了我的笔记本的opensuse leap 15.1系统，结果重启后就开机提示

`Failed to load Kernel Modules`, see `systemctl status systemd-modules-load.service` for detail.

启动后，发现鼠标和触摸板不能使用。

<!-- more -->

之后：

查看`systemd-modules-load`服务启动信息：

```shell
> systemctl status systemd-modules-load
> ... Failed to find module scsi_dh_alua
> ... Failed to find module scsi_dh_emc
> ... Failed to find module scsi_dh_rdac
> ... Failed to find module dm-multipath
> ...
```

总之，具体原因是不能找到模块`scsi_dh_alua`等。网上查询资料后发现这几个模块在`Non-SCSI System`上启动会报错。可以禁止系统在boot时加载这些模块。系统自动加载的模块在 `/etc/modules-load.d/`和`/usr/lib/modules-load.d/`, 下面的`.conf`文件都是自动加载的模块。对于上面的问题，发现在`/usr/lib/modules-load.d/multipath.conf`文件中自动加载了这些模块：

```shell
cat /usr/lib/modules-load.d/multipath.conf
# Load device-handler and multipath module at boot
scsi_dh_alua
scsi_dh_emc
scsi_dh_rdac
dm-multipath
```

因此，直接删掉这个文件就可以了。



接下来，重新启动，发现还是报`failed to load Kernel modules`，也不知道啥原因。。只好放弃这个系统重新安装了。。



常用命令：

```shell
systemctl --failed # 查看启动时全部启动失败的service
journalctl -b # 查看boot时的启动信息
journalctl _PID= # 查看PID的service的启动日志，PID可以在 systemctl status <service-name>查看

```

