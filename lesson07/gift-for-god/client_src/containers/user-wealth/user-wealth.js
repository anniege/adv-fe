"use strict";
const Resource = require('components/resource/resource.js');

module.exports = function(options) {
    let elem = $('<div></div>');

    let resources = options.reses;

    let resArray = resources.map((res) => {
      return new Resource({
        model: res
      });
    });

    function render() {
      elem.html(App.templates['user-wealth']({}));
      resArray.forEach((res) => {
        elem.find('.user-wealth').append(res.render().elem);
      });

      return this;
    }

    return {
        render: render,
        elem: elem
    }
}
