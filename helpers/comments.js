var models = require('../models'),
    async = require('async')

module.exports = {
    // newest 함수는 최근 5개 댓글을 읽어와서 
    // 모든 함수가 실행이 끝나면 한번만 호출하는 callback 함수
    newest : function(callback) {
        models.Comment.find({}, {}, { limit: 5, sort: {'timestamp': -1}},
        function(err, comments){
            console.log(comments)

            // 첫번째 인자는 각각의 댓글 모델이고, 두번째는 콜백함수
            var attachImage = function(comment, next){
                // 몽고DB에 쿼리를 실행해서 일치하는 _id를 가진 이미지를 반환
                models.Image.findOne({ _id : comment.image_id},
                function(err, image){
                    if (err) throw err

                    // 이미지를 찾으면 image 프로퍼티에 할당하고 콜백함수를 실행
                    comment.image = image
                    next(err)
                })
            }

            // comments 배열에 있는 모든 댓글을 순회하면서 each의 첫번째 인자로 넘김
            // attachImage는 모든 배열에 호출
            async.each(comments, attachImage, function(err){
                if (err) throw err

                callback(err, comments)
            })
        })
    }
}
