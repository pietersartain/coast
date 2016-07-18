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
function ChannelModel(prefix, channel_name, nick_name, ko, db) {
  var self = this;

  self.db = db;

  self.channel_name = ko.observable(channel_name);
  self.channel_topic = ko.observable();
  self.channel_members = ko.observable();
  self.nick_name = nick_name;
  self.messages = ko.observableArray([]);
  self.unread = ko.observable(false);
  self.prefix = ko.observable(prefix);

  self.moment = require('moment')
  message_appendable = false;

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
    self.updateScroll();
  };

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
        when: ftimenow(),
        timestamp: self.moment().unix(),
        fragments: ko.observableArray([{message:message, type:type}])
    });
  };

  function ftimenow() {
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

  self.saveNewMessages = function() {
    var msgs = self.db.find();
    if (msgs.length > 0) {
      self.db.update({_id: msgs[0]._id}, {messages: ko.mapping.toJSON(self.messages)}, options);
    } else {
      self.db.save({messages: ko.mapping.toJSON(self.messages)});
    }

  };

  self.loadLastMessages = function() {
    var msgs = self.db.find();
    if (msgs.length > 0) {
      self.messages = ko.mapping.fromJSON(msgs[0].messages);
    }
  };

  self.loadLastMessages();

};
