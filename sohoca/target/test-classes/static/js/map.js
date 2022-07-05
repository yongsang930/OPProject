// 최초 CenterPoint
const center = [37.5666805, 126.9784147];
const zoom = 12;

// 레이어를 화면에서 지우기 위해 레이어 값을 temp 변수에 담아 놓을 용도 -> ex) removeLayer(temp_wms)
let temp_wms;
let temp_wfs;
let temp_wfs_poly;

// 데이터를 호출하여 화면에 이미 호출된 상태는 true, 아니면 false 
let tf_wms;
let tf_wfs_poi;
let tf_wfs_poly;


// 지리정보시스템(GIS)과 고객관계관리(CRM)의 합성어로 지리정보시스템 기술을 활용한 고객관계관리 시스템 기술로 정의
// GCRM 객체 생성
GCRM = {
	// div에 띄워줄 Map
	MAP: null,
	// 자주 쓰이는 function을 객체에 추가하여 언제든지 호출 가능하게 함
	fn: {
		init: null,
		createBaseMap: null,
		getWms: null,
		getWfs: null,
		getWfsUMD: null,
	},
	// Map Option 설정
	tmsInfos: {
		kakao: {
			srs: "EPSG:5181",
			proj: "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
			tileSize: 256,
			bounds: L.bounds([-30000, -60000], [494288, 988576]),
			resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5,
				0.25
			],
			origin: [-30000, -60000],
			zoomReverse: true,
			zoomOffset: 1,
			doTms: true,
			maxZoom: 13,
			minZoom: 0,
			tileUrl: 'http://map{s}.daumcdn.net/map_2d/1712dec/L{z}/{y}/{x}.png',
			getZoom: function(zoom) {
				var zoomLevel = 4;
				var zoomArr = [];
				for (var zi = this.minZoom; zi <= this.maxZoom; zi++) {
					zoomArr.push(zi);
				}
				if (zoom >= 7) {
					zoomLevel = zoomArr[(zoom - 6)];
				} else {
					zoomLevel = zoomArr[1];
				}
				return zoomLevel;
			}
		},
		naver: {
			srs: "EPSG:3857",
			maxZoom: 19,
			minZoom: 7,
			tileSize: 256,
			zoomReverse: false,
			zoomOffset: 0,
			doTms: false,
			tileUrl: L.Util.emptyImageUrl,
			crs: L.CRS.EPSG3857
		}
	}
}

// 최초 호출될 메서드
GCRM.fn.init = function(mapType) {
	GCRM.MAP = GCRM.fn.createBaseMap('map', mapType);
}

// TMS 호출
GCRM.fn.createBaseMap = function(divId, mapType) {

	mapType == 'naver' || mapType == 'kakao' ? mapType : mapType = 'kakao';

	// Background 
	var mapOption = {
		continuousWorld: true,
		worldCopyJump: false,
		attributionControl: false,
		zoomControl: false,
		zoomAnimation: true,
		renderer: L.canvas()
	};

	//오픈스트리트
	if (mapType == 'OSM') {
		// OSM으로 사용할때는 
		var map = L.map("map", {
			renderer: L.canvas()
		});
		var baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar' }).addTo(map);
		map.setView(center, 11);
	}

	//카카오
	if (mapType == 'kakao') {
		if (GCRM.tmsInfos[mapType].proj) {
			mapOption.crs = getTmsCrs(mapType);
			var daumVer = daum.maps.VERSION.HYBRID;
			//var daumVer = '2111ydg';
			GCRM.tmsInfos[mapType].tileUrl = 'http://map{s}.daumcdn.net/map_2d/' + daumVer + '/L{z}/{y}/{x}.png'
			//GCRM.tmsInfos[mapType].tileUrl = 'http://map{s}.daumcdn.net/map_skyview_hd/L{z}/{y}/{x}.jpg'
		}

		var zoomLevel = GCRM.tmsInfos[mapType].getZoom(zoom, mapType);
		var map = L.map(divId, mapOption).setView(center, zoomLevel);

		var baseMap = new L.tileLayer(GCRM.tmsInfos[mapType].tileUrl, {
			minZoom: GCRM.tmsInfos[mapType].minZoom,
			maxZoom: GCRM.tmsInfos[mapType].maxZoom,
			zoomOffset: GCRM.tmsInfos[mapType].zoomOffset,
			zoomReverse: GCRM.tmsInfos[mapType].zoomReverse,
			subdomains: '0123',
			continuousWorld: true,
			tms: GCRM.tmsInfos[mapType].doTms,
			zoomControl: false,
			zoomsliderControl: true
		});
	}

	//Naver Setting
	if (mapType == 'naver') {
		mapOption.crs = GCRM.tmsInfos[mapType].crs;

		map = L.map('map', mapOption).setView(center, zoom);
		baseMap = new L.NHNWebDynamicMap2(GCRM.tmsInfos[mapType].tileUrl, {
			minZoom: GCRM.tmsInfos[mapType].minZoom,
			maxZoom: GCRM.tmsInfos[mapType].maxZoom,
			zoomOffset: GCRM.tmsInfos[mapType].zoomOffset,
			zoomReverse: GCRM.tmsInfos[mapType].zoomReverse,
			subdomains: '0123',
			continuousWorld: true,
			tms: GCRM.tmsInfos[mapType].doTms
		});
	}

	baseMap._id = "baseLayer";
	baseMap._leaflet_id = "baseLayer";
	map.addLayer(baseMap);

	return map;
}

