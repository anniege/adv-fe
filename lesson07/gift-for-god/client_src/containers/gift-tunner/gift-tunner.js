"use strict";
const Bar = require('components/bar/bar.js');
const TuneControls = require('components/tune-controls/tune-controls.js');

module.exports = function GiftTunner(options) {
    let elem = $('<div></div>');

    let resource = options.resource;

    let bar = new Bar({
      model: resource
    });

    let controls = new TuneControls({
      model: resource
    });

    function render() {
        elem.html(App.templates['gift-tunner']({}));

        elem.find('.gift-tunner__name').html(resource.getName());
        elem.find('.gift-tunner__bar').html(bar.render().elem);
        elem.find('.gift-tunner__controls').html(controls.render().elem);

        return this;
    }

    return {
        render: render,
        elem: elem
    }
};
