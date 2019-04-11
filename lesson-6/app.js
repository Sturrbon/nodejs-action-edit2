// const app = require('connect')();
// app.use((req, res, next) => {
//   res.end('Hello, World!');
// });
// app.listen(3000);

// use middleware
const connect = require('connect');

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
}
const app = connect();
app.use(logger);
app.use(hello);
app.listen(3000);