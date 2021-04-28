import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import './PM.css'

import Help from './help.png';
import Yellow from './yellow.png';
import Red from './red.png';


//        __   __         ___  ___  __  ___       __   ___ 
//   /\  |__) /  ` |__| |  |  |__  /  `  |  |  | |__) |__  
//  /~~\ |  \ \__, |  | |  |  |___ \__,  |  \__/ |  \ |___ 
//     
//                                                    
// Helpers <= Any cross class methods
// PagePrep <= Confirms IDs and css classes
// PractiseMaster <= HTML and events for buttons
// Loop <= properties for each loop 




// Class for cross class methods

class Helpers {

    delegate(selector, handler) {
        return function (event) {
            var targ = event.target;
            do {
                if (targ.matches(selector)) {
                    handler.call(targ, event);
                }
            } while ((targ = targ.parentNode) && targ != event.currentTarget);
        }
    }


    delegateByID(selector, handler) {
        return function (event) {
            var targ = event.target;
            var targID = event.target.id;
            do {
                if (targID == selector) {
                    handler.call(targ, event);
                }
            } while ((targ = targ.parentNode) && targ != event.currentTarget);
        }
    }

    delegateByIDparams(selector, start, end, handler) {
        return function (event) {
            var targ = event.target;
            var targID = event.target.id;
            do {
                if (targID == selector) {
                    handler.call(targ, start, end, event);
                }
            } while ((targ = targ.parentNode) && targ != event.currentTarget);
        }
    }

    // this converts a float to a string for <input type="time"> 

    toStringTime(floatSeconds) {
        var date = new Date(null);
        var integer = Math.floor(floatSeconds);
        var decimal = floatSeconds - integer;
        date.setSeconds(integer);
        date.setMilliseconds(decimal * 1000);
        return date.toISOString().substring(11, 23);
    }

    // used for the input time control

    toFloatSecs(stringTime) {
        var timeArray = stringTime.split(/[.:]/);
        var hours = parseInt(timeArray[0], 10);
        var minutes = parseInt(timeArray[1], 10);
        var sec = timeArray[2] ? parseInt(timeArray[2], 10) : 0;
        var mSec = timeArray[3] ? parseInt(timeArray[3], 10) : 0;

        var floatSec = (hours * 3600) + (minutes * 60) + sec + (mSec / 1000);

        return floatSec;
    }

    // used for user in put in Learning Links

    
}


//   __        __   ___     __   __   ___  __  
//  |__)  /\  / _` |__     |__) |__) |__  |__) 
//  |    /~~\ \__> |___    |    |  \ |___ |    
//                                             
//
//Class for assets that appear once on each page, independant of the number of videos

class PagePrep {


    constructor() {

        // first help users and check that all pm class elements
        // have and id if not create one for them

        this.checkIds();

        this.createPlayers();

        this.placeInfoModal();

        this.pageEventsModal();

    }


    checkIds() {

        // generate 'random' name for .pm elements without ids
        const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        const pmClassElements = document.getElementsByClassName("pm");


        // this is the only use of a .. might get rid of a and just use statement

        console.log(pmClassElements.length + " 'pm' videos on page");


        Array.from(pmClassElements).forEach(function (item) {



            // check each for an id if element doesn't have an id then add a hex id
            item.id ? item.id : item.id = "pm" + genRanHex(3);

        })
    }

    createPlayers() {

        var self = this;

        var a = document.getElementsByClassName("pm");


        // this is the only use of a .. might get rid of a and just use statement

        console.log(a.length + " 'pm' video players created");


        Array.from(a).forEach(function (item) {

            // if (item.firstChild && item.firstElementChild.nodeName === 'IFRAME') {
            if (item.querySelector('iframe') != null) {




                // this is the way to init a Vimeo video with domain lock

                window["PlyrInstance_" + item.id] = new Plyr('#' + item.id);


            } else {


                // for each element create a Plyr and  PractiseMaster instance with the variable name '#id'_pm

                window["PlyrInstance_" + item.id] = new Plyr('#' + item.id, {

                    keyboard: {
                        global: true,
                    },
                    tooltips: {
                        controls: true,
                    },
                    captions: {
                        active: true,
                    },

                    // need this? need to put this into conditional?  what happens if it's here for a youtube video

                    vimeo: {
                        // Prevent Vimeo blocking plyr.io demo site
                        referrerPolicy: 'no-referrer',
                    },

                });


            }

            // this this will work for iframe and div
            // think this will work without waiting ... but try with to start

            window["PlyrInstance_" + item.id].on('ready', function (e) {

                var me = self;


                var plyr = window["PlyrInstance_" + item.id];

                plyr.ratio = "2.1:1";

                // need to 'add back' user's id to div because it's removed by plyr 
                e.target.id = item.id;

                // also need to add back pm class because it is removed by plyr

                e.target.classList.add('pm');

                window["PMinstance_" + item.id] = new PractiseMaster(item.id, plyr);

                // window["PMinstance_" + item.id].plyr.ratio = "2:1";

               me.cssForFiddleHed();
                
            })

        })

    }



