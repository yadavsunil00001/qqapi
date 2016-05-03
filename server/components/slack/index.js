
var request = require('request');
import config from '../../config/environment';

export default function(text){
  var options = {
    uri:  config.URLS.SLACK,
    form: JSON.stringify({ text: text || "Black Message" })
  };
  request.post(options, function(error, response, body){
    if (!error ) {

    } else {
      console.log('Error: Slack Notification ', response , body);
    }
  });
}