// ※WMS 호출
GCRM.fn.getWms = function() {
	// id가 SHOW_WMS_UMD인 button 태그를 가져옮  
	const SWM = document.getElementById("SHOW_WMS_UMD");

	var map = GCRM.MAP;

	// tf_wms가 비어있거나 false라면 WMS값을 geoserver에서 호출
	if (!tf_wms) {
		// WMS를 불러올 url과 옵션을 설정
		var wmsLayer = L.tileLayer.wms('http://localhost:8070/geoserver/test/wms', {
			// geoserver version
			version: '1.1.1',
			// geoserver내의 저장소 및 레이어 명
			layers: 'test:tl_scco_emd',
			// 정의할 좌표계
			crs: L.CRS.EPSG3857,
			// 가져올 format
			format: 'image/png',
			// 투명도 false일때는 jpg처럼 동작
			transparent: true,
			// 저작권 소유자 및 타일 제공자
			attribution: "Wellcome © Opemmate!",
		}).addTo(map);

		// wfs_poly 값이 있다면 wfs_poly의 getBounds()를 WMS의 fitBounds로 설정
		// WMS에서 getBounds()값을 가져오지 못해서 일단 정의해놓음
		if (temp_wfs_poly)
			GCRM.MAP.fitBounds(temp_wfs_poly.getBounds());

		// filter를 생성하여 파라미터 뒤에 붙여서 쿼리 전달
		var filter = { CQL_FILTER: "emd_cd like '11%'" }
		wmsLayer.setParams(filter);

		// 다른 범위에서 사용하기 위해 wmsLayer 참조변수를 temp_wms에 넣음
		temp_wms = wmsLayer

		// 재호출을 막기위해 tf를 바꿔줌
		tf_wms = true;
		SWM.innerText = "WMS UMD(off)";
		console.log("WMS INPUT ON!");

	} else if (tf_wms) {
		// tf가 true일때 해당하는 값의 레이어 map에서 지움
		map.removeLayer(temp_wms);

		tf_wms = false;
		SWM.innerText = "WMS UMD(on)";
		console.log("WMS OFF!");
	}
}

