var GodGiftForm = require('containers/god-gift-form/god-gift-form.js');
var UserWealth = require('containers/user-wealth/user-wealth.js');

module.exports = function game() {
  var elem = $('<div></div>');

  var userWealth = new UserWealth({
      gold: 50,
      copper: 50,
      some: 50
  });

  var godGiftForm = new GodGiftForm({
    userWealth: userWealth
  });

  function render() {
      elem.html(App.templates['game']({}));

      elem.find('.game_user-wealth').html(userWealth.render().elem);
      elem.find('.game_god-gift-form').html(godGiftForm.render().elem);

      return this;
  }

  return {
      render: render,
      elem: elem
  }
}
