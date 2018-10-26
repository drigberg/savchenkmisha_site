const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function (req, res){
    res.render('index')
})


app.get('/projects', function (req, res){
  // return all projects
})

app.post('/projects', function (req, res){
  // insert project into json file
})

app.listen(PORT, function(err){
  if (err) {
    console.log('Error starting server', err)
    process.exit(1)
  }

  console.log(`Server is running on port ${PORT}`)
})