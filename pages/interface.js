exports.InterfaceModel = InterfaceModel;

function InterfaceModel(ko) {
  var self = this;
  var srv = require('./server.js')
  
  self.db = require('diskdb');
  self.db.connect('./db/', ['servers', 'channels']);

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


  self.addServerBind = function() {
    var server_name = $("input[name='server_name']");
    var nick_name = $("input[name='nick_name']");
    var server_addr = $("input[name='server_addr']");

    if ( (nick_name.val() != '') | (server_addr.val() != '' ) ) {
      self.addServer(server_name.val(), nick_name.val(), server_addr.val()  );
      self.saveServer(server_name.val(), nick_name.val(), server_addr.val() );

      server_name.val("");
      nick_name.val("");
      server_addr.val("");
      $("#server_modal").modal('hide');
    }
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

  // Dynamically adjust the height of the textarea
  // input_box.bind("shiftEnterKey", function(e){
  //   input_box.height(input_box.height()+input_box.height());
  // });

  // input_box.bind("ctrlEnterKey", function(e){
  //   input_box.height(input_box.height()+input_box.height());
  // });

};
