/**
 * Module dependencies
 */

const server = require('./server')


/**
 * Module variables
 */

const PORT = process.env.PORT || 5000

/**
 * Module
 */

server.start(PORT)