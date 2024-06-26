const express = require('express');
const session = require('express-session');
const app = express();
const authRouter = require('./routes/auth');
const { router: chatRouter, wss } = require('./routes/chat');

app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/', express.static('public'));

const server = app.listen(3000, () => {
  console.log('Server listening on port 3000 http://localhost:3000');
});

server.on('upgrade', (request, socket, head) => {
  session(request, {}, () => {
    if (!request.session.user) {
      socket.destroy();
    } else {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });
});
