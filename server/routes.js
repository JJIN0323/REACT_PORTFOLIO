var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home'),
    about = require('../controllers/about'),
    post = require('../controllers/post'),
    portfolio = require('../controllers/portfolio'),
    wirte = require('../controllers/wirte'),
    image = require('../controllers/image')

module.exports = function(app) {
    router.get('/', home.index) // index page
    router.get('/about', about.index) // about page
    router.get('/post', post.index) // post list page
    router.get('/portfolio', portfolio.index)
    router.get('/wirte', wirte.index) // wirte page
    router.get('/post/:image_id', image.index) // post view page
    router.post('/post', image.create) // image upload
    router.get('/post/:image_id/modify', image.modify) // image modify
    router.post('/post/:image_id/update', image.update) // image update
    router.post('/post/:image_id/comment', image.comment) // comment upload
    router.delete('/post/:image_id', image.remove) // image delete
    app.use(router)
}
