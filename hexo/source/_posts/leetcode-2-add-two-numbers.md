---
title: leetcode-2-add-two-numbers
date: 2018-03-21 21:44:31
tags:
---
## Add Two Numbers
给定非空linked list包含两个非负整数。
数字被存储在一个逆序序列并且每个他们的节点包含一个单独的数字，
添加这两个数字并且用linked list返回他们。

你可以假设这两个数字不包含任何导向0，除了0本身。
**Example**
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
Explanation: 342 + 456

```C++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode *head = NULL, *prev = NULL;
        int carry = 0;
        while (l1 || l2) {
            int v1 = l1? l1->val: 0;
            int v2 = l2? l2->val: 0;
            int tmp = v1 + v2 + carry;
            carry = tmp / 10;
            int val = tmp % 10;
            ListNode* cur = new ListNode(val);
            if (!head) head = cur;
            if (prev) prev->next = cur;
            prev = cur;
            l1 = l1? l1->next: NULL;
            l2 = l2? l2->next: NULL;
        }
        if (carry > 0) {
            ListNode* l = new ListNode(carry);
            prev->next = l;
        }
        return head;
    }
};
```
**这是别人的答案**
1.考虑将两个链表转换成数字，再相加得到结果，再利用尾插法转换成链表
2.从运行结果上来看，直接相加会导致溢出。所以应该利用大数加法的思想。