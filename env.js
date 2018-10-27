/**
 * Module dependencies
 */

const fs = require('fs')
const path = require('path')

/**
 * Module
 */

const env = Object.freeze(JSON.parse(fs.readFileSync(path.join(__dirname, '.env.json'))))

/**
 * Module exports
 */

module.exports = env
