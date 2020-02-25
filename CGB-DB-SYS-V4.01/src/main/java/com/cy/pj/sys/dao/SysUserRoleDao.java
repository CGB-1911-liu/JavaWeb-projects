package com.cy.pj.sys.dao;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SysUserRoleDao {

	   @Delete("delete from sys_user_roles where role_id=#{roleId}")
	   int deleteObjectsByRoleId(Integer roleId);
	   
	   int insertObjects(@Param("userId")Integer userId,
			   			@Param("roleIds")Integer[] roleIds);
	   
	   
	   @Select("select role_id from sys_user_roles where user_id=#{id}")
	   List<Integer> findRoleIdByUserId(Integer id);
	   
	   int deleteObjectsByUserId(Integer userId);
}
