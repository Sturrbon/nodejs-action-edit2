const app = module.exports = require('derby')
  .createApp('hello', __filename);
app.loadViews(__dirname);

app.get('/', (page, model) => {
  const message = model.at('hello.message');
  message.subscribe(err => {
    if (err) return next(err);
    message.createNull('');
    page.render();
  });
});