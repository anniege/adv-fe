var GiftTunner = require('containers/gift-tunner/gift-tunner.js');
var GodHateIndicator = require('containers/god-hate-indicator/god-hate-indicator.js');
var Hate = require('model/hate.js');
var Resource = require('model/resource.js');

module.exports = function GodGiftForm(options) {
    var elem = $('<div></div>');
    var HATE_BASE = 30;
    var userGoldResource = options.userGoldResource;
    var userCopperResource = options.userCopperResource;
    var userSomeResource = options.userSomeResource;

    var GOLD_MAX = userGoldResource.getCount();
    var COPPER_MAX = userCopperResource.getCount();
    var SOME_MAX = userSomeResource.getCount();

    var godPrefer = {
        'gold': 3,
        'copper': 2,
        'some': 1
    }

    var goldGiftResource = new Resource({
      name: 'Gold',
      count: 0,
      minCount: 0,
      maxCount: GOLD_MAX
    });

    var copperGiftResource = new Resource({
      name: 'Copper',
      count: 0,
      minCount: 0,
      maxCount: COPPER_MAX
    });

    var someGiftResource = new Resource({
      name: 'Some',
      count: 0,
      minCount: 0,
      maxCount: SOME_MAX
    });

    var hate = new Hate({
      count: HATE_BASE,
      minCount: 0,
      maxCount: HATE_BASE
    });

    var godHateIndicator = new GodHateIndicator({
      hate: hate
    });

    Model.subscribeAll([goldGiftResource, copperGiftResource, someGiftResource], function() {
        var result = HATE_BASE - copperGiftResource.getCount()*godPrefer['copper'] - goldGiftResource.getCount()*godPrefer['gold'] - someGiftResource.getCount()*godPrefer['some'];
        hate.setCount(result);
        userGoldResource.setCount(GOLD_MAX - goldGiftResource.getCount());
        userCopperResource.setCount(COPPER_MAX - copperGiftResource.getCount());
        userSomeResource.setCount(SOME_MAX - someGiftResource.getCount());
    });



    var goldTunner = new GiftTunner({
        resource: goldGiftResource
    });

    var copperTunner = new GiftTunner({
        resource: copperGiftResource
    });

    var someTunner = new GiftTunner({
        resource: someGiftResource
    });


    function render() {
        elem.html(App.templates['god-gift-form']({}));

        elem.find('.god-gift-form__gold-tunner').html(goldTunner.render().elem);
        elem.find('.god-gift-form__copper-tunner').html(copperTunner.render().elem);
        elem.find('.god-gift-form__some-tunner').html(someTunner.render().elem);
        elem.find('.god-gift-form__hate').html(godHateIndicator.render().elem);

        subscribeHandlers(elem);

        return this;
    }

    function subscribeHandlers(elem) {
        elem.find('.god-gift-form__send').click(function() {
            console.log('send gift [gold: ' + goldGiftResource.getCount() + ', copper: ' + copperGiftResource.getCount() + ', some: ' + someGiftResource.getCount() + ']');
        });
    }

    return {
        render: render,
        elem: elem
    }
};