// ※WFS POINT 호출
GCRM.fn.getWfs = function() {
	// id가 SHOW_WFS_STATION인 button 태그를 가져옮 
	const SWS = document.getElementById("SHOW_WFS_STATION");

	var map = GCRM.MAP;

	// WFS
	// GeoJSON: http://localhost:8088/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3AInSeoul_Station&maxFeatures=50&outputFormat=application%2Fjson

	// geojson 값을 요청할 파라미터 설정
	var defaultParameters = {
		service: 'WFS',
		version: '1.0.0',
		// Feature로 요청
		request: 'GetFeature',
		// wfs의 위치
		typeName: 'test:tl_rlroad_statn_info',
		// 결과를 얻을 피처 수로 지정하지 않으면 모두 반환
		maxFeature: 150,
		// output의 포맷은 json
		outputFormat: 'application/json',
		// 응답형식에 대한 콜백 함수 이름을 지정 / format_options=param1:value1;param2:value2;...
		format_options: 'callback:getJson',
		SrsName: 'EPSG:4326',
	};

	// var filter = "&viewprams=codeNum:110";
	// wfs는 CQL_FILTER를 url뒤에 붙여서 전달하거나 viewparams를 사용하여 전달
	var filter = "&CQL_FILTER=hous_id like '11%'";
	// uri encoding을 거쳐야 활용 가능
	var decode = encodeURI(filter);

	// 아이콘 설정
	var LeafIcon = L.icon({
		// 아이콘 이미지 가져올 url
		iconUrl: 'images/pngwing4.png',
		iconSize: [20, 20],
		// scale에 따른 아이콘 이동
		iconSize: [30, 30],
		shadowSize: [50, 64],
		popupAnchor: [0, 0],
		tooltipAnchor: [0, 0]
	});

	// marker option을 설정한 객체
	/* var geojsonMarkerOptions = {
		radius: 0,
		fillColor: "#DE4949",
		color: "#000",
		weight: 0,
		opacity: 0,
		fillOpacity: 0.0
	}; 
	
		function iconMove(e) {
		e.sourceTarget._latlng.lat = center[0];
		e.sourceTarget._latlng.lat = center[0];
		e.sourceTarget._latlng.lng = center[1];
		} */

	// src 갹채 속성으로 병합?
	var parameters = L.Util.extend(defaultParameters);

	// 객체를 string으로 변환
	var URL = 'http://localhost:8070/geoserver/test/wfs/service=WFS' + L.Util.getParamString(parameters) + decode;

	/* 참고 자바스크립트는 서로 다른 도메인에 대한 요청을 제한한다. 
	   이를 SOP라고 하며 이 때문에 크로스 이슈가 발생할 수 있다.
	   이것을 해결할 수 있는 것이 JSONP이다. */

	// 데이터 호출 패턴은 wms와 동일
	if (!tf_wfs_poi) {
		var ajax = $.ajax({
			url: URL,
			dataType: 'json',
			success: function(data) {
				// https://leafletjs.com/reference.html#geojson-option
				// GeoJson 레이어를 생성하여 받은 data를 GeoJson 형식으로 변환
				var wfsLayer = L.geoJSON(data, {

					// GeoJson_Option 설정 설정
					// Point를 레이어로 설정
					pointToLayer: function(feature, latlng) {
						/* 
						CircleMarker와 Circle의 차이
						CircleMarker는 항상 동일한 픽셀과 반경을 유지하고 Circle은 항상 동일한 미터 크기/반경을 가진다.
						CircleMarker는 이름이 명확하게 나타내는 마커로 간주, Radius 속성은 표시 목적으로 존재하며 길이의 미터법 단위가 아닌 픽셀로 계산
						Circle은 실제 미터법 길이 단위의 반지름을 가진 원형 기하학(~m내 범위를 표현 가능)
						*/
						return L.circle(latlng, 200, {
							color: '#7DF4B2',
							radius: 0,
							weight: 130,
							fillColor: 0.5,
							opacity: 0.3
						}).bindPopup('<b>' + feature.properties.line_no + " " + feature.properties.station_nm + "역 입니다." + '</b>' + '<br/>' + "좌표: " + latlng.lat + ", " + latlng.lng).addTo(map);
					},/*L.marker(latlng, {
							icon: LeafIcon
						}).bindPopup('<b>' + feature.properties.line_no + " " + feature.properties.station_nm + "역 입니다." + '</b>' + '<br/>' + "좌표: " + latlng.lat + ", " + latlng.lng).addTo(map),
								L.circleMarker(latlng, {
									color: 'red',
									radius: 0,
									weight: 130,
									fillColor: 0.5,
									opacity: 0.2
							}).bindPopup('<b>' + feature.properties.line_no + " " + feature.properties.station_nm + "역 입니다." + '</b>' + '<br/>' + "좌표: " + latlng.lat + ", " + latlng.lng).addTo(map),*/

					/**/
					/* onEachFeature: function (feature, layer) {
					layer.on({
							 mouseover: iconMove
							 mouseout: resetHighlight,
							click: iconMove
					});
					} */

				}).addTo(map);
				temp_wfs = wfsLayer;
				console.log(temp_wfs);
				GCRM.MAP.fitBounds(temp_wfs.getBounds());
			}
		})
		tf_wfs_poi = true;
		console.log("WFS UMD_POI ON!");
		SWS.innerText = "WFS STATION(OFF)";
	}
	else if (tf_wfs_poi) {
		tf_wfs_poi = false;
		map.removeLayer(temp_wfs);
		console.log(map);
		SWS.innerText = "WMS UMD(ON)";
		console.log("WFS UMD_POI OFF!");
	}
}

