define(["esri/geometry/Point", "esri/geometry/Extent"], function (Point, Extent) {
    var geometryUtils = {
    };

    /*
    得到多边形的质心点
    */
    geometryUtils.getPolygonCenterPoint = function (polygon) {
        var momentX = 0;
        var momentY = 0;
        var weight = 0;
        var ext = polygon.getExtent();
        var p0 = new Point([ext.xmin, ext.ymin]);
        for (var i = 0; i < polygon.rings.length; i++) {
            var pts = polygon.rings[i];
            for (var j = 0; j < pts.length - 1; j++) {
                var p1 = polygon.getPoint(i, j);
                var p2;
                if (j == pts.length - 1) {
                    p2 = polygon.getPoint(i, 0);
                }
                else {
                    p2 = polygon.getPoint(i, j + 1);
                }
                var dWeight = (p1.x - p0.x) * (p2.y - p1.y) - (p1.x - p0.x) * (p0.y - p1.y) / 2 - (p2.x - p0.x) * (p2.y - p0.y) / 2 - (p1.x - p2.x) * (p2.y - p1.y) / 2;
                weight = weight + dWeight;
                var pTmp = new Point([(p1.x + p2.x) / 2, (p1.y + p2.y) / 2]);
                var gravityX = p0.x + (pTmp.x - p0.x) * 2 / 3;
                var gravityY = p0.y + (pTmp.y - p0.y) * 2 / 3;
                momentX = momentX + gravityX * dWeight;
                momentY = momentY + gravityY * dWeight;
            }
        }

        return new Point(momentX / weight, momentY / weight, polygon.spatialReference);
    };

    return geometryUtils;
});