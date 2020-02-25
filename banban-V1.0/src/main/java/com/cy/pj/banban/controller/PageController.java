package com.cy.pj.banban.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PageController {
	@RequestMapping("doIndex")
	public String doIndexUI(){
		return "index";
	}

}