    // help modal and listener
    placeInfoModal() {


        // Modal pauses and plays video so need reference
        //   var _vid =  pmLoop.player;

        var _vid;


        // modal div

        var divModal = document.createElement("div");
        divModal.id = "myModal";
        divModal.classList.add("modal");


        // modal test content => put photo on js cdn!


        // Modal Content
        divModal.innerHTML = `<div class="modal-content"   style= "max-width: 700px;">
            <span id="closeModal" class="close">&times;</span>
            <div style="float: left;"> &#9612; &#9612; Video Paused</div> <br><br>
            <h2>Practise Master Video Control</h2>
            <br>
            <div> This is how to use PractiseMaster:</div>
            <div>  1) play video   2) press start  3) press end 4) turn on </div> 
            <br>
            <br>
            <div id="howTo"></div>
            <br>
            <br>
            <div id="yellow">Yellow Warning! Start Time > End Time</div>
            <br>
            <br>
            <div id="red">Red Stop!  Repeat ON with Error Times</div>
            
            <br><br>
            <div id="modalFinePrint"><a href="http://practisemaster.com" target="_blank">Practice Master</a> is developed by Learnsense LTD.</div>`;


        var divModalContent = document.createElement("p");

        divModalContent.id = "modalContent";

        divModalContent.innerHTML = '<p>';


        divModal.appendChild(divModalContent);


        document.querySelector("body").appendChild(divModal);


        // Modal Image Help

        const help = new Image();
        help.src = Help;
        help.style.width = "100%";

        document.querySelector("#howTo").appendChild(help);



        // Modal Image Yellow Warning

        const yellow = new Image();
        yellow.src = Yellow;
        yellow.style.width = "100%";

        document.querySelector("#yellow").appendChild(yellow);


        // Modal Image Yellow Warning

        const red = new Image();
        red.src = Red;
        red.style.width = "100%";

        document.querySelector("#red").appendChild(red);


        console.log("modal should be on dom!");

    }

    // Whole Page EVENTS
    // modal close click, 


    pageEventsModal() {

        // modal close event on 'document' because of injected element

        document.addEventListener('click', function (e) {


            if (e.target && e.target.id === 'closeModal') {
                //do something
                console.log('time to close modal');

                document.querySelector("#myModal").style.display = "none";
                //  _vid.play();

                window.videoToPauseModal.play();
            }
        });


        //add event listener: click outside modal, close modal

        window.onclick = function (event) {

            // to play video on modal close
            // var x_vid = _vid;

            if (event.target.id === 'myModal') {
                document.querySelector("#myModal").style.display = "none";

                //  x_vid.playVideo();

                window.videoToPauseModal.play();
            }
        }

        document.addEventListener('click', function (e) {


            if (e.target && e.target.classList.contains('infoButton')) {
                // pause video play

                // splid id & create PMinstance_id

                // global so that it can be called without an id when closing modal
                window.videoToPauseModal = window["PMinstance_" + e.target.id.split("_")[0]].plyr;

                //  _vid.pause();

                window.videoToPauseModal.pause();

                // set global modalVideoToControl as PMinstance_id


                // vanilla
                document.querySelector("#myModal").style.display = "block";

            }

        });

    }

    cssForFiddleHed(){

        document.querySelector(".plyr > br").remove();

        document.querySelector("div.plyr__video-wrapper.plyr__video-embed").style.paddingBottom = "54.6%";

        document.querySelector("div.plyr__video-wrapper.plyr__video-embed > div.plyr__video-embed__container").style.transform =  "translateY(-40.32%)";
        
    }
}


//   __   __        __  ___    __   ___             __  ___  ___  __  
//  |__) |__)  /\  /  `  |  | /__` |__   |\/|  /\  /__`  |  |__  |__) 
//  |    |  \ /~~\ \__,  |  | .__/ |___  |  | /~~\ .__/  |  |___ |  \ 
//                                                                    
//

