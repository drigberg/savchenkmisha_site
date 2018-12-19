'use strict'
const db = require('../../api/db')

module.exports = {
  NODE_ENV: '"production"',
  CSRF: `"${db.admin.getCSRF()}"`
}
