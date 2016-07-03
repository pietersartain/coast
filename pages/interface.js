// ****************************************************************************
// Document Ready!
// ****************************************************************************
$(document).ready(function() {
var input_box = $('.input');

// var db = require('diskdb');
// db.connect('./db/', ['servers']);

var sm = new ServerModel();
ko.applyBindings(sm);

// ko.applyBindings(new ReservationsViewModel());

if (sm.countServers() == 0) {
  $("#myModal").modal('show');
}

// ****************************************************************************
// General utility functions
// ****************************************************************************
input_box.keyup(function(e){
    if(e.shiftKey && e.keyCode == 13) {
      $(this).trigger("shiftEnterKey");
    } else 
    if(e.ctrlKey && e.keyCode == 13) {
      $(this).trigger("ctrlEnterKey");
    } else 
    if(e.keyCode == 13)
    {
      $(this).trigger("enterKey");
    } 
});

// ****************************************************************************
// Manual key bindings
// ****************************************************************************
input_box.bind("enterKey",function(e){
  var say_val = input_box.val();
  if (say_val != '') {
    client.say("#" + channel_name,say_val);
    channel.add_message(nick_name, say_val)
    input_box.val('');
  }
});

// Dynamically adjust the height of the textarea
// input_box.bind("shiftEnterKey", function(e){
//   input_box.height(input_box.height()+input_box.height());
// });

// input_box.bind("ctrlEnterKey", function(e){
//   input_box.height(input_box.height()+input_box.height());
// });

// ****************************************************************************
// Modal window binds
// ****************************************************************************
$("#add_server").bind("click", function(e){
  server_name = $("input[name='server_name']").val();
  nick_name = $("input[name='nick_name']").val();
  server_addr = $("input[name='server_addr']").val();

  if ( (nick_name != '') | (server_addr != '' ) ) {
    // Add to model
    sm.addServer(server_name, nick_name, server_addr);
    $("#myModal").modal('hide');
  }

  // console.log(nick_name, server_addr, nick_name == '', nick_name != '');
});


      // $('#myModal').on('shown.bs.modal', function () {
      //   $('#myInput').focus()
      // });
});