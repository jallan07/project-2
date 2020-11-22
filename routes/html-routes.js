const passport = require('passport');
const express = require('express');
const router = express.Router();

// get the index page
router.get('/', function (req, res) {
  res.render('index.handlebars'); // load the index file
});

// get the profile for logged in users
router.get('/profile', isLoggedIn, function (req, res) {
  res.render('pages/profile.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

// get linkedin authentication
router.get(
  '/auth/linkedin',
  passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_liteprofile']
  })
);

// get linkedin authentication callback
router.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  })
);
// logout the user and send them back to the main index page
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// check whether or not the user is logged in
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// export the file for use in other folders
module.exports = router;
