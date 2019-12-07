---
title: spark入门-01
date: 2019-12-07 18:26:27
tags: spark，入门
---

这里开始学习 Spark

## Spark 生态

一开始， Spark 是加州伯克利大学伯克利分校  RAD 实验室的一个研究项目，最初是基于 Hadoop MapReduce 的。

Spark 组件：

```
--------------------------------------------------------------------------
Spark SQL结构化数据 | Spark Streaming 实时处理 | MLib 机器学习 | GraphX 图像处理
--------------------------------------------------------------------------
                                   Spark Core
--------------------------------------------------------------------------
 Standalone Scheduler  |              YARN           |          Meros
--------------------------------------------------------------------------
```

<!-- more -->

* Spark Core: 包含 Spark 基本功能， 包括任务调度，内存管理，容错机制等。内部定义了 RDDs (弹性分布式数据集)。提供APIs.
* Spark SQL : Spark 处理结构化数据的库，像 Hive, Mysql 一样。应用场景：企业中用于做报表统计。
* Spark Streaming: 实时流处理组件, 类似 `Storm`. 应用场景：企业中用来从 `Kafka` 消息队列中接收数据做实时统计。
* MLib: 一个包含通用机器学习功能的包，Machine Learning Lib，包含分类，聚类，回归等，还包括模型评估和数据导入。**MLib 提供的上面的方法，都支持集群上的横向扩展**。应用场景：机器学习。
* GraphX: 是处理图的库（例如社交网络），并进行图的并行计算。它提供了各种图的操作，和常用的图算法，例如 PageRank 算法。应用场景：图计算。

## Spark 与 Hadoop 的比较

| Spark                          | Hadoop                                       |
| ------------------------------ | -------------------------------------------- |
| 时效性高的场景（几秒到几分钟） | 离线处理，对时效性要求不高（几分钟到几小时） |
| 中间数据存储在内存             | 中间存储在硬盘                               |
| 机器学习                       |                                              |
| 不具有HDFS 的存储能力          | HDFS是 HADOOP 的重要组成部分                 |

## Spark 安装

单机：

直接下载，解压，即可使用。两种 shell: pyspark, scala shell. 

## RDDs 介绍

* Driver Program: 包含程序的 main() 方法， RDDs 的定义和操作。它管理很多节点，我们称做 `executors`.

* SparkContext: Driver Program 通过 SparkContext 对象访问 Spark. SparkContex  代表和一个集群的连接。在 Shell 中 是自动创建好的 `sc` 。
* RDDs： Resilient Distribute Datasets，弹性分布式数据集。这些 RDDs，并行的分布在整个集群中。

RDDs 常用操作：

Transformations:

* map(): 接受一个函数参数，把函数应用到 RDD 的每一个元素，返回新 RDD。
* filter(): 接受一个函数参数，返回只包含满足 filter() 函数的元素的新 RDD。
* flatMap(): 对每个输入元素，输出多个输出元素。比如 ``line.split()``
* 集合运算：distinct(): 去重；union(): 并集；intersection(): 交集；subtract(): 减法。

Action: 在 RDD 上计算出来一个结果，并将结果返回给 Driver Program 或者保存在文件系统中。

| 函数名                     | 功能                                   | 例子                           | 结果                  |
| -------------------------- | -------------------------------------- | ------------------------------ | --------------------- |
| collect()                  | 返回 RDD 的所有元素                    | rdd.collect()                  | {1,2,3,4}             |
| count()                    | 计数                                   | rdd.count()                    | 4                     |
| countByValue()             | 返回一个 map，表示某唯一元素出现的次数 | rdd.countByValue()             | {(1,1), (2,1), (3,2)} |
| take(num)                  | 返回几个元素                           | rdd.take(2)                    | {1, 2}                |
| top(num)                   | 返回前几个元素                         | rdd.top(2)                     | {3,3}                 |
| takeOrdered(num)(ordering) | 返回基于提供的排序算法的前几个元素     | rdd.takeOrdered(2)(myOrdering) | {3,3}                 |

* reduce(): 接受一个函数参数，作用在 RDD 两个类型相同的元素上，返回新元素。可以实现 RDD 中元素的累加，计数，和其他类型的聚集操作。
* foreach(): 计算 RDD 中的每个元素，但不返回到本地。

RDDs 的特性：

