package com.cy.pj.common.vo;

import java.io.Serializable;

import lombok.Data;

@Data
/** 借助此对象封装checkbox相关数据*/
public class CheckBox implements Serializable {

	/**
	 * 
	 */
	
	private static final long serialVersionUID = 4726362356109662723L;
	
	private Integer id;
	private String name;
}
