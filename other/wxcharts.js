/*
 * charts for WeChat small app v1.0
 *
 * https://github.com/xiaolin3303/wx-charts
 * 2016-11-28
 *
 * Designed and built with all the love of Web
 */

'use strict';

var config = {
    yAxisWidth: 15,
    yAxisSplit: 5,
    xAxisHeight: 15,
    xAxisLineHeight: 15,
    legendHeight: 15,
    yAxisTitleWidth: 15,
    padding: 12,
    columePadding: 3,
    fontSize: 10,
    dataPointShape: ['diamond', 'circle', 'triangle', 'rect'],
    colors: ['#7cb5ec', '#f7a35c', '#434348', '#90ed7d', '#f15c80', '#8085e9'],
    pieChartLinePadding: 25,
    pieChartTextPadding: 15,
    xAxisTextPadding: 3,
    titleColor: '#333333',
    titleFontSize: 20,
    subtitleColor: '#999999',
    subtitleFontSize: 15,
    toolTipPadding: 3,
    toolTipBackground: '#000000',
    toolTipOpacity: 0.7,
    toolTipLineHeight: 14,
    radarGridCount: 3,
    radarLabelTextMargin: 15
};

// Object.assign polyfill
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function assign(target, varArgs) {
    if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
            // Skip over if undefined or null
            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}

var util = {
    toFixed: function toFixed(num, limit) {
        limit = limit || 2;
        if (this.isFloat(num)) {
            num = num.toFixed(limit);
        }
        return num;
    },
    isFloat: function isFloat(num) {
        return num % 1 !== 0;
    },
    approximatelyEqual: function approximatelyEqual(num1, num2) {
        return Math.abs(num1 - num2) < 1e-10;
    },
    isSameSign: function isSameSign(num1, num2) {
        return Math.abs(num1) === num1 && Math.abs(num2) === num2 || Math.abs(num1) !== num1 && Math.abs(num2) !== num2;
    },
    isSameXCoordinateArea: function isSameXCoordinateArea(p1, p2) {
        return this.isSameSign(p1.x, p2.x);
    },
    isCollision: function isCollision(obj1, obj2) {
        obj1.end = {};
        obj1.end.x = obj1.start.x + obj1.width;
        obj1.end.y = obj1.start.y - obj1.height;
        obj2.end = {};
        obj2.end.x = obj2.start.x + obj2.width;
        obj2.end.y = obj2.start.y - obj2.height;
        var flag = obj2.start.x > obj1.end.x || obj2.end.x < obj1.start.x || obj2.end.y > obj1.start.y || obj2.start.y < obj1.end.y;

        return !flag;
    }
};

function findRange(num, type, limit) {
    if (isNaN(num)) {
        throw new Error('[wxCharts] unvalid series data!');
    }
    limit = limit || 10;
    type = type ? type : 'upper';
    var multiple = 1;
    while (limit < 1) {
        limit *= 10;
        multiple *= 10;
    }
    if (type === 'upper') {
        num = Math.ceil(num * multiple);
    } else {
        num = Math.floor(num * multiple);
    }
    while (num % limit !== 0) {
        if (type === 'upper') {
            num++;
        } else {
            num--;
        }
    }

    return num / multiple;
}

function calValidDistance(distance, chartData, config, opts) {

    var dataChartAreaWidth = opts.width - config.padding - chartData.xAxisPoints[0];
    var dataChartWidth = chartData.eachSpacing * opts.categories.length;
    var validDistance = distance;
    if (distance >= 0) {
        validDistance = 0;
    } else if (Math.abs(distance) >= dataChartWidth - dataChartAreaWidth) {
        validDistance = dataChartAreaWidth - dataChartWidth;
    }
    return validDistance;
}

function isInAngleRange(angle, startAngle, endAngle) {
    function adjust(angle) {
        while (angle < 0) {
            angle += 2 * Math.PI;
        }
        while (angle > 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }

        return angle;
    }

    angle = adjust(angle);
    startAngle = adjust(startAngle);
    endAngle = adjust(endAngle);
    if (startAngle > endAngle) {
        endAngle += 2 * Math.PI;
        if (angle < startAngle) {
            angle += 2 * Math.PI;
        }
    }

    return angle >= startAngle && angle <= endangle; } function calrotatetranslate(x, y, h) { var xv="x;" yv="h" - y; transx="xv" + (h xv) math.sqrt(2); *="-1;" transy="(h" yv) (math.sqrt(2) 1) return transx: transx, transy: }; createcurvecontrolpoints(points, i) isnotmiddlepoint(points, if (points[i 1] && points[i 1]) points[i].y>= Math.max(points[i - 1].y, points[i + 1].y) || points[i].y <= math.min(points[i - 1].y, points[i + 1].y); } else { return false; var a="0.2;" b="0.2;" pax="null;" pay="null;" pbx="null;" pby="null;" if (i < 1) (points[1].x points[0].x) * a; (points[1].y points[0].y) (points[i 1].x 1].x) 1].y 1].y)> points.length - 3) {
        var last = points.length - 1;
        pBx = points[last].x - (points[last].x - points[last - 1].x) * b;
        pBy = points[last].y - (points[last].y - points[last - 1].y) * b;
    } else {
        pBx = points[i + 1].x - (points[i + 2].x - points[i].x) * b;
        pBy = points[i + 1].y - (points[i + 2].y - points[i].y) * b;
    }

    // fix issue https://github.com/xiaolin3303/wx-charts/issues/79
    if (isNotMiddlePoint(points, i + 1)) {
        pBy = points[i + 1].y;
    }
    if (isNotMiddlePoint(points, i)) {
        pAy = points[i].y;
    }

    return {
        ctrA: { x: pAx, y: pAy },
        ctrB: { x: pBx, y: pBy }
    };
}

function convertCoordinateOrigin(x, y, center) {
    return {
        x: center.x + x,
        y: center.y - y
    };
}

function avoidCollision(obj, target) {
    if (target) {
        // is collision test
        while (util.isCollision(obj, target)) {
            if (obj.start.x > 0) {
                obj.start.y--;
            } else if (obj.start.x < 0) {
                obj.start.y++;
            } else {
                if (obj.start.y > 0) {
                    obj.start.y++;
                } else {
                    obj.start.y--;
                }
            }
        }
    }
    return obj;
}

function fillSeriesColor(series, config) {
    var index = 0;
    return series.map(function (item) {
        if (!item.color) {
            item.color = config.colors[index];
            index = (index + 1) % config.colors.length;
        }
        return item;
    });
}

