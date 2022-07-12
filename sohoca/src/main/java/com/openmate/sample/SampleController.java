package com.openmate.sample;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.codec.binary.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import com.openmate.sample.service.SampleService;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringEscapeUtils;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class SampleController {

	@Autowired
	private SampleService sampleService;

	/**
	 * html 而⑦룷�꼳�듃 �샇異�
	 */
	@RequestMapping({ "/", "/main" })
	public String main() {
		return "main";
	}

	@RequestMapping("/test")
	public String test() {
		return "test";
	}

	@RequestMapping("/chart")
	public String chart() {
		return "chart";
	}

	@RequestMapping("/ol")
	public String ol() {
		return "openLayers";
	}

	@RequestMapping("/ch")
	public String ch() {
		return "chartTest";
	}

	/*
	 * �봽濡앹떆瑜� �씠�슜�븯�뿬 吏��룄 �씠誘몄� 議고쉶 (image/png)
	 */
	@RequestMapping(value = "/proxyMethodGetMap.do")
	@ResponseBody
	public void proxyMethodGetMap(HttpServletRequest req, HttpServletResponse response) {
		HttpURLConnection con = null;
		BufferedReader br = null;

		// geourl �젙�쓽
		// �씠誘몄� ���엯 蹂��솚
		String urlStr = (String) req.getParameter("url");
		try {
			urlStr = StringEscapeUtils.unescapeHtml(urlStr);
			urlStr = URLDecoder.decode(urlStr, "UTF-8");

			String urlTarget = "";
			urlTarget += urlStr;
			// urlTarget += "?"+parmStr;

			RestTemplate rt = new RestTemplate();
			byte[] result = rt.getForObject(urlTarget, byte[].class);
			response.setContentType("image/png");
			response.getOutputStream().write(result);

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/*
	 * �씠誘몄� �떎�슫濡쒕뱶 (div �븞�뿉 �엳�뒗 媛앹껜�뱾 紐⑤몢 �떎�슫濡쒕뱶)-�겢�씪�씠�뼵�듃
	 */
	// �씠誘몄� �떎�슫濡쒕뱶 怨듯넻 紐⑤뱢濡� �궗�슜媛��뒫
	@RequestMapping(value = "/mapImageDownload.do", method = RequestMethod.POST)
	public void download(HttpServletRequest request, HttpServletResponse response) throws IOException, Exception {
		ByteArrayInputStream is = null;
		try {
			Date d = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
			String newFileName = "吏��룄Image" + sdf.format(d) + ".png";
			String imgData = request.getParameter("imgData");
			if (imgData != null)
				imgData = imgData.replaceAll("data:image/png;base64,", "");

			byte[] file = Base64.decodeBase64(imgData);
			is = new ByteArrayInputStream(file);

			response.setContentType("image/png");
			String docName = new String(newFileName.getBytes("EUC-KR"), "ISO-8859-1");
			response.setHeader("Content-Disposition", "attachment;filename=" + docName);

			IOUtils.copy(is, response.getOutputStream());
			response.flushBuffer();

		} finally {
			if (is != null) {
				is.close();
			}
		}
	}
	
	@GetMapping("/driving")
	public @ResponseBody Map<String, Object> naverMapDriving(@RequestParam String start, @RequestParam String goal) {
		return sampleService.naverDriving(start, goal);
	}
	
	@GetMapping("/geocoding")
	public @ResponseBody Map<String, Object> naverMapDriving(@RequestParam String query) {
		return sampleService.naverGeocoding(query);
	}
	
	@GetMapping("/addrSearch")
	public @ResponseBody Map<String, Object> naverAddrSearch(@RequestParam String query) {
		return sampleService.naverAddrSearch(query);
	}
}