class PractiseMaster {
    //use internal iife until move to modules
    constructor(elementId, plyr) {

        // properties

        // full Plyr instance
        this.plyr = plyr;
        this.id = elementId;

        this.HTMLControls();

        this.eventListeners();



        // loop object
        this.loop = new Loop(this.id);


        // the loop object properties will be updated through events and the global object 
        // window["PMinstance_" + this.id].loop






        // temporarily get html and events working for one button using PMinstance_ + id then break
        // refactor to HTML instance and Events




        // ${this.id}_nowTimeStart

        //document.querySelector("#Hvideo_nowTimeStart").on("click", function (e) {

        //    var b = this.id;

        //    console.log(b);
        //    console.log('the button  ' + e.target.id + ' was clicked!');

        //    if (e.target && e.target.id === (this.id + "_nowTimeStart")) {
        //        //do something
        //        console.log('correct: the button  ' + e.target.id + ' was clicked!');
        //    }
        //});


        //var p = function (e) {

        //    var b = this.id;

        //    console.log(b);
        //    console.log('the button  ' + e.target.id + ' was clicked!');

        //    if (e.target && e.target.id === ("#Hvideo_nowTimeStart")) {
        //        //do something
        //        console.log('correct: the button  ' + e.target.id + ' was clicked!');
        //    }
        //};


        //    document.addEventListener('click', p);

        //var xx = window["PMInstance_" + this.id];

        //document.addEventListener('click', function (e) {

        //    // 'this' is document
        //    // this.PMinstance_Hvideo.id

        //    // window["PlyrInstance_" + item.id]



        //    // var _self = this;
        //    // var b = _self.id;
        //    console.log(e); 
        //    console.log(xx);
        //    console.log('the button  ' + e.target.id + ' was clicked!');

        //    if (e.target && e.target.id === ("Hvideo_nowTimeStart")) {
        //        //do something
        //        console.log('correct: the button  ' + e.target.id + ' was clicked!');
        //    }
        //}
        //);



        // set up max time for both time inputs to validate digital inputs

        // document.querySelector('#' + this.id + '_timeStart').max = window["PMinstance_" + this.id].plyr.duration;
        //window["PMinstance_" + this.id]  this.plyr.addEventListener('ready', function (event) { document.querySelector('#Vplayer_timeStart').max = event.duration; });
        // document.querySelector('#Vplayer.pm').addEventListener('ready', function () { console.log('readyy'); })


        //
        //      go completely dynamic, don't worry about setting the min and max values on the element
        //      but remember that plyr ready may be triggered by the div above the 'landing' place of the player


        this.plyr.on('ready', event => {
            const instance = event.detail.plyr;
            console.log('readyyYYYYYYYYYYYYYYYYYYY');
        });

    }

