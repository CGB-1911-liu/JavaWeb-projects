package com.cy.pj.common.web;
import org.springframework.web.bind.annotation.ControllerAdvice;
/**
 * @ControllerAdvice 注解描述的类为Spring MVC 提供一个
 * 全局异常处理类，控制层出现异常以后，可以由此类进行处理
 * @author qilei
 */
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.cy.pj.common.vo.JsonResult;

//@ResponseBody
//@ControllerAdvice
@RestControllerAdvice  //@ResponseBody+@ControllerAdvice
public class GlobalExceptionHandler {
	  /**
	   * @ExceptionHandler 描述的方法为spring mvc中的异常处理方法，
	   * @return
	   */
	  @ExceptionHandler(RuntimeException.class)
	  public JsonResult doHandleRuntimeException(RuntimeException e) {
		  e.printStackTrace();
		  return new JsonResult(e);//{state:0,message:"..",data:null}
	  }
	  
	  
	 
}
