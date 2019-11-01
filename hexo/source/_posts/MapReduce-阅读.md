---
title: MapReduce-阅读
date: 2019-10-31 10:19:24
tags: MapReduce
---

这篇文章记录了阅读 [MapReduce: Simplified Data Processing on Large Clusters](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf) 的 Points.

这篇论文在 2004 年就已经发表，作者是 Jeffrey  Gean ( 杰夫-迪恩 ) 和 Sanjay Ghemawat ( 桑杰-格玛沃特 ) . 两个都是 *Goolgle* 公司的大牛。

## Abstract

MapReduce 是一个编程模型 ( programming model ) 和 用于 处理和生成 大型数据集的相关实现。

<!-- more -->

Users specify a ***map*** function that processes a *key/value pair* to generate a set of intermediate key/value pairs, and a ***reduce*** function that merges all intermediate values associated with the same intermediate key. 

使用本文这种功能形式的程序自动具有并行能力，并且可以执行在由廉价机器组成的大型集群上。

The run-time system takes care of the details of partitioning the input data, scheduling the program’s execution across a set of machines, handling machine failures, and managing the required inter-machine communication. 

## 1. Introduction

The major contributions of this work are a simple and powerful interface that enables automatic parallelization and distribution of large-scale computations, combined with an implementation of this interface that achieves high performance on large clusters of commodity PCs.

##  2. Programming Model

*Input*: a set of key/value pairs.

*Output*: a set of key/value pairs.

用户使用 MapReduce Library 表达计算只使用 两个功能： *Map* and *Reduce*。

***Map***: 由 user 编写，takes an input pair and produces a set of *intermediate* key/value pairs. MapReduce Library 将 中间结果键值对利用相同的键值 *I* 分组( groups together ), 并且将他们传送到 *Reduce* 函数。

***Reduce***: 也由 user 编写，接收一个中间键值 *I* 以及该键值下的一组值（ a set of values for that key）. Reduce 将这些 values 合并，形成 ( form) 一个（可能）更小的一组集合(a possibly smaller set of values)。典型的 每个Reduce 产生 0个或1个输出值。中间值通过一个 iterator 提供给 user's reduce function. 这样我们可以处理一些超过内存大小的大型数据集。

### 2.1 Example

这一部分不是很重要，主要裂了一些 MapReduce  的应用。可以先跳过这部分，直接看 MapReduce 是如何实现的。

Consider the problem of counting the number of occurrences of each word in a large collection of documents. 

则可能的 pseudo-code 如下：

```java
map(String key, String value):
	// key: document name
	// value: document content
	for each word w in value:
		EmitIntermediate(w, "1");

reduce(String key, Iterator values):
	// key: a word
	// values: a  list of counts
	int result = 0;
	for each v in values:
		result += ParseInt(v);
	Emit(AsString(result));
```

map 函数发出每个单词和一个相关的出现次数计数(在这个简单的示例中只有“1”)。reduce 函数将为特定单词发出的所有计数汇总在一起。

额外的，用户还需要指定输入输出的文件名以填充 *mapreduce speciffication*  对象，并且指定某些可选的优化参数。然后用户再激活 *mapReduce* 函数，传递 该对象给它。然后再与 MapReduce Library 链接（由 C++ 实现）。这个示例的完整代码在 附录A 里面。

### 2.2 Types

尽管前面的伪代码是根据字符串输入和输出编写的，但从概念上讲，用户提供的map和reduce函数具有关联的类型：

> map   		(  k1, v1 ) 				-> list ( k2, v2 )
>
> reduce	  ( k2, list ( v2 )) 		-> list( v2 )

例如： Input 的 key/value  类型 和 Output 的 key/value 类型可以不同，而 中间值的 key/value 类型 和 Output 的 key/value 类型相同。

### 2.3 More Examples

