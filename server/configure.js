// 필요 의존성 정의 - page.96,97,98
var path = require('path'),
    routes = require('./routes'),
    exphbs = require('express-handlebars'), // connect 미들웨어이며, 뷰를 위해 사용할 템플릿 엔진임
    express = require('express'),
    bodyParser = require('body-parser'),
    //cookieParser = require('cookie-parser')
    session = require('express-session'),
    morgan = require('morgan'),
    multer = require('multer'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    moment = require('moment')

module.exports = function(app) {
  app.engine('handlebars', exphbs.create({ // 'handlebars'는 'hbs'로 써도됨
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts',
    partialsDir: [app.get('views') + '/partials'],
    helpers: {
      timeago: function(timestamp) {
        return moment(timestamp).format('LLLL')
      }
    }
  }).engine)
  app.set('view engine', 'handlebars') // 'hbs'로 쓸려면 16줄과 통일해야함.

  app.use(morgan('dev')) // connect 미들웨어이며, 노드서버 디버깅용
  app.use(bodyParser.urlencoded({'extended':true})) // connect 미들웨어이며, 양식데이터 해석용
  //app.use(bodyParser.json())
  //app.use(bodyParser({
  //  uploadDir:path.join(__dirname, 'public/upload/temp')
  //}))
  app.use(multer({dest: path.join(__dirname, 'public/upload/temp')}))
  //var upload = multer({dest: path.join(__dirname, 'public/upload/temp')}).array('file')

  app.use(methodOverride()) // connect 미들웨어이며, 구형브라우저를 위함
  //app.use(cookieParser('some-secret-value-here')) // connect 미들웨어이며, 쿠키를 보내고 받게해줌
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
  routes(app) // 경로들을 routes 폴더로 이동

  app.use('/public/', express.static(path.join(__dirname, '../public')))

  if ('development' === app.get('env')) {
    app.use(errorHandler()) // connect 미들웨어이며, 어떤에러든 처리할 수 있게해줌
  }

  return app
  return routes(app)
}
