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

  self.addServer = function(server_name, nick_name, server_addr) {
    var new_srv = new srv.ServerModel(server_name, nick_name, server_addr, ko, this.db);
    self.servers.push(new_srv);
    self.selected_server(self.servers().length-1);
  };

  self.loadServers = function() {
    for (let server of self.db['servers'].find()) {
      self.addServer(
        server.server_name,
        server.nick_name,
        server.server_addr
      );
    }
  };

  self.saveServer = function(server_name, nick_name, server_addr) {
    var server_details = {
      server_name : server_name, 
      nick_name : nick_name, 
      server_addr : server_addr
    };
    self.db['servers'].save(server_details);
  };

  self.selectServer = function(server_idx) {
    self.selected_server(server_idx);
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

  self.quitProgram = function() {
    for (let server of self.servers()) {
      for (let channel of server.channels()) {
        channel.saveNewMessages();
      }
    }
  }

  // Constructor code
  self.loadServers();

  if (self.servers().length == 0) {
    $("#server_modal").modal('show');
  }

  // Dynamically adjust the height of the textarea
  // input_box.bind("shiftEnterKey", function(e){
  //   input_box.height(input_box.height()+input_box.height());
  // });

  // input_box.bind("ctrlEnterKey", function(e){
  //   input_box.height(input_box.height()+input_box.height());
  // });

};
