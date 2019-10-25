const express = require('express');
const cors = require('cors');
const { pgClient, redisPublisher, redisClient } = require('./db');

const app = express();
app.use(cors);
app.use(express.json());

//routes
app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/', async (req, res, next) => {
  try {
    const { rows } = await pgClient.query('SELECT * FROM values');
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

app.get('/values/current', async (req, res, next) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', (req, res, next) => {
  const { index } = req.body;
  if (parseInt(index) > 40) return res.status(422).send('Index is too high');

  redisClient.hset('values', index, 'Noting yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1) [index]');

  res.send({ working: true });
});

app.listen(5000, () => console.log('listening on port 5000'));
