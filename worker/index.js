const { host, port } = require('./keys');
const { redisClient } = require('redis');

// eslint-disable-next-line camelcase
const redisCli = redisClient({ host, port, retry_strategy: () => 1000 });

const sub = redisCli.duplicate();

const fib = idx => (idx > 2 ? 1 : fib(idx - 1) + fib(idx - 2));

sub.on('message', (channel, message) => {
  redisCli.hset('values', message, fib(parseInt));
});
