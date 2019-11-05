---
title: BigTable-阅读
date: 2019-11-04 08:39:18
tags: BigTable
---

这是阅读 [Bigtable: A Distributed Storage System for Structured Data](Bigtable: A Distributed Storage System for Structured Data) 的 Points.

# BigTable:  结构化数据的分布式存储系统

作者： Fay Chang, Jeffrey Dean ( 杰夫尼-迪恩), Sanjay Ghemawat (桑杰-格玛沃特), Wilson C. Hsieh (威尔逊 C .谢),  Deborah A. Wallach Mike Burrows (黛博拉·华莱克·迈克·伯罗斯),  Tushar Chandra (), Andrew Fikes (安德鲁-菲克斯), Robert E. Gruber (罗伯特E.格鲁伯).

其中，Sanjay Ghemawat 参与了 GFS， MapReduce, BigTable; Jeffrey Dean 参与了 MapReduce。

<!-- more -->

## Abstract

BigTbale 是一个用于管理结构化数据的分布式存储系统，其设计规模非常大：跨越数千个普通服务器的 PB 级别数据。

"本文"描述了 BigTable  提供的简单数据模型，该模型为用户提供了 对数据布局 ( data layout) 和 格式 (format) 的 动态控制，并描述了 BigTable 的设计和实现。

## 1. Introduction

 Bigtable has achieved several goals: wide applicability, scalability, high performance, and high availability. 

Bigtable is used by more than sixty Google products and projects, including Google Analytics, Google Finance, Orkut, Personalized Search, Writely, and Google Earth.

在许多方面，BigTable 类似于数据库：它与数据库共享许多实现策略。但是，BIgTable 不支持完全的关系模型( full relational data model ); 相反，它为客户机提供了一个简单的数据模型，该模型支持对数据布局和格式的动态控制，并使客户机能推断出底层存储中表示的数据的位置属性。Data is indexed using row and column names that can be arbitrary strings.  BigTable 还将数据视为未解释的字符串，尽管客户端经常各种形式的结构化数据和半结构化数据序列化到这些字符串中。客户端还可以通过仔细选择模式 ( schemas ) 来控制数据的位置。最后，BigTable 模式参数允许客户端动态控制是在内存还是在磁盘中提供数据。

## 2. Data Model

A Bigtable is a sparse, distributed, persistent multi-dimensional sorted map. The map is indexed by a row key, column key, and a timestamp; each value in the map is an uninterpreted array of bytes.

`(row:string, column:string, time:int64) -> string`

一个设计的具体例子：假设想要保留一个大的 Web page 和 relative information 集合的副本，它可以被许多不同的项目使用; 我们称这个特殊的表为 `WebTable`。在 WebTable 中，我们使用 （翻转的） URL 作为 row key, 将 Web Page 的各个方面作为 column names, 并将 Web page 的内容存储在 `Content` 列（提取时的时间戳下的 contents 列），如 Figure 1 所示。

![Figure1.png](Figure1.png)

#### Rows

表中的行 keys 是任意字符串（当前最长可达 64KB , 虽然对大多数用户典型大小只有 10-100 bytes）。单一行 key 下的每个读取或写入数据是 atomic 的。Bigtable通过行键按字典顺序维护数据。一个表的行范围（ row range）是动态分区的。**每个行范围称为一个 *tablet*, 它是分配和负载均衡的基本单位。** 将来自相同域（domain）的页面存储在彼此附近可以提高主机和域分析的效率。

For example, in *Webtable*, pages in the same domain are grouped together into contiguous rows by reversing the hostname components of the URLs. 

#### Column Families

**列键值（Column keys）可以分组成集合（sets), 称为 *列族（column families）*,  它是 访问控制（ access control）的基本单位。**  同一列族内的数据类型通常相同。

列族的目的是使 表中不同列族的个数比较小（最多百个），并且列族在操作时比较少改变。相反，一个表可以由无限个列。

**一个列键使用 *family:qualifier* 来命名**，。列族必须可以打印，但是 qualifier 可以是任意的字符串。例如： “*anchor:cnnsi.com*”. 

#### Timestamps

