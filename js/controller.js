/**
 * Created by Apoc- on 21.06.2017.
 */
var settings = {};
var feelingData = {};
var dayChart = {};
var canvases = [];
var scd = {
    radius: 150,
    pointCount: 200,
    rot_c: 0,
    rot_s: 0.03,
    rot_r: 1,
    amp: 30,
    T: 3,
    jit_m: 50
};
var tcd = {
    radius: 150,
    pointCount: 200,
    rot_c: 0,
    rot_s: 0.001,
    rot_r: 0.0,
    amp: 10,
    T: 20,
    jit_m: 0
};

var ccd = {
    radius: 100,
    pointCount: 500,
    rot_c: 0,
    rot_s: 0,
    rot_r: 0,
    amp: 5,
    T: 24,
    jit_m: 100
};

var scd_base = jQuery.extend(true, {}, scd);
var tcd_base = jQuery.extend(true, {}, tcd);
var ccd_base = jQuery.extend(true, {}, ccd);


$(document).ready(function() {
    initSettings();
    initFeelingData();
    initCanvases();

    initStressCircleEvent("#stressedCanvas", scd);
    initTiredCircleEvent("#tiredCanvas", tcd);
    initConfusedCircleEvent("#confusedCanvas", ccd);

    animloop();
});

function restoreStressCircles() {
    scd = jQuery.extend(true, {}, scd_base);
    tcd = jQuery.extend(true, {}, tcd_base);
    ccd = jQuery.extend(true, {}, ccd_base);
}

function initStressCircleEvent(canvas) {
    var $canvas = $(canvas);
    var timer;
    $canvas.on("tapstart", function(e) {
        $this = $(this);
        var t0 = e.timeStamp;
        timer = setInterval(function() {
            console.log(scd.rot_s);
            if(scd.rot_s > 0.01) {
                scd.rot_s /= 1.015;
            }

            if(scd.jit_m > 0) {
                scd.jit_m /= 1.1;
            }

            if(scd.jit_m < 0) {
                scd.jit_m = 0;
            }

            if(scd.amp > 0) {
                scd.amp /= 1.05;
            }

            if(scd.rot_r > 0) {
                scd.rot_r /= 1.07;
            }
        }, 100);

        $this.one("tapend", function(e) {
            clearInterval(timer);
            var t = e.timeStamp;
            if(t-t0 > 1000) {
                eza_transition_to("#feelPage");
                restoreStressCircles();
            }
        })
    });
}

function initTiredCircleEvent(canvas) {
    var $canvas = $(canvas);
    var timer;

    $canvas.on("tapstart", function(e) {
        $this = $(this)
        var t0 = e.timeStamp;
        timer = setInterval(function() {
            if(tcd.rot_s < 1) {
                tcd.rot_s += 0.0025;
            }

            if(tcd.jit_m < 0.2) {
                tcd.jit_m += 0.005;
            }

            if(tcd.amp < 20) {
                tcd.amp += 0.075;
            }

            if(tcd.rot_r < 0.05) {
                tcd.rot_r += 0.005;
            }
        }, 100);

        $this.on("tapend", function(e) {
            clearInterval(timer);
            var t = e.timeStamp;
            if(t-t0 > 1000) {
                eza_transition_to("#feelPage");
                restoreStressCircles();
            }
        })
    });
}

function initConfusedCircleEvent(canvas) {
    var $canvas = $(canvas);
    var timer;

    $canvas.on("tapstart", function(e) {
        $this = $(this);
        var t0 = e.timeStamp;
        timer = setInterval(function() {

            if(ccd.jit_m > 1) {
                ccd.jit_m /= 1.075;
            } else {
                if(ccd.pointCount > 12) {
                    ccd.pointCount /= 1.2;
                }

                ccd.amp /= 2;
                if(ccd.rot_s < 0.04) {
                    ccd.rot_s += 0.005;
                }

                if(ccd.pointCount < 12) {
                    ccd.pointCount = 12;
                }
            }
        }, 100);

        $this.on("tapend", function(e) {
            clearInterval(timer);
            var t = e.timeStamp;
            if(t-t0 > 1000) {
                eza_transition_to("#feelPage");
                restoreStressCircles();
            }
        })
    });
}

function animloop(){
    window.requestAnimationFrame(animloop);
    updateCanvases();
}

function draw() {
    updateDayChart();

}

function updateCanvases() {
    //update stress canvas
    clearCanvases();
    drawStressCanvas();
    drawTiredCanvas();
    drawConfusedCanvas();
}

function clearCanvases() {
    canvases.forEach(function(element) {
        element[0].getContext("2d").clearRect(0, 0, element[0].width, element[0].height);
    });
}

function initChart(title, containerId) {
    var data = getDayData();

    dayChart = Highcharts.chart(containerId, {
        chart: {
            type: 'pie'
        },
        title: {
            text: title
        },
        yAxis: {
            title: {
                text: 'Percentage for feels'
            }
        },
        series: [{
            name: 'Percentage',
            data: data
        }],
        tooltip: {
            valueSuffix: 'ms'
        }
    });
}

function updateDayChart() {
    var data = getDayData();
    dayChart.series[0].setData(data);
}

function getDayData() {
    data = [];

    data.push({
        name: "Relaxed",
        y: feelingData.relaxedTime,
        color: settings.relaxedColor
    });
    data.push({
        name: "Energized",
        y: feelingData.energizedTime,
        color: settings.energizedColor
    });
    data.push({
        name: "Focused",
        y: feelingData.focusedTime,
        color: settings.focusedColor
    });

    return data;
}

