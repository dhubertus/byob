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


const secretKey = !process.env.CLIENT_SECRET || !config.CLIENT_SECRET
const username = !process.env.USERNAME || !config.USERNAME
const password = !process.env.PASSWORD || !config.PASSWORD

if ( secretKey || username || password ) {
  throw 'Make sure you have a CLIENT_SECRET, USERNAME, and PASSWORD in your .env file';
}


app.set('secretKey', process.env.CLIENT_SECRET || config.CLIENT_SECRET);

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
app.get('/api/v1/questions/:singleQuestion', (req, res) => {

  database('streak_data').where('question', req.params.singleQuestion + '?')
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
  //NOTE: example body for authenticating through postman
          // {
          //   "username": "guy",
          //   "password": "fieri"
          // }

app.post('/api/v1/authenticate', (req, res) => {
  const userInfo = req.body;

  if (userInfo.username !== config.USERNAME ||  userInfo.password !== config.PASSWORD) {
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
  //NOTE: Example body below for creating new bet through Post Man
          // {
          //   "question": "Who will WIN this matchup?",
          //   "starttime": "7:00pm",
          //   "sport": "MLB",
          //   "status": "In Progress",
          //   "optionOne": "950 Yankees",
          //   "optionTwo": "951 Red Sox",
          //   "oppOne": "40%",
          //   "oppTwo": "60%",
          //   "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZvbyIsInBhc3N3b3JkIjoiYmFyIiwiaWF0IjoxNDk5ODk1NzY4LCJleHAiOjE1MDAwNjg1Njh9.u1qyb_k2LG8_oDMpiTs1FCw5sgG9jbk6atdazxi3J5o"
          // }
app.post('/api/v1/newQuestion', checkAuthorization, (req, res) => {
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
        res.status(422).json({ error: 'There was an error this question was not added!' });
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
      if (result.length) {
        res.status(200).json(result);
      } else {
        res.status(422).json({ error: 'There was an error and this item was not triggered false!' });
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
        res.status(422).json({ error: 'There was an error and you selection was not submitted!' });
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
      if (result.length) {
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
      if (result.length) {
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
      if (result.length) {
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
