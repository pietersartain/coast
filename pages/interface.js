exports.InterfaceModel = InterfaceModel;

function InterfaceModel(ko) {
  var self = this;
  var srv = require('./server.js')
  
  self.db = require('diskdb');
  self.db.connect('./db/', ['servers']);

  var input_box = $('.input');

  self.servers = ko.observableArray([]
    // [{"server_name":"a","nick_name":"aa"},
    // {"server_name":"b","nick_name":"bb"}]
  );

  self.selected_server = ko.observable();

  self.connected = ko.observable(true);

  // ...

  // Server stuff
  self.addServer = function(server_name, nick_name, server_addr) {
    var new_srv = new srv.ServerModel(server_name, nick_name, server_addr, ko, this.db);
    self.servers.push(new_srv);
    self.selected_server(new_srv);
  };

  self.loadServers = function() {
    for (let server of self.db.servers.find()) {
      self.addServer(
        server.server_name,
        server.nick_name,
        server.server_addr);
      // console.log(server);
    }
  };

  self.saveServer = function(server_name, nick_name, server_addr) {
    var server_details = {
      server_name : server_name, 
      nick_name : nick_name, 
      server_addr : server_addr
    };
    self.db.servers.save(server_details);
  };


  // Channel stuff
  self.append_msg = function(info) {
    $("#channellist-content").append("<li id='" + info + "'><span>#</span>" + info + "</li>");
  };

  // Constructor code
  self.loadServers();

  if (self.servers().length == 0) {
    $("#myModal").modal('show');
  }

  // var sm = new ServerModel();
  // ko.applyBindings(new ReservationsViewModel());

  // ****************************************************************************
  // Bindings
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

  input_box.bind("enterKey",function(e){
    var say_val = input_box.val();
    if (say_val != '') {

      client.say("#" + channel_name,say_val);
      channel.append_msg(nick_name, say_val)

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

  $("#add_server").bind("click", function(e){
    var server_name = $("input[name='server_name']").val();
    var nick_name = $("input[name='nick_name']").val();
    var server_addr = $("input[name='server_addr']").val();

    if ( (nick_name != '') | (server_addr != '' ) ) {
      self.addServer(server_name, nick_name, server_addr);
      self.saveServer(server_name, nick_name, server_addr);
      $("#server_modal").modal('hide');
    }
  });

  $("#create_channel").bind("click", function(e){
    var channel_name = $("input[name='channel_name']").val();

    if (channel_name != '') {
      self.selected_server().joinChannel(channel_name);
    }
  });

};
