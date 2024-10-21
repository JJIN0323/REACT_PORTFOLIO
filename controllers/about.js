var sidebar = require('../helpers/sidebar'),
    ImageModel = require('../models').Image

module.exports = {
  index: function(req, res) {
    //res.send('The Home:index controller')
    //res.render('index')
    var viewModel = {
      images: []
    }
    //res.render('index', viewModel)
    ImageModel.find({}, {}, { sort: { timestamp: -1}},
      function(err, images){
        if (err) { throw err } // p.177
        viewModel.images = images

        sidebar(viewModel, function(viewModel){
          res.render('about', viewModel)
        })
      })

  }
}
