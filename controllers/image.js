var fs = require('fs'),
    path = require('path'),
    sidebar = require('../helpers/sidebar'),
    Models = require('../models'),
    md5 = require('md5')

module.exports = {
    index: function (req, res) {
        var viewModel = {
            image: {},
            comments: []
        }
        Models.Image.findOne({ filename: { $regex: req.params.image_id } },
            function (err, image) { //단수형
                // p.177
                if (err) { throw err }
                if (image) {
                    image.views = image.views + 1
                    // viewModel에 이미지 저장
                    viewModel.image = image
                    image.save()

                    Models.Comment.find(
                        { image_id: image._id },
                        {},
                        { sort: { 'timestamp': 1 } },
                        function (err, comments) {
                            //if (err) throw err
                            viewModel.comments = comments
                            sidebar(viewModel, function (viewModel) {
                                res.render('image', viewModel)
                            })
                        }
                    )
                } else {
                    res.redirect('/')
                }
            })
    },
    create: function (req, res) { // p.140 고유의 이름 생성, 이미지 파일이 맞는지 체크, 경로로 리다이렉트해서 보여줌.
        //res.send('The image:create POST controller')
        var saveImage = function () {

            // 이미지의 고유 식별자 생성해주기 위한 변수
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = ''
            // 6번 돌아서 하나씩빼온다음에 붙여줌. for 끝에는 문자와 숫자 6자리로 구성된 문자열이 생성
            for (var i=0; i<6; i+=1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length))
            }

            // 동일한 파일명을 가진 이미지 검색
            Models.Image.find({ filename: imgUrl }, function (err, images) {
                if (images.length > 0) {
                    // 일치하는 image 발견했을 경우, 다시시도
                    saveImage()
                } else {
                    /** tempPath : 업로드 파일이 저장될 임의의 장소
                        ext : 업로드 된 파일의 확장자
                        targetPath : 업로드된 이미지가 최종적으로 저장될 위치 **/
                    var tempPath = req.files.file.path,
                        ext = path.extname(req.files.file.name).toLowerCase(),
                        targetPath = path.resolve('./public/upload/' + imgUrl + ext)

                    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                        fs.rename(tempPath, targetPath, function (err) {
                            if (err) { throw err }
                            // 새로운 image 모델 생성 후 상세내용을 넣음
                            // 몽구스 모델 추가
                            //var Image = mongoose.model('Image', ImageSchema)

                            var newImage = new Models.Image({
                                title: req.body.title,
                                filename: imgUrl + ext,
                                description: req.body.description,
                                hashtag: req.body.hashtag
                            })
                            // 변수값 체크
                            console.log(newImage)
                            // image 객체 저장
                            newImage.save(function (err, image) {
                                if (err) { throw err }
                                console.log('이미지 업로드 성공 : ' + image.filename)
                                // 응답 : 이미지파일이 맞다면, 최종적으로 저장될 위치로 이동함
                                res.redirect('post/' + image.uniqueId)
                            })
                        })
                    } else {
                        fs.unlink(tempPath, function () {
                            if (err) throw err
                            // 응답 : 이미지파일이 아니라면, 500 에러를 내보냄
                            res.json(500, { error: '이미지 파일만 가능합니다.' })
                        })
                    }
                }
            })
        }
        saveImage()
    },
    modify: function(req, res) {
      var viewModel = {
          image: {},
          comments: []
      }
      Models.Image.findOne({ filename: { $regex: req.params.image_id } },
          function (err, image) { //단수형
              // p.177
              if (err) { throw err }
              if (image) {
                  image.views = image.views + 1
                  // viewModel에 이미지 저장
                  viewModel.image = image
                  image.save()

                  Models.Comment.find(
                      { image_id: image._id },
                      {},
                      { sort: { 'timestamp': 1 } },
                      function (err, comments) {
                          //if (err) throw err
                          viewModel.comments = comments
                          sidebar(viewModel, function (viewModel) {
                              res.render('modify', viewModel)
                          })
                      }
                  )
              } else {
                  res.redirect('/')
              }
          })
    },
    update: function(req, res){
        Models.Image.findOneAndUpdate({ filename: { $regex: req.params.image_id }}, req.body, { new: true },
          function(err, image) {
              if (err) { throw err }

              var updateImage = new Models.Image(req.body)
              // 변수값 체크
              console.log(updateImage)

              if (!err && image) {
                  if (err) { throw err }

                  updateImage.save(function(err, update){
                      if (err) { throw err }
                      res.redirect('/post/' + image.uniqueId + '#update')
                  })
              } else {
                  res.redirect('/')
              }
          }
      )
    },
    comment: function(req, res) {
        Models.Image.findOne({ filename: { $regex: req.params.image_id } },
            function(err, image) {

                if (err) { throw err }
                // bodyParser를 이용해서 인자를 넘겨받음.
                var newComment = new Models.Comment(req.body)
                //console.log(newComment)
                if (!err && image) {
                    if (err) { throw err }
                    newComment.gravatar = md5(newComment.email)
                    newComment.image_id = image._id

                    newComment.save(function(err, comment){
                        if (err) { throw err }
                        res.redirect('/post/' + image.uniqueId + '#' + comment._id)
                        //res.json({ comment: image.comment })
                    })
            } else {
                res.redirect('/')
            }
        })
    },
    remove: function(req, res) {
        //res.send()
        Models.Image.findOne({ filename: { $regex: req.params.image_id }},
            function(err, image){
                if (err) { throw err }

                fs.unlink(path.resolve('./public/upload/' + image.filename),
                function(err){
                    //if (err) { throw err }

                    Models.Comment.remove({ image_id: image._id},
                        function(err){
                            image.remove(function(err){
                                if (!err){
                                    res.json(true)
                                } else {
                                    res.json(false)
                                }
                            })
                    })
                })
            })
    }
}
