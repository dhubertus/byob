const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require(path.join(__dirname, './knexfile.js'))[environment];
const database = require('knex')(configuration)

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, './public')));

//NOTE: Recieves all Streak For Cash Questions and related information
app.get('/api/v1/questions', (req, res) => {
  database('streak_data').select()
    .then(questions => {
      res.status(200).json(questions);
    })
    .catch(error => {
      res.status(500).json({error})
    });
});

//NOTE: Recieves all MLB sports betting odds
app.get('/api/v1/odds', (req, res) => {
  database('mlb_odds').select()
    .then(games => {
      res.status(200).json(games);
    })
    .catch(error => {
      res.status(500).json({error})
    });
});

//NOTE: Recieves single MLB game betting odds
app.get('/api/v1/singleSetOdds', (req, res) => {

  const str = typeof req.query.opponent

  console.log(str, 'type of');
  console.log(req.query.opponent, 'logging params');

  database('mlb_odds').where('teamOne', req.query.opponent ).select()
  // .orWhere({teamTwo: req.query.opponent})
    .then(game => {
      console.log(game, 'game');
      res.status(200).json(game);
    })
    .catch(error => {
      res.status(500).json({error})
    });
});


app.get('/api/v1/teams', (req, res) => {
  database('mlb_odds').select('teamOne')
    .then(games => {
      res.status(200).json(games);
    })
    .catch(error => {
      res.status(500).json({error})
    });
});

app.listen(app.get('port'));

console.log('listening at port' +  app.get('port'));

module.exports = app;
