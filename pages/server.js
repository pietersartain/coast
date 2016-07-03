/**
 * The Server class contains the IRC events for communicating with one IRC
 * server.
 */

function Server(nick_name, ip_addr) {
  var self = this;

  self.nick_name= "pietesartain";
  self.channel_name = "test";
  self.ip_addr = '192.168.0.64';

// if (!debug) {
//   nick_name = "Piete";
// }

  self.irc = require('irc');

// Connect to the server
var client = new irc.Client(ip_addr, nick_name,
  {
    channels: [],
  });

// This is currently uninitialised
var channel = require('./channel.js')

// ****************************************************************************
// IRC event listeners
// ****************************************************************************

  client.addListener('registered', function(message) {

    // setTimeout(function(){
    client.list();
    // client.send('LIST');
    // },300);

    // Rejoin all the rooms
    client.join("#" + channel_name);

    client.list();

    // client.whois("pesartain", function(info){
    //   console.log("whois", info);
    // });

    channel.join(channel_name);

  });

  client.addListener('channellist_item', function(info) {
    console.log("channellist_item: ", info);
    $("#channellist-content").append("<li id='" + info + "'><span>#</span>" + info + "</li>");
  });

  client.addListener('channellist', function(channels) {
    // console.log("channellist: ", channels);
  });

  client.addListener('message', function (from, to, message) {
    // console.log(from + ' => ' + to + ': ' + message);
    if (to == nick_name) {
      // pm
    } else {
      channel.add_message(from, message);
    }
  });

  if (debug) {
    client.addListener('raw', function(message) {
      console.log('raw: ', message);
    });
  }

  client.addListener('error', function(message) {
    console.log('error: ', message);
  });

}
