var Resource = require('components/resource/resource.js');

module.exports = function(options) {
    var elem = $('<div></div>');

    var resource = options;

    var goldResource = new Resource({
        model: resource.gold
    });

    var copperResource = new Resource({
        model: resource.copper
    });

    var someResource = new Resource({
        model: resource.some
    });

    function render() {
        elem.html(App.templates['user-wealth']({}));
        elem.find('.user-wealth__gold').html(goldResource.render().elem);
        elem.find('.user-wealth__copper').html(copperResource.render().elem);
        elem.find('.user-wealth__some').html(someResource.render().elem);

        return this;
    }

    return {
        render: render,
        elem: elem
    }
}
