const AWS = require("aws-sdk");
const querystring = require("querystring");
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const ses = new AWS.SES({
  region: process.env["MY_AWS_REGION"],
  credentials: new AWS.Credentials(process.env["MY_AWS_ACCESS_KEY_ID"],
  process.env["MY_AWS_SECRET_ACCESS_KEY"])
});



/** @typedef {function(Error=,Object=)} */
var NetlifyCallback;

/**
 * Returns just type and subtype from Content-Type HTTP header value.
 *
 * @param {string|undefined} headerValue
 * @return {string}
 */
function parseContentType(headerValue) {
  return (headerValue || "").split(/;\s+/, 2)[0];
}

/**
 * Returns name encoded using syntax of encoded-words from MIME.
 *
 * This is a very lazy developer’s approach defaulting to BASE64
 * without trying anything else and shouldn’t be considered
 * production-ready. MIME suggests what to use when, get familiar with
 * or use some nice library.
 *
 * @param {string} name
 * @return {string}
 * @see {@link https://tools.ietf.org/html/rfc2047 RFC 2047}
 */
function mimeEncode(name) {
  return (
    "=?utf-8?b?" +
    Buffer.from(name).toString('base64') +
    "?="
  );
}

/**
 * Calls the callback so that it redirects to question form URL.
 *
 * Optional code can be specified. This code is set as a fragment part
 * of the redirect location.
 *
 * @param {!NetlifyCallback} callback
 * @param {string=} code
 */
function redir(callback, code) {
  callback(null, {
    "statusCode": 200,
    "headers": {
      "Location": process.env["IDEA_FORM_URL"]
    },
    "body": code
  });
}

/**
 * Parses and validates event triggered by question form submission.
 *
 * The function ends with a call to {@link sendEmail}.
 *
 * @param {!Object} event
 * @param {!Object} context
 * @param {!NetlifyCallback} callback
 */
function sendIdea(event, context, callback) {
  console.log("hitSendIdea function");
  console.log(event["headers"]);
  if (event["httpMethod"] !== "POST") {
    return callback(
      new Error(`Unexpected HTTP method "${event["httpMethod"]}"`)
    );
  }
  if (parseContentType(event["headers"]["content-type"]) !==
      "application/x-www-form-urlencoded") {
    return callback(
      new Error(`Unexpected content type "${event["headers"]["content-type"]}"`)
    );
  }

  const params = querystring.parse(event["body"]);

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

  sendEmail(
    params["name"],  
    params["email"],
    params["idea"],
    callback
  );
}

/**
 * Sends email via AWS SES API.
 *
 * @param {string} replyTo
 * @param {string} text
 * @param {!NetlifyCallback} callback
 */
function sendEmail(name, replyTo, text, callback) {
  console.log("Hit Email Function");
  console.log('Email has env?'+ process.env["IDEA_FORM_FROM"] )
  ses.sendEmail({
    Source: process.env["IDEA_FORM_FROM"],
    Destination: {
      ToAddresses: [
	process.env["IDEA_FORM_TO"]
      ]
    },
    ReplyToAddresses: [
      replyTo
    ],
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
  }, (err, data) => {
    if (err) {
      console.error("Error while sending email via AWS SES:", err);
      return redir(callback, "fail");
    }

    redir(callback, "sent");
  });
}

exports.handler = sendIdea;