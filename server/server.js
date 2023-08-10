const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Importez le package 'cors'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const moment = require('moment');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
require('dotenv').config();
const base64Img = require('base64-img');
const winston = require('winston');
const { createLogger, format, transports } = winston;

const logFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Créer un logger
const logger = createLogger({
  level: 'error', // N'enregistrer que les messages d'erreur et plus graves
  format: logFormat,
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }) // Enregistrer les erreurs dans error.log
  ]
});

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ajoutez les méthodes HTTP que vous utilisez
  allowedHeaders: ['Content-Type', 'Authorization'], // Ajoutez les en-têtes personnalisés que vous utilisez
  optionsSuccessStatus: 204, // Réponse pour les requêtes OPTIONS
};

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

app.post('/register', (req, res) => {
  const { name, firstname, email, password } = req.body;
  const id = null;
  const isAdmin = false;
  const points = 1;

  const queryCheckEmail = `SELECT * FROM User WHERE Mail = ?`;
  connection.query(queryCheckEmail, [email], (errEmail, resultsEmail) => {
    if (errEmail) {
      console.error('Erreur lors de la vérification de l\'e-mail :', errEmail);
      res.status(500).json({ success: false, message: 'Erreur lors de la vérification de l\'e-mail' });
      console.log('Erreur lors de la vérification de l\'e-mail');
    } else {
      if (resultsEmail.length > 0) {
        res.json({ success: false, message: 'Cet e-mail est déjà utilisé' });
        console.log('Cet e-mail est déjà utilisé');
      } else {
        bcrypt.hash(password, 10, (errHash, hash) => {
          if (errHash) {
            console.error('Erreur lors du hachage du mot de passe :', errHash);
            res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout de l\'utilisateur' });
            console.log('Erreur lors de l\'ajout de l\'utilisateur');
          } else {
            const hashedPassword = hash;

            const queryInsert = `INSERT INTO User (idUser, Name, Firstname, Mail, Password, Points, isAdmin)
                                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const valuesInsert = [id, name, firstname, email, hashedPassword, points, isAdmin];

            connection.query(queryInsert, valuesInsert, (errInsert, resultsInsert) => {
              if (errInsert) {
                console.error('Erreur lors de l\'ajout de l\'utilisateur :', errInsert);
                res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout de l\'utilisateur' });
                console.log('Erreur lors de l\'ajout de l\'utilisateur');
              } else {
                res.json({ success: true, message: 'Utilisateur ajouté avec succès' });
                console.log('Utilisateur ajouté avec succès');

                const mailOptions = {
                  from: 'Trainr',
                  to: email,
                  subject: 'Bienvenu sur Trainr !',
                  text: `Bonjour ${firstname} ${name} ,\n\nVotre compte vient d'être créé sur l'application Trainr. Vous pouvez maintenant vous connecter avec votre adresse e-mail et votre mot de passe et commencer à bouger ! Chaque séance vous rapporte des points.
                    \nCes points peuvent être ensuite échangés contre des récompenses dans la boutique de l'application. Votre solde initial est de 1 point. Bonne chance !
                    \nSi vous n'êtes pas à l'origine de cette demande, veuillez contacter l'administrateur de l'application.\n\nL'équipe Trainr`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
                    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'e-mail de validation' });
                  } else {
                    console.log('Mail de validation envoyé :', info.response);
                    res.json({ success: true, message: 'Mail de validation envoyé' });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
}); //no token verification

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const queryCheckEmail = 'SELECT * FROM User WHERE Mail = ?';
  connection.query(queryCheckEmail, [email], (errEmail, resultsEmail) => {
    if (errEmail) {
      console.error('Erreur lors de la vérification de l\'e-mail :', errEmail);
      res.status(500).json({ success: false, message: 'Erreur lors de la vérification de l\'e-mail' });
    } else {
      if (resultsEmail.length === 0) {
        res.json({ success: false, message: 'Identifiants incorrects' });
      } else {
        const user = resultsEmail[0];

        bcrypt.compare(password, user.Password, (errCompare, result) => {
          if (errCompare) {
            console.error('Erreur lors de la comparaison des mots de passe :', errCompare);
            res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
          } else {
            if (result) {
              const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY);
              res.json({ success: true, message: 'Connexion réussie', token: token });
            } else {
              res.json({ success: false, message: 'Identifiants incorrects' });
            }
          }
        });
      }
    }
  });
}); //no token verification

app.get('/user', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error('Erreur lors de la vérification du token :', err);
      res.status(401).json({ success: false, message: 'Token invalide' });
    } else {
      const email = decodedToken.email;

      const query = 'SELECT * FROM User WHERE Mail = ?';
      connection.query(query, [email], (errQuery, results) => {
        if (errQuery) {
          logger.error('Erreur lors de la récupération des informations de l\'utilisateur :', errQuery);
          res.status(500).json({ success: false, message: 'Erreur lors de la récupération des informations de l\'utilisateur' });
        } else {
          if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
          } else {
            const user = results[0];
            // Envoyez les informations de l'utilisateur en réponse
            res.json({
              success: true,
              message: 'Informations utilisateur récupérées avec succès',
              user: {
                userId: user.idUser,
                name: user.Name,
                firstName: user.Firstname,
                email: user.Mail,
                isAdmin: user.isAdmin,
                points: user.Points,
              }
            });
          }
        }
      });
    }
  });
}); //token verification

