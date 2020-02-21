package homework;

import java.util.Arrays;
import java.util.Scanner;

public class Homework01 {
	/*1.	问：字符串“aa，bb,cc........zz”,请简写一段代码输出字符串中的单个字符：
预期效果：aa
          bb
          ...
          zzz
*/
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String str = new Scanner(System.in).nextLine();
		String[] sts = str.split(",");
		for (int i = 0; i < sts.length; i++) {
			System.out.println(sts[i]);
		}
	}

}
