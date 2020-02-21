package com.cy.pj.sys.vo;

import java.io.Serializable;
import java.util.Date;

import com.cy.pj.sys.entity.SysDept;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 封装用户和部门信息的一个值对象
 * */
@Getter
@Setter
@ToString
public class SysUserDeptVo implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3618475831414852628L;
	private Integer id;
	private String username;
	private String password;//md5
	private String salt;
	private String email;
	private String mobile;
	private Integer valid=1;
	private SysDept sysDept; //private Integer deptId;
	private Date createdTime;
	private Date modifiedTime;
	private String createdUser;
	private String modifiedUser;

}
