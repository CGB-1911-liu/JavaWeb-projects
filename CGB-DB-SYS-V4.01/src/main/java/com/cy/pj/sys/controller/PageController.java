package com.cy.pj.sys.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
/**
 * 此Controller主要负责响应一些页面
 */
@Controller
@RequestMapping("/")
public class PageController {
	@RequestMapping("doIndexUI")
	public String doIndexUI() {
		return "starter";
	}
	/**
	 * 返回日志列表页面
	 * @return
	 */
//	@RequestMapping("log/log_list")
//	public String doLogUI() {
//		return "sys/log_list";
//	}
	
//	@RequestMapping("menu/menu_list")
//	public String doMenuUI() {
//		return "sys/menu_list";
//	}
	//rest风格的一种url定义，语法{url}
	//@PathVariable 注解描述的方法参数，表示他的值从url路径中获取(和参数名相同的url变量值)
	@RequestMapping("{module}/{moduleUI}")
	public String doModuleUI(@PathVariable String moduleUI) {//module
		return "sys/"+moduleUI;
	}

	
	@RequestMapping("doPageUI")
	public String doPageUI() {
		return "common/page";
	}
	
}






