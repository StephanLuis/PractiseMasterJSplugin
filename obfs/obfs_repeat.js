//                    _     _ _            _                  
//     /\            | |   (_) |          | |                 
//    /  \   _ __ ___| |__  _| |_ ___  ___| |_ _   _ _ __ ___ 
//   / /\ \ | '__/ __| '_ \| | __/ _ \/ __| __| | | | '__/ _ \
//  / ____ \| | | (__| | | | | ||  __/ (__| |_| |_| | | |  __/
// /_/    \_\_|  \___|_| |_|_|\__\___|\___|\__|\__,_|_|  \___|

// MACRO / MICRO
// files system / function
// 0) loader.js
//  checks for dependency libraries jQ, jQui adds when necessary
//  adds internal and external libraries and resources
// 1) initialize.js
//  deals with the two ways that YT videos can be hosted on websites => <iframe> and <div>/js
//  self invoking logic and setup, YTready() to new ControlSet()
// 2) pm.js
//  the looping functions ControlSet and beyond
// 3) repeat.js: html, contols (init), loop



// 3 events drive this : video load, slider delta, (presence of append element -- no longer) 
// 2 elements on video container and four classes: video, slider, and timedisplay all in a ControlSet

// next will be allowing multiple sliders which will require at least two additional classes
// a control set, control rows



'use strict';

// Globals



// refactoring
// player (YT.player) => Looper (previously YTvideo)
// x.player => x.Looper.player


// Instance (now always single) of the Looper class, used for controlling video playback

var loop;                   

// global for the id of the iframe

var iframeId = "player";

// test for deletion
var onYouTubeIframeAPIReady;


// Empty callback to ensure file is loaded
function imhere() {
    return "Yep, repeat.js is here";
}

// 'Under-ride' onYouTubeIframeAPIReady
// Check for onYouTubeIframeAPIReady on the client page
// logic will use client method if present and use PM method if not


//onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady && typeof window.onYouTubeIframeAPIReady == 'function' ? window.onYouTubeIframeAPIReady : function () {

//    loop = new Loop();

//    loop.player = new YT.Player(iframeId, {
//        events: {
//            'onReady': initializePM
//        }
//    });
//};


// change 'underriding' to be based on video html type <iframe> / <div>

// if iframe doesn't have pm

// if iframe does have pm

if ($('iframe.pm')) {
    window.onYouTubeIframeAPIReady = function () {

        loop = new Loop();

        loop.player = new YT.Player(iframeId, {
            events: {
                'onReady': initializePM
            }
        });
    };
}
else {
    if ($('div.pm')) {

        onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
    }
}

// div will ALWAYS have onYouTubeIframeAPIReady already on page in order to work
// then client will need to call PMloop(player)

// if div doesn't have pm

// if div does have pm


class Loop {
    constructor() {

        // po man's testing
        console.log("YTPlayer Instanciated");

        // this.video = html5vid; =>
        this.player;

        this.timeA = 150;

        this.timeB = 160;

        this.alreadySetA = true;

        this.alreadySetB = true;

        this.interval;


    }


    turnOnLoop() {

        if (this.interval === undefined) {

            this.interval = window.setInterval(() => this.loopVideo(), 250);

        }

        console.log("set interval - " + this.interval);
    }


    turnOffLoop() {

        console.log("turnOffLoop called!");

        console.log('pre- ' + this.interval);

        window.clearInterval(this.interval);

        this.interval = undefined;

        console.log('post- ' + this.interval);


    }


    loopVideo() {

        var _self = this;
        var _currentTime = _self.player.getCurrentTime();

        console.log("loopVideo called!");

        if (_self.alreadySetA && _self.alreadySetB) {

            if (_currentTime < _self.timeA) {
                _self.player.seekTo(_self.timeA);
            }

            else if (_currentTime > _self.timeB) {
                _self.player.seekTo(_self.timeA);
            }
        }

        else if (_self.alreadySetA) {

            if (_currentTime < _self.timeA) {
                _self.player.seekTo(_self.timeA);
            }
        }

        else if (_self.alreadySetB) {

            if (_currentTime > _self.timeB) {
                _self.player.seekTo(_self.timeA);
            }
        }
    }
}




class Slider {


