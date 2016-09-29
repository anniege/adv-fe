"use strict";
const GiftTunner = require('containers/gift-tunner/gift-tunner.js');
const GodHateIndicator = require('containers/god-hate-indicator/god-hate-indicator.js');
const Hate = require('model/hate.js');
const Resource = require('model/resource.js');

module.exports = function GodGiftForm(options) {
  let elem = $('<div></div>');
  let godPrefer = {
    'gold': 4,
    'copper': 2,
    'some': 1
  }

  const HATE_BASE = 50;
  let giftResources = [];
  let userResources = options.reses;

  let hate = new Hate(HATE_BASE);
  let godHateIndicator = new GodHateIndicator({
    hate: hate
  });


  let tunnerArray  = userResources.map((userRes) => {
    let maxCount = userRes.getCount();

    let giftRes = new Resource({
      name: userRes.getName()
    });
    giftResources.push(giftRes);

    giftRes.subscribe(() => {
      userRes.setCount(maxCount - giftRes.getCount());
      hate.setCount(HATE_BASE - giftResources.reduce((sum, res) => {
        return sum + res.getCount()*(godPrefer[res.getName()] || 1);
      }, 0));
    });

    return new GiftTunner({
      resource: giftRes
    });
  });


  function render() {
    elem.html(App.templates['god-gift-form']({}));
    tunnerArray.forEach((tunner) => {
      elem.find('.god-gift-form__tunner').append(tunner.render().elem);
    });
    elem.find('.god-gift-form__hate').html(godHateIndicator.render().elem);

    subscribeHandlers(elem);

    return this;
  }

  function subscribeHandlers(elem) {
    elem.find('.god-gift-form__send').click(() => {
      console.log(`send gift [ ${ giftResources.map((res) => { return res.getName() + ': ' + res.getCount() }).join(', ') } ]`);
    });
  }

  return {
    render: render,
    elem: elem
  }
};
