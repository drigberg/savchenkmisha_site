const Client = require('ioredis')
const env = require('./env')

const client = new Client({
  port: 6379,
  host: 'redis',
  password: env.REDIS_PASSWORD,
})

module.exports = {
  client
}