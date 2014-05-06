var page = require('webpage').create();
var execFile = require("child_process").execFile
page.viewportSize = {
  width: 1024,
  height: 768
};


/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 5000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function () {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if (!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
}

var util = {};
util.getImgDimensions = function ($element) {
    return {
        top : $element.offset().top,
        left : $element.offset().left,
        width : $element.width(),
        height : $element.height()
    };
};

var fs = require('fs');
page.onConsoleMessage = function (msg) {
    console.log(msg);
};

// Open Twitter on 'sencha' profile and, onPageLoad, do...
page.open("http://172.17.22.21/photo/requireP/#album/admin/mB7k4u", function (status) {
    waitFor(function () {
        // Check in the page if a specific element is now visible
        return page.evaluate(function () {
            return ($('.fadeFilter').css('display') === 'none');
        });
    }, function () {
        console.log("media load ok");
        page.evaluate(function () {
            $('.thumbnail').first().click();
        });
        waitFor(function () {
            return page.evaluate(function () {
                return !!($('.thumbnail').first().hasClass('actived'));
            });
        }, function () {
            console.log('actived!!');
            page.evaluate(function () {
                $('#shareLink').click();
            });
            waitFor(function () {
                return page.evaluate(function () {
                    return !!($('.modal.fade').css('display') === 'block');
                });
            }, function () {
                console.log('modal bumpout!!');
                var src = page.evaluate(function () {
                    return $('textarea.form-control').val();
                });
                execFile('node', ['download.js', src], null, function (err, stdout, stderr) {
                    console.log('image downloaded!!');
                    phantom.exit();
                });
                /*
                page.open(src, function () {
                    console.log('open new one ok!');
                    page.includeJs('//code.jquery.com/jquery-1.11.0.min.js', function () {
                        var firstElement = page.evaluate(function () {
                            var getImgDimensions = function ($element) {
                                return {
                                    top : $element.offset().top,
                                    left : $element.offset().left,
                                    width : $element.width(),
                                    height : $element.height()
                                };
                            };
                            return getImgDimensions($('img').first());
                        });
                        page.clipRect = firstElement;
                        page.render('result.jpg');
                    });

                });*/
            });
        });
        /*
        var firstElement = page.evaluate(function () {
            $('.thumbnail').first().click();
            var getImgDimensions = function ($element) {
                return {
                    top : $element.offset().top,
                    left : $element.offset().left,
                    width : $element.width(),
                    height : $element.height()
                };
            };
            return getImgDimensions($('.thumbnail').first());
        });
        page.clipRect = firstElement;
        page.render('result.jpg');*/
        
    });
});