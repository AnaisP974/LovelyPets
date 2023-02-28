var mongoose = require('mongoose');// CONNEXION AVEC LA BASE DE DONNEES

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
mongoose.connect(
    'mongodb+srv://AnaP974:adminadmin@cluster0.qao2gyv.mongodb.net/lovelypets?retryWrites=true&w=majority',
    options,        
    function(error) {
        console.log(error);
    }
);