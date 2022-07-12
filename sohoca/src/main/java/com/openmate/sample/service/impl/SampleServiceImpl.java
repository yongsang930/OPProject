package com.openmate.sample.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.openmate.sample.mapper.sample.SampleMapper;
import com.openmate.sample.service.SampleService;

@Service
//@Slf4j
public class SampleServiceImpl implements SampleService {
	
	@Resource(name="dao")
	private SampleMapper mapper;

	private final String NAVER_CLOUD_KEY = "tysgmrap17";
	private final String NAVER_CLOUD_SECRET = "8ZbrMq27zNr35Vvy9oRAuc1SUnrf4OM3NW1bP3xp";
	
	private final String NAVER_CLIENT_ID = "jjuefwENyHEVfNxWEFvj";
	private final String NAVER_CLIENT_SECRET = "e7p8y3X3VT";
	
	
	public List<Map<String, Object>> selectCtprvn(){
		return mapper.selectCtprvn();
	};

	public List<Map<String, Object>> selectEmd() {
		return mapper.selectEmd();
	};
	
	public List<Map<String, Object>> selectStatnInfo() {
		return mapper.selectStatnInfo();
	}

	@Override
	public Map<String, Object> naverAddrSearch(String query) {
        try {
        	RestTemplate restTemplate = getRestTemplate();
        	
            // 3. header 설정을 위해 HttpHeader 클래스를 생성한 후 HttpEntity 객체에 넣어줍니다.
            HttpHeaders header = new HttpHeaders();
            header.set("X-Naver-Client-Id", NAVER_CLIENT_ID);
            header.set("X-Naver-Client-Secret", NAVER_CLIENT_SECRET);
            HttpEntity<String> entity = new HttpEntity<String>(header);
            
            // 4. 요청 URL을 정의해줍니다.
            String url = "https://openapi.naver.com/v1/search/local.json";
            UriComponents uri = UriComponentsBuilder.fromHttpUrl(url)
            		.queryParam("query", query)
            		.queryParam("display", 5)
            		.build(false);
 
            return getResponsData(restTemplate, uri, entity);
        } catch (Exception e) {
            e.printStackTrace();
        }
		return null;
	};
	
	@Override
	public Map<String, Object> naverGeocoding(String query) {
		try {
        	RestTemplate restTemplate = getRestTemplate();
        	
            // 3. header 설정을 위해 HttpHeader 클래스를 생성한 후 HttpEntity 객체에 넣어줍니다.
            HttpHeaders header = new HttpHeaders();
            header.set("X-NCP-APIGW-API-KEY-ID", NAVER_CLOUD_KEY);
            header.set("X-NCP-APIGW-API-KEY", NAVER_CLOUD_SECRET);
            HttpEntity<String> entity = new HttpEntity<String>(header);
            
            // 4. 요청 URL을 정의해줍니다.
            String url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
            UriComponents uri = UriComponentsBuilder.fromHttpUrl(url)
            		.queryParam("query", query)
            		.build(false);
 
            return getResponsData(restTemplate, uri, entity);
        } catch (Exception e) {
            e.printStackTrace();
        }
		return null;
	}
	
	@Override
	public Map<String, Object> naverDriving(String start, String goal) {
        try {
        	RestTemplate restTemplate = getRestTemplate();
        	
            // 3. header 설정을 위해 HttpHeader 클래스를 생성한 후 HttpEntity 객체에 넣어줍니다.
            HttpHeaders header = new HttpHeaders();
            header.set("X-NCP-APIGW-API-KEY-ID", NAVER_CLOUD_KEY);
            header.set("X-NCP-APIGW-API-KEY", NAVER_CLOUD_SECRET);
            HttpEntity<String> entity = new HttpEntity<String>(header);
            
            // 4. 요청 URL을 정의해줍니다.
            String url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving";
            UriComponents uri = UriComponentsBuilder.fromHttpUrl(url)
            		.queryParam("start", start)
            		.queryParam("goal", goal)
            		.queryParam("option", "tracomfort")
            		.build(false);
 
            return getResponsData(restTemplate, uri, entity);
        } catch (Exception e) {
            e.printStackTrace();
        }
		return null;
	}
	
	public RestTemplate getRestTemplate() {
		// 1. 타임아웃 설정시 HttpComponentsClientHttpRequestFactory 객체를 생성합니다.
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 타임아웃 설정 5초
        factory.setReadTimeout(5000); // 타임아웃 설정 5초

        //Apache HttpComponents : 각 호스트(IP와 Port의 조합)당 커넥션 풀에 생성가능한 커넥션 수
        HttpClient httpClient = HttpClientBuilder.create()
                                                .setMaxConnTotal(50)//최대 커넥션 수
                                                .setMaxConnPerRoute(20).build();
        factory.setHttpClient(httpClient);

        // 2. RestTemplate 객체를 생성합니다.
        return new RestTemplate(factory);
	}
	
	public Map<String, Object> getResponsData(RestTemplate restTemplate, UriComponents uri, HttpEntity<String> entity) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		// 5. exchange() 메소드로 api를 호출합니다.
        @SuppressWarnings("rawtypes")
		ResponseEntity<Map> response = restTemplate.exchange(
        		uri.toString(), 
        		HttpMethod.GET, 
        		entity, 
        		Map.class);

        // 6. 요청한 결과를 HashMap에 추가합니다.
        // HTTP Status Code
        resultMap.put("statusCode", response.getStatusCodeValue());
        // 헤더 정보
        resultMap.put("header", response.getHeaders());
        // 반환받은 실제 데이터 정보
        resultMap.put("body", response.getBody());
		
		return resultMap;
	}	
}