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
  self.unread = ko.observable(false);

  self.moment = require('moment')
  message_appendable = false;

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

  self.addMessage = function(from, message, type) {
    var last_poster;
    if (self.messages().length > 0) {
        last_poster = self.messages()[self.messages().length - 1].from;
    }

    if ( (from == last_poster) && message_appendable) {
        // Append
        self.messages()[self.messages().length - 1].fragments.push({message:message, type:type});
    } else {
        post_new_message(from, message, type);
        reset_message_appendable();
    }
    self.unread(true);
    self.updateScroll();
  };

  // self.addJoinMessage = function(nick_joined) {
  //   self.messages.push({
  //     from: "system",
  //     type: "joined",
  //     when: timenow(),
  //     joined: nick_joined
  //   });
  // };

  // Private functions
  function reset_message_appendable() {
    clearTimeout();
    message_appendable = true;
    setTimeout(function(){
        message_appendable = false;
    }, 1000 * 180); // 3 minutes
  };

  function post_new_message(from, message, type) {
    self.messages.push({
        from: from,
        when: timenow(),
        fragments: ko.observableArray([{message:message, type:type}])
    });
  };

  function timenow() {
    return self.moment().format('h:mm A');
  }

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
