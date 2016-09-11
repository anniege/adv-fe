var GiftTunner = require('containers/gift-tunner/gift-tunner.js');
var GodHateIndicator = require('containers/god-hate-indicator/god-hate-indicator.js');
var Resource = require('model/resource.js');

module.exports = function GodGiftForm(options) {
  var elem = $('<div></div>');
  var userGoldResource = options.userGoldResource;
  var userCopperResource = options.userCopperResource;
  var userSomeResource = options.userSomeResource;
  var userWealth = options.userWealth;

  var HATE_BASE = 50;
  var GOLD_MAX = userGoldResource.getCount();
  var COPPER_MAX = userCopperResource.getCount();
  var SOME_MAX = userSomeResource.getCount();

  var godPrefer = {
    'gold': 3,
    'copper': 2,
    'some': 1
  }

  var godHateIndicator = new GodHateIndicator({ hate: HATE_BASE });

  // *************** GOLD Tuner **********************************
  var goldTunner = new GiftTunner({
    resName: userGoldResource.getName()
  });

  goldTunner.onInc(function() {
    if ((userGoldResource.getCount() <= godPrefer['gold']) || !godHateIndicator.getCount()) return;
    userGoldResource.dec();
    userWealth.updateResCount();
    godHateIndicator.dec(godPrefer['gold']);
    return true;
  });

  goldTunner.onDec(function() {
    if (userGoldResource.getCount() == GOLD_MAX || godHateIndicator.getCount() > HATE_BASE) return;
    userGoldResource.inc();
    userWealth.updateResCount();
    godHateIndicator.inc(godPrefer['gold']);
    return true;
  });

  // *************** COPPER Tuner **********************************
  var copperTunner = new GiftTunner({
    resName: userCopperResource.getName()
  });

  copperTunner.onInc(function() {
    if ((userCopperResource.getCount() <= godPrefer['copper']) || !godHateIndicator.getCount()) return;
    userCopperResource.dec();
    userWealth.updateResCount();
    godHateIndicator.dec(godPrefer['copper']);
    return true;
  });

  copperTunner.onDec(function() {
    if (userCopperResource.getCount() == COPPER_MAX || godHateIndicator.getCount() > HATE_BASE) return;
    userCopperResource.inc();
    userWealth.updateResCount();
    godHateIndicator.inc(godPrefer['copper']);
    return true;
  });

  // *************** SOME Tuner **********************************
  var someTunner = new GiftTunner({
    resName: userSomeResource.getName()
  });

  someTunner.onInc(function() {
    if ((userSomeResource.getCount() <= godPrefer['some']) || !godHateIndicator.getCount()) return;
    userSomeResource.dec();
    userWealth.updateResCount();
    godHateIndicator.dec(godPrefer['some']);
    return true;
  });

  someTunner.onDec(function() {
    if (userSomeResource.getCount() == SOME_MAX || godHateIndicator.getCount() > HATE_BASE) return;
    userSomeResource.inc();
    userWealth.updateResCount();
    godHateIndicator.inc(godPrefer['some']);
    return true;
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
      console.log('send gift [gold: ' + userGoldResource.getCount() + ', copper: ' + userCopperResource.getCount() + ', some: ' + userSomeResource.getCount() + ']');
    });
  }

  return {
    render: render,
    elem: elem
  }
};
