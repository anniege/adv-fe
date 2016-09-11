module.exports = function Bar(options) {
    var elem = $('<div></div>');
    var count = 0;

    function render() {
        elem.html(App.templates['bar']({
            progress: Array(count)
        }));
        return this;
    }

    return {
      render: render,
       getCount: function() {
           return count;
       },
       setCount: function(c) {
           count = c;
           render();
       },
       inc: function(val) {
           count += val || 1;
           render();
       },
       dec: function(val) {
           count -= val || 1;
           render();
       },
       elem: elem
    }
};
