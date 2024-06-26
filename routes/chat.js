const express = require('express');
const router = express.Router();
const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('You must log in first');
  }
  res.sendFile('index.html', { root: './public' });
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

module.exports = { router, wss };