function getDataRange(minData, maxData) {
    var limit = 0;
    var range = maxData - minData;
    if (range >= 10000) {
        limit = 1000;
    } else if (range >= 1000) {
        limit = 100;
    } else if (range >= 100) {
        limit = 10;
    } else if (range >= 10) {
        limit = 5;
    } else if (range >= 1) {
        limit = 1;
    } else if (range >= 0.1) {
        limit = 0.1;
    } else {
        limit = 0.01;
    }
    return {
        minRange: findRange(minData, 'lower', limit),
        maxRange: findRange(maxData, 'upper', limit)
    };
}

function measureText(text) {
    var fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    // wx canvas 未实现measureText方法, 此处自行实现
    text = String(text);
    var text = text.split('');
    var width = 0;
    text.forEach(function (item) {
        if (/[a-zA-Z]/.test(item)) {
            width += 7;
        } else if (/[0-9]/.test(item)) {
            width += 5.5;
        } else if (/\./.test(item)) {
            width += 2.7;
        } else if (/-/.test(item)) {
            width += 3.25;
        } else if (/[\u4e00-\u9fa5]/.test(item)) {
            width += 10;
        } else if (/\(|\)/.test(item)) {
            width += 3.73;
        } else if (/\s/.test(item)) {
            width += 2.5;
        } else if (/%/.test(item)) {
            width += 8;
        } else {
            width += 10;
        }
    });
    return width * fontSize / 10;
}

function dataCombine(series) {
    return series.reduce(function (a, b) {
        return (a.data ? a.data : a).concat(b.data);
    }, []);
}

function getSeriesDataItem(series, index) {
    var data = [];
    series.forEach(function (item) {
        if (item.data[index] !== null && typeof item.data[index] !== 'undefined') {
            var seriesItem = {};
            seriesItem.color = item.color;
            seriesItem.name = item.name;
            seriesItem.data = item.format ? item.format(item.data[index]) : item.data[index];
            data.push(seriesItem);
        }
    });

    return data;
}



function getMaxTextListLength(list) {
    var lengthList = list.map(function (item) {
        return measureText(item);
    });
    return Math.max.apply(null, lengthList);
}

function getRadarCoordinateSeries(length) {
    var eachAngle = 2 * Math.PI / length;
    var CoordinateSeries = [];
    for (var i = 0; i < length; i++) {
        CoordinateSeries.push(eachAngle * i);
    }

    return CoordinateSeries.map(function (item) {
        return -1 * item + Math.PI / 2;
    });
}

function getToolTipData(seriesData, calPoints, index, categories) {
    var option = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var textList = seriesData.map(function (item) {
        return {
            text: option.format ? option.format(item, categories[index]) : item.name + ': ' + item.data,
            color: item.color
        };
    });
    var validCalPoints = [];
    var offset = {
        x: 0,
        y: 0
    };
    calPoints.forEach(function (points) {
        if (typeof points[index] !== 'undefined' && points[index] !== null) {
            validCalPoints.push(points[index]);
        }
    });
    validCalPoints.forEach(function (item) {
        offset.x = Math.round(item.x);
        offset.y += item.y;
    });

    offset.y /= validCalPoints.length;
    return { textList: textList, offset: offset };
}

function findCurrentIndex(currentPoints, xAxisPoints, opts, config) {
    var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var currentIndex = -1;
    if (isInExactChartArea(currentPoints, opts, config)) {
        xAxisPoints.forEach(function (item, index) {
            if (currentPoints.x + offset > item) {
                currentIndex = index;
            }
        });
    }

    return currentIndex;
}

function isInExactChartArea(currentPoints, opts, config) {
    return currentPoints.x < opts.width - config.padding && currentPoints.x > config.padding + config.yAxisWidth + config.yAxisTitleWidth && currentPoints.y > config.padding && currentPoints.y < opts.height - config.legendHeight - config.xAxisHeight - config.padding;
}

function findRadarChartCurrentIndex(currentPoints, radarData, count) {
    var eachAngleArea = 2 * Math.PI / count;
    var currentIndex = -1;
    if (isInExactPieChartArea(currentPoints, radarData.center, radarData.radius)) {
        var fixAngle = function fixAngle(angle) {
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            if (angle > 2 * Math.PI) {
                angle -= 2 * Math.PI;
            }
            return angle;
        };

        var angle = Math.atan2(radarData.center.y - currentPoints.y, currentPoints.x - radarData.center.x);
        angle = -1 * angle;
        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        var angleList = radarData.angleList.map(function (item) {
            item = fixAngle(-1 * item);

            return item;
        });

        angleList.forEach(function (item, index) {
            var rangeStart = fixAngle(item - eachAngleArea / 2);
            var rangeEnd = fixAngle(item + eachAngleArea / 2);
            if (rangeEnd < rangeStart) {
                rangeEnd += 2 * Math.PI;
            }
            if (angle >= rangeStart && angle <= 2 rangeend || angle + * math.pi>= rangeStart && angle + 2 * Math.PI <= 0 2 rangeend) { currentindex="index;" } }); return currentindex; function findpiechartcurrentindex(currentpoints, piedata) var if (isinexactpiechartarea(currentpoints, piedata.center, piedata.radius)) angle="Math.atan2(pieData.center.y" - currentpoints.y, currentpoints.x piedata.center.x); for (var i="0," len="pieData.series.length;" < len; i++) item="pieData.series[i];" (isinanglerange(angle, item._start_, item._start_ + item._proportion_ * math.pi)) break; isinexactpiechartarea(currentpoints, center, radius) math.pow(currentpoints.x center.x, 2) math.pow(currentpoints.y center.y, 2); splitpoints(points) newpoints="[];" items="[];" points.foreach(function (item, index) (item !="=" null) items.push(item); else (items.length) newpoints.push(items); newpoints; callegenddata(series, opts, config) (opts.legend="==" false) legendlist: [], legendheight: }; padding="5;" margintop="8;" shapewidth="15;" legendlist="[];" widthcount="0;" currentrow="[];" series.foreach(function (item) itemwidth="3" measuretext(item.name || 'undefined'); (widthcount> opts.width) {
            legendList.push(currentRow);
            widthCount = itemWidth;
            currentRow = [item];
        } else {
            widthCount += itemWidth;
            currentRow.push(item);
        }
    });
    if (currentRow.length) {
        legendList.push(currentRow);
    }

    return {
        legendList: legendList,
        legendHeight: legendList.length * (config.fontSize + marginTop) + padding
    };
}

function calCategoriesData(categories, opts, config) {
    var result = {
        angle: 0,
        xAxisHeight: config.xAxisHeight
    };

    var _getXAxisPoints = getXAxisPoints(categories, opts, config),
        eachSpacing = _getXAxisPoints.eachSpacing;

    // get max length of categories text


    var categoriesTextLenth = categories.map(function (item) {
        return measureText(item);
    });

    var maxTextLength = Math.max.apply(this, categoriesTextLenth);

    if (maxTextLength + 2 * config.xAxisTextPadding > eachSpacing) {
        result.angle = 45 * Math.PI / 180;
        result.xAxisHeight = 2 * config.xAxisTextPadding + maxTextLength * Math.sin(result.angle);
    }

    return result;
}

