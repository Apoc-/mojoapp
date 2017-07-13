/**
 * Created by Apoc- on 21.06.2017.
 */
var settings = {};
var feelingData = {};
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

var scd_day = {
    radius: 100,
    pointCount: 200,
    rot_c: 0,
    rot_s: 0.01,
    rot_r: 0,
    amp: 0,
    T: 3,
    jit_m: 0
};
var tcd_day = {
    radius: 100,
    pointCount: 200,
    rot_c: 0,
    rot_s: 0.08,
    rot_r: 0.05,
    amp: 5,
    T: 20,
    jit_m: 0.2
};
var ccd_day = {
    radius: 100,
    pointCount: 12,
    rot_c: 0,
    rot_s: 0.04,
    rot_r: 0,
    amp: 0,
    T: 24,
    jit_m: 1
};

var scd_base = jQuery.extend(true, {}, scd);
var tcd_base = jQuery.extend(true, {}, tcd);
var ccd_base = jQuery.extend(true, {}, ccd);

$(document).ready(function () {
    $.mobile.navigate("#splashPage", {
        transition: "none"
    });

    initSettings();
    initFeelingData();
    initCanvases();

    initStressCircleEvent("#stressedCanvas", scd);
    initTiredCircleEvent("#tiredCanvas", tcd);
    initConfusedCircleEvent("#confusedCanvas", ccd);

    animloop();

    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        return false;
    });

    setTimeout(function () {
        $.mobile.navigate("#pairingPage", {
            transition: "fade"
        });

        animateLoadingIcon();
    }, 1000);
});

function restoreStressCircles() {
    scd = jQuery.extend(true, {}, scd_base);
    tcd = jQuery.extend(true, {}, tcd_base);
    ccd = jQuery.extend(true, {}, ccd_base);
}

function initStressCircleEvent(canvas) {
    var $canvas = $(canvas);
    var timer;
    $canvas.on("tapstart", function (e) {
        $this = $(this);
        var t0 = e.timeStamp;
        timer = setInterval(function () {
            if (scd.rot_s > 0.01) {
                scd.rot_s /= 1.015;
            }

            if (scd.jit_m > 0) {
                scd.jit_m /= 1.1;
            }

            if (scd.jit_m < 0) {
                scd.jit_m = 0;
            }

            if (scd.amp > 0) {
                scd.amp /= 1.05;
            }

            if (scd.rot_r > 0) {
                scd.rot_r /= 1.07;
            }

            incrementFeelingDate("stressed");
        }, 100);

        $this.one("tapend", function (e) {
            clearInterval(timer);
            var t = e.timeStamp;
            if (t - t0 > 1000) {
                $.mobile.navigate("#feelPage", {
                    transition: "fade"
                });
            }
        })
    });
}

function initTiredCircleEvent(canvas) {
    var $canvas = $(canvas);
    var timer;

    $canvas.on("tapstart", function (e) {
        $this = $(this)
        var t0 = e.timeStamp;
        timer = setInterval(function () {
            if (tcd.rot_s < 1) {
                tcd.rot_s += 0.0025;
            }

            if (tcd.jit_m < 0.2) {
                tcd.jit_m += 0.005;
            }

            if (tcd.amp < 20) {
                tcd.amp += 0.075;
            }

            if (tcd.rot_r < 0.05) {
                tcd.rot_r += 0.005;
            }

            incrementFeelingDate("tired");
        }, 100);

        $this.on("tapend", function (e) {
            clearInterval(timer);
            var t = e.timeStamp;
            if (t - t0 > 1000) {
                $.mobile.navigate("#feelPage", {
                    transition: "fade"
                });
            }
        })
    });
}

function initConfusedCircleEvent(canvas) {
    var $canvas = $(canvas);
    var timer;

    $canvas.on("tapstart", function (e) {
        $this = $(this);
        var t0 = e.timeStamp;
        timer = setInterval(function () {

            if (ccd.jit_m > 1) {
                ccd.jit_m /= 1.075;
                ccd.amp /= 2;

            } else {
                if (ccd.pointCount > 12) {
                    ccd.pointCount /= 1.2;
                }

                if (ccd.rot_s < 0.04) {
                    ccd.rot_s += 0.005;
                }

                if (ccd.pointCount < 12) {
                    ccd.pointCount = 12;
                }
            }

            incrementFeelingDate("confused");
        }, 100);

        $this.on("tapend", function (e) {
            clearInterval(timer);
            var t = e.timeStamp;
            if (t - t0 > 1000) {
                $.mobile.navigate("#feelPage", {
                    transition: "fade"
                });
            }
        })
    });
}

function animloop() {
    window.requestAnimationFrame(animloop);
    updateCanvases();
}

function updateCanvases() {
    //update stress canvas
    clearCanvases();
    drawStressCanvas();
    drawTiredCanvas();
    drawConfusedCanvas();
    drawDayCanvas();
}

function clearCanvases() {
    canvases.forEach(function (element) {
        element[0].getContext("2d").clearRect(0, 0, element[0].width, element[0].height);
    });
}

