package com.openmate.sample.config;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;

import lombok.Data;

@Data
public class ResponseMessage  implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
    private int status;
    private Date timestamp;
    private String message = "Success";
    private String errorCode = "0000";
    private Object data;
    
    public ResponseMessage() {}
    
    public ResponseMessage(Object data) {
    	
    	if(Objects.isNull(data)) {
    		this.errorCode = "2000";
    		this.message = "No Results";
    	}else if(data instanceof List && ((List) data).size() == 0) {
    		this.errorCode = "2000";
    		this.message = "No Results";
    	}
    	
    	this.data = data;
        this.status = HttpStatus.OK.value();
        this.timestamp = new Date();
    }
}