app.post('/modify-item', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error('Erreur lors de la vérification du token :', err);
      res.status(401).json({ success: false, message: 'Token invalide' });
    } else {
      const email = decodedToken.email;

      const query = 'SELECT * FROM User WHERE Mail = ?';
      connection.query(query, [email], (errQuery, results) => {
        if (errQuery) {
          logger.error('Erreur lors de la récupération des informations de l\'utilisateur :', errQuery);
          res.status(500).json({ success: false, message: 'Erreur lors de la récupération des informations de l\'utilisateur' });
        } else {
          if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
          } else {
            if(results[0].isAdmin === 1){
              const query = 'UPDATE MarketItem SET Name = ?, Description = ?, Price = ? WHERE idItem = ?';
              connection.query(query, [req.body.modifyName, req.body.modifyDescription, req.body.modifyPrice, req.body.idItem], (errQuery, results) => {
                if (errQuery) {
                  logger.error('Erreur lors de la modification de l\'item :', errQuery);
                  res.status(500).json({ success: false, message: 'Erreur lors de la modification de l\'item' });
                } else {
                  res.json({ success: true, message: 'Item modifié avec succès' });
                }
              });
            }
          }
        }
      });
    }
  });
}); //token verification

app.post('/buy-item', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error('Erreur lors de la vérification du token :', err);
      res.status(401).json({ success: false, message: 'Token invalide' });
    } else {
      const email = decodedToken.email;

      const query = 'SELECT * FROM User WHERE Mail = ?';
      connection.query(query, [email], (errQuery, results) => {
        if (errQuery) {
          logger.error('Erreur lors de la récupération des informations de l\'utilisateur :', errQuery);
          res.status(500).json({ success: false, message: 'Erreur lors de la récupération des informations de l\'utilisateur' });
        } else {
          if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
          } else {
            if(results[0].isAdmin === 0){
              const idPurchase = null;
              const queryInsert = `INSERT INTO Purchase (idPurchase, idUser, Date, Price, idMarketItem)
                                  VALUES (?, ?, ?, ?, ?)`;
              const valuesInsert = [idPurchase, req.body.idUser, req.body.date, req.body.idPrice, req.body.idItem];
              connection.query(queryInsert, valuesInsert, (errInsert, resultsInsert) => {
                if (errInsert) {
                  console.error('Erreur lors de l\'ajout de l\'achat :', errInsert);
                  res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout de l\'achat' });
                } else {
                  const query = 'UPDATE User SET Points = ? WHERE idUser = ?';
                  connection.query(query, [req.body.newSoldes, req.body.idUser], (errQuery, results) => {
                    if (errQuery) {
                      logger.error('Erreur lors de la modification des points :', errQuery);
                      res.status(500).json({ success: false, message: 'Erreur lors de la modification des points' });
                    } else {
                      res.json({ success: true, message: 'Achat réalisé avec succès' });
                    }
                  });
                }
              });
            }
          }
        }
      });
    }
  });
}); //token verification

app.get('/get-recipes', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error('Erreur lors de la vérification du token :', err);
      res.status(401).json({ success: false, message: 'Token invalide' });
    } else {
      const email = decodedToken.email;

      const query = 'SELECT * FROM User WHERE Mail = ?';
      connection.query(query, [email], (errQuery, results) => {
        if (errQuery) {
          logger.error('Erreur lors de la récupération des informations de l\'utilisateur :', errQuery);
          res.status(500).json({ success: false, message: 'Erreur lors de la récupération des informations de l\'utilisateur' });
        } else {
          if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
          } else {
            const userId = results[0].idUser;

            const query = 'SELECT MarketItem.Name, Purchase.* FROM Purchase, MarketItem WHERE Purchase.idMarketItem = MarketItem.idItem AND idUser = ? ORDER BY Purchase.Date DESC';
            connection.query(query, [userId], (errQuery, results) => {
              if (errQuery) {
                logger.error('Erreur lors de la récupération des factures :', errQuery);
                res.status(500).json({ success: false, message: 'Erreur lors de la récupération des factures' });
              } else {
                if (results.length === 0) {
                  res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
                } else {
                  res.json({ success: true, message: 'Factures récupérées avec succès', results: results });
                }
              }
            });
          }
        }
      });
    }
  });
}); //token verification

app.get('/get-market', (req, res) => {
  const email = req.query.email;

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error('Erreur lors de la vérification du token :', err);
      res.status(401).json({ success: false, message: 'Token invalide' });
    } else {
      const userEmail = decodedToken.email;

      const query = `
        SELECT * from MarketItem;
      `;

      connection.query(query, [], (err, results) => {
        if (err) {
          console.error('Erreur lors de la récupération du market :', err);
          res.status(500).json({ success: false, message: 'Erreur lors de la récupération du market' });
        } else {
          res.json({
            success: true,
            message: 'Items récupérés avec succès',
            Leaders: results,
          });
        }
      });
    }
  });
}); //token verification + link verification


