const Clarifai = require('clarifai'); //Clarifai computer vision package API
const config = require('../config');

//clarifai image recognition API initialization
const app = new Clarifai.App({
  apiKey: config.ApiKey
});

/**@NOTE has fetch POST request made in the front end for the imageUrl*/
const handleApiCall = (req, res) => {

  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json(`Unable to make API call\n${err}`));
}

const handleImage = (req, res, db) => {

  const { id } = req.body;

  //the '=' is a string because we are writing SQL 'knex' keeps statements as they would be written in SQL.  
  /**@NOTE SQL increment function is a better alternative to 'entries++'*/
  db('users').where('id', '=', id)
    //field  , value
    .increment('entries', 1)
    .returning('entries')
    //one id per user so one row per user. hence the entries[0]. It's treate as an array.
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json(`Error unable to get entries:\n${err}`));
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};