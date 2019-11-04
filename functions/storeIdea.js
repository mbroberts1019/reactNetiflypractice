// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const env = dotenv.config().parsed;

// Set the region and credentials
AWS.config.update({
  region: process.env["SES_AWS_REGION"],
  credentials: new AWS.Credentials(
    process.env["DDB_AWS_ACCESS_KEY_ID"],
    process.env["DDB_AWS_SECRET_ACCESS_KEY"]
  )
});

//Returns just type and subtype from Content-Type HTTP header value.
function parseContentType(headerValue) {
  return (headerValue || "").split(/;\s+/, 2)[0];
}

// Calls the callback so that it redirects to question form URL.

function redir(callback, code) {
  callback(null, {
    statusCode: 200,
    headers: {
      Location: process.env["IDEA_FORM_URL"]
    },
    body: code
  });
}

//Parses and validates event triggered by question form submission.
function sendToDB(event, context, callback) {
  if (event["httpMethod"] !== "POST") {
    return callback(
      new Error(`Unexpected HTTP method "${event["httpMethod"]}"`)
    );
  }
  if (
    parseContentType(event["headers"]["content-type"]) !==
    "application/x-www-form-urlencoded"
  ) {
    return callback(
      new Error(`Unexpected content type "${event["headers"]["content-type"]}"`)
    );
  }
  if (event["httpMethod"] === "OPTIONS") {
    return callback(null, {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '2592000',
        'Access-Control-Allow-Credentials': 'true',
      },
      
    }
      
    );
  }

  const params = JSON.parse(event["body"]);

  //    ******leaving this in until honeypot is setup******
  //   if (process.env["QUESTION_FORM_HONEYPOT"] &&
  //       params[process.env["QUESTION_FORM_HONEYPOT"]]) {
  //     console.info("Bot trapped in honeypot")
  //     return callback()
  //   }

  const errs = [];

  if (!params["name"]) errs.push("no-name");
  if (!params["email"]) errs.push("no-email");
  if (!params["idea"]) errs.push("no-idea");
  if (errs.length > 0) return redir(callback, errs.join(","));
  let email = params["email"];
  let name = params["name"];
  let idea = params["idea"];
  let generatedId = createNewId();

  putNewItem(name, email, generatedId, idea, callback);
}

// Create the DynamoDB service object
function putNewItem(name, email, itemId, idea) {
  var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

  var params2 = {
    TableName: "IdeaPracticeTable",
    Item: {
      IdeaId: { S: itemId },
      Contributer_Name: { S: name },
      Contributor_Email: { S: email },
      Idea: { S: idea }
    }
  };

  // Call DynamoDB to add the item to the table
  ddb.putItem(params2, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}

// generate id by appending random 2 digit number with date/time stamp
function createNewId() {
  let randNum = Math.floor(Math.random() * 100);
  return "" + randNum + getTime() + "";
}

function getTime() {
  let now = new Date().getTime();
  return now;
}

exports.handler = sendToDB;