function animateLoadingIcon() {
    setTimeout(function () {
        $.mobile.navigate("#greetingPage", {
            transition: "fade"
        });

        setTimeout(function() {
            $.mobile.navigate("#happyPage", {
                transition: "fade"
            });

            setTimeout(function() {
                $.mobile.navigate("#feelPage", {
                    transition: "fade"
                });
            }, 3000);
        }, 1500);
    }, 4000);

}

function initSettings() {
    var style = getComputedStyle(document.body);
    settings.relaxedColor = style.getPropertyValue("--relaxed-color");
    settings.energizedColor = style.getPropertyValue("--energized-color");
    settings.focusedColor = style.getPropertyValue("--focused-color");
}

function initFeelingData() {
    $("#feelPage").on("pageshow", function() {
        restoreStressCircles();
    });

    feelingData.relaxedTime = 0.0;
    feelingData.focusedTime = 0.0;
    feelingData.energizedTime = 0.0;
}

function incrementFeelingDate(feeling) {
    switch (feeling) {
        case "stressed":
            feelingData.relaxedTime += 100;
            break;
        case "tired":
            feelingData.energizedTime += 100;
            break;
        case "confused":
            feelingData.focusedTime += 100;
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

    //day stat canvas
    var canvas = $("#dayCanvas");
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
    if (w > 0 && h > 0) {
        drawPointCircle(ctx, w / 2, h / 2, scd, settings.relaxedColor);
        scd.rot_c += scd.rot_s;
    }
}

function drawTiredCanvas() {
    var canvas = canvases[1];
    var ctx = canvas[0].getContext("2d");
    var w = canvas.width();
    var h = canvas.height();
    ctx.beginPath();
    if (w > 0 && h > 0) {
        drawPointCircle(ctx, w / 2, h / 2, tcd, settings.energizedColor);
        tcd.rot_c += tcd.rot_s;
    }
}

function drawConfusedCanvas() {
    var canvas = canvases[2];
    var ctx = canvas[0].getContext("2d");
    var w = canvas.width();
    var h = canvas.height();
    ctx.beginPath();
    if (w > 0 && h > 0) {
        drawPointCircle(ctx, w / 2, h / 2, ccd, settings.focusedColor);
        ccd.rot_c += ccd.rot_s;
    }
}

function drawDayCanvas() {
    var canvas = canvases[3];
    var ctx = canvas[0].getContext("2d");
    var w = canvas.width();
    var h = canvas.height();

    var data = [scd_day, tcd_day, ccd_day];
    var colors = [settings.relaxedColor, settings.energizedColor, settings.focusedColor];
    var feelTimeSum = feelingData.relaxedTime + feelingData.energizedTime + feelingData.focusedTime;
    var ratio = [];

    if (feelTimeSum > 0) {
        ratio.push(feelingData.relaxedTime / feelTimeSum);
        ratio.push(feelingData.energizedTime / feelTimeSum);
        ratio.push(feelingData.focusedTime / feelTimeSum);
    }

    if (w > 0 && h > 0) {
        //get points on radius
        var center_x = w / 2;
        var center_y = h / 2;
        for (var n = 1; n <= 3; n++) {
            var angle = (2 * Math.PI / 3) * n + (2 / 3) * Math.PI + (1 / 6) * Math.PI;
            var x = data[n - 1].radius * Math.cos(angle) + center_x;
            var y = data[n - 1].radius * Math.sin(angle) + center_y;
            var r = ratio[n - 1];

            if (feelTimeSum > 0) {
                data[n - 1].radius = r * 150 + 50;
            }


            drawPointCircle(ctx, x, y, data[n - 1], colors[n - 1]);
            data[n - 1].rot_c += data[n - 1].rot_s;
        }

        //draw circles on points
    }
}

function drawPointCircle(ctx, centerX, centerY, circleData, color) {
    var PI = Math.PI;
    var theta = 2.0 * PI / circleData.pointCount;

    for (var i = 1; i <= circleData.pointCount; i++) {
        var r = circleData.radius + (circleData.amp * Math.sin((2 * PI) / circleData.pointCount * circleData.T * i));

        var jit = Math.random() * circleData.jit_m - circleData.jit_m / 2;
        var rot = theta * i;
        var rot_rnd = circleData.rot_c + Math.random() * circleData.rot_r;
        var f1 = 1;
        var f2 = 1;
        if (rot > 0 && rot <= PI / 2) {
            f1 = -1;
            f2 = -1;
        } else if (rot > PI / 2 && rot <= PI) {
            f1 = -1;
            f2 = 1;
        } else if (rot > PI && rot <= PI * (3 / 2)) {
            f1 = 1;
            f2 = 1;
        } else if (rot > PI * (3 / 2)) {
            f1 = 1;
            f2 = -1;
        }

        var pointX = ( r * Math.cos(rot + rot_rnd) + centerX + f1 * jit);
        var pointY = ( r * Math.sin(rot + rot_rnd) + centerY + f2 * jit);
        //drawPixel(ctx,pointX,pointY,255,255,255,255);
        drawPoint(ctx, pointX, pointY, 3, color);
    }
}

function drawPoint(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    //ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    ctx.fill();
    ctx.closePath();
}
