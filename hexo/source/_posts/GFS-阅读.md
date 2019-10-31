---
title: GFS 阅读
date: 2019-10-28 20:23:36
tags: GFS
---

本篇文章主要记录阅读论文 *The Google File System* 的 Point。

## 1. Introduction

1. First, component failures are the norm rather than the exception.

   Therefore, constant monitoring, error detection, fault tolerance, and automatic recovery must be integral to the system.

2. Second, files are huge by traditional standards. 

   * Multi-GB files are common. 

   * Billions of objects such as web documents with KB-sized.

   As a result, design assumptions and parameters such as I/O operation and block sizes have to be revisited.

   <!-- more -->

3.  Third,  most files are mutated by appending new data rather than overwriting existing data.

   Given this access pattern on huge files, appending becomes the focus of performance optimization and atomicity guarantees, while caching data blocks in the client loses its appeal

4. Fourth,  co-designing the applications and the file system API benefits the overall system by increasing our flexibility.

## 2. Design Overview

### 2.1 Detailed Assumption

1. The system is built from many inexpensive commodity components that often fail.
2. The system stores a modest number of large files.
3. The workloads primarily consist of two kinds of reads: large streaming reads and small random reads. 
4. The workloads also have many large, sequential writes that append data to files. 
5. The system must efficiently implement well-defined semantics for multiple clients that concurrently append to the same file. (Automicity with minimal synchronization.)
6. High sustained bandwidth is more important than low latency.

### 2.2 Interface

GFS provides a familiar file system interface. Files are organized hierarchically in directories and identified by *pathnames*. We support the usual operations to *createa*, *delete*, *open*, *close*, *read*, and *write* files.

Moreover, GFS has *snapshot* and *record append* operations.

### 2.3 Architecture

A GFS cluster consists of a *single master* and *multiple chunkservers* and is accessed by *multiple clients*, as shown in Figure 1.

![GFS-Architectture.png](GFS-Architectture.png)

Files are divided into fixed-size *chunks*. Each chunk is identified by an immutable and globally unique 64 bit *chunk handle* assigned by the master at the time of chunk creation. Chunkservers store chunks on local disks as Linux files. For reliability, each chunk is replicated on multiple chunkservers. 

The master maintains all file system metadata. This includes the namespace, access control information, the mapping from files to chunks, and the current locations of chunks The master periodically communicates with each chunkserver in *HeartBeat messages* to give it instructions and collect its state

GFS  Clients interact with the master for metadata operations, but all data-bearing communication goes directly to the chunkservers.

Neither the client nor the chunkserver caches file data.  Not having them simplifies the client and the overall system by eliminating cache coherence issues. (Clients do cache metadata, however.)

### 2.4 Single Master

Explanation of the interactions for a simple read with reference Figure 1.

### 2.5 Chunk Size

We choose 64 MB.  A large chunk size offers several important advantages.

1. First, it reduces clients’ need to interact with the master.
2.  Second, since on a large chunk, a client is more likely to perform many operations on a given chunk, it can reduce network overhead by keeping a persistent TCP connection to the chunkserver over an extended period of time. 
3. Third, it reduces the size of the metadata stored on the master.

Disadvantage: Chunkserver hot spots.

### 2.6 Metadata

The master stores three major types of metadata: 

* the file and chunk namespaces, 
* the mapping from files to chunks,  ( file-to-chunk mapping )
* and the locations of each chunk’s replicas.

The first two types (namespaces and file-to-chunk mapping) are also kept persistent by *logging* mutations to an *operation* log stored on the master’s local disk and replicated on remote machines.

The master does not store chunk location information persistently. Instead, it asks each chunkserver about its chunks at master startup and whenever a chunkserver joins the cluster.

#### 2.6.1 *In-Memory* Data Structures

#### 2.6.2 Chunk Locations

#### 2.6.3 *Operation Log*

###  2.7 Consistency Model

