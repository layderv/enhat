var io;

module.exports = {
    init: function(server) {
        io = require('socket.io').listen(server);
        io.on('connection', function(socket) {
            console.log('a user connected');

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
            console.log('[SRV] Received: ' + obj.msg + ' from: ' + obj.from);

            io.emit('chat message', {
                msg: obj.msg || [],
                from: sanitizeUsername(obj.from || ''),
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