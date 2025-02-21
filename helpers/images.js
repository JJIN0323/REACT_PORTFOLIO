var models = require('../models')

module.exports = {
    popular: function (callback) {
        models.Image.find({}, {}, { limit: 3, sort: { likes: -1 }},
            function(err, images){
                if (err) throw err
                callback(null, images)
            }
        )
    }
}