function getRadarDataPoints(angleList, center, radius, series, opts) {
    var process = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

    var radarOption = opts.extra.radar || {};
    radarOption.max = radarOption.max || 0;
    var maxData = Math.max(radarOption.max, Math.max.apply(null, dataCombine(series)));

    var data = [];
    series.forEach(function (each) {
        var listItem = {};
        listItem.color = each.color;
        listItem.data = [];
        each.data.forEach(function (item, index) {
            var tmp = {};
            tmp.angle = angleList[index];

            tmp.proportion = item / maxData;
            tmp.position = convertCoordinateOrigin(radius * tmp.proportion * process * Math.cos(tmp.angle), radius * tmp.proportion * process * Math.sin(tmp.angle), center);
            listItem.data.push(tmp);
        });

        data.push(listItem);
    });

    return data;
}

function getPieDataPoints(series) {
    var process = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var count = 0;
    var _start_ = 0;
    series.forEach(function (item) {
        item.data = item.data === null ? 0 : item.data;
        count += item.data;
    });
    series.forEach(function (item) {
        item.data = item.data === null ? 0 : item.data;
        item._proportion_ = item.data / count * process;
    });
    series.forEach(function (item) {
        item._start_ = _start_;
        _start_ += 2 * item._proportion_ * Math.PI;
    });

    return series;
}

function getPieTextMaxLength(series) {
    series = getPieDataPoints(series);
    var maxLength = 0;
    series.forEach(function (item) {
        var text = item.format ? item.format(+item._proportion_.toFixed(2)) : util.toFixed(item._proportion_ * 100) + '%';
        maxLength = Math.max(maxLength, measureText(text));
    });

    return maxLength;
}

function fixColumeData(points, eachSpacing, columnLen, index, config, opts) {
    return points.map(function (item) {
        if (item === null) {
            return null;
        }
        item.width = (eachSpacing - 2 * config.columePadding) / columnLen;

        if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
            // customer column width
            item.width = Math.min(item.width, +opts.extra.column.width);
        } else {
            // default width should less tran 25px
            // don't ask me why, I don't know
            item.width = Math.min(item.width, 25);
        }
        item.x += (index + 0.5 - columnLen / 2) * item.width;

        return item;
    });
}

function getXAxisPoints(categories, opts, config) {
    var yAxisTotalWidth = config.yAxisWidth + config.yAxisTitleWidth;
    var spacingValid = opts.width - 2 * config.padding - yAxisTotalWidth;
    var dataCount = opts.enableScroll ? Math.min(5, categories.length) : categories.length;
    var eachSpacing = spacingValid / dataCount;

    var xAxisPoints = [];
    var startX = config.padding + yAxisTotalWidth;
    var endX = opts.width - config.padding;
    categories.forEach(function (item, index) {
        xAxisPoints.push(startX + index * eachSpacing);
    });
    if (opts.enableScroll === true) {
        xAxisPoints.push(startX + categories.length * eachSpacing);
    } else {
        xAxisPoints.push(endX);
    }

    return { xAxisPoints: xAxisPoints, startX: startX, endX: endX, eachSpacing: eachSpacing };
}

function getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config) {
    var process = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;

    var points = [];
    var validHeight = opts.height - 2 * config.padding - config.xAxisHeight - config.legendHeight;
    data.forEach(function (item, index) {
        if (item === null) {
            points.push(null);
        } else {
            var point = {};
            point.x = xAxisPoints[index] + Math.round(eachSpacing / 2);
            var height = validHeight * (item - minRange) / (maxRange - minRange);
            height *= process;
            point.y = opts.height - config.xAxisHeight - config.legendHeight - Math.round(height) - config.padding;
            points.push(point);
        }
    });

    return points;
}

