const request = require('supertest');
const app = require('../server.js');

var subscription_created_id = null;

describe('Subscriptions Tests:', function () {
    describe('Creating a new subscription', function () {
        it('It should return the ID', function () {
            request(app)
                .post('/api/subscription')
                .send({
                    'newsletter': 1,
                    'email': 'bernalsierrajuan@gmail.com',
                    'name': 'Juan',
                    'gender': 'm',
                    'birth': new Date(),
                    'consent': true,
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    subscription_created_id = res;
                });
        });
        it('Should return confilct', function () {
            request(app)
                .post('/api/subscription')
                .send({
                    'newsletter': 1, // wrong newsletter
                    'email': 'bernalsierrajuan@gmail.com',
                    'name': 'Juan',
                    'gender': 'o',
                    'birth': new Date(),
                    'consent': true,
                })
                .expect(409)
        });
        it('Should return newsletter validation error', function () {
            request(app)
                .post('/api/subscription')
                .send({
                    'newsletter': 'qwe', // wrong newsletter
                    'email': 'bernalsierra@juangmail.com',
                    'name': 'Juan',
                    'gender': 'm',
                    'birth': new Date(),
                    'consent': true,
                })
                .expect(400)
        });
        it('Should return email validation error', function () {
            request(app)
                .post('/api/subscription')
                .send({
                    'newsletter': 23,
                    'email': 'bernalsierrajuangmail.com',
                    'name': 'Juan',
                    'gender': 'm',
                    'birth': new Date(),
                    'consent': true,
                })
                .expect(400)
        });
    });

    describe('Getting all subscriptions', function () {
        it('It should return 200', function () {
            request(app)
                .get('/api/subscriptions')
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                });
        });
    });

    describe('Delete one subscription', function () {
        it('It should return 200', function () {
            request(app)
                .delete('/api/subscription')
                .send({
                    id: subscription_created_id
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                });
        });
    });
});