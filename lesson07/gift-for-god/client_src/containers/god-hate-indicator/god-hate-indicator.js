"use strict";
const Bar = require('components/bar/bar.js');

module.exports = function GodLoveInicator(options) {
    let elem = $('<div></div>');

    let hate = options.hate;

    let bar = new Bar({
        model:  hate
    });

    function render() {
        elem.html(App.templates['god-hate-indicator']({}));
        elem.find('.god-hate-indicator__bar').html(bar.render().elem);
        return this;
    }

    return {
        render: render,
        elem: elem
    }
};
