'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const db = require('../../api/db')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CSRF: `"${db.admin.getCSRF()}"`
})
