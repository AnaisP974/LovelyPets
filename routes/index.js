var express = require('express');
var router = express.Router();

var ProductModel = require('../models/product');
var UserModel = require('../models/users');








// création de la liste des produits et de ses caractéristiques que j'enregistre dans une variable globale
// let dataProducts = [
//   { mea: false, name: "Clochette", img: "/images/clochette.jpg", desc: "Sonnette d'entraînement pour chiens, accessoire pour signaler le repas ou les sorties.", price: 14 },
//   { mea: false, name: "Collier", img: "/images/collier.jpg", desc: "Collier en cuir, avec plaque personnalisée éléglant et résistant.", price: 25 },
//   { mea: true, name: "Sac de transport été", img: "/images/sac2.jpg", desc: "Sac à main de transport pour animaux de compagnie, respirant idéal pour l'été", price: 40 },
//   { mea: false, name: "Collier Strass", img: "/images/collier1.jpg", desc: "Collier avec paillette avec strass et diamant fantaisie personnalisable", price: 30 },
//   { mea: false, name: "Gamelles surélevées", img: "/images/gamelle.jpg", desc: "Gammelles surélevées facilitent la prise de l'aliment, la digestion et le confort de vos animaux.", price: 45 },
//   { mea: true, name: "Sac de transport", img: "/images/sac.jpg", desc: "Sac à dos de Transport pour chien, sacoche multifonctionnelle.", price: 75 },
//   { mea: false, name: "Box ludique", img: "/images/jeuLudique.jpg", desc: "Jeux Ludique pour chien et chat", price: 20 },
//   { mea: false, name: "Boule de récompenses", img: "/images/jeuLudique1.jpg", desc: "Boule dejeux qui distribue des récompenses", price: 20 },
//   { mea: false, name: "Niche Nounours", img: "/images/niche.jpg", desc: "Niche tout confort brun et pliable", price: 35 },
//   { mea: false, name: "Niche Lapinou", img: "/images/niche1.jpg", desc: "Niche tout confort couleur crème et pliable", price: 35 },
//   { mea: true, name: "Sac de Luxe", img: "/images/sac1.jpg", desc: "Sac à dos de transport pour petit chien, en cuir blanc écru.", price: 95 },
// ];

// tableau qui représente la liste de produits présent dans le panier
// let dataSelectedProducts = [];



/* GET home page. */
router.get('/', function (req, res, next) {
  // dés l'arrivée sur la page shop on crée une session qui représentera un panier vide.
  // cette session est créée que si elle n'éxiste pas
  if (req.session.dataSelectedProducts == undefined) {
    req.session.dataSelectedProducts = []
  }
  res.render('index', { title: 'Home Page' });
});

router.get('/shop', async function (req, res, next) {

  var products = await ProductModel.find();

  // dés l'arrivée sur la page shop on crée une session qui représentera un panier vide.
  // cette session est créée que si elle n'éxiste pas
  if (req.session.dataSelectedProducts == undefined) {
    req.session.dataSelectedProducts = []
  }

  // j'envoie mon tableau d'objet vers la page shop
  res.render('shop', { title: 'Shop Page', products});
});

/*************** GET product page. ****************************/
//OK! IL VA FALLOIR TROUVER UN MOYEN DE FAIRE PASSER DES INFOS EN GET POUR POUVOIR LES AFFICHER SUR CETTE NOUVELLE PAGE
router.get('/product', function (req, res, next) {
  //vérifier si je récupère bien les éléments passés en get depuis le front sur le backend
  console.log(req.query)
  //..et je passe ici les variables enregistrés pour la création de la page à retourner au front
  res.render('product', { title: 'Fiche produit', name: req.query.name, img: req.query.img, desc: req.query.desc, price: req.query.price });
});

router.get('/consultPanier', function (req, res, next) {
  res.render('panier', { title: 'Mon panier', dataSelectedProducts: req.session.dataSelectedProducts });
})


/* GET panier page. */
router.get('/panier', function (req, res, next) {

  var productExists = false;
  for (let i = 0; i < req.session.dataSelectedProducts.length; i++) {

    if (req.session.dataSelectedProducts[i].name == req.query.productNameFromFront) {
      req.session.dataSelectedProducts[i].quantity = Number(req.session.dataSelectedProducts[i].quantity) + 1
      productExists = true
    }


  }
  if (productExists == false) {

    // je récupére les valeurs envoyées et je les ajoute à mon tableu représentant le panier
    req.session.dataSelectedProducts.push({
      name: req.query.productNameFromFront,
      img: req.query.productImgFromFront,
      price: req.query.productPriceFromFront,
      quantity: 1
    })
  }
  res.render('panier', { title: 'Mon panier', dataSelectedProducts: req.session.dataSelectedProducts });
});

/* GET delete-product du PANIER page. */
router.get('/delete-product', function (req, res, next) {
  console.log(req.query)  //on récupére la position i de l'élément supprimé

  //suppression avec la méthode splice, elle recoit normalement 3argu. mais on peut lui indiquer que 2 pour une suppression. argu1 = position, argu2 = de combien elle se décale, argu3=ce par quoi on veut le remplacer.

  req.session.dataSelectedProducts.splice(req.query.positionFromFront, 1);
  res.render('panier', { title: 'Mon panier', dataSelectedProducts: req.session.dataSelectedProducts });
});


/* MODIFIER LA QUANTITE */
router.post('/update-product', function (req, res, next) {
  console.log(req.body)

  var newQuantity = req.body.quantityFromFront
  var position = req.body.positionFromFront

  //"va à la position i et modifie la quantité"
  req.session.dataSelectedProducts[position].quantity = newQuantity

  res.render('panier', { title: 'Mon panier', dataSelectedProducts: req.session.dataSelectedProducts })

})

/* GET contact page. */
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact Page' });
});



//---------------------------- CONNEXION / LOGGIN --------------------------------------------------

/* GET connexion page. */
router.get('/connexion', function (req, res, next) {
  res.render('connexion', { title: 'Connexion Page' });
});



router.post('/createUser', async function(req, res, next){
  // rechercher dans la base de données un compte contenant l'email saisie depuis le front
  var searchUser = await UserModel.findOne({
    email: req.body.emailFormFront
  })

  // Si l'on ne trouve rien.. 
  if(!searchUser){
    // créer un nouvel utilisateur
    var newUser = new UserModel ({
        pseudo: req.body.pseudoFromFront,
        email: req.body.emailFromFront,
        password: req.body.passwordFromFront
      });
    // enregistrer ce nv utilisateur dans la base de données
    var userSave = await newUser.save();
    // et crée une session user:
    req.session.user = {
      name: userSave.username,
      id: userSave._id,
    }
    console.log(req.session.user)
  
    res.redirect('/users')
  } else {
    res.redirect('/')
  }

});


router.post('/sign-in', async function (req, res, next){
  
  var searchUser = await UserModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if(searchUser!= null){
    req.session.user = {
      pseudo: searchUser.pseudo,
      id: searchUser._id
    }
    res.redirect('/users')
  } else {
    res.render('connexion')
  }
});

router.get('/logout', function(req,res,next){

  req.session.user = null;

  res.redirect('/')
});


module.exports = router;
