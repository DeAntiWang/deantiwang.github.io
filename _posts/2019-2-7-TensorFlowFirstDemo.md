---
layout: post
title: 'TensorFlow学习笔记：第一个Demo——线性回归'
date: 2019-2-5 
description: "学习笔记，TensorFlow，线性回归"
tag: 学习笔记
--- 

> 借鉴于戈云飞的文章：[TensorFlow入门：第一个机器学习Demo](https://blog.csdn.net/geyunfei_/article/details/78782804)

![TensorFlow](../../../images/posts/tensorflow/0.png)

TensorFlow是Google Inc.开源的人工智能神器。  

> TensorFlow™ 是一个采用数据流图（data flow graphs），用于数值计算的开源软件库。节点（Nodes）在图中表示数学操作，图中的线（edges）则表示在节点间相互联系的多维数据数组，即张量（tensor）。它灵活的架构让你可以在多种平台上展开计算，例如台式计算机中的一个或多个CPU（或GPU），服务器，移动设备等等。TensorFlow 最初由Google大脑小组（隶属于Google机器智能研究机构）的研究员和工程师们开发出来，用于机器学习和深度神经网络方面的研究，但这个系统的通用性使其也可广泛用于其他计算领域.

# 基础知识

## Tensor

Tensor 即 张量，其建立在标量与矢量之上，是矢量的推广，矢量是一阶张量。张量是一个可用来表示在一些矢量、标量和其他张量之间的线性关系的多线性函数。  
我们可以先将其理解为多维数组：

```python
3									# 0阶张量，即标量，shape=0
[1., 2., 3.]						# 1阶张量，即矢量，shape=[2]
[[1., 2., 3.], [4., 5., 6.]]		# 2阶张量，二维数组，shape=[2, 3]
[[[1., 2., 3.]], [[7., 8., 9.]]]	# 3阶张量，三维数组，shape=[2, 1, 3]
```

TensorFlow中用Tensor类的实例来表示张量，其有**dtype和shape**两个属性  

- dtype：数据类型，值例如tf.float32，tf.int64, tf.string
- shape：多维数组中每个维度的数组中元素的个数

***

理解Tensor：

```python
import tensorflow as tf

t0 = tf.constant(3, dtype=tf.int32)
t1 = tf.constant([3., 4.1, -.2], dtype=tf.float32)
t2 = tf.constant([['A', 'B'], ['C', 'D']], dtype=tf.string)
t3 = tf.constant([[[1, 3]], [[5, 7]]])

print(t0)
print(t1)
print(t2)
print(t3)
```

运行结果

```python
Tensor("Const:0", shape=(), dtype=int32)
Tensor("Const_1:0", shape=(3,), dtype=float32)
Tensor("Const_2:0", shape=(2, 2), dtype=string)
Tensor("Const_3:0", shape=(2, 1, 2), dtype=int32)
```

可见t0是0阶张量（标量），t1是1阶张量（向量），t2、t3分别为二阶、三阶张量。使用print函数只能打印出一个Tensor的属性定义，若想查看某个Tensor的值，需要使用Session：

```python
sess = tf.Session()
print(sess.run(t0))
print(sess.run(t1))
print(sess.run(t2))
print(sess.run(t3))
```

运行结果：

```python
3						# t0
[ 3.   4.1 -0.2]		# t1
[[b'A' b'B']			# t2
 [b'C' b'D']]
[[[1 3]]				# t3

 [[5 7]]]
```

## Dataflow Graph

Dataflow Graph 即 数据流图，数据流图的每个节点都是用 tf.Tensor 的实例来表示的。  
![Dataflow Graph](http://www.tensorfly.cn/images/tensors_flowing.gif)
数据流是一种常用的并行计算编程模型，数据流图是由**节点(nodes)和线(edges)**构成的有向图  

- Nodes：节点，计算单元或是输入的起点、输出的终点
- Edges：线，用来展示节点之间的输入/输出关系

下图是线性回归Demo的Dataflow Graph：

![线性回归数据流图](../../../images/posts/tensorflow/1.png)

## Session

> 我们在Python中需要做一些计算操作时一般会使用NumPy，NumPy在做矩阵操作等复杂的计算的时候会使用其他语言(C/C++)来实现这些计算逻辑，来保证计算的高效性。但是频繁的在多个编程语言间切换也会有一定的耗时，如果只是单机操作这些耗时可能会忽略不计，但是如果在分布式并行计算中，计算操作可能分布在不同的CPU、GPU甚至不同的机器中，这些耗时可能会比较严重。 
> TensorFlow 底层是使用C++实现，这样可以保证计算效率，并使用 tf.Session类来连接客户端程序与C++运行时。上层的Python、Java等代码用来设计、定义模型，构建的Graph，最后通过tf.Session.run()方法传递给底层执行。
> ***
> 作者：戈云飞 
> 来源：CSDN 
> 原文：https://blog.csdn.net/geyunfei_/article/details/78782804 

# TensorFlow的安装

博主使用的系统是Mac OS X，在此只说一下Mac环境下的TensorFlow安装。  
TensorFlow的安装分为CPU版本与GPU版本，Mac的Intel HD Graphics 5000图像卡中没有GPU，故在此简单的说一下CPU版本的安装：  
TensorFlow拥有多个语言支持，其中对Python语言的支持比较成熟，且Python适用于数据计算。  
使用homebrew进行Python安装**（注意：TensorFlow暂不支持Python3.7，安装时请选择3.6版本）**：

```bash
$ brew install python
```

并使用pip3(python3)安装tensorflow：

```bash
$ pip3 install tensorflow
```

以上过程比较漫长，经常会TimeOut。若出现超时情况，请使用清华镜像源安装TensorFlow：

```bash
$ pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple/ --upgrade tensorflow
```

以上，TensorFlow安装完毕。

Jupyter Notebook（IPython）在交互式计算中是不可或缺的工具，推荐安装：

```bash
$ pip3 install jupyter
```

运行jupyter-notebook:

```bash
$ jupyter-notebook
```

# TensorFlow实例

在本文中我们用一个Demo来入门TensorFlow机器学习——对一些离散数据进行**线性回归**得到直线方程

## 建立模型

假设我们有如下离散数据：

|   x   |    y   |
| :---: | :----: |
|   1   |   4.8  |
|   2   |   8.5  |
|   3   |  10.4  |
|   6   |    21  |
|   8   |  25.3  |

坐标系中如图：
![](https://img-blog.csdn.net/20171212160953764?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ2V5dW5mZWlf/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

我们要对其进行线性回归，则建立线性数学模型：

$$ y = W * x + b $$

那么如何评估我们线性回归出来的直线方程呢？我们需要建立一个**损失模型（loss modl）**来评估模型的合理性：

$$ loss = \Sigma_{n=1}^{N}(y_{n}-y'_{n})^2 $$

![loss model](https://img-blog.csdn.net/20171213202510322?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ2V5dW5mZWlf/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

将该两个模型在TensorFlow中实现：

```python
import tensorflow as tf

# 数据
x_train = [1., 2., 3., 6., 8.]
y_train = [4.8, 8.5, 10.4, 21.0, 25.3]

# 创建W与b节点（变量）并赋初值
W = tf.Variable([.1], dtype=tf.float32)
b = tf.Variable([-.1], dtype=tf.float32)

# 创建x与y节点
x = tf.placeholder(tf.float32)
y = tf.placeholder(tf.float32)

# 线性模型
linear_model = W * x + b
# 损失模型
loss = tf.reduce_sum(tf.square(linear_model - y))

sess = tf.Session()
# 初始化变量
init = tf.global_variables_initializer()
sess.run(init)

# 输出结果
print(sess.run(linear_model, {x: x_train}))
# 损失评估
print(sess.run(loss, {x: x_train, y: y_train}))
```

运行输出：

```python
[0.         0.1        0.20000002 0.5        0.7       ]
1223.0499
```

可见程序输出与期望值差距很大，损失值也很大。那么我们可以调整W与b的值来缩小损失值：

```python
fixW = tf.assign(W, [2.])
fixB = tf.assign(b, [1.])
sess.run([fixW, fixB])
print(sess.run(loss, {x: x_train, y: y_train}))
```

运行后发现损失值减小成了159.93999，比之前少很多。那么我们可以通过不断的调整W和b的值来使损失值不断缩小。但是这是一个人力耗费特别大，特别费时间的过程。TensorFlow提供了训练模型的方法，来自动帮我们训练模型。

## 训练模型

TensorFlow 提供了很多优化算法来帮助我们训练模型。最简单的优化算法是梯度下降(Gradient Descent)算法，它通过不断的改变模型中变量的值，来找到最小损失值：

```python
import tensorflow as tf

# 数据
x_train = [1., 2., 3., 6., 8.]
y_train = [4.8, 8.5, 10.4, 21.0, 25.3]

# 创建W与b节点（变量）并赋初值
W = tf.Variable([.1], dtype=tf.float32)
b = tf.Variable([-.1], dtype=tf.float32)

# 创建x与y节点
x = tf.placeholder(tf.float32)
y = tf.placeholder(tf.float32)

# 线性模型
linear_model = W * x + b
# 损失模型
loss = tf.reduce_sum(tf.square(linear_model - y))

# 建立梯度下降训练模型
optimizer = tf.train.GradientDescentOptimizer(0.001)
train = optimizer.minimize(loss)

sess = tf.Session()
# 初始化变量
init = tf.global_variables_initializer()
sess.run(init)

# 进行训练
for i in range(10000):
    sess.run(train, {x: x_train, y: y_train})

print("W: %s\nb: %s\nloss: %s" % (sess.run(W), sess.run(b), sess.run(loss, {x: x_train, y: y_train})))
```

运行输出：

```python
W: [2.982361]
b: [2.0705438]
loss: 2.1294134
```

此时损失值已经很小了，已经比较贴合我们的期望值了，则得到的线性回归方程为：
$$ y = 2.982361 * x + 2.0705438 $$

## TensorFlow高级训练模型

**tf.estimator**是TensorFlow提供的高级库，提供了很多常用的模型，可以简化机器学习中的很多训练过程，如：

- 运行训练评估
- 运行评估循环
- 管理训练数据集

### LinearRegressor

tf.estimator中提供了线性回归的训练模型**tf.estimator.LinearRegressor**。使用LinearRegressor训练评估模型更方便：

```python
import tensorflow as tf
import numpy as np

# 训练数据
x_train = np.array([1., 2., 3., 6., 8.])
y_train = np.array([4.8, 8.5, 10.4, 21.0, 25.3])

# 评估数据
x_eval = np.array([2., 5., 7., 9.])
y_eval = np.array([7.6, 17.2, 23.6, 28.8])

# 特征向量表
feature_columns = [tf.feature_column.numeric_column("x", shape=[1])]

# 创建LinearRegressor训练器并传入特征向量表
estimator = tf.estimator.LinearRegressor(feature_columns=feature_columns)

# 输入模型
train_input_fn = tf.estimator.inputs.numpy_input_fn(
    {"x": x_train}, y_train, batch_size=2, num_epochs=None, shuffle=True
)
train_input_fn_2 = tf.estimator.inputs.numpy_input_fn(
    {"x": x_train}, y_train, batch_size=2, num_epochs=1000, shuffle=False
)
eval_input_fn = tf.estimator.inputs.numpy_input_fn(
    {"x": x_eval}, y_eval, batch_size=2, num_epochs=1000, shuffle=False
)

# 训练1000次
estimator.train(input_fn=train_input_fn, steps=1000)

# 使用两组数据分别评估模型
train_metrics = estimator.evaluate(input_fn=train_input_fn_2)
eval_metrics = estimator.evaluate(input_fn=eval_input_fn)
print("train metrics: %r" % train_metrics)
print("eval metrics: %s" % eval_metrics)
```

运行输出:

```python
train metrics: {'average_loss': 0.4833329, 'label/mean': 13.999993, 'loss': 0.9666658, 'prediction/mean': 14.124545, 'global_step': 1000}
eval metrics: {'average_loss': 0.287943, 'label/mean': 19.299805, 'loss': 0.575886, 'prediction/mean': 19.205923, 'global_step': 1000}
```

可见评估数据的损失量比训练数据要小，说明得到的模型的泛化性能很好。

## 自定义Estimator模型

我们可以通过实现**tf.estimator.Estimator**的子类来构建我们自己的训练模型。例如我们可以给Estimator基类提供一个model_fn的实现，来定义我们自己的训练模型、评估方法和损失模型。

```python
import tensorflow as tf
import numpy as np


def model_fn(features, labels, mode):
    # 线性模型
    W = tf.get_variable("W", [1], dtype=tf.float64)
    b = tf.get_variable("b", [1], dtype=tf.float64)
    y = W * features['x'] + b
    # 损失模型
    loss = tf.reduce_sum(tf.square(y - labels))
    # 训练模型
    global_step = tf.train.get_global_step()
    optimizer = tf.train.GradientDescentOptimizer(0.001)
    train = tf.group(optimizer.minimize(loss),
                     tf.assign_add(global_step, 1))
    return tf.estimator.EstimatorSpec(
        mode=mode,
        predictions=y,
        loss=loss,
        train_op=train
    )


# 训练数据
x_train = np.array([1., 2., 3., 6., 8.])
y_train = np.array([4.8, 8.5, 10.4, 21.0, 25.3])
# 评估数据
x_eval = np.array([2., 5., 7., 9.])
y_eval = np.array([7.6, 17.2, 23.6, 28.8])

estimator = tf.estimator.Estimator(model_fn=model_fn)
train_input_fn = tf.estimator.inputs.numpy_input_fn(
    {"x": x_train}, y_train, batch_size=2, num_epochs=None, shuffle=True
)
train_input_fn_2 = tf.estimator.inputs.numpy_input_fn(
    {"x": x_train}, y_train, batch_size=2, num_epochs=1000, shuffle=False
)
eval_input_fn = tf.estimator.inputs.numpy_input_fn(
    {"x": x_eval}, y_eval, batch_size=2, num_epochs=1000, shuffle=False
)

estimator.train(input_fn=train_input_fn, steps=1000)

train_metrics = estimator.evaluate(input_fn=train_input_fn_2)
eval_metrics = estimator.evaluate(input_fn=eval_input_fn)
print("train metrics: %r" % train_metrics)
print("eval metrics: %s" % eval_metrics)
```

运行结果:

```python
train metrics: {'loss': 0.94158113, 'global_step': 1000}
eval metrics: {'loss': 0.25634465, 'global_step': 1000}
```

# TensorBoard

Google为TensorFlow开发了一款可视化工具：TensorBoard，可以直观的看到数据流图，理解TensorFlow的训练过程。

```python
import tensorflow as tf

W = tf.Variable([0], dtype=tf.float32, name='W')
b = tf.Variable([0], dtype=tf.float32, name="b")

x = tf.placeholder(tf.float32, name='x')
y = tf.placeholder(tf.float32, name='y')

linear_model = W * x + b

with tf.name_scope("loss-model"):
    loss = tf.reduce_sum(tf.square(linear_model - y))
    tf.summary.scalar("loss", loss)

optimizer = tf.train.GradientDescentOptimizer(0.001)

train = optimizer.minimize(loss)

# 训练数据
x_train = [1, 2, 3, 6, 8]
y_train = [4.8, 8.5, 10.4, 21.0, 25.3]

sess = tf.Session()
init = tf.global_variables_initializer()
sess.run(init)

# 收集所有的操作数据
merged = tf.summary.merge_all()
# 模型运行产生的所有数据保存到 /tmp/tensorflow 文件夹供TensorBoard使用
writer = tf.summary.FileWriter('/tmp/tensorflow', sess.graph)

for i in range(10000):
    # 训练时传入merge
    summary, _ = sess.run([merged, train], {x: x_train, y: y_train})
    # 收集每次训练产生的数据
    writer.add_summary(summary, i)

curr_W, curr_b, curr_loss = sess.run(
    [W, b, loss], {x: x_train, y: y_train}
)

print("After train W: %s  b: %s  loss: %s" % (curr_W, curr_b, curr_loss))
```

在bash/shell中输入命令调出TensorBoard：

```bash
$ tensorboard --logdir /tmp/tensorflow
```

会看到bash弹出信息：

```bash
TensorBoard 1.12.2 at http://localhost:6006 (Press CTRL+C to quit)
```

在浏览器地址栏输入localhost:6006即可打开TensorBoard：

![TensorBoard](../../../images/posts/tensorflow/2.png)

在GRAPHS选项卡中可以看到数据流图：

![线性回归数据流图](../../../images/posts/tensorflow/1.png)

至此，TensorFlow入门已经结束，更多内容请参考TensorFlow官方文档/中文文档。

> 感谢阅读
