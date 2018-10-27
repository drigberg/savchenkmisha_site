
/**
 * Module dependencies
 */

const http = require('request-promise')
const db = require('../db')

/**
 * Module
 */

function request(opts) {
  return http({
    ...opts,
    json: true,
    uri: `http://localhost:5000/${opts.path}`
  })
}

function flushDb() {
  db.projects.removeAll()
}

/**
 * Module exports
 */

module.exports = {
  flushDb,
  request,
}