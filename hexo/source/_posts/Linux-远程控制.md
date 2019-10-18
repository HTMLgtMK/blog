---
title: Linux 远程控制
date: 2019-10-18 16:15:58
tags: linux远程控制，VNC，虚拟屏幕
---

在公司配了一台电脑，但是平时使用自己的 笔记本 作为主力，想着把办公室的 PC 作为自己的局域网服务器用，而 PC 的显示器作为自己的 扩展屏幕使用。在开始折腾之前，笔记本 和 办公室PC 的环境如下：

| 项目       | 笔记本              | 办公室PC           |
| ---------- | ------------------- | ------------------ |
| OS         | openSUSE Tumbleweed | openSUSE Leap 15.1 |
| Monitor    | 自带                | Lenovo  V20-10     |
| Resolution | 1920x1080_60.00     | 1600x900_60.00     |
| Net Addr   | DHCP                | DHCP               |

<!-- more -->

理想中的架构如下：

![arch.png](arch.png)

相当于 利用 笔记本 作为 PC 和 PC Monitor 的中间人。

## 准备工作

先保证能够利用 `ssh` 连接上 PC，开启 `sshd` 服务，并添加到 自启动：

```shell
# 开启 sshd 服务
sudo systemctl start sshd
# 添加为 自启动 服务
chkconfig sshd on
```

然后，开放 ssh 的 `22` 端口：

```shell
sudo firewall-cmd --add-port 22/tcp --permanent
```

在 laptop  上的连接命令为：

```shell
ssh -l gt <ip-addr> -p 22
```

其中，PC 的 ip 地址使用 `ip -4 addr` 获取。



然后，考虑如何将 PC 上的屏幕分享到 laptop 上，之前安装了 Teamviewer ，可以直接远程控制 PC，但是这需要 teamvewer 的服务器支持  :) . 网上在 Linux 直接屏幕共享多数是使用 `vnc`。参考 [Remote Access with VNC](https://doc.opensuse.org/documentation/leap/reference/html/book.opensuse.reference/cha.vnc.html).

安转 `vnc`  的 实现 `tigervnc`, 里面包含 `vncserver` 和 `vncviewer`, 分别是 vnc 服务端 和 客户端 ( 两个机器上都要安装 )：

```shell
sudo zypper install tigervnc
```

在 PC 上面 开启 vnc 服务：

```shell
# 设置vncserver 的访问密码
vncpasswd 
# ...输入自己的密码

# 开启服务
vncserver 
```

vncserver 使用的默认的 port  为 : `5900+<display-number>`.

在 laptop 上面连接：

```shell
# 使用 屏幕序号 
vncviewer <ip-addr>:<diplay-number>
# 使用 端口号
vncviewer <ip-addr>::<port>
```

这里还需要开放 PC 5900-5910 段的端口，否则会出现 `refuse connection` 错误：

```shell
sudo firewall-cmd --add-port 5900-5910/tcp --permanent
sudo firewall-cmd --add-port 5900-5910/udp --permanent
```



使用 `vncviewer` 我没有连接上，因为在点击 连接 按钮后程序就卡死了，不得不退出。这里使用 `remmina` 连接工具：

```shell
sudo zypper install remmina remmina-plugin-vnc
```

安装好后，执行 remmina 并选择 VNC 协议，输入 <ip-addr>:<display-number> 连接。比如，办公室 PC ip 地址为：172.16.1.31，那么连接的 格式为：`172.16.1.31:1`, 或者 `172.16.1.31::5901`.

到这里应该是成功的。

## 组建网络

将 PC Monitor  插入到 laptop 的上，在 System Settings 中设置屏幕扩展， 参考 [KDE 下 openSUSE 多屏幕设置教程](https://forum.suse.org.cn/t/kde-opensuse/1237)，简单说就是把 VGA-1 拖到 Laptop-Screen 的左边或者右边，而不是 Laptop-Screen 的内部。

VGA 接口的默认分辨率输出是 `1024x768_60.00`, 但是 看着特别的不舒服，将分辨率调到 显示器的最高分辨率：

```shell
# cvt 工具新建 modeline
cvt 1600 900
# 输出 Modeline
# # 1600x900 59.95 Hz (CVT 1.44M9) hsync: 55.99 kHz; pclk: 118.25 MHz
# Modeline "1600x900_60.00"  118.25  1600 1696 1856 2112  900 903 908 934 -hsync +vsync

# 新建 分辨率 模式
xrandr --newmode "1600x900_60.00"  118.25  1600 1696 1856 2112  900 903 908 934 -hsync +vsync
# 即将 modeline 后面的内容复制过来

# 添加 新分辨率模式 到 VGA-1接口（不一定是 VGA-1, 可以先用 xrandr 命令查看接口）
xrandr --addmode VGA-1 "1600x900_60.00"
# 这里的 "1600x900_60.00" 就是 分辨率的名称

# 设置 VGA-1 的 分辨率 为 "1600x900_60.00"
xrandr --output VGA-1 --mode "1600x900_60.00"
```

执行完后，分辨率更高了，看的也更舒服了。



接下来，尝试 利用 `remmina` 连接 PC，事实上连接成功了，但是显示的黑屏，使用 teamviewer 却不会，这里先给出 命令行下 查看 teamviewer id 的方法, 参考 [命令行启动 TeamViewer]([https://williamlfang.github.io/post/2017-12-05-%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%90%AF%E5%8A%A8-teamviewer/](https://williamlfang.github.io/post/2017-12-05-命令行启动-teamviewer/)):

```shell
# 开启 Teamviewer 守护线程
sudo systemctl start teamviewerd
# 查看  Teamviewer id
teamviewer --info print id
# 设置 Teamviwer 密码
teamviewer --passwd <password>
```

然后可以在 laptop 上连接，但是 这次使用 Teamviewer 发现由明显的卡顿。

![remmina-office-PC-black.png](remmina-office-PC-black.png)

上网查询资料后发现 ， Teamviewer 的 卡顿 和 vncviewer 黑屏的原因 在于 PC 拔掉显示器后，没有了 默认的显示器。

参考 [ubuntu无显示器配置方案](https://x-candy.github.io/2018/09/06/x11-conf/)：

1. 在 `/etc/X11/xorg.conf.d/` 中的  `50-monitor.conf` 中编辑：

   ```shell
   # Having multiple "Monitor" sections is known to be problematic. Make
   # sure you don't have in use another one laying around e.g. in another
   # xorg.conf.d file or even a generic xorg.conf file. More details can
   # be found in https://bugs.freedesktop.org/show_bug.cgi?id=32430.
   #
   Section "Monitor"
     Identifier "Default Monitor"
     VendorName "Unknow"
     ModelName "Unknow"
   
     ## If your monitor doesn't support DDC you may override the
     ## defaults here
     HorizSync 28-85
     VertRefresh 50-100
   #
   #  ## Add your mode lines here, use e.g the cvt tool
   #
   #EndSection
   ```

   相当于新建一个 虚拟显示器。

2. 重启 PC，利用 ssh 连接，开启 vncserver 。

3. 利用 remmina 连接 。

   ![remmina-office-PC-ok.png](remmina-office-PC-ok.png)

到此，我的想法已经实现了！



