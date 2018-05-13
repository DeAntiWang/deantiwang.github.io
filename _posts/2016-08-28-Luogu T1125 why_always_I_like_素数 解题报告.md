---
layout: post
title: "Luogu T1125 why_always_I_like_素数 解题报告"
date: 2016-08-28 
description: "OI解题报告，why_always_I_like_素数"
tag: 解题报告
--- 

> **声明：这是“山东省北镇中学”团队的团队题目，博主属于这个团队**
> 话不多说，先来看题

题目背景
----

noip中小k因为智商问题屡屡想不出正确做法，而在玄学大师钟长者的影响下走上了hash的不归路；因此他需要一些很大的素数，然而再次因为智商问题他无法得到这些素数；因此他来向你请教……

输入输出格式
------

**输入格式：**
一个正整数N M

**输出格式：**
一个整数 k（N到M间的素数的个数,包括N，M）

k行 从小到大输出这些素数

输入输出样例
------

**输入样例#1：**
4 8
**输出样例#1：**
2
5
7

说明
--
0<=M<=N<=50000000

***

解题思路
----
**欧拉筛法**

此题目可以用欧拉筛法轻松AC，具体欧拉筛法怎么使用，博主会在[另一篇博文](http://blog.csdn.net/u012709325/article/details/52344353)中详细介绍。

**友情提示：**
1. 最大的数据只有40100000；
2. 存素数的数组开到1000000就够了；
3. 数组尽量小，不然会MLE

下面是C++代码：

```c++
#include <cstdio>
#include <iostream>
#include <cmath>
using namespace std;
const int maxn=40100005;
int n,m,prime[maxn/10],print[maxn/10];
bool check[maxn];
int main()
{
	cin>>n>>m;
	int tot=0;
	int ans=0;
	for(int i=2;i<=m;i++)//欧拉筛法
	{
		if(!check[i])prime[++tot]=i;
		if(i>=n&&i<=m&&!check[i])print[++ans]=i;
		for(int j=1;j<=tot;j++)
		{
			if(i*prime[j]>m)break;
			check[i*prime[j]]=true;
			if(i%prime[j]==0)break;
		};
	};                  //欧拉筛法END
	printf("%d\n",ans);
	for(int i=1;i<=ans;i++)printf("%d\n",print[i]);
	return 0;
}
```

> **关于素数筛法和素数检验的博文在此：[点击进入](https://darkkris.github.io/2016/08/%E5%87%A0%E7%A7%8D%E6%B1%82%E7%B4%A0%E6%95%B0%E4%B8%8E%E9%AA%8C%E8%AF%81%E7%B4%A0%E6%95%B0%E7%9A%84%E6%96%B9%E6%B3%95/)**
> 感谢惠读
