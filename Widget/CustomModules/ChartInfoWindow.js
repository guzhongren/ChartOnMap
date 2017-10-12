define(["dojo/_base/declare", "esri/InfoWindowBase", "esri/domUtils", "esri/geometry/Point", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/_base/array"],
    function (declare, InfoWindowBase, domUtils, Point, lang, domClass, domConstruct, domStyle, array) {
    return declare( // 类名省略
		InfoWindowBase, // 父类
		{
            //coords: null,
            //align: "Middle_Top",
			map: {},
			chart: '',
			chartPoint: '',
			width: 300,
			height: 300,

		    constructor: function (parameters) {//map, chartPoint, chart, width, height
		        lang.mixin(this, parameters);
		        isContentShowing = false;
                this.domNode= domConstruct.create('div',null, document.getElementById('map_root').parentNode);
                domClass.add(this.domNode, "myInfoWindow");
				domUtils.hide(this.domNode);
                this._content = domConstruct.create("div", { "class": "content"}, this.domNode);
                this.setContent(this.chart);
				this.__mcoords= this.chartPoint;
		        this._eventConnections = [];
		        this.isShowing = false;
				this.setMap(this.map);
				this.show(this.map.toScreen(this.chartPoint));
				this.resize(this.width, this.height);
		    },

		    setMap: function (map) {
		        this.inherited(arguments);
		        this._eventConnections.push(map.on("pan", lang.hitch(this, this.__onMapPan)));
		        this._eventConnections.push(map.on("extent-change", lang.hitch(this, this.__onMapExtChg)));
		        this._eventConnections.push(map.on("zoom-start", lang.hitch(this, this.__onMapZmStart)));
		        this._eventConnections.push(map.on("zoom", lang.hitch(this, this.onMapZm)));
		    },

		    setContent: function (content) {
		        domConstruct.place(content, this._content, 'last');
		    },

		    move: function (point, isDelta) {
		        if (isDelta) {
		            point = this.coords.offset(point.x, point.y);
		        }
		        else {
		            this.coords = point;
		            if (this.mapCoords) {
		                this.mapCoords = this.map.toMap(point);
		            }
		        }
		        this._adjustPosition(point);
		    },

		    __onMapPan: function (evt) {
		        this.move(evt.delta, true);
		    },

		    onMapZm: function (evt) {
		        var extent = evt.extent, zoomFactor = evt.zoomFactor, anchor = evt.anchor;
		        var x = (this.coords.x - anchor.x) * zoomFactor + anchor.x;
		        var y = (this.coords.y - anchor.y) * zoomFactor + anchor.y;
		        var newPostion = new Point(x - this.coords.x, y - this.coords.y);
		        this.move(newPostion, true);
		    },

		    __onMapZmStart: function () {
		    },

		    __onMapExtChg: function (evt) {
		        var extent = evt.extent, delta = evt.delta, levelChange = evt.levelChange;

		        var map = this.map, mapPoint = this.mapCoords;
		        if (mapPoint) {
		            if (this.isShowing == true) {
		                this.show(mapPoint);
		            }
		        }
		        else {
		            var screenPoint;
		            if (levelChange) {
		                screenPoint = map.toScreen(this.__mcoords);
		            }
		            else {
		                screenPoint = this.coords.offset(
                            (delta && delta.x) || 0,
                            (delta && delta.y) || 0
                        );
		            }
		            if (this.isShowing == true) {
		                this.show(screenPoint);
		            }
		        }
		    },

		    show: function (location) {
		        if (location.spatialReference) {
		            this.mapCoords = location;
		            location = this.map.toScreen(location);
		        }
		        else {
		            this.mapCoords = null;
		            this.coords = location;
		            if (typeof (this.__mcoords) === "undefined") {
		            }
		        }

		        this._adjustPosition(location);
		        domUtils.show(this.domNode);
		        this.isShowing = true;
		        this.onShow();
		    },

		    hide: function () {
		        domUtils.hide(this.domNode);
		        this.isShowing = false;
		        this.onHide();
		    },

		    resize: function (width, height) {
		        domStyle.set(this._content, {
		            width: width + "px",
		            height: height + "px"
		        });

		        if (this.coords) {
		            this._adjustPosition(this.coords);
		        }
		    },

		    _adjustPosition: function (location) {
		        var width = domStyle.get(this._content, "width");
		        var height = domStyle.get(this._content, "height");
		        var left = "", top = "";
		        if (this.align == "Center") {
		            left = (location.x - width / 2) + "px";
		            top = (location.y - height / 2) + "px";
		        }
		        else {
		            left = (location.x - width / 2) + "px";
		            top = (location.y - height) + "px";
		        }

		        domStyle.set(this.domNode, {
		            left: left,
		            top: top
		        });
		    },

		    destroy: function () {
		        array.forEach(this._eventConnections, function (handle) {
		            handle.remove();
		        });
		        domConstruct.destroy(this.domNode);
		        this._closeButton = this._title = this._content = this._eventConnections = null;
		    }
		}
	);
});