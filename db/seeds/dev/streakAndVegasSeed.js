const streakData = require('../../../data/streakData');
const vegasData = require('../../../data/vegasData');

const seedPrepStreakData = (knex) => {
  return streakData.result.map((gameObj) => {
    const { question, starttime, sport, status, opponents, userVote } = gameObj

    return knex('streak_data').insert({
      sport: sport,
      question: question,
      optionOne: opponents.optionOne,
      optionTwo: opponents.optionTwo,
      startTime: starttime,
      status: status,
      userVoteOptOne: userVote.oppOne,
      userVoteOptTwo: userVote.oppTwo,
      selected: 'false'
    });
  });
};

const seedPrepVegasData = (knex) => {
  return vegasData.result.map((gameOddsObj) => {
    const { game, teamOne, teamTwo, pitcherOne, pitcherTwo, wlTeamOne, wlTeamTwo, strTeamOne, strTeamTwo, openMLTeamOne, openMLTeamTwo, curMLTeamOne, curMLTeamTwo } = gameOddsObj

    return knex('mlb_odds').insert({
      game: game,
      teamOne: teamOne,
      teamTwo: teamTwo,
      pitcherOne: pitcherOne,
      pitcherTwo: pitcherTwo,
      winLossOne: wlTeamOne,
      winLossTwo: wlTeamTwo,
      streakOne: strTeamOne,
      streakTwo: strTeamTwo,
      openMLOne: openMLTeamOne,
      openMLTwo: openMLTeamTwo,
      currMLOne: curMLTeamOne,
      currMLTwo: curMLTeamTwo
    })
  })
}

exports.seed = function(knex, Promise) {
  return knex('mlb_odds').del()
  .then(() => knex('streak_data').del())
  .then(() => {
    const newStreakData = seedPrepStreakData(knex)
    const newVegasData = seedPrepVegasData(knex)

    return Promise.all([...newStreakData, ...newVegasData])
  })
}
