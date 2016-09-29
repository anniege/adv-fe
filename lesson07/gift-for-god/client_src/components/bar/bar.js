"use strict";
module.exports = function Bar(options) {
    let elem = $('<div></div>');
    let model = options.model;
    let progress = model.getCount();

    model.subscribe(function() {
      progress = model.getCount()
      render();
    });

    function render() {
        elem.html(App.templates['bar']({
            progress: Array(progress)
        }));
        return this;
    }

    return {
        render: render,
        elem: elem
    }
};
