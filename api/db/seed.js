/**
 * Module dependencies
 */

const db = require('./index');

/**
 * Module
 */

db.projects.removeAll();

db.projects.insert({
  title: 'robocop',
  description: 'I made robocop',
  images: [
    'http://ildiariosegretodicupido.altervista.org/wp-content/uploads/2014/06/robocop-6.jpg',
    'http://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/t/51f184cbe4b09c11b2b67af2/1374782671284/tumblr_mqhzsce6Gb1qbc7d1o1_1280.jpg'
  ]
});

db.projects.insert({
  title: 'megatron',
  description: 'I made megatron',
  images: [
    'http://images1.wikia.nocookie.net/__cb20110727191817/villains/images/0/01/Megatron_TRotF.jpg',
    'http://vignette1.wikia.nocookie.net/robotsupremacy/images/f/f8/Megatron_bay.png/revision/latest?cb=20140405141216'
  ]
});

db.projects.insert({
  title: 'another robot',
  description: 'this is from my early days',
  images: [
    'https://static.generation-robots.com/6742-large_default/pepper-for-business-edition-humanoid-robot-2-years-warranty.jpg',
    'https://www.robotshop.com/media/catalog/product/cache/image/380x380/9df78eab33525d08d6e5fb8d27136e95/g/a/ganker-fighting-robot-black_1.jpg'
  ]
});

db.about.update({
  text: 'Hiya! My name is Misha, and I am an engineer. That\'s right, I build things! Crazy, right? Right! This site was built by my friends, so if you hate it, hate them! I do! Join me!',
  title: 'About Me-sha',
  images: ['https://i.pinimg.com/236x/0d/f2/de/0df2de6df5274fd63a076c7bf1b4fd1e--prayers-katie-omalley.jpg']
})

db.contact.update({
  email: 'someone@somewhere.com',
  github: 'https://github.com/minecrafter69',
  linkedin: 'https://linkedin/gandondorfedin',
  title: 'How To Reach Me'
})
