package homework;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

/*2.	集合对象list<sting>,
       List.add(“张三”）；
       List.add(“李四”)；
       List.add(“王五”)；
       List.add(“赵六”)；
       List.add(“张三”)；
       List.add(“李四”)；
*/
public class Homework2 {
	public static void main(String[] args) {
		List<String> list = new ArrayList();
		list.add("张三");
		list.add("李四");
		list.add("王五");
		list.add("赵六");
		list.add("张三");
		list.add("李四");
		HashSet hash = new HashSet(list);
		System.out.println(hash);
	}

}
