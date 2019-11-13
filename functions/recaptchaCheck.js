// jshint esversion: 6
const express = require('express');
const serverless = require('serverless-http');
const request = require('request');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const env = dotenv.config().parsed;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const secretKey = process.env["RECAPTCHA_SECRET_KEY"];
console.log("HIT secret key");

app.post("/", (req,res)=>{
    console.log("HIT /form");
    if(
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ){
        return res.json({'sucess': false, 'msg': 'please select recaptcha'});
    }
    //verify url
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;

    request(verifyURL, (err, response, body) => {
        // if not sucessful
        if(body.sucess !== undefined && !body.sucess){
            return res.json({'sucess': false, 'msg': 'please select recaptcha'});
        }
        return res.json({'sucess': true, 'msg': 'captcha passed'});
    });


});
// function updateDatabase(data) {
//   ... // update the database
//   return newValue;
// }

// app.use(bodyParser);
// app.post('/updatestate', (res, req) => {
//   const newValue = updateDatabase(res.body);
//   req.json(newValue);
// });

module.exports.handler = serverless(app);

