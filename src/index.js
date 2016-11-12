"use strict"

var APP_ID = undefined;

var request = require("request");

var AlexaSkill = require('./AlexaSkill');

// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
var SpaceAgency = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SpaceAgency.prototype = Object.create(AlexaSkill.prototype);
SpaceAgency.prototype.constructor = SpaceAgency;

SpaceAgency.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("SpaceAgency onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SpaceAgency.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SpaceAgency onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    response.ask("Welcome to the space agency!", "You can say: how many people are in space");
};

SpaceAgency.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("SpaceAgency onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SpaceAgency.prototype.intentHandlers = {
    // register custom intent handlers
   "SpaceCountIntent": function (intent, session, response) {
        var ops = {
         json: true,
         uri: "http://api.open-notify.org/astros.json"
        };

        request.get(ops, (err, res, body) => {
           var speechOutput = "There's currently " + body.number + " people in space";
           response.tellWithCard(speechOutput, "People in space", speechOutput);
        });
   },
   "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask me who's in space!", "You can ask me who's in space!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceAgency skill.
    var helloWorld = new SpaceAgency();
    helloWorld.execute(event, context);
};

