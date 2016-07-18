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
 * The Server class contains the IRC events for communicating with one IRC
 * server.
 */

exports.ServerModel = ServerModel;
function ServerModel(server_name, nick_name, server_addr, ko, db) {
  var self = this;

  self.db = db;

  var chnl = require('./channel.js')


  self.server_name = server_name;
  self.nick_name = nick_name;
  self.server_addr = server_addr;

  self.channels = ko.observableArray([]
    // [{channel_name : "a"},
    // {channel_name : "b"},
    // {channel_name : "c"}]
  );

  self.selected_channel = ko.observable();

  self.connected = ko.observable(false);

  self.irc = require('irc')

  // Connect to the server
  var client = new self.irc.Client(self.server_addr, self.nick_name,
      {
        userName: 'Coast',
        realName: 'Coast IRC client',
        channels: [],
      });

  self.joinChannel = function(prefix, channel_name, offline) {
    self.db.loadCollections([self.server_name + "-" + channel_name]);
    var dbcollection = self.db[self.server_name + "-" + channel_name];
    var new_chnl = new chnl.ChannelModel(prefix, channel_name, nick_name, ko, dbcollection)
    self.channels.push(new_chnl);
    self.selected_channel(0);
    if (!offline) {
      client.join(prefix + channel_name);
    }
  };

  self.selectChannel = function(channel_idx) {
    self.selected_channel(channel_idx);
    self.channels()[channel_idx].updateScroll(0);
    self.channels()[channel_idx].unread(false);
  };

  self.loadChannels = function() {
    self.joinChannel("*", "coastbot", true);
    for (let channel of self.db['channels'].find({server_name:this.server_name})) {
      var offline = !channel.channel_prefix
      self.joinChannel(channel.channel_prefix, channel.channel_name, offline);
    }
  };

  self.saveChannel = function(prefix, channel_name) {
    var channel_details = {
      server_name:this.server_name,
      channel_prefix: prefix,
      channel_name: channel_name
    };
    self.db['channels'].save(channel_details);
  };

  self.createChannel = function() {
    var channel_name = $("input[name='channel_name']");

    if (channel_name.val() != '') {
      self.joinChannel("#", channel_name.val());
      self.saveChannel("#", channel_name.val());

      channel_name.val("");
      $("#channel_modal").modal('hide');
      var cidx = self.channels().length-1;
      self.selected_channel(cidx);
    }
  }

  self.startDM = function() {
    var channel_name = $("input[name='channel_name']");

    if (channel_name.val() != '') {
      self.joinChannel("", channel_name.val());
      self.saveChannel("", channel_name.val());

      channel_name.val("");
      $("#dm_modal").modal('hide');
    }
  }

  function getChannelIdx(channel_name) {
    return self.channels().findIndex(function(element, index, array){
      return element.channel_name() === channel_name;
    });
  }

  function getCurrentFQChannelName() {
    return self.channels()[self.selected_channel()].prefix() + self.channels()[self.selected_channel()].channel_name();
  }

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

        if (say_val.substr(0,1) == "/") {
          // Action
          var argv = say_val.substr(1).trim().split(" ");
          if (argv[0] == "irc") {
            argv.shift();
            client.send.apply(client, argv);
          } else {
            var cmd = argv.shift();
            var fn = self.actionHandler[cmd];
            if (typeof fn == "function") {
              fn.apply(fn, argv);
            } else {
              self.logError("Sorry, I don't know what you meant by /" + cmd);
            }
          }

        } else if (self.channels()[self.selected_channel()].prefix() == "*") {
          self.channels()[self.selected_channel()].addMessage(self.nick_name, say_val, "message");
        } else {
          client.say(getCurrentFQChannelName(), say_val);
        }

        input_box.val('');
      }
    }
  };

  self.actionHandler = {
    w: function(/* whom, message*/){
      // No argument list, because what's passed in is a variable length array.
      // We need to reassemble it into the two variables `whom` and `message`
      // from the `arguments` variable.
      var args = Array.prototype.slice.call(arguments);
      var whom = args.shift();
      var message = args.join(" ");

      if (whom != '' && message != '') {
        var cidx = getChannelIdx(whom);
        if (cidx == -1) {
          self.joinChannel("", whom, true);
          self.saveChannel("", whom);
          cidx = self.channels().length-1;
        }
        client.say(whom, message);
        self.selectChannel(cidx);
      }
    },
    me: function(action){
      if (action != '') {
        client.action(getCurrentFQChannelName(), "")
      }
    },
    save: function() {
      self.channels()[self.selected_channel()].saveNewMessages();
    }
  };

  self.logError = function(message) {
    var cidx = getChannelIdx("coastbot");
    if (cidx != -1) {
      self.channels()[cidx].addMessage("coastbot", message, "system");
      if (cidx != self.selected_channel()) {
        self.channels()[cidx].unread(true);
      }
    }
  };

