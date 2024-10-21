var express = require('express'),
    config = require('./server/configure'),
    app = express(),
    mongoose = require('mongoose')

app.set('port', process.env.PORT || 3300)
app.set('views', __dirname + '/views')
app = config(app)

// 몽고DB 서버랑 연결
mongoose.connect('mongodb://localhost/imazin', {useNewUrlParser : true}) // 서버주소
mongoose.connection.on('open', function() { // 연결됬을때 메시지 출력하게끔
  console.log('mongoose connect★')
})

app.listen(app.get('port'), function() {
  console.log('SERVER UP : HTTP://localhost:' + app.get('port'))
})
