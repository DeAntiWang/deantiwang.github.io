---
layout: post
title: '个性化推荐算法LFM理论知识'
date: 2020-2-16 
description: "学习笔记，个性化推荐，LFM"
tag: 学习笔记
--- 

# 个性化推荐算法LFM理论知识

LFM是监督学习的个性化推荐算法，其他的个性化推荐算法还有itemCF等。

## 建模公式

$$P(u,i) = p_u^Tq_i = \sum_{f=1}^{F}p_{uf}q_{if}$$

其中：
  
- u 指 user , i 为 item  
- p(u,i) 代表user是否点击了item, 点击了值为1，否则值为0  
- $p_{u}$与${q_{i}}$是向量，$p_u$的转置$p_u^T$与$q_i$相乘为一值  
- F是向量维度  

## 损失函数

$$loss = \sum_{(u,i) \in D} \big(p(u,i)-p^{LFM}(u,i)\big)^2 $$

其中：  

- D是所有训练样本集合
- $p^{LFM}(u,i)$是LFM算法预估值

该公式**过拟合**，*导致模型特征值复杂，模型泛化能力减弱*  
为解决过拟合，需使用到**正则化**： 

$$
\begin{equation}
\widetilde{J}(w;X,y) = J(w;X,y) + \alpha\Omega(w) \\[20px]
\left\{
\begin{aligned}
\Omega(w) &= \|w\|_1 = \sum_i|w_i| & (l1正则化)\\[8px]
\Omega(w) &= \|w\|_2 = \sum_iw_i^2 & (l2正则化)
\end{aligned}
\right .
\end{equation}
$$

## 算法迭代

此处采用**l2正则化**，得到正则化后公式： 

$$loss = \sum_{(u,i) \in D}\big(p(u,i) - \sum_{f=1}^Fp_{uf}q_{if}\big)^2 + \partial|p_u|^2 + \partial|q_i|^2$$

其中：

$$\frac{\partial loss}{\partial p_{uf}} = -2\big(p(u,i) - p^{LFM}(u,i)\big)q_{if} + 2\partial p_{uf}$$

$$\frac{\partial loss}{\partial q_{if}} = -2\big(p(u,i) - p^{LFM}(u,i)\big)p_{uf} + 2\partial q_{if}$$

采用**梯度下降**的方法迭代，有迭代公式：

$$
\begin{equation}
\left\{
\begin{aligned}
p_{uf} &= p_{uf} - \beta\frac{\partial loss}{\partial p_{uf}} \\
q_{if} &= q_{if} - \beta\frac{\partial loss}{\partial q_{if}}
\end{aligned}
\right .
\end{equation}
$$

## 影响算法的因素

1. *负样本取样*。例如选取了100个正样本，就要选取100个负样本来平衡。  
2. *隐特征* F，*正则参数* α，*leanring rate* β。其中F选择在10～32之间，α和β一般选取在0.01～0.05之间  

## 算法比较

 复杂度 |  LFM  |    CF 
:-----:|:-----:|:-------:
  时间 | O(dnF)| O(mk^2)
  空间 |  O(n) | O(n^2)
      |*离线计算*|*响应及时*
      
其中：  
d是迭代次数，n是样本大小，F是向量维度，m是用户点击次数
  
