[![CircleCI](https://circleci.com/gh/dhubertus/byob/tree/master.svg?style=svg)](https://circleci.com/gh/dhubertus/byob/tree/master)

# BYOB - Combining Prop Bets with Betting Odds

#### Using nightmare I scraped [ESPN](http://streak.espn.com/en/) and [VegasInsider](http://www.vegasinsider.com/mlb/matchups/) to assist in making your crappy bet a little less crappy.
* The idea was to have an app that is constantly scrapping up to date information for the user throughout the day. However for the purpose of this project I have scrapped older data becasue a) its consistent and b) its the all-star break and I scraped baseball data... 

[GET - All Questions/Prop Bets](https://github.com/dhubertus/byob/blob/master/server.js#L58-L70)
* (All Questions) - Allows the user to recieve all the current prop bets in order to make a high level decision on which they are intereseted in.

[GET - All MLB Betting Odds](https://github.com/dhubertus/byob/blob/master/server.js#L73-L85)
* (All Odds) - Allows the user to recieve all odds from a specific sport 

[GET - Single Question/Prop Bet](https://github.com/dhubertus/byob/blob/master/server.js#L105-L118)
* (Single Question) - Allows the user to select a prop bet and recieve more information pertaining to the specific question.

[GET - Single Set Odds](https://github.com/dhubertus/byob/blob/master/server.js#L88-L102)
* (Single Odds) - Allows the user to then select the 'up to date' vegas odds for this game to assits with their decision.

[POST - Authentication](https://github.com/dhubertus/byob/blob/master/server.js#L127-L149)
* (Auth) - Allows the user to login allowing them to actually place their bets.

[POST - Add New Question](https://github.com/dhubertus/byob/blob/master/server.js#L164-L186)
* (New Question) - When user requests updated prop bet list this endpoint allows for the questions to be added to the database.

[PATCH - Remove Selection](https://github.com/dhubertus/byob/blob/master/server.js#L189-L204)
* (Remove Select) - Allows user to remove a bet before the deadline has passed. 

[PATCH - Change Current Selection](https://github.com/dhubertus/byob/blob/master/server.js#L207-L224)
* (Make Select) - Allows the user to make a selection before the deadline has passed.

[DELETE - Delete All Final Results](https://github.com/dhubertus/byob/blob/master/server.js#L227-L239)
* (Delete Final) - Allows user to remove prop bets that have concluded. 

[DELETE - Delete Stale Question/Prop Bet Data](https://github.com/dhubertus/byob/blob/master/server.js#L242-L254)
* (Delete Prop) - Allows the user to remove all stale prop bets so the database can be re-seeded with any new/updated bets. 

[DELETE - Delete Stale Betting Odds Data](https://github.com/dhubertus/byob/blob/master/server.js#L257-L269)
* (Delete Odds) - Allows the user to remove all stale odds so the database can be re-seeded with any new/updated odds.