Each cell in a Bigtable cancontain multiple versions of the same data; these versions are indexed by timestamp. Bigtable timestamps are 64-bit integers. 

时间戳可以由 Bigtable 赋值当前的毫秒值，也可以显示的由用户赋值。

To make the management of versioned data less onerous, we support two per-column-family settings that tell Bigtable to garbage-collect cell versions automatically。The client can specify either that only the last n versions of a cell be kept, or that only new-enough versions be kept。

## 3.  API

这个，反正 BigTable 也没有开源，了解接口也没有什么卵用。。

## 4. Building Blocks

BigTable  使用 **GFS** 存储日志和数据文件，依靠集群管理系统调度，管理共享机器资源，处理机器宕机，并监控机器状态。

**BigTable  使用 Google 内部使用的 *SSTable* 文件格式存储数据。** SSTable 提供一个持久的、有序的、不可变的键值映射(map)，其中的键和值都是任意的字符串。提供利用指定的 key 查找 value ，或者在指定 key range 上遍历所有 key/value 键值对 的操作。在 SSTable 内部包含序列块（a sequence of blocks ），通常每个块的大小是 64KB，但是这是可以配置的。块索引（block index） 用于定位块（通常位于SSTable 的末尾）；当 SSTable 打开时，块索引会被加载到内存中。一次查找可以在一次磁盘查找中完成：首先在内存中对块索引进行二分查找，然后再从磁盘中读取合适的块。当然，一个 SSTable  也可以完全载入到内存中，可以使完全不用接触磁盘。

**BigTable  依靠一个高可靠的、持久的分布式锁服务，称为 *Chubby*. ** 一个 Chubby  服务由5个活跃副本组成，其中一个被选择为足迹，并积极响应请求。 **Chubby 使用 *Paxos* 算法保持副本失败时的一致性。** Chubby 一个由目录和小文件组成的命名空间。每个目录或者文件可以用作锁(lock)，并且读取或者写入文件是原子的。每个 Chubby Client 维持一个 Chubby service 的 *session*。如果 client 不能在过期时间内更新 session，那这个 session 过期。当它的 session 过期，它丢失了所有的锁和文件句柄。Chubbu clients 也可以在 Chubby 文件和目录上注册回调接收 session 过期的通知。

BigTable 使用 Chubby 来完成各种任务：保证每时最多只有一个 active master；存储 BigTable 数据的引导位置 ( bootstrap location )（5.1 节）； 发现 tablet servers 并且完成 tablet server deaths 后的工作（5.2 节）；存储 BigTable 模式信息（每个表的列族信息）；存储访存控制列表。**如果 Chubby 在一段时间后变得不可用，那么 BigTable 也将不可用。** 

## 5. Implemention

BigTable 3个组成部分： 

* 连接到每个客户机的library
* 一个主机（master）
* 多个 Tablet 服务器

Master 负责：分配 Tablet 到 Tablet 服务器；检测 Tablet 服务器的添加和失效；Tablet 服务器的负载均衡；GFS 中文件的垃圾回收；schema 变化，比如表和列族的创建。

每个 tablet 服务器管理一组 Tablets （通常在 Tablet 服务器上由 10-1000 个Tablets）。 Tablet 服务器负责处理它搭载的 Tablet 的读写请求，也处理 过大的 Tablet 的分割。

`master -> Tablet servers -> Tablets.`

```
               master
    		__|     |__
      client ---数据--  Tablet server
```

### 5.1 Tablet 的位置

类似于 B+ 树的三层存储：

![Figure4.png](Figure4.png)

The first level is a file stored in Chubby that contains the location of the *root tablet*. The *root tablet* contains the location of all tablets in a special *METADATA* table. Each *METADATA* tablet contains the location of a set of user tablets. The *root tablet* is just the first tablet in the *METADATA* table, but is treated specially—it is never split—to ensure that the tablet location hierarchy has no more than three levels.

```
Chubby file --> Root Tablet (Metadata)
			--> Other MNetadata tablets (Metadata)
			--> User Tablets (row)
```

The *METADATA* table stores the location of a tablet under a row key that is an encoding of the tablet’s table  identifier and its end.

