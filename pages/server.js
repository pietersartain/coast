/**
 * The Server class contains the IRC events for communicating with one IRC
 * server.
 */

exports.ServerModel = ServerModel;
function ServerModel(server_name, nick_name, server_addr, ko, db) {
  var self = this;

  self.db = db;

  var chnl = require('./channel.js')

  // self.nick_name= "pietesartain";
  // self.channel_name = "test";
  // self.ip_addr = '192.168.0.64';

// if (!debug) {
//   nick_name = "Piete";
// }


  self.server_name = server_name;
  self.nick_name = nick_name;
  self.server_addr = server_addr;

  self.debug = 0;

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
        channels: [],
      });

  self.getChannelList = function() {
    return [];
  };

  self.joinChannel = function(channel_name) {
    console.log("joinChannel: ", channel_name);

    var new_chnl = new chnl.ChannelModel(channel_name, nick_name, client, ko)
    self.channels.push(new_chnl);
    self.selected_channel(new_chnl);
  };

  self.selectChannel = function(channel_name) {
    console.log(channel_name);
  };

  self.loadChannels = function() {
    for (let channel of self.db.channels.find({server_name:this.server_name})) {
      self.joinChannel(channel.channel_name);
      console.log(channel.channel_name);
    }
  };

  self.saveChannel = function(channel_name) {
    var channel_details = {server_name:this.server_name, channel_name: channel_name};
    self.db.channels.save(channel_details);
  };

  self.createChannel = function() {
    var channel_name = $("input[name='channel_name']");

    if (channel_name.val() != '') {
      self.joinChannel(channel_name.val());
      self.saveChannel(channel_name.val());

      channel_name.val("");
      $("#channel_modal").modal('hide');
    }
  }

// ****************************************************************************
// IRC event listeners
// ****************************************************************************

  client.addListener('registered', function(message) {

    // // setTimeout(function(){
    // client.list();
    // // client.send('LIST');
    // // },300);

    // // Rejoin all the rooms
    // client.join("#" + channel_name);

    // client.list();

    // // client.whois("pesartain", function(info){
    // //   console.log("whois", info);
    // // });

    // channel.join(channel_name);

    // self.joinChannel(self.channel_name);

    self.connected(true);
    self.loadChannels();

  });

  client.addListener('channellist_item', function(info) {
    console.log("channellist_item: ", info);
    // interface.append(info);
  });

  client.addListener('channellist', function(channels) {
    // console.log("channellist: ", channels);
  });

  client.addListener('message', function (from, to, message) {
    // console.log(from + ' => ' + to + ': ' + message);
    if (to == nick_name) {
      // Private message
    } else {
      // Channel message
      to = to.substr(1);
      var cidx = self.channels().findIndex(function(element, index, array){
        return element.channel_name() === to;
      });

      if (cidx != -1) {
        // self.channels()[cidx].addMessage(from, message);
        self.selected_channel().addMessage(from, message);
      }
    }
  });

  if (self.debug) {
    client.addListener('raw', function(message) {
      console.log('raw: ', message);
    });
  }

  client.addListener('error', function(message) {
    console.log('error: ', message);
  });

};
