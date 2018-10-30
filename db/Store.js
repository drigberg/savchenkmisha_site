
/**
 * Module dependencies
 */

const fs = require('fs')

/**
 * Module
 */

class Store {
  constructor(dbPath) {
    this.path = dbPath

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify({}))
    }

    this.data = JSON.parse(fs.readFileSync(this.path))
  }

  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.data))
  }
}

/**
 * Module exports
 */

module.exports = Store