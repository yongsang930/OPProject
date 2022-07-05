package com.openmate.sample.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.openmate.sample.mapper.sample.SampleMapper;
import com.openmate.sample.service.SampleService;

@Service
//@Slf4j
public class SampleServiceImpl implements SampleService {
	
	@Resource(name="dao")
	private SampleMapper mapper;
	
	public List<Map<String, Object>> selectCtprvn(){
		return mapper.selectCtprvn();
	};

	public List<Map<String, Object>> selectEmd() {
		return mapper.selectEmd();
	};
	
	public List<Map<String, Object>> selectStatnInfo() {
		return mapper.selectStatnInfo();
	};
	
}