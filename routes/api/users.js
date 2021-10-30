const express = require('express');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const User = require('../../models/User');
const Keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  //Validate
  const output = validateRegisterInput(req.body)
  if (!output.isValid){
    return res.status(400).json(output.errors);
  }
  
  User.findOne({email: req.body.email})
    .then(user => {
      if (user){
        return res.status(400).json({email: 'Email already exists!'});
      } else {

        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar
        });

        //encrypt password
        bcrypt.genSalt(10, (err, salt)=> {
          if(err) throw err;
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })

      }
    })
    .catch(err => console.log(err));
});


// @route   POST /api/users/login
// @desc    Login a user
// @access  Public
router.post('/login', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      //Check if user exists
      if (!user){
        return res.status(400).json({email: 'User not found!'});
      }

      //Check the password
      bcrypt.compare(req.body.password, user.password)
        .then(isMatch => {
          if (!isMatch){
            return res.status(400).json({password: 'Password incorrect'});
          } else {
            //Generate token
            const payload = {
              id: user.id, 
              name: user.name, 
              avatar: user.avatar
            };

            jwt.sign(
              payload, 
              Keys.secretOrKey, 
              {expiresIn: 3600}, 
              (err, token) => {
                return res.json({token: 'Bearer ' + token})
              });
          }
        })
    })
    
})


// @route   GET /api/users/current
// @desc    Return current user info
// @access  Private
router.get(
  '/current', 
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    res.json(req.user);
});

module.exports = router;