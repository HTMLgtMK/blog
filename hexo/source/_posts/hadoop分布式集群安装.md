---
title: hadoop分布式集群安装
date: 2018-11-13 18:57:59
tags: hadoop-2.8.5 分布式 安装
author: GT
---

目的: 在虚拟机中安装hadoop集群，并且正确运行hadoop自带的实例程序wordcount.
环境 | CentOS7 
hadoop版本 | hadoop-2.8.5
java版本 | java-1.8.0-openjdk-1.8.0.191.b12-0.el7_5.x86_64

## 集群规划
1. Single Node集群
-- | -- 
Master | hserver1
Slave | hserver1
<!-- more -->
2. Mutli Node集群
一共有3台虚拟机, 每台虚拟机的作用规划如下:
-- | -- 
Master | hserver1
Slave | hserver2, hserver2, hserver3

SERVER | IP ADDR | PROCESS
-- | -- | -- | --
hserver1 | 192.168.48.200 | NameNode, DataNode, NodeManager, ResourceManager, JobHistoryServer
hserver2 | 192.168.48.201 | DataNode, NodeManager
hserver2 | 192.168.48.202 | DataNode, SecondaryNameNode, NodeManager

这里为了方便, 直接使用root操作.(实际上不安全)

## Single Node安装
### 准备工作
安装好JDK, 并设置好环境变量.从官网中下载`hadoop-2.8.6.tar.gz`, 并解压到`/usr/local`下.
修改三个server的ip为对应静态地址, 修改hostname.

### 配置hadoop
hadoop的配置文件都在`etc/hadoop`目录下.
1. 修改环境变量
`hadoop-env.sh` 设置JAVA环境和hadoop home目录
```shell
# Set Hadoop-specific environment variables here.
JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.191.b12-0.el7_5.x86_64
HADOOP_HOME=/usr/local/hadoop-2.8.5
export JAVA_HOME=${JAVA_HOME}
export HADOOP_HOME
```<br/>
`yarn-env.sh` 设置JAVA环境
```shell
# some Java parameters
# export JAVA_HOME=/home/y/libexec/jdk1.6.0/
JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.191.b12-0.el7_5.x86_64
```
2. 配置`core-site.xml`
```xml
<property>
<name>fs.defaultFS</name>
<value>hdfs://hserver1:9000</value>
</property>
<property>
<name>hadoop.tmp.dir</name>
<value>/usr/local/hadoop-2.8.5/tmp</value>
<description>temporary data dir</description>
</property>
```
3. 配置`hdfs-site.xml`
```xml
<configuration>
<property> 
	<name>dfs.replication</name> 
	<value>3</value>
	<description>data replication number</description>
</property> 
<property> 
	<!-- 不能识别环境变量${HADOOP_HOME} -->
	<name>dfs.namenode.name.dir</name> 
	<value>/usr/local/hadoop-2.8.5/hdfs/name</value> 
</property> 
<property>
	<name>dfs.datanode.data.dir</name> 
	<value>/usr/local/hadoop-2.8.5/hdfs/data</value> 
</property> 
<property> 
	<name>dfs.http.address</name> 
	<value>hserver1:50070</value> 
</property> 
<property>
	<name>dfs.secondary.http.address</name> 
	<value>hserver1:50090</value> 
</property> 
<property> 
	<name>dfs.webhdfs.enabled</name> 
	<value>true</value> 
</property> 
<property> 
	<name>dfs.permissions</name> 
	<value>false</value>
</property>
</configuration>
```
4. 配置`mapred-site.xml`
```xml
<configuration>
<property> 
<name>mapreduce.framework.name</name> 
	<value>yarn</value>
</property> 
<property> 
	<name>mapreduce.jobhistory.address</name> 
	<value>hserver1:10020</value> 
</property> 
<property> 
	<name>mapreduce.jobhistory.webapp.address</name> 
	<value>hserver1:19888</value> 
</property>
</configuration>
```
5. 配置`yarn-site.xml`
```xml
<configuration>
<!-- Site specific YARN configuration properties -->
<property> 
	<name>yarn.resourcemanager.hostname</name> 
	<value>hserver1</value> 
</property> 
<property> 
	<name>yarn.nodemanager.aux-services</name> 
	<value>mapreduce_shuffle</value> 
</property> 
<property> 
	<name>yarn.resourcemanager.address</name> 
	<value>hserver1:8032</value> 
</property> 
<property> 
	<name>yarn.resourcemanager.scheduler.address</name> 
	<value>hserver1:8030</value> 
</property> 
<property> 
	<name>yarn.resourcemanager.resource-tracker.address</name> 
	<value>hserver1:8031</value> 
</property> 
<property> 
	<name>yarn.resourcemanager.admin.address</name> 
	<value>hserver1:8033</value> 
</property> 
<property> 
	<name>yarn.resourcemanager.webapp.address</name> 
	<value>hserver1:8088</value> 
</property>
</configuration>
```
简单的hadoop配置完成了

