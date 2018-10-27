/**
 * Module dependencies
 */

const db = require('./index')

/**
 * Module
 */

db.projects.insert({
  title: 'robocop',
  description: 'I made robocop',
  images: [
    'http://ildiariosegretodicupido.altervista.org/wp-content/uploads/2014/06/robocop-6.jpg',
    'http://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/t/51f184cbe4b09c11b2b67af2/1374782671284/tumblr_mqhzsce6Gb1qbc7d1o1_1280.jpg',
  ]
})

db.projects.insert({
  title: 'megatron',
  description: 'I made megatron',
  images: [
    'http://images1.wikia.nocookie.net/__cb20110727191817/villains/images/0/01/Megatron_TRotF.jpg',
    'http://vignette1.wikia.nocookie.net/robotsupremacy/images/f/f8/Megatron_bay.png/revision/latest?cb=20140405141216',
  ]
})