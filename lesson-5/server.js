'use strict';

const Hapi = require('hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(require('inert'));

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        return h.file('./public/hello.html');
      }
    })

    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();