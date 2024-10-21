var Stats = require('./stats'),
    Images = require('./images'),
    Comments = require('./comments'),
    async = require('async')

module.exports = function(viewModel, callback) {
    async.parallel([
        function(next){
            //next(null, Stats())
            Stats(next)
        },
        function(callback){
            //next(null, Images.popular())
            Images.popular(callback)
        },
        function(next){
            //next(null, Comments())
            Comments.newest(next)
        }
    ], function(err, results){
        viewModel.sidebar = {
            stats: results[0],
            popular: results[1],
            comments: results[2]
        }

        callback(viewModel)
    })
}
