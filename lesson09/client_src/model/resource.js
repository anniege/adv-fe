module.exports = Model.createModel({
  init: function(options) {
    options = options || {};
    $.extend(this.attributes, {
      name: options.name,
      count: options.count || 0,
      minCount: options.minCount || 0,
      maxCount: options.maxCount || options.count || 30
    });
  },
  inc: function(count) {
    this.set(
      'count',
      this.checkCount(this.get('count') + (count || 1))
    );
  },
  dec: function(count) {
    this.set(
      'count',
      this.checkCount(this.get('count') - (count || 1))
    );
  },
  getCount: function() {
    return this.get('count');
  },
  getName: function() {
    return this.get('name');
  },
  setCount: function(count) {
    this.set('count', this.checkCount(count));
  },
  checkCount: function(count) {
    return (count < this.get('minCount')) ? this.get('minCount') :
    (count > this.get('maxCount')) ? this.get('maxCount') : count;
  }
});
