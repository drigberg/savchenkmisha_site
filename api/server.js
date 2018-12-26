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
    console.log(`Failed login at ${new Date().toISOString()}`)
    return done()
  }

  console.log(`Successful login at ${new Date().toISOString()}`)

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
  console.log('AUTHENTICATION:', {
    authenticated: req.isAuthenticated(),
    session: req.session,
    csrf: req.headers.csrf
  })

  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(500).send('Not authenticated')
  }
}

/**
 * Routes
 */

app.get('/', function (req, res) {
  res.render('index', {
    csrf: req.session ? req.session.csrf : null,
    loggedIn: req.isAuthenticated()
  })
})

app.post('/api/login', passport.authenticate('local'), (req, res) => {
  req.session.csrf = crypto.randomBytes(256).toString('hex')
  res.json({ success: true })
})

app.get('/api/logout', function (req, res) {
  console.log(`Logout at ${new Date().toISOString()}`)
  db.admin.refreshSecret()
  req.logout()
  req.session.csrf = null
  res.status(200).json({ success: true })
})

app.post('/api/change_credentials', authenticate, function (req, res) {
  if (!db.admin.checkCredentials(req.body.current_username, req.body.current_password)) {
    res.status(500).send('incorrect credentials')
    return
  }

  if (req.body.new_password) {
    db.admin.updatePassword(req.body.new_password)
    console.log(`Updated password at ${new Date().toISOString()}! Logging out.`)
  }

  if (req.body.new_username) {
    db.admin.updateUsername(req.body.new_username)
    console.log(`Updated username at ${new Date().toISOString()}! Logging out.`)
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

app.post('/api/contact', authenticate, function (req, res) {
  const contact = db.contact.update(req.body)
  console.log(`Updated contact at ${new Date().toISOString()}:`, contact)

  res.json(contact)
})

app.post('/api/projects', authenticate, function (req, res) {
  const project = db.projects.insert(req.body)
  console.log(`Inserted project at ${new Date().toISOString()}:`, project)

  res.json(project)
})

app.post('/api/projects/:id', authenticate, function (req, res) {
  const project = db.projects.update(req.params.id, req.body)
  console.log(`Updated project at ${new Date().toISOString()}:`, project)

  res.json(project)
})

app.delete('/api/projects/:id', authenticate, function (req, res) {
  db.projects.remove(req.params.id)
  console.log(`Removed project ${req.params.id} at ${new Date().toISOString()}`)

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
        console.log(`Server is running on port ${PORT}`)
      })
      .catch((err) => {
        console.log('Error starting server', err)
      })
  }

  stop() {
    console.log('Stopping server!')
    this.server.close()
  }
}

/**
 * Module.exports
 */

module.exports = new Server()