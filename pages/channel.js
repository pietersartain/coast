/*
Coast - an IRC client with Slack's aesthetic
Copyright (C) 2016  Pieter Sartain

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * The Channel class contains ...
 */

exports.ChannelModel = ChannelModel;
function ChannelModel(channel_name, nick_name, client, ko) {
  var self = this;

  self.channel_name = ko.observable(channel_name);
  self.nick_name = nick_name;
  self.messages = ko.observableArray([]);

  self.moment = require('moment')
  self.appendable = 0;

  self.sendMessage = function(d, e) {
    var input_box = $("textarea.input");

    if(e.shiftKey && e.keyCode == 13) {
      // input_box.trigger("shiftEnterKey");
    } else 
    if(e.ctrlKey && e.keyCode == 13) {
      // input_box.trigger("ctrlEnterKey");
    } else 
    if(e.keyCode == 13)
    {
      // input_box.trigger("enterKey");
      var say_val = input_box.val();
      if (say_val != '') {

        self.say(say_val);

        input_box.val('');
      }
    }
  };

  self.join = function() {
    // console.log(self.channel_name);
    client.join("#" + self.channel_name());
  };

  self.say = function(say_val) {
    client.say("#" + self.channel_name(),say_val);
  };

  self.addMessage = function(from, message) {
    var last_poster;
    if (self.messages().length > 0) {
        last_poster = self.messages()[self.messages().length - 1].from; //$(".message-name:last").text();
    }

    if (from == last_poster && self.appendable) {
        append_new_message(message);
    } else {
        post_new_message(from, message);
        reset_appendable();
    }
    self.updateScroll();
  };

  // Private functions
  function reset_appendable() {
    clearTimeout();
    self.appendable = 1
    setTimeout(function(){
        appendable = 0;
    }, 1000 * 180); // 3 minutes
  };

  function append_new_message(message) {
    self.messages()[self.messages().length - 1].fragments.push(message);
  };

  function post_new_message(from, message) {
    var now = self.moment().format('h:mm A');

    self.messages.push({
        from: from,
        when: now,
        fragments: ko.observableArray([message])
    });
  };

  self.updateScroll = function(speed){
    if (speed == null) {
        speed = 300;
    }
    $('#channel-content').animate({
       scrollTop: $("#channel-content")[0].scrollHeight-$(window).height()+140},
       speed // ms - time to scroll
    );
  };

  self.join();

};
