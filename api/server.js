/**
 * Module dependencies
 */

const bodyParser = require('body-parser')
const chalk = require('chalk')
const express = require('express')
const jwt = require('jsonwebtoken')
const LocalStrategy = require('passport-local')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const path = require('path')
const db = require('./db')
const { get } = require('lodash')

/**
 * Module variables
 */

const app = express()
const PORT = process.env.PORT || 5000

/**
 * Middleware
 */

app.use(express.static(path.join(__dirname, '..', '/ui/dist')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// check username && password
passport.use(new LocalStrategy(function (username, password, done) {
  if (!db.admin.checkCredentials(username, password)) {
    console.log(chalk.red(`Failed login at ${new Date().toISOString()}`))
    return done()
  }

  return done(null, {
    admin: true
  })
}))

// validate JWT
passport.use(new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKeyProvider: (req, token, done) => done(null, db.admin.getSecret()),
  passReqToCallback: true,
}, (req, jwtPayload, done) => {
  const csrf = get(req, 'headers.csrf')

  if (jwtPayload.admin && db.admin.checkCSRF(csrf)) {
    done(null, jwtPayload)
  } else {
    done()
  }
}))

app.use(passport.initialize())

/**
 * Routes
 */

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/api/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      console.log(chalk.red(`Failed login at ${new Date().toISOString()}:`), {
        err,
        user
      })

      res.status(400).json({
        message: 'login failed',
        error: err,
        user,
      })
      return
    }

    req.login(user, { session: false }, (error) => {
      if (error) {
        console.log(chalk.red(`Failed login at ${new Date().toISOString()}:`), {
          error,
          user
        })

        res.status(400).json({
          error,
          message: 'login failed',
          user,
        })
        return
      }

      console.log(chalk.green(`Successful login at ${new Date().toISOString()}:`), {
        user
      })

      const token = jwt.sign(user, db.admin.getSecret(), { expiresIn: 60 * 60 })
      res.json({ user, token })
    })
  })(req, res)
})

app.get('/api/logout', function (req, res) {
  console.log(chalk.cyan(`Logout at ${new Date().toISOString()}`))
  db.admin.refreshSecret()
  res.status(200).json({ success: true })
})

app.post('/api/change_credentials', passport.authenticate('jwt', { session: false }), function (req, res) {
  if (!db.admin.checkCredentials(req.body.current_username, req.body.current_password)) {
    res.status(500).send('incorrect credentials')
    return
  }

  if (req.body.new_password) {
    db.admin.updatePassword(req.body.new_password)
    console.log(chalk.green(`Updated password at ${new Date().toISOString()}! Logging out.`))
  }

  if (req.body.new_username) {
    db.admin.updateUsername(req.body.new_username)
    console.log(chalk.green(`Updated username at ${new Date().toISOString()}! Logging out.`))
  }

  req.logout()
  res.json({ ok: 'ok' })
})

app.get('/api/about', function (req, res) {
  const about = db.about.read()
  res.json(about)
})

app.get('/api/contact', function (req, res) {
  const contact = db.contact.read()
  res.json(contact)
})

app.get('/api/projects', function (req, res) {
  const projects = db.projects.list()
  res.json(projects)
})

app.post('/api/contact', passport.authenticate('jwt', { session: false }), function (req, res) {
  const contact = db.contact.update(req.body)
  console.log(chalk.green(`Updated contact at ${new Date().toISOString()}:`), contact)

  res.json(contact)
})

app.post('/api/projects', passport.authenticate('jwt', { session: false }), function (req, res) {
  const project = db.projects.insert(req.body)
  console.log(chalk.green(`Inserted project at ${new Date().toISOString()}:`), project)

  res.json(project)
})

app.post('/api/projects/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  const project = db.projects.update(req.params.id, req.body)
  console.log(chalk.green(`Updated project at ${new Date().toISOString()}:`), project)

  res.json(project)
})

app.delete('/api/projects/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  db.projects.remove(req.params.id)
  console.log(chalk.green(`Removed project ${req.params.id} at ${new Date().toISOString()}`))

  res.json({ ok: 'ok' })
})

app.get('*', (req, res) => {
  res.redirect('/')
})

class Server {
  start() {
    const that = this
    return new Promise(function (resolve, reject) {
      that.server = app.listen(PORT, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
      .then(() => {
        console.log(chalk.cyan(`Server is running on port ${PORT}`))
      })
      .catch((err) => {
        console.log(chalk.red('Error starting server'), err)
      })
  }

  stop() {
    console.log(chalk.cyan('Stopping server!'))
    this.server.close()
  }
}

/**
 * Module.exports
 */

module.exports = new Server()