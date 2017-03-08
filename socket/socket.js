var io;

module.exports = {
    init: function(server) {
        io = require('socket.io').listen(server);
        io.on('connection', function(socket) {
            var date = new Date();
            console.log('*****************************************');
            console.log('[SRV] (' + date + ') a user connected');
            console.log(socket.conn.request.headers);
            console.log('[SRV] remote address: ' + socket.conn.remoteAddress);
            console.log('*****************************************');

            socket.on('disconnect', function() {
                console.log('user disconnected');
            });

            socket.on('new user', handle('new user', socket));
            socket.on('chat message', handle('chat message'));
        });
    }
};

function handle(what, socket) {
    switch (what) {
        case 'chat message': return function(obj) {
            console.log('[SRV] Received: ', obj.msg, ' from: ', obj.usr);

            io.emit('chat message', {
                msg: obj.msg || '',
                usr: obj.usr,
            });
        };
        case 'new user': return function() {
            // avoiding sending the new user a message notifying she just connected
            socket.broadcast.emit('new user');
        };
    }
}

function sanitizeUsername(username) {
    var last = username.indexOf('>');
    var u = username.substr(0, last > 0 ? last : username.length);
    return u;
}