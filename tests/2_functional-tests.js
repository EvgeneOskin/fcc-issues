/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let id = null
    const fields = ['_id','issue_title','issue_text','created_by','assigned_to','created_on','updated_on','open','status_text']
    
    
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       const payload = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        }
       chai.request(server)
        .post('/api/issues/test')
        .send(payload)
        .end(function(err, res){
          assert.equal(res.status, 200);
          const { body: data } = res
          assert.isDefined(data);
         
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');

         assert.equal(data.issue_title, payload.issue_title);
          assert.equal(data.issue_text, payload.issue_text);
          assert.equal(data.created_by, payload.created_by);
          assert.equal(data.assigned_to, payload.assigned_to);
          assert.equal(data.status_text, payload.status_text);
          assert.isBoolean(data.open);
          assert.equal(data.open, true);
         
          id = data._id
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        const payload = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        }
       chai.request(server)
        .post('/api/issues/test')
        .send(payload)
        .end(function(err, res){
          assert.equal(res.status, 200);
          const { body: data } = res
          assert.isDefined(data);
          fields.forEach(function(ele){
            assert.property(data, ele);
          });
          assert.equal(data.issue_title, payload.issue_title);
          assert.equal(data.issue_text, payload.issue_text);
          assert.equal(data.created_by, payload.created_by);
          assert.equal(data.assigned_to, '');
          assert.equal(data.status_text, '');
          assert.isBoolean(data.open);
          assert.equal(data.open, true);
         
          done();
        }); 
      });
      
      test('Missing required fields', function(done) {
        const payload = {
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        }
       chai.request(server)
        .post('/api/issues/test')
        .send(payload)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing inputs')
          
          done();
        }); 
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isDefined(res.text);
          assert.equal(res.text, 'missing inputs');
          done();
        }); 
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({ _id: id, issue_text: 'ping' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          const { text: data } = res
          assert.isDefined(data);
          assert.equal(data, 'successfully updated');
          done();
        }); 
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({ _id: id, issue_text: 'ping', issue_title: 'super issue' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          const { text: data } = res
          assert.isDefined(data);
          assert.equal(data, 'successfully updated');
          done();
        }); 
        
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({_id: id})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({_id: id, open: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isDefined(res.text);
          assert.equal(res.text, 'missing inputs');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: id })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isDefined(res.text);
          assert.equal(res.text, `deleted ${id}`);
          done();
        });

      });
      
    });

});
