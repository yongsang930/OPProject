// define epsg:5181 projection
proj4.defs(
  "EPSG:5181",
  "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
ol.proj.setProj4 = proj4;

// 픽셀당 지도 단위 값
const resolutions = [
  2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25,
];

// 지도상의 보여줄 범위를 정의
let extent = [-30000, -60000, 494288, 988576];

// 투영법 정의
const projection = new ol.proj.Projection({
  code: "EPSG:5181",
  extent: extent,
  units: "m",
});

// 타일 레이어 정의
let tileLayer = new ol.layer.Tile({
  // 지도를 나타내려면 true
  visible: true,
  // source 옵션 정의
  source: new ol.source.XYZ({
    // 투영법
    projection: projection,
    // 사이즈
    tileSize: 256,
    // 줌
    minZoom: 0,
    maxZoom: resolutions.length - 1,
    // 타일그리드 정의?
    tileGrid: new ol.tilegrid.TileGrid({
      origin: [extent[0], extent[1]],
      resolutions: resolutions,
    }),
    
    tileUrlFunction: function (tileCoord, pixelRatio, projection) {
      if (tileCoord == null) return undefined;

      var s = Math.floor(Math.random() * 4); // 0 ~ 3
      var z = resolutions.length - tileCoord[0];
      var x = tileCoord[1];
      var y = tileCoord[2];

      return (
        "https://map" +
        s +
        ".daumcdn.net/map_2d/2111ydg/L" +
        z +
        "/" +
        y +
        "/" +
        x +
        ".png"
      );
      // 원래 코드 return 'http://map' + s + '.daumcdn.net/map_2d/2fso49/L' + z + '/' + y + '/' + x + '.png';
      // 복사한 코드 https://map2.daumcdn.net/map_2d_hd/2111ydg/L6/229/114.png
    },
    /* attributions: [
       new ol.Attribution({
         html: [
           '<a href="http://map.daum.net"><img src="http://i1.daumcdn.net/localimg/localimages/07/mapjsapi/m_bi.png"></a>',
         ],
       }),
    ], */ 
  }),
});

//http://localhost:8088/geoserver/test/wms?service=WMS&version=1.1.0&request=GetMap&layers=test%3ASeoul_filter&bbox=1.38714893299137E7%2C3910407.08392798%2C1.46800111010473E7%2C4666488.82937695&width=768&height=718&srs=EPSG%3A3857&styles=&format=application/openlayers
let wmsLayer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "http://localhost:8088/geoserver/test/wms",
    params: {
      VERSION: "1.1.0",
      LAYERS: "test:Seoul_filter",
      BBOX: [22537.658203125, -42034.9921875, 632508.8125, 545439.375],
      SRS: "EPSG:3857",
      FORMAT: "image/png",
    },
    serverType: "geoserver",
  }),
});

 const white = [255, 255, 255, 1];
 const blue = [0, 153, 255, 1];
 const width = 3;
 
//http://localhost:8088/geoserver/test/wms?service=WMS&version=1.1.0&request=GetMap&layers=test%3ASeoul_Station&bbox=1.40698946555105E7%2C4129957.61926282%2C1.44024640781385E7%2C4609146.46807072&width=533&height=768&srs=EPSG%3A3857&styles=&format=application%2Fopenlayers2
//http://localhost:8088/geoserver/test/wms?service=WMS&version=1.1.0&request=GetMap&layers=test:Seoul_Station&bbox=1.40698946555105E7,4129957.61926282,1.44024640781385E7,4609146.46807072&width=533&height=768&srs=EPSG:3857&styles=&format=text/html; subtype=openlayers
const vectorSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: function (extent) {
    return  'http://localhost:8088/geoserver/test/ows?service=WFS&' +
      'version=1.0.0&'+
      'request=GetFeature&'+
      'typename=test:Seoul_Station&'+
      'outputFormat=application/json&'+
      'srcname=EPSG:3857&'
    /*return (
      'https://ahocevar.com/geoserver/wfs?service=WFS&' +
      'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
      'outputFormat=application/json&srsname=EPSG:3857&' +
      'bbox=' +
      extent.join(',') +
      ',EPSG:3857'
    );*/
  },
   strategy: ol.loadingstrategy.bbox,
});

console.log("1");

const vector = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
	 image: new ol.style.Circle({
       radius: 4,
       fill: new ol.style.Fill({
         color: blue,
       }),
       stroke: new ol.style.Stroke({
         color: 'rgb(0,0,255)',
         width: 2,
       })
       })
  })
});
console.log("2");

let map = new ol.Map({
  layers: [tileLayer, vector],
  target: document.getElementById('map'),
  
  view: new ol.View({
    projection: projection,
    extent: extent,
    resolutions: resolutions,
    maxResolution: resolutions[0],
    zoomFactor: 1,
    center: [248403, 272948],
    zoom: 1,
  }),
});
console.log("3");

map.addLayer(vector);
