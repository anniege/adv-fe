"use strict";
module.exports = function TuneControls(options) {
    let elem = $('<div></div>');

    let model = options.model;

    function render() {
        elem.html(App.templates['tune-controls']({}));
        subscribeHandlers(elem);
        return this;
    }

    function subscribeHandlers() {
        elem.find('.tune-controls__inc').click(function() {
          model.inc();
        });
        elem.find('.tune-controls__dec').click(function() {
          model.dec();
        });
    }

    return {
        render: render,
        elem: elem
    }
};
