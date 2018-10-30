/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const https = require('http');
//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
// if (err) { return console.log(err); }
//   console.log(body.text);

const HOST = 'numbersapi.com';
// var PATH = '';

// https is a default part of Node.JS.  Read the developer doc:  https://nodejs.org/api/https.html

function httpsGet(PATH , callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:

    // Update these options with the details of the web service you would like to call
    var options = {
        host: HOST,
        path: PATH,
        method: 'GET',
    };

    var req = https.request(options, res => {
        
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            var jsonData = JSON.parse(returnData);
            // this will execute whatever function the caller defined,
            // and pass the data we received from the webservice call
            // to it. In your call back you'll need handle the data
            // and make Alexa speak.
            callback(jsonData);  
        });

    });
    req.end();
}
//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit(':tell' , 'Welcome to Numbers tales, tell me a number ?');
    },
    'NumberIntent': function () {
        
        var dat = this.event.request.intent.slots.num.value;
        const PATH = '/' + dat + '?json';
    
        httpsGet(PATH , (prices) => {
            
            this.response.speak(`${prices.text}`);
            this.emit(':responseReady');
        });

       
            
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

