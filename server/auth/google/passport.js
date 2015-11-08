var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User, config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'guest',
            username: profile.username,
            provider: 'google',
            google: profile._json
          });
          if (process.env.SUPER_USER_EMAIL === user.email) {
            user.role = 'super';
          }
          user.save(function(err) {
            if (err) return done(err);
            done(err, user);
          });
        } else {
          if (user.google.image.url != profile._json.image.url) {
            user.google.image.url = profile._json.image.url;
            user.save(function(err) {
              if (err) return done(err);
              done(err, user);
            });
          } else {
            return done(err, user);
          }
        }
      });
    }
  ));
};
