const db = require("../models");
const User = db.user;
const safe =db.safelock;
const deposit=db.deposit;
const product=db.data;
const bill= db.bill;
var request = require('request');
const {response} = require("express");
const {where} = require("sequelize");

const axios = require('axios');
// const User = require('./User'); // Make sure to import the User model from the correct path

exports.generateAccountall = async (req, res) => {
  try {
    const processResults = [];
    const td = await User.findAll();

    const user=td[0];
    // await Promise.all(users.map(async (user) => {
      try {
        const options = createApiOptions(user);

        request(options, function (error, response) {
          if (error) {
            console.error(error);
            processResults.push({
              status: '0',
              message: error.message,
            });
            return;
          }

          const data1 = JSON.parse(response.body);
          console.log(data1.success);
          console.log(data1);
          if (data1.success === "true") { // Use boolean comparison instead of a string
            const objectToUpdate = {
              account_number2: data1.data.account_number,
              account_name2: data1.data.account_name,
              bank2: data1.data.provider,
            };

            // Find and update the user using async/await
            User.update(objectToUpdate, {
              where: { username: user.username },
              returning: true, // Return the updated user
            }).then(([updatedUser]) => {
              if (updatedUser) {
                processResults.push({
                  status: '1',
                  message: 'Account Generate Successful',
                  server_res: data1,
                });
              }
            }).catch((updateError) => {
              console.error(updateError);
              processResults.push({
                status: '0',
                message: updateError.message,
              });
            });
          } else {
            processResults.push({
              status: '0',
              message: data1.message,
            });
          }
        });
      } catch (error) {
        console.error(error);
        processResults.push({
          status: '0',
          message: error.message,
        });
      }
    // }));

  } catch (error) {
    console.error(error);
    return res.status(200).send({
      status: '0',
      message: error.message,
    });
  }
};

function createApiOptions(user) {
  var options = {
    method: 'POST',
    url: process.env.VIRTUAL_URL,
    headers: {
      apikey: process.env.Authorize_Key,
    },
    formData: {
      "firstname": user.username,
      "lastname": user.name,
      "address": "Lagos Nigeria",
      "gender": "Male",
      "email": user.email,
      "phone": "07040237649",
      "dob": "1998-01-04",
      "provider": "Safeheaven",
    }
  };
  return options;
}

exports.generateaccountone = async (req, res) => {
  return res.status(200).send({
    status: '1',
    message: req.body,
  });


};