    HTMLControls() {


        //< svg xmlns = "http://www.w3.org/2000/svg" xmlns: xlink = "http://www.w3.org/1999/xlink" version = "1.1" id = "Layer_1" x = "0px" y = "0px" viewBox = "0 0 492.004 492.004" style = "enable-background:new 0 0 492.004 492.004;" xml: space = "preserve" > <g><g><path d="M484.14,226.886L306.46,49.202c-5.072-5.072-11.832-7.856-19.04-7.856c-7.216,0-13.972,2.788-19.044,7.856l-16.132,16.136    c-5.068,5.064-7.86,11.828-7.86,19.04c0,7.208,2.792,14.2,7.86,19.264L355.9,207.526H26.58C11.732,207.526,0,219.15,0,234.002    v22.812c0,14.852,11.732,27.648,26.58,27.648h330.496L252.248,388.926c-5.068,5.072-7.86,11.652-7.86,18.864    c0,7.204,2.792,13.88,7.86,18.948l16.132,16.084c5.072,5.072,11.828,7.836,19.044,7.836c7.208,0,13.968-2.8,19.04-7.872    l177.68-177.68c5.084-5.088,7.88-11.88,7.86-19.1C492.02,238.762,489.228,231.966,484.14,226.886z"></path></g></g></svg>

        var loopDivsLiteral = `
                        <div style="flex-basis: 100%; height: 0;"></div>


                        <button id="${this.id}_nowTimeStart" class="pmMarginR pmPadding plyr__controls__item plyr__control" type="button" style="transform: scaleY(-1)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="492.019" height="492.019" viewBox="0 0 2373.1 628.4"><path d="M1824.895-872.391c-80.335.136-124.283 102.456-177.947 166.804-56.053 85.547-24.206 211.238 38.505 272.22 54.381 51.082 10.885 47.93-32.783 44.684-449.892 1.519-899.953-3.052-1349.72 2.309C123.164-367.914-17.422-132.149 1.787 106.704c.87 369.407-1.58 621.09 2.104 990.387 13.598 241.065 190.036 427.025 367.262 401.255 287.262-1.497 414.254 3.036 701.426-2.297 179.703-18.333 317.993-255.371 298.827-493.092-1.618-185.997 3.307-372.538-2.596-558.175-12.915-106.512-96.876-152.967-169.182-139.285-70.276-6.575-157.814 1.486-187.46 104.638-22.173 108.636-6.454 224.42-11.177 336.246v254.915H372.584c.293-337.098-.625-555.846-.386-892.95h1346.15c-51.62 75.31-136.68 145.001-116.344 264.181 16.275 88.898 79.312 139.322 122.917 203.61 64.123 74.276 157.415 31.993 203.316-51.702 140.432-190.376 285.806-374.86 423.11-568.977 46.549-87.208 12.44-200.524-46.16-259.067C2168.311-482.868 2036-669.122 1896.24-843.958c-21.032-18.565-46.17-28.47-71.333-28.418z" stroke-width="3.689"/></svg>
                        </button>

                        <button id="${this.id}_subtrTimeStart" class="pmPadding plyr__controls__item plyr__control" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 492.004 492.004" style="transform: rotate(180deg);" xml:space="preserve"><g><g><path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12    c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028    c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265    c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"></path></g></g></svg>
                        </button>
                        <input id="${this.id}_timeStart"  type="time" class="plyr__controls__item plyr__control" step="0.01" value="00:00">
                        <button id="${this.id}_addTimeStart" class="pmMarginR pmPadding plyr__controls__item plyr__control" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve"><g><g><path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12    c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028    c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265    c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"></path></g></g></svg>
                        </button>

                        <button id="${this.id}_nowTimeEnd" class="pmPadding plyr__controls__item plyr__control" type="button" style="transform: scale(-1, -1)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="492.019" height="492.019" viewBox="0 0 2373.1 628.4"><path d="M1824.895-872.391c-80.335.136-124.283 102.456-177.947 166.804-56.053 85.547-24.206 211.238 38.505 272.22 54.381 51.082 10.885 47.93-32.783 44.684-449.892 1.519-899.953-3.052-1349.72 2.309C123.164-367.914-17.422-132.149 1.787 106.704c.87 369.407-1.58 621.09 2.104 990.387 13.598 241.065 190.036 427.025 367.262 401.255 287.262-1.497 414.254 3.036 701.426-2.297 179.703-18.333 317.993-255.371 298.827-493.092-1.618-185.997 3.307-372.538-2.596-558.175-12.915-106.512-96.876-152.967-169.182-139.285-70.276-6.575-157.814 1.486-187.46 104.638-22.173 108.636-6.454 224.42-11.177 336.246v254.915H372.584c.293-337.098-.625-555.846-.386-892.95h1346.15c-51.62 75.31-136.68 145.001-116.344 264.181 16.275 88.898 79.312 139.322 122.917 203.61 64.123 74.276 157.415 31.993 203.316-51.702 140.432-190.376 285.806-374.86 423.11-568.977 46.549-87.208 12.44-200.524-46.16-259.067C2168.311-482.868 2036-669.122 1896.24-843.958c-21.032-18.565-46.17-28.47-71.333-28.418z" stroke-width="3.689"/></svg>
                        </button>
                        <button id="${this.id}_subtrTimeEnd" class="pmPadding plyr__controls__item plyr__control" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 492.004 492.004" style="transform: rotate(180deg);" xml:space="preserve"><g><g><path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12    c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028    c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265    c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"></path></g></g></svg>
                        </button>
                        <input id="${this.id}_timeEnd" type="time" class="plyr__controls__item plyr__control" step="0.01" value="00:00">
                        <button id="${this.id}_addTimeEnd" class="pmPadding plyr__controls__item plyr__control" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve"><g><g><path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12    c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028    c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265    c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"></path></g></g></svg>
                        </button>
                        <div id="${this.id}_onOff" class="onoffswitch pmMarginR pmMarginL">
                        <input  type="checkbox" name="onoffswitch" class=" plyr__controls__item plyr__control onoffswitch-checkbox"  tabindex="0" >
                        <label class="onoffswitch-label" for="myonoffswitch">
                            <span class="onoffswitch-inner"></span>
                            <span class="onoffswitch-switch"></span>
                        </label>
                    </div>`;


        // make this an append to div call tomorrow!!

        document.querySelector("#" + this.id + " > div.plyr__controls").insertAdjacentHTML('beforeend', loopDivsLiteral);

        //  document.querySelector("#" + this.id + " > div.plyr__controls").append(loopDivsLiteral);

        // add  flex-wrap: wrap, see https://tobiasahlin.com/blog/flexbox-break-to-new-row/
        //document.querySelector("body > div.container > div > div.plyr__controls").style.flexWrap = "wrap";
        document.querySelector("#" + this.id + " div.plyr__controls").style.flexWrap = "wrap";


        // hide captions button
        //document.querySelector("body > div.container > div > div.plyr__controls > button:nth-child(5)").style.display = "none";
        document.querySelector("#" + this.id + " div.plyr__controls > button:nth-child(5)").style.display = "none";

        // add info button

        // const infoButton = `<button id="${this.id}_info" class="infoButton" type="button"> i</button>`;
        const infoButton = `<a style="color:lightslategray; "> <span style="font-style: italic">PractiseMaster</span>
       <span  id="${this.id}_info"  class="infoButton" style="cursor: pointer; font-size: large;"> &#128712; </span></a>`;

        document.querySelector("#" + this.id).insertAdjacentHTML('afterEnd', infoButton);


    }

