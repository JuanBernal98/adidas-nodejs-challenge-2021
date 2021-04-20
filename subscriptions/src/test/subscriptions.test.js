const app = require('../server.js');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
chai.should();

var subscriptionCreatedID;

describe('Subscriptions', () => {

    // Test creating a new subscription
    describe("POST /api/subscription", () => {

        // Required fileds
        it("Newsletter should be a required field", (done) => {
            chai.request(app)
                .post('/api/subscription')
                .send({
                    "email": "test@adidas.com",
                    "birth": "2017-03-07T00:00:00.000Z",
                    "consent": true,
                    "name": "name",
                    "gender": "m",
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.contain('required');
                    done();
                });
        });

        // Required field
        it("Email should be a required field", (done) => {
            chai.request(app)
                .post('/api/subscription')
                .send({
                    "newsletter": 13,
                    "birth": "2017-03-07T00:00:00.000Z",
                    "consent": true,
                    "name": "name",
                    "gender": "m",
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.contain('required');
                    done();
                });
        });

        // Required field
        it("Date of birth should be a required field", (done) => {
            chai.request(app)
                .post('/api/subscription')
                .send({
                    "newsletter": 13,
                    "email": "test@adidas.com",
                    "consent": true,
                    "name": "name",
                    "gender": "m",
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.contain('required');
                    done();
                });
        });

        // Required field
        it("Consent should be a required field", (done) => {
            chai.request(app)
                .post('/api/subscription')
                .send({
                    "newsletter": 13,
                    "email": "test@adidas.com",
                    "birth": "2017-03-07T00:00:00.000Z",
                    "name": "name",
                    "gender": "m",
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.contain('required');
                    done();
                });
        });

        // Invalid field
        it("Fields should have a valid format", (done) => {
            chai.request(app)
                .post('/api/subscription')
                .send({
                    "newsletter": "string", // not int
                    "email": "testadidas.com", // wrong email
                    "birth": "whatisthisdate", // not date
                    "name": "name",
                    "gender": "adidas gazelle", // not a gender?
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        // Trying to create a subscription
        it("Should return the ID of the created subscription without optional fields [name, gender]", (done) => {
            chai.request(app)
                .post('/api/subscription')
                .send({
                    "newsletter": 13,
                    "email": "test@adidas.com",
                    "birth": "2017-03-07T00:00:00.000Z",
                    "consent": true,
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.a('string');
                    subscriptionCreatedID = res.text;
                    done();
                });
        });

        // Trying to recreate newsletter conflict
        it("Should return conflict when trying to duplicate newsletter/email both as PK", (done) => {
            chai.request(app)
                .post('/api/subscription')
                .send({
                    "newsletter": 13,
                    "email": "test@adidas.com",
                    "birth": "2017-03-07T00:00:00.000Z",
                    "consent": true,
                    "gender": "m",
                })
                .end((err, res) => {
                    res.should.have.status(409);
                    done();
                });
        });

    });

    // Test getting all subscriptions
    describe("GET /api/subscriptions", () => {
        it("Should get all susbscriptions", (done) => {
            chai.request(app)
                .get('/api/subscriptions')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    // Test getting subscription detail
    describe("GET /api/subscription/:id", () => {
        // GET 200
        it("Should get one susbscription", (done) => {
            chai.request(app)
                .get(`/api/subscription/${subscriptionCreatedID}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        // GET 404
        it("Should not get one susbscription", (done) => {
            chai.request(app)
                .get(`/api/subscription/trytogetme`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    describe("DELETE /api/subscription/:id", () => {
        // DELETE 200
        it("Should delete one subscription", (done) => {
            chai.request(app)
                .delete(`/api/subscription/${subscriptionCreatedID}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        // DELETE 404
        it("Should return 404 when trying to delete", (done) => {
            chai.request(app)
                .delete(`/api/subscription/trytodeleteme`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});