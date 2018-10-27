/**
 * Module
 */

function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}


/**
 * Module exports
 */

module.exports = {
  authenticate,
}
