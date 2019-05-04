---
layout: post
title: '汇编学习笔记'
date: 2019-5-4 
description: "学习笔记，汇编，nasm"
tag: 学习笔记
--- 

# 汇编学习笔记

> 系统环境：macOS High Sierra 10.13.4  
> CPU：Intel  
> 使用工具：NASM version 2.14.02 compiled on Dec 27 2018  

## 环境配置

```bash
$ brew install nasm			# 安装nasm
$ alias nasm='/usr/local/bin/nasm'	# 设置指令
```

## 概念理解

### 寻址方式

寻址方式     |     指令中包含       |    说明    | 最终访问地址
:----------:|:------------------:|:---------:|:---------:
立即寻址方式  | 要访问的数据         |           | 直接访问数据
寄存器寻址方式| 要访问的寄存器        |           | 访问寄存器
直接寻址方式 |  内存地址            |           | 内存地址
变址寻址方式 |内存地址、变址寄存器、比例因子|       | $$ 基址 + 偏移量 * 比例因子 $$ 
间接寻址方式 |  寄存器             |寄存器中存放要访问的内存地址|寄存器中的内存地址
基址寻址方式 | 寄存器、偏移量 |寄存器中存放要访问的内存地址| $$ 寄存器中的内存地址 + 偏移量 $$ 

### x86_64寄存器

**按寄存器排序：**

寄存器|       用途      |跨函数调用保留
:---:|:---------------:|:----------:
rax  | 1st return register, number of vector registers used | x
rbx  | 被调用方保留的寄存器，基指针 | √
rcx  | 用于向函数传递第四个参数 | x
rdx  | 用于向函数传递第三个参数，2nd return register | x
rsp  | 栈指针 | √
rbp  | 被调用方保留的寄存器，帧指针 | √
rsi  | 用于向函数传递第二个参数 | x
rdi  | 用于向函数传递第一个参数 | x
r8   | 用于向函数传递第五个参数 | x
r9   | 用于向函数传递第六个参数 | x
r10  | 临时寄存器，用于传递函数的静态链指针 | x
r11  | 临时寄存器 | x
r12  | 被调用方保留的寄存器 | √
r13  | 被调用方保留的寄存器 | √
r14  | 被调用方保留的寄存器 | √
r15  | 被调用方保留的寄存器 | √

**按用途分类排序：**

- 作为函数返回值使用：**rax**
- 栈指针寄存器，指向栈顶：**rsp**
- 用作函数参数，依次对应第i参数：**rdi, rsi, rdx, rcx, r8, r9**
- 用作数据存储，遵循被调用者使用规则(随便用，调用子函数之前要备份以防被修改)：**rbx, rbp, r12, r13, r14, r15**
- 用作数据存储，遵循调用者使用规则(使用之前要先保存原值)：**r10, r11**


## 第一个程序HelloWorld

### 执行过程

源代码（main.asm）：

```x86asm
SECTION .data

msg: db "hello world!", 0x0a
len: equ $-msg

SECTION .text
global _main

kernel:
	syscall
	ret

_main:
	mov rax, 0x2000004	;0x2000004 是 syscall 调用 write 的调用号
	mov rdi, 1		;表示控制台输出
	mov rsi, msg		;syscall 去 rsi 寄存器获取字符
	mov rdx, len		;字符串长度
	call kernel

	mov rax, 0x2000001	;0x2000001 表示退出 syscall
	mov rdi, 0
	call kernel
```

编译：

```bash
$ nasm -f macho64 -o main.o main.asm
```

链接：

```bash
$ ld -e _main -macosx_version_min 10.8 -arch x86_64 main.o -lSystem -o main
```

执行:

```bash
$ ./main
hello world!
```

### 程序解读：

选举一段代码作为解释：

```x86asm
kernel:
	syscall
	ret

_main:
	mov rax, 0x2000004
	mov rdi, 1
	mov rsi, msg
	mov rdx, len
	call kernel
```

在本段代码中，0x2000004代表的是系统调用(syscall) - write。  
执行过程如下：

1. 给rax一个值0x2000004，代表本次指令调用要调用的是write指令
2. 给rdi一个值(1)，代表从stdout输出，是系统指令调用的第一个参数
3. 给rsi一个值(字符串)，代表要输出的字符内容，是系统指令调用的第二个参数
4. 给rdx一个值(字符串长度)，是系统指令调用的第三个参数
5. syscall，将上述步骤转化为一个完整的指令并执行
6. ret，执行结束

以此类推

```x86asm
mov rax, 0x2000001	;0x2000001 表示退出 syscall
mov rdi, 0
call kernel
```

这段代码的含义为：

1. 给rax一个值0x2000001，表示退出syscall
2. 给rdi一个值0，表示退出指令的返回值为0，是系统指令调用的第一个参数
3. syscall，将上述步骤转化为一个完整的指令并执行
4. ret 执行结束

于是main.asm这一段程序就可以转化为如下伪代码：

```cpp
write(stdout,"hello world!",len("hello world"));
return 0;
```

> 未完待续
