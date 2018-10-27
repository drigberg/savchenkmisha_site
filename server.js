/**
 * Module dependencies
 */

const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const db = require('./db')

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
app.set('views', './views')
app.set('view engine', 'pug')

/**
 * Routes
 */

app.get('/', function (req, res){
    res.render('index')
})

app.get('/projects', function (req, res){
  const projects = db.projects.list()
  res.json(projects)
})

app.post('/projects', function (req, res){
  const project = db.projects.insert(req.body)
  console.log('Inserted project', project)

  res.json(project)
})

app.post('/projects/:id', function (req, res){
  const project = db.projects.update(req.params.id, req.body)
  console.log('Updated project', project)

  res.json(project)
})

app.delete('/projects/:id', function (req, res){
  db.projects.remove(req.params.id)
  console.log(`Removed project ${req.params.id}`)

  res.json({ ok: 'ok' })
})

class Server {
  start() {
    return new Promise((resolve, reject) => {
      this.server = app.listen(PORT, function(err){
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
    this.server.close()
  }
}

/**
 * Module.exports
 */

module.exports = new Server()