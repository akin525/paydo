const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const refer = db.refer;
const Role = db.role;
var request = require('request');
const Op = db.Sequelize.Op;
// const pin=require("../controllers/otp.controller");
const otp=db.otp;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  // Save User to Database
  try {

    const user = await User.create({
      name:req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    if (req.body.refer !==null) {
      const reffer = await refer.create({
        username:req.body.username,
        newuserid:req.body.refer,
      });
    }
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });



      const pin= Math.floor(1000 + Math.random() * 9000);

      const insertotp= await otp.create({
        username:req.body.username,
        pin:pin,
      });

      const result = user.setRoles(roles);
      // if (result) res.send({ status: 1, message: "User registered successfully!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      // if (result) res.send({ status: 1, message: "User registered successfully!" });
    }

      return  res.send({ status: 1, message: "User registered successfully!" });

  } catch (error) {
    res.status(500).send({status: 1, message: error.message });
  }
};

exports.signin = async (req, res) => {
  // const { username, password } = req.query;
  // if (!username || !password) {
  //   return res.status(400).json({ status:0, error: 'Both username and password are required' });
  // }
  try {
    if (req.body.username===""){
      return res.status(200).send({
        status: "0",
        message: "Enter your username!"
      });
    }
    if (req.body.password===""){
      return res.status(200).send({
        status: "0",
        message: "Enter your password!"
      });
    }
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(200).send({status: "0", message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!passwordIsValid) {
      return res.status(200).send({
        status: "0",
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    // req.session.token = token;

    return res.status(200).send({
      status:1,
      message:"login successful",
      data:{id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        roles: authorities,
        token: token,
        pin:user.pin
      }

    });
  } catch (error) {
    return res.status(200).send({ message: error.message });
  }
};
exports.delete = async (req, res) => {
  // const { username, password } = req.query;
  // if (!username || !password) {
  //   return res.status(400).json({ status:0, error: 'Both username and password are required' });
  // }
  const userId = req.body.userId;

  try {
    if (req.body.userId===""){
      return res.status(200).send({
        status: "0",
        message: "userId required"
      });
    }

    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({status:0, message: 'User not found' });
    }

    // Delete the user
    await User.destroy({
      where: {
        id: userId,
      },
    });

    res.json({status:1, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(200).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};

