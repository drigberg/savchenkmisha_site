const fs = require('fs')
const path = require('path')

const env = fs.readFileSync(path.join(__dirname, '../.env'))
  .toString()
  .split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.trim().split('=')
    acc[key] = value

    return acc
  }, {})

module.exports = env