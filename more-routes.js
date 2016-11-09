var express = require('express')
var router = express.Router()
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./store.sqlite3')

router.get('/users', (req,res) => {

  db.serialize(() => {//serialize: all of these following instructions must run in sequence.  paraellelize runs instructions at the same time.

    db.all('SELECT * FROM users ORDER BY id DESC', (error, rows) =>{
      res.json(rows[0].first_name)
    })
  })
})

module.exports = router
