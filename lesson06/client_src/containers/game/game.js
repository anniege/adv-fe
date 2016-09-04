var GodGiftForm = require('containers/god-gift-form/god-gift-form.js');
var UserWealth = require('containers/user-wealth/user-wealth.js');
var Resource = require('model/resource.js');

module.exports = function Game() {
    var elem = $('<div></div>');

    var userGoldResource = new Resource({
        count: 10,
        name: 'Gold',
        maxCount: 10,
        minCount: 0
    });

    var userCopperResource = new Resource({
        count: 30,
        name: 'Copper',
        maxCount: 30,
        minCount: 0
    });

    var userSomeResource = new Resource({
        count: 20,
        name: 'Some',
        maxCount: 20,
        minCount: 0
    });

    var userWealth = new UserWealth({
        gold: userGoldResource,
        copper: userCopperResource,
        some: userSomeResource
    });

    var godGiftForm = new GodGiftForm({
        userGoldResource: userGoldResource,
        userCopperResource: userCopperResource,
        userSomeResource: userSomeResource
    });

    function render () {
        elem.html(App.templates['game']({}));
        elem.find('.game__user-wealth').html( userWealth.render().elem);
        elem.find('.game__god-gift-form').html( godGiftForm.render().elem);

        return this;
    }

    return {
        render: render,
        elem: elem
    }
};
