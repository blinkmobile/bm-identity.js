'use strict';

const inquirer = require('inquirer');
const blinkmrc = require('@blinkmobile/blinkmrc');

const constants = require('../constants.js').loginProviders;

function getLoginPreference (userConfigStoreName) {
  const userConfigStore = blinkmrc.userConfig({ name: userConfigStoreName });
  return userConfigStore.load().then(config => {
    if (config.loginPreference) {
      return config.loginPreference;
    }

    // prompt for user preference.
    const promptQuestions = [{
      type: 'list',
      name: 'loginPreference',
      message: 'Please select a login preference: ',
      choices: [
        {
          name: 'Username and Password',
          value: constants.USERNAME
        },
        {
          name: 'Passwordless with Email',
          value: constants.EMAIL
        },
        {
          name: 'Passwordless with SMS',
          value: constants.SMS
        },
        {
          name: 'Social account login e.g. Google or GitHub',
          value: constants.SOCIAL
        }
      ]
    }];
    return inquirer.prompt(promptQuestions).then(results => {
      config.loginPreference = results.loginPreference;
      return userConfigStore.write(config)
        .then(() => results.loginPreference);
    });
  });
}

module.exports = {
  getLoginPreference: getLoginPreference
};
