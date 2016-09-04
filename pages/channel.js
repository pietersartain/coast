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
  self.channel_members = ko.observableArray([]);
  self.nick_name = nick_name;
  self.messages = ko.observableArray([]);
  self.unread = ko.observable(false);
  self.prefix = ko.observable(prefix);

  self.appendable_timer;
  self.save_timer = setInterval(function(){
    self.saveNewMessages();
  }, 1000 * (300 + get_number_between_1_50()) ); // Every 5 minutes + a bit.

  self.moment = require('moment')
  self.linkifyHTML = require('linkifyjs/html')
  // self.linkify = require('linkify')
  message_appendable = false;

  self.channel_member_count = ko.computed(function() {
        return self.channel_members().length;
    }, self);

  self.addMessage = function(from, message, type) {
    var last_poster;
    if (self.messages().length > 0) {
        last_poster = self.messages()[self.messages().length - 1].from;
    }

    // Ensures links are always clickable
    linked_message = self.linkifyHTML(message, {});

    if ( (from == last_poster) && message_appendable) {
        append_to_last_message(linked_message, type);
    } else {
        post_new_message(from, linked_message, type);
        reset_message_appendable();
    }

    // We found some links, now we need to add a little somethin' somethin' for live previews
    // if (linked_message != message) {
    //   var links = self.linkify.find(message, ['url']);
    //   append_to_last_message(, 'link');
    // }

    self.updateScroll();
  };

  self.nickLeft = function(nick, reason) {

    var leaving_message = "left " + channel;
    if (reason) {
     leaving_message = leaving_message + " with a '" + reason + "'";
    } else {
      leaving_message = leaving_message + ".";
    }
    self.addMessage(nick, leaving_message, "system");
    self.channel_members.splice(self.channel_members.indexOf(nick), 1);
  };

  // Private functions
  function reset_message_appendable() {
    clearTimeout(self.appendable_timer);
    message_appendable = true;
    self.appendable_timer = setTimeout(function(){
        message_appendable = false;
    }, 1000 * 180); // 3 minutes
  };

  function post_new_message(from, message, type) {
    self.messages.push({
        from: from,
        when: ftimenow(),
        timestamp: self.moment().unix(),
        fragments: ko.observableArray([
            {'message':ko.observable(message), 'type':ko.observable(type)}
          ])
    });
  };

  function append_to_last_message(message, type) {
    self.messages()[self.messages().length - 1].fragments.push(
          {'message':ko.observable(message), 'type':ko.observable(type)}
        );
  }

  function get_number_between_1_50() {
    return Math.floor(
      (Math.random() * 50) + 1);
  }

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
      self.db.update({_id: msgs[0]._id}, {messages: ko.mapping.toJSON(self.messages)}, {});
    } else {
      self.db.save({messages: ko.mapping.toJSON(self.messages)});
    }

  };

  self.loadLastMessages = function() {
    var msgs = self.db.find();
    if (msgs.length > 0) {
      var mapping = {}
      self.messages = ko.mapping.fromJSON(msgs[0].messages, mapping);
    }
  };

  self.loadLastMessages();

};