function getYAxisTextList(series, opts, config) {
    var data = dataCombine(series);
    // remove null from data
    data = data.filter(function (item) {
        return item !== null;
    });
    var minData = Math.min.apply(this, data);
    var maxData = Math.max.apply(this, data);
    if (typeof opts.yAxis.min === 'number') {
        minData = Math.min(opts.yAxis.min, minData);
    }
    if (typeof opts.yAxis.max === 'number') {
        maxData = Math.max(opts.yAxis.max, maxData);
    }

    // fix issue https://github.com/xiaolin3303/wx-charts/issues/9
    if (minData === maxData) {
        var rangeSpan = maxData || 1;
        minData -= rangeSpan;
        maxData += rangeSpan;
    }

    var dataRange = getDataRange(minData, maxData);
    var minRange = dataRange.minRange;
    var maxRange = dataRange.maxRange;

    var range = [];
    var eachRange = (maxRange - minRange) / config.yAxisSplit;

    for (var i = 0; i <= 2 config.yaxissplit; i++) { range.push(minrange + eachrange * i); } return range.reverse(); function calyaxisdata(series, opts, config) var ranges="getYAxisTextList(series," config); yaxiswidth="config.yAxisWidth;" rangesformat="ranges.map(function" (item) item="util.toFixed(item," 2); ? opts.yaxis.format(number(item)) : item; measuretext(item) 5); }); if (opts.yaxis.disabled="==" true) rangesformat: rangesformat, ranges: ranges, yaxiswidth: }; drawpointshape(points, color, shape, context) context.beginpath(); context.setstrokestyle("#ffffff"); context.setlinewidth(1); context.setfillstyle(color); (shape="==" 'diamond') points.foreach(function (item, index) (item !="=" null) context.moveto(item.x, item.y - 4.5); context.lineto(item.x 4.5, item.y); context.lineto(item.x, else 'circle') context.moveto(item.x 3.5, context.arc(item.x, item.y, 4, 0, math.pi, false); 'rect') 3.5); context.rect(item.x 7, 7); 'triangle') context.closepath(); context.fill(); context.stroke(); drawringtitle(opts, config, titlefontsize="opts.title.fontSize" || config.titlefontsize; subtitlefontsize="opts.subtitle.fontSize" config.subtitlefontsize; title="opts.title.name" ''; subtitle="opts.subtitle.name" titlefontcolor="opts.title.color" config.titlecolor; subtitlefontcolor="opts.subtitle.color" config.subtitlecolor; titleheight="title" 0; subtitleheight="subtitle" margin="5;" (subtitle) textwidth="measureText(subtitle," subtitlefontsize); startx="(opts.width" textwidth) (opts.subtitle.offsetx 0); starty="(opts.height" config.legendheight subtitlefontsize) 2; (title) margin) context.setfontsize(subtitlefontsize); context.setfillstyle(subtitlefontcolor); context.filltext(subtitle, startx, starty); _textwidth="measureText(title," titlefontsize); _startx="(opts.width" _textwidth) (opts.title.offsetx _starty="(opts.height" titlefontsize) context.setfontsize(titlefontsize); context.setfillstyle(titlefontcolor); context.filltext(title, _startx, _starty); drawpointtext(points, series, 绘制数据文案 data="series.data;" context.setfontsize(config.fontsize); context.setfillstyle('#666666'); formatval="series.format" series.format(data[index]) data[index]; context.filltext(formatval, item.x measuretext(formatval) 2, drawradarlabel(anglelist, radius, centerposition, radaroption="opts.extra.radar" {}; radius context.setfillstyle(radaroption.labelcolor '#666666'); anglelist.foreach(function (angle, pos="{" x: math.cos(angle), y: math.sin(angle) posrelativecanvas="convertCoordinateOrigin(pos.x," pos.y, centerposition); (util.approximatelyequal(pos.x, 0)) '') (pos.x < 0) ''); context.filltext(opts.categories[index] '', config.fontsize drawpietext(series, context, center) lineradius="radius" config.piechartlinepadding; textobjectcollection="[];" lasttextobject="null;" seriesconvert="series.map(function" arc="2" math.pi (item._start_ item._proportion_ text="item.format" item.format(+item._proportion_.tofixed(2)) util.tofixed(item._proportion_ 100) '%'; color="item.color;" arc: arc, text: text, color: seriesconvert.foreach(function line end orginx1="Math.cos(item.arc)" lineradius; orginy1="Math.sin(item.arc)" start orginx2="Math.cos(item.arc)" radius; orginy2="Math.sin(item.arc)" orginx3="orginX1">= 0 ? orginX1 + config.pieChartTextPadding : orginX1 - config.pieChartTextPadding;
        var orginY3 = orginY1;

        var textWidth = measureText(item.text);
        var startY = orginY3;

        if (lastTextObject && util.isSameXCoordinateArea(lastTextObject.start, { x: orginX3 })) {
            if (orginX3 > 0) {
                startY = Math.min(orginY3, lastTextObject.start.y);
            } else if (orginX1 < 0) {
                startY = Math.max(orginY3, lastTextObject.start.y);
            } else {
                if (orginY3 > 0) {
                    startY = Math.max(orginY3, lastTextObject.start.y);
                } else {
                    startY = Math.min(orginY3, lastTextObject.start.y);
                }
            }
        }

        if (orginX3 < 0) {
            orginX3 -= textWidth;
        }

        var textObject = {
            lineStart: {
                x: orginX2,
                y: orginY2
            },
            lineEnd: {
                x: orginX1,
                y: orginY1
            },
            start: {
                x: orginX3,
                y: startY
            },
            width: textWidth,
            height: config.fontSize,
            text: item.text,
            color: item.color
        };

        lastTextObject = avoidCollision(textObject, lastTextObject);
        textObjectCollection.push(lastTextObject);
    });

    textObjectCollection.forEach(function (item) {
        var lineStartPoistion = convertCoordinateOrigin(item.lineStart.x, item.lineStart.y, center);
        var lineEndPoistion = convertCoordinateOrigin(item.lineEnd.x, item.lineEnd.y, center);
        var textPosition = convertCoordinateOrigin(item.start.x, item.start.y, center);
        context.setLineWidth(1);
        context.setFontSize(config.fontSize);
        context.beginPath();
        context.setStrokeStyle(item.color);
        context.setFillStyle(item.color);
        context.moveTo(lineStartPoistion.x, lineStartPoistion.y);
        var curveStartX = item.start.x < 0 ? textPosition.x + item.width : textPosition.x;
        var textStartX = item.start.x < 0 ? textPosition.x - 5 : textPosition.x + 5;
        context.quadraticCurveTo(lineEndPoistion.x, lineEndPoistion.y, curveStartX, textPosition.y);
        context.moveTo(lineStartPoistion.x, lineStartPoistion.y);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo(textPosition.x + item.width, textPosition.y);
        context.arc(curveStartX, textPosition.y, 2, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.beginPath();
        context.setFillStyle('#666666');
        context.fillText(item.text, textStartX, textPosition.y + 3);
        context.closePath();
        context.stroke();

        context.closePath();
    });
}

function drawToolTipSplitLine(offsetX, opts, config, context) {
    var startY = config.padding;
    var endY = opts.height - config.padding - config.xAxisHeight - config.legendHeight;
    context.beginPath();
    context.setStrokeStyle('#cccccc');
    context.setLineWidth(1);
    context.moveTo(offsetX, startY);
    context.lineTo(offsetX, endY);
    context.stroke();
    context.closePath();
}

function drawToolTip(textList, offset, opts, config, context) {
    var legendWidth = 4;
    var legendMarginRight = 5;
    var arrowWidth = 8;
    var isOverRightBorder = false;
    offset = assign({
        x: 0,
        y: 0
    }, offset);
    offset.y -= 8;
    var textWidth = textList.map(function (item) {
        return measureText(item.text);
    });

    var toolTipWidth = legendWidth + legendMarginRight + 4 * config.toolTipPadding + Math.max.apply(null, textWidth);
    var toolTipHeight = 2 * config.toolTipPadding + textList.length * config.toolTipLineHeight;

    // if beyond the right border
    if (offset.x - Math.abs(opts._scrollDistance_) + arrowWidth + toolTipWidth > opts.width) {
        isOverRightBorder = true;
    }

    // draw background rect
    context.beginPath();
    context.setFillStyle(opts.tooltip.option.background || config.toolTipBackground);
    context.setGlobalAlpha(config.toolTipOpacity);
    if (isOverRightBorder) {
        context.moveTo(offset.x, offset.y + 10);
        context.lineTo(offset.x - arrowWidth, offset.y + 10 - 5);
        context.lineTo(offset.x - arrowWidth, offset.y + 10 + 5);
        context.moveTo(offset.x, offset.y + 10);
        context.fillRect(offset.x - toolTipWidth - arrowWidth, offset.y, toolTipWidth, toolTipHeight);
    } else {
        context.moveTo(offset.x, offset.y + 10);
        context.lineTo(offset.x + arrowWidth, offset.y + 10 - 5);
        context.lineTo(offset.x + arrowWidth, offset.y + 10 + 5);
        context.moveTo(offset.x, offset.y + 10);
        context.fillRect(offset.x + arrowWidth, offset.y, toolTipWidth, toolTipHeight);
    }

    context.closePath();
    context.fill();
    context.setGlobalAlpha(1);

    // draw legend
    textList.forEach(function (item, index) {
        context.beginPath();
        context.setFillStyle(item.color);
        var startX = offset.x + arrowWidth + 2 * config.toolTipPadding;
        var startY = offset.y + (config.toolTipLineHeight - config.fontSize) / 2 + config.toolTipLineHeight * index + config.toolTipPadding;
        if (isOverRightBorder) {
            startX = offset.x - toolTipWidth - arrowWidth + 2 * config.toolTipPadding;
        }
        context.fillRect(startX, startY, legendWidth, config.fontSize);
        context.closePath();
    });

    // draw text list
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle('#ffffff');
    textList.forEach(function (item, index) {
        var startX = offset.x + arrowWidth + 2 * config.toolTipPadding + legendWidth + legendMarginRight;
        if (isOverRightBorder) {
            startX = offset.x - toolTipWidth - arrowWidth + 2 * config.toolTipPadding + +legendWidth + legendMarginRight;
        }
        var startY = offset.y + (config.toolTipLineHeight - config.fontSize) / 2 + config.toolTipLineHeight * index + config.toolTipPadding;
        context.fillText(item.text, startX, startY + config.fontSize);
    });
    context.stroke();
    context.closePath();
}

function drawYAxisTitle(title, opts, config, context) {
    var startX = config.xAxisHeight + (opts.height - config.xAxisHeight - measureText(title)) / 2;
    context.save();
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(opts.yAxis.titleFontColor || '#333333');
    context.translate(0, opts.height);
    context.rotate(-90 * Math.PI / 180);
    context.fillText(title, startX, config.padding + 0.5 * config.fontSize);
    context.stroke();
    context.closePath();
    context.restore();
}

function drawColumnDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var _calYAxisData = calYAxisData(series, opts, config),
        ranges = _calYAxisData.ranges;

    var _getXAxisPoints = getXAxisPoints(opts.categories, opts, config),
        xAxisPoints = _getXAxisPoints.xAxisPoints,
        eachSpacing = _getXAxisPoints.eachSpacing;

    var minRange = ranges.pop();
    var maxRange = ranges.shift();
    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
        context.translate(opts._scrollDistance_, 0);
    }

    series.forEach(function (eachSeries, seriesIndex) {
        var data = eachSeries.data;
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        points = fixColumeData(points, eachSpacing, series.length, seriesIndex, config, opts);

        // 绘制柱状数据图
        context.beginPath();
        context.setFillStyle(eachSeries.color);
        points.forEach(function (item, index) {
            if (item !== null) {
                var startX = item.x - item.width / 2 + 1;
                var height = opts.height - item.y - config.padding - config.xAxisHeight - config.legendHeight;
                context.moveTo(startX, item.y);
                context.rect(startX, item.y, item.width - 2, height);
            }
        });
        context.closePath();
        context.fill();
    });
    series.forEach(function (eachSeries, seriesIndex) {
        var data = eachSeries.data;
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        points = fixColumeData(points, eachSpacing, series.length, seriesIndex, config, opts);
        if (opts.dataLabel !== false && process === 1) {
            drawPointText(points, eachSeries, config, context);
        }
    });
    context.restore();
    return {
        xAxisPoints: xAxisPoints,
        eachSpacing: eachSpacing
    };
}

function drawAreaDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var _calYAxisData2 = calYAxisData(series, opts, config),
        ranges = _calYAxisData2.ranges;

    var _getXAxisPoints2 = getXAxisPoints(opts.categories, opts, config),
        xAxisPoints = _getXAxisPoints2.xAxisPoints,
        eachSpacing = _getXAxisPoints2.eachSpacing;

    var minRange = ranges.pop();
    var maxRange = ranges.shift();
    var endY = opts.height - config.padding - config.xAxisHeight - config.legendHeight;
    var calPoints = [];

    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
        context.translate(opts._scrollDistance_, 0);
    }

    if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
        drawToolTipSplitLine(opts.tooltip.offset.x, opts, config, context);
    }

    series.forEach(function (eachSeries, seriesIndex) {
        var data = eachSeries.data;
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        calPoints.push(points);

        var splitPointList = splitPoints(points);

        splitPointList.forEach(function (points) {
            // 绘制区域数据
            context.beginPath();
            context.setStrokeStyle(eachSeries.color);
            context.setFillStyle(eachSeries.color);
            context.setGlobalAlpha(0.6);
            context.setLineWidth(2);
            if (points.length > 1) {
                var firstPoint = points[0];
                var lastPoint = points[points.length - 1];

                context.moveTo(firstPoint.x, firstPoint.y);
                if (opts.extra.lineStyle === 'curve') {
                    points.forEach(function (item, index) {
                        if (index > 0) {
                            var ctrlPoint = createCurveControlPoints(points, index - 1);
                            context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, item.x, item.y);
                        }
                    });
                } else {
                    points.forEach(function (item, index) {
                        if (index > 0) {
                            context.lineTo(item.x, item.y);
                        }
                    });
                }

                context.lineTo(lastPoint.x, endY);
                context.lineTo(firstPoint.x, endY);
                context.lineTo(firstPoint.x, firstPoint.y);
            } else {
                var item = points[0];
                context.moveTo(item.x - eachSpacing / 2, item.y);
                context.lineTo(item.x + eachSpacing / 2, item.y);
                context.lineTo(item.x + eachSpacing / 2, endY);
                context.lineTo(item.x - eachSpacing / 2, endY);
                context.moveTo(item.x - eachSpacing / 2, item.y);
            }
            context.closePath();
            context.fill();
            context.setGlobalAlpha(1);
        });

        if (opts.dataPointShape !== false) {
            var shape = config.dataPointShape[seriesIndex % config.dataPointShape.length];
            drawPointShape(points, eachSeries.color, shape, context);
        }
    });
    if (opts.dataLabel !== false && process === 1) {
        series.forEach(function (eachSeries, seriesIndex) {
            var data = eachSeries.data;
            var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
            drawPointText(points, eachSeries, config, context);
        });
    }

    context.restore();

    return {
        xAxisPoints: xAxisPoints,
        calPoints: calPoints,
        eachSpacing: eachSpacing
    };
}

function drawLineDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var _calYAxisData3 = calYAxisData(series, opts, config),
        ranges = _calYAxisData3.ranges;

    var _getXAxisPoints3 = getXAxisPoints(opts.categories, opts, config),
        xAxisPoints = _getXAxisPoints3.xAxisPoints,
        eachSpacing = _getXAxisPoints3.eachSpacing;

    var minRange = ranges.pop();
    var maxRange = ranges.shift();
    var calPoints = [];

    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
        context.translate(opts._scrollDistance_, 0);
    }

    if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
        drawToolTipSplitLine(opts.tooltip.offset.x, opts, config, context);
    }

    series.forEach(function (eachSeries, seriesIndex) {
        var data = eachSeries.data;
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        calPoints.push(points);
        var splitPointList = splitPoints(points);

        splitPointList.forEach(function (points, index) {
            context.beginPath();
            context.setStrokeStyle(eachSeries.color);
            context.setLineWidth(2);
            if (points.length === 1) {
                context.moveTo(points[0].x, points[0].y);
                context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
            } else {
                context.moveTo(points[0].x, points[0].y);
                if (opts.extra.lineStyle === 'curve') {
                    points.forEach(function (item, index) {
                        if (index > 0) {
                            var ctrlPoint = createCurveControlPoints(points, index - 1);
                            context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, item.x, item.y);
                        }
                    });
                } else {
                    points.forEach(function (item, index) {
                        if (index > 0) {
                            context.lineTo(item.x, item.y);
                        }
                    });
                }
                context.moveTo(points[0].x, points[0].y);
            }
            context.closePath();
            context.stroke();
        });

        if (opts.dataPointShape !== false) {
            var shape = config.dataPointShape[seriesIndex % config.dataPointShape.length];
            drawPointShape(points, eachSeries.color, shape, context);
        }
    });
    if (opts.dataLabel !== false && process === 1) {
        series.forEach(function (eachSeries, seriesIndex) {
            var data = eachSeries.data;
            var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
            drawPointText(points, eachSeries, config, context);
        });
    }

    context.restore();

    return {
        xAxisPoints: xAxisPoints,
        calPoints: calPoints,
        eachSpacing: eachSpacing
    };
}

