const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require(path.join(__dirname, './knexfile.js'))[environment];
const database = require('knex')(configuration);
const cors = require('cors');

const jwt = require('jsonwebtoken');
const config = require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


if ( !process.env.CLIENT_SECRET || !process.env.USERNAME || !process.env.PASSWORD ) {
  throw 'Make sure you have a CLIENT_SECRET, USERNAME, and PASSWORD in your .env file';
}


app.set('secretKey', process.env.CLIENT_SECRET);

const checkAuthorization = (req, res, next) => {

  const token = req.body.token ||
                req.param('token') ||
                req.headers.authorization;

  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {

      if (error) {
        return res.status(403).send({
          success: false,
          message: 'Invalid authorization token.'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'You must be authorized to hit this endpoint'
    });
  }
};


app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, './public')));

//NOTE: Recieves all Streak For Cash Questions and options
app.get('/api/v1/questions', (req, res) => {
  database('streak_data').select('question', 'optionOne', 'optionTwo')
    .then(questions => {
      if (questions.length) {
        res.status(200).json(questions);
      } else {
        res.status(404).json({ error: 'No questions were found!' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: Recieves all MLB sports betting odds
app.get('/api/v1/odds', (req, res) => {
  database('mlb_odds').select()
    .then(games => {
      if (games.length) {
        res.status(200).json(games);
      } else {
        res.status(404).json({ error: 'No odds or lines were found!' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: Recieves single MLB game betting odds using query parameters
app.get('/api/v1/odds/:singleSetOdds', (req, res) => {

  database('mlb_odds').where('teamOne', req.params.singleSetOdds).select()
  .orWhere('teamTwo', req.params.singleSetOdds)
    .then(game => {
      if (game.length) {
        res.status(200).json(game);
      } else {
        res.status(404).json({ error: 'These odds were not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: returns all information for a single question from the database
app.get('/api/v1/questions/:singleQuestionId', (req, res) => {
  database('streak_data').where('id', req.params.singleQuestionId)
    .then(question => {
      if (question.length) {
        res.status(200).json(question);
      } else {
        res.status(404).json({ error: 'This question was not found' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: post to authenticate/login
app.post('/api/v1/authenticate', (req, res) => {
  const userInfo = req.body;

  const username = process.env.USERNAME || config.USERNAME;
  const password = process.env.PASSWORD || config.PASSWORD;

  if (userInfo.username !== username ||  userInfo.password !== password) {
    res.status(403).send({
      success: false,
      message: 'Invalid Credentials'
    });
  } else {
    let token = jwt.sign(userInfo, app.get('secretKey'), {
      expiresIn: 1210000  //seconds
    });

    res.json({
      success: true,
      username: userInfo.username,
      token
    });
  }
});

//NOTE: post to add new incoming bests
app.post('/api/v1/questions', checkAuthorization, (req, res) => {
  database('streak_data')
    .insert({
      question: req.body.question,
      startTime: req.body.starttime,
      sport: req.body.sport,
      status: req.body.status,
      optionOne: req.body.optionOne,
      optionTwo: req.body.optionTwo,
      userVoteOptOne: req.body.oppOne,
      userVoteOptTwo: req.body.oppTwo
    })
    .then(result => {
      if (req.body.question) {
        res.status(200).json(result);
      } else {
        res.status(422).json({ error: 'There was an error and this question was not added! Please check to make sure you are sending a body with this post that includes the proper attributes for creating a question.' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: toggles selection false
app.patch('/api/v1/removeSelection', checkAuthorization, (req, res) => {
  database('streak_data').whereNot('selected', 'false').select()
    .update({
      selected: 'false'
    })
    .then(result => {
      if (result === 1) {
        res.status(200).json(result);
      } else {
        res.status(422).json({ error: 'There were no selected bets to overwrite to false! A bet must be selected in order to remove a selection!' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: adds the current selection
app.patch('/api/v1/selection', checkAuthorization, (req, res) => {
  const selection = req.query.selection;

  database('streak_data').where('optionOne', selection).orWhere('optionTwo', selection).select('selected')
    .update({
      selected: selection
    })
    .then(result => {
      if (result === 1) {
        res.status(200).json(result);
      } else {
        res.status(422).json({ error: 'Your selection does not exist and was not submitted! Please check your selection is being sent as a query parameter!' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: deletes all games that have ended in streak_data table
app.delete('/api/v1/deleteFinal', checkAuthorization, (req, res) => {
  database('streak_data').where('status', 'Final').del()
    .then(result => {
      if (result >= 1) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: 'There were no final results to delete!' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: deletes all in streak_data table for purpose of getting new current data
app.delete('/api/v1/deleteAllStreak', checkAuthorization, (req, res) => {
  database('streak_data').del()
    .then(result => {
      if (result >= 1) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: 'There were no questions to delete!' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

//NOTE: deletes all in mlb_odds table for purpose of getting new current data
app.delete('/api/v1/deleteAllOdds', checkAuthorization, (req, res) => {
  database('mlb_odds').del()
    .then(result => {
      if (result >= 1) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: 'There were no odds to delete!' });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

app.listen(app.get('port'));

console.log('listening at port' +  app.get('port'));

module.exports = app;
