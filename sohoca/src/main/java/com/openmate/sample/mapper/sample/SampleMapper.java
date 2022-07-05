package com.openmate.sample.mapper.sample;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * @author openmate-ccs
 *
 */
@Mapper
@Repository("dao")
public interface SampleMapper {
	public List<Map<String, Object>> selectCtprvn();
	public List<Map<String, Object>> selectEmd();
	public List<Map<String, Object>> selectStatnInfo();
}