1. **Distributed Grep**:  The map function emits a line if it matches a supplied pattern. The reduce function is an identity function that just copies the supplied intermediate data to the output
2. **Count of URL Access Frequency**： The map function processes logs of web page requests and outputs *<URL, 1>*. The reduce function adds together all values for the same URL and emits a *<URL, total count>* pair.
3. **Reverse Web-Link Graph**: The map function outputs <target, source> pairs for each link to a *target* URL found in a page named *source*. The reduce function concatenates the list of all source URLs associated with a given target URL and emits the pair: *<target, list(source)>*.
4. **Term-Vector per Host**: A term vector summarizes the most important words that occur in a document or a set of documents as a list of *<word, frequency>* pairs. The map function emits a *<hostname, term vector>* pair for each input document (where the hostname is extracted from the URL of the document). The reduce function is passed all per-document term vectors for a given host. It adds these term vectors together, throwing away infrequent terms, and then emits a final *<hostname, term vector>* pair.
5. **Inverted Index**:  The map function parses each document, and emits a sequence of *<word, document ID>* pairs. The reduce function accepts all pairs for a given word, sorts the corresponding document IDs and emits a *<word, list(document ID)>* pair. The set of all output pairs forms a simple inverted index. It is easy to augment this computation to keep track of word positions.
6. **Distributed Sort**: The map function extracts the key from each record, and emits a *<key, record>* pair. The reduce function emits all pairs unchanged. This computation depends on the partitioning facilities described in Section 4.1 and the ordering properties described in Section 4.2

## 3. Implementation

可能存在多种的 MapReduce 实现，正确的做法是根据环境决定选用哪个实现。例如，某种实现适用于 a small share-memory machine, 而另一个适用于 a large NUMA multi-processor, 还有的可能适用于 an even larger collection of networked machines.

这里讨论的只是 Google 内部广泛使用的环境下：large clusters of commodity PCs connected together with switched Ethernet。

### 3.1 Execution Overview

Figure 1 shows the overall flow of a MapReduce operation in our implementation. When the user program calls the *MapReduce* function, the following sequence of actions occurs (the numbered labels in Figure 1 correspond to the numbers in the list below): 

![Figure1.png](Figure1.png)

1. 用户程序中的 MapReduce library 首先将输入文件分割成 M 份，典型的每份大小为 16 MB ~ 64 MB ( 可以由用户通过可选参数控制 )。然后在集群的机器上启动多个相同拷贝的程序（copies of the programe）。

2. 其中的一个程序拷贝是特殊的--Master，另外的都称为 *worker*, 由 *master* 分派任务。 . There are M map tasks and R reduce tasks to assign. Master 选取静默的 workers，并为每个 worker 分派一个 map 任务 或者 reduce 任务。

3. 如果一个 worker 被分派的是 *map* task, 那么它将读取相对应的输入文件的 split 的内容。将输入文件内容解析成 key/value 键值对形式，并传递到 user-defined *Map* function.  The intermediate Key/Value 键值对由 *Map* 函数产生，并且 buffered in memory。

4. 每个周期（Periodically）, 缓存的 key/value 键值对将被写入到 local disk，并被 *partitioning function* 被分割成 *R* 份。这些存到本地磁盘的 buffered key/value pairs 的 locations 将传递回 master. Master 负责分发这些 locations 到 reduce workers.

   "who is responsible for forwarding these locations to the reduce workers"

5. 当一个 reduce worker 接收到 master 通知的 locations 信息，it uses remote procedure calls to read the buffered data from the local disk of the map workers.  当 reduce worker  读取到所有的 intermediate data, 它将这些数据按照 intermediate keys 排序，这样具有相同 key 的 occurrences 值就可以 grouped together.  排序是必要的，因为典型的有很多的不同的 keys 被 map 到 相同的 reduce task. 如果 intermediate data 太大以至于超出内存容量，则可以使用 external sort.

6. reduce worker 遍历 排序后的 intermediate data, 并且对每个遇到的唯一的 intermediate key ，传递 这个 key 值和对应的 intermediate data 集合 到 user's *Reduce* function. *Reduce* function 的输出将追加到 a final output file for this reduce partition.

7. 当所有的 map tasks 和 reduce tasks 都已经完成， master 唤醒 user programe.  At this point, the MapReduce call in the user program returns back to the user code。

成功完成后，mapreduce 的执行输出可以在 *R* 份输出文件中找到。一般的，用户不将这 *R* 份文件合并成 一个文件，而是将其作为下一个 MapReduce 调用的输入，或者其他可以处理这些文件的分布式应用。

### 3.2 Master Data Structures

The master keeps several data structures. 对每个 map task 和 reduce task, master 保存它们的状态（*idle, in-progress, or completed*), 并且保存 worker machine 的标识( identity )。