### 开启hadoop
1. 格式化`namenode`
```shell
[gt@hserver1 hadoop-2.8.5]$ pwd
/usr/local/hadoop-2.8.5
[gt@hserver1 hadoop-2.8.5]$ sudo bash ./bin/hdfs namenod -format
Error: Could not find or load main class namenod
[gt@hserver1 hadoop-2.8.5]$ sudo bash ./bin/hdfs namenode -format
18/11/13 04:04:28 INFO namenode.NameNode: STARTUP_MSG: 
/************************************************************
STARTUP_MSG: Starting NameNode
STARTUP_MSG:   user = root
STARTUP_MSG:   host = localhost/127.0.0.1
STARTUP_MSG:   args = [-format]
STARTUP_MSG:   version = 2.8.5
STARTUP_MSG:   classpath = ...
STARTUP_MSG:   java = 1.8.0_191
************************************************************/
18/11/13 04:04:28 INFO namenode.NameNode: registered UNIX signal handlers for [TERM, HUP, INT]
18/11/13 04:04:28 INFO namenode.NameNode: createNameNode [-format]
...
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at localhost/127.0.0.1
************************************************************/
```
![CentOS 64 位-2018-11-13-20-08-12.png](CentOS 64 位-2018-11-13-20-08-12.png)
**报错: ** `Please specify HADOOP_NAMENODE_USER`. 意思是需要指定hadoop namenode的用户, 需要在
`hadoop-env.sh`头部添加(后面如果有`export`的话可以省略`export`):
```shell
export HADOOP_NAMENODE_USER=root
export HADOOP_SECONDARYNAMENODE_USER=root
export HADOOP_JOBTRACKER_USER=root
export HADOOP_DATANODE_USER=root
export HADOOP_TASKTRACKER_USER=root
```
或者将这几句添加到`start-all.sh`,`stop-all.sh`,`start-dfs.sh`,`stop-dfs.sh`,`start-yarn.sh`,`stop-yarn.sh`的头部。
2. 开启hadoop
直接使用`sbin`目录下的脚本`start-all.sh`开启, 使用`stop-all.sh`停止。
hadoop-2.8.5版本中会报deprecate(但是hadoop-3.1.1不会), 可以依次使用`start-dfs.sh`, `start-yarn.sh`代替。
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo bash ./sbin/start-all.sh
This script is Deprecated. Instead use start-dfs.sh and start-yarn.sh
Starting namenodes on [hserver1]
hserver1: starting namenode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-namenode-hserver1.out
localhost: starting datanode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-datanode-hserver1.out
Starting secondary namenodes [hserver1]
hserver1: starting secondarynamenode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-secondarynamenode-hserver1.out
starting yarn daemons
starting resourcemanager, logging to /usr/local/hadoop-2.8.5/logs/yarn-gt-resourcemanager-hserver1.out
localhost: starting nodemanager, logging to /usr/local/hadoop-2.8.5/logs/yarn-root-nodemanager-hserver1.out
```
**注: ** 开启hadoop时可能会提示需要输入用户密码, 是由于需要ssh登入, 可以使用ssh密钥免密登陆. 
比如现在是root用户, 那么需要将`ssh-keygen`生成的`id_rsa.pub`公钥保存到`/root/.ssh/authorized_keys`文件中。
3. 查看`NodeManager`
按照配置, `NodeManager`地址为`dfs.http.address`:`hserver1:50070` or `dfs.secondary.http.address`:`hserver1:50090`。
在浏览器地址栏输入:`hserver1:50070` or `192.168.48.200:50070`
![CentOS 64 位-2018-11-13-21-06-49.png](CentOS 64 位-2018-11-13-21-06-49.png)
![CentOS 64 位-2018-11-13-21-07-22.png](CentOS 64 位-2018-11-13-21-07-22.png)
![CentOS 64 位-2018-11-13-21-07-29.png](CentOS 64 位-2018-11-13-21-07-29.png)
**注: **需要在`/etc/hosts`文件中添加`127.0.0.1 hserver1`对应项才能使用主机名访问方式。
4. 查看`ResourceManager`
根据配置, `yarn.resourcemanager.webapp.address`的地址为`hserver1:8088`.
在浏览器中输入`hserver1:8088`
![CentOS 64 位-2018-11-13-21-14-40.png](CentOS 64 位-2018-11-13-21-14-40.png)
### 运行`wordcount`实例
1. 在hadoop home目录下创建目录`input`, 创建文件`f1.in`, `f2.in`
```shell
[gt@hserver1 hadoop-2.8.5]$ cat input/f1.in
hello hadoop
hello java
hello world
```
2. 在运行的hadoop中创建目录
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo bash ./bin/hdfs dfs -mkdir /input
```
[gray]删除为`hdfs dfs -rm -r -f /input`[gray]
可以在`NodeManager`中看到新建的hdfs目录[hserver1:50070/explore.html#/](hserver1:50070/explore.html#/)
![CentOS 64 位-2018-11-13-22-06-06.png](CentOS 64 位-2018-11-13-22-06-06.png)
或者从shell中查看:
```shell
sudo ./bin/hadoop dfs -ls /input
```
3. 上传文件
将`/usr/local/hadoop-2.8.5/input`目录的文件上传到hadoop目录
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hdfs dfs -put input/* /input
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hdfs dfs -ls /input
Found 2 items
-rw-r--r--   3 root supergroup         36 2018-11-13 07:54 /input/f1.in
-rw-r--r--   3 root supergroup       2710 2018-11-13 07:54 /input/f2.in
```
![CentOS 64 位-2018-11-13-23-56-58.png](CentOS 64 位-2018-11-13-23-56-58.png)
4. 运行`wordcount`实例
`wordcount`实例的位置在`share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.5.jar`
执行下面的命令(新建了hadoop目录为/output)
```shell
sudo ./bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.5.jar wordcount /input /output/wordcount.out
```
可以在NodeManager的LiveNode中找到对应Node的地址, 查看该Node的状态
![CentOS 64 位-2018-11-14-00-21-22.png](CentOS 64 位-2018-11-14-00-21-22.png)
```shell
This script is Deprecated. Instead use start-dfs.sh and start-yarn.sh
Starting namenodes on [hserver1]
hserver1: starting namenode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-namenode-hserver1.out
localhost: starting datanode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-datanode-hserver1.out
Starting secondary namenodes [hserver1]
hserver1: starting secondarynamenode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-secondarynamenode-hserver1.out
starting yarn daemons
starting resourcemanager, logging to /usr/local/hadoop-2.8.5/logs/yarn-gt-resourcemanager-hserver1.out
localhost: starting nodemanager, logging to /usr/local/hadoop-2.8.5/logs/yarn-root-nodemanager-hserver1.out
18/11/13 21:06:17 INFO client.RMProxy: Connecting to ResourceManager at hserver1/127.0.0.1:8032
18/11/13 21:06:17 INFO input.FileInputFormat: Total input files to process : 2
18/11/13 21:06:18 INFO mapreduce.JobSubmitter: number of splits:2
18/11/13 21:06:18 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1542171961373_0001
18/11/13 21:06:19 INFO impl.YarnClientImpl: Submitted application application_1542171961373_0001
18/11/13 21:06:19 INFO mapreduce.Job: The url to track the job: http://hserver1:8088/proxy/application_1542171961373_0001/
18/11/13 21:06:19 INFO mapreduce.Job: Running job: job_1542171961373_0001
18/11/13 21:06:27 INFO mapreduce.Job: Job job_1542171961373_0001 running in uber mode : false
18/11/13 21:06:27 INFO mapreduce.Job:  map 0% reduce 0%
18/11/13 21:06:36 INFO mapreduce.Job:  map 50% reduce 0%
18/11/13 21:06:37 INFO mapreduce.Job:  map 100% reduce 0%
18/11/13 21:06:43 INFO mapreduce.Job:  map 100% reduce 100%
18/11/13 21:06:45 INFO mapreduce.Job: Job job_1542171961373_0001 completed successfully
18/11/13 21:06:45 INFO mapreduce.Job: Counters: 50
	File System Counters
		FILE: Number of bytes read=3766
		FILE: Number of bytes written=480592
		FILE: Number of read operations=0
		FILE: Number of large read operations=0
		FILE: Number of write operations=0
		HDFS: Number of bytes read=2940
		HDFS: Number of bytes written=2633
		HDFS: Number of read operations=9
		HDFS: Number of large read operations=0
		HDFS: Number of write operations=2
	Job Counters 
		Killed map tasks=1
		Launched map tasks=3
		Launched reduce tasks=1
		Data-local map tasks=3
		Total time spent by all maps in occupied slots (ms)=14943
		Total time spent by all reduces in occupied slots (ms)=5311
		Total time spent by all map tasks (ms)=14943
		Total time spent by all reduce tasks (ms)=5311
		Total vcore-milliseconds taken by all map tasks=29886
		Total vcore-milliseconds taken by all reduce tasks=10622
		Total megabyte-milliseconds taken by all map tasks=15301632
		Total megabyte-milliseconds taken by all reduce tasks=5438464
	Map-Reduce Framework
		Map input records=16
		Map output records=429
		Map output bytes=4450
		Map output materialized bytes=3772
		Input split bytes=194
		Combine input records=429
		Combine output records=283
		Reduce input groups=283
		Reduce shuffle bytes=3772
		Reduce input records=283
		Reduce output records=283
		Spilled Records=566
		Shuffled Maps =2
		Failed Shuffles=0
		Merged Map outputs=2
		GC time elapsed (ms)=665
		CPU time spent (ms)=1700
		Physical memory (bytes) snapshot=709869568
		Virtual memory (bytes) snapshot=6373437440
		Total committed heap usage (bytes)=494927872
	Shuffle Errors
		BAD_ID=0
		CONNECTION=0
		IO_ERROR=0
		WRONG_LENGTH=0
		WRONG_MAP=0
		WRONG_REDUCE=0
	File Input Format Counters 
		Bytes Read=2746
	File Output Format Counters 
		Bytes Written=2633
```
![CentOS 64 位-2018-11-14-13-10-52.png](CentOS 64 位-2018-11-14-13-10-52.png)
查看运行结果, 可以通过查看输出文件查看结果:
```shell
[root@hserver1 hadoop-2.8.5]# sudo ./bin/hdfs dfs -ls /output
Found 1 items
drwxr-xr-x   - root supergroup          0 2018-11-13 21:06 /output/wordcount.out
[root@hserver1 hadoop-2.8.5]# sudo ./bin/hdfs dfs -ls /output/wordcount.out
Found 2 items
-rw-r--r--   3 root supergroup          0 2018-11-13 21:06 /output/wordcount.out/_SUCCESS
-rw-r--r--   3 root supergroup       2633 2018-11-13 21:06 /output/wordcount.out/part-r-00000
[root@hserver1 hadoop-2.8.5]# sudo ./bin/hdfs dfs -ls /output/wordcount.out/part-r-00000
-rw-r--r--   3 root supergroup       2633 2018-11-13 21:06 /output/wordcount.out/part-r-00000
[root@hserver1 hadoop-2.8.5]# sudo ./bin/hdfs dfs -cat /output/wordcount.out/part-r-00000
"I	1
"The	3
"We	1
($290)	1
-	5
0.5	1
2,000	1
2018.	1
5,	1
5,000	1
50.27	1
Biao,	1
Bijie	1
Bijie,	1
Chen	1
China's	1
Chinese	1
Dafang	1
Farmers	1
Guizhou	2
In	1
June	1
Li	2
Luhua	1
Moreover,	1
... # 省略
```
更多可以查看`part-r-00000`中的内容。到这里实例运行算是结束了！！！真的是泪流满面！！！
以下是运行过程中遇到的问题
错误1: Error: Could not find or load main class jar
写错了hadoop, 不是hdfs
错误2:
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.5.jar wordcount /input /output
18/11/13 08:07:17 INFO client.RMProxy: Connecting to ResourceManager at hserver1/127.0.0.1:8032
org.apache.hadoop.mapred.FileAlreadyExistsException: Output directory hdfs://hserver1:9000/output already exists
	at org.apache.hadoop.mapreduce.lib.output.FileOutputFormat.checkOutputSpecs(FileOutputFormat.java:146)
	at org.apache.hadoop.mapreduce.JobSubmitter.checkSpecs(JobSubmitter.java:268)
	at org.apache.hadoop.mapreduce.JobSubmitter.submitJobInternal(JobSubmitter.java:141)
	at org.apache.hadoop.mapreduce.Job$11.run(Job.java:1341)
	at org.apache.hadoop.mapreduce.Job$11.run(Job.java:1338)
	at java.security.AccessController.doPrivileged(Native Method)
	at javax.security.auth.Subject.doAs(Subject.java:422)
	at org.apache.hadoop.security.UserGroupInformation.doAs(UserGroupInformation.java:1844)
	at org.apache.hadoop.mapreduce.Job.submit(Job.java:1338)
	at org.apache.hadoop.mapreduce.Job.waitForCompletion(Job.java:1359)
	at org.apache.hadoop.examples.WordCount.main(WordCount.java:87)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.apache.hadoop.util.ProgramDriver$ProgramDescription.invoke(ProgramDriver.java:71)
	at org.apache.hadoop.util.ProgramDriver.run(ProgramDriver.java:144)
	at org.apache.hadoop.examples.ExampleDriver.main(ExampleDriver.java:74)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.apache.hadoop.util.RunJar.run(RunJar.java:239)
	at org.apache.hadoop.util.RunJar.main(RunJar.java:153)
log上说是/output已经存在。。。那运行前保证输出文件不存在。
错误3:
18/11/13 08:54:23 INFO mapreduce.Job: Task Id : attempt_1542127670113_0001_m_000000_0, Status : FAILED
Error: java.net.ConnectException: Call From localhost/127.0.0.1 to hserver1:9000 failed on connection exception: java.net.ConnectException: Connection refused; 
问题4:运行一直卡在`mapreduce.job: map 100 reduce 0`
内存太小， 实测需要至少2G。另外还需要配置yarn和mapred的cpu-vcores.
yarn-site.xml
```xml
<property>
	<!-- default memory size is 8192(MB), and if you physical mem size less than 8(G), it can't detect automaticly. -->
	<!-- so we have to spacify the mem size -->
	<name>yarn.nodemanager.resource.memory-mb</name>
	<value>4096</value>
</property>
<property>
	<!-- single task allocate min mem size -->
	<name>yarn.scheduler.minimum-allocation-mb</name>
	<value>1024</value><!-- default size is 1024 -->
</property>
<property>
	<!-- single task allocate max mem size -->
	<name>yarn.scheduler.maximum-allocation-mb</name>
	<value>4096</value><!-- default size is 8192 -->
</property>
<property>
	<name>yarn.nodemanager.resource.cpu-vcores</name>
	<value>2</value>
</property>
```
mapred-site.xml
```xml
<property>
	<name>mapreduce.map.cpu.vcores</name>
	<value>2</value>
</property>
<property>
	<name>mapreduce.reduce.cpu.vcores</name>
	<value>2</value>
</property>
```
错误5: 
INFO mapreduce.JobSubmitter: Cleaning up the staging area /tmp/hadoop-yarn/staging/root/.staging/job_1542168958134_0002
java.io.IOException: org.apache.hadoop.yarn.exceptions.InvalidResourceRequestException: Invalid resource request, requested memory < 0, or requested memory > max configured, requestedMemory=1536, maxMemory=1024
原因: yarn配置`yarn.scheduler.maximum-allocation-mb`太小， 实测需要至少2G。

## Mutli Node集群搭建
### 准备工作
1. 在Single Node的基础上搭建Multi Node集群, 先将hserver1虚拟机使用`完整克隆`复制得到`hserver2`,`hserver3`.
修改hserver2, hserver3的内存大小为2G.(否则, 我的主机内存是8G, 3个4G的虚拟机不能够同时运行)

2. 开启3个虚拟机, 修改hserver2的`hostname`为`hserver2`, `ip`为`192.168.48.201`. 修改hserver3的`hostname`为`hserver3`, `ip`为`192.168.48.202`.
将`hserver2`, `hserver3`添加到`/etc/hosts`文件中:
```shell
127.0.0.1 hserver1
::1 hserver1
192.168.48.200 hserver1
192.168.48.201 hserver2
192.168.48.202 hserver3
```
注意`127.0.0.1`地址对应的`hostname`是不同的。完成后可以使用`ping hserver1`测试是否修改成功。

3. 免密登陆
将hserver1的`ssh公钥`添加到hserver2, hserver3
```shell
sudo scp ~/.ssh/id_rsa.pub root@hserver2:~
sudo scp ~/.ssh/id_rsa.pub root@hserver2:~
```
由于我的是直接克隆得到的, 因此hserver2, hserver3中本来就有了hserver1的公钥

### 配置hadoop

1. 指定master, 指定slaves
`master`的指定是通过`NameNode`所在的机器指定。
指定`slaves`编辑`etc/hadoop/slaves`, 删除`localhost`
```shell
hserver1
hserver2
hserver3
```

2. 添加hserver3为NodeManager
编辑`etc/hadoop/hdfs-site.xml`
```xml
<property>
	<name>dfs.secondary.http.address</name>
	<value>hserver3:50090</value><!-- 配置这个表示hserver3作为Secondary NameNode -->
</property>
```

3. 将hadoop拷贝到hserver2, hserver2
```shell
sudo scp -r /usr/local/hadoop-2.8.5 root@hserver2:/usr/local/
sudo scp -r /usr/local/hadoop-2.8.5 root@hserver2:/usr/local/
```
也可以只复制`etc`部分, 毕竟原来已经有了hadoop...而且只该了`etc`部分, 全部复制太慢了。

### 开启hadoop

1. 在NameNode的主机上(hserver1)格式化NameNode
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hdfs namenode -format
18/11/14 01:26:49 INFO namenode.NameNode: STARTUP_MSG: 
/************************************************************
STARTUP_MSG: Starting NameNode
STARTUP_MSG:   user = root
STARTUP_MSG:   host = hserver1/127.0.0.1
STARTUP_MSG:   args = [-format]
STARTUP_MSG:   version = 2.8.5
STARTUP_MSG:   classpath = ...
************************************************************/
18/11/14 01:26:49 INFO namenode.NameNode: registered UNIX signal handlers for [TERM, HUP, INT]
18/11/14 01:26:49 INFO namenode.NameNode: createNameNode [-format]
18/11/14 01:26:55 WARN common.Util: Path /usr/local/hadoop-2.8.5/hdfs/name should be specified as a URI in configuration files. Please update hdfs configuration.
18/11/14 01:26:55 WARN common.Util: Path /usr/local/hadoop-2.8.5/hdfs/name should be specified as a URI in configuration files. Please update hdfs configuration.
Formatting using clusterid: CID-9878c048-fcde-4a68-89ef-d8ea83cf74c1
18/11/14 01:26:56 INFO namenode.FSEditLog: Edit logging is async:true
18/11/14 01:26:56 INFO namenode.FSNamesystem: KeyProvider: null
18/11/14 01:26:56 INFO namenode.FSNamesystem: fsLock is fair: true
18/11/14 01:26:56 INFO namenode.FSNamesystem: Detailed lock hold time metrics enabled: false
18/11/14 01:26:56 INFO blockmanagement.DatanodeManager: dfs.block.invalidate.limit=1000
18/11/14 01:26:56 INFO blockmanagement.DatanodeManager: dfs.namenode.datanode.registration.ip-hostname-check=true
18/11/14 01:26:56 INFO blockmanagement.BlockManager: dfs.namenode.startup.delay.block.deletion.sec is set to 000:00:00:00.000
18/11/14 01:26:56 INFO blockmanagement.BlockManager: The block deletion will start around 2018 Nov 14 01:26:56
18/11/14 01:26:56 INFO util.GSet: Computing capacity for map BlocksMap
18/11/14 01:26:56 INFO util.GSet: VM type       = 64-bit
18/11/14 01:26:56 INFO util.GSet: 2.0% max memory 889 MB = 17.8 MB
18/11/14 01:26:56 INFO util.GSet: capacity      = 2^21 = 2097152 entries
18/11/14 01:26:56 INFO blockmanagement.BlockManager: dfs.block.access.token.enable=false
18/11/14 01:26:56 INFO blockmanagement.BlockManager: defaultReplication         = 3
18/11/14 01:26:56 INFO blockmanagement.BlockManager: maxReplication             = 512
18/11/14 01:26:56 INFO blockmanagement.BlockManager: minReplication             = 1
18/11/14 01:26:56 INFO blockmanagement.BlockManager: maxReplicationStreams      = 2
18/11/14 01:26:56 INFO blockmanagement.BlockManager: replicationRecheckInterval = 3000
18/11/14 01:26:56 INFO blockmanagement.BlockManager: encryptDataTransfer        = false
18/11/14 01:26:56 INFO blockmanagement.BlockManager: maxNumBlocksToLog          = 1000
18/11/14 01:26:56 INFO namenode.FSNamesystem: fsOwner             = root (auth:SIMPLE)
18/11/14 01:26:56 INFO namenode.FSNamesystem: supergroup          = supergroup
18/11/14 01:26:56 INFO namenode.FSNamesystem: isPermissionEnabled = false
18/11/14 01:26:56 INFO namenode.FSNamesystem: HA Enabled: false
18/11/14 01:26:56 INFO namenode.FSNamesystem: Append Enabled: true
18/11/14 01:26:57 INFO util.GSet: Computing capacity for map INodeMap
18/11/14 01:26:57 INFO util.GSet: VM type       = 64-bit
18/11/14 01:26:57 INFO util.GSet: 1.0% max memory 889 MB = 8.9 MB
18/11/14 01:26:57 INFO util.GSet: capacity      = 2^20 = 1048576 entries
18/11/14 01:26:57 INFO namenode.FSDirectory: ACLs enabled? false
18/11/14 01:26:57 INFO namenode.FSDirectory: XAttrs enabled? true
18/11/14 01:26:57 INFO namenode.NameNode: Caching file names occurring more than 10 times
18/11/14 01:26:57 INFO util.GSet: Computing capacity for map cachedBlocks
18/11/14 01:26:57 INFO util.GSet: VM type       = 64-bit
18/11/14 01:26:57 INFO util.GSet: 0.25% max memory 889 MB = 2.2 MB
18/11/14 01:26:57 INFO util.GSet: capacity      = 2^18 = 262144 entries
18/11/14 01:26:57 INFO namenode.FSNamesystem: dfs.namenode.safemode.threshold-pct = 0.9990000128746033
18/11/14 01:26:57 INFO namenode.FSNamesystem: dfs.namenode.safemode.min.datanodes = 0
18/11/14 01:26:57 INFO namenode.FSNamesystem: dfs.namenode.safemode.extension     = 30000
18/11/14 01:26:57 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.window.num.buckets = 10
18/11/14 01:26:57 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.num.users = 10
18/11/14 01:26:57 INFO metrics.TopMetrics: NNTop conf: dfs.namenode.top.windows.minutes = 1,5,25
18/11/14 01:26:57 INFO namenode.FSNamesystem: Retry cache on namenode is enabled
18/11/14 01:26:57 INFO namenode.FSNamesystem: Retry cache will use 0.03 of total heap and retry cache entry expiry time is 600000 millis
18/11/14 01:26:57 INFO util.GSet: Computing capacity for map NameNodeRetryCache
18/11/14 01:26:57 INFO util.GSet: VM type       = 64-bit
18/11/14 01:26:57 INFO util.GSet: 0.029999999329447746% max memory 889 MB = 273.1 KB
18/11/14 01:26:57 INFO util.GSet: capacity      = 2^15 = 32768 entries
18/11/14 01:26:57 INFO namenode.FSImage: Allocated new BlockPoolId: BP-1814272250-127.0.0.1-1542187617617
18/11/14 01:26:57 INFO common.Storage: Storage directory /usr/local/hadoop-2.8.5/hdfs/name has been successfully formatted.
18/11/14 01:26:57 INFO namenode.FSImageFormatProtobuf: Saving image file /usr/local/hadoop-2.8.5/hdfs/name/current/fsimage.ckpt_0000000000000000000 using no compression
18/11/14 01:26:58 INFO namenode.FSImageFormatProtobuf: Image file /usr/local/hadoop-2.8.5/hdfs/name/current/fsimage.ckpt_0000000000000000000 of size 320 bytes saved in 0 seconds.
18/11/14 01:26:58 INFO namenode.NNStorageRetentionManager: Going to retain 1 images with txid >= 0
18/11/14 01:26:58 INFO util.ExitUtil: Exiting with status 0
18/11/14 01:26:58 INFO namenode.NameNode: SHUTDOWN_MSG: 
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at hserver1/127.0.0.1
```
![hserver1-2018-11-14-17-28-46.png](hserver1-2018-11-14-17-28-46.png)

2. 在master上(配置有hdfs, hserver1)开启dfs
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo ./sbin/start-dfs.sh
Starting namenodes on [hserver1]
hserver1: starting namenode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-namenode-hserver1.out
hserver3: starting datanode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-datanode-hserver3.out
hserver1: starting datanode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-datanode-hserver1.out
hserver2: starting datanode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-datanode-hserver2.out
Starting secondary namenodes [hserver3]
hserver3: starting secondarynamenode, logging to /usr/local/hadoop-2.8.5/logs/hadoop-root-secondarynamenode-hserver3.out
```

3. 在配置有resource manager的主机上(hserver1)开启yarn
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo ./sbin/start-yarn.sh
starting yarn daemons
starting resourcemanager, logging to /usr/local/hadoop-2.8.5/logs/yarn-gt-resourcemanager-hserver1.out
hserver2: starting nodemanager, logging to /usr/local/hadoop-2.8.5/logs/yarn-root-nodemanager-hserver2.out
hserver3: starting nodemanager, logging to /usr/local/hadoop-2.8.5/logs/yarn-root-nodemanager-hserver3.out
hserver1: starting nodemanager, logging to /usr/local/hadoop-2.8.5/logs/yarn-root-nodemanager-hserver1.out
```
使用`jps`查看各个server中运行的进程
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo jps
4082 DataNode
4419 ResourceManager
3956 NameNode
4523 NodeManager
4940 Jps
```
![hserver1-2018-11-14-17-43-44.png](hserver1-2018-11-14-17-43-44.png)
```shell
[gt@hserver2 hadoop-2.8.5]$ sudo jps
4434 Jps
3977 DataNode
4140 NodeManager
```
![hserver2-2018-11-14-17-45-25.png](hserver2-2018-11-14-17-45-25.png)
```shell
[gt@hserver3 hadoop-2.8.5]$ sudo jps
4004 NodeManager
3847 SecondaryNameNode
4359 Jps
3756 DataNode
```
![hserver3-2018-11-14-17-47-41.png](hserver3-2018-11-14-17-47-41.png)

### 运行wordcount实例

1. 先将hserver1中input目录下文件put到dfs的input目录下
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hdfs dfs -mkdir /input
[sudo] password for gt: 
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hdfs dfs -mkdir /output
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hdfs dfs -put input/* /input
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hdfs dfs -ls /input
Found 2 items
-rw-r--r--   3 root supergroup         36 2018-11-14 01:56 /input/f1.in
-rw-r--r--   3 root supergroup       2710 2018-11-14 01:56 /input/f2.in
```

2. 运行wordcount实例
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo ./bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.5.jar wordcount /input /output/wordcount.out
18/11/14 01:58:47 INFO client.RMProxy: Connecting to ResourceManager at hserver1/127.0.0.1:8032
18/11/14 01:58:49 INFO input.FileInputFormat: Total input files to process : 2
18/11/14 01:58:50 INFO mapreduce.JobSubmitter: number of splits:2
18/11/14 01:58:51 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1542188103773_0001
18/11/14 01:59:02 INFO impl.YarnClientImpl: Submitted application application_1542188103773_0001
18/11/14 01:59:02 INFO mapreduce.Job: The url to track the job: http://hserver1:8088/proxy/application_1542188103773_0001/
18/11/14 01:59:02 INFO mapreduce.Job: Running job: job_1542188103773_0001
18/11/14 02:02:24 INFO mapreduce.Job: Job job_1542188103773_0001 running in uber mode : false
18/11/14 02:02:24 INFO mapreduce.Job:  map 0% reduce 0%
18/11/14 02:07:09 INFO mapreduce.Job:  map 100% reduce 0%
18/11/14 02:07:28 INFO mapreduce.Job:  map 100% reduce 100%
18/11/14 02:07:32 INFO mapreduce.Job: Job job_1542188103773_0001 completed successfully
18/11/14 02:07:35 INFO mapreduce.Job: Counters: 49
	File System Counters
		FILE: Number of bytes read=3766
		FILE: Number of bytes written=480592
		FILE: Number of read operations=0
		FILE: Number of large read operations=0
		FILE: Number of write operations=0
		HDFS: Number of bytes read=2940
		HDFS: Number of bytes written=2633
		HDFS: Number of read operations=9
		HDFS: Number of large read operations=0
		HDFS: Number of write operations=2
	Job Counters 
		Launched map tasks=2
		Launched reduce tasks=1
		Data-local map tasks=2
		Total time spent by all maps in occupied slots (ms)=536968
		Total time spent by all reduces in occupied slots (ms)=11662
		Total time spent by all map tasks (ms)=536968
		Total time spent by all reduce tasks (ms)=11662
		Total vcore-milliseconds taken by all map tasks=1073936
		Total vcore-milliseconds taken by all reduce tasks=23324
		Total megabyte-milliseconds taken by all map tasks=549855232
		Total megabyte-milliseconds taken by all reduce tasks=11941888
	Map-Reduce Framework
		Map input records=16
		Map output records=429
		Map output bytes=4450
		Map output materialized bytes=3772
		Input split bytes=194
		Combine input records=429
		Combine output records=283
		Reduce input groups=283
		Reduce shuffle bytes=3772
		Reduce input records=283
		Reduce output records=283
		Spilled Records=566
		Shuffled Maps =2
		Failed Shuffles=0
		Merged Map outputs=2
		GC time elapsed (ms)=43965
		CPU time spent (ms)=54050
		Physical memory (bytes) snapshot=663736320
		Virtual memory (bytes) snapshot=6380019712
		Total committed heap usage (bytes)=470286336
	Shuffle Errors
		BAD_ID=0
		CONNECTION=0
		IO_ERROR=0
		WRONG_LENGTH=0
		WRONG_MAP=0
		WRONG_REDUCE=0
	File Input Format Counters 
		Bytes Read=2746
	File Output Format Counters 
		Bytes Written=2633
[gt@hserver1 hadoop-2.8.5]$ 
```
![hserver1-2018-11-14-18-18-34.png](hserver1-2018-11-14-18-18-34.png)
![hserver1-2018-11-14-18-18-40.png](hserver1-2018-11-14-18-18-40.png)

3. 停止hadoop
```shell
[gt@hserver1 hadoop-2.8.5]$ sudo sbin/stop-all.sh
[sudo] password for gt: 
This script is Deprecated. Instead use stop-dfs.sh and stop-yarn.sh
Stopping namenodes on [hserver1]
hserver1: stopping namenode
hserver1: stopping datanode
hserver3: stopping datanode
hserver2: stopping datanode
Stopping secondary namenodes [hserver3]
hserver3: stopping secondarynamenode
stopping yarn daemons
stopping resourcemanager
resourcemanager did not stop gracefully after 5 seconds: killing with kill -9
hserver3: no nodemanager to stop
hserver1: stopping nodemanager
hserver2: no nodemanager to stop
hserver1: nodemanager did not stop gracefully after 5 seconds: killing with kill -9
no proxyserver to stop
```

## 总结
hadoop 作为主流开源分布式处理框架, 学会其搭建和简单使用是必要的。
回顾前面的经验, 搭建主要过程如下:
- 准备hadoop包, 准备java环境, 免密登陆
- 配置hadoop, 主要的配置文件有: hadoop-env.sh, yarn-env.sh, core-site.xml, hdfs-site.xml, mapred-site.xml, yarn-site.xml
	配置的主要内容包括: NameNode, DataNode, Yarn
- 格式化NameNode
- 开启hadoop, 关闭hadoop
- 运行wordcount实例

存在的问题: 没有考虑安全问题, 如果将hadoop直接暴露在公网环境下, 存在一种`virus`通过`yarn`的`8088`端口, 提交脚本执行挖矿程序, 
可以使用一下方法检查:
```shell
sudo ls /var/tmp/java # 如果存在则多数是中毒了
sudo crontab -l -u root # 如果存在一个奇怪的定时任务, 那么也是中毒了
```
对于hadoop, 应该设置专用的user对其控制(开启, 关闭), 在官网上有介绍。当暴露与公网环境后, 需要设置防火墙。

总之, hadoop应该继续深入学习, 包括mapreduce的原理。
