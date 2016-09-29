var Bar = require('components/bar/bar.js');
var TuneControls = require('components/tune-controls/tune-controls.js');

module.exports = function GiftTunner(options) {
    var elem = $('<div></div>');

    var onIncCallback, onDecCallback;

    var bar = new Bar();

    var controls = new TuneControls();

    controls.onInc(function () {
      var result = onIncCallback();
      if (!result) return;
      bar.inc();
    });

    controls.onDec(function () {
      var result = onDecCallback();
      if (!result) return;
      bar.dec();
    });

    function render() {
        elem.html(App.templates['gift-tunner']({}));

        elem.find('.gift-tunner__name').html(options.resName);
        elem.find('.gift-tunner__bar').html(bar.render().elem);
        elem.find('.gift-tunner__controls').html(controls.render().elem);

        return this;
    }

    return {
        render: render,

        getName: function () {
            return options.resName;
        },

        getCount: function() {
            return bar.getCount();
        },

        onInc: function(cb) {
            onIncCallback = cb;
        },

        onDec: function(cb) {
            onDecCallback = cb;
        },
        
        elem: elem
    }
};
