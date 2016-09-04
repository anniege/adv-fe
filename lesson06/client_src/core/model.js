(function (global) {
    function Model() {
       this.attributes = {};
       this.subscribers = [];
       this.init.apply(this, arguments);
    }

    Model.prototype = {
        subscribe: function(cb) {
            this.subscribers.push(cb);
        },
        unsubscribe: function() {
          this.subscribers.pop();
        },
        notify: function(cb) {
            this.subscribers.forEach(function(cb) {
                cb(this);
            }.bind(this));
        },
        get: function(key) {
            return this.attributes[key];
        },
        set: function(key, value) {
            this.attributes[key] = value;
            this.notify();
        },
        init: function() {
            console.log('init');
        }
    };
    
    Model.subscribeAll = function(models, cb) {
        models.forEach(function(model) {
            model.subscribe(cb);
        });
    };

    Model.createModel = function(custom) {
       var child = function() {
           return Model.apply(this, arguments);
       };
       child.prototype = $.extend({}, Model.prototype, custom);
       return child;
    };
    global.Model = Model;

})(window);
