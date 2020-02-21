package com.cy.pj.sys.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cy.pj.sys.entity.SysUser;
import com.cy.pj.sys.vo.SysUserDeptVo;

@Mapper
public interface SysUserDao {
	
	int getRowCount(String username);
	
	List<SysUserDeptVo> findPageObjects(
			String username,
			Integer startIndex,
			Integer pageSize);
	
	int validById(
			Integer id,
			Integer valid,
			String modifiedUser);
	
	int insertObject(SysUser entity);
}
