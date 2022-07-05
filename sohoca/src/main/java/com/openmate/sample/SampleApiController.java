package com.openmate.sample;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openmate.sample.service.SampleService;

import lombok.extern.slf4j.Slf4j;

@RequestMapping("/api")
@RestController
@Slf4j
public class SampleApiController {
	
	@Autowired
	private SampleService sampleService;
	
	
	@RequestMapping(value="/ctprvn-info")
	public Object selectCtprvn() {
		return sampleService.selectCtprvn();
	}
	
	@RequestMapping(value="/emd-info")
	public Object selectEmd() {
		return sampleService.selectEmd();
	}
	
	@RequestMapping(value="/statn-info")
	public Object selectStatnInfo() {
		return sampleService.selectStatnInfo();
	}
	
}