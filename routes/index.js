var express = require('express');
var router = express.Router();

//création de la liste des produits et de ses caractéristiques que j'enregistre dans une variable globale
let dataProducts = [
  {name: "Clochette", img: "/images/clochette.jpg", desc: "Sonnette d'entraînement pour chiens, accessoire pour signaler le repas ou les sorties.", price: 14},
  {name: "Collier", img: "/images/collier.jpg", desc: "Collier en cuir, avec plaque personnalisée éléglant et résistant.", price: 25},
  {name: "Collier Strass", img: "/images/collier1.jpg", desc: "Collier avec paillette avec strass et diamant fantaisie personnalisable", price: 30},
  {name: "Gamelles surélevées", img: "/images/gamelle.jpg", desc: "Gammelles surélevées facilitent la prise de l'aliment, la digestion et le confort de vos animaux.", price: 45},
  {name: "Box ludique", img: "/images/jeuLudique.jpg", desc: "Jeux Ludique pour chien et chat", price: 20},
  {name: "Boule de récompenses", img: "/images/jeuLudique1.jpg", desc: "Boule dejeux qui distribue des récompenses", price: 20},
  {name: "Niche Nounours", img: "/images/niche.jpg", desc: "Niche tout confort brun et pliable", price: 35},
  {name: "Niche Lapinou", img: "/images/niche1.jpg", desc: "Niche tout confort couleur crème et pliable", price: 35}
];

//tableau qui représente la liste de produits présent dans le panier
let dataSelectedProducts = [
  {name: "Clochette", img: "/images/clochette.jpg", price: 14, quantity: 1},
  {name: "Collier", img: "/images/collier.jpg", price: 25, quantity: 2},

]



/* GET home page. */
router.get('/', function(req, res, next) {
  // nous créons une variable “temp” contenant un nombre généré aléatoirement
  let temp = Math.floor(Math.random() * Math.floor(40));

  res.render('index', { title: 'Home Page', temp: temp, user:{lastName: 'Anaïs', firstName: 'PERIGNY'}});
});

/* GET shop page. */
router.get('/shop', function(req, res, next) {
  // j'envoie mon tableau d'objet vers la page shop
  res.render('shop', { title: 'Shop Page', dataProducts});
});

/*************** GET product page. ****************************/
//OK! IL VA FALLOIR TROUVER UN MOYEN DE FAIRE PASSER DES INFOS EN GET POUR POUVOIR LES AFFICHER SUR CETTE NOUVELLE PAGE
router.get('/product', function(req, res, next) {
  //vérifier si je récupère bien les éléments passés en get depuis le front sur le backend
  console.log(req.query)
  //..et je ici les variables enregistrés pour la création de la page à retourner au front
  res.render('product', { title: 'Fiche produit', name: req.query.name, img: req.query.img, desc: req.query.desc, price: req.query.price});
});


/* GET panier page. */
router.get('/panier', function(req, res, next) {
  res.render('panier', { title: 'Mon panier', dataSelectedProducts});
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Page'});
});
/* GET connexion page. */
router.get('/connexion', function(req, res, next) {
  res.render('connexion', { title: 'Connexion Page'});
});

router.post("/inscription", function(req, res) {
  console.log( req.body );
  res.render("connected", {title:'Votre profile', nom: req.body.nom, prenom: req.body.prenom });
});







module.exports = router;