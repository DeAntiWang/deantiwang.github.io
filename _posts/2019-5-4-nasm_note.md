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
变址寻址方式 |内存地址、变址寄存器、比例因子|       |$ 基址 + 偏移量 * 比例因子 $
间接寻址方式 |  寄存器             |寄存器中存放要访问的内存地址|寄存器中的内存地址
基址寻址方式 | 寄存器、偏移量 |寄存器中存放要访问的内存地址|$寄存器中的内存地址+偏移量$

## 第一个程序HelloWorld

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
	mov rdi, 1	;表示控制台输出
	mov rsi, msg	;syscall 去 rsi 寄存器获取字符
	mov rdx, len	;字符串长度
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

> 未完待续
