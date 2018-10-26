/**
 * Module dependencies
 */

const express = require('express')
const PORT = process.env.PORT || 5000
const db = require('./db')

/**
 * Middleware
 */

const app = express()
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

/**
 * Server star
 */

app.listen(PORT, function(err){
  if (err) {
    console.log('Error starting server', err)
    process.exit(1)
  }

  console.log(`Server is running on port ${PORT}`)
})