* RDDs 的血统关系图: RDD之间的依赖关系和创建关系。
* 延迟计算：第一次使用 action, 可减少数据传输。
* RDD.persist(): 默认每次在 RDDs 上面进行 action 操作时，Spark 都重新计算 RDDs. 如果想重复使用一个 RDD，可以使用 RDD.persist().  unpersist() 方法重缓存中移除。

KeyValue RDDs:

| 函数名                                                       | 功能                                    | 例子                           | 结果                   |
| ------------------------------------------------------------ | --------------------------------------- | ------------------------------ | ---------------------- |
| reduceByKey(func)                                            | 把相同 Key  的 reduce                   | rdd.reduceByKey((x,y)=>x+y)    | {(1, 2), (3,  10)}     |
| groupByKey()                                                 | 把相同 key 的 values 分组               | rdd.groupByKey()               | {(1, [2]), (3, [4,6])} |
| combineByKey(createCombiner, <br />mergeValue, <br />mergeCombiner, <br />partitioner ) | 把相同 Key 的reduce, 使用不同的返回类型 | ...                            |                        |
| mapValues(func)                                              | 函数作用于 pairRDD 的每个元素，key 不变 | rdd.mapValues(x=>x+1)          | {(1,3), (3,5)}         |
| flatMapValues(func)                                          | 符号化的时候使用                        | rdd.flatMapValues(x=>(x to 5)) |                        |
| keys()                                                       | 仅返回 keys                             | rdd.keys()                     | {1,2,3}                |
| values()                                                     | 仅返回 values                           | rdd.values()                   | {2,4,6}                |
| sortByKey()                                                  | 按照 key 排序的 RDD                     | rdd.sortByKey()                |                        |

## Spark 实践

这部分主要记录了 Spark 的使用。因为需要使用 hdfs, 所以需要安装 Hadoop 集群；再在 Spark 中指定 Hadoop 的配置文件的位置；最后学习了 python 环境下 hadoop 和 spark 的使用。

### Hadoop 集群安装