// ****************************************************************************
// IRC event listeners
// ****************************************************************************
// https://node-irc.readthedocs.io/en/latest/API.html#events

  // Emitted when the server sends the initial 001 line, indicating you’ve connected to the server. See the raw event for details on the message object.
  client.addListener('registered', function(message) {
    self.connected(true);
    self.loadChannels();
  });

  // Emitted when the server sends the message of the day to clients.
  client.addListener('motd', function(motd) {});

  // Emitted when the server sends a list of nicks for a channel (which happens immediately after joining and on request. The nicks object passed to the callback is keyed by nick names, and has values ‘’, ‘+’, or ‘@’ depending on the level of that nick in the channel.
  client.addListener('names', function(channel, nicks) {});

  // Emitted when the server sends the channel topic on joining a channel, or when a user changes the topic on a channel. See the raw event for details on the message object.
  client.addListener('topic', function(channel, topic, nick, message) {});

  // Emitted when a user joins a channel (including when the client itself joins a channel). See the raw event for details on the message object.
  client.addListener('join', function(channel, nick, message) {
    var to = channel.substr(1);
    var cidx = getChannelIdx(to);

    if (cidx != -1) {
      self.channels()[cidx].addMessage(nick, "joined " + channel + ".", "system");
    }
  });

  // Emitted when a user parts a channel (including when the client itself parts a channel). See the raw event for details on the message object.
  client.addListener('part', function(channel, nick, reason, message) {
    var to = channel.substr(1);
    var cidx = getChannelIdx(to);

    if (cidx != -1) {
      var leaving_message = "left " + channel;
      if (reason) {
       leaving_message = leaving_message + " with a '" + reason + "'";
      } else {
        leaving_message = leaving_message + ".";
      }
      self.channels()[cidx].addMessage(nick, leaving_message, "system");
    }
  });

  // Emitted when a user disconnects from the IRC, leaving the specified array of channels. See the raw event for details on the message object.
  client.addListener('quit', function(nick, reason, channels, message) {});

  // Emitted when a user is kicked from a channel. See the raw event for details on the message object.
  client.addListener('kick', function(channel, nick, by, reason, message) {});

  // Emitted when a user is killed from the IRC server. channels is an array of channels the killed user was in which are known to the client. See the raw event for details on the message object.
  client.addListener('kill', function(nick, reason, channels, message) {});

  // Emitted when a message is sent to any channel (i.e. exactly the same as the message event but excluding private messages. See the raw event for details on the message object.
  client.addListener('message#', function (nick, to, text, message) {
    to = to.substr(1);
    var cidx = getChannelIdx(to);

    if (cidx != -1) {
      self.channels()[cidx].addMessage(nick, text, "message");
      if (cidx != self.selected_channel()) {
        self.channels()[cidx].unread(true);
      }
    }
  });

  // Emitted when a message is sent from the client. to is who the message was sent to. It can be either a nick (which most likely means a private message), or a channel (which means a message to that channel).
  client.addListener('selfMessage', function(to, text) {
    if (to.substr(0,1) == "#") {
      // Channel message
      to = to.substr(1);
    }
    var cidx = getChannelIdx(to);

    if (cidx != -1) {
      self.channels()[cidx].addMessage(self.nick_name, text, "message");
    }
  });

  // Emitted when a notice is sent. to can be either a nick (which is most likely this clients nick and means a private message), or a channel (which means a message to that channel). nick is either the senders nick or null which means that the notice comes from the server. See the raw event for details on the message object.
  client.addListener('notice', function(nick, to, text, message) {});

  // As per ‘message’ event but only emits when the message is direct to the client. See the raw event for details on the message object.
  client.addListener('pm', function(nick, text, message) {
    var cidx = getChannelIdx(message.nick);
    if (cidx == -1) {
      self.joinChannel("", message.nick, true);
      self.saveChannel("", message.nick);
    }
    cidx = self.channels().length-1;
    self.channels()[cidx].addMessage(message.nick, text, "message");
    if (cidx != self.selected_channel()) {
      self.channels()[cidx].unread(true);
    }

  });

  // Emitted when a user changes nick along with the channels the user is in. See the raw event for details on the message object.
  client.addListener('nick', function(oldnick, newnick, channels, message) {});

  // Emitted when the client receives an /invite. See the raw event for details on the message object.
  client.addListener('invite', function(channel, from, message) {});

  // Emitted when a mode is added to a user or channel. channel is the channel which the mode is being set on/in. by is the user setting the mode. mode is the single character mode identifier. If the mode is being set on a user, argument is the nick of the user. If the mode is being set on a channel, argument is the argument to the mode. If a channel mode doesn’t have any arguments, argument will be ‘undefined’. See the raw event for details on the message object.
  client.addListener('+mode', function(channel, by, mode, argument, message) {});

  // Emitted when a mode is removed from a user or channel. channel is the channel which the mode is being set on/in. by is the user setting the mode. mode is the single character mode identifier. If the mode is being set on a user, argument is the nick of the user. If the mode is being set on a channel, argument is the argument to the mode. If a channel mode doesn’t have any arguments, argument will be ‘undefined’. See the raw event for details on the message object.
  client.addListener('-mode', function(channel, by, mode, argument, message) {});

  // Emitted whenever the server finishes outputting a WHOIS response. The information should look something like:
  // {
  //     nick: "Ned",
  //     user: "martyn",
  //     host: "10.0.0.18",
  //     realname: "Unknown",
  //     channels: ["@#purpledishwashers", "#blah", "#mmmmbacon"],
  //     server: "*.dollyfish.net.nz",
  //     serverinfo: "The Dollyfish Underworld",
  //     operator: "is an IRC Operator"
  // }
  client.addListener('whois', function(info) {});

  // client.addListener('channellist_item', function(info) {
  //   console.log("channellist_item: ", info);
  //   // interface.append(info);
  // });

  // Emitted when the server has finished returning a channel list. The channel_list array is simply a list of the objects that were returned in the intervening channellist_item events.
  // This data is also available via the Client.channellist property after this event has fired.
  client.addListener('channellist', function(channels) {});

  if (0) {
    client.addListener('raw', function(message) {
      console.log('raw: ', message);
    });
  }

  client.addListener('error', function(message) {
    self.logError("Sorry, '" + message.args[1] + "' is an " + message.args[2]);
  });

  // Emitted whenever a user performs an action (e.g. /me waves). The message parameter is exactly as in the ‘raw’ event.
  client.addListener('action', function(from, to, text, message) {});

};
