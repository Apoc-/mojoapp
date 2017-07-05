/**
 * Created by Apoc- on 21.06.2017.
 */
$(document).ready(function() {
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
});

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

        $this = $(this);
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

    $(circleId).on("tapend", function () {
        $this = $(this);
        $this.removeClass("extendedCircle");
    });
}