Master 作为 map task 到 reduce task 中间值的传送管道（conduit）。对每个已经完成的 map task, the master 存储 这 *R* 个 intermediate file regions 的 locations 和 sizes. 当 map task 完成时，这些 locations 和 sizes 信息将会被更新，这些信息也会增量( incrementally )的推送给 *in-progress* 的 reduce worker.

### 3.3 Fault Tolerance

**Worker Failure**

Master 周期性的 ping 每个 worker. 如果没有在一个确定的时间内收到 response, 那么 master 标记这个 worker 已经 failed. 任何已经完成 map task 的 worker 将会被重置为初始的 *idle* 状态， and therefore become eligible for scheduling on other workers. 类似的，任何 map task 或 reduce task 失败的 worker 也会被重置为 *idle* 状态，并且 become eligible for rescheduling.

**在发生故障时将重新执行已完成的 map 任务( completed map task )，因为它们的输出存储在故障机器的本地磁盘上，因此无法访问。已经完成的 reduce 任务不需要重新执行，因为它们的输出存储在全局文件系统中。**

当一个 map task 先由 worker A 执行，再由 worker B 执行（因为 A 执行失败了），所有执行 reduce tasks 的 workers 将被通知 re-execution. 任何还没有从 worker A 读取数据的 reduce task 将从 worker B 读取数据。

MapReduce is resilient to large-scale worker failures. 通过简单的重新执行由不可达机器的 task, 然后向前推进，最终完成 MapReduce operation.

**Master Failure**

It is easy to make the master write **periodic checkpoints** of the master data structures described above. A new copy can be started from the last checkpoint state.

Our current implementation **aborts** the MapReduce computation if the master fails.

**Semantics in the Presence of Failures**

When the user-supplied *map* and *reduce* operators are deterministic functions of their input values, our distributed implementation produces the same output as would have been produced by a non-faulting sequential execution of the entire program.

We rely on atomic commits of map and reduce task outputs to achieve this property. Each in-progress task writes its output to private temporary files. A reduce task produces one such file, and a map task produces R such files (one per reduce task).

We rely on the atomic rename operation provided by the underlying file system to guarantee that the final file system state contains just the data produced by one execution of the reduce task.

When the map and/or reduce operators are nondeterministic, we provide weaker but still reasonable semantics.  在存在非确定性操作符的情况下，特定 reduce 任务 *R1* 的输出与非确定性程序的顺序执行所产生的 *R1* 的输出相等。但是，不同reduce 任务 *R2* 的输出可能对应于不确定程序的不同顺序执行所产生的 *R2* 输出。

### 3.4 Locality

Network bandwidth is a relatively scarce resource in our computing environment. 我们通过利用输入数据存储在集群机器本地磁盘上（ GFS ）的优点来节省网络带宽。

The MapReduce master takes the location information of the input files into account and attempts to schedule a map task on a machine that contains a replica of the corresponding input data. Failing that, it attempts to schedule a map task near a replica of that task’s input data.

当在集群中相当一部分 worker 上运行大型 MapReduce 操作时，大多数输入数据都是在本地读取的，不会消耗网络带宽。

### 3.5 Task Granularity ( 任务粒度 )

我们继续细分 map 阶段为 *M* 份， reduce 阶段 为 *R* 份，如上所述。理想状况下，*M* 和 *R* 应该远大于 worker machines 的数量。让每个 worker 执行许多不同的任务可以改进动态负载平衡，并在一个 worker 失败时加速恢复: 它已经完成的许多 map 任务可以分布在所有其他worker机器上.

在我们的实现中，*M* 和 *R* 的大小是有实际界限的，因为 主机 必须做出 *O(M + R)* 调度决策，并将 *O(M\*R)*  状态保存在内存中，如上所述。并且用户通常会限制 *R* ，因为每个 reduce task 最后都将输出一个独立文件。

实际上，我们倾向于选择 *M* 使得每个独立的任务 大约接收 16 MB ~ 64 MB 的输入数据（使得上面提到的 locality optimization 最有效）。让 *R* 为 一个小的乘子（ a small） 乘以 我们希望的 worker 的数量。

We often perform MapReduce computations with M = 200, 000 and R = 5, 000, using 2,000 worker machines.

### 3.6 Backup Tasks

