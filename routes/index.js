var express = require('express');
var router = express.Router();
// CONNEXION AVEC LA BASE DE DONNEES
var mongoose = require('mongoose');
// Nous commençons par définir certaines options de connexion dans un objet nommé “options” :
// connectTimeoutMS : permet de définir la durée de la tentative de connexion à la base de données. Au bout de 5000ms, si la connexion n’est pas effective, la tentative de connexion s’arrêtera.
// useNewUrlParser & useUnifiedTopology : Ces paramètres sont recommandés par mongoose pour utiliser des fonctionnalités non dépréciées de mongoose
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
 }

//  La méthode mongoose.connect() va recevoir plusieurs arguments :
// En premier, l’uri de connexion à notre base de données
// En second, les options définies précédemment sous forme d’objet
// En troisième, une fonction de callback qui sera appelée à la fin de la tentative de connexion. La paramètre “err” contient les erreurs éventuelles remontées lors de la tentative de connexion. Si “err” est null, il n’y a alors pas d’erreur, la connexion s’est bien déroulée.
mongoose.connect('mongodb+srv://AnaP974:adminadmin@cluster0.qao2gyv.mongodb.net/lovelypets?retryWrites=true&w=majority',
options,        
function(err) {
 console.log(err);
}
);

//  Pour pouvoir manipuler et exploiter les collections de votre base de données, il faudra, pour chaque collection créer un schéma et un modèle associé à chaque collection
var productSchema = mongoose.Schema({
mea: Boolean,
name: String,
img: String,
desc: String,
price: Number,
stock: Number
});

var ProductModel = mongoose.model('products', productSchema);

var userSchema = mongoose.Schema({
pseudo: String,
email: String,
password: String,
});

var UserModel = mongoose.model('users', userSchema);

// puis on export le model
module.exports = ProductModel;
module.exports = UserModel;




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

router.get('/admin', function (req, res, next) {
  
  res.render('admin', { title: 'Page Administrateur' });
});

/* GET shop page. */
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

/* GET delete-product page. */
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

/* GET connexion page. */
router.get('/connexion', function (req, res, next) {
  res.render('connexion', { title: 'Connexion Page' });
});

router.post('/createUser', async function(req, res, next){
  var newUser = new UserModel ({
    pseudo: req.body.pseudo,
    email: req.body.email,
    password: req.body.password
  });
  // pour le traitement des erreurs:
  let error;
  try {
    var userSaved = await newUser.save();
  }catch (err){
    error = err;
    console.log("création du user à la base de données échoué : ", err);
  }
  //renvoie d'un message d'erreur
  assert.equal(error.errors['pseudo'].message,
  'Path `pseudo` is required.');
  
  assert.equal(error.errors['email'].message,
  'Path `email` is required.');

  assert.equal(error.errors['password'].message,
  'Path `password` is required.');


  var user = await UserModel.findOne( { email: req.body.email } );


    
  res.render('profile', { title: 'Nouveau Compte créé !!!!', user });

})


router.post("/inscription", function (req, res) {
  console.log(req.body);
  res.render("connected", { title: 'Votre profile', nom: req.body.nom, prenom: req.body.prenom });
});







module.exports = router;
