var express = require('express');
var router = express.Router();

var ProductModel = require('../models/product');



// ----------------------------------------------
// ------------ ROUTES PAGE ADMIN ---------------
// ----------------------------------------------


router.get('/', async function (req, res, next) {
    var products = await ProductModel.find();
    res.render('admin', { title: 'Page Administrateur', products });
  });
  
  router.get('/addProduct', function (req, res, next) {
    res.render('addProduct', { title: 'Ajouter un produit', product: false});
  });
  
  router.get('/updateProduct', async function (req, res, next) {
   var article = await ProductModel.findById(req.query.id);
    res.render('updateProduct', { title: 'Modifier un produit', product: false, article});
  });
  
  router.post('/updateProduct', async function (req, res, next) {
      console.log("le query : ", req.body)
      await ProductModel.updateOne(
        { _id: req.body.id},
        { mea: req.body.mea,
        name: req.body.name,
        img: req.body.image,
        desc: req.body.desc,
        price: req.body.price,
        stock: req.body.stock }
      );
  
      var article = await ProductModel.findById(req.body.id);
      console.log("l'article", article)
  
    res.render('updateProduct', { title: 'Modification effectuée', product: true, article});
  });
  
  
  router.post('/addProduct', async function (req, res, next) {
    var newProduct = new ProductModel ({
      mea: req.body.mea,
      name: req.body.name,
      img: req.body.image,
      desc: req.body.desc,
      price: req.body.price,
      stock: req.body.stock
    });
    
      var productNew = await newProduct.save();
    
    res.render('addProduct', { title: 'Ajouter un produit', product: true, productNew, message: "ajouté à la liste de produit" });
  });
  
  /* GET deleteProduct du ADMIN page. */
  router.get('/deleteProduct', async function (req, res, next) {
    console.log(req.query)  //on récupére la position i de l'élément supprimé
  
    await ProductModel.deleteOne(
      {_id: req.query.id},
    ); 
  
    var products = await ProductModel.find();
  
    res.render('admin', { title: 'Page Administrateur', products });
  });
  
  
  
  
  module.exports = router;
  