
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

    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify({}))
    }

    this.data = fs.readFileSync(dbPath)
  }

  save() {
    fs.writeFileSync(this.dbPath, this.data)
  }
}

/**
 * Module exports
 */

module.exports = Store