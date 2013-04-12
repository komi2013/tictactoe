var express = require('express')
  , https = require('https')
  , path = require('path')
  , io = require('socket.io')
  , fs = require('fs')

var options = {
    key: fs.readFileSync('/etc/httpd/conf.d/private.key'), // 秘密鍵
    cert: fs.readFileSync('/etc/httpd/conf.d/public.crt'), // 公開鍵
};
 
var app = express()
  , server = require('https').createServer(options,app)
  , io = io.listen(server);
 
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
 
app.configure('development', function(){
  app.use(express.errorHandler());
});

 
server.listen(app.get('port'))

var guest = 0;

marubatsu = io.sockets.on('connection', function(client) {
++guest;
heya = Math.ceil((guest / 2));
    client.emit('connected');

    client.on('init', function() {
      var u_data = new Array();
      u_data[0] = guest;  
      u_data[1] = heya;
      u_data[2] = 1; //first turn
      client.join(guest);
      marubatsu.to(guest).emit('session', u_data);
      client.leave(guest);
      client.join(heya);
      marubatsu.to(heya).emit('msg', u_data);
      console.log(u_data);
    });

    client.on('msg', function(data) {
      console.log('guest ' + data[0]);
      console.log('room ' + data[1]);
      console.log('turn' + data[2]);
      console.log('place' + data[3]);

      ++data[2];
      marubatsu.to(data[1]).emit('msg', data);
    });
});

