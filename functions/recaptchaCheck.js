// jshint esversion: 6
const dotenv = require("dotenv");
const env = dotenv.config().parsed;

const secretKey = process.env["RECAPTCHA_SECRET_KEY"];




const recaptchaCheck = async(event, context) => {
    
    const params = JSON.parse(event["body"]);
    let token = params["token"];
    let googleRecaptchaApiURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    
    
    return fetch(googleRecaptchaApiURL, { headers: { "Accept": "application/json" } })
    .then(response => response.json())
    .then(data => ({
      statusCode: 200,
      body: data
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
    
    
    
    
    
    callback(null, {
        statusCode: 200,
        body: `This only took me ${Math.floor(Math.random() * 10)} hours`
        
    });
};

exports.handler = recaptchaCheck;

import fetch from "node-fetch";

const API_ENDPOINT = "https://icanhazdadjoke.com/";

exports.handler = async (event, context) => {
  return fetch(API_ENDPOINT, { headers: { "Accept": "application/json" } })
    .then(response => response.json())
    .then(data => ({
      statusCode: 200,
      body: data.joke
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};