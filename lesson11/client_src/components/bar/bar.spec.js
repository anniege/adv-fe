var Bar = require('./bar.js');

describe('bar', function () {
  beforeEach(function () {
      this.model = jasmine.createSpyObj('model', ['getCount', 'subscribe']);

      this.model.getCount.and.returnValue(20);
      this.bar = new Bar({ model: this.model });
      spyOn(this.bar, 'render').and.callThrough();
      spyOn(this.bar, 'getCount').and.callThrough();
    });

    it('methods render and getCount should be defined', function () {
      expect(this.bar.render).toBeDefined();
      expect(this.bar.getCount).toBeDefined();
    });

    it("method render return its context", function() {
      var res = this.bar.render();
      expect(res).toEqual(this.bar);
    });

    it('method getCount should return correct result', function () {
      expect(this.bar.getCount()).toEqual(this.model.getCount());
    });

    it('elem should be $(\'<div></div>\')', function () {
      expect(this.bar.elem).toEqual($('<div></div>'));
    });

    it('subscribe and getCount methods of model should have been called', function () {
      expect(this.model.subscribe).toHaveBeenCalled();
      expect(this.model.getCount).toHaveBeenCalled();
    });
});