GFS has a relaxed consistency model.

#### 2.7.1 *Guarantee by GFS*

File namespace mutations (e.g., file creation) are atomic. They are handled exclusively by the master: namespace locking guarantees atomicity and correctness (Section 4.1); the master’s operation log defines a global total order of these operations (Section 2.6.3).

![File-Region-State.png](File-Region-State.png)

Data mutations: *Writes*, *Record Appends*.

File region state after mutation:

* *consistent*: t if all clients will always see the same data, regardless of which replicas they read from.
* *defined*: if it is consistent and clients will see what the mutation writes in its entirety.

GFS guarantee the mutated file region ( to be defined and contain the data writen by the last mutation ) by:

​	(a)  applying mutations to a chunk in the same order on all its replicas (Section 3.1), and

​	(b)   using chunk version numbers to detect any replica that has become stale because it has missed mutations while its chunkserver was down (Section 4.5).

 GFS identifies failed chunkservers by regular handshakes between master and all chunkservers and detects data corruption by checksumming (Section 5.2).

#### 2.7.2 *Implications of Applications*

Some simple techniques:   relying on appends rather than overwrites, checkpointing, and writing self-validating, self-identifying records.

 Readers deal with the occasional padding and duplicates as follows. Each record prepared by the writer contains extra information like checksums so that its validity can be verified. A reader can identify and discard extra padding and record fragments using the checksums. 

## 3. SYSTEM INTERACTIONS

 we now describe how the client, master, and chunkservers interact to implement data mutations, atomic record append, and snapshot.

### 3.1 Leases and Mutation Order

We use leases to maintain a consistent mutation order across replicas.  The master grants a chunk lease to one of the replicas, which we call the *primary*. The primary picks a serial order for all mutations to the chunk. All replicas follow this order when applying mutations. Thus, the global mutation order is defined first by the lease grant order chosen by the master, and within a lease by the serial numbers assigned by the primary.

The lease mechanism is designed to minimize management overhead at the master.  A lease has an initial timeout of 60 seconds.

The leases machanism illustration:

![Write-Control-and-data-Flow.png](Write-Control-and-data-Flow.png)

1. The client asks the master which chunkserver holds the current lease for the chunk and the locations of the other replicas. If no one has a lease, the master grants one to a replica it chooses (not shown).
2. The master replies with the identity of the primary and the locations of the other (secondary) replicas. The client caches this data for future mutations. It needs to contact the master again only when the primary becomes unreachable or replies that it no longer holds a lease.
3. The client pushes the data to all the replicas. A client can do so in any order. Each chunkserver will store the data in an internal LRU buffer cache until the data is used or aged out.
4. Once all the replicas have acknowledged receiving the data, the client sends a write request to the primary. The request identifies the data pushed earlier to all of the replicas. The primary assigns consecutive serial numbers to all the mutations it receives, possibly from multiple clients, which provides the necessary serialization. It applies the mutation to its own local state in serial number order.
5. The primary forwards the write request to all secondary replicas. Each secondary replica applies mutations in the same serial number order assigned by the primary.
6. . The secondaries all reply to the primary indicating that they have completed the operation.  
7. The primary replies to the client. Any errors encountered at any of the replicas are reported to the client. In case of errors, the write may have succeeded at the primary and an arbitrary subset of the secondary replicas. (If it had failed at the primary, it would not have been assigned a serial number and forwarded.) The client request is considered to have failed, and the modified region is left in an inconsistent state. Our client code handles such errors by retrying the failed mutation. It will make a few attempts at steps (3) through (7) before falling back to a retry from the beginning of the write.

### 3.2 Data Flow

We decouple the flow of data from the flow of control to use the network efficiently.  While control flows from the client to the primary and then to all secondaries, data is pushed linearly along a carefully picked chain of chunkservers in a pipelined fashion.

