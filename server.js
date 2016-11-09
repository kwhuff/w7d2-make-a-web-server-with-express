// Libraries
var express = require('express')//express is a sever
var nunjucks = require('nunjucks')
var bodyParser = require('body-parser')//think 'BODY' property on fetch pushes
var multer = require('multer')//multer handles files being pushed, like the profile picture from Chirp
var moreRoutes = require('./more-routes')//you'll need this for homework

//Setup
var port = process.env.PORT || 8080
var app = express()
// var upload = multer({ dest: 'public/uploads/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

app.use(bodyParser.json())//more middleware.
app.use(bodyParser.urlencoded({ extended: true }))

nunjucks.configure('views', {//folder name
  autoescape: true,//so user cannot hack us....?
  express: app
})

//Routes
app.use('/api/v1', moreRoutes)

app.post('/photos', upload.single('photo'), (req, res) => {
  res.render('photo.html',{
    photo: req.file.originalname,
    caption: req.body.caption
  })
})

app.get('/', (req, res) => {//req/res means request/response
  // console.log(request.baseUrl)
  if(req.query.api_token === '12345' && req.query.username === 'kyle'){
    res.render('loggedin.html', {
      username: req.query.username,
      queryStuff: req.query,
      users: ['kyle', 'katie', 'stanley']
    })
  }
  else{
    res.render('loggedout.html')
  }
  // res.send(req.query.test)//this message now now overrides index.html.  we're telling it what it should say when the file ends in '/'.  This loads ahead of express.static('public') because it is listed above it in our server.js file.
})

app.get('/api/users', (req,res) => {
  var users = [
    {
      id: 1,
      name: 'Joe'
    },
    {
      id: 2,
      name: 'Sue'
    }
  ]
  res.json(users)
})
//.send responds with plain old text.
app.use(express.static('public'))//'Node middleware'.  static lets you specify a folder that has static files in it, like normal HTML files.  **index.html is always the standard home landing .html page in a folder**

//Listen
app.listen(port)//telling which port you want express to listen to, as defined by variable above
console.log('public server https://localhost:' + port)
console.log('Press Ctrl+C to Exit')