// ※WFS UMD 호출
GCRM.fn.getWfsUMD = function() {
	const SWUP = document.getElementById("SHOW_WFS_UMD_POLY");
	var map = GCRM.MAP;

	// GeoJSON: http://localhost:8088/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3ASeoul_filter&maxFeatures=50&outputFormat=application%2Fjson

	// geojson 값을 요청할 파라미터 설정
	var defaultParameters = {
		service: 'WFS',
		version: '1.0.0',
		// Feature로 요청
		request: 'GetFeature',
		// wfs의 위치
		typeName: 'test:tl_scco_sig',
		// 결과를 얻을 피처 수로 지정하지 않으면 모두 반환
		// maxFeature: 50,
		// output의 포맷은 json
		outputFormat: 'application/json',
		// 응답형식에 대한 콜백 함수 이름을 지정 / format_options=param1:value1;param2:value2;...
		format_options: 'callback:getJson',
		SrsName: 'EPSG:4326',
	};

	// src 속성을 병합하는 기능
	var parameters = L.Util.extend(defaultParameters);

	var filter = "&viewparams=cdName:114";
	var decode = encodeURI(filter);

	// wfs geojson url + parameters
	var URL = 'http://localhost:8070/geoserver/test/wfs/service=WFS' + L.Util.getParamString(parameters) + decode;

	// 클릭 이벤트 된 스타일
	var onStyle = {
		weight: 2,
		opacity: 1,
		color: 'blue',
		dashArray: '0',
		fillOpacity: 0.3,
		fillColor: 'blue',
	}

	// 기본 스타일
	var offStyle = {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.3,
		fillColor: '#ff0000'
	}

	/* 참고 자바스크립트는 서로 다른 도메인에 대한 요청을 제한한다. 
	   이를 SOP라고 하며 이 때문에 크로스 이슈가 발생할 수 있다.
	   이것을 해결할 수 있는 것이 JSONP이다. */

	if (!tf_wfs_poly) {
		// 비동기로 요청하여 geoJson 값을 가져옮
		var ajax = $.ajax({
			url: URL,
			dataType: 'json',
			success: function(data) {
				// GeoJson 레이어를 생성하여 받은 data를 GeoJson 형식으로 변환
				// https://leafletjs.com/reference.html#geojson-option
				var wfsLayer = L.geoJSON(data, {
					// GeoJson_Option 설정 설정
					style: offStyle,
					onEachFeature: function(feature, layer) {

						layer.on({
							click: 	// CLICK FUNCTION 
								function(e) {
									// 레이어의 스타일을 리셋
									temp_wfs_poly.resetStyle();

									// 클릭된 타겟을 변수에 저장
									var layer = e.target;

									// 타켓의 스타일을 넣어줌
									layer.setStyle(onStyle)

									// 클릭된 타켓의 범위를 지도의 범위로 지정		
									GCRM.MAP.fitBounds(e.target._bounds);

									var poly = L.polygon(feature.geometry.coordinates, {});
									var popupTest = new L.Popup();

									var SIGName = feature.properties.sig_kor_nm;
									var SIGCode = feature.properties.sig_cd;

									var popupLocation = poly.getBounds().getCenter();
									popupTest.setLatLng(popupLocation);
									var popupContent = '<div id="UMDPopup">' + '- 시도: ' + SIGName + '</br>' + '- 코드: ' + SIGCode + '</div>';

									popupTest.setContent(popupContent);

									layer.bindPopup(popupTest);
								}
						});
					}
				}).addTo(map);
				temp_wfs_poly = wfsLayer;
				GCRM.MAP.fitBounds(temp_wfs_poly.getBounds());
			}
		});
		tf_wfs_poly = true;
		SWUP.innerText = "WFS SIG (OFF)";
		console.log("WFS UMD_POLY ON!");
	}
	else if (tf_wfs_poly) {
		map.removeLayer(temp_wfs_poly);
		tf_wfs_poly = false;
		SWUP.innerText = "WFS SIG (ON)";
		console.log("WFS UMD_POLY OFF!");
	}
}

// 좌표계 설정_아래 샘플 참고
function getTmsCrs(name) {
	var crs = new L.Proj.CRS(GCRM.tmsInfos[name].srs, GCRM.tmsInfos[name].proj, {
		resolutions: GCRM.tmsInfos[name].resolutions,
		origin: GCRM.tmsInfos[name].origin,
		bounds: GCRM.tmsInfos[name].bounds
	});
	return crs;
}



/* 좌표계 설정 참고
var map = L.map('map', {
	center: [57.74, 11.94],
	zoom: 13,
	// L.Proj.CRS = EPSG, 계수, 옵션(확대 및 축소에 대한 해상도, 좌표원점, 보여줄 범위)
	crs: L.Proj.CRS('EPSG:2400',
	  '+lon_0=15.808877777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
	  '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
	  '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
	  {
		resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
		origin: [-30000, -60000],
		L.bounds([-30000, -60000], [494288, 988576]), 
	  });
}); */
