/**
 * Module dependencies
 */

const express = require('express')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const passport = require('passport')
const LocalStrategy = require('passport-local')
const db = require('./db')
const {
  authenticate,
} = require('./middleware')

/**
 * Server
 */

const app = express()

/**
 * Middleware
 */

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.use(expressSession({
  secret: db.admin.getSecret(),
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(function(username, password, done) {
  if (!db.admin.checkCredentials(username, password)) {
    return done()
  }

  return done(null, {
    admin: true
  })
}))

passport.serializeUser(function(user, done) {
  done(null, 'admin')
})

passport.deserializeUser(function(id, done) {
  done(null, {
    admin: true
  })
})

app.set('views', './views')
app.set('view engine', 'pug')

/**
 * Routes
 */

app.get('/', function(req, res){
  res.render('index')
})

app.get('login', function(req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}))

app.post('/change_password', authenticate, function(req, res) {
  if (!db.admin.checkPassword(req.body.current_password)) {
    res.status(500).send('incorrect password')
    return
  }


  db.admin.updatePassword(req.body.new_password)

  req.logout()
  res.redirect('/')
})

app.post('/change_username', authenticate, function(req, res) {
  if (!db.admin.checkPassword(req.body.password)) {
    res.status(500).send('incorrect password')
    return
  }

  db.admin.updateUsername(req.body.new_username)

  req.logout()
  res.redirect('/')
})

app.get('/projects', authenticate, function(req, res){
  const projects = db.projects.list()
  res.json(projects)
})

app.post('/projects', authenticate, function(req, res){
  const project = db.projects.insert(req.body)
  console.log('Inserted project', project)

  res.json(project)
})

app.post('/projects/:id', authenticate, function(req, res){
  const project = db.projects.update(req.params.id, req.body)
  console.log('Updated project', project)

  res.json(project)
})

app.delete('/projects/:id', authenticate, function(req, res){
  db.projects.remove(req.params.id)
  console.log(`Removed project ${req.params.id}`)

  res.json({ ok: 'ok' })
})

class Server {
  start() {
    const that = this
    return new Promise(function (resolve, reject) {
      that.server = app.listen(PORT, function(err){
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