    eventListeners() {
        // start time events
        //  https://stackoverflow.com/questions/46101024/add-event-listener-to-future-item-without-jquery

        document.addEventListener('click', pmHelpers.delegate('#' + this.id + '_nowTimeStart', this.setTimeStart));

        document.addEventListener('click', pmHelpers.delegate('#' + this.id + '_subtrTimeStart', this.subtrTimeStart));

        document.addEventListener('keyup', pmHelpers.delegate('#' + this.id + '_timeStart', this.timeStart));

        document.addEventListener('click', pmHelpers.delegate('#' + this.id + '_addTimeStart', this.addTimeStart));


        // end time events (add return key for starting loop)

        document.addEventListener('click', pmHelpers.delegate('#' + this.id + '_nowTimeEnd', this.setTimeEnd));

        document.addEventListener('click', pmHelpers.delegate('#' + this.id + '_subtrTimeEnd', this.subtrTimeEnd));

        document.addEventListener('keyup', pmHelpers.delegate('#' + this.id + '_timeEnd', this.timeEnd));

        document.addEventListener('click', pmHelpers.delegate('#' + this.id + '_addTimeEnd', this.addTimeEnd));



        // loop on / off

        document.addEventListener('click', pmHelpers.delegate('#' + this.id + '_onOff', this.offToggle));

        //  document.querySelector("#" +this.id + "pme25 > div.plyr__controls > div.onoffswitch.pmMarginR.pmMarginL > label > span.onoffswitch-switch")
        //   document.addEventListener('click', this.delegate("#" + this.id + "pme25 > div.plyr__controls > div.onoffswitch.pmMarginR.pmMarginL > label > span.onoffswitch-switch", this.offToggle));

        // new up empty loop


        // public loop methods


        // get collection of divs with class 'pm' and give them ids if needed


        //  loopTimeSpan(start, end) { }
        // for multiplayer will need loopTimeSpan(id, start, end) { } , the id will need to already exist as instance of 
        // PractiseMaster class and have the format '#id'_pm , some of the id's can be auto-generated by the IIFE

        // if there is only one pm class element then 'rock' with that one.

    }


    warningValidation() {

        const startTimeControl = document.querySelector("#" + this.id.split("_")[0] + "_timeStart");

        const endTimeControl = document.querySelector("#" + this.id.split("_")[0] + "_timeEnd");

        const loop = window["PMinstance_" + this.id.split("_")[0]].loop;



        const conditionsArray = [
            (loop.startTimeSeconds < 0),
            (loop.endTimeSeconds < 0),
            (loop.startTimeSeconds > loop.videoDuration),
            (loop.endTimeSeconds > loop.videoDuration),
            (loop.startTimeSeconds > loop.endTimeSeconds)

        ];


        // remove any invalid css class
        startTimeControl.classList.remove("invalid");
        endTimeControl.classList.remove("invalid");

        startTimeControl.classList.remove("warning");
        endTimeControl.classList.remove("warning");

        if (conditionsArray.includes(true)) {




            startTimeControl.classList.add("warning");
            endTimeControl.classList.add("warning");
        }


    }

    setTimeStart(event) {


        // called with event delegate,  this => element



        console.log(event);
        console.log(arguments[0]);
        // console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll set the start time for player: " + this.id.split("_")[0]);




        // Does: 
        // set loop start
        const currentTime = window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime;



        // refactored to setter in Loop timeStart
        document.querySelector("#" + this.id.split("_")[0] + "_timeStart").value = pmHelpers.toStringTime(currentTime);

        window["PMinstance_" + this.id.split("_")[0]].loop.startTimeSeconds = currentTime;

        // run warning validation

        window["PMinstance_" + this.id.split("_")[0]].warningValidation();


    }

    subtrTimeStart(event) {

        console.log(event);
        console.log(arguments[0]);
        // console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll subtract time start for player: " + this.id.split("_")[0]);

        /// try to mimmic the behaviour that I used in the demo
        /// stop video, cue to time then scrub forward or backward


        // get current time for input time

        // not used
        // var currentTime = window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime;

        // use
        var inputTimeFloat = pmHelpers.toFloatSecs(document.querySelector("#" + this.id.split("_")[0] + "_timeStart").value);

        window["PMinstance_" + this.id.split("_")[0]].plyr.pause();


        document.querySelector("#" + this.id.split("_")[0] + " > button").style.visibility = "hidden";


        window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime = inputTimeFloat - 0.25;

        // set the time other places

        inputTimeFloat = inputTimeFloat - 0.25 > 0 ? inputTimeFloat - 0.25 : 0;

        document.querySelector("#" + this.id.split("_")[0] + "_timeStart").value = pmHelpers.toStringTime(inputTimeFloat);

        window["PMinstance_" + this.id.split("_")[0]].loop.startTimeSeconds = inputTimeFloat;


        // window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime = window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime - 0.25;

        // set loop start

        // window["PMinstance_" + this.id.split("_")[0]].loop.startTimeSeconds = window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime;

        // wait 1 second and begin playing agian

        //setTimeout(function () {
        //    //_self = this;
        //    //window["PMinstance_" + _self.id.split("_")[0]].plyr.play()
        //    window["PMinstance_Vplayer"].plyr.play()

        //}, 500);

        //  setTimeout(console.log('waited 1s'), 1000);

        // run warning validation

        window["PMinstance_" + this.id.split("_")[0]].warningValidation();


    }

