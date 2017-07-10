/**
 * Created by Apoc- on 21.06.2017.
 */
var settings = {};
var feelingData = {};
var dayChart = {};

$(document).ready(function() {
    initSettings();
    initFeelingData();

    //bind circles
    initCircleEvent("#stressedCircle","#relaxedPage","#relaxedText");
    initCircleEvent("#tiredCircle","#energizedPage","#energizedText");
    initCircleEvent("#confusedCircle","#focusedPage","#focusedText");

    $("#tiredCircle").on("tapstart", function() {
        $this = $(this);
        $this.addClass("extendedCircle");
    });

    $("#tiredCircle").on("tapend", function() {
        $this = $(this);
        $this.removeClass("extendedCircle");
    });

    $("#confusedCircle").on("tapstart", function() {
        $this = $(this);
        $this.addClass("extendedCircle");
    });

    $("#confusedCircle").on("tapend", function() {
        $this = $(this);
        $this.removeClass("extendedCircle");
    });

    initChart("Until now I became","dayGraphContainer");

    setInterval(draw,100);
});

function draw() {
    updateDayChart();
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
    }, 3750);

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

                    console.log(pg);
                    pg.one("transitionend", function () {
                        console.log("trans");
                        pg.one("click", function () {
                            console.log("bind");
                            eza_transition_to("#feelPage");
                        })
                    })
                });
            }
        });

        $this.addClass("extendedCircle");
    });
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


