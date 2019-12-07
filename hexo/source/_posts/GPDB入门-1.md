---
title: GPDB入门-1
date: 2019-11-28 09:43:05
tags: greenplum, database,分布式
---

# 分布式数据库 GreenPlum 

GPDB 由一家硅谷的公司 Pivotal 开源。

## 如何使用

GPDB 的[文档](https://gp-docs-cn.github.io/docs/best_practices/intro.html) 描述的是使用文档，而不是具体原理。下面记录的是简要的使用（在 GPDB 6.1.0 版本下）：

### 环境搭建

| 项目      | 描述                                     |
| --------- | ---------------------------------------- |
| 虚拟机    | VirtualBox 6.0                           |
| 虚拟系统  | Ubuntu 18.04 (bionic) desktop LTS X86_64 |
| 系统配置  | 1 CPU, 2048 RAM, 10GB MEM.               |
| GreenPlum | 6.1.0 版本，使用 `.deb` 文件安装         |

GPDB 配置集群环境：

1. 利用 VirtualBox 搭建 3 个 Ubuntu 虚拟机

   | 主机 | ip           | 用途    |
   | ---- | ------------ | ------- |
   | gp1  | 192.168.56.4 | master  |
   | gp2  | 192.168.56.5 | segment |
   | gp3  | 192.168.56.6 | segment |

   虚拟机之间要能够 ping 通，需要使用 桥接模式 或者 Host-Only 模式，或者两种模式兼有。我这里两种模式兼有，并且将 主机DHCP 模式修改成 static ip。 

   ubuntu 18.04 LST 中修改步骤为 ( gp1 ) ：

   ```shell
   gt@gp1:~$ sudo apt-get install network-manager
   gt@gp1:~$ sudo vim /etc/netplan/01-network-manager-all.yaml 
   network:
           version: 2
           renderer: NetworkManager
           ethernets:
                   enp0s3: 
                           dhcp4: false
                           addresses: [10.0.2.4/24]
                           gateway4: 10.0.2.1
                           nameservers:
                                   addresses: [10.0.2.1]
                   enp0s8: 
                           dhcp4: false
                           addresses: [192.168.56.4/24]
                           gateway4: 192.168.56.1
                           nameservers:
                                   addresses: [192.168.56.1]
                                   
   gt@gp1:~$ sudo netplan apply  # 使配置生效
   gt@gp1:~$ ifconfig
   ```

   其中 `enp0s3` 是 NAT 网卡，`enp0s8` 是 Host-Only 网卡。

   **注：**需要先安装 `network-manager`.

2. 修改每个虚拟机的 `hostname` : gp1, gp2, gp3 ( 由于是拷贝的虚拟机，否则跳过)

   ```shell
   $ sudo vim /etc/hostname
   localvm1  # 修改成相应的 hostname
   $ sudo vim /etc/hosts
   # 把 127.0.1.1 地址映射成 hostname
   127.0.1.1	gp1
   ```

3. 将每个主机对应的 ip 地址映射成主机名

   ```shell
   $ sudo vim /etc/hosts
   # Mapping for local vms
   192.168.56.4 gp1
   192.168.56.5 gp2
   192.168.56.6 gp3
   ```

   注：这里的 ip 地址是固定的，我在实验中是 `桥接模式+Host-Only` 的网络，因此虚拟机之间、虚拟机主机之间能够互相 ping  通。后面的操作都是直接在我的本地机器 opensUSE 上面用 ssh 远程完成。

   如果不能，可以使用 Virtualbox 为 NAT 提供的端口映射， ssh 连接时换一个 端口即可。

4. 虚拟机之间 ssh 免密登录， greenplum 提供了一个生成交换 ssh 公钥的脚本，但是我的出现错误

   ```shell
   $ source /usr/local/greenplum-db/greenplum_path.sh
   $ vim /usr/local/greenplum-db/etc/hosts.list
   gp1
   gp2
   gp3
   $ gpssh-exkeys -f /usr/local/greenplum-db/etc/hosts.list
   ```

   脚本不能用，那我后面是手动为每个主机添加 ssh 公钥的

   ```shell
   $ ssh-keygen -t rsa -f ~/.ssh/id_rsa -C gt
   # 添加到 gp2
   $ cat ~/.ssh/id_rsa.pub | ssh -l gt 192.168.56.5 -p 22 'cat >> ~/.ssh/authorized_keys'
   $ ssh gp2
   # gp3 同理
   ```


5. 10 GB 的虚拟磁盘实在是太尴尬了，系统安装完后就空间不足了，只好再配置一个虚拟磁盘。

   1. 首先，用 `fdisk` 工具为新磁盘创建一个分区

      ```shell
      sudo fdisk /dev/sdb  # /dev/sdb 是新虚拟磁盘的名称
      > n # 之后一路回车
      > w # 写入，修改分区表
      # 或者 q, 不修改，直接退出
      ```

      

   2. 然后，用 `mkfs.ext4` 工具为新分区格式化

      ```shell
      sudo modprobe ext4
      sudo mkfs.ext4 /dev/sdb  # 需要用 fdisk -l 再次查看名称是否相同
      ```

   3. 最后，将 /dev/sdb 挂载到文件系统，并且启用开机挂载

      ```shell
      sudo mkdir /mnt/sdb
      sudo mount -t ext4 /mnt/sdb /mnt/sdb
      sudo vim /etc/fstab # 修改开机挂载
      # 将下面的内容追加到文件 
      /dev/sdb /mnt/sdb ext4 defaults 0 0
      ```

   4. 最后的最后，修改 gpdb 的数据目录路径为 `/mnt/sdb/greenplum-db`. 注： 需要修改该目录的权限为 `gpadmin:pguser`.

### SQL 访问

Greenplum  就是 `postgreSQL` 的集群，所以访问 `GPDB` 的许多操作都与之相同。下面利用 `psql` 访问数据库。

#### 连接

首先，对于 PostgreSQL 数据库，连接命令为 `psql`:

```shell
psql -h 192.168.56.4 -p 5432 -U gpadmin -d postgres
```

说明：我这里使用的用户是 `gpadmin`， 也可以用其他用户如`postgres`。`-d` 表示使用的数据库为 `postgres`，是 PostgreSQL 数据库默认的系统数据库。

#### 数据库相关操作

首先，创建数据库，可以使用 `CREATE DATABASE ` SQL 语句 或者 使用 `createdb` 命令，如下：

```shell
createdb -h 192.168.56.4 -p 5432 -O gpadmin DBNAME
```

`-O` 表示 Owner.

然后，删除数据库：

```shell
createdb -h 192.168.56.4 -p 5432 DBNAME
```

数据表操作同理。具体操作语法参考 [PostgreSQL 语法](https://www.runoob.com/postgresql/postgresql-syntax.html).

其他操作：

```shell
postgres=# \l # 查看全部数据库
postgres=# \c dbname # 选择进入 dbname 数据库
## 表内操作
db_test=> \d # 查看全部relations
db_test=> \d tablename # 查看数据表 中的具体结构
```

#### CURD

PostgreSQL 支持的数据类型有很多，但是 CURD 还是使用 SQL 操作，可以使用 `\help SELECT` 等查看帮助。

```shell
db_test=# \help SELECT
Command:     SELECT
Description: retrieve rows from a table or view
Syntax:
[ WITH [ RECURSIVE ] with_query [, ...] ]
SELECT [ ALL | DISTINCT [ ON ( expression [, ...] ) ] ]
    [ * | expression [ [ AS ] output_name ] [, ...] ]
    [ FROM from_item [, ...] ]
    [ WHERE condition ]
    [ GROUP BY grouping_element [, ...] ]
    [ HAVING condition [, ...] ]
        [ WINDOW window_name AS (window_specification) ]
    [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] select ]
    [ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
    [ LIMIT { count | ALL } ]
    [ OFFSET start [ ROW | ROWS ] ]
    [ FETCH { FIRST | NEXT } [ count ] { ROW | ROWS } ONLY ]
    [ FOR { UPDATE | NO KEY UPDATE | SHARE | KEY SHARE } [ OF table_name [, ...] ] [ NOWAIT ] [...]
 ]
... # 省略后面的
```

实例：

1. 创建数据表 COMPANY

```sql
CREATE TABLE COMPANY(
   ID INT PRIMARY KEY     NOT NULL,
   NAME           TEXT    NOT NULL,
   AGE            INT     NOT NULL,
   ADDRESS        CHAR(50),
   SALARY         REAL,
   JOIN_DATE      DATE
);
CREATE TABLE DEPARTMENT(
   ID INT PRIMARY KEY      NOT NULL,
   DEPT           CHAR(50) NOT NULL,
   EMP_ID         INT      NOT NULL
);
```

2. 插入数据

   ```sql
   INSERT INTO TABLE_NAME (column1, column2, column3,...columnN)
   	VALUES (value1, value2, value3,...valueN);
   
   INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY,JOIN_DATE) VALUES 
   	(1, 'Paul', 32, 'California', 20000.00,'2001-07-13'),
   	(2, 'Allen', 25, 'Texas', '2007-12-13');
   ```

3. 查询数据

   ```SQL
   SELECT column1, column2,...columnN FROM table_name;
   ```

4. 更新数据

   ```sql
   UPDATE table_name
   SET column1 = value1, column2 = value2...., columnN = valueN
   WHERE [condition]
   ```

5. 删除数据

   ```sql
   DELETE FROM table_name WHERE [condition];
   ```

**性能测试**

使用 postgreSQL 提供的 `pgbench`  工具测试。

首先，测试 postgreSQL 的单机版本： (PostgreSQL) 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)。

创建用于测试的数据库：`pg_bench`:

```sql
CREATE DATABASE pg_bench;
```

初始化数据库：

```shell
pgbench -h localhost -p 5433 -U postgres -i -s 100 -F 100 --unlogged-tables pg_bench
```

测试：

```shell
pgbench -h localhost -p 5433 -U postgres -c 16 -j 8  pg_bench
```

测试结果：

```shell
gt@gp1:~$ pgbench -h localhost -p 5433 -U postgres -c 16 -j 8  pg_bench
Password: 
starting vacuum...end.
transaction type: <builtin: TPC-B (sort of)>
scaling factor: 100
query mode: simple
number of clients: 16
number of threads: 8
number of transactions per client: 10
number of transactions actually processed: 160/160
latency average = 41.099 ms
tps = 389.299689 (including connections establishing)
tps = 433.735413 (excluding connections establishing)
```

在 GPDB 上面测试：

```shell
gpadmin@gp1:~$ pgbench -h 192.168.56.4 -p 5432 -U gpadmin -c 16 -j 8  pg_bench
starting vacuum...end.
transaction type: <builtin: TPC-B (sort of)>
scaling factor: 100
query mode: simple
number of clients: 16
number of threads: 8
number of transactions per client: 10
number of transactions actually processed: 160/160
latency average = 12214.952 ms
tps = 1.309870 (including connections establishing)
tps = 1.310335 (excluding connections establishing)
```

**单机的 TPS 要比集群的 TPS 高！**

遇到的问题：

1. postgreSQL 10 启动失败：对应的服务为 `postgresql@10-main.service`. 利用 `sudo journalctl _PID=` 查询得到原因是我的数据目录被我修改了（修改的配置文件位于：`/etc/postgresql/10/main/postgres.conf`），而数据目录**没有初始化**. 下面初始化目录：

   ```shell
   $ /usr/lib/postgresql/10/bin/initdb <data-dir>
   # 或 
   /usr/lib/postgresql/10/bin/pg_ctl -D <data-dir>
   ```

   初始化后，再启动 postgresql 服务：

   ```shell
   sudo systemctl start postgresql@10-main.service
   ```

   

### 查询执行

### 并发

依靠PostgreSQL 的多版本并发控制（MVCC）模型来管理对于堆表的并发事务。

每一行的事务操作都是在事务开始前的快照上面完成，这样可以比传统的两段锁协议支持更高的并发度。

每个事务都会分配一个唯一的事务 ID -- XID。当一个事务插入一行时，其XID会被保存在该行的 xmin系统列中。当一个事务删除一行时，其XID会被保存在xmax系统列中。更新一行被视为一次删除加上一次插入，因此XID会被保存在当前行的xmax中以及新插入行的xmin中。xmin和 xmax列再加上事务完成状态就指定了一个事务的范围，行的这个版本对于其中的事务可见。一个事务可以看到所有小于xmin的事务的效果，这些事务确保已经被提交，但它无法看到任何大于等于xmax的事务的效果。

### 负载

## 内部原理

