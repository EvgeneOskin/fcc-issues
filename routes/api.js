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
    .get(async (req, res)=>{
      const {project} = req.params;
      const filters = { ...req.query }
      if (filters._id) {
        filters._id = ObjectID(_id)
      try {
        const cursor = await db.collection('issues').find({ project })
        const data = await cursor.toArray()
        console.log(data)
        res.json(data)
      } catch(err) {
        res.status(400)
          .type('text')
          .send('fail');
      } 
    })
    .post(async (req, res) => {

      const { project } = req.params;
      const { 
        issue_title, issue_text, created_by, 
        assigned_to = '', status_text = '',
      } = req.body;
      if (![issue_title, issue_text, created_by].every(i => i)) {
        res
          .type('text')
          .send('missing inputs');
        return
      }
      const data = { 
        created_on: new Date(),
        updated_on: new Date(),
        issue_title, issue_text, created_by, assigned_to, status_text,
        open: true,
        project,
      }
      try {
        const issue = await db.collection('issues').insertOne(data)
        const { insertedId: _id } = issue
        const obj = await db.collection('issues').findOne({ _id: new ObjectID(_id) })
        res.json(obj)
      } catch (err) {
        res.status(400)
          .type('text')
          .send('fail');
      }
    })

    .put(async (req, res) => {
      const { project } = req.params;
      const { _id, ...data } = req.body;
      if (!_id) {
        res
          .type('text')
          .send('missing inputs');
        return
      }
      data.updated_on = new Date()
      try {
        await db.collection('issues').findOneAndUpdate(
          { 
            _id: ObjectID(_id) 
          },
          { $set: data },
        )
        res
          .type('text')
          .send('successfully updated')
      } catch (err) {
        console.log(err)
        res.status(400)
          .type('text')
          .send('fail');
      }
    })

    .delete(function (req, res){
      var project = req.params.project;

    });
};
