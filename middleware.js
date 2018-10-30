/**
 * Module
 */

function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(500).send('Not authenticated')
  }
}


/**
 * Module exports
 */

module.exports = {
  authenticate,
}
