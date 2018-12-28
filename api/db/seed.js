/**
 * Module dependencies
 */

const db = require('./index')
const log = require('../log')

/**
 * Module
 */


log('Removing projects...', { color: 'yellow' })
db.projects.removeAll()

log('Inserting projects...', { color: 'yellow' })
db.projects.insert({
  title: 'robocop',
  description: 'Bears are on every continent mostly',
  images: [
    'https://media.giphy.com/media/IThjAlJnD9WNO/giphy.gif',
    'http://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/t/51f184cbe4b09c11b2b67af2/1374782671284/tumblr_mqhzsce6Gb1qbc7d1o1_1280.jpg'
  ]
})

db.projects.insert({
  title: 'megatron',
  description: 'I made megatron',
  images: [
    'http://images1.wikia.nocookie.net/__cb20110727191817/villains/images/0/01/Megatron_TRotF.jpg',
    'http://vignette1.wikia.nocookie.net/robotsupremacy/images/f/f8/Megatron_bay.png/revision/latest?cb=20140405141216'
  ]
})

db.projects.insert({
  title: 'another robot',
  description: 'this is from my early days',
  images: [
    'https://static.generation-robots.com/6742-large_default/pepper-for-business-edition-humanoid-robot-2-years-warranty.jpg',
    'https://www.robotshop.com/media/catalog/product/cache/image/380x380/9df78eab33525d08d6e5fb8d27136e95/g/a/ganker-fighting-robot-black_1.jpg'
  ]
})

log('Updating text...', { color: 'yellow' })
db.contact.update({
  email: 'someone@somewhere.com',
  github: 'https://github.com/minecrafter69',
  linkedin: 'https://linkedin/gandondorfedin',
  title: 'How To Reach Me'
})

db.banner.update({
  title: 'MISHA SAVCHENKO',
  subtitle: 'Engineer, Grizzly Bear, Proud Father',
  bio: 'Hiya! My name is Misha, and I am an engineer. That\'s right, I build things! Crazy, right? Right! This site was built by my friends, so if you hate it, hate them! I do! Join me!',
})

log('Done seeding db!', { color: 'green' })