使用的 hadoop 版本是 `hadoop3.2.1`, 集群安装参考了我之前的一篇博客 [hadoop分布式集群安装](https://htmlgtmk.github.io/blog/2018/09/09/hadoop%E5%88%86%E5%B8%83%E5%BC%8F%E9%9B%86%E7%BE%A4%E5%AE%89%E8%A3%85/)。搭建的集群具体如下：
export PATH=${PATH}:${SPARK_HOME}/bin

| 虚拟机 | IP 地址                                     | 进程                                             |
| ------ | ------------------------------------------- | ------------------------------------------------ |
| vm1    | NAT: 10.0.2.5<br /> Host-Only: 192.168.56.5 | NameNode <br />ResourceManager                   |
| vm2    | NAT: 10.0.2.6<br />Host-Only: 192.168.56.6  | DataNode<br />NodeManager                        |
| vm3    | NAT: 10.0.2.7<br />Host-Only: 192.168.56.7  | DataNode<br />NodeManager<br />SecondaryNameNode |

hadoop3 的默认端口参考： [default ports used by hadoop](https://kontext.tech/column/hadoop/265/default-ports-used-by-hadoop-services-hdfs-mapreduce-yarn). 几个常用的端口如下：

| Service                     | Server                                      | Ports       | Protocol     | Configuration parameter                                      |
| --------------------------- | ------------------------------------------- | ----------- | ------------ | ------------------------------------------------------------ |
| WebUI of NameNode           | Master                                      | 9870/9871   | http / https | dfs.namenode.http-address<br />dfs.namenode.https-address    |
| Metadata service (NameNode) | Master                                      | 9000        | IPC          | fs.defaultFS                                                 |
| Secondary NameNode          | Secondary NameNode and any backup NameNodes | 9868 / 9869 | http / https | dfs.namenode.secondary.http-address<br />dfs.namenode.secondary.http-address |
|                             |                                             | 8088 / 8090 | http / https | yarn.resourcemanager.webapp.address<br />yarn.resourcemanager.webapp.https.address |

位置：`/usr/local/hadoop3.2.1`, 用户：`hdfs`.



### Spark 安装

有两种 Spark 安装方式：1）直接使用 `pip install pyspark` 安装。2）从 Spark 官网 [Download Apache Spark](https://spark.apache.org/downloads.html) 选择 [spark-3.0.0-preview-bin-hadoop3.2.tgz](https://www.apache.org/dyn/closer.lua/spark/spark-3.0.0-preview/spark-3.0.0-preview-bin-hadoop3.2.tgz) 下载。（注：必须选择相对应的 hadoop 版本的 spark）.

解压，将 `spark-3.0.0-preview-bin-hadoop3.2` 放在 `/usr/local/` 目录下.

编辑 `etc/spark-env.sh`, 指定 `HADOOP_CONF_DIR`, `SPARK_HOME`. 此外，还要在 `Hadoop-env.sh` 中加上 `export HADOOP_OPTS="-Djava.library.path=${HADOOP_HOME}/lib/native"`, 以防止出现 `WARNING: Unable to load native library for your platform.` 重启 HFDS.

主要是使用 `pyspark`, `spark-submit` 等。其中 `pyspark`是交互式的，`spark-submit` 是提交后运行的。



要使用 jupyter notebook 编辑时，需要进行一番设置：

1. jupyter notebook 的配置文件`~/.jupyter/jupter_notebook_config.py`修改（使用 ``jupyter notebook --generate-config``）:  

   ```python
   c.notebook.dir='/home/gt/workspace'  # 修改文件的位置
   # 修改 jupyter 运行的 ip，主机名
   c.NotebookApp.ip='10.0.2.5'
   c.NotebookApp.local_hostnames = ['vm1', 'localhost']
   c.NotebookApp.port = 8888
   ```

2. 在 `spark-env.sh` 中配置：

   ```shell
   export PYSPARK_DRIVER_PYTHON=jupyter
   export PYSPARK_DRIVER_PYTHON_OPTS='notebook --no-browser'
   ```

3. 启动 `pyspark` 就可以在 jupyter 中使用 `pyspark` 了。

### Python 下使用 Hadoop

首先，安装 `hdfs`: ``pip install hdfs``.

**连接**

```python
from hdfs import Client

client = Client("http://192.168.56.5:9870")
```

**查看目录**

```python
client.list("/")  # hdfs_path, 查看 “/” 目录下的数据
```

**创建目录，重命名，删除目录**

```python
client.makedirs("/datasets", permission = 0777)  # 创建 “/datasets” 目录
client.rename("/datasets", "/tmp")  # 将 “/datasets” 目录重命名为 "/tmp" 目录
client.delete("/tmp", recursive=True)  # 删除 "/tmp" 目录
```

**上传文件**

```python
# client.upload(hdfs_path, local_path)
# 将本地文件 ‘/home/gt/as_training.utf8’ 上传到 hdfs 的 '/datasets/training' 目录下
client.upload("/datasets/training", "/home/gt/as_training.utf8")  
```

**下载文件**

```python
# client.download(hdfs_path, local_path)
# 将 hdfs 中的 "/datasets/training/as_training.utf8" 下载到本地目录 '/home/gt/data' 下
client.download('datasets/training/as_training.utf8', '/home/gt/data')
```

**读取文件**

```python
with client.read("/datasets/training/as_training.utf8", encoding="utf-8") as f:
    for line in f:
        print(line)
    pass
```

### Python 下实现 wordcount 程序

**在终端实现 wordcount**

<!-- TODO  编写 python 下 hadoop mapreduce 的程序 -->

首先，实现 `mapper.py`:

```python
#!/usr/bin/env python
#-*- coding: utf-8 -*-

import sys

if __name__ == "__main__":
    for line in sys.stdin:
        words = line.split()
        for word in words:
            print(word.strip(), " ", 1)
```

然后，实现 `reduce.py`:

```python
#!/usr/bin/env python
#-*- coding: utf-8 -*-

import sys

if __name__ == "__main__":
    results = {}
    
    for line in sys.stdin:
        pair = line.strip().split()
        if pair[0] in results:
            results[pair[0]] += 1
        else:
            results[pair[0]] = 1
            pass
        pass
    
    for key, value in results.items():
        print(key, ": ", value)
        pass
    pass
```

最后，执行 `wordcount` 程序：

```shell
cat as_training_simple.utf8 | python3 mapper.py | sort -k 1 | python3 reduce.py
```

**注：** 中间的 `sort` 命令按 第一个位置排序，即按关键字排序。

执行结果：

![wordcount-terminal.png](wordcount-terminal.png)

**在 hadoop 中实现 wordcount**

先将数据集放到 hdfs 上面：

```shell
${HADOOP_HOME}/bin/hdfs dfs -put \
~/datasets/training/as_training_simple.utf8 \
/datasets/training/
```

然后，使用 hadoop 自带的 `hadoop-streaming-3.2.1.jar`， 执行 python 文件的 `mapreduce` 程序：

```shell
${HADOOP_HOME}/bin/hadoop jar ${HADOOP_HOME}/share/hadoop/tools/lib/hadoop-streaming-3.2.1.jar \
-input /datasets/training/as_training_simple.utf8 \
-output /output/wordcount2 \
-mapper "python3 mapper.py" \
-reducer "python3 reduce.py" \
-file ~/workspace/mapper.py \
-file ~/workspace/reduce.py
```

`hadoop-streaming-3.2.1.jar` jar包选项说明( 参考[hadoop streaming](https://hadoop.apache.org/docs/r1.2.1/streaming.html) )：

* -input 			\<path> DFS input file(s) for the Map step.
* -output          \<path> DFS output directory for the Reduce step.
* -mapper        <cmd|JavaClassName> Optional. Command to be run as mapper.
* -combiner     <cmd|JavaClassName> Optional. Command to be run as combiner.
* -reducer        <cmd|JavaClassName> Optional. Command to be run as reducer.
* -file                \<file> Optional. File/dir to be shipped in the Job jar file.  Deprecated. Use generic option "-files" instead.
* -files <file1,...>    specify a comma-separated list of files to be copied to the map r
  educe cluster.

执行结果：

```shell
...
packageJobJar: [/home/gt/workspace/mapper.py, /home/gt/workspace/reduce.py, /tmp/hadoop-unjar5233076481611645536/] [] /tmp/streamjob3259781167263769986.jar tmpDir=null
2019-12-07 17:34:24,263 INFO client.RMProxy: Connecting to ResourceManager at vm1/192.168.56.5:8032
2019-12-07 17:34:24,696 INFO client.RMProxy: Connecting to ResourceManager at vm1/192.168.56.5:8032
...
2019-12-07 17:34:26,228 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1575708748978_0002
2019-12-07 17:34:26,228 INFO mapreduce.JobSubmitter: Executing with tokens: []
2019-12-07 17:34:26,622 INFO conf.Configuration: resource-types.xml not found
2019-12-07 17:34:26,623 INFO resource.ResourceUtils: Unable to find 'resource-types.xml'.
2019-12-07 17:34:26,716 INFO impl.YarnClientImpl: Submitted application application_1575708748978_0002
2019-12-07 17:34:26,793 INFO mapreduce.Job: The url to track the job: http://vm1:8088/proxy/application_1575708748978_0002/
2019-12-07 17:34:26,800 INFO mapreduce.Job: Running job: job_1575708748978_0002
2019-12-07 17:34:37,028 INFO mapreduce.Job: Job job_1575708748978_0002 running in uber mode : false
2019-12-07 17:34:37,029 INFO mapreduce.Job:  map 0% reduce 0%
2019-12-07 17:35:00,237 INFO mapreduce.Job:  map 22% reduce 0%
2019-12-07 17:35:06,292 INFO mapreduce.Job:  map 36% reduce 0%
2019-12-07 17:35:12,343 INFO mapreduce.Job:  map 50% reduce 0%
2019-12-07 17:35:18,381 INFO mapreduce.Job:  map 64% reduce 0%
2019-12-07 17:35:24,421 INFO mapreduce.Job:  map 67% reduce 0%
2019-12-07 17:35:27,456 INFO mapreduce.Job:  map 83% reduce 0%
2019-12-07 17:35:28,465 INFO mapreduce.Job:  map 100% reduce 0%
2019-12-07 17:35:47,605 INFO mapreduce.Job:  map 100% reduce 82%
2019-12-07 17:35:53,659 INFO mapreduce.Job:  map 100% reduce 96%
2019-12-07 17:35:56,679 INFO mapreduce.Job:  map 100% reduce 100%
2019-12-07 17:35:56,688 INFO mapreduce.Job: Job job_1575708748978_0002 completed successfully
2019-12-07 17:35:56,811 INFO mapreduce.Job: Counters: 54
...
2019-12-07 17:35:56,814 INFO streaming.StreamJob: Output directory: /output/wordcount2
```

查看 wordcount  结果：

```shell
${HADOOP_HOME}/bin/hdfs dfs -cat /output/wordcount2
2019-12-07 17:39:03,689 INFO sasl.SaslDataTransferClient: SASL encryption trust check: localHostTrusted = false, remoteHostTrusted = false
) :  1
.５ :  1
.６ :  1
1980年 :  1
2. :  1
78. :  1
8. :  1
80. :  1
? :  12
...
```

![wordcount-hdfs.png](wordcount-hdfs.png)

#### 遇到的问题

在 hadoop 上执行 mapreduce 任务时，出现：

```shell
Error: Could not find or load main class org.apache.hadoop.mapreduce.v2.app.MRAppMaster
Please check whether your etc/hadoop/mapred-site.xml contains the below configuration:
<property>
<name>yarn.app.mapreduce.am.env</name>
<value>HADOOP_MAPRED_HOME=${full path of your hadoop distribution directory}</value>
</property>
<property>
<name>mapreduce.map.env</name>
<value>HADOOP_MAPRED_HOME=${full path of your hadoop distribution directory}</value>
</property>
<property>
<name>mapreduce.reduce.env</name>
<value>HADOOP_MAPRED_HOME=${full path of your hadoop distribution directory}</value>
</property>
```

查找资料 [Hadoop 3.0.0 RC0執行MR Job時所遇到的坑](https://mathsigit.github.io/blog_page/2017/11/16/hole-of-submitting-mr-of-hadoop300RC0/):

>In Hadoop 3, YARN containers do not inherit the NodeManagers’ environment variables. Therefore, if you want to inherit NodeManager’s environment variables (e.g.* `HADOOP_MAPRED_HOME`*), you need to set additional parameters (e.g.* `mapreduce.admin.user.env` *and* `yarn.app.mapreduce.am.env`*).*

解决：在 `etc/hadoop/mapred-site.xml` 中添加配置

```xml
<property>
  <name>yarn.app.mapreduce.am.env</name>
  <!-- <value>HADOOP_MAPRED_HOME=${full path of your hadoop distribution directory}</value> -->
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
<property>
  <name>mapreduce.map.env</name>
  <!-- <value>HADOOP_MAPRED_HOME=${full path of your hadoop distribution directory}</value> -->
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
<property>
  <name>mapreduce.reduce.env</name>
  <!--  <value>HADOOP_MAPRED_HOME=${full path of your hadoop distribution directory}</value> -->
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
```



### Python 下使用 Spark

#### python 文件形式提交

首先，编写一个 `wordcount` 的程序 (`wordcount.py`) :

```python
from hdfs import Client
from pyspark import SparkContext, SparkConf
import sys


if __name__ == '__main__':
    conf = SparkConf().setAppName("Spark-hadoop-demo").setMaster("local")
    sc = SparkContext(conf = conf)
    sc.setLogLevel("Warn")
    client = Client("http://192.168.56.5:9870")
    print('='*40)
    print(' '*20, 'Output', ' ' * 20)
    print('-'*40)
    print(client.list("/datasets/training"))
    print(client.list("/datasets/testing"))

    # 从 hdfs 中获取 RDD
    training = sc.textFile("hdfs://192.168.56.5:9000/datasets/training/as_training_simple.utf8")
    # print(training.first())

    """
    wordcount
    flatMap: Takes a single object and transforms it into a list of objects
    map: Takes a single object and transforms it into another single object
    reduce: Combines objects together
    filter: Removes objects based on a given true/false condition
    """
    counted = training.flatMap(lambda line: line.split(" "))\
    		.map(lambda word: (word.strip(), 1))\
        	.reduceByKey(lambda x,y: x+y)
            
    print(counted.collect()[:100])
    counted.saveAsTextFile("hdfs://192.168.56.5:9000/output/wordcount")

    print("-"*40)
    
    sc.stop()  # 关闭sc
    pass
```

再用 `spark-submit` 提交：

```shell
${SPARK_HOME}/bin/spark-submit --master yourSparkMaster\
--num-executors 20 \
--executor-memory 1G \
--executor-cores 2 \
--driver-memory 1G \
pythonfile.py

${SPARK_HOME}/bin/spark-submit --master yarn ~/workspace/wordcount.py
```

可以省略一些 executor 的参数。

#### jupyter 中实时运行

需要保证能够在 jupyter 中使用 `pyspark`.

对于 `MultiSparkContext` 错误，可以由下面的代码段初始化：

```python
from pyspark import SparkContext, SparkConf

try:
    sc.stop()  # 先关闭之前的 SparkContext
except e:
    print(e)
    pass

conf = SparkConf().setAppName("Spark-hadoop-demo").setMaster("local")
sc = SparkContext(conf = conf)
```

