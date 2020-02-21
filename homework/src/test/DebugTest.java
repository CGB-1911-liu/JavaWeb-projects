package test;

public class DebugTest {
	
	public static void doMethod01() {
		System.out.println("My name is");
		doMethod02();
	}
	
	public static void doMethod02() {
		System.out.println("liuliu");
	}
	public static void main(String[] args) {
		System.out.println("hello world");
		System.out.println("hello Java");
		System.out.println("Spring");
		doMethod01();
	}
}