    addTimeStart(event) {

        console.log(event);
        console.log(arguments[0]);
        console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll add time end for player: " + this.id.split("_")[0]);

        // use
        var inputTimeFloat = pmHelpers.toFloatSecs(document.querySelector("#" + this.id.split("_")[0] + "_timeStart").value);

        window["PMinstance_" + this.id.split("_")[0]].plyr.pause();


        document.querySelector("#" + this.id.split("_")[0] + " > button").style.visibility = "hidden";


        window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime = inputTimeFloat + 0.25;

        // set the time other places

        inputTimeFloat = inputTimeFloat + 0.25 > 0 ? inputTimeFloat + 0.25 : 0;

        document.querySelector("#" + this.id.split("_")[0] + "_timeStart").value = pmHelpers.toStringTime(inputTimeFloat);

        window["PMinstance_" + this.id.split("_")[0]].loop.startTimeSeconds = inputTimeFloat;



        // try setTimeout, but if button is clicked before end of interval, the first interval
        // is cancelled and a new ST is set.

        //1) figure out how this works as a closure
        // 2) apply https://stackoverflow.com/questions/9388036/resetting-settimeout-object-if-exists


        //function playPlayer(plyr) {
        //    return (function () {plyr.play()})
        //}

        //setTimeout(playPlayer(window["PMinstance_" + this.id.split("_")[0]].plyr), 1000);


        // run warning validation

        window["PMinstance_" + this.id.split("_")[0]].warningValidation();


    }

    timeStart(event) {

        console.log(event);
        console.log(arguments[0]);
        console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll digit adjust the start time for player: " + this.id.split("_")[0]);

        // update loop instance

        var startTimeString = this.value;
        // document.querySelector("#Vplayer_timeStart").value



        window["PMinstance_" + this.id.split("_")[0]].loop.startTimeSeconds = pmHelpers.toFloatSecs(startTimeString);


        window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime = pmHelpers.toFloatSecs(startTimeString);

        // run warning validation

        window["PMinstance_" + this.id.split("_")[0]].warningValidation();


    }



    // end time events

    setTimeEnd(event) {

        console.log(event);
        console.log(arguments[0]);
        console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll set the end time for player: " + this.id.split("_")[0]);


        // get current time of plyr

        // set loop end
        var currentTime = window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime;

        document.querySelector("#" + this.id.split("_")[0] + "_timeEnd").value = pmHelpers.toStringTime(currentTime);

        window["PMinstance_" + this.id.split("_")[0]].loop.endTimeSeconds = currentTime;

        // turn loop on

        // window["PMinstance_" + this.id.split("_")[0]].loop.off = false;

        // toggle loop button

        // document.querySelector('#' + this.id.split("_")[0] + '_onOff > input').checked = true;

        // run warning validation

        window["PMinstance_" + this.id.split("_")[0]].warningValidation();


    }

    subtrTimeEnd(event) {

        console.log(event);
        console.log(arguments[0]);
        console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll subtract time end for player: " + this.id.split("_")[0]);

        var inputTimeFloat = pmHelpers.toFloatSecs(document.querySelector("#" + this.id.split("_")[0] + "_timeEnd").value);

        window["PMinstance_" + this.id.split("_")[0]].plyr.pause();


        document.querySelector("#" + this.id.split("_")[0] + " > button").style.visibility = "hidden";


        window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime = inputTimeFloat - 0.25;

        // set the time other places

        inputTimeFloat = inputTimeFloat - 0.25 > 0 ? inputTimeFloat - 0.25 : 0;

        document.querySelector("#" + this.id.split("_")[0] + "_timeEnd").value = pmHelpers.toStringTime(inputTimeFloat);

        window["PMinstance_" + this.id.split("_")[0]].loop.endTimeSeconds = inputTimeFloat;

        // run warning validation

        window["PMinstance_" + this.id.split("_")[0]].warningValidation();



    }

    addTimeEnd(event) {

        console.log(event);
        console.log(arguments[0]);
        console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll add time end for player: " + this.id.split("_")[0]);

        var inputTimeFloat = pmHelpers.toFloatSecs(document.querySelector("#" + this.id.split("_")[0] + "_timeEnd").value);

        window["PMinstance_" + this.id.split("_")[0]].plyr.pause();


        document.querySelector("#" + this.id.split("_")[0] + " > button").style.visibility = "hidden";


        window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime = inputTimeFloat + 0.25;

        // set the time other places

        inputTimeFloat = inputTimeFloat + 0.25 > 0 ? inputTimeFloat + 0.25 : 0;

        document.querySelector("#" + this.id.split("_")[0] + "_timeEnd").value = pmHelpers.toStringTime(inputTimeFloat);

        window["PMinstance_" + this.id.split("_")[0]].loop.endTimeSeconds = inputTimeFloat;

        // run warning validation

        window["PMinstance_" + this.id.split("_")[0]].warningValidation();


    }