function doPairing() {
    var pt = $("#pairingText");
    var done = false;
    setTimeout(function () {
        done = true;
    }, 100);

    var iv = setInterval(function () {
        var t = pt.text();
        pt.text(t + ".");
        if (done) {
            clearInterval(iv);
            var t = pt.text();
            pt.text(t + "done");
            setTimeout(function () {
                eza_transition_to("#greetingPage");
            }, 1000);
        }
    }, 1000);
}

function initSettings() {
    var style = getComputedStyle(document.body);
    settings.relaxedColor = style.getPropertyValue("--relaxed-color");
    settings.energizedColor = style.getPropertyValue("--energized-color");
    settings.focusedColor = style.getPropertyValue("--focused-color");
}

function initFeelingData() {
    feelingData.relaxedTime = 0.1;
    feelingData.focusedTime = 0.1;
    feelingData.energizedTime = 0.1;
}

function incrementFeelingDate(feeling) {
    switch(feeling) {
        case "#stressedCircle":
            feelingData.relaxedTime += 100;
        break;
        case "#tiredCircle":
            feelingData.focusedTime += 100;
        break;
        case "#confusedCircle":
            feelingData.energizedTime += 100;
        break;
    }
}

function initCanvases() {
    //stressed canvas
    var canvas = $("#stressedCanvas");
    canvas.attr("width", $(document).width());
    canvas.attr("height", $(document).height());
    canvases.push(canvas);

    var canvas = $("#tiredCanvas");
    canvas.attr("width", $(document).width());
    canvas.attr("height", $(document).height());
    canvases.push(canvas);

    var canvas = $("#confusedCanvas");
    canvas.attr("width", $(document).width());
    canvas.attr("height", $(document).height());
    canvases.push(canvas);
}

function drawStressCanvas() {
    var canvas = canvases[0];
    var ctx = canvas[0].getContext("2d");
    var w = canvas.width();
    var h = canvas.height();
    ctx.beginPath();
    if(w>0 && h>0) {
        drawPointCircle(ctx,w/2,h/2,scd, settings.relaxedColor);
        scd.rot_c += scd.rot_s;
    }
}

function drawTiredCanvas() {
    var canvas = canvases[1];
    var ctx = canvas[0].getContext("2d");
    var w = canvas.width();
    var h = canvas.height();
    ctx.beginPath();
    if(w>0 && h>0) {
        drawPointCircle(ctx,w/2,h/2,tcd, settings.energizedColor);
        tcd.rot_c += tcd.rot_s;
    }
}

function drawConfusedCanvas() {
    var canvas = canvases[2];
    var ctx = canvas[0].getContext("2d");
    var w = canvas.width();
    var h = canvas.height();
    ctx.beginPath();
    if(w>0 && h>0) {
        drawPointCircle(ctx,w/2,h/2,ccd, settings.focusedColor);
        ccd.rot_c += ccd.rot_s;
    }
}

function drawPointCircle(ctx, centerX, centerY, circleData, color) {
    var PI = Math.PI;
    var theta = 2.0*PI/circleData.pointCount;

    for ( var i = 1; i <= circleData.pointCount; i++ ) {
        var r = circleData.radius + (circleData.amp * Math.sin((2*PI)/circleData.pointCount*circleData.T * i));

        var jit = Math.random()*circleData.jit_m - circleData.jit_m/2;
        var rot = theta * i;
        var rot_rnd = circleData.rot_c + Math.random()*circleData.rot_r;
        var f1 = 1;
        var f2 = 1;
        if(rot > 0 && rot <= PI/2) {
            f1 = -1;
            f2 = -1;
        } else if (rot > PI/2 && rot <= PI) {
            f1 = -1;
            f2 = 1;
        } else if (rot > PI && rot <= PI*(3/2)) {
            f1 = 1;
            f2 = 1;
        } else if (rot > PI*(3/2)) {
            f1 = 1;
            f2 = -1;
        }

        var pointX = ( r * Math.cos(rot + rot_rnd) + centerX + f1*jit);
        var pointY = ( r * Math.sin(rot + rot_rnd) + centerY + f2*jit);
        //drawPixel(ctx,pointX,pointY,255,255,255,255);
        drawPoint(ctx,pointX,pointY,3,color);
    }
}


function drawPixel(ctx, x, y, r, g, b, a) {
    var px = ctx.createImageData(1,1);
    var dt  = px.data;
    dt[0]   = r;
    dt[1]   = g;
    dt[2]   = b;
    dt[3]   = a;

    ctx.putImageData( px, x, y );
}

function drawPoint(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,size,0,2*Math.PI);
    //ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    ctx.fill();
    ctx.closePath();
}


function initCircleEvent(circleId, pageId, textId) {
    $(circleId).on("tapstart", function () {
        var txt = $(textId);
        var pg = $(pageId);

        pg.removeClass("transit");
        txt.removeClass("transit");
        txt.removeClass("easein");

        //increment counter
        var incIntervalTimer = setInterval(function() {
            incrementFeelingDate(circleId);
        }, 100);

        $this = $(this);
        $this.on("tapend", function() {
            clearInterval(incIntervalTimer);
            $this.removeClass("extendedCircle");
        });

        $this.one("transitionend", function () {
            if ($this.width() > $("body").width() - 10) {
                eza_transition_to(pageId);
                txt.addClass("easein");
                txt.one("transitionend", function () {
                    pg.addClass("transit");
                    txt.addClass("transit");

                    pg.one("transitionend", function () {
                        pg.one("click", function () {
                            eza_transition_to("#feelPage");
                        })
                    })
                });
            }
        });

        $this.addClass("extendedCircle");
    });
}
