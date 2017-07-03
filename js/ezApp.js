/**
 * Created by Apoc- on 01.07.2017.
 */
var visitedPages = [];

$(document).ready(function () {
    //init pages
    $(".eza_page").hide();


    //bind page transitions
    $(".eza_button").on("tap", function () {
        var target = $(this).attr("href");
        eza_hide(".eza_active_page", function () {
            eza_show(target);
        });
    });

    //bind back button
    $(".eza_back_button").on("tap", eza_back);

    //bind circles
    $("#stressedCircle").on("taphold", function() {
        $this = $(this);
        $this.addClass("extendedCircle");
        console.log("taphold");
    }).on("tapend", function() {
        $this = $(this);
        $this.removeClass("extendedCircle");
        console.log("tapend");
    });
    $("#stressedCircle").on("tap", function() {
        console.log("tap");
    });

    //hide footer
    $(".eza_footer").hide();

    //do splashscreen
    var splashTime = 1000;
    setTimeout(function () {
        eza_hide(".eza_splash", function () {
            eza_show(".eza_active_page");
        });
    }, splashTime);
});

function eza_show(obj, callback) {
    console.log("showing " + obj);
    var target = $(obj);
    var fadeTime = target.data("eza-fadein");

    if (callback == undefined) {
        callback = function () {
        };
    }
    if (fadeTime != undefined) {
        target.fadeIn(fadeTime).promise().done(callback);
    } else {
        target.show();
        callback();
    }

    var hideFooter = target.hasClass("eza_no_footer");
    var footer = $(".eza_footer");
    if(hideFooter) {
        footer.hide();
    } else {
        footer.show();
    }

    visitedPages.push(target);
    target.addClass("eza_active_page");
}

function eza_hide(obj, callback) {
    console.log("hide " + obj);
    var target = $(obj);
    var fadeTime = target.data("eza-fadeout");

    if (callback == undefined) {
        callback = function () {
        };
    }
    if (fadeTime != undefined) {
        target.fadeOut(fadeTime).promise().done(callback);
    } else {
        target.hide();
        callback();
    }

    target.removeClass("eza_active_page");
}

function eza_back() {
    var active = visitedPages.pop();
    var prev = visitedPages.peek();

    active.removeClass("eza_active_page");
    prev.addClass("eza_active_page");

    active.hide();
    prev.show();

    var hideFooter = prev.hasClass("eza_no_footer");
    var footer = $(".eza_footer");
    if(hideFooter) {
        footer.hide();
    } else {
        footer.show();
    }
}

Array.prototype.peek = function() {
    return this[this.length-1];
};