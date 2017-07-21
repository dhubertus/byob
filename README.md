[![CircleCI](https://circleci.com/gh/dhubertus/byob/tree/master.svg?style=svg)](https://circleci.com/gh/dhubertus/byob/tree/master)

# BYOB - Combining Prop Bets with Betting Odds


### [Hosted on Heroku](https://byob-dave-hubertus.herokuapp.com/)
#### Using nightmare I scraped [ESPN](http://streak.espn.com/en/) and [VegasInsider](http://www.vegasinsider.com/mlb/matchups/) to assist in making your crappy bet a little less crappy.
* The idea was to have an app that is constantly scrapping up to date information for the user throughout the day. However for the purpose of this project I have scrapped older data becasue (a) its consistent and (b) its the all-star break and I scraped baseball data... 

[GET - All Questions/Prop Bets](https://github.com/dhubertus/byob/blob/master/server.js#L58-L70)
* (All Questions) - Allows the user to recieve all the current prop bets in order to make a high level decision on which they are intereseted in.</br>

[TEST WITH THIS LINK](https://byob-dave-hubertus.herokuapp.com/api/v1/questions)
___________________________________________________________________________

[GET - All MLB Betting Odds](https://github.com/dhubertus/byob/blob/master/server.js#L73-L85)
* (All Odds) - Allows the user to recieve all odds from a specific sport.</br>

[TEST WITH THIS LINK](https://byob-dave-hubertus.herokuapp.com/api/v1/odds)
___________________________________________________________________________


[GET - Single Question/Prop Bet](https://github.com/dhubertus/byob/blob/master/server.js#L105-L118)
* (Single Question) - Allows the user to select a prop bet and recieve more information pertaining to the specific question.</br>

[TEST WITH THIS LINK](https://byob-dave-hubertus.herokuapp.com/api/v1/questions/NBA%20Summer%20League%20(Las%20Vegas,NV):%20Who%20will%20WIN%20this%20matchup?)

___________________________________________________________________________

[GET - Single Set Odds](https://github.com/dhubertus/byob/blob/master/server.js#L88-L102)
* (Single Odds) - Allows the user to then select the 'up to date' vegas odds for this game to assits with their decision.</br>

[TEST WITH THIS LINK](https://byob-dave-hubertus.herokuapp.com/api/v1/odds/902%20Chi.%20Cubs)
___________________________________________________________________________


[POST - Authentication](https://github.com/dhubertus/byob/blob/master/server.js#L127-L149)
* (Auth) - Allows the user to login allowing them to actually place their bets.

* Post to '/api/v1/authenticate' with body: ```{ "password": "guy", "password": "fieri" }```
___________________________________________________________________________


[POST - Add New Question](https://github.com/dhubertus/byob/blob/master/server.js#L164-L186)
* (New Question) - Auth Needed - When user requests updated prop bet list this endpoint allows for the questions to be added to the database.

* Post to 'https://byob-dave-hubertus.herokuapp.com/api/v1/newQuestion' with body: {
            "question": "Who will WIN this matchup?",
            "starttime": "7:00pm",
            "sport": "MLB",
            "status": "In Progress",
            "optionOne": "950 Yankees",
            "optionTwo": "951 Red Sox",
            "oppOne": "40%",
            "oppTwo": "60%",
            "token:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1eSIsInBhc3N3b3JkIjoiZmllcmkiLCJpYXQiOjE1MDAwNjY3ODUsImV4cCI6MTUwMTI3Njc4NX0.CeaMG3ax9erdEANMmzyu5saqGoZ9WGGnLbuO27jwFHM"
          }
___________________________________________________________________________


[PATCH - Remove Selection](https://github.com/dhubertus/byob/blob/master/server.js#L189-L204)
* (Remove Select) - Auth Needed - Allows user to remove a bet before the deadline has passed. 

* Patch to 'https://byob-dave-hubertus.herokuapp.com/api/v1/removeSelection' with body: {
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1eSIsInBhc3N3b3JkIjoiZmllcmkiLCJpYXQiOjE1MDAwNjY3ODUsImV4cCI6MTUwMTI3Njc4NX0.CeaMG3ax9erdEANMmzyu5saqGoZ9WGGnLbuO27jwFHM"
} 
___________________________________________________________________________


[PATCH - Change Current Selection](https://github.com/dhubertus/byob/blob/master/server.js#L207-L224)
* (Make Select) - Auth Needed - Allows the user to make a selection before the deadline has passed.

* Patch to 'https://byob-dave-hubertus.herokuapp.com/api/v1/selection?selection=Houston%20Astros%20(60-29)%20Peacock' with body: {
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1eSIsInBhc3N3b3JkIjoiZmllcmkiLCJpYXQiOjE1MDAwNjY3ODUsImV4cCI6MTUwMTI3Njc4NX0.CeaMG3ax9erdEANMmzyu5saqGoZ9WGGnLbuO27jwFHM"
} 
___________________________________________________________________________

### NOTE: With the current seeded data the below delete end points will delete entire tables since all games are final. The other two would be used for removing stale data for incoming up to date data. 
___________________________________________________________________________

[DELETE - Delete All Final Results](https://github.com/dhubertus/byob/blob/master/server.js#L227-L239)
* (Delete Final) - Auth Needed - Allows user to remove prop bets that have concluded. 

* Delete to 'https://byob-dave-hubertus.herokuapp.com/api/v1/deleteFinal' with body: {
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1eSIsInBhc3N3b3JkIjoiZmllcmkiLCJpYXQiOjE1MDAwNjY3ODUsImV4cCI6MTUwMTI3Njc4NX0.CeaMG3ax9erdEANMmzyu5saqGoZ9WGGnLbuO27jwFHM"
} 
___________________________________________________________________________


[DELETE - Delete Stale Question/Prop Bet Data](https://github.com/dhubertus/byob/blob/master/server.js#L242-L254)
* (Delete Prop) - Auth Needed - Allows the user to remove all stale prop bets so the database can be re-seeded with any new/updated bets. 

* Delete to 'https://byob-dave-hubertus.herokuapp.com/api/v1/deleteAllStreak' with body: {
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1eSIsInBhc3N3b3JkIjoiZmllcmkiLCJpYXQiOjE1MDAwNjY3ODUsImV4cCI6MTUwMTI3Njc4NX0.CeaMG3ax9erdEANMmzyu5saqGoZ9WGGnLbuO27jwFHM"
} 
___________________________________________________________________________


[DELETE - Delete Stale Betting Odds Data](https://github.com/dhubertus/byob/blob/master/server.js#L257-L269)
* (Delete Odds) - Auth Needed - Allows the user to remove all stale odds so the database can be re-seeded with any new/updated odds.

* Delete to 'https://byob-dave-hubertus.herokuapp.com/api/v1/deleteAllOdds' with body: {
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1eSIsInBhc3N3b3JkIjoiZmllcmkiLCJpYXQiOjE1MDAwNjY3ODUsImV4cCI6MTUwMTI3Njc4NX0.CeaMG3ax9erdEANMmzyu5saqGoZ9WGGnLbuO27jwFHM"
} 
___________________________________________________________________________


### Layout of Streak Odds Table

<img width="1010" alt="screen shot 2017-07-14 at 12 51 06 pm" src="https://user-images.githubusercontent.com/25044263/28226477-85db5dde-6893-11e7-9c24-5c22a8b85010.png">

### Layout of MLB Odds Table

<img width="1198" alt="screen shot 2017-07-14 at 12 50 47 pm" src="https://user-images.githubusercontent.com/25044263/28226506-9d8bc89c-6893-11e7-845c-473d2ef8c53f.png">



