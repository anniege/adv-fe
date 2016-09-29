module.exports = function Resource(options) {
  var elem = $('<div></div>');
  var resName = options.name || '';
  var resCount = options.count || 0;

  function render() {
    elem.html(App.templates['resource']({
      name: resName,
      val: resCount
    }));
    return this;
  }

  return {
    render: render,

    getName: function () {
      return resName;
    },

    setValue: function (currValue) {
      resCount = currValue || 0;
      render();
    },

    elem: elem
  }

};