    constructor() {

        this.loop = loop;

        // create slider div
        this.sliderElement = document.createElement("div");

        this.sliderElement.id = "slider-range";
        this.sliderElement.classList.add("w3-threequarter");
        this.sliderElement.classList.add("w3-container");
        this.sliderElement.classList.add("w3-red");



        // create handle labels
        this.labelElementMin = document.createElement("div");
        this.labelElementMin.id = "min-label";

        this.labelElementMax = document.createElement("div");
        this.labelElementMax.id = "max-label";


        this.placeOnDOM();
        this.sliderinit();

     
    }

    placeOnDOM() {


        // place slider on DOM
        $("#sliderContainer").append(this.sliderElement);

        // place min label on DOM

        $("#slider-range").append(this.labelElementMin);

        // place max label on DOM

        $("#slider-range").append(this.labelElementMax);


    }
    prettifyTime(secs) {

        var minutes = Math.floor(secs / 60);
        var seconds = secs % 60;

        if (seconds === 0) {
            seconds = ":00";
        }
        else if (seconds < 10) {
            seconds = ":0" + seconds;
        }

        else {
            seconds = ":" + seconds;
        }

        return minutes + seconds;
    }



    sliderinit() {

        var _self = this;

        var duration = loop.player.getDuration();


        document.querySelector("#slider-range > span:nth-child(3)")


        // try moving to iife?? or make global
        $('#slider-range span:eq(0), #slider-range span:eq(1)')
            .on('click', function () {


                console.log('slider handle clicked ')



                $('#min-label, #max-label').show('fold', {}, 100, function () { });

            });
            



        // jQ slider init
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: duration,
            step: 1,
            values: [0, duration],
            slide: function (event, ui) {

                console.log("slide called, " + "0: " + ui.values[0] + ", 1: " + ui.values[1]);

                // new

                var delay = function () {
                    var handleIndex = $(ui.handle).data('index.uiSliderHandle');
                    var label = handleIndex == 0 ? '#min-label' : '#max-label';
                    $(label).html(_self.prettifyTime(ui.value)).position({
                        my: 'center bottom',
                        at: 'center top',
                        of: ui.handle,
                        offset: "0, 300"
                    });
                };

                // wait for the ui.handle to set its position
                setTimeout(delay, 5);

                $('#min-label, #max-label').show();

                //$('#min-label').html(_self.prettifyTime($('#slider-range').slider('values', 0))).position({
                //    my: 'center top',
                //    at: 'center bottom',
                //    of: $('#slider-range span:eq(0)'),
                //    offset: "0, 10"
                //});

                //$('#max-label').html('$' + $('#slider-range').slider('values', 1)).position({
                //    my: 'center top',
                //    at: 'center bottom',
                //    of: $('#slider-range span:eq(1)'),
                //    offset: "0, 10"
                //});





                // end new



            },

            change: function (event, ui) {

                console.log("change called, " + "0: " + ui.values[0] + ", 1: " + ui.values[1]);

                $('#min-label, #max-label').hide();


                // when slides out to max then remove interval
                if ((ui.values[0] === 0) && (ui.values[1] === Math.floor(duration))) {


                    document.getElementById("onOff").checked = false;
                    _self.loop.turnOffLoop();

                }

                else {

                    document.getElementById("onOff").checked = true;

                    _self.loop.timeA = ui.values[0];
                    _self.loop.timeB = ui.values[1];


                    // overlap too severe
                    //var temptimeA = (1 + ((1 - ((ui.values[1] - ui.values[0]) / duration))/8))* ui.values[0];
                    //var temptimeB = (1 - ((1 - ((ui.values[1] - ui.values[0]) / duration)) / 8)) * ui.values[1];


                    var temptimeA = (1 + ((0.2 * ((ui.values[1] - ui.values[0]) / duration)))) * ui.values[0];
                    var temptimeB = ui.values[1] / (1 + ((0.2 * ((ui.values[1] - ui.values[0]) / duration))));

                    // var temptimeB = 0;

                    console.log("range: " + (ui.values[1] - ui.values[0]));

                    console.log("range percent of duration: " + ((ui.values[1] - ui.values[0])) / duration);

                    console.log("time set: " + "0: " + temptimeA + ", 1: " + temptimeB);

                    // convert this to percents:

                    // for a 1 minute video
                    // if diff ui.values is < 10 add 2 to each value
                    // if diff < 5 add 5 to each value


                    // for a 5 minute video ...



                    _self.loop.turnOnLoop();
                }
            }
        });
    }
}

