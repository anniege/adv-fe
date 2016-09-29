var Resource = require('components/resource/resource.js');

module.exports = function(options) {
  var elem = $('<div></div>');

  var resource = options;

  var goldResource = new Resource({
    name: resource.gold.getName(),
    count: resource.gold.getCount()
  });

  var copperResource = new Resource({
    name: resource.copper.getName(),
    count: resource.copper.getCount()
  });

  var someResource = new Resource({
    name: resource.some.getName(),
    count: resource.some.getCount()
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
    elem: elem,

    updateResCount: function() {
      goldResource.setValue(resource.gold.getCount());
      copperResource.setValue(resource.copper.getCount());
      someResource.setValue(resource.some.getCount());
      render();
    }
    
  }
}
