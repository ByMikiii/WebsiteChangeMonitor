const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

//Express configuration
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 4000;
var oldBody;
var i = 1;

const urlToCheck = ``;
const checkingFrequency = 60000 * 0.3; //minutes

//SLACK
const SLACK_WEBHOOK_URL = '';
const slack = require('slack-notify')(SLACK_WEBHOOK_URL);

function funkcia(){
    request(urlToCheck, function (err, response, body) {
        var bodyString = String(body);
        var oldBodyString = String(oldBody);
        var bodyLength = bodyString.length;
        var oldBodyLength = oldBodyString.length;

        console.log('Body Length: ' + bodyLength);
        console.log('oldBody Length: ' + oldBodyLength);
        if (err) {
            console.log(`Request Error - ${err}`);
        }
        else {
            if (!body) {
                console.log(`Request Body Error - ${err}`);
            }
            else {
                if (bodyLength != oldBodyLength && i != 1) {
                    
                    for (var j = 0; j < 10; j++) {
                        slack.alert(`🔥🔥🔥  <${urlToCheck}/|Change detected in ${urlToCheck}>  🔥🔥🔥 `, function (err) {
                            if (err) {
                                console.log('Slack API error:', err);
                            } else {
                                console.log('Message received in slack!');
                            }
                        });
                    }
                } else {
                    console.log("Ziadna zmena!");
                }
            }
        }
        oldBody = body;
        i = 2;
        setTimeout(funkcia, checkingFrequency);
    })
};


//Page render
app.get('/', function (req, res) {
    res.render('index', null);
});

//On Start
app.listen(PORT, function () {
    console.log(`App started, listening on port ${PORT}!`);
    slack.alert(` <${urlToCheck}/|App started monitoring ${urlToCheck}> `, function (err) {
        if (err) {
            console.log('Slack API error:', err);
        } else {
            console.log('Message received in slack!');
        }
    });
    funkcia();
});




