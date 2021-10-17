const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/User');

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (user){
        return res.status(400).json({email: 'Email already exists!'});
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
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

module.exports = router;