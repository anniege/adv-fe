"use strict";
const GodGiftForm = require('containers/god-gift-form/god-gift-form.js');
const UserWealth = require('containers/user-wealth/user-wealth.js');
const Resource = require('model/resource.js');

module.exports = function Game() {
    let elem = $('<div></div>');
    let path = '/json-server/wealth/';

    let promise = fetch(path).then((res) => res.json()).then((data) => {
      let resources = data.resources;

      let userResources = resources.map((res) => {
        return new Resource({
          name: res.name,
          count: res.count
        });
      });


      let userWealth = new UserWealth({
        reses: userResources
      });

      let godGiftForm = new GodGiftForm({
        reses: userResources
      });

      return {
        userWealth: userWealth,
        godGiftForm: godGiftForm
      }
    });


    function render () {
      promise.then(function({ userWealth, godGiftForm }) {
        elem.html(App.templates['game']({}));
        elem.find('.game__user-wealth').html( userWealth.render().elem);
        elem.find('.game__god-gift-form').html( godGiftForm.render().elem);
      });

        return this;
    }

    return {
        render: render,
        elem: elem
    }
};