每个 Metadata row 大约 1KB, Metadata  tablet 的限制为 128MB，因此三层存储结构的模式可以存放 2^34 个tablet地址。

客户端将缓存 Tablets location:

1. 不知道或不正确：递归的寻找位置层次;
2. 缓存为空：location Algo. 要求3个网络来回（three network round-trips）
3. 缓存过期：位置算法要求6个网络来回（只有当发现没有命中时才更新）

BigTable 一次读取多个 tablet 的 metadata 信息。

### 5.2 Tablet 分配

master 通过发送一个 tablet load req 请求到 tablet server 分配 tablet。

当 tablet server 失去排他锁（exclusive lock）时不再提供 tablet 服务，例如由于网络分区，它丢失了 Chubby session. 只要文件还存在，那么 tablet server 会一直请求排他锁。如果文件被删除了，那么 server 不再提供服务，so it kills itself. 当 tablet 服务器被终止，它试图释放锁，这样 master 可以更快地重新分配的它的 tablets.

当master 检测到 server 不再提供服务后，BigTable 内的交互：

1. master 周期性的检测 tablet server 的锁状态，如果 tablet 服务器报告丢失锁，或者 master 在有限时间内没有收到响应，则
2. master 尝试从 Chubby 服务器获取排他锁。如果 master 获取到排他锁，表示 Chubby 是活动的，并且 tablet 服务器已经 dead 或者不能 reach Chubby 服务器，master 可以确定 tablet 服务器在删除 它的server files后再不能提供服务。
3. 一旦 server 上的文件被删除，master 可以移动原来分配到 tablet 服务器上的所有 tablets 到 unassigned  tablets. 

Master Failure: master will kill itself. 而其他 server 不改变tablets 的分配。

当集群管理系统启动 master 时，master 的启动步骤：

1. The master grabs a unique *master lock* in Chubby, which prevents concurrent master instantiations. 
2. The master scans the servers directory in Chubby to find the live servers.
3. The master communicates with every live tablet server to discover what tablets are already assigned to each server.
4. The master scans the *METADATA* table to learn the set of tablets. 

在 master 启动过程中，只要发现有 Tablet 未分配，则添加到未分配。如果在 (4) 中没有发现 *root tablet*, 则 master 会添加一个 *root tablet* 到未分配。

### 5.3 Tablet 服务

GFS 保存 Tablet 的持久化状态。

1. Write Ops
   1. 首先检查请求信息是否足够，请求方是否被授权（通过读取 Chubby file 上面的允许的 writer list 来检查授权）。
   2. 将变动(mutation) 写入到 *commit log*。
   3. 将内容写入到 memtable( 即缓存 )。
2. Read Ops
   1. 首先检查请求和请求方授权。
   2. 读操作在 SSTable（全部数据）和 memtable（缓存数据） 的合并视图（merged view）上进行。

### 5.4 Compactions (压缩)

主要是 *memtable* 的压缩。

1. **minor compaction**：当 memtable 大小到了门限后，冻结 memtable，形成新的 SSTable.
2. **major compaction**：合并所有的 SSTable 为一个 SSTable {in a timely fashion. 及时的}.

## 6. 优化

1. 位置分组：客户端将多个列族分组到位置分组。
2. Compression(压缩)：两阶段压缩算法。
   1. *Bentley-McIloy Algo.* 快，且压缩比高（10:1）。
   2. fast compression Algo.
3. Caching for read performance: 使用二级缓存。
   1. Scan Cache:  caches the key-value pairs returned by the SSTable interface to the tablet server code. It is most useful for applications that tend to read the same data repeatedly.
   2. Block Cache:   cache that caches SSTables blocks that were read from GFS. It is useful for applications that tend to read data that is close to the data they recently read (e.g., sequential reads, or random reads of different columns in the same locality group within a hot row).
4. Bloom filters: 用于减少磁盘访问。
5. Commit log 的实现：混合多个 Tablet 的变动日志到 单个 Commit log. 当 recovery 时，先并行排序，再顺序读取。
6. Speeding up tablet recovery
7. Exploit immutability

