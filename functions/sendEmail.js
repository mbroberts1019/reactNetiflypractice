//jshint esversion: 6

const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const env = dotenv.config().parsed;

const ses = new AWS.SES({
  region: process.env["SES_AWS_REGION"],
  credentials: new AWS.Credentials(
    process.env["SES_AWS_ACCESS_KEY_ID"],
    process.env["SES_AWS_SECRET_ACCESS_KEY"]
  )
});

//Returns just type and subtype from Content-Type HTTP header value.
function parseContentType(headerValue) {
  return (headerValue || "").split(/;\s+/, 2)[0];
}

/**
 * Calls the callback so that it redirects to question form URL.
 *
 * Optional code can be specified. This code is set as a fragment part
 * of the redirect location.
 */
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
function sendIdea(event, context, callback) {
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
  let subject = `Here is a new idea from ${name} at ${email}: ${idea}`;

  callback( sendEmail(name, email, subject, {
    statusCode: 200,
    headers : {
      'Access-Control-Allow-Origin': '*'
    }
  }));
}

//Sends email via AWS SES API.
function sendEmail(name, replyTo, text, callback) {
  ses.sendEmail(
    {
      Source: process.env["IDEA_FORM_FROM"],
      Destination: {
        ToAddresses: [process.env["IDEA_FORM_TO"]]
      },
      ReplyToAddresses: [replyTo],
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: process.env["IDEA_FORM_SUBJECT"]
        },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: text
          }
        }
      }
    },
    (err, data) => {
      if (err) {
        console.error("Error while sending email via AWS SES:", err);
        return redir(callback, "fail");
      }
      redir(callback, "sent");
    }
  );
}

exports.handler = sendIdea;
