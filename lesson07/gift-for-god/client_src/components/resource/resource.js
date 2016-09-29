"use strict";
module.exports = function Resource(options) {
  let elem = $('<div></div>');

  let model = options.model;
  let value = model.getCount();
  let name = model.getName();

   model.subscribe(function() {
       value = model.getCount();
       render();
   });

   function render() {
       elem.html(App.templates['resource']({
           name: name,
           val: value
       }));
       return this;
   }

   return {
       render: render,
       elem: elem
   }
};
