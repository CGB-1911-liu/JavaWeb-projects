package homework;

import java.util.Arrays;

public class Homework3 {
	public static void main(String[] args) {
		int[] nums = {7,3,2,45,8,9,6};
		int temp = 0;
		for (int i = 0; i < nums.length; i++) {
			for (int j = nums.length-1; j > i; j--) {
				if(nums[j]<nums[j-1]) {
					temp=nums[j];
					nums[j]=nums[j-1];
					nums[j-1]=temp;
				}
			}
		}
		System.out.println(Arrays.toString(nums));
	}
}
