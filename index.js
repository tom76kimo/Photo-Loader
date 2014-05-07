var RoadMap = require('./util/RoadMap').RoadMap;

RoadMap.setConfig({root: 'http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first'});


var photoLoader = {};
photoLoader.step = [];
photoLoader.step[0] = {
    condition: function () {
        return RoadMap.domHandle(function () {
            return ($('.fadeFilter').css('display') === 'none');
        });
    }, nextStep: function () {
        console.log('load ready...');
        RoadMap.domHandle(function () {
            $('.thumbnail').first().click();
        });
        
    }
};

photoLoader.step[1] = {
    condition: function () {
        return RoadMap.domHandle(function () {
            return ($('.fadeFilter').css('display') === 'none');
        });
    }, nextStep: function () {
        console.log('load ready...');
        RoadMap.domHandle(function () {
            $('.thumbnail').first().click();
        });
        
    }
};

var steps = [];
steps.push({
    condition: function () {
        return RoadMap.domHandle(function () {
            return ($('iframe').contents().find('#myDiv').html() !== null);
        });
    },
    nextStep: function () {
        RoadMap.domHandle(function () {
            $('iframe').contents().find('button').click();
        });
    }
});


steps.push({
    condition: function () {
        return RoadMap.domHandle(function () {
            return ($('iframe').contents().find('#myDiv').find('p') !== null);
        });
    },
    nextStep: function () {
        var html = RoadMap.domHandle(function () {
            return $('iframe').contents().find('#myDiv').html();
        });
        console.log(html);
    }
});

RoadMap.setSteps(steps);
RoadMap.setEndFunction(function () {
    console.log('OKOK');
});
RoadMap.run();

