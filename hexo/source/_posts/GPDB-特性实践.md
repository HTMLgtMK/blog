---
title: GPDB-特性实践
date: 2020-01-11 15:51:39
tags: GPDB
---

前段时间导师要求了解 `GreenPlum`数据库，后来安装和使用了一下，感觉和其他数据库没有什么不同，于是就不了了之了。现在重新看一遍 `GPDB` 的特性并尝试使用这些特性。



其实，官方宣传页上写的`特性`才是真正需要我去了解的。

<!-- more -->

## 特性

`首先，GPDB`的特性是什么？从哪里找？产品的宣传页上肯定有。

### 最大特性

`GPDB`  的最大特性就是 `MPP`,  即 `Massively Parallel Processing`。 在[首页](https://greenplum.org/)上，最明显的就是这两个：

* Massively Parallel， 大规模并行
* Analytics，分析

![gpdb_feature_max.png](gpdb_feature_max.png)



然后，下滑页面，两个明显的特性是：

- Power at scale: High performance on petabyte-scale data volumes. PB级数据高性能处理。
- True Flexibility: Deploy anywhere. 部署灵活。

![gpdb_feature_max1.png](gpdb_feature_max1.png)

![gpdb_feature_max1.png](gpdb_feature_max2.png)

### 主要特性

首页接着往下滑，写明了 `GPDB` 的主要特性：

- MPP Architecture
- Petabyte-Scale Loading: 加载速度随着每个额外节点的增加而增加，每个机架的加载速度超过10Tb/h ( 约为 347.22 GB/s ) 。
- Innovative Query Optimization:  工业界中首个大数据工作负载的 `cost-based query optimizer`.
- Polymorphic Data Storage： 多态数据存储。完全控制表和*--**分区存储、执行和压缩的配置。
- Integrated In-Database Analytics： `Apache MADlib`提供的一个库，用于可伸缩的数据库内分析，通过用户定义的函数扩展Greenplum数据库的SQL功能。
- Federated Data Access： 联邦数据访问。使用Greenplum optimzer和 query processing engine 查询外部数据源。包括Hadoop、Cloud Storage、ORC、AVRO、Parquet等 Polygot 数据存储。

![gpdb_feature_mian.png](gpdb_feature_mian.png)



遗憾的是，首页上的这些图标都不能点击。所以要体验这些特性，只能自己去探索了。



## TODO 

1.  从 hadoop 中查询数据。



## GPDB vs. Hadoop + Hive

![gpdb_cluster_number.png](gpdb_cluster_number.png)

来源：[Greenplum介绍]([https://wiki.postgresql.org/images/5/52/Greenplum%E4%BB%8B%E7%BB%8D.pdf](https://wiki.postgresql.org/images/5/52/Greenplum介绍.pdf))， 这是 Alibaba 在 2011.02.17 做的汇报， GPDB 版本为 4.x. 

对比 `Hadoop + Hive`, GPDB  的查询性能比 Hive 好，但是 GPDB 支持的集群节点数太少，最多可以 1000 个 segment, 而Hive 可支持上万个节点。



## [Data Loading](https://greenplum.org/gpdb-sandbox-tutorials/data-loading/)

主要有 3 种加载方法：

- the SQL INSERT statement:  在加载大量数据时低效，适用于小数据集。
- the COPY command： 可以自定义 the format of the text file 以解析成 columns and rows. 比 INSERT 快， 但是不是一个 parallel process. 
- `gpfdist` and `gpload`:  可以高效的将外部数据转储到数据表中。快速，并行加载。Administrator 可以定义  `single row error isolation mode` 以继续加载格式正常的 rows。 `gpload` 需要提前编写一个 `YAML-formated` control file, 用于描述 source data location,format, transformations required, participating hosts, database destinations, and others. 这允许你执行一个复杂的加载任务。

![ext_tables.jpg](ext_tables.jpg)

<center>Figure 1. External Tables Using Greenplum Parallel File Server (gpfdist)</center>

以下只演示 `gpfdist`和 `gpload` 的使用：

#### [`gpfdist`](https://gp-docs-cn.github.io/docs/utility_guide/admin_utilities/gpfdist.html)

```shell
gpfdist [-d directory] [-p http_port] [-l log_file] [-t timeout] 
   [-S] [-w time] [-v | -V] [-s] [-m max_length]
   [--ssl certificate_path [--sslclean wait_time] ]
   [-c config.yml]
```

[示例](https://gpdb.docs.pivotal.io/550/admin_guide/external/g-example-4-single-gpfdist-instance-with-error-logging.html)：

Uses the `gpfdist` protocol to create a readable external table, ext_expenses, from all files with the *txt* extension. The column delimiter is a pipe(|) and NULL (' ') is a space. Access to the external table is single row error isolation mode. If the error count on a segment is greater than five (the SEGMENT REJECT LIMIT value), the entire external table operation fails and no rows are processed.

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date, amount float4, category text, desc1 text ) 
   LOCATION ('gpfdist://etlhost-1:8081/*.txt', 
             'gpfdist://etlhost-2:8082/*.txt')
   FORMAT 'TEXT' ( DELIMITER '|' NULL ' ')
   LOG ERRORS SEGMENT REJECT LIMIT 5;
```

To create the readable ext_expenses table from CSV-formatted text files:

```sql
=# CREATE EXTERNAL TABLE ext_expenses ( name text, 
   date date,  amount float4, category text, desc1 text ) 
   LOCATION ('gpfdist://etlhost-1:8081/*.txt', 
             'gpfdist://etlhost-2:8082/*.txt')
   FORMAT 'CSV' ( DELIMITER ',' )
   LOG ERRORS SEGMENT REJECT LIMIT 5;
```



以下是我的个人实验：

1. 创建一个数据目录 `~/Datasets/baike`, 将数据集`baike_triple.txt`移动到该目录下。

   这里的数据集来自 [CN-DBpedia](http://www.openkg.cn/dataset/cndbpedia), 包含 900万+ 的 百科实体 以及 6700万+ 的 三元组关系。其中 mention2entity 信息 110万+，摘要信息 400万+，标签信息 1980万+，infobox 信息 4100万+。大小约为 4.0 G。 数据实例如下：

   ```text
   "1+8"时代广场   中文名  "1+8"时代广场
   "1+8"时代广场   地点    咸宁大道与银泉大道交叉口
   "1+8"时代广场   实质    城市综合体项目
   "1+8"时代广场   总建面  约11.28万方
   "1.4"河南兰考火灾事故   中文名  "1.4"河南兰考火灾事故
   "1.4"河南兰考火灾事故   地点    河南<a>兰考县</a>城关镇
   "1.4"河南兰考火灾事故   时间    2013年1月4日
   ```

   

2. 开启 `gpfdist` 后台：

   ```shell
   gpfdist -d ~/Datasets/baike -p 8081 > /tmp/gpfdist.log 2>&1 &
   ps -A | grep gpfdist # 查看进程号
   30693 pts/8    00:00:00 gpfdist  # 表示进程号为 30693
   ```

   选项说明：

   - -d directory: 指定一个目录，gpfdist 将从该目录中为可读外部表提供文件，或为可写外部表创建输出文件。如果没有指定，默认为当前目录。
   - -p http_port:  gpfdist 提供文件要使用的HTTP端口。默认为8080。

   查看日志：

   ```shell
   gt@vm1:~$ more /tmp/gpfdist.log 
   2020-01-13 02:49:38 30693 INFO Before opening listening sockets - following listening sockets are a vailable:
   2020-01-13 02:49:38 30693 INFO IPV6 socket: [::]:8081
   2020-01-13 02:49:38 30693 INFO IPV4 socket: 0.0.0.0:8081
   2020-01-13 02:49:38 30693 INFO Trying to open listening socket:
   2020-01-13 02:49:38 30693 INFO IPV6 socket: [::]:8081
   2020-01-13 02:49:38 30693 INFO Opening listening socket succeeded
   2020-01-13 02:49:38 30693 INFO Trying to open listening socket:
   2020-01-13 02:49:38 30693 INFO IPV4 socket: 0.0.0.0:8081
   Serving HTTP on port 8081, directory /home/gt/Datasets/baike
   ```

   

3.  以 `gpadmin` 身份开启一个 psql session, 创建 `tables`： `ext_baike`用于存放加载的数据，`ext_load_baike_err `  用于存放加载错误的日志。

   ```sql
   psql -h localhost -d db_kg # 进入数据库 db_kg
   
   # 创建外部表
   CREATE EXTERNAL TABLE ext_baike (
   head text, rel text, tail text) 
   LOCATION ('gpfdist://vm1:8081/baike_triples.txt')
   FORMAT 'TEXT' (DELIMITER E'\t')
   LOG ERRORS SEGMENT REJECT LIMIT 50000;
   
   # 创建内部存储表
   CREATE TABLE tb_baike (
   id SERIAL PRIMARY KEY, head text, rel text, tail text);
   ```

   创建外部表语法详细： [CREATE EXTERNAL TABLE](https://gpdb.docs.pivotal.io/590/ref_guide/sql_commands/CREATE_EXTERNAL_TABLE.html) .

   创建 外部表后，就可以直接从外部表读取数据了，例如：

   ```sql
   db_kg=# select * from ext_baike limit 10;
         head       |   rel    |     tail      
   -----------------+----------+---------------
    *裔*            | 中文名   | *裔*
    *裔*            | 作者     | Amarantine
    *裔*            | 小说进度 | 暂停
    *裔*            | 连载网站 | 晋江文学城
    *西方犯罪学概论 | BaiduTAG | 书籍
    *西方犯罪学概论 | ISBN     | 9787811399967
    *西方犯罪学概论 | 作者     | 李明琪 编
    *西方犯罪学概论 | 出版时间 | 2010-4
    *西方犯罪学概论 | 定价     | 22.00元
    *西方犯罪学概论 | 页数     | 305
   (10 rows)
   ```

   

4. 将外部表数据导入到内部表：

   ```sql
   INSERT INTO tb_baike(head, rel, tail) SELECT * FROM ext_baike;
   ```

   由于 虚拟机的存储空间不足，最后运行失败。可以在日志中看到：

   ```shell
   more greenplum/data/data1/primary/gpseg0/pg_log/gpdb-2020-01-13_000000.csv
   2020-01-13 04:10:14.623480 UTC,,,p24832,th930718592,,,,0,,,seg0,,,,,"PANIC","53100","could not writ
   e to file ""pg_xlog/xlogtemp.24832"": No space left on device",,,,,,,0,,"xlog.c"
   ```

   start: 15:33:30

   abnormally end: 16:03

   错误: 

   > db_kg=# INSERT INTO tb_baike(head, rel, tail) SELECT * FROM ext_baike;    
   > ERROR:  gpfdist error: unknown meta type 108 (url_curl.c:1635)  (seg0 slice1 127.0.1.1:6000 pid=15880) (url_curl.c:1635)
   > CONTEXT:  External table ext_baike, file gpfdist://vm1:8081/baike_triples.txt

   LIMIT 10000;

   start 16:10:00

   end: 17:12:42

   >ERROR:  interconnect encountered a network error, please check your network  (seg3 slice1 192.168.5
   >6.6:6001 pid=11612)
   >DETAIL:  Failed to send packet (seq 1) to 127.0.1.1:56414 (pid 15913 cid -1) after 3562 retries in 
   >3600 seconds



## Cost-based Query Optimizer

当master接受到一条SQL语句，会将这条语句解析为执行计划 DAG，将 DAG 中不需要进行数据交换的划分为 slice ，join，aggregate，sort 的时候，都会涉及到 `slice` 的重分布，会有一个 `motion` 任务来执行数据的重分布。将 slice 下发到涉及到的相关 segment 中。来源：[GreenPlum：基于PostgreSQL的分布式关系型数据库](https://www.cnblogs.com/biterror/p/6909872.html)

参考 [About Greenplum Query Processing](https://gpdb.docs.pivotal.io/560/admin_guide/query/topics/parallel-proc.html)

![slice_plan.jpg](slice_plan.jpg)





`slice`:  To achieve maximum parallelism during query execution, Greenplum divides the work of the query plan into *slices*. A slice is a portion of the plan that segments can work on independently. A query plan is sliced wherever a *motion* operation occurs in the plan, with one slice on each side of the motion.

`motion`:  A motion operation involves moving tuples between the segments during query processing. Note that not every query requires a motion. For example, a targeted query plan does not require data to move across the interconnect.

-  a *redistribute motion* that moves tuples between the segments to complete the join. 
- A *gather motion* is when the segments send results back up to the master for presentation to the client. Because a query plan is always sliced wherever a motion occurs, this plan also has an implicit slice at the very top of the plan (*slice 3*). 



## Federated Data Access

![federated_data_access.png](federated_data_access.png)



## MADlib 扩展

### 添加 madlib扩展

从 [Pivotal Network](https://network.pivotal.io/products/pivotal-gpdb#/releases/526878/file_groups/2342) 上面下载 `MADlib 1.16+8 for RHEL 7 `.

使用 `gppkg` 安装:

出现错误:

```shell
gt@vm1:~/madlib-1.16+8-gp6-rhel7-x86_64$ gppkg -i madlib-1.16+8-gp6-rhel7-x86_64.gppkg 
20200113:10:01:15:018921 gppkg:vm1:gt-[INFO]:-Starting gppkg with args: -i madlib-1.16+8-gp6-rhel7-x86_64.gppkg
20200113:10:01:15:018921 gppkg:vm1:gt-[CRITICAL]:-gppkg failed. (Reason='__init__() takes exactly 17 arguments (16 given)') exiting...
```

**最后**， 重新安装了系统： *Centos 7*. 在 [Pivotal Network](https://network.pivotal.io/products/pivotal-gpdb/#/releases/548754/file_groups/2367) 上说明了 `madlib` 可以安装的系统：

![Pivotal_Network.png](Pivotal_Network.png)

![MADlib_download_page.png](MADlib_download_page.png)

`Pivotal Network` 只给出了 `Redhat 6.x`， `Redhat 7.x` 的 binary package. 之前装的 `Ubuntu 18.04` 并不能使用。`Redhat Enterprise Linux` 咱也用不起。。所以考虑使用免费的 `Fedora`  or  `CentOS` 系统。 我装的是 `CentOS 7`,

```shell
[gpadmin@vm1 ~]$ cat /etc/os-release 
NAME="CentOS Linux"
VERSION="7 (Core)"
ID="centos"
ID_LIKE="rhel fedora"
VERSION_ID="7"
PRETTY_NAME="CentOS Linux 7 (Core)"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:7"
HOME_URL="https://www.centos.org/"
BUG_REPORT_URL="https://bugs.centos.org/"

CENTOS_MANTISBT_PROJECT="CentOS-7"
CENTOS_MANTISBT_PROJECT_VERSION="7"
REDHAT_SUPPORT_PRODUCT="centos"
REDHAT_SUPPORT_PRODUCT_VERSION="7"

```

安装的 `Greenplum` 是 `6.3` 版本的。 因此下载的文件是 `madlib-1.16+9-gp6-rhel7-x86_64.tar.gz`, 解压后如下：

```shell
[gpadmin@vm1 madlib-1.16+9-gp6-rhel7-x86_64]$ ls -la
total 3048
drwxr-xr-x. 2 gpadmin gpadmin     147 Jan 14 16:51 .
drwx------. 7 gpadmin gpadmin    4096 Jan 14 16:51 ..
-rw-r--r--. 1 gpadmin gpadmin 2904455 Jan 10 07:31 madlib-1.16+9-gp6-rhel7-x86_64.gppkg
-rw-r--r--. 1 gpadmin gpadmin  135530 Jan 10 07:31 open_source_license_MADlib_1.16_GA.txt
-rw-r--r--. 1 gpadmin gpadmin   61836 Jan 10 07:31 ReleaseNotes.txt
```

里面的 `madlib-1.16+9-gp6-rhel7-x86_64.gppkg` 文件需要使用 GreenPlum 的工具 `gppkg` 安装。 安装方式为：

```shell
${GPHOME}/bin/gppgk [-i <package>| -u <package> | -r <name-version> | -c] 
[-d <master_data_directory>] [-a] [-v]
```

安装：

```shell
${GPHOME}/bin/gppgk  -i madlib-1.16+9-gp6-rhel7-x86_64.gppkg
```

然后，安装 `MADlib` Object to Database:

```shell
$GPHOME/madlib/bin/madpack install -s madlib -p greenplum -c gpadmin@vm1:5432/testdb
```

安装记录如下（需要预先安装 `m4`, `yum install m4`）：

```shell
[gpadmin@vm1 madlib-1.16+9-gp6-rhel7-x86_64]$ $GPHOME/madlib/bin/madpack install -p greenplum
madpack.py: INFO : Detected Greenplum DB version 6.3.0.
madpack.py: INFO : *** Installing MADlib ***
madpack.py: INFO : MADlib tools version    = 1.16 (/usr/local/greenplum-db-6.3.0/madlib/Versions/1.16/bin/../madpack/madpack.py)
madpack.py: INFO : MADlib database version = None (host=localhost:5432, db=gpadmin, schema=madlib)
madpack.py: INFO : Testing PL/Python environment...
madpack.py: INFO : > PL/Python environment OK (version: 2.7.12)
madpack.py: INFO : > Preparing objects for the following modules:
madpack.py: INFO : > - array_ops
madpack.py: INFO : > - bayes
madpack.py: INFO : > - crf
madpack.py: INFO : > - elastic_net
madpack.py: INFO : > - linalg
madpack.py: INFO : > - pmml
madpack.py: INFO : > - prob
madpack.py: INFO : > - sketch
madpack.py: INFO : > - svec
madpack.py: INFO : > - svm
madpack.py: INFO : > - tsa
madpack.py: INFO : > - stemmer
madpack.py: INFO : > - conjugate_gradient
madpack.py: INFO : > - knn
madpack.py: INFO : > - lda
madpack.py: INFO : > - stats
madpack.py: INFO : > - svec_util
madpack.py: INFO : > - utilities
madpack.py: INFO : > - assoc_rules
madpack.py: INFO : > - convex
madpack.py: INFO : > - deep_learning
madpack.py: INFO : > - glm
madpack.py: INFO : > - graph
madpack.py: INFO : > - linear_systems
madpack.py: INFO : > - recursive_partitioning
madpack.py: INFO : > - regress
madpack.py: INFO : > - sample
madpack.py: INFO : > - summary
madpack.py: INFO : > - kmeans
madpack.py: INFO : > - pca
madpack.py: INFO : > - validation
madpack.py: INFO : Installing MADlib:
madpack.py: INFO : > Created madlib schema
madpack.py: INFO : > Created madlib.MigrationHistory table
madpack.py: INFO : > Wrote version info in MigrationHistory table
madpack.py: INFO : MADlib 1.16 installed successfully in madlib schema.
```



### madlib 的使用

错误（在数据库 `db_kg` ）：

>ERROR:  schema "madlib" does not exist

由于使用 `madpack` 安装 `madlib`时没有指定 database, 而在 db_kg 中使用 `madlib` 时会出现错误，使用  `madpack install-check` 检查：

```shell
[gpadmin@vm1 ~]$ $GPHOME/madlib/bin/madpack install-check -p greenplum -c gpadmin@vm1:5432/db_madlib_demo
madpack.py: INFO : Detected Greenplum DB version 6.3.0.
madpack.py: INFO : MADlib is not installed in the schema madlib. Install-check stopped.
```

发现确实在 数据库 db_kg 中没有安装 madlib. 看看上面 `madpack install` 的日志，发现它默认选择的数据库是 `gpadmin`, 即用户名同名数据库：

```shell
madpack.py: INFO : MADlib database version = None (host=localhost:5432, db=gpadmin, schema=madlib)
```

在 数据库 db_kg 上测试发现确实已经安装：

```shell
[gpadmin@vm1 ~]$ $GPHOME/madlib/bin/madpack install-check -p greenplum 
madpack.py: INFO : Detected Greenplum DB version 6.3.0.
TEST CASE RESULT|Module: array_ops|array_ops.ic.sql_in|PASS|Time: 203 milliseconds
TEST CASE RESULT|Module: bayes|bayes.ic.sql_in|PASS|Time: 1102 milliseconds
TEST CASE RESULT|Module: crf|crf_test_small.ic.sql_in|PASS|Time: 931 milliseconds
TEST CASE RESULT|Module: crf|crf_train_small.ic.sql_in|PASS|Time: 927 milliseconds
TEST CASE RESULT|Module: elastic_net|elastic_net.ic.sql_in|PASS|Time: 1041 milliseconds
TEST CASE RESULT|Module: linalg|linalg.ic.sql_in|PASS|Time: 274 milliseconds
TEST CASE RESULT|Module: linalg|matrix_ops.ic.sql_in|PASS|Time: 4158 milliseconds
TEST CASE RESULT|Module: linalg|svd.ic.sql_in|PASS|Time: 2050 milliseconds
TEST CASE RESULT|Module: pmml|pmml.ic.sql_in|PASS|Time: 2597 milliseconds
TEST CASE RESULT|Module: prob|prob.ic.sql_in|PASS|Time: 67 milliseconds
TEST CASE RESULT|Module: svm|svm.ic.sql_in|PASS|Time: 1479 milliseconds
TEST CASE RESULT|Module: tsa|arima.ic.sql_in|PASS|Time: 2058 milliseconds
TEST CASE RESULT|Module: stemmer|porter_stemmer.ic.sql_in|PASS|Time: 107 milliseconds
TEST CASE RESULT|Module: conjugate_gradient|conj_grad.ic.sql_in|PASS|Time: 555 milliseconds
TEST CASE RESULT|Module: knn|knn.ic.sql_in|PASS|Time: 574 milliseconds
TEST CASE RESULT|Module: lda|lda.ic.sql_in|PASS|Time: 641 milliseconds
TEST CASE RESULT|Module: stats|anova_test.ic.sql_in|PASS|Time: 147 milliseconds
TEST CASE RESULT|Module: stats|chi2_test.ic.sql_in|PASS|Time: 174 milliseconds
TEST CASE RESULT|Module: stats|correlation.ic.sql_in|PASS|Time: 426 milliseconds
TEST CASE RESULT|Module: stats|cox_prop_hazards.ic.sql_in|PASS|Time: 586 milliseconds
TEST CASE RESULT|Module: stats|f_test.ic.sql_in|PASS|Time: 129 milliseconds
TEST CASE RESULT|Module: stats|ks_test.ic.sql_in|PASS|Time: 138 milliseconds
TEST CASE RESULT|Module: stats|mw_test.ic.sql_in|PASS|Time: 118 milliseconds
TEST CASE RESULT|Module: stats|pred_metrics.ic.sql_in|PASS|Time: 779 milliseconds
TEST CASE RESULT|Module: stats|robust_and_clustered_variance_coxph.ic.sql_in|PASS|Time: 864 milliseconds
TEST CASE RESULT|Module: stats|t_test.ic.sql_in|PASS|Time: 145 milliseconds
TEST CASE RESULT|Module: stats|wsr_test.ic.sql_in|PASS|Time: 149 milliseconds
TEST CASE RESULT|Module: utilities|encode_categorical.ic.sql_in|PASS|Time: 425 milliseconds
TEST CASE RESULT|Module: utilities|minibatch_preprocessing.ic.sql_in|PASS|Time: 534 milliseconds
TEST CASE RESULT|Module: utilities|path.ic.sql_in|PASS|Time: 387 milliseconds
TEST CASE RESULT|Module: utilities|pivot.ic.sql_in|PASS|Time: 287 milliseconds
TEST CASE RESULT|Module: utilities|sessionize.ic.sql_in|PASS|Time: 245 milliseconds
TEST CASE RESULT|Module: utilities|text_utilities.ic.sql_in|PASS|Time: 334 milliseconds
TEST CASE RESULT|Module: utilities|transform_vec_cols.ic.sql_in|PASS|Time: 427 milliseconds
TEST CASE RESULT|Module: utilities|utilities.ic.sql_in|PASS|Time: 311 milliseconds
TEST CASE RESULT|Module: assoc_rules|assoc_rules.ic.sql_in|PASS|Time: 1328 milliseconds
TEST CASE RESULT|Module: convex|lmf.ic.sql_in|PASS|Time: 409 milliseconds
TEST CASE RESULT|Module: convex|mlp.ic.sql_in|PASS|Time: 2032 milliseconds
TEST CASE RESULT|Module: deep_learning|keras_model_arch_table.ic.sql_in|PASS|Time: 498 milliseconds
TEST CASE RESULT|Module: glm|glm.ic.sql_in|PASS|Time: 4514 milliseconds
TEST CASE RESULT|Module: graph|graph.ic.sql_in|PASS|Time: 4471 milliseconds
TEST CASE RESULT|Module: linear_systems|dense_linear_sytems.ic.sql_in|PASS|Time: 313 milliseconds
TEST CASE RESULT|Module: linear_systems|sparse_linear_sytems.ic.sql_in|PASS|Time: 376 milliseconds
TEST CASE RESULT|Module: recursive_partitioning|decision_tree.ic.sql_in|PASS|Time: 807 milliseconds
TEST CASE RESULT|Module: recursive_partitioning|random_forest.ic.sql_in|PASS|Time: 649 milliseconds
TEST CASE RESULT|Module: regress|clustered.ic.sql_in|PASS|Time: 549 milliseconds
TEST CASE RESULT|Module: regress|linear.ic.sql_in|PASS|Time: 104 milliseconds
TEST CASE RESULT|Module: regress|logistic.ic.sql_in|PASS|Time: 720 milliseconds
TEST CASE RESULT|Module: regress|marginal.ic.sql_in|PASS|Time: 1230 milliseconds
TEST CASE RESULT|Module: regress|multilogistic.ic.sql_in|PASS|Time: 1052 milliseconds
TEST CASE RESULT|Module: regress|robust.ic.sql_in|PASS|Time: 498 milliseconds
TEST CASE RESULT|Module: sample|balance_sample.ic.sql_in|PASS|Time: 389 milliseconds
TEST CASE RESULT|Module: sample|sample.ic.sql_in|PASS|Time: 79 milliseconds
TEST CASE RESULT|Module: sample|stratified_sample.ic.sql_in|PASS|Time: 252 milliseconds
TEST CASE RESULT|Module: sample|train_test_split.ic.sql_in|PASS|Time: 506 milliseconds
TEST CASE RESULT|Module: summary|summary.ic.sql_in|PASS|Time: 457 milliseconds
TEST CASE RESULT|Module: kmeans|kmeans.ic.sql_in|PASS|Time: 2581 milliseconds
TEST CASE RESULT|Module: pca|pca.ic.sql_in|PASS|Time: 4804 milliseconds
TEST CASE RESULT|Module: pca|pca_project.ic.sql_in|PASS|Time: 1948 milliseconds
TEST CASE RESULT|Module: validation|cross_validation.ic.sql_in|PASS|Time: 756 milliseconds
```

 所以在 db_kg 上安装 madlib 即可。

在数据库内检查是否已经安装 `madlib`:

```shell
[gpadmin@vm1 ~]$ psql -d db_madlib_demo
psql (9.4.24)
Type "help" for help.

db_madlib_demo=# \dn madlib
 List of schemas
  Name  |  Owner  
--------+---------
 madlib | gpadmin
(1 row)
```



**正文开始...**

`MADlib` 的使用详见： [**MADlib Documentation**](http://madlib.apache.org/docs/latest/index.html).  内容太多，只挑几个案例学习。

#### Array Operations

Array Operations, copy from [Array Operations](http://madlib.apache.org/docs/latest/group__grp__array.html):

|                                                    Operation | Description                                                  |
| -----------------------------------------------------------: | ------------------------------------------------------------ |
| [array_add()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a91c8d3715142927b3967f05a4fbf1575) | Adds two arrays. It requires that all the values are NON-NULL. Return type is the same as the input type. |
| [sum()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a26e8508a2bae10a6574cec697a270eea) | Aggregate, sums vector element-wisely. It requires that all the values are NON-NULL. Return type is the same as the input type. |
| [array_sub()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a2875a161a01c7dcdea9a4997b074eefc) | Subtracts two arrays. It requires that all the values are NON-NULL. Return type is the same as the input type. |
| [array_mult()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a652d70c480d484c4a1a92ded384b0dd7) | Element-wise product of two arrays. It requires that all the values are NON-NULL. Return type is the same as the input type. |
| [array_div()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a6cc05e7052495f8b64692faf40219576) | Element-wise division of two arrays. It requires that all the values are NON-NULL. Return type is the same as the input type. |
| [array_dot()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#acde10964ed23b7c8da515fb84cb8d5e0) | Dot-product of two arrays. It requires that all the values are NON-NULL. Return type is the same as the input type. |
| [array_contains()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#aedf6cb13eb4803bcc12dc4d95ea8ff4e) | Checks whether one array contains the other. This function returns TRUE if each non-zero element in the right array equals to the element with the same index in the left array. |
| [array_max()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#ae891429cc50705c530f3e5ca15541849) | This function finds the maximum value in the array. NULLs are ignored. Return type is the same as the input type. |
| [array_max_index()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#aa415256a9064aecc600dfb5e377fb7b1) | This function finds the maximum value and corresponding index in the array. NULLs are ignored. Return type is array in format [max, index], and its element type is the same as the input type. |
| [array_min()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a6659bf9d9363eb179fab34f81f8ac59b) | This function finds the minimum value in the array. NULLs are ignored. Return type is the same as the input type. |
| [array_min_index()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a813a4d9ffc1c18b1b3e18f6ecdb2051f) | This function finds the minimum value and corresponding index in the array. NULLs are ignored. Return type is array in format [min, index], and its element type is the same as the input type. |
| [array_sum()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a4c98f20e6a737358806f63318daea5ec) | This function finds the sum of the values in the array. NULLs are ignored. Return type is the same as the input type. |
| [array_sum_big()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a418de59800833aa95f9b7cbd6b12901c) | This function finds the sum of the values in the array. NULLs are ignored. Return type is always FLOAT8 regardless of input. This function is meant to replace [array_sum()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a4c98f20e6a737358806f63318daea5ec) in cases when a sum may overflow the element type. |
| [array_abs_sum()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a13c0b0c53e8b0dc4e08c21bb8152ee7d) | This function finds the sum of abs of the values in the array. NULLs are ignored. Return type is the same as the input type. |
| [array_abs()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#ac14e74c10b58f5518cd0e3e56067e5ba) | This function takes an array as the input and finds abs of each element in the array, returning the resulting array. It requires that all the values are NON-NULL. |
| [array_mean()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a407598f9eb70637798b02fd731bfca2c) | This function finds the mean of the values in the array. NULLs are ignored. |
| [array_stddev()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a3b6c2d173a611e6d6b184d825c2b336d) | This function finds the standard deviation of the values in the array. NULLs are ignored. |
| [array_of_float()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#ab066e65a41db78b00b4532996b2a6efc) | This function creates an array of set size (the argument value) of FLOAT8, initializing the values to 0.0. |
| [array_of_bigint()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#ab7d8550e66d2e0bd54b8f0997d93880c) | This function creates an array of set size (the argument value) of BIGINT, initializing the values to 0. |
| [array_fill()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a065a5323f3b742be47e39ad8b4c90fc2) | This functions set every value in the array to some desired value (provided as the argument). |
| [array_filter()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#acc295a568878940ffc3e2c9a75990efb) | This function takes an array as the input and keep only elements that satisfy the operator on specified scalar. It requires that the array is 1-D and all the values are NON-NULL. Return type is the same as the input type. By default, this function removes all zeros. |
| [array_scalar_mult()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#ae6881cc5c86941b6ffca35d7f3cd5c12) | This function takes an array as the input and executes element-wise multiplication by the scalar provided as the second argument, returning the resulting array. It requires that all the values are NON-NULL. Return type is the same as the input type. |
| [array_scalar_add()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a0b6ffe59b12c3dee076c3059f9ab363f) | This function takes an array as the input and executes element-wise addition of the scalar provided as the second argument, returning the resulting array. It requires that all the values are NON-NULL. Return type is the same as the input type. |
| [array_sqrt()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a83451ed0c3ca5a9c62751dba47e45df7) | This function takes an array as the input and finds square root of each element in the array, returning the resulting array. It requires that all the values are NON-NULL. |
| [array_pow()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#a761e7ca753a5e1acf26896b37ed8b0bd) | This function takes an array and a float8 as the input and finds power of each element in the array, returning the resulting array. It requires that all the values are NON-NULL. |
| [array_square()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#aff60f4091bed6374683f047c8a70ef9a) | This function takes an array as the input and finds square of each element in the array, returning the resulting array. It requires that all the values are NON-NULL. |
| [normalize()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#acb57ea4521dcb717f9e3148e0acccc74) | This function normalizes an array as sum of squares to be 1. It requires that the array is 1-D and all the values are NON-NULL. |
| [array_unnest_2d_to_1d()](http://madlib.apache.org/docs/latest/array__ops_8sql__in.html#af057b589f2a2cb1095caa99feaeb3d70) | This function takes a 2-D array as the input and unnests it by one level. It returns a set of 1-D arrays that correspond to rows of the input array as well as an ID column with values corresponding to row positions occupied by those 1-D arrays within the 2-D array. |



示例：

1. 创建数据表， 并插入数据

   ```sql
   CREATE TABLE array_tbl ( id integer NOT NULL PRIMARY KEY,
                            array1 integer[],
                            array2 integer[]
                          );
   INSERT INTO array_tbl VALUES
                          ( 1, '{1,2,3,4,5,6,7,8,9}', '{9,8,7,6,5,4,3,2,1}' ),
                          ( 2, '{1,1,0,1,1,2,3,99,8}','{0,0,0,-5,4,1,1,7,6}' );
   ```

   

2. 使用 functions

   ```sql
   db_madlib_demo=# select id, 
   						madlib.array_sum(array1), 
   						madlib.array_sub(array2, array1), 
   						madlib.array_max(array1), 
   						madlib.array_min(array1), 
   						madlib.array_mean(array1), 
   						madlib.normalize(array1)
   				from array_tbl group by id;
   
    id | array_sum |          array_sub          | array_max | array_min |    array_mean    |                                                     
                            normalize                                                                               
   ----+-----------+-----------------------------+-----------+-----------+------------------+-----------------------------------------------------
   -----------------------------------------------------------------------------------------------------------------
     1 |        45 | {8,6,4,2,0,-2,-4,-6,-8}     |         9 |         1 |                5 | {0.0592348877759092,0.118469775551818,0.177704663327
   728,0.236939551103637,0.296174438879546,0.355409326655455,0.414644214431365,0.473879102207274,0.533113989983183}
     2 |       116 | {-1,-1,0,-6,3,-1,-2,-92,-2} |        99 |         0 | 12.8888888888889 | {0.0100595273380576,0.0100595273380576,0,0.010059527
   3380576,0.0100595273380576,0.0201190546761152,0.0301785820141728,0.995893206467704,0.0804762187044609}
   (2 rows)
   
   ```



#### Low-Rank Matrix Faxtorization

这个模块用一个` low-rank approximation ` 实现了 `incomplete matrix` 的分解。

 Mathematically, this model seeks to find matrices *U* and *V* (also referred as factors) that, for any given incomplete matrix *A*, minimizes: 

$||A - UV^T||_2$,  s.t. $rank(UV^T) <= r$,

where $||.||_2$ denotes the Frobenius norm.  Let $A$ be a $m×n$ matrix, then $U$ will be $m×r$ and $V$ will be $n×r$, in dimension, and $1≤r≪min(m,n)$. This model is not intended to do the full decomposition, or to be used as part of inverse procedure. This model has been widely used in recommendation systems (e.g., Netflix [2]) and feature selection (e.g., image processing [3]).

**Function Syntax**

```shell
lmf_igd_run( rel_output, # TEXT. The name of the table to receive the output.
             rel_source, # TEXT. The name of the table containing the input data.{sparse}
             col_row,	 # TEXT. The name of the column containing the row number.
             col_column, # TEXT. The name of the column containing the column number.
             col_value,	 # DOUBLE PRECISION. The value at (row, col).
             row_dim,	 # INTEGER, default: "SELECT max(col_row) FROM rel_source".
             column_dim, # INTEGER, default: "SELECT max(col_col) FROM rel_source".
             max_rank,	 # INTEGER, default: 20. The rank of desired approximation.
             stepsize,	 # DOUBLE PRECISION, default: 0.01. Hyper-parameter that decides how aggressive the gradient steps are.
             scale_factor, # DOUBLE PRECISION, default: 0.1. Hyper-parameter that decides scale of initial factors.
             num_iterations, # INTEGER, default: 10. Maximum number if iterations to perform regardless of convergence.
             tolerance # DOUBLE PRECISION, default: 0.0001. Acceptable level of error in convergence.
           )
```

**Examples**

1. Create table, insert data.

   ```sql
   CREATE TABLE lmf_data (row INT, col INT, val FLOAT8, primary key (row, col));
   INSERT INTO lmf_data VALUES (1, 1, 5.0), (3, 100, 1.0), (999, 10000, 2.0);
   ```

   

2.  execute function

   ```sql
   db_madlib_demo=# SELECT madlib.lmf_igd_run('lmf_model', 'lmf_data', 'row', 'col', 'val', 999,10000, 3, 0.1, 2, 10, 1e-9 );
   NOTICE:  Matrix lmf_data to be factorized: 999 x 10000
   NOTICE:  Table doesn't have 'DISTRIBUTED BY' clause -- Using column named 'id' as the Greenplum Database data distribution key for this table.
   HINT:  The 'DISTRIBUTED BY' clause determines the distribution of data. Make sure column(s) chosen are the optimal data distribution key to minimize skew.
   CONTEXT:  SQL statement "
               CREATE TABLE lmf_model (
                   id          SERIAL,
                   matrix_u    DOUBLE PRECISION[],
                   matrix_v    DOUBLE PRECISION[],
                   rmse        DOUBLE PRECISION)"
   PL/pgSQL function madlib.lmf_igd_run(character varying,regclass,character varying,character varying,character varying,integer,integer,integer,double precision,double precision,integer,double precision) line 47 at EXECUTE statement
   NOTICE:  
   Finished low-rank matrix factorization using incremental gradient
   DETAIL:  
    * table : lmf_data (row, col, val)
   Results:
    * RMSE = 3.61661832699015e-06
   Output:
    * view : SELECT * FROM lmf_model WHERE id = 1
    lmf_igd_run 
   -------------
              1
   (1 row)
   ```

   

3. Check the result.

   ```sql
   db_madlib_demo=# SELECT array_dims(matrix_u) AS u_dims, array_dims(matrix_v) AS v_dims
   	FROM lmf_model
   	WHERE id=1;
   	
       u_dims    |     v_dims     
   --------------+----------------
    [1:999][1:3] | [1:10000][1:3]
   (1 row)
   ```

   

4. Query the result value

   ```sql
   db_madlib_demo=# SELECT matrix_u[2:2][1:3] AS row_2_features 
   	FROM lmf_model
   	WHERE id = 1;
   
                        row_2_features                      
   ---------------------------------------------------------
    {{1.97037281095982,0.312463999725878,1.06016968935728}}
   (1 row)
   ```

   

5. Make prediction of a missing entry (row=2, col=7654).

   ```sql
   db_madlib_demo=# SELECT madlib.array_dot(
           matrix_u[2:2][1:3],
           matrix_v[7654:7654][1:3]
   	) AS row_2_col_7654
   		FROM lmf_model
   		WHERE id = 1;
   		
     row_2_col_7654  
   ------------------
    2.37682774869935
   (1 row)
   
   ```

#### [Singular Value Decomposition](http://madlib.apache.org/docs/latest/group__grp__svd.html)

```shell
# SVD Function for Dense Matrices
svd( source_table, 			# TEXT. Source table name (dense matrix).
     output_table_prefix,	# TEXT. Prefix for output tables. 
     row_id,				# TEXT. ID for each row.
     k,						# INTEGER. Number of singular values to compute.
     n_iterations,			# INTEGER. Number of iterations to run.
     result_summary_table	# TEXT. The name of the table to store the result summary.
);

# SVD Function for Sparse Matrices
svd_sparse( source_table,
    output_table_prefix,
    row_id,
    col_id,
    value,
    row_dim,
    col_dim,
    k,
    n_iterations,
    result_summary_table
    );
```



#### [Neural Network](http://madlib.apache.org/docs/latest/group__grp__nn.html)

**Classification Training Function**

```shell
mlp_classification(
    source_table,
    output_table,
    independent_varname,
    dependent_varname,
    hidden_layer_sizes,
    optimizer_params,
    activation,
    weights,
    warm_start,
    verbose,
    grouping_col
    )
```

**Regression Training Function**

```shell
mlp_regression(
    source_table,
    output_table,
    independent_varname,
    dependent_varname,
    hidden_layer_sizes,
    optimizer_params,
    activation,
    weights,
    warm_start,
    verbose,
    grouping_col
    )
```

**Optimizer Parameters**

```shell
  'learning_rate_init = <value>,
   learning_rate_policy = <value>,
   gamma = <value>,
   power = <value>,
   iterations_per_step = <value>,
   n_iterations = <value>,
   n_tries = <value>,
   lambda = <value>,
   tolerance = <value>,
   batch_size = <value>,
   n_epochs = <value>,
   momentum = <value>,
   nesterov = <value>'
```

**Prediction Function**

```shell
mlp_predict(
    model_table,
    data_table,
    id_col_name,
    output_table,
    pred_type
    )
```



#### ...

还有其他很多的函数，没有一一的实验，需要用到了再查找吧。

总之，这个东西，个人感觉是 数据库的 *边缘用例* 了。而 `GreenPlum` 的核心特性是 Analysis, 但是吧，这个东西是 Apache 的，到底可不可以算是卖点呢。。而且，使用数据库来分析数据，emmm, 总感觉有点违和。并且，Greenplum 本身也不稳定，bug 还是比较多。前面加载海量数据就失败了（`gpfdist`）。

当然，这个工具是方便的，在数据存储的地方就把数据处理完了。

总之，知道有这个东西就好了。