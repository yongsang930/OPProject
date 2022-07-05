package com.openmate.sample.util.openMap;

import java.util.HashMap;

import org.springframework.jdbc.support.JdbcUtils;

public class OpenMap extends HashMap<Object, Object> {
	private static final long  serialVersionUID = -7700790403928325865L;
	
	/** db에서 받은 결과를 camelCase로 변환
	 * @param key
	 * @param value
	 * @return
	 */
	@Override
	public Object put(Object key, Object value) {
		
		if(value == null) {
			value = "";
		}
		return super.put(JdbcUtils.convertUnderscoreNameToPropertyName((String)key), value);
	}
	
	/** 일반 적인 사용일때 대소문자 유지
	 * @param key
	 * @param value
	 * @return
	 */
	public Object put2(Object key, Object value) {
		if(value == null) {
			value = "";
		}
		return super.put(((String)key), value);
	}
}