1. To fully utilize each machine’s network bandwidth, the data is pushed linearly along a chain of chunkservers rather than distributed in some other topology .
2. To avoid network bottlenecks and high-latency links (e.g., inter-switch links are often both) as much as possible, each machine forwards the data to the “closest” machine in the network topology that has not received it.
3. Finally, we minimize latency by pipelining the data transfer over TCP connections.

### 3.3 Atomic Record Appends

GFS provides an atomic append operation called *record append*.

In a record append, however, the client specifies only the data. GFS appends it to the file at least once atomically (i.e., as one continuous sequence of bytes) at an offset of GFS’s choosing and returns that offset to the client. This is similar to writing to a file opened in O-APPEND mode in Unix. 

If a record append fails at any replica, the client retries the operation. As a result, replicas of the same chunk may contain different data possibly including duplicates of the same record in whole or in part. GFS only guarantees that the data is written at least once as an atomic unit.

### 3.4 Snapshot

The snapshot operation makes a copy of a file or a directory tree (the “source”) almost instantaneously, while minimizing any interruptions of ongoing mutations.

Like AFS [5], we use standard **copy-on-write** techniques to implement snapshots.  When the master receives a snapshot request, it first revokes any outstanding leases on the chunks in the files it is about to snapshot. This ensures that any subsequent writes to these chunks will require an interaction with the master to find the lease holder. This will give the master an opportunity to create a new copy of the chunk first.

After the leases have been revoked or have expired, the master logs the operation to disk. It then applies this log record to its in-memory state by duplicating the metadata for the source file or directory tree. The newly created snapshot files point to the same chunks as the source files.

The first time a client wants to write to a chunk C after the snapshot operation, it sends a request to the master to find the current lease holder. The master notices that the reference count for chunk C is greater than one. It defers replying to the client request and instead picks a new chunk handle C’. It then asks each chunkserver that has a current replica of C to create a new chunk called C’. By creating the new chunk on the same chunkservers as the original, we ensure that the data can be copied locally, not over the network.

## 4. MASTER OPERATION

The master executes all namespace operations. In addition, it manages chunk replicas throughout the system: it makes placement decisions, creates new chunks and hence replicas, and coordinates various system-wide activities to keep chunks fully replicated, to balance load across all the chunkservers, and to reclaim unused storage.

### 4.1 Namespace Management and Locking

 Each node in the namespace tree has an associated read-write lock. Each master operation acquires a set of locks before it runs.

**Example**:  how this locking mechanism can prevent a file **/home/user/foo** from being created while **/home/user** is being snapshotted to **/save/user**.

1. The spanshot operation: 

   * Read lock:  **/home**, **/save**
   * Write lock: **/home/user**, **/save/user**

2. The file creation:

   * Read lock: **/home**, **/home/user**
   * Write lock: **/home/user/foo**

   File creation does not require a write lock on the parent directory. The read lock on the name is sufficient to protect the paren  directory from deletion. 

   The read lock on the directory name suffices to prevent the directory from being deleted, renamed, or snapshotted.

3. Since the namespace can have many nodes, read-write lock objects are allocated lazily and deleted once they are not in use. Also, locks are acquired in a consistent total order to prevent deadlock: they are first ordered by level in the namespace tree and lexicographically within the same level.

### 4.2 Replica Placement

The chunk replica placement policy serves two purposes: maximize data reliability and availability, and maximize network bandwidth utilization.

We must also spread chunk replicas across racks. This ensures that some replicas of a chunk will survive and remain available even if an entire rack is damaged or offline.

It also means that traffic, especially reads, for a chunk can exploit the aggregate bandwidth of multiple racks. On the other hand, write traffic has to flow through multiple racks, a tradeoff we make willingly.

### 4.3 Creation, Re-replication, Rebalancing

Chunk replicas are created for three reasons: chunk creation, re-replication, and rebalancing.

When the master *creates* a chunk, it considers several factors:

