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