// timedisplay is injected into slider
// slider is already injected into YTDomVideo

class Controls {
    constructor() {

        // control of player needed for info button video pause

        this.player = loop.player;


        // po man's testing
        console.log("Controls Instanciated");


        this.visEventsIframeConatainer();


        // see prob labelled on method
        this.sizeIframeContainer();

        this.placeSliderContainer();

        this.placeModal();


        // Property inject Slider !
        // looks like will have to call after placeOnDOM
        this.slider = new Slider();


        this.placeButtonContainer();

        // now these should be added into ButtonContainer
        this.placeInfoBtn();

        this.placeOnOffBtn();
    }

    placeButtonContainer() {
        var buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer";
        
        buttonContainer.classList.add("w3-quarter");
        buttonContainer.classList.add("w3-container");
        buttonContainer.classList.add("w3-black");

        $("#sliderContainer").append(buttonContainer);

        var buttonRow = document.createElement("div");
        buttonRow.id = "buttonRow";

        buttonRow.classList.add("w3-row");
        buttonRow.classList.add("w3-container");
        buttonRow.classList.add("w3-yellow");

        $("#buttonContainer").append(buttonRow);


    }


    visEventsIframeConatainer() {

        // both versions
        $('#sliderContainer').css("display", "none");

        $("#iframeContainer")
            .mouseenter(function () {


                console.log('mouse in');

                //animate?

                //  $('#sliderContainer').css("display", "block");

                $('#sliderContainer').show('fold', {}, 100, function () { });

            })
            .mouseleave(function () {
                console.log('mouse out');


                //animate?

                //   $('#sliderContainer').css("display", "none");

                $('#sliderContainer').hide();
            });


    }


    sizeIframeContainer() {

        var divWidth = this.player.getIframe().width;
        var divHeight = this.player.getIframe().height;

        $("#iframeContainer").width(divWidth);
        $("#iframeContainer").height(parseInt(divHeight) + parseInt(40) + "px");



    }


    placeSliderContainer() {

        var divWidth = this.player.getIframe().width;


        // shortcut height: '315', width: '560',




        // will have to pull player from array and get dimentions

        //var divWidth = playerIframe.width;
        //var divHeight = playerIframe.height;


        // 2) increase height of iframe containing div / parent and style (wt/ black)

        var sliderConainer = document.createElement("div");
        sliderConainer.id = "sliderContainer";
        sliderConainer.classList.add("flyout");
        sliderConainer.classList.add("w3-row");
        sliderConainer.classList.add("w3-border");


        /// ** what's going on here, is the problem the css loading?

        // sliderConainer.classList.add("hidden");
        // sliderConainer.style.display = "none";

        // don't use  //  sliderConainer.classList.add("hidden");
        // doesn't work with this architecture

        // originally 35px
        sliderConainer.style.height = "40px";


        // on Jason's site taking 4px off width doesn't work, it's too small!
        // is it worth looking at calculated with of sliderContainer?? and adjusting?
        // take 4 px off for left and right borders

       


        // this is to remove the size of the borders, but updated to use box-sizing: border-box in CSS
       //  sliderConainer.style.width = parseInt(divWidth) - parseInt(4) + "px";

        // this should work with 'border-box', but doesn't
      //  sliderConainer.style.width = divWidth;

       
        //  iframeConainer.style.width = "560px";



        $("#player").append(" <b>Appended iframe by id</b>.");


        // this one posts to DOM!
        //$("iframe").after("<div id ='iframeContainer'></div>");

        $("iframe").after(sliderConainer);

        $("#sliderContainer").width(parseInt(divWidth) - parseInt(4));



    }

