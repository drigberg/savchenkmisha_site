const chalk = require('chalk')

function log(message, { data, color } = {}) {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  const args = []

  if (color) {
    args.push(chalk[color](message))
  } else {
    args.push(message)
  }

  if (data) {
    args.push(data)
  }

  console.log(...args)
}

module.exports = log