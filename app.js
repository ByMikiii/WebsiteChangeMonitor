const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

//Express configuration
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;
var oldBody;
var appIsRunning = true;
var i = 1;

const urlToCheck = ``;
const checkingFrequency = 0.5 * 60000;

//SLACK
const SLACK_WEBHOOK_URL = '';
const slack = require('slack-notify')(SLACK_WEBHOOK_URL);

function funkcia(){
    request(urlToCheck, function (err, response, body) {
        if (err) {
            console.log(`Request Error - ${err}`);
        }
        else {
            //if the target-page content is empty
            if (!body) {
                console.log(`Request Body Error - ${err}`);
            }
            //if the request is successful
            else {

                //if any elementsToSearchFor exist
                if (body != oldBody && i != 1) {
                    
                    for (var j = 0; j < 50; j++) {
                        slack.alert(`🔥🔥🔥  <${urlToCheck}/|Change detected in ${urlToCheck}>  🔥🔥🔥 `, function (err) {
                            if (err) {
                                console.log('Slack API error:', err);
                            } else {
                                console.log('Message received in slack!');
                            }
                        });

                
                    }
                } else {
                    console.log("nic");
                }

            }
        }
        
        oldBody = body;
        i = 2;
        setTimeout(funkcia, 1000 * 5);
    })
};

//Index page render
app.get('/', function (req, res) {
    res.render('index', null);
});


//Server start
app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
    funkcia();
});




