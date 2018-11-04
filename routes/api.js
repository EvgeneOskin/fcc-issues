/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  let db;
  MongoClient.connect(CONNECTION_STRING, function(err, _db) {
    if (err) {
      console.error(err) 
      return
    }
    db = _db.db("issues")
  })

  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;


    })

    .post((req, res) => {
      console.log(req.body)

      const { project } = req.params;
      const { 
        issue_title, issue_text, created_by, 
        assigned_to = '', status_text = '',
      } = req.body;
      if (![issue_title, issue_text, created_by].every(i => i)) {
        res.status(400)
          .type('text')
          .send('missing inputs');
        return
      }
      const data = { 
        created_on: new Date(),
        issue_title, issue_text, created_by, assigned_to, status_text,
        open: true,
      }
      db.collection('issues').insertOne(
        data, (err, issue) => {
          if (err) {
            res.status(400)
              .type('text')
              .send('fail');
          } else {
            const { insertedId: _id } = issue
            db.collection('issues').findOne({ _id: new ObjectID(_id) }, (err, obj) => {
              if (err) {
                res.status(400)
                  .type('text')
                  .send('fail');
              } else {
                res.json(obj)
              }
             })
          }
        }
      )
    })

    .put(function (req, res){
      var project = req.params.project;

    })

    .delete(function (req, res){
      var project = req.params.project;

    });
};