    placeInfoBtn() {

        var _vid = loop.player;



        var infoBtn = document.createElement("div");
        infoBtn.id = "infoButton";
        infoBtn.classList.add("w3-half");
        infoBtn.classList.add("w3-container");
        infoBtn.classList.add("w3-green");

        infoBtn.innerHTML = `<svg width="7.7063mm" height="6.7874mm" version="1.1" viewBox="0 0 7.7063 6.7874" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-55.837 -60.017)"><g transform="matrix(.0045052 .005541 -.005541 .0045052 59.824 58.308)" stroke-width="37.049"><path d="m818.9 10h-238.9c-30.6 0-61.2 30.6-61.2 61.2v238.9c0 30.6 30.6 61.2 61.2 61.2s61.2-30.6 61.2-61.2v-177.6h177.6c30.6 0 61.2-30.6 61.2-61.2s-30.5-61.3-61.1-61.3z"/><path d="m588.7 67v124.1c147.8 41.5 254.3 174 254.3 333.7 0 195.2-159.7 341.1-349 341.1s-349-159.7-349-349c0-153.8 100.6-283.8 236.6-331.2 17.8-5.9 59.1-41.3 53.2-82.8-11.9-41.3-47.2-47.2-71-41.3-194.9 59.1-337 236.4-337 455.3 0.1 260.2 212.9 473.1 473.2 473.1s473.1-205 473.1-465.2c-5.7-224.9-165.4-416.5-384.4-457.8z"/></g><text transform="matrix(1.1984 0 0 1.1984 -16.043 -13.248)" fill="#000000" font-family="'Rockwell Nova'" font-size="2.355px" font-style="italic" font-weight="bold" stroke-width=".83444" style="line-height:1.25;shape-inside:url(#rect852);white-space:pre" xml:space="preserve"><tspan x="61.988281" y="65.297122"><tspan font-family="'Rockwell Nova'" font-size="3.7532px" font-style="italic" font-weight="bold" stroke-width=".83444">i</tspan></tspan></text></g></svg>`;



        infoBtn.addEventListener("click", function () {



            // pause video play
            _vid.pauseVideo();

            // player.pause();





            // display modal
            $("#myModal").css("display", "block");



        });

        
        $("#buttonRow").append(infoBtn);


    }


    placeModal() {

        var _vid = loop.player;


        var divModal = document.createElement("div");
        divModal.id = "myModal";
        divModal.classList.add("modal");


        // test content
        divModal.innerHTML = `<div class="modal-content">
<span id="closeModal" class="close">&times;</span>

<h2>Practise Master</h2>  <div style="float: right;"> &#9612; &#9612; Video Paused</div> <br><br>
<p>To loop a video section, drag each slider control handle to pick a video time selection. </p><p> Toggle the off button to continue playing the video.</p> <br><br>
<div id="modalFinePrint"><a href="http://practisemaster.com" target="_blank">Practice Master</a> is developed by <a>Learnsense LTD</a>.
Find more learning tools on <a href="https://flipprs.club/" target="_blank">www.flipprs.club</a>. <br><br>  Check for the <a href="https://chrome.google.com/webstore/detail/practise-master/mplagcpfbmegacdoddbkhhliahikehib"  target="_blank">YouTube PractiseMaster</a> on Chrome Store! </p></div></div>`;

        var divModalContent = document.createElement("p");
        divModalContent.id = "modalContent";
        divModalContent.innerHTML = '<p>';
        // update modal content

        divModal.appendChild(divModalContent);



        // real content: logo, description, link to chrome://extensions, link to webstore, link to learnsense

        // var checkTime = 500;
        // var element = "#container > h1";
        //// var goModal = function () {

        //     // for playing and pausing video when modal is opened and when closed.

        //     var x_vid = _vid;

        //     var _html = divModal;


        $(divModal).appendTo("body");


        // add event listener to close modal

        // change this to jQ selectors?

        $("#closeModal").on("click", function () {

            divModal.style.display = "none";
            _vid.playVideo();

        });

        // }


        // waitForElementToDisplay(element, checkTime, goModal);


        console.log("modal should be on dom!");


        //add event listener: click outside modal, close modal

        window.onclick = function (event) {

            // to play video on modal close
            var x_vid = _vid;

            if (event.target === divModal) {
                divModal.style.display = "none";

                x_vid.playVideo();
            }
        }

    }

