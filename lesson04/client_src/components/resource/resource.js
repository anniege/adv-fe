module.exports = function Resource(options) {
    var elem = $('<div></div>');
    var name = options.name;
    var val = options.count;

    function render() {
        elem.html(App.templates['resource']({
            name: name,
            val: val
        }));
        return this;
    }

    return {
        render: render,
        inc: function(count) {
            val += count || 1;
            render();
        },
        dec: function(count) {
            val -= count || 1;
            render();
        },
        getCount: function() {
            return val;
        },
        elem: elem
    }
}
