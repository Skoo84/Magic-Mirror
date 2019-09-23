/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome, this is Your magic mirror. How can I help?';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const GetEveryWarehouseTemperature = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetEveryWarehouseTemperature';
  },
  async handle(handlerInput) {
    let outputSpeech = 'I could not get every warehouse temperature.';

    await getRemoteData('http://*******.****.eu-central-1.elasticbeanstalk.com/temperature/everylatestvalue.php')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.latest.length} sensors installed at the factory. `
        for (let i = 0; i < data.latest.length; i++) {
          if (i === 0) {
            //first record
            outputSpeech = outputSpeech + 'Their readings are: ' + data.latest[i].sensor + ' temperature is ' + data.latest[i].temp + ' celsius ' + ' with a humidity of ' + data.latest[i].hum + '%, '
          } else if (i === data.latest.length - 1) {
            //last record
            outputSpeech = outputSpeech + ' and ' + data.latest[i].sensor + ' temperature is ' + data.latest[i].temp + ' celsius ' + ' with a humidity of ' + data.latest[i].hum + '%' + '.'
          } else {
            //middle record(s)
            outputSpeech = outputSpeech + data.latest[i].sensor + ' temperature is ' + data.latest[i].temp + ' celsius ' + ' with a humidity of ' + data.latest[i].hum + '%' + ', '
          }
        }
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
      

  },
};

const GetSpecificWarehouseAverage = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetSpecificWarehouseAverage';
  },
  async handle(handlerInput) {
    let outputSpeech = 'Get average data for given warehouse';

    let userAskedForItSpecific = handlerInput.requestEnvelope.request.intent.slots.warehouse.value


    //hardcoding the finished goods location because the sensor is unreachable and we can't modify the code there
    if (userAskedForItSpecific === 'finished goods') {
      locationSpecific = "finished_goods";
    } else {
      locationSpecific = userAskedForItSpecific;
    }
    let userAskedForTimeframeSpecific = handlerInput.requestEnvelope.request.intent.slots.timeframe.value


    // the sensors are making a measurement / 5 minutes, so we convert the minutes to measurements
    if (userAskedForTimeframeSpecific === ('last week' || 'this week')) {
      timeframeSpecific = '2016'
    } else if (userAskedForTimeframeSpecific === ('last month' || 'this month')) {
      timeframeSpecific = '8640'
    } else if (userAskedForTimeframeSpecific === ('last year' || 'this year')) {
      timeframeSpecific = '15120'
    } else if (userAskedForTimeframeSpecific === ('today' || 'last 24 hours')) {
      timeframeSpecific = '288'
    } else {
      timeframeSpecific = '288'
      userAskedForTimeframeSpecific = 'the last 24 hours'
    }

    let apiAverageRequestSpecific = 'http://*****.******.eu-central-1.elasticbeanstalk.com/temperature/specificaverage.php?loc='
    await getRemoteData(apiAverageRequestSpecific + locationSpecific + '&timeframe=' + timeframeSpecific)
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `The average temperatures for ${userAskedForTimeframeSpecific} at ${locationSpecific} are  ${data.warehouse[0].average} celsius, the lowest temperature is ${data.warehouse[0].lowest} celsius, while the highest is ${data.warehouse[0].highest} Celsius. `;

      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();


  },
};


const GetEveryWarehouseAverage = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetEveryWarehouseAverage';
  },
  async handle(handlerInput) {
    let outputSpeech = 'I could not get the average data for all warehouses.';

    let userAskedForTimeframe = handlerInput.requestEnvelope.request.intent.slots.timeframe.value


    // the sensors are making a measurement / 5 minutes, so we convert the minutes to measurements
    if (userAskedForTimeframe === ('last week' || 'this week')) {
      timeframe = '2016'
    } else if (userAskedForTimeframe === ('last month' || 'this month')) {
      timeframe = '8640'
    } else if (userAskedForTimeframe === ('last year' || 'this year')) {
      timeframe = '15120'
    } else if (userAskedForTimeframe === ('today' || 'last 24 hours')) {
      timeframe = '288'
    } else {
      timeframe = '288'
      userAskedForTimeframe = 'last 24 hours'
    }

    let apiAverageRequest = 'http://******.*******.eu-central-1.elasticbeanstalk.com/temperature/everyaveragevalue.php?timeframe='
    await getRemoteData(apiAverageRequest + timeframe)
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.latest.length} sensors installed at the factory. `
        for (let i = 0; i < data.latest.length; i++) {
          if (i === 0) {
            //first record
            outputSpeech = outputSpeech + 'Their readings are: ' + data.latest[i].sensor + ' average temperature for ' + userAskedForTimeframe + ' is ' + data.latest[i].average + ' celsius ' + ' with the lowest value of ' + data.latest[i].lowest + ' degrees, with the highest value of ' + data.latest[i].highest + ' degrees, '
          } else if (i === data.latest.length - 1) {
            //last record
            outputSpeech = outputSpeech + ' and ' + data.latest[i].sensor + ' average temperature for ' + userAskedForTimeframe + ' is ' + data.latest[i].average + ' celsius ' + ' with the lowest value of ' + data.latest[i].lowest + ' degrees, with the highest value of ' + data.latest[i].highest + ' degrees.'
          } else {
            //middle record(s)
            outputSpeech = outputSpeech + data.latest[i].sensor + ' average temperature for ' + userAskedForTimeframe + ' is ' + data.latest[i].average + ' celsius ' + ' with the lowest value of ' + data.latest[i].lowest + ' degrees, with the highest value of ' + data.latest[i].highest + ' degrees, '
          }
        }
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};




