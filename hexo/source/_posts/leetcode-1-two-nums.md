---
title: leetcode-1-two-nums
date: 2018-03-21 21:41:49
tags: leetCode twoSum
---

##leetCode Two Sum

给定一个数组，从数组中选出两个数，两数之和为给定的和。
Given nums = [2, 7, 11, 15], target = 9,
Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```C++
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {}
};
```
<!-- more -->

1.思路1
	直接使用两重循环，从0到nums.size()-1一个个判断；
```C++
#include <iostream>
#include <vector>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        vector<int> res;
        for(int i=0;i<nums.size();++i){
            for(int j=i+1;j<nums.size();++j){
                if(nums[i]+nums[j]==target)
                {
                    res.push_back(i);
                    res.push_back(j);
                }
            }
        }
        return res;
    }
};
int twoNums_1(){
    vector<int> nums;
    nums.push_back(2);
    nums.push_back(7);
    nums.push_back(11);
    nums.push_back(15);
    Solution s;
    cout << s.twoSum(nums,9) <<endl;
    return 0;
}
```

2.思路2
	使用unordered_map,其与map的区别在于map是有序的，而unordered_map是hash表，内部是无序的。
	使用map记录前半段的数对于target的相反数，后半段直接查找是否存在相反数就快多了。
```C++
	vector<int> twoSum2(vector<int>& nums, int target) {
        unordered_map<int,int> hash;
        vector<int,int> res;
        for(int i=0;i<nums.size();++i){
            int numberToFind = target-nums[i];//与nums[i]相对应的数
            if(hash.find(numberToFind)!=hash.end()){//如果已经存在，说明已经到了后半段
                //加1是由于map从1开始计数
                res.push_back(hash.find(numberToFind)+1);
                res.push_back(i+1);
                return res;
            }
            hash[nums[i]]=i;//记录的是数组下标
        }
        return res;
	}
```




	