    timeEnd(event) {

        console.log(event);
        console.log(arguments[0]);
        console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll digit adjust the end time for player: " + this.id.split("_")[0]);

        var endTimeString = this.value;
        // document.querySelector("#Vplayer_timeStart").value



        window["PMinstance_" + this.id.split("_")[0]].loop.endTimeSeconds = pmHelpers.toFloatSecs(endTimeString);


        window["PMinstance_" + this.id.split("_")[0]].plyr.currentTime = pmHelpers.toFloatSecs(endTimeString);

        // run warning validation

        window["PMinstance_" + this.id.split("_")[0]].warningValidation();

    }


    offToggle(event) {

        console.log("event: " + event);

        console.log("target: " + this.id);
        console.log("args 0: " + arguments[0]);
        console.log("args 1: " + arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll toggle off/on player: " + this.id);


        // toggle the ui switch
        // this.id.cheked = !this.id.checked;

        document.querySelector('#' + this.id.split("_")[0] + '_onOff > input').checked = !document.querySelector('#' + this.id.split("_")[0] + '_onOff > input').checked;

        // Get loop instance

        const loop = window["PMinstance_" + this.id.split("_")[0]].loop;


        // toggle the loop instance 

        loop.off = !loop.off;

        // verbose way
        //    window["PMinstance_" + this.id.split("_")[0]].loop.off = !window["PMinstance_" + this.id.split("_")[0]].loop.off;



        //  var off = window["PMinstance_" + this.id.split("_")[0]].loop.off;

        console.log("The loop is now switched off: " + loop.off);


        const startTimeControl = document.querySelector("#" + this.id.split("_")[0] + "_timeStart");

        const endTimeControl = document.querySelector("#" + this.id.split("_")[0] + "_timeEnd");



        if (!loop.off) {


            //get time input controls



            const conditionsArray = [
                (loop.startTimeSeconds < 0),
                (loop.endTimeSeconds < 0),
                (loop.startTimeSeconds > loop.videoDuration),
                (loop.endTimeSeconds > loop.videoDuration),
                (loop.startTimeSeconds > loop.endTimeSeconds)

            ]




            if (conditionsArray.includes(true)) {


                startTimeControl.classList.add("invalid");
                endTimeControl.classList.add("invalid");

                window["PMinstance_" + this.id.split("_")[0]].plyr.pause();

                // turn looping off
                loop.off = !loop.off;

                // toggle switch back to off

                setTimeout(() => {
                    document.querySelector('#' + this.id.split("_")[0] + '_onOff > input').checked = !document.querySelector('#' + this.id.split("_")[0] + '_onOff > input').checked;
                }, 500);



            }

        }
        else {
            startTimeControl.classList.remove("invalid");
            endTimeControl.classList.remove("invalid");

            window["PMinstance_" + this.id.split("_")[0]].plyr.play();
        }

    }

}



class Loop {
    // simplify this one to use 
    // PMinstance_Vplayer.plyr.on('timeupdate', function(){console.log('yep')})
    constructor(id, start, end) {


        //
        // ***  A on/ off method should set up the event listener with the 'preset' / user set 
        //       start and end values  Clicking on or keying return from end input turns on 
        //          the looper 
        //

        // field like
        this.id = id;


        // this.videoDuration = window["PMinstance_" + this.id.split("_")[0]].plyr.duration;
        this.videoDuration = 30;


        // properties with getters/setters

        this.startTimeSeconds = start;
        this.endTimeSeconds = end;
        //  this.conditionsArray = [true, false, false];
        this._off = true;


        // this.plyr.on('timeupdate', function (e) { console.log('plyr.id : ' + plyr.id )});

        //this.plyr.on('timeupdate', function (e) {

        //   var _self = this;


        //  //  var internalPlyr = window["PMinstance_" + e.target.id].plyr;



        //    if (!_self.off) {

        //        console.log('looping: ' + e.target.id);
        //        console.log('current time :' + window["PMinstance_" + e.target.id].plyr.currentTime);

        //        //if (window["PMinstance_" + e.target.id].plyr.currentTime < _self.startTime) {

        //        //    window["PMinstance_" + e.target.id].plyr.currentTime = _self.startTime;

        //        //    console.log('The player time was set');
        //        //}


        //        if (Math.fround(window["PMinstance_" + e.target.id].plyr.currentTime) > _self.startTime) {

        //            window["PMinstance_" + e.target.id].plyr.currentTime = 30;

        //            console.log('The player time was set');
        //        }
        //    }


        //});


        document.addEventListener('timeupdate', pmHelpers.delegateByIDparams(this.id, this.startTimeSeconds, this.endTimeSeconds, this.loopSegmentParams));


    }
    get off() {
        return this._off;
    }
    set off(bool) {


        // next refactor to event
        // see https://www.kirupa.com/html5/custom_events_js.htm
        // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events


        // validate startTime and EndTime, invalid if: 
        // - start time or end time are before 0 (should also be managed by controller defaults)
        // - start time or end time are after video duration
        // - start time >= end time

        // const conditionsArray = [
        //     (this.startTimeSeconds < 0),
        //     (this.endTimeSeconds < 0),
        //     (this.startTimeSeconds > this.videoDuration),
        //     (this.endTimeSeconds > this.videoDuration),
        //     (this.startTimeSeconds > this.endTimeSeconds)

        // ]




        // if (this.conditionsArray.indexOf(false) == -1) {
        //     this.startTimeControl.classList.add("invalid");
        //     this.endTimeControl.classList.add("invalid");
        // }

        // switch loop to off state

        this._off = bool;
    };
    // decide on this https://stackoverflow.com/questions/1345001/is-it-bad-practice-to-make-a-setter-return-this




