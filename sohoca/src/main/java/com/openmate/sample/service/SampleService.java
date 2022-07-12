package com.openmate.sample.service;

import java.util.List;
import java.util.Map;

public interface SampleService {
	public List<Map<String, Object>> selectCtprvn();
	public List<Map<String, Object>> selectEmd();
	public List<Map<String, Object>> selectStatnInfo();
	
	public Map<String, Object> naverAddrSearch(String query);
	
	public Map<String, Object> naverGeocoding(String query);
	
	public Map<String, Object> naverDriving(String start, String goal);
	
}