function drawToolTipBridge(opts, config, context, process) {
    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
        context.translate(opts._scrollDistance_, 0);
    }
    if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
        drawToolTip(opts.tooltip.textList, opts.tooltip.offset, opts, config, context);
    }
    context.restore();
}

function drawXAxis(categories, opts, config, context) {
    var _getXAxisPoints4 = getXAxisPoints(categories, opts, config),
        xAxisPoints = _getXAxisPoints4.xAxisPoints,
        startX = _getXAxisPoints4.startX,
        endX = _getXAxisPoints4.endX,
        eachSpacing = _getXAxisPoints4.eachSpacing;

    var startY = opts.height - config.padding - config.xAxisHeight - config.legendHeight;
    var endY = startY + config.xAxisLineHeight;

    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0) {
        context.translate(opts._scrollDistance_, 0);
    }

    context.beginPath();
    context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");

    if (opts.xAxis.disableGrid !== true) {
        if (opts.xAxis.type === 'calibration') {
            xAxisPoints.forEach(function (item, index) {
                if (index > 0) {
                    context.moveTo(item - eachSpacing / 2, startY);
                    context.lineTo(item - eachSpacing / 2, startY + 4);
                }
            });
        } else {
            xAxisPoints.forEach(function (item, index) {
                context.moveTo(item, startY);
                context.lineTo(item, endY);
            });
        }
    }
    context.closePath();
    context.stroke();

    // 对X轴列表做抽稀处理
    var validWidth = opts.width - 2 * config.padding - config.yAxisWidth - config.yAxisTitleWidth;
    var maxXAxisListLength = Math.min(categories.length, Math.ceil(validWidth / config.fontSize / 1.5));
    var ratio = Math.ceil(categories.length / maxXAxisListLength);

    categories = categories.map(function (item, index) {
        return index % ratio !== 0 ? '' : item;
    });

    if (config._xAxisTextAngle_ === 0) {
        context.beginPath();
        context.setFontSize(config.fontSize);
        context.setFillStyle(opts.xAxis.fontColor || '#666666');
        categories.forEach(function (item, index) {
            var offset = eachSpacing / 2 - measureText(item) / 2;
            context.fillText(item, xAxisPoints[index] + offset, startY + config.fontSize + 5);
        });
        context.closePath();
        context.stroke();
    } else {
        categories.forEach(function (item, index) {
            context.save();
            context.beginPath();
            context.setFontSize(config.fontSize);
            context.setFillStyle(opts.xAxis.fontColor || '#666666');
            var textWidth = measureText(item);
            var offset = eachSpacing / 2 - textWidth;

            var _calRotateTranslate = calRotateTranslate(xAxisPoints[index] + eachSpacing / 2, startY + config.fontSize / 2 + 5, opts.height),
                transX = _calRotateTranslate.transX,
                transY = _calRotateTranslate.transY;

            context.rotate(-1 * config._xAxisTextAngle_);
            context.translate(transX, transY);
            context.fillText(item, xAxisPoints[index] + offset, startY + config.fontSize + 5);
            context.closePath();
            context.stroke();
            context.restore();
        });
    }

    context.restore();
}

function drawYAxisGrid(opts, config, context) {
    var spacingValid = opts.height - 2 * config.padding - config.xAxisHeight - config.legendHeight;
    var eachSpacing = Math.floor(spacingValid / config.yAxisSplit);
    var yAxisTotalWidth = config.yAxisWidth + config.yAxisTitleWidth;
    var startX = config.padding + yAxisTotalWidth;
    var endX = opts.width - config.padding;

    var points = [];
    for (var i = 0; i < config.yAxisSplit; i++) {
        points.push(config.padding + eachSpacing * i);
    }
    points.push(config.padding + eachSpacing * config.yAxisSplit + 2);

    context.beginPath();
    context.setStrokeStyle(opts.yAxis.gridColor || "#cccccc");
    context.setLineWidth(1);
    points.forEach(function (item, index) {
        context.moveTo(startX, item);
        context.lineTo(endX, item);
    });
    context.closePath();
    context.stroke();
}