延长MapReduce操作所需总时间的常见原因之一是“掉队者( straggler )”：计算中完成最后几个 map 或 reduce 任务中的一个需要异常长的时间的机器。掉队者的出现有很多原因。例如，有一个坏磁盘的机器可能会经常出现可纠正的错误，这会将其读取性能从 30 MB/s 降低到 1 MB/s。集群调度系统可能已经调度了机器上的其他任务，由于CPU、内存、本地磁盘或网络带宽的竞争，导致它执行 MapReduce 代码的速度更慢。我们最近遇到的一个问题是机器初始化代码中的一个bug，它导致处理器缓存（ processor cache ）被禁用:受影响机器上的计算速度降低了100多倍。

我们有一个通用的机制 ( general mechanism ) 来缓解( alleviate )掉队者的问题。当一个 MapReduce 操作接近完成时，主进程会调度仍然 in-progress tasks 的备份执行( backup executions )  。当主执行或备份执行完成时，任务被标记为已完成( completed )。我们对这个机制进行了调优，因此它通常只将操作所使用的计算资源增加不超过几个百分点。我们发现这大大减少了完成大型 MapReduce 操作的时间。例如，当禁用备份任务机制时，第5.3节中描述的排序程序需要多花费 44% 的时间才能完成。

## 4. Refinements

尽管通过简单的编写 *Map* 和 *Reduce* 函提供的基本功能已经可以满足大部分的需求，我们发现一些 extensions 很有用。

### 4.1 Partitioning Function

The users of MapReduce specify the number of reduce tasks/output files that they desire *(R)*. 数据在这些任务上首先需要在 intermediate key 上划分。一个默认的划分函数( partitioning function )是使用 哈希函数（e.g. Hash(key) mod R ). 这个划分函数 tends to result in fairly well-balanced partitions. 

然而，通过一些其他的划分函数比较有效。例如，有时，输出键是 URLs ，我们希望单个主机的所有条目都在同一个输出文件中结束。为了支持这种情况，MapReduce 库的用户可以提供一个特殊的划分函数。例如使用 *hash(Hostname(urlkey)) mnod R* 作为划分函数，这样所有来自相同 host 的 URLs 都出现在一个输出文件中。

### 4.2 Ordering Guarantees

我们保证在给定的分区中，**中间键/值对按递增键顺序处理**。这种排序保证可以很容易地为每个分区生成一个排序的输出文件，这在输出文件格式需要支持高效的按键随机访问查找，或者输出的用户发现排序数据很方便时非常有用。

### 4.3 Combiner Function

In some cases, there is significant repetition in the intermediate keys produced by each *map task, and the userspecified *Reduce* function is commutative and associative. 

We allow the user to specify an optional *Combiner* function that does partial merging of this data before it is sent over the network. 通常 *Combiner*   和 *Reduce* 使用相同的一套代码，两者唯一不同的地方是 MapReduce library 如何处理这个函数的输出。The output of a reduce function is written to the final output file. The output of a combiner function is written to an intermediate file that will be sent to a reduce task。

部分 combine 显著的加速了 几个 MapReduce 操作的类。

### 4.4 Input and Output Types

The MapReduce Library 支持读取多种格式的输入数据。例如，"text" 模式的输入将 each line 视作一个 key/value 键值对：key 是 the offset in the file, value 是 the content of the  line. 

用户可以支持新的读取格式，通过提供 一个 *reader* 接口的简单实现。A reader does not necessarily need to provide data read from a file. 也可以从 数据库 或者 内存中获取数据。

类似的，我们支持一组输出类型，并且用户很容易的添加新的输出类型。

### 4.5 Side-effects

In some cases, users of MapReduce have found it convenient to produce auxiliary files as additional outputs from their map and/or reduce operators. 我们依靠 the application writer 去原子的幂等的（ idempotent）实现这样的 副产物 。通常应用先将数据写入临时文件，全部写入后再将临时文件原子的 重命名。

我们不支持单任务生成的多个输出文件的原子两阶段提交。因此，产生具有跨文件一致性要求的多个输出文件的任务应该是确定的。这一限制在实践中从未成为问题。

### 4.6 Skipping Bad Records

用户程序有时会存在 Bug，导致 *Map* 或 *Reduce* 在 某些 records 上 crash. 这样的 bug 会使得 MapReduce 不能正常的完成。  The usual course of action is to fix the bug；also, sometimes it is acceptable to ignore a few records.  我们提供一个可选的执行模式（ an optional mode of execution ），MapReduce library会检测哪些 records 导致确定的 crash，然后将跳过这些 records ，以能够继续向前运行。