1.  equalizing disk space utilization,
2.  limiting active write/clone operations on any single chunkserver,
3.  spreading replicas across racks.

The master *re-replicates* a chunk as soon as the number of available replicas falls below a user-specified goal. This could happen for various reasons:

* a chunkserver becomes unavailable, 
* it reports that its replica may be corrupted, 
* one of its disks is disabled because of errors,
*  or the replication goal is increased.

Each chunk that needs to be re-replicated is prioritized based on several factors:

* One is how far it is from its replication goal.( lost two replicas > lost only one )
*  we prefer to first re-replicate chunks for live files as opposed to chunks that belong to recently deleted files
* boost the priority of any chunk that is blocking client progress  ( to minimize the impact of failures on running applications )   

Finally, the master *rebalances* replicas periodically: it examines the current replica distribution and moves replicas for better disk space and load balancing.

### 4.4 Garbage Collection

#### 4.4.1 *Mechanism*

When a file is deleted by the application, the master logs the deletion immediately just like other changes.  

However instead of reclaiming resources immediately, the file is just renamed to a hidden name that includes the deletion timestamp.

During the master’s regular scan of the file system namespace, it removes any such hidden files if they have existed for more than three days (the interval is configurable) .

Until then, the file can still be read under the new, special name and can be undeleted by renaming it back to normal.

When the hidden file is removed from the namespace, its in-memory metadata is erased. 

#### 4.4.2 *Discussion*

We can easily identify all references to chunks: they are in the file-to-chunk mappings maintained exclusively by the master. We can also easily identify all the chunk replicas: they are Linux files under designated directories on each chunkserver. Any such replica not known to the master is “garbage.”

### 4.5 Stale Replica Detection

Chunk replicas may become stale if a chunkserver fails and misses mutations to the chunk while it is down. For
each chunk, the master maintains a ***chunk version number*** to distinguish between **up-to-date** and **stale** replicas.

Whenever the master grants a new lease on a chunk, it increases the chunk version number and informs the up-to-date replicas. The master and these replicas all record the new version number in their persistent state. 

The master removes stale replicas in its regular garbage collection.

As another safeguard, the master includes the chunk version number when it informs clients which chunkserver holds a lease on a chunk or when it instructs a chunkserver to read the chunk from another chunkserver in a cloning operation. The client or the chunkserver verifies the version number when it performs the operation so that it is always accessing up-to-date data.

## 5. FAULT TOLERANCE AND DIAGNOSIS

" we cannot completely trust the machines, nor can we completely trust the disks."

### 5.1 Hign Availability

We keep the overall system highly available with two simple yet effective strategies: **fast recovery** and **replication**.

#### 5.1.1 *Fast Recovery*

Both the master and the chunkserver are designed to restore their state and start in seconds no matter how they terminated. 

#### 5.1.2 *Chunk Replication*

Each chunk is replicated on multiple chunkservers on different racks.  Users can specify different replication levels for different parts of the file namespace. The default is three.

#### 5.1.3 *Master Replication*

The master state is replicated for reliability.  Its operation log and checkpoints are replicated on multiple machines.

If its machine or disk fails, monitoring infrastructure outside GFS starts a new master process elsewhere with the replicated operation log. Clients use only the canonical name of the master (e.g. gfs-test), which is a DNS alias that can be changed if the master is relocated to another machine.

Moreover, “shadow” masters provide read-only access to the file system even when the primary master is down.

To keep itself informed, a shadow master reads a replica of the growing operation log and applies the same sequence of changes to its data structures exactly as the primary does. Like the primary, it polls chunkservers at startup (and infrequently thereafter) to locate chunk replicas and exchanges frequent handshake messages with them to monitor their status. It depends on the primary master only for replica location updates resulting from the primary’s decisions to create and delete replicas.

### 5.2 Data Integrity

Each chunkserver uses checksumming to detect corruption of stored data. 

Each chunkserver must independently verify the integrity of its own copy by maintaining checksums. 

