const { Pool } = require('pg');
const { createClient } = require('redis');
const {
  database,
  host,
  password,
  port,
  user,
  redisPort,
  redisHost
} = require('./keys');

const pgClient = new Pool({
  user,
  host,
  database,
  password,
  port
});

pgClient.on('error', () => console.log('lost connection to data base'));
pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

const redisClient = createClient({
  host: redisHost,
  port: redisPort,
  // eslint-disable-next-line camelcase
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

module.exports = { pgClient, redisPublisher, redisClient };
