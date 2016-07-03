/**
 * The Channel class contains ...
 */

exports.ChannelModel = ChannelModel;
function ChannelModel(channel_name, irc_client) {
  var self = this;

  self.channel_name = channel_name;
  self.irc_client = irc_client;

  self.moment = require('moment');
  self.appendable = 0;

  self.join = function(channel) {
    // This will need to add to some non-volatile list
    $("#channellist-content").append("<li id='" + channel + "'><span>#</span>" + channel + "</li>");
    $("#channel-header").append(channel);
  };

  self.add_message = function(from, message) {
    var last_poster = $(".message-name:last").text();

    if (from == last_poster && appendable) {
        append_new_message(message);
    } else {
        post_new_message(from, message);
        reset_appendable();
    }
    updateScroll();
  };

  // Private functions
  function reset_appendable() {
    clearTimeout();
    appendable = 1
    setTimeout(function(){
        appendable = 0;
    }, 1000 * 180); // 3 minutes
  };

  function append_new_message(message) {
    var last_message = $(".message:last");
    last_message.append("<div class='message-content'>" + message + "</div>");        
  };

  function post_new_message(from, message) {
    var now = moment().format('h:mm A');
    var channel_content = $("#channel-content");
    channel_content.append(" \
    <div class='message'> \
        <span class='message-name'>" + from + "</span> \
        <span class='message-date'>" + now + "</span> \
        <div class='message-content'>" + message + "</div> \
    </div>");
  };

  function updateScroll(){
    $('html,body').animate({ 
       scrollTop: $(document).height()-$(window).height()},
       300 // ms - time to scroll
    );
  };

};
