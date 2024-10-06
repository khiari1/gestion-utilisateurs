const express = require('express');
const passport = require('./passport'); // Importer votre configuration Passport
const session = require('express-session');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Configuration de la session
  server.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
  }));

  // Initialisation de Passport
  server.use(passport.initialize());
  server.use(passport.session());

  // Redirection à la racine
  server.get('/', (req, res) => {
    res.redirect('/auth/google'); // Redirige vers l'authentification Google
  });

  // Route d'authentification Google
  server.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  // Callback après l'authentification
  server.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/home'); // Redirection après authentification réussie
    });

  // Route pour la page d'accueil (/home)
  server.get('/home', (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user; // Utilisateur authentifié

      const html = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenue</title>
          <style>
            /* CSS pour centrer le formulaire */
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }

            .container {
              background-color: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              max-width: 400px;
              width: 100%;
              text-align: center;
            }

            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }

            form {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            label {
              margin-bottom: 10px;
              font-size: 14px;
              width: 100%;
              text-align: left;
            }

            input {
              padding: 10px;
              margin-bottom: 15px;
              border: 1px solid #ccc;
              border-radius: 5px;
              width: 100%;
              font-size: 14px;
            }

            button {
              background-color: #007BFF;
              color: white;
              padding: 10px 15px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              width: 100%;
            }

            button:hover {
              background-color: #0056b3;
            }

            .logout-btn, .portfolio-btn {
              margin-top: 10px;
              display: flex;
              justify-content: center;
            }

            .logout-btn a {
              text-decoration: none;
              color: white;
              font-size: 14px;
            }

            .portfolio-btn button {
              font-size: 14px;
              background-color: #28a745;
            }

            .portfolio-btn button:hover {
              background-color: #218838;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bienvenue, ${user.displayName} !</h1>
            <p>Email: ${user.emails[0].value}</p>
            <p>Prénom: ${user.name.givenName}</p>
            <p>Nom: ${user.name.familyName}</p>
            <p>Date de naissance: ${user.birthDate || ''}</p>
            <p>Adresse: ${user.address || ''}</p>
            <p>Numéro de téléphone: ${user.phoneNumber || ''}</p>

            <!-- Formulaire de mise à jour des informations utilisateur -->
            <form action="/update-user" method="POST">
              <label>Email: <input type="email" name="email" value="${user.emails[0].value}" /></label>
              <label>Prénom: <input type="text" name="firstName" value="${user.name.givenName}" /></label>
              <label>Nom: <input type="text" name="lastName" value="${user.name.familyName}" /></label>
              <label>Date de naissance: <input type="text" name="birthDate" value="${user.birthDate || ''}" /></label>
              <label>Adresse: <input type="text" name="address" value="${user.address || ''}" /></label>
              <label>Numéro de téléphone: <input type="text" name="phoneNumber" value="${user.phoneNumber || ''}" /></label>
              <button type="submit">Mettre à jour</button>
            </form>

            <!-- Bouton de déconnexion -->
            <div class="logout-btn">
              <a href="/auth/logout"><button>Se déconnecter</button></a>
            </div>

            <!-- Bouton pour rediriger vers le portfolio -->
            <div class="portfolio-btn">
              <button onclick="window.location.href='/portfolio';">Voir mon Portfolio</button>
            </div>
          </div>
        </body>
        </html>
      `;

      res.send(html);
    } else {
      res.redirect('/auth/google');
    }
  });

  // Route pour la mise à jour des informations utilisateur
  server.post('/update-user', express.urlencoded({ extended: true }), (req, res) => {
    const { email, firstName, lastName, birthDate, address, phoneNumber } = req.body;

    req.user.emails[0].value = email;
    req.user.name.givenName = firstName;
    req.user.name.familyName = lastName;
    req.user.birthDate = birthDate;
    req.user.address = address;
    req.user.phoneNumber = phoneNumber;

    req.user.displayName = `${firstName} ${lastName}`;

    res.redirect('/home');
  });

  // Route pour déconnexion
  server.get('/auth/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/auth/google');
    });
  });

  // Route pour rediriger vers le portfolio
  server.get('/portfolio', (req, res) => {
    res.redirect('https://khiariaymen.netlify.app/about');
  });

  // Gestion des requêtes Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Démarrage du serveur
  const port = process.env.PORT || 3001;

  if (process.env.NODE_ENV !== 'production') {
    // Exécution locale
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
    });
  } else {
    // Exécution sur Vercel
    module.exports = server;
  }
  
});
