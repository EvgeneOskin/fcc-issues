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
const ObjectId = require('mongodb').ObjectID;

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
        issue_title, issue_text, created_by, assigned_to, status_text
      } = req.body;
      if (![issue_title, issue_text, created_by].every(i => i)) {
        res.status(400)
          .type('text')
          .send('fail');
        return
      }
      const data = { issue_title, issue_text, created_by, assigned_to, status_text }
      db.collection('users').insertOne(
        data, (err, issue) => {
          if (err) {
            res.status(400)
              .type('text')
              .send('fail');
          } else {
            res.json(issue)
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