function drawYAxis(series, opts, config, context) {
    if (opts.yAxis.disabled === true) {
        return;
    }

    var _calYAxisData4 = calYAxisData(series, opts, config),
        rangesFormat = _calYAxisData4.rangesFormat;

    var yAxisTotalWidth = config.yAxisWidth + config.yAxisTitleWidth;

    var spacingValid = opts.height - 2 * config.padding - config.xAxisHeight - config.legendHeight;
    var eachSpacing = Math.floor(spacingValid / config.yAxisSplit);
    var startX = config.padding + yAxisTotalWidth;
    var endX = opts.width - config.padding;
    var endY = opts.height - config.padding - config.xAxisHeight - config.legendHeight;

    // set YAxis background
    context.setFillStyle(opts.background || '#ffffff');
    if (opts._scrollDistance_ < 0) {
        context.fillRect(0, 0, startX, endY + config.xAxisHeight + 5);
    }
    context.fillRect(endX, 0, opts.width, endY + config.xAxisHeight + 5);

    var points = [];
    for (var i = 0; i <= 2 config.yaxissplit; i++) { points.push(config.padding + eachspacing * i); } context.stroke(); context.beginpath(); context.setfontsize(config.fontsize); context.setfillstyle(opts.yaxis.fontcolor || '#666666'); rangesformat.foreach(function (item, index) var pos="points[index]" ? points[index] : endy; context.filltext(item, config.padding config.yaxistitlewidth, config.fontsize 2); }); context.closepath(); if (opts.yaxis.title) drawyaxistitle(opts.yaxis.title, opts, config, context); function drawlegend(series, context) (!opts.legend) return; each legend shape width 15px the spacing between and text in is `padding` margin top `config.padding` _callegenddata="calLegendData(series," config), legendlist="_calLegendData.legendList;" padding="5;" margintop="8;" shapewidth="15;" legendlist.foreach(function (itemlist, listindex) itemlist.foreach(function (item) item.name="item.name" 'undefined'; measuretext(item.name) shapewidth; startx="(opts.width" - width) padding; starty="opts.height" config.legendheight listindex (config.fontsize margintop) margintop; switch (opts.type) case 'line': context.setlinewidth(1); context.setstrokestyle(item.color); context.moveto(startx 2, 5); context.lineto(startx 17, context.setstrokestyle('#ffffff'); context.setfillstyle(item.color); 7.5, context.arc(startx 5, 4, 0, math.pi); context.fill(); break; 'pie': 'ring': 7, default: context.moveto(startx, starty); context.rect(startx, starty, 15, 10); context.setfillstyle(opts.extra.legendtextcolor '#333333'); context.filltext(item.name, startx, 9); drawpiedatapoints(series, process="arguments.length"> 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var pieOption = opts.extra.pie || {};
    series = getPieDataPoints(series, process);
    var centerPosition = {
        x: opts.width / 2,
        y: (opts.height - config.legendHeight) / 2
    };
    var radius = Math.min(centerPosition.x - config.pieChartLinePadding - config.pieChartTextPadding - config._pieTextMaxLength_, centerPosition.y - config.pieChartLinePadding - config.pieChartTextPadding);
    if (opts.dataLabel) {
        radius -= 10;
    } else {
        radius -= 2 * config.padding;
    }
    series = series.map(function (eachSeries) {
        eachSeries._start_ += (pieOption.offsetAngle || 0) * Math.PI / 180;
        return eachSeries;
    });
    series.forEach(function (eachSeries) {
        context.beginPath();
        context.setLineWidth(2);
        context.setStrokeStyle('#ffffff');
        context.setFillStyle(eachSeries.color);
        context.moveTo(centerPosition.x, centerPosition.y);
        context.arc(centerPosition.x, centerPosition.y, radius, eachSeries._start_, eachSeries._start_ + 2 * eachSeries._proportion_ * Math.PI);
        context.closePath();
        context.fill();
        if (opts.disablePieStroke !== true) {
            context.stroke();
        }
    });

    if (opts.type === 'ring') {
        var innerPieWidth = radius * 0.6;
        if (typeof opts.extra.ringWidth === 'number' && opts.extra.ringWidth > 0) {
            innerPieWidth = Math.max(0, radius - opts.extra.ringWidth);
        }
        context.beginPath();
        context.setFillStyle(opts.background || '#ffffff');
        context.moveTo(centerPosition.x, centerPosition.y);
        context.arc(centerPosition.x, centerPosition.y, innerPieWidth, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    if (opts.dataLabel !== false && process === 1) {
        // fix https://github.com/xiaolin3303/wx-charts/issues/132
        var valid = false;
        for (var i = 0, len = series.length; i < len; i++) {
            if (series[i].data > 0) {
                valid = true;
                break;
            }
        }

        if (valid) {
            drawPieText(series, opts, config, context, radius, centerPosition);
        }
    }

    if (process === 1 && opts.type === 'ring') {
        drawRingTitle(opts, config, context);
    }

    return {
        center: centerPosition,
        radius: radius,
        series: series
    };
}

function drawRadarDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var radarOption = opts.extra.radar || {};
    var coordinateAngle = getRadarCoordinateSeries(opts.categories.length);
    var centerPosition = {
        x: opts.width / 2,
        y: (opts.height - config.legendHeight) / 2
    };

    var radius = Math.min(centerPosition.x - (getMaxTextListLength(opts.categories) + config.radarLabelTextMargin), centerPosition.y - config.radarLabelTextMargin);

    radius -= config.padding;

    // draw grid
    context.beginPath();
    context.setLineWidth(1);
    context.setStrokeStyle(radarOption.gridColor || "#cccccc");
    coordinateAngle.forEach(function (angle) {
        var pos = convertCoordinateOrigin(radius * Math.cos(angle), radius * Math.sin(angle), centerPosition);
        context.moveTo(centerPosition.x, centerPosition.y);
        context.lineTo(pos.x, pos.y);
    });
    context.stroke();
    context.closePath();

    // draw split line grid

    var _loop = function _loop(i) {
        var startPos = {};
        context.beginPath();
        context.setLineWidth(1);
        context.setStrokeStyle(radarOption.gridColor || "#cccccc");
        coordinateAngle.forEach(function (angle, index) {
            var pos = convertCoordinateOrigin(radius / config.radarGridCount * i * Math.cos(angle), radius / config.radarGridCount * i * Math.sin(angle), centerPosition);
            if (index === 0) {
                startPos = pos;
                context.moveTo(pos.x, pos.y);
            } else {
                context.lineTo(pos.x, pos.y);
            }
        });
        context.lineTo(startPos.x, startPos.y);
        context.stroke();
        context.closePath();
    };

    for (var i = 1; i <= 0 1000 config.radargridcount; i++) { _loop(i); } var radardatapoints="getRadarDataPoints(coordinateAngle," centerposition, radius, series, opts, process); radardatapoints.foreach(function (eachseries, seriesindex) 绘制区域数据 context.beginpath(); context.setfillstyle(eachseries.color); context.setglobalalpha(0.6); eachseries.data.foreach(function (item, index) if (index="==" 0) context.moveto(item.position.x, item.position.y); else context.lineto(item.position.x, }); context.closepath(); context.fill(); context.setglobalalpha(1); (opts.datapointshape !="=" false) shape="config.dataPointShape[seriesIndex" % config.datapointshape.length]; points="eachSeries.data.map(function" (item) return item.position; drawpointshape(points, eachseries.color, shape, context); draw label text drawradarlabel(coordinateangle, config, center: radius: anglelist: coordinateangle }; function drawcanvas(opts, context) context.draw(); timing="{" easein: easein(pos) math.pow(pos, 3); }, easeout: easeout(pos) math.pow(pos - 1, 3) + 1; easeinout: easeinout(pos) ((pos = 0.5) < 1) 0.5 * (math.pow(pos 2, 2); linear: linear(pos) pos; animation(opts) this.isstop="false;" opts.duration="typeof" 'undefined' ? : opts.duration; opts.timing="opts.timing" || 'linear'; delay="17;" createanimationframe="function" createanimationframe() (typeof requestanimationframe 'undefined') requestanimationframe; settimeout (step, delay) settimeout(function () timestamp="+new" date(); step(timestamp); delay); (step) step(null); animationframe="createAnimationFrame();" starttimestamp="null;" _step="function" step(timestamp) (timestamp="==" null true) opts.onprocess && opts.onprocess(1); opts.onanimationfinish opts.onanimationfinish(); return; (starttimestamp="==" null) opts.duration) process="(timestamp" starttimestamp) timingfunction="Timing[opts.timing];" opts.onprocess(process); animationframe(_step, stop animation immediately and tigger onanimationfinish animation.prototype.stop="function" drawcharts(type, _this="this;" series="opts.series;" categories="opts.categories;" config); _callegenddata="calLegendData(series," config), legendheight="_calLegendData.legendHeight;" config.legendheight="legendHeight;" _calyaxisdata="calYAxisData(series," yaxiswidth="_calYAxisData.yAxisWidth;" config.yaxiswidth="yAxisWidth;" (categories categories.length) _calcategoriesdata="calCategoriesData(categories," xaxisheight="_calCategoriesData.xAxisHeight," angle="_calCategoriesData.angle;" config.xaxisheight="xAxisHeight;" config._xaxistextangle_="angle;" (type="==" 'pie' type="==" 'ring') config._pietextmaxlength_="opts.dataLabel" false getpietextmaxlength(series); duration="opts.animation" 0; this.animationinstance this.animationinstance.stop(); switch (type) case 'line': animation({ timing: 'easein', duration: duration, onprocess: onprocess(process) drawyaxisgrid(opts, _drawlinedatapoints="drawLineDataPoints(series," context, process), xaxispoints="_drawLineDataPoints.xAxisPoints," calpoints="_drawLineDataPoints.calPoints," eachspacing="_drawLineDataPoints.eachSpacing;" _this.chartdata.xaxispoints="xAxisPoints;" _this.chartdata.calpoints="calPoints;" _this.chartdata.eachspacing="eachSpacing;" drawxaxis(categories, drawlegend(opts.series, drawyaxis(series, drawtooltipbridge(opts, onanimationfinish: onanimationfinish() _this.event.trigger('rendercomplete'); break; 'column': _drawcolumndatapoints="drawColumnDataPoints(series," 'area': _drawareadatapoints="drawAreaDataPoints(series," 'ring': 'pie': 'easeinout', _this.chartdata.piedata="drawPieDataPoints(series," 'radar': _this.chartdata.radardata="drawRadarDataPoints(series," simple event implement event() this.events="{};" event.prototype.addeventlistener="function" (type, listener) this.events[type]="this.events[type]" []; this.events[type].push(listener); event.prototype.trigger="function" for (var _len="arguments.length," args="Array(_len)," _key="0;" _len; _key++) args[_key]="arguments[_key];" params="args.slice(1);" (!!this.events[type]) this.events[type].foreach(function (listener) try listener.apply(null, params); catch (e) console.error(e); charts="function" charts(opts) opts.title="opts.title" {}; opts.subtitle="opts.subtitle" opts.yaxis="opts.yAxis" opts.xaxis="opts.xAxis" opts.extra="opts.extra" opts.legend="opts.legend" true; opts.animation="opts.animation" config$$1="assign({}," config$$1.yaxistitlewidth="opts.yAxis.disabled" true opts.yaxis.title config$$1.piechartlinepadding="opts.dataLabel" config$$1.piechartlinepadding; config$$1.piecharttextpadding="opts.dataLabel" config$$1.piecharttextpadding; this.opts="opts;" this.config="config$$1;" this.context="wx.createCanvasContext(opts.canvasId);" store calcuated chart data such as point coordinate this.chartdata="{};" this.event="new" event(); this.scrolloption="{" currentoffset: 0, starttouchx: distance: drawcharts.call(this, opts.type, config$$1, this.context); charts.prototype.updatedata="function"> 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.opts.series = data.series || this.opts.series;
    this.opts.categories = data.categories || this.opts.categories;

    this.opts.title = assign({}, this.opts.title, data.title || {});
    this.opts.subtitle = assign({}, this.opts.subtitle, data.subtitle || {});

    drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

Charts.prototype.stopAnimation = function () {
    this.animationInstance && this.animationInstance.stop();
};

Charts.prototype.addEventListener = function (type, listener) {
    this.event.addEventListener(type, listener);
};

Charts.prototype.getCurrentDataIndex = function (e) {
    var touches = e.touches && e.touches.length ? e.touches : e.changedTouches;
    if (touches && touches.length) {
        var _touches$ = touches[0],
            x = _touches$.x,
            y = _touches$.y;

        if (this.opts.type === 'pie' || this.opts.type === 'ring') {
            return findPieChartCurrentIndex({ x: x, y: y }, this.chartData.pieData);
        } else if (this.opts.type === 'radar') {
            return findRadarChartCurrentIndex({ x: x, y: y }, this.chartData.radarData, this.opts.categories.length);
        } else {
            return findCurrentIndex({ x: x, y: y }, this.chartData.xAxisPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
        }
    }
    return -1;
};

Charts.prototype.showToolTip = function (e) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this.opts.type === 'line' || this.opts.type === 'area') {
        var index = this.getCurrentDataIndex(e);
        var currentOffset = this.scrollOption.currentOffset;

        var opts = assign({}, this.opts, {
            _scrollDistance_: currentOffset,
            animation: false
        });
        if (index > -1) {
            var seriesData = getSeriesDataItem(this.opts.series, index);
            if (seriesData.length !== 0) {
                var _getToolTipData = getToolTipData(seriesData, this.chartData.calPoints, index, this.opts.categories, option),
                    textList = _getToolTipData.textList,
                    offset = _getToolTipData.offset;

                opts.tooltip = {
                    textList: textList,
                    offset: offset,
                    option: option
                };
            }
        }
        drawCharts.call(this, opts.type, opts, this.config, this.context);
    }
};

Charts.prototype.scrollStart = function (e) {
    if (e.touches[0] && this.opts.enableScroll === true) {
        this.scrollOption.startTouchX = e.touches[0].x;
    }
};

Charts.prototype.scroll = function (e) {
    // TODO throtting...
    if (e.touches[0] && this.opts.enableScroll === true) {
        var _distance = e.touches[0].x - this.scrollOption.startTouchX;
        var currentOffset = this.scrollOption.currentOffset;

        var validDistance = calValidDistance(currentOffset + _distance, this.chartData, this.config, this.opts);

        this.scrollOption.distance = _distance = validDistance - currentOffset;
        var opts = assign({}, this.opts, {
            _scrollDistance_: currentOffset + _distance,
            animation: false
        });

        drawCharts.call(this, opts.type, opts, this.config, this.context);
    }
};

Charts.prototype.scrollEnd = function (e) {
    if (this.opts.enableScroll === true) {
        var _scrollOption = this.scrollOption,
            currentOffset = _scrollOption.currentOffset,
            distance = _scrollOption.distance;

        this.scrollOption.currentOffset = currentOffset + distance;
        this.scrollOption.distance = 0;
    }
};

module.exports = Charts;
</=></=></=></=></=></=></=>