// Libraries
var express = require('express')
var nunjucks = require('nunjucks')
var bodyParser = require('body-parser')
var multer = require('multer')
var apiRoutes = require('./api-routes')

// Setup
var port = process.env.PORT || 8080
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

// Routes
app.use('/api/v1', apiRoutes)

app.get('/', function(req, res) {
  // Example template view usage
  res.render('home.html', {
    test: 'Hello From Node!'
  })
})



app.post('/photos', upload.single('photo'), function(req, res, next) {
  // Example photo upload usage
  res.send('<img src="uploads/' + req.file.originalname + '" />"')
})

// Public
app.use(express.static('public'))

// Start
app.listen(port)
console.log('Public server: http://localhost:' + port)
console.log('API server: http://localhost:' + port + '/api/v1')
console.log('Press CTRL+C to exit.')
