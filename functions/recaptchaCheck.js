// jshint esversion: 6
const fetch = require("node-fetch");

const dotenv = require("dotenv");
const env = dotenv.config().parsed;

const secretKey = process.env["RECAPTCHA_SECRET_KEY"];

const recaptchaCheck = async (event, context) => {

    const params = JSON.parse(event["body"]);
    let token = params["token"];
    let googleRecaptchaApiURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    console.log("Token => ", token);
    console.log("URl => ", googleRecaptchaApiURL);
    return fetch(googleRecaptchaApiURL, { method: "POST" , headers: { "Accept": "application/json" } })
        .then(response => response.json())
        .then(data => ({
            statusCode: 200,
            body: data
        }))
        .catch(error => ({ statusCode: 422, body: String(error) }));
};

exports.handler = recaptchaCheck;

