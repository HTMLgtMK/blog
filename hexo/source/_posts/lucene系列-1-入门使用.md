---
title: lucene系列(1)--入门使用
date: 2019-08-28 19:58:47
tags: lucene
---

## Lucene是什么？

`lucene`是一个`用于全文检索和搜索`的开源Java代码库，由Apache基金会提供支持。

lucene项目官网地址是: [lucene.apache.org](lucene.apache.org)， lucene项目下的软件有：

* *Lucene Core*, our flagship sub-project, provides Java-based indexing and search technology, as well as spellchecking, hit highlighting and advanced analysis/tokenization capabilities.
* *Solr*TM is a high performance search server built using Lucene Core, with XML/HTTP and JSON/Python/Ruby APIs, hit highlighting, faceted search, caching, replication, and a web admin interface.
* [PyLucene](http://lucene.apache.org/pylucene/index.html) is a Python port of the Core project.

<!-- more -->

Lucene vs. Solr： Lucene是一个程序库，Solr是一个完整的程序。

![16275e63278d4ea8.png](16275e63278d4ea8.png)

### 全文索引（Full-text Retrieval）是什么？



## Lucene软件包分析

参考[Luecene软件包分析](https://www.ibm.com/developerworks/cn/java/j-lo-lucene1/index.html)

Lucene软件包的发布形式是一个Jar包。可以直接从官网下载，也可以利用Maven添加依赖。

Jar包文件主要分成以下五类：

* package: org.apache.lucene.document

  ​	这个包提供了一些为封装要索引的文档所需要的类，比如`Document`， `Field`。这样，每个文档被封装成一个Document对象。

* package: org.apache.lucene.analysis

  ​	这个包的主要功能是对文档进行分词，因为文档在建立索引之前必须要进行分词，所以这个包可以看成是为建立索引做准备工作。

* package: org.apache.lucene.index

  ​	这个包提供了一些类来协助创建索引以及对创建好的索引进行更新。这里有两个基础类：`IndexWriter`和`IndexReader`，其中IndexWriter是用于创建索引并添加文档到索引的，IndexReader是用来删除索引中的文档的？？？？

* package: org.apache.lucene.search

  ​	这个包提供了对建立好的索引上进行搜索所需要的类。比如`IndexSearcher`和`Hits`，IndexSearcher定义了在指定的索引上进行搜索的方法，Hits用来保存搜索得到的结果。

  

注：参考的文章比较早(年2006)，而现在的Lucene在不断的更新下部分代码已经不同了，比如IndexSearcher的实现已经不一样了。具体还要查找Lucene 对应版本的文档说明。



## Lucene的入门使用

**思路：**假设我们的电脑目录中有许多的文本文档，我们需要查找哪些文档含有某个关键词。为了实现这个功能，我们首先利用Lucene对这个目录中的文档建立索引，然后在建立好的索引中搜索我们所要查找的文档。

### 1.  建立索引

为了对文档进行索引，Lucene提供了5个基础的类，他们分别是: `Document`, `Field`, `IndexWriter`, `Analyzer`, `Directory`。下面分别介绍这5个类的用途：

* **Document**

  Document是 用来描述文档的，这里的文档可以指一个HTML页面，一封邮件，或者是一个文本文件。一个Document对象由多个Filed ( 域 ) 组成。可以把一个Document对象想象成关系数据库中的一个记录(一行)，而每个Field对象就是记录的一个字段。

* **Field**

  Field对象是用来描述一个Document的某个属性的，比如一封电子邮件的标题和内容可以分别用两个Field描述：Field(Title), Field(Content)。

* **Analyzer**

  在对文档建立索引之前，需要对文档内容进行分词处理，这部分工作由Analyzer来完成。Analyzer是一个抽象类，有多种实现，比如`StandardAnalyzer`。针对不同的语言要选用合适的Analyzer分词。Analyzer把分词后的内容交给IndexWriter来建立索引。

* **IndexWriter**

  IndexWriter是Lucene用来创建索引的一个核心类，他的作用是将一个个Document对象加入到索引中来。

* **Directory**

  这个类表示Lucene的索引的存放的位置，这是一个抽象类，他有两个实现：

  * `FSDirectory`， 表示存放在文件系统(File System)中的索引的位置（需传入`Path`）。
  * `RAMDirecoty`，表示存在在内存(RAM)中的索引的位置，需要其它参数。

下面开始建立索引。

清单1. 对文本文件建立索引

```java
package com.gthncz.lucene_demo1;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Date;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;

public class Indexer {
	
	public Indexer(String indexDirPath, String dataDirPath) throws IOException {
		// indexDir 是存放Lucene的索引文件的目录
		File indexDir = new File(indexDirPath);
		// Directory indexDirectory = new RAMDirectory();
		Directory indexDirectory = FSDirectory.open(indexDir.toPath());
		// dataDir 是存放需要索引的文件的目录
		File dataDir = new File(dataDirPath);
		File[] dataFiles = dataDir.listFiles();
		
		Analyzer luceneAnalyzer = new StandardAnalyzer();
		IndexWriter indexWriter = new IndexWriter(indexDirectory, new IndexWriterConfig(luceneAnalyzer));
		long startTime = new Date().getTime();
		
		for(int i=0; i<dataFiles.length; ++i) {
			if(dataFiles[i].isFile() && dataFiles[i].getName().endsWith(".txt")) {
				System.out.println("Indexing file " + dataFiles[i].getCanonicalPath());
				// TODO perform word segment before indexing.
				Document document = new Document();
				Reader reader = new FileReader(dataFiles[i]);
				document.add(new TextField("path", dataFiles[i].getCanonicalPath(), Field.Store.YES));
				document.add(new TextField("content", reader));
				indexWriter.addDocument(document);
			}
		}
		indexWriter.close();
		long endTime = new Date().getTime();
		
		System.out.println("It takes "+(endTime - startTime) + " milliseconds to create index for the the files in directory " + dataDir.getPath());
	}

}


```

在Lucene 8版本中，IndexWriter的构造函数需要两个参数，第一个是index存放的Directory对象(FSDirectory or RAMDirectory)，第二个是IndexWriterConfig的对象，用于指定使用哪个分词器来分词。接着遍历整个data目录，为每一个文本文档创建一个Document对象，保存path和content Field。最后使用indexWriter将Document对象添加到索引中。

接下来在建立好的索引上进行搜索。

### 2. 搜索文档

参考[搜索文档](https://www.ibm.com/developerworks/cn/java/j-lo-lucene1/index.html)

我们利用上面建立好的索引，搜索包含某个关键词或短语的文档。Lucene提供了几个基础类来完成这个过程，他们分别是`IndexSearcher`, `Term`, `Query`, `TermQuery`, `Hits`. 下面分别介绍这几个类的功能。

* Query

  这个类的目的是把用户输入的查询字符串封装成Lucene能够识别的Query。这是一个抽象类，具有多种实现，如: `TermQuery` , `BooleanQuery`, `PrefixQuery`。

* Term

  Term是搜索的基本单位，一个Term对象有两个String类型的域组成。构造一个Term对象由两个部分完成：Term term = new Term("FieldName", "queryWord); 其中第一个参数代表Document的那个域，第二个参数代表查询关键词。

* TermQuery

  TermQuery是Query的一个实现，也是Lucene支持的最基本的一个查询类。生成一个TermQuery由如下语句生成：TermQuery termQuery = new TermQuery(new Term("fieldName", "queryWord")); 他的构造函数只接受一个Term对象作为参数。

* IndexSearcher

  IndexSearcher是用来在建立好的index上进行搜索的。它只能以**只读**的方式打开一个索引，所以可以有多个IndexSearcher的实例在一个index上进行操作。

* Hits

  Hits是用来保存搜索结果的。

参考的文章是比较老的，Lucene 8有部分代码已经修改，因此添加其它几个类。

* IndexReader

  `IndexReader`是一个抽象类，提供了一个获取索引时间点视角（point-in-time view）的接口。**在Lucene 8中IndexSearcher的构造函数只接受一个IndexReader对象**。他有两种不同类型的IndexReader：

  * `LeafReader`：这种的索引不由几个sub-reader构成，他们是原子的（atomic）。他支持检索存储的Field, doc values, terms, 和  postings.
  * `CompositeReader`：这类Reader的实例（例如`DirectoryReader`）只能用于从底层的LeafReader获取存储的field，但是他不能直接检索postings。如果需要那样做，可用通过`CompositeReader.getSequentialSubReaders`获取sub-readers。

  Index在文件系统时的IndexReader通常DirectoryReader的静态方法构造：`DirectoryReader.open(org.apache.lucene.store.Directory)`。DirectoryReader实现的是CompositeReader接口，不能直接获取postings。 

  为了效率，在这个API中documents通常由*document numbers*代替，每个在索引中的文档都有一个唯一的*non-negative interger*指定。这些document numbers是暂时性的（ephemeral），他们可能在index有改变时（添加或删除document）改变。因此与Clients的Sessions不应该依赖于这个数字。

  注：IndexReader的instance是完全线程安全的（completely thread safe），意味着多线程可以并发的调用它的任何方法。如果你的应用需要外部的同步（synchronization），你不应该同步IndexReader实例。

* DirectoryReader

  `DirectoryReader`是`CompositeReader`的一个实现。他通常由静态方法`open()`构造。

* Collector

  `Collector`的原始意义是用于收集一个查询的原始数据(raw results)，并且实现排序(sorting)或者自定义结果过滤(custom result filtering), collation等。

  Lucene's core collectors起源于`Collector`和`SimpleCollector`. 简单起见你可以使用其中的一个类，或者使用子类例如`TopDocCollector`而不是直接实现Collector。下面是常用的几个子类：

  - `TopDocsCollector` is an abstract base class that assumes you will retrieve the top N docs, according to some criteria, after collection is done. 
  - `TopScoreDocCollector` is a concrete subclass `TopDocsCollector`and sorts according to score + docID. This is used internally by the `IndexSearcher` search methods that do not take an explicit `Sort`. It is likely the most frequently used collector.
  - `TopFieldCollector` subclasses `TopDocsCollector` and sorts according to a specified `Sort` object (sort by field). This is used internally by the `IndexSearcher` search methods that take an explicit `Sort`.
  - `TimeLimitingCollector`, which wraps any other Collector and aborts the search if it's taken too much time.
  - `PositiveScoresOnlyCollector` wraps any other Collector and prevents collection of hits whose score is <= 0.0

* TopScoreDocCollector

  `TopScoreDocCollector`实现了搜集top-scoring hits，返回一个`TopDocs`. 这个类对象用在IndexSearcher方法的基于TopDocs的search方法中。`Hits`按照score降序(descending)并且按照docID升序(ascending)（当他们的score相等时）。这个类通常使用静态方法`TopScoreDocCollector.create(numHits, totalHitsThreshold)` 来创建实例。

  注：`Float.NaN`和`Float.NEGATIVE_INFINITT`并不是一个合理的score。这个collector不能正确的搜集这样score的hits.

清单2：在建立好的索引上进行搜索

```java
package com.gthncz.lucene_demo1;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.FSDirectory;

public class Searcher {
	
	public Searcher(String indexDirPath, String queryString) throws IOException {
		// This is the directory that hosts the Lucene
		File indexDir = new File(indexDirPath);
		FSDirectory directory = FSDirectory.open(indexDir.toPath());
		
		DirectoryReader directoryReader = DirectoryReader.open(directory);
		
		IndexSearcher searcher = new IndexSearcher(directoryReader);
		if(!indexDir.exists()) {
			System.out.println("The Lucene idnex is not exists at " + indexDirPath);
			return;
		}
		Term term = new Term("content", queryString.toLowerCase());
		TermQuery luceneQuery = new TermQuery(term);
		
		// Approach 1
		TopScoreDocCollector collector = TopScoreDocCollector.create(20, 3);
		searcher.search(luceneQuery, collector); // return void
		// Approach 2
		TopDocs docs = searcher.search(luceneQuery, 20);
		ScoreDoc[] scoreDocs = docs.scoreDocs;
		for(ScoreDoc scoreDoc: scoreDocs) {
			System.out.println("Doc" + scoreDoc.doc + " Score " + scoreDoc.score );
		}
		// get the frequency of the term
		int freq = directoryReader.docFreq(term);
		System.out.println("FREQ " + freq);
	}
}
```

跑了下没有效果，因为这里的数据集是中文的，存入每个Document的是一整段文字而不是TokenStream，因此在Indexing之前需要进行Analyzer来分词。

接下来我们讨论各种类型的能在analysis过程中使用到的Analyzer objects以及其他相关的objects。理解这个分析过程并且理解analyzer如何工作将有助于理解Lucene为Document建立索引的新视角。下面是一些我们将用到的对象：

* Token

  `Token`表示一篇文章中具有相关细节（如它的属性）的text或者word。(position,start ofsset, end offset, token type and its position increment).

* TokenStream

  `TokenStream`是一个分析过程的处理结果并且它包含多个Token。他是一个抽象类。

* Analyzer

  `Analyzer`是一个抽象类，是每一种类型的Analyzer的基础类。

* WhitespaceAnalyzer

  `WhitespaceAnalyzer`利用空格(whitespace)分割一篇文章中的text。

* SimpleAnalyzer

  `SimpleAnalyzer`利用非字母字符(non-letter characters)分割一篇文章的text，并且将字母转化为lowercase。

* StopAnalyzer

  `StopAnalyzer`和SimpleAnalyzer类似，并且将一些常用的词语移除，比如‘a’, 'an', 'the'等。

* StandardAnalyzer

  `StandardAnalyzer`是最复杂的一种分析器，并且可以处理一些names, email address等。它将每个token转换为小写字符，并且将公共词语( common words )和标点符号( punctuations )移除。

但是上述是自带的分词器，由于是外国人写的，，，因此没有中文分词。为此，还需另寻他法。

`Ik-Anlyzer`是一款不错的中文分词器，项目地址为: [ik-anlyzer-solr](https://github.com/magese/ik-analyzer-solr). Google 官方fork地址为: [ik-analyzer](https://code.google.com/archive/p/ik-analyzer/). Copy的简介如下:

> >IK Analyzer是一个开源的，基于java语言开发的轻量级的中文分词工具包。从2006年12月推出1.0版开始， IKAnalyzer已经推出了4个大版本。最初，它是以开源项目Luence为应用主体的，结合词典分词和文法分析算法的中文分词组件。从3.0版本开始，IK发展为面向Java的公用分词组件，独立于Lucene项目，同时提供了对Lucene的默认优化实现。在2012版本中，IK实现了简单的分词歧义排除算法，标志着IK分词器从单纯的词典分词向模拟语义分词衍化。*

使用maven将ik-analyzer加入项目作为依赖:

```maven
<!-- Maven仓库地址 -->
<dependency>
    <groupId>com.github.magese</groupId>
    <artifactId>ik-analyzer</artifactId>
    <version>8.1.1</version>
</dependency>
```

其中，可能需要修改配置文件`IKAnalyzer.cfg.xml`或者`stopword.dic`, `ext.dic`，这里需要在jar包内替换，利用`jar -uf jar-file <folder-name>/new-file`。

简单的`IKAnalyzer`Demo：

```java
package com.gthncz;

import java.io.IOException;
import java.io.StringReader;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.wltea.analyzer.lucene.IKAnalyzer;

/**
 * 测试 IKAnalyzer 
 * @author gt
 *
 */
public class IKAnalyzerTest {
	
	public static void main(String[] argv) {
		new IKAnalyzerTest();
	}
	
	public IKAnalyzerTest() {
		String text = "玩了一会和平精英，运行流畅，温度控制的还不错，就是希望日后再优化一下游戏，为什么测试时帧率能到极限，而实用时只能超高。前几天才预购，今天上午就发货，下午三点就拿到了，感谢商家能让我这么早体验到新机。玩王者荣耀应该更没问题了，绝对可以完美运行高帧率。目前整机还没发现什么bug，应该是值得购买的。";
		StringReader stringReader = new StringReader(text);
		Analyzer analyzer = new IKAnalyzer(true); // useSmart = false
		TokenStream tokenStream = analyzer.tokenStream("content", stringReader);
		CharTermAttribute charTermAttribute = tokenStream.addAttribute(CharTermAttribute.class);
		
		try {
			tokenStream.reset(); // 需要这个， 不然会报错误：  java.lang.IllegalStateException: TokenStream contract violation: reset()/close() call missing, reset() called multiple times, or subclass does not call super.reset().
			while(tokenStream.incrementToken()) {
				System.out.print(charTermAttribute.toString() + "|");
			}
			/** 结果输出
			 * 加载扩展词典：ext.dic
			 * 加载扩展停止词典：stopword.dic
			 * 玩了|一会|和平|精英|运行|流畅|温度|控制|还不|不错|希望|望日|日后|再|优化|一下|下游|下|游戏|测试|时|帧率|能到|极限|实用|用时|只能|超高|前几天|几天|天才|预购|今天上午|今天|天上|上午|发货|下午|三点|点|就拿到|就拿|拿到|到了|感谢|商家|能让|早|体验到|体验|新机|玩|王者|荣耀|应该|更没|没问题|问题|题了|完美|运行|高|帧率|目前|整机|还没|发现|bug|应该是|应该|该是|值得|购买|
			 */
		} catch (IOException e) {
			e.printStackTrace();
		}
		analyzer.close();
		stringReader.close();
	}
}

```

在上述的`Indexer.java`文件中，只需要将`new StandardAnalyzer();`替换成 `new IKAnalyzer();`即可，如下:

```java
// Analyzer luceneAnalyzer = new StandardAnalyzer();
Analyzer luceneAnalyzer = new IKAnalyzer();
```

执行结果如下：（搜索词为`童话`）

```text
Indexing file /home/gt/Documents/python/NLP/DMSC/复仇者联盟2_小陈同学_2015-11-08.txt
Indexing file /home/gt/Documents/python/NLP/DMSC/复仇者联盟2_健_2015-04-24.txt
Indexing file /home/gt/Documents/python/NLP/DMSC/复仇者联盟2_冯冯啊_2016-04-03.txt
Indexing file /home/gt/Documents/python/NLP/DMSC/复仇者联盟2_嘎嘣脆的过去_2015-05-12.txt
Indexing file /home/gt/Documents/python/NLP/DMSC/复仇者联盟2_Jocelyn_2015-04-26.txt
Indexing file /home/gt/Documents/python/NLP/DMSC/复仇者联盟2_自由客_2015-05-16.txt
... # 省略
Indexing file /home/gt/Documents/python/NLP/DMSC/大鱼海棠_  记不住_2016-10-18.txt
Indexing file /home/gt/Documents/python/NLP/DMSC/大鱼海棠_想上树的猴宝宝_2016-07-27.txt
It takes 15873 milliseconds to create index for the the files in directory /home/gt/Documents/python/NLP/DMSC
Doc282716 Score 5.272542
Doc300002 Score 5.272542
Doc382717 Score 5.272542
Doc400003 Score 5.272542
Doc299351 Score 5.1232853
Doc399352 Score 5.1232853
Doc261312 Score 5.024147
Doc280026 Score 5.024147
Doc291235 Score 5.024147
Doc361313 Score 5.024147
Doc380027 Score 5.024147
Doc391236 Score 5.024147
Doc280388 Score 4.908524
Doc286610 Score 4.908524
Doc380389 Score 4.908524
Doc386611 Score 4.908524
Doc482718 Score 4.908524
Doc500004 Score 4.908524
Doc582719 Score 4.908524
Doc600005 Score 4.908524
FREQ 364
```

### 总结

在这边文章中，我学习了Lucene的入门使用，包括如何创建索引，如何利用索引搜索，如何利用Analyzer进行分词。

下一步学习目标：

1. 学习lucene内部创建索引的逻辑
2. 学习lucene内部利用索引搜索文档，如何评分
3. 学习分词器内部分词方法