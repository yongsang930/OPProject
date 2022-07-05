
		             
L.NHNWebDynamicMap2= L.TileLayer.extend({
	initialize : function(url, options) {
		L.TileLayer.prototype.initialize.call(this, L.Util.emptyImageUrl,options);
	},
	onAdd: function (map) {
		L.TileLayer.prototype.onAdd.call(this, map);
		this._map = map;
		this._NHNInitContainer();
		this._NHNInitMapObject();
		map.on('move', this._NHNZoom, this);
	},
	getTileUrl: function (coords) {
//		var tileUrl = L.TileLayer.prototype.getTileUrl.call(this,coords);
		var tileUrl = L.Util.emptyImageUrl;
		if(this._NHNTileObject){
			tileUrl = this._NHNTileObject.getTileUrls(coords.x,coords.y,coords.z)[0];
		}
			
		return tileUrl;
	},
	_NHNZoom: function(){
		if(this._vendor){
			this._vendor.setZoom(this._map.getZoom());
			this._resize();
		}
	},
	_NHNLoaded: false,
	_resize : function() {
		var size = this._map.getSize();
		this._map.invalidateSize();
		
		if (this._NHNcontainer.style.width == size.x
				&& this._NHNcontainer.style.height == size.y)
			return;
		this._NHNcontainer.style.width = size.x + 'px';
		this._NHNcontainer.style.height = size.y + 'px';
		naver.maps.Event.trigger(this._vendor, "resize");
	},
	_getUUID: function() { 
		  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
		    return v.toString(16);
		  });
	},
	_NHNInitContainer : function() {
		var tilePane = this._map._container
		first = tilePane.firstChild;

		if (!this._NHNcontainer) {
			this._NHNcontainer = L.DomUtil.create('div','leaflet-NHN-layer leaflet-top leaflet-left');
			this._NHNcontainer.id = "_NHNMap"+this._getUUID();
		}
		if (true) {
			tilePane.insertBefore(this._NHNcontainer, first);

			this.setOpacity(this.options.opacity);
			var size = this._map.getSize();
			this._NHNcontainer.style.width = size.x + 'px';
			this._NHNcontainer.style.height = size.y + 'px';
			this._NHNcontainer.style.zIndex = 1000;
			
		}
//		var _this = this;
//		L.DomEvent.off(this._container);
	},
	_NHNTileObject: null,
	_NHNInitMapObject : function() {
		var center = this._map.getCenter();
		this._vendor_center = new naver.maps.LatLng(center.lat, center.lng);
		var map = new naver.maps.Map(this._NHNcontainer.id, {
		    center: this._vendor_center,
		    zoom: this._map.getZoom(),
		    mapTypeId : naver.maps.MapTypeId['NORMAL'],
		    scaleControl: true,
		    background: '',
		});
		var __this = this;
		naver.maps.Event.once(map, 'init_stylemap', function () {
		    __this._NHNLoaded = true;
//		    var r = map.getMapType().getTileUrls("{x}","{y}","{z}")[0];
//		    __this.setUrl(r,true);
		    __this._NHNTileObject = map.getMapType();
		    __this.redraw();
		    
		});
		map.getMapType().getTile= function(x, y, z) {
	        var w = this.tileSize.width,
	            h = this.tileSize.height;
	        var div = $("<div class='mytile'></div>");
	        div.css({
	            width: w, height: h
	        });
	        return div[0];
	    }
		
		this._vendor = map;
		
	},
});