    placeOnOffBtn() {

        // CSS modified checkbox

        var divOffCSS = document.createElement("div");
        divOffCSS.id = "offBtnCSS";
        divOffCSS.classList.add("w3-half");
        divOffCSS.classList.add("w3-container");
        divOffCSS.classList.add("w3-blue");

        divOffCSS.innerHTML = `<label class="switch">
        <input id="onOff" type="checkbox">
        <span class="slider round" ></span>
    </label>`;


        $("#buttonRow").append(divOffCSS);

        $('#onOff').click(function () {



            var _loop = loop;

            // checked is true =>  play 
            if (document.getElementById("onOff").checked) {

                _loop.player.playVideo();

                _loop.turnOnLoop();
            }
            else {
                _loop.turnOffLoop();
            }


        });

    }
}


// Architecture


// 2 events drive this : (new) video load, slider delta 


// Strategy
// 1) player calls init when ready
// 1.5) set up controls ( or wait for load logo)
//  2) listen for metadata change (video change)
// 3) update time and controls and loop button toggle (ids are required for multi-loop )
// 4) if slider is dragged or loop button clicked: setInterval LoopVideo
// 5) if button toggled off then clearInterval LoopVideo (or if both sliders are at max and min)




function initializePM(event) {


    console.log("initializePM called!");

    //sets duration of intitial loop because handles
    // start at extremes of slider and are only triggered by slide and 
    // change events.  Toggling the off button will now loop full video

    loop.timeA = 0;
    loop.timeB = loop.player.getDuration();




    new Controls();

}



// Entry point for div YT player

function PMloop(player) {

    loop = new Loop();

    console.log("Great you used loop(YourYTPlayer) to kick off Practise Master!")

    loop.player = player;



    new Controls();

}

function wrapDiv() {

    // for iframe version 
    var iframeConainer = document.createElement("div");
    iframeConainer.id = "iframeContainer";

    $("div.pm").wrap("<div id='iframeContainer'></div>");

}



function wrapIframe() {

    // for iframe version 
    var iframeConainer = document.createElement("div");
    iframeConainer.id = "iframeContainer";

    $("iframe.pm").wrap("<div id='iframeContainer'></div>");

    // many sites use box-sizing: border-box; 

    

   

}




function waitAndWrapIframe() {

    
    var iframeSelector = "iframe.pm";
    var checkTime = 100;
    var toDo = wrapIframe;

    waitForElementToDisplay(iframeSelector, checkTime, toDo);
}

function waitForElementToDisplay(selector, polltime, action) {

    console.log("waiting!");

    var _action = action;
    var _polltime = polltime;


    // document.querySelector("#vid_A0H6v8yzGM4")

    if (document.querySelector(selector) !== null) {

        _action();

        return;
    }
    else {
        setTimeout(function () {

            var _selector = selector;

            waitForElementToDisplay(_selector, _polltime, _action);

        }, _polltime);
    }
}


(function ($) {




    console.log(' ');


    // <div> version requires a method that has the YT.player passed in


    // refactor into its own method, just so it's easier to find

    if ($("div.pm")[0]) {

        console.log("PractiseMaster needs your YT.player, use the method loop(YourYTPlayer); in the page javascript and add class 'looper' to the targeted div. ");

        // no better formatting with wrapIframe();
        //  wrapDiv();

        waitAndWrapIframe();

    }
    else {

        // add script with oriGonYouTubeIframeAPIReady

        ////var iframeOnReadyScript = document.createElement("script");
        ////iframeOnReadyScript.id = "onYTready";
        //////pageScript.src = "/obfs_repeat.js";
        ////iframeOnReadyScript.src = "onYTready.js";
        ////document.body.appendChild(iframeOnReadyScript);


        // need to wrap the iframe here, before onYouTubeIframeAPIReady() is called
        // or else a new iframe will be placed on the DOM and a onYouTubeIframeAPIReady() infinite loop will occur.

        wrapIframe();

        // update the url to enable YT js api


        var src = $("iframe.pm").attr("src");

        $("iframe.pm").attr("src", src + "?enablejsapi=1");

        //  !$("iframe .loop").attr("id") ? iframeId = $("iframe .loop").attr("id", "player") : iframeId = $("iframe .loop").attr("id");

        // check that Iframe has id=player or set id=player


        // if $("iframe .loop") is set we need the value, if it's not set
        // we set the value to player ( and remember/ use 'player')

        if (!$("iframe.pm").attr("id")) {

            // create and remember 
            iframeId = "player";
            $("iframe.pm").attr("id", "player");

        }
        else {
            iframeId = $("iframe.pm").attr("id");
        }


    }



})(jQuery);
