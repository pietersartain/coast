/**
 * The Channel class contains ...
 */

exports.ChannelModel = ChannelModel;
function ChannelModel(channel_name, client, ko) {
  var self = this;

  self.channel_name = ko.observable(channel_name);

  self.moment = require('moment');
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
  //       // channel.append_msg(nick_name, say_val)
        console.log(say_val);

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

  self.join();

};
