var ImageModel = require('../models').Image

module.exports = {
  index: function(req, res) {
    //res.send('The Home:index controller')
    //res.render('index')
    var viewModel = {
      images: []
    }
    //res.render('index', viewModel)
    ImageModel.find({}, {}, { limit: 8, sort: { timestamp: -1}},
      function(err, images){
        if (err) { throw err } // p.177
        viewModel.images = images

        res.render('index', viewModel)
      })

  }
}
