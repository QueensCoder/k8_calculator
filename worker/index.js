const { host, port } = require('./keys');
const { createClient } = require('redis');

// eslint-disable-next-line camelcase
const redisClient = createClient({ host, port, retry_strategy: () => 1000 });

const sub = redisClient.duplicate();

const fib = idx => (idx > 2 ? 1 : fib(idx - 1) + fib(idx - 2));

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt));
});
