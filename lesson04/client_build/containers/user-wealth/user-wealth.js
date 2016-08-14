var Resource = require('components/resource/resource.js');

module.exports = function(options) {
    var elem = $('<div></div>');

    var goldResource = new Resource({
        name: 'Gold',
        count: options.gold
    });

    var copperResource = new Resource({
        name: 'Copper',
        count: options.copper
    });

    var someResource = new Resource({
        name: 'Some',
        count: options.some
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
        goldIndicator: goldResource,
        copperIndicator: copperResource,
        someIndicator: someResource,
        elem: elem
    }
}
