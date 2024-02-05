import {
  Request,
  Response
} from 'express'
const express = require('express');
const morgan = require('morgan');
import cors from 'cors'

const app = express();

interface Subscription {
  endpoint: string
  expirationTime: any
  keys: {
    p256dh: string
    auth: string
  }
}

let subscription: Subscription

app.use(cors())
app.use(morgan('dev'));
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.post('/notifications/subscription', function (request: Request, res: Response) {
  console.log(request.body);
  subscription = request.body
})

import webpush from 'web-push'
const vapidKeys = {
  publicKey:
    'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
  privateKey: 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls',
};

webpush.setVapidDetails(
  'mailto:web-push-book@gauntface.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);


app.post('/test', function(req: Request, res: Response) {
  webpush.sendNotification(subscription, "hello")
  .then(function() {
    res.sendStatus(204)
  })
  .catch(function(err) {
    console.error("got a web-push error: ", err)
  })
})

app.listen(8080, () => {
  console.log('Listening to 0.0.0.0:8080');
});