app.get('/worksite/:id/get-admin-chief', (req, res) => {
  const email = req.query.email;
  const workSiteId = req.params.id; // Utilisez req.params.id pour récupérer l'ID du chantier depuis la route

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error('Erreur lors de la vérification du token :', err);
      res.status(401).json({ success: false, message: 'Token invalide' });
    } else {
      const userEmail = decodedToken.email;

      checkUserWorkSiteLink(userEmail, workSiteId, (checkErr, checkResult) => {
        if (checkErr) {
          res.status(500).json(checkErr);
        } else {
          const query = `
              SELECT User.Name, User.FirstName, User.Phone FROM User, WorkSiteUser Where WorkSiteUser.UserId = User.UserId AND 
              WorkSiteUser.WorkSiteId = ? AND (WorkSiteUser.isAdmin = 1 OR WorkSiteUser.isChief = 1)
          `;

          connection.query(query, [workSiteId], (err, results) => {
            if (err) {
              console.error('Erreur lors de la récupération des responsables :', err);
              res.status(500).json({ success: false, message: 'Erreur lors de la récupération des responsables' });
            } else {
              res.json({
                success: true,
                message: 'Responsables récupérés avec succès',
                Leaders: results,
              });
            }
          });
        }
      });
    }
  });
}); //token verification + link verification

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
}); //mail configuration

app.post('/forgot-password', (req, res) => {
  const { forgottenEmail } = req.body;

  // Vérifier si l'utilisateur existe dans la base de données
  const userQuery = 'SELECT * FROM User WHERE Email = ?';
  connection.query(userQuery, [forgottenEmail], (err, userResults) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur :', err);
      return res.status(500).json({ success: false, message: 'Erreur lors de la vérification de l\'utilisateur' });
    }

    if (userResults.length === 0) {
      return res.json({ success: false, message: 'Aucun utilisateur trouvé' });
    }

    // Générer le jeton de réinitialisation
    const resetToken = jwt.sign({ forgottenEmail }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });

    const mailOptions = {
      from: 'FayAppForgotPassword[NoReply]@gmail.com',
      to: forgottenEmail,
      subject: 'Réinitialisation du mot de passe',
      text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :
      http://localhost:8080/reset-password/${forgottenEmail}/${resetToken}
      
      Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation du mot de passe' });
      } else {
        console.log('E-mail de réinitialisation du mot de passe envoyé :', info.response);
        res.json({ success: true, message: 'Demande de réinitialisation du mot de passe réussie' });
      }
    });
  });
}); //no working actually

app.post('/reset-password/:mail/:token', (req, res) => {
  const { mail, token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);    
    if (decodedToken.forgottenEmail !== mail) {
      return res.status(400).json({ success: false, message: 'Token invalide' });
    }

    if(confirmPassword === password) {

      // Mettre à jour le mot de passe dans la base de données
      bcrypt.hash(password, 10, (errHash, hashedPassword) => {
        if (errHash) {
          console.error('Erreur lors du hachage du mot de passe :', errHash);
          return res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe' });
        }

        //récupération du userId
        const query = `
            SELECT UserId FROM User WHERE Email = ?
          `;
          connection.query(query, [mail], (err, results) => {
            if (err) {
              console.error('Erreur lors de la récupération de l\'utilisateur :', err);
              res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'utilisateur' });
            } else {
              if (results.length > 0) {
                const UserId = results[0].UserId;

                const updateQuery = 'UPDATE User SET Password = ? WHERE Email = ? AND UserId = ?';
                connection.query(updateQuery, [hashedPassword, mail, UserId], (errUpdate) => {
                  if (errUpdate) {
                    console.error('Erreur lors de la réinitialisation du mot de passe :', errUpdate);
                    return res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe' });
                  }
                  res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
                });

              } else {
                res.json({
                  success: false,
                  message: 'Aucun utilisateur trouvé avec ce mail',
                });
              }
            }
          });
      });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du token :', error);
    res.status(400).json({ success: false, message: 'Token invalide' });
  }
}); //token verification


function checkIsAdmin(userId, workSiteId, callback) {
  const checkQuery = `
    SELECT * FROM WorkSiteUser WHERE UserId = ? AND WorkSiteId = ? AND isAdmin = 1
  `;
  connection.query(checkQuery, [userId, workSiteId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Erreur lors de la vérification de l\'administrateur :', checkErr);
      callback({ success: false, message: 'Erreur lors de la vérification de l\'administrateur' });
    } else if (checkResults.length === 0) {
      callback({ success: false, message: 'L\'utilisateur n\'est pas administrateur sur ce chantier' });
    } else {
      callback(null, { success: true });
    }
  });
}


app.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000 : Application Trainr');
});

app.get('/', (req, res) => {
  res.send('Backend of Trainr is running');
});