/**
 * Created by zhongren on 2016/5/22.
 * 返回一个盛放图表、背景为无色的区域
 */
define(["dojo/_base/declare", "esri/symbols/Symbol",
    "dojo/_base/lang", "dojo/dom", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct",
    "dojo/dom-style", "dojo/_base/array"],
    function (declare, Symbol,
              lang, dom, domAttr, domClass, domContruct, domStyle, Array) {
            chartContainer= domContruct.create('SVG', {
                'class': 'chartSymbol',
                'id': 'chartId'
            }, document.getElementById('map'));
    return declare(
        Symbol,{
            //构造函数
            height:50,
            width:100,
            chart: '',
            constructor: function(args){
                lang.mixin(this, args);
                this.type= 'ChartSymbol';
                this.setChart(this.chart);
                //map.on("pan", lang.hitch(this, this.__onMapPan));
                //map.on("extent-change", lang.hitch(this, this.__onMapExtChg));
                //map.on("zoom-start", lang.hitch(this, this.__onMapZmStart));
                //map.on("zoom", lang.hitch(this, this.onMapZm));
            },
            //将图表放在容器里
            setChart: function(chart){
                domContruct.empty(chartContainer);
                domContruct.place(chart, chartContainer);
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
        }
    );
});