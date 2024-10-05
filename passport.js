require('dotenv').config({ path: 'C:/Users/khiar/config/.env' });

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configurer la stratégie Google OAuth
passport.use(new GoogleStrategy({
  clientID : process.env.GOOGLE_CLIENT_ID,
  clientSecret : process.env.GOOGLE_CLIENT_SECRET,   
  callbackURL: 'http://localhost:3000/auth/google/callback'  // URL de callback
},
async function(accessToken, refreshToken, profile, done) {
  // Créez un utilisateur fictif ou interrogez votre base de données ici
  const user = {
    displayName: profile.displayName,
    emails: profile.emails,
    name: profile.name,
    birthDate: '', // Ajouter un champ vide pour le moment
    address: '',   // Ajouter un champ vide pour le moment
    phoneNumber: '' // Ajouter un champ vide pour le moment
  };

  return done(null, user);
}));

// Sérialiser et désérialiser les utilisateurs pour la session
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