    // set startTimeSeconds(s) {

    //     //adjust inputtime

    //     document.querySelector("#" + this.id + "_timeStart").value = pmHelpers.toStringTime(inputTimeFloat);
    //     // do validation

    //     // set property


    // };



    loopSegment(event) {

        console.log(event);
        console.log(arguments[0]);
        // console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do

        console.log("Hey, I'll loop player, this.id is " + this.id);



        // set loop start


    }

    loopSegmentParams(start, end, event) {

        // console.log('start : ' + start);


        // console.log(arguments[0]);

        // console.log('end : ' + end);


        // console.log(arguments[1]);

        // console.log('targ  : ' + targ);


        //  console.log(arguments[2]);


        // console.log('event : ' + event);


        // console.log(arguments[3]);
        // console.log(arguments[1]);


        // no do this => 
        // this is now the button, maybe pick up data-attribiute instead of button id for to create 
        // dynamic PM instance name and method in delegate determines what to do

        // second option
        // this.id is button id, split on _ use first part for dynamic PM instance name and
        // second part to determine what to do



        // console.log('The start time is : ' + start.id + ' and end time is : ' + end.id);

        console.log("Hey, I'll loop player, 'this.id' is " + this.id);

        let args = [...arguments];

        args.forEach(element => console.log('element : ' + element));





        //if (this.id !== "") {

        //    if (!window["PMinstance_" + this.id].loop.off) {



        //        if (Math.fround(window["PMinstance_" + this.id].plyr.currentTime) < Math.fround(window["PMinstance_" + this.id].loop.startTime) || Math.fround(window["PMinstance_" + this.id].loop.endTime) < Math.fround(window["PMinstance_" + this.id].plyr.currentTime)) {

        //            window["PMinstance_" + this.id].plyr.currentTime = window["PMinstance_" + this.id].loop.startTime;

        //            console.log('reset video to start : ' + window["PMinstance_" + this.id].loop.startTime);

        //            console.log('The player time was re-set.');
        //        }
        //    }
        //}




        if (this.id !== "") {



            //if (window["PMinstance_" + this.id].loop.endTimeSeconds > window["PMinstance_" + this.id].loop.startTimeSeconds) {
            //    document.querySelector("#" + this.id + "_timeStart").style.backgroundColor = 'white';
            //    document.querySelector("#" + this.id + "_timeEnd").style.backgroundColor = 'white';
            //}



            if (!window["PMinstance_" + this.id].loop.off) {



                if (window["PMinstance_" + this.id].plyr.currentTime < window["PMinstance_" + this.id].loop.startTimeSeconds || window["PMinstance_" + this.id].loop.endTimeSeconds < window["PMinstance_" + this.id].plyr.currentTime) {

                    window["PMinstance_" + this.id].plyr.currentTime = window["PMinstance_" + this.id].loop.startTimeSeconds;

                    console.log('reset video to start : ' + window["PMinstance_" + this.id].loop.startTimeSeconds);

                    console.log('The player time was re-set.');
                }
            }
        }


    }



    loopVideo() {

        console.log("looping");

        if (!this.off) {
            if (this.plyr.currentTime < this.startTime || this.plyr.currentTime > this.endTime) {
                this.plyr.currentTime = this.startTime;

                console.log('The player time was set');
            }

        }

    }
}

//   __        __   __             __     
//  / _` |    /  \ |__)  /\  |    /__`    
//  \__> |___ \__/ |__) /~~\ |___ .__/    
//     
//                                   
// Evil

window.videoToPauseModal;

window.pmHelpers = new Helpers();

window.PMloop = function PMlearn(id, startTime, endTime) {




    console.log('Will loop :' + id + ' from ' + startTime + ' to ' + endTime);

    const fs = pmHelpers.toFloatSecs(startTime)

    const playerLoop = window["PMinstance_" + id].loop;


    playerLoop.startTimeSeconds = startTime;

    document.querySelector("#" + id + "_timeStart").value = window.pmHelpers.toStringTime(startTime);



    playerLoop.endTimeSeconds = endTime;


    document.querySelector("#" + id + "_timeEnd").value = window.pmHelpers.toStringTime(endTime);


    playerLoop._off = false;

    document.querySelector("#" + id + "_onOff > input").checked = true;


    window["PMinstance_" + id].plyr.play();

    console.log('Looping :' + id + ' from ' + startTime + ' to ' + endTime);

}




// latest prior version
new PagePrep();

window.p = Plyr;
window.pm = PractiseMaster;
window.pp = PagePrep;