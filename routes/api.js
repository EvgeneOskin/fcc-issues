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

  MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if (err) {
      return
    }
    app.route('/api/issues/:project')
      .get(function (req, res){
        var project = req.params.project;

      
      })

      .post((req, res) => {
        var project = req.params.project;
        const { 
          issue_title, issue_text, created_by, assigned_to, status_text
        } = req.body;
        if ([issue_title, issue_text, created_by].every()) {
          res.status(400)
            .type('text')
            .send('fail');
          return
        }
        const data = { issue_title, issue_text, created_by, assigned_to, status_text }
        db.collection('users').insertOne(
          data, (err, issue) => {
            if (err) {
              
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
    });
};
