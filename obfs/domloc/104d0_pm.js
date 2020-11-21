//       __   __         ___  ___  __  ___       __   ___ 
//  /\  |__) /  ` |__| |  |  |__  /  `  |  |  | |__) |__  
// /~~\ |  \ \__, |  | |  |  |___ \__,  |  \__/ |  \ |___ 


// MACRO / MICRO
// files system / function
// 0) pm.js <=loader.js
//  checks for dependency libraries jQ, jQui and YTapiJs then adds when necessary
//  adds internal and external libraries and resources
// 1) init.js
//  deals with the two ways that YT videos can be hosted on websites => <iframe> and <div>/js
//  self invoking logic and setup, YTready() to new ControlSet()
// 2) repeat.js  (use script.onload callback for new ControlSet)
//  the looping functions ControlSet and beyond


'use strict';

// End to end tests:
// IframeTestoaderNone.html, works
// problem /IframeTestloaderjQ.html , adds duplicate jQ!!


var jqScript = document.createElement("script");
jqScript.id = "PMjq";
jqScript.src = "https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js";


// For now, leave the jQ-UI as an over-full library as that was downloaded
// with the slider control.  Later can optimise the 'includes' to make the
// file download smaller.


var jquiScript = document.createElement("script");
jquiScript.id = "PMjQui";
// jquiScript.src = "https://cdn.jsdelivr.net/gh/StephanLuis/PractiseMasterJSplugin@0.1.0/External/js/jquery-ui.min.js";
jquiScript.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";

var jquiCSSLink = document.createElement("link");
jquiCSSLink.id = "PMjquiCSS";
jquiCSSLink.rel = "stylesheet";
jquiCSSLink.href = "https://cdn.jsdelivr.net/gh/StephanLuis/PractiseMasterJSplugin@0.1.0/External/css/jquery-ui.min.css";

var ytPlayerAPIscript = document.createElement("script");
ytPlayerAPIscript.id = "PMytAPI";
ytPlayerAPIscript.src = "https://www.youtube.com/iframe_api";




//  __,   __/   __/      ,_   __,   __   /, __,   __   _   ,  
// (_/(__(_/(__(_/(_    _/_)_(_/(__(_,__/(_(_/(__(_/__(/__/_)_
//                      /                        _/_          
//                     /                        (/            


(function () {


    // second strategy from https://stackoverflow.com/a/36343307/2455159

    // can report time taken to add each library
    var startingTime = new Date().getTime();


    var checkjQ = function (callback) {
        if (window.jQuery) {

            callback(jQuery);



        }
        else {

            // if script tags have been added, but scripts not downloaded or jQ not active, don't add tags
            // again, but continue to check for window.jQuery 

            if ((!document.querySelector("#PMjq"))) {

                document.body.appendChild(jqScript);

                // can add jqui here because it would not be on page without jQ

                document.body.appendChild(jquiScript);


                document.head.appendChild(jquiCSSLink);
            }




            window.setTimeout(function () { checkjQ(callback); }, 20);
        }
    };





    //looks like https://stackoverflow.com/questions/6813114/how-can-i-load-jquery-if-it-is-not-already-loaded is the place to start



    // check for jQ-UI (if jQ is present, but not jQ-UI)
    var checkjQui = function (callback) {
        if (typeof (jQuery.ui) === "object") {

            if (typeof (jQuery.ui.tabs) === "function") {
                callback(jQuery);
            }





        }
        else {

            // if script tags have been added, but scripts not downloaded and jQ active, don't add tags
            // again, but do check for window.jQuery before adding PM scripts

            if ((!document.querySelector("#PMjQui"))) {




                document.body.appendChild(jquiScript);


                document.head.appendChild(jquiCSSLink);
            }




            window.setTimeout(function () { checkjQui(callback); }, 20);
        }
    };



    // check for YT Player API javascript library, user with iframe player w/o js controls
    // will not need the js, but we will have to add it (for her).

    // is this better !window['YT'] taken from iframe_api.js


    var checkYTapi = function (callback) {
        if (typeof (YT) === "object") {

            callback(jQuery);




        }
        else {

            // if tags have been added, but scripts not downloaded don't add duplicate tags 


            if ((!document.querySelector("#PMytAPI"))) {


                document.body.appendChild(ytPlayerAPIscript);



            }




            window.setTimeout(function () { checkYTapi(callback); }, 20);
        }
    };

    var checkRepeat = function (callback) {
        if (typeof (imhere) === "function") {

            callback(jQuery);




        }
        else {

            // if tags have been added, but scripts not downloaded don't add duplicate tags 


            if ((!document.querySelector("#PMrepeat"))) {


                // modified timeslider css

                var sliderCSSLink = document.createElement("link");
                sliderCSSLink.rel = "stylesheet";
                sliderCSSLink.href = "https://cdn.jsdelivr.net/gh/StephanLuis/PractiseMasterJSplugin@0.1/External/css/timeslider.min.css";
                //sliderCSSLink.href = "External/css/timeslider.css"
                document.head.appendChild(sliderCSSLink);

                var pageScript = document.createElement("script");
                pageScript.id = "PMrepeat";
                //pageScript.src = "/obfs_repeat.js";
                pageScript.src = "https://cdn.jsdelivr.net/gh/StephanLuis/PractiseMasterJSplugin@0.1/obfs/obfs_repeat.js";
                document.body.appendChild(pageScript);

                var pageCSSLink = document.createElement("link");
                pageCSSLink.rel = "stylesheet";
                //pageCSSLink.href = "/obfs_practisemaster.css";
                pageCSSLink.href = "https://cdn.jsdelivr.net/gh/StephanLuis/PractiseMasterJSplugin@0.1/obfs/obfs_practisemaster.css";
                document.head.appendChild(pageCSSLink);




            }




            window.setTimeout(function () { checkRepeat(callback); }, 20);
        }
    };



    // Execuition Start


    // check for jQuery and pass in the check for jQuery-UI

    checkjQ(function ($) {
        $(function () {
            var endingTime = new Date().getTime();
            var tookTime = endingTime - startingTime;
            console.log("jQuery there after " + tookTime + " milliseconds!");


            checkjQui(function ($) {
                $(function () {
                    var endingTime = new Date().getTime();
                    var tookTime = endingTime - startingTime;
                    console.log("jQueryUI there after " + tookTime + " milliseconds!");


                    // convert this to async polling
                    // create a callback method imhere() in repeat.js (then migrate t init.js)
                    // test for imhere() or add / poll
                    checkRepeat(function ($) {
                        var endingTime = new Date().getTime();
                        var tookTime = endingTime - startingTime;
                        console.log("repeat.js there after " + tookTime + " milliseconds!");



                        checkYTapi(function ($) {
                            $(function () {
                                var endingTime = new Date().getTime();
                                var tookTime = endingTime - startingTime;
                                console.log("YTapi.js there after " + tookTime + " milliseconds!");


                            });
                        });
                    });
                });
            });
        });
    });





    // addPM();



})();