A chunk is broken up into 64 KB blocks. Each has a corresponding 32 bit checksum.  Like other metadata, checksums
are kept in memory and stored persistently with logging, separate from user data.

For reads, the chunkserver verifies the checksum of data blocks that overlap the read range before returning any data to the requester, whether a client or another chunkserver. If a block does not match the recorded checksum, the chunkserver returns an error to the requestor and reports the mismatch to the master. In response, the
requestor will read from other replicas, while the master will clone the chunk from another replica.   After a valid new
replica is in place, the master instructs the chunkserver that reported the mismatch to delete its replica.

Append operation Checksum computation: We just incrementally update the checksum for the last partial checksum block, and compute new checksums for any brand new checksum blocks filled by the append.

Overwrite operation Checksum computation:   we must read and verify the first and last blocks of the range being overwritten, then perform the write, and finally compute and record the new checksums.

During idle periods, chunkservers can scan and verify the contents of inactive chunks. . This allows us to detect corruption in chunks that are rarely read.

### 5.3 Diagnostic Tools

Extensive and detailed diagnostic logging has helped immeasurably in problem isolation, debugging, and performance analysis, while incurring only a minimal cost.

## 6. MEASUREMENTS

### 6.1 Micro-benchmarks

Env( A GFS cluster ): one master, two master replicas, 16 chunkservers, 16 clients.

All the machines: dual 1.4 GHz PIII processors, 2 GB  of memory, two 80 GB 5400 rpm disks, and 100Mbps full-duplex Ethernet connection to an HP 2524 switch. 

All 19 GFS server machines are connected to one switch, and all 16 client machines to the other. The two switches are connected with a 1 Gbps link.

#### 6.1.1 *Reads*

N clients read simultaneously from the file system. Each client reads a randomly selected 4 MB region from a 320 GB file set. This is repeated 256 times so that each client ends up reading 1 GB of data.

#### 6.1.2 *Writes*

N clients write simultaneously to N distinct files.  Each client writes 1 GB of data to a new file in a series of 1 MB writes.

#### 6.1.3 *Record Appends*

N clients append simultaneously to a single file.

![figure3.png](figure3.png)

### 6.2 Real World Clusters

Two clusters in use within Google:

Cluster A is used regularly for research and development by over a hundred engineers. A typical task is initiated by a human user and runs up to several hours. It reads through a few MBs to a few TBs of data, transforms or analyzes the data, and writes the results back to the cluster. 

Cluster B is primarily used for production data processing. The tasks last much longer and continuously generate and process multi-TB datasets with only occasional human intervention. 

A single ""task: many processes on many machines reading and writing many files simultaneously.

![Table2.png](Table2.png)

#### 6.2.1 *Storage*

#### 6.2.2 *Metadata*

#### 6.2.3 *Read and Write Rate*

![Table3.png](Table3.png)

#### 6.2.4 Master Load

#### 6.2.5  *Recovery Time*

### 6.3 Workload Breakdown

Cluster X is for research and development while cluster Y is for production data processing.

#### 6.3.1 *Methodology and Caveats*

#### 6.3.2 *Chunkserver Workload* 

#### 6.3.3 *Appends versus Writers*

#### 6.3.4 *Master Workload*

## 7. EXPERIENCES

We opt for the centralized approach in order to simplify the design, increase its reliability, and gain flexibility. In particular, a centralized master makes it much easier to implement sophisticated chunk placement and replication policies since the master already has most of the relevant information and controls how it changes. We address fault tolerance by keeping the master state small and fully replicated on other machines. Scalability and high availability (for reads) are currently provided by our shadow master mechanism. Updates to the master state are made persistent by appending to a write-ahead log. Therefore we could adapt a primary-copy scheme like the one in Harp [7] to provide high availability with stronger consistency guarantees than our current scheme.

## 8. RELATED WORK

## 9. CONCLUSIONS





