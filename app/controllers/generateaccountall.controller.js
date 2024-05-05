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
exports.generateaccountone = async (req, res) => {
  // return res.status(200).send({
  //   status: '1',
  //   message: req.body,
  // });

  try {

    const users = await User.findOne({
      where: {
        id: req.body.userId,
      },
    });
    var options =  {
      'method': 'POST',
      'url': process.env.VIRTUAL_URL,
      'headers': {
        apikey: process.env.Authorize_Key
      },
      formData:{
        "firstname": users.username,
        "lastname": users.name,
        "address": "Lagos Nigeria",
        "gender": "Male",
        "email": users.email,
        "phone": "07040237649",
        "dob": "1995-01-03",
        "provider": "safehaven"
      }
    };

``
    request(options, function (error, response) {
      if (error) throw new Error(error);
      const data = JSON.parse(response.body);
      console.log(data.success);
        console.log(data);
        const objectToUpdate = {
          account_number: data.data.data.account_number,
          account_name: data.data.data.account_name,
          bank1: data.data.data.provider,
          bank: data.data.data.provider,
        };
        console.log(objectToUpdate);
        User.findAll({ where: { username: users.username}}).then((result) => {
          if(result){
            result[0].set(objectToUpdate);
            result[0].save();
          }
        })

        return  res.status(200).send({
          status: "1",
          user:users.username,
          message:"Account Generated Successful",
          server_res:data
        });

      // res.status(200).send(response.body);

    });
  } catch (error) {
    console.error(error);
    return res.status(200).send({
      status: '0',
      body:req.body.username,
      message: error.message,
    });
  }

};
