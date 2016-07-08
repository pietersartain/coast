/**
 * The Server class contains the IRC events for communicating with one IRC
 * server.
 */

exports.ServerModel = ServerModel;
function ServerModel(server_name, nick_name, server_addr,ko, db) {
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
    return 0;

    var new_chnl = new chnl.Channel(channel_name, client)
    self.channels.push(new_chnl);
    self.selected_channel(new_chnl);
  };

  self.selectChannel = function(channel_name) {
    console.log(channel_name);
  };

  self.loadChannels = function() {
    for (let channel of self.db.channels.find({server_name:this.server_name})) {
      // self.add_server(
      //   server.server_name,
      //   server.nick_name,
      //   server.server_addr);
      console.log(channel);
    }
  };

  self.saveChannel = function(channel_name) {
    var channel_details = {server_name:this.server_name, channel_name: channel_name};
    self.db.servers.save(channel_details);
  };

  self.createChannel = function() {
    var channel_name = $("input[name='channel_name']");

    if (channel_name != '') {
      self.joinChannel(channel_name.val());

      channel_name.val("");
      $("#channel_modal").modal('hide');
    }
  }

// This is currently uninitialised
// var channel = require('./channel.js')


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
      // channel.add_message(from, message);
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


/*
var ServerModel = function() {
  var self = this;

  // Editable data
  self.servers = ko.observableArray([
    {"server_name":"a","nick_name":"aa"},
    {"server_name":"b","nick_name":"bb"}
  ]);

  // this.db = require('diskdb');
  // this.db.connect('./db/', ['servers']);

  self.getServerList = function(db) {
  //   var servers = this.db.servers.find();
  //   // ko.mapping.fromJS(servers, {}, this.servers);
  }

  self.countServers = function(db) {
  //   return this.db.servers.count();
    return 0;
  }

  // this.exrciseList = function(data, status, jqxhr) {
  //   ko.mapping.fromJS(data, {}, this.exercises);

  //   $("[data-drag='exercise']").children("li").each(function() {
  //     $(this).draggable({ opacity: 0.7, helper: "clone" });
  //   });
  // };

  // // This is part of the constructor
  // this.refreshExercises = function() {
  //   $.ajax({
  //     context: this,
  //     'url': '/api/exercises',
  //     'type': 'get',
  //     'success': this.exerciseList,
  //     'error': function() {}
  //   });
  // };

  self.addServer = function(server_name, nick_name, server_addr) {
    // var server_details = {server_name : server_name, nick_name : nick_name, server_addr : server_addr};
    // this.servers.push(server_details);
    // this.db.servers.save(server_details);
  }

  // this.insertExercise = function(form) {
  //     $.ajax({
  //       context: this,
  //       'url': '/api/exercises', // form.attr('action')
  //       'type': 'post', // form.attr('method')
  //       'data': form.serialize(),
  //       'success': this.exerciseList,
  //       'error': function() {}
  //     });
  // };

  // this.refreshExercises();

  // this.getServerList();
};

*/
