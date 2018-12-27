/**
 * Module dependencies
 */


const bodyParser = require('body-parser')
const express = require('express')
const LocalStrategy = require('passport-local')
const passport = require('passport')
const path = require('path')
const expressSession = require('express-session')
const RedisStore = require('connect-redis')(expressSession)
const db = require('./db')
const cache = require('./cache')
const crypto = require('crypto')
const log = require('./log')

/**
 * Module variables
 */

const app = express()

/**
 * Middleware
 */

app.use(express.static(path.join(__dirname, '..', '/ui/dist')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('views', './ui/dist')
app.set('view engine', 'pug')

app.use(expressSession({
  store: new RedisStore({
    client: cache.client
  }),
  secret: db.admin.getSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 6 * 60 * 60 * 1000
  } // 6 hours
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(function (username, password, done) {
  if (!db.admin.checkCredentials(username, password)) {
    log(`Failed login at ${new Date().toISOString()}`, { color: 'magenta' })
    return done()
  }

  log(`Successful login at ${new Date().toISOString()}`)

  return done(null, {
    admin: true
  })
}))

passport.serializeUser(function (user, done) {
  done(null, 'admin')
})

passport.deserializeUser(function (id, done) {
  done(null, {
    admin: true
  })
})

function authenticate(req, res, next) {
  const validCsrf = req.headers.csrf && req.session && req.headers.csrf === req.session.csrf

  log('Authenticating:', {
    color: 'yellow',
    data: {
      authenticated: req.isAuthenticated(),
      validCsrf
    }
  })

  if (req.isAuthenticated() && validCsrf) {
    next()
  } else {
    res.status(401).send('Not authenticated')
  }
}

/**
 * Routes
 */

function logout(req) {
  if (req.logout) {
    req.logout()
  }

  if (req.session) {
    req.session.csrf = null
  }
}

app.get('/', function (req, res) {
  res.render('index', {
    csrf: req.session ? req.session.csrf : null,
    loggedIn: req.isAuthenticated()
  })
})

app.post('/api/login', passport.authenticate('local'), (req, res) => {
  req.session.csrf = crypto.randomBytes(64).toString('hex')
  res.json({ success: true })
})

app.get('/api/logout', function (req, res) {
  log(`Logout at ${new Date().toISOString()}`)
  db.admin.refreshSecret()

  logout(req)

  res.status(200).json({ success: true })
})

app.post('/api/reset_credentials', function (req, res) {
  log(`Reset credentials at ${new Date().toISOString()}`)

  if (!db.admin.checkUsername(req.body.username)) {
    res.status(400).send('no such user')
    return
  }

  db.admin.resetCredentials()

  logout(req)

  res.json({ success: true })
})

app.post('/api/change_credentials', authenticate, function (req, res) {
  if (!db.admin.checkCredentials(req.body.current_username, req.body.current_password)) {
    res.status(400).send('incorrect credentials')
    return
  }

  if (req.body.new_password) {
    db.admin.updatePassword(req.body.new_password)
    log(`Updated password at ${new Date().toISOString()}! Logging out.`)
  }

  if (req.body.new_username) {
    db.admin.updateUsername(req.body.new_username)
    log(`Updated username at ${new Date().toISOString()}! Logging out.`)
  }

  req.logout()
  res.json({ success: true })
})

app.get('/api/contact', function (req, res) {
  const contact = db.contact.read()
  res.json(contact)
})

app.get('/api/banner', function (req, res) {
  const banner = db.banner.read()
  res.json(banner)
})

app.get('/api/projects', function (req, res) {
  const projects = db.projects.list()
  res.json(projects)
})

app.post('/api/contact', authenticate, function (req, res) {
  const contact = db.contact.update(req.body)
  log(`Updated contact at ${new Date().toISOString()}:`, { data: contact })

  res.json(contact)
})

app.post('/api/banner', authenticate, function (req, res) {
  const banner = db.banner.update(req.body)
  log(`Updated banner at ${new Date().toISOString()}:`, { data: banner })

  res.json(banner)
})

app.post('/api/projects', authenticate, function (req, res) {
  const project = db.projects.insert(req.body)
  log(`Inserted project at ${new Date().toISOString()}:`, { data: project })

  res.json(project)
})

app.post('/api/projects/:id', authenticate, function (req, res) {
  const project = db.projects.update(req.params.id, req.body)
  log(`Updated project at ${new Date().toISOString()}:`, { data: project })

  res.json(project)
})

app.delete('/api/projects/:id', authenticate, function (req, res) {
  db.projects.remove(req.params.id)
  log(`Removed project ${req.params.id} at ${new Date().toISOString()}`)

  res.json({ ok: 'ok' })
})

app.get('*', (req, res) => {
  res.redirect('/')
})

class Server {
  start(port) {
    log('Starting server...')
    const that = this
    return new Promise(function (resolve, reject) {
      that.server = app.listen(port, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
      .then(() => {
        log(`Server is running on port ${port}`)
      })
      .catch((err) => {
        log('Error starting server', { data: err })
      })
  }

  stop() {
    log('Stopping server!')
    return new Promise((resolve) => {
      this.server.close(() => resolve())
    })
  }
}

/**
 * Module.exports
 */

module.exports = new Server()