const GetEveryWarehouseName = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetEveryWarehouseName';
  },
  async handle(handlerInput) {
    let outputSpeech = 'I could not get the name of the warehouses.';

    await getRemoteData('http://********.*********.eu-central-1.elasticbeanstalk.com/temperature/avaiablewarehouses.php')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.latest.length} sensors installed at the factory. `
        for (let i = 0; i < data.latest.length; i++) {
          if (i === 0) {
            //first record
            outputSpeech = outputSpeech + 'Their names are: ' + data.latest[i].Tables_in_nodemcuweather
          } else if (i === data.latest.length - 1) {
            //last record
            outputSpeech = outputSpeech + ' and ' + data.latest[i].Tables_in_nodemcuweather + '.'
          } else {
            //middle record(s)
            outputSpeech = outputSpeech + ', ' + data.latest[i].Tables_in_nodemcuweather
          }
        }
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};

const GetEveryEmployeeName = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetEveryEmployeeName';
  },
  async handle(handlerInput) {
    let outputSpeech = 'I could not get the name of the employees.';

    await getRemoteData('http://*******.******.eu-central-1.elasticbeanstalk.com/everyone.php')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are ${data.location.length} employees registered in the system. `
        for (let i = 0; i < data.location.length; i++) {
          if (i === 0) {
            //first record
            outputSpeech = outputSpeech + 'Their names are: ' + data.location[i].username
          } else if (i === data.location.length - 1) {
            //last record
            outputSpeech = outputSpeech + ' and ' + data.location[i].username + '.'
          } else {
            //middle record(s)
            outputSpeech = outputSpeech + ', ' + data.location[i].username
          }
        }
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};


const GetEmployeeReportForGivenDay = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetEmployeeReportForGivenDay';
  },
  async handle(handlerInput) {
    let outputSpeech = 'There are no records for the provided date';
    let dateAskedByUser = handlerInput.requestEnvelope.request.intent.slots.when.value
    let dailyReport = 'http://**********.********.eu-central-1.elasticbeanstalk.com/dailyuserreport.php?day='

    await getRemoteData(dailyReport + dateAskedByUser)
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `Number of employees with records on ${dateAskedByUser}: ${data.users.length}.`
        for (let i = 0; i < data.users.length; i++) {
          if (i === 0) {
            //first record
            outputSpeech = outputSpeech + ' Here is what I\'ve found: ' + data.users[i].Name + ' ' + data.users[i].UserStat + ', '
          } else if (i === data.users.length - 1) {
            //last record
            outputSpeech = outputSpeech + ' and ' + data.users[i].Name + data.users[i].UserStat + '.'
          } else {
            //middle record(s)
            outputSpeech = data.users[i].Name + data.users[i].UserStat + ','
          }
        }
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};

const GetSpecificEmployeeForGivenDay = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetSpecificEmployeeForGivenDay';
  },
  async handle(handlerInput) {
    let outputSpeech = 'There are no records for the provided date';
    let dateSpecificAskedByUser = handlerInput.requestEnvelope.request.intent.slots.when.value
    let nameSpecificAskedByUser = handlerInput.requestEnvelope.request.intent.slots.name.value


    let dailySpecificReport = 'http://*******.******.eu-central-1.elasticbeanstalk.com/specificUserReport.php?day='

    await getRemoteData(dailySpecificReport + dateSpecificAskedByUser + '&name=' + nameSpecificAskedByUser)
      .then((response) => {
        const data = JSON.parse(response);
        let WorkedHours = data.users[0].WorkedToday;


        // tribute to Jacob Grimm
        if (nameSpecificAskedByUser === "snow white" && WorkedHours != null) {
          var a = WorkedHours.split(':'); // split it at the columns
          var hours = (+a[0]);
          var minutes = (+a[1]);
          outputSpeech = `My Queen, you are the fairest here so true. But Snow White is a thousand times more beautiful than you. ${nameSpecificAskedByUser} on ${dateSpecificAskedByUser} ${data.users[0].UserStat}. She worked ${hours} hours and ${minutes} minutes. `


        } else if (nameSpecificAskedByUser === "snow white") {
          outputSpeech = `My Queen, you are the fairest here so true. But Snow White is a thousand times more beautiful than you. ${nameSpecificAskedByUser} on ${dateSpecificAskedByUser} ${data.users[0].UserStat}`

        } else if (WorkedHours != null) {
          var a = WorkedHours.split(':'); // split it at the columns
          var hours = (+a[0]);
          var minutes = (+a[1]);
          outputSpeech = `${nameSpecificAskedByUser} worked ${hours} hours and ${minutes} minutes on ${dateSpecificAskedByUser} and ${data.users[0].UserStat}. `

        } else {
          outputSpeech = `${nameSpecificAskedByUser} on ${dateSpecificAskedByUser} ${data.users[0].UserStat}. `
        }
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};


const GetSpecificRealtimeSituation = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetSpecificRealtimeSituation';
  },
  async handle(handlerInput) {
    let outputSpeech = 'We do not have sensor at this location';

    let userAskedForIt = handlerInput.requestEnvelope.request.intent.slots.warehouse.value


    //hardcoding the finished goods location because the sensor is unreachable and we can't modify the code there
    if (userAskedForIt === 'finished goods') {
      location = "finished_goods";
    } else {
      location = userAskedForIt;
    }

    let apiRealtime = 'http://*********.********.eu-central-1.elasticbeanstalk.com/temperature/latestvalue.php?loc='
    await getRemoteData(apiRealtime + location)
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.warehouse[0].temp} celsius at the ${location} location with a humidity of ${data.warehouse[0].hum}%. `;

      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetEveryWarehouseName,
    GetSpecificRealtimeSituation,
    GetEveryWarehouseAverage,
    GetSpecificWarehouseAverage,
    GetEmployeeReportForGivenDay,
    LaunchRequestHandler,
    GetSpecificEmployeeForGivenDay,
    GetEveryEmployeeName,
    GetEveryWarehouseTemperature,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,

  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