Each worker process installs a signal handler that catches segmentation violations and bus errors。在激活 user's Map or Reduce 函数之前，MapReduce 库会将参数的序列号存储在一个全局变量中。如果用户的代码产生了一个 signal，那么  the signal handler 将发送一个 "last gasp" UDP packet 给 master，packet 中包含由 sequence number. 当主机在一个特定的 record 上看到由多于一次的 failure，那么它表示这个 record 需要在下一次重新执行时被跳过。

### 4.7 Local Execution

Debugging problems in *Map* or *Reduce* functions can be tricky, since the actual computation happens in a distributed system,

为了方便 debug, profiling, 以及 small-scale testing, 我们在 MapReduce 库中提供了一个可选的实现，可以在一个本地机器上面串行的执行所有的 MapReduce 操作。用户可以控制 computation 局限于某些特定的 map task。用户使用一个特殊的标志来调用他们的程序，然后可以轻松地使用任何他们认为有用的调试或测试工具(例如gdb)。

### 4.8 Status Information

主机内部包含一个 HTTP server，并且导出一组 status pages 供人们了解。Status pages 显示了计算的进度，例如已经有多少 tasks 完成，还有多少正在执行，输入数据的大小，中间数据的大小，输出数据的大小，处理的数据等。页面还提供到每个 task 生成的 standard error 和 standard output files 的链接(links)。用户可以利用这些信息来预测计算还需要多长时间，是否需要增添计算资源等。页面还可以用于计算 computation 是否慢于 预期。

另外， Top-level 的状态页面可以显示哪个 worker have failed, 以及当它们执行哪个 map task 或者 reduce task 时 failed, 这些信息有利于诊断用户代码中的 bug。

### 4.9 Counters

The MapReduce library provides a counter facility to count occurrences of various events. 例如，用户代码可能想要 count the total number of words processed. 

为了使用这一便利，用户代码可以创建一个 counter object，然后在 Map/Reduce 中合适的递增 counter。 例如：

```c++
Counter* uppercase;
uppercase = GetCounter("uppercase");

map(String name, String contents):
	for each word w in contents:
		if (IsCapitalized(w)):
			uppercase->Increment();
		EmitIntermediate(w, "1");
```

在 worker machine 上面的 counter values 会周期性的传播到 master（ piggybacked on the ping response ）。The master aggregates the counter values from successful map and reduce tasks and returns them to the user code when the MapReduce operation is completed.  当前的 counter values 也会显示在 status page上面，人们可以实时的看到计算过程。当聚合计数器值时，主进程消除相同映射的重复执行或减少任务的影响，以避免重复计数。

## 5. Performance

* 任务1： 在大约 1 TB 数据中查找某个 pattern 下的的数据。
* 任务2： 在大约 1 TB 数据上排序。

### 5.1 Cluster Configuration

### 5.2 Grep

标题的意思就是 UNIX 系统中的 grep 工具。

*grep* 程序扫描 10^10 100-byte records, 查找相对稀少的3字符模式（该模式大约出现 92.337次）。输入数据将切分成大约 64 MB 每份（M = 15000）, 整个程序输出到一个文件（R = 1）。

![Figure2.png](Figure2.png)

### 5.3 Sort

*sort* 程序排序 10^10 100-byte records( 大约 1 TB 数据 )。This program is modeled after the TeraSort benchmark 。

![Figure3.png](Figure3.png)

### 5.4 Effect of Backup Tasks

从Figure3(b) 中可以看到，执行曲线于Figure3(a) 十分类似，但是 Figure3(b) 有一个十分长的尾巴。

### 5.5 Machine Failures

从 Figure 3(c) 中可以看到，在 killed 200 woker之后，隐藏的 cluster scheduler 立即重启了新的 worker processes .

The worker deaths show up as a negative input rate since some previously completed map work disappears (since the corresponding map workers were killed) and needs to be redone.  The re-execution of this map work happens relatively quickly. 

## 6. Experience

It has been used across a wide range of domains within Google, including:

* large-scale machine learning problems,
* clustering problems for the Google News and Froogle products
* extraction of data used to produce reports of popular queries (e.g. Google Zeitgeist),
* extraction of properties of web pages for new experiments and products (e.g. extraction of geographical locations from a large corpus of web pages for localized search), and
* large-scale graph computations.

## 7. Relate Work

## 8. Conclusions





