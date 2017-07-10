
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('streak_data', function(table) {
      table.increments('id').primary();
      table.string('sport');
      table.string('question');
      table.string('optionOne');
      table.string('optionTwo');
      table.string('startTime');
      table.string('status');
      table.string('userVoteOptOne');
      table.string('userVoteOptTwo');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('mlb_odds', function(table) {
      table.increments('id').primary();
      table.string('game');
      table.string('teamOne');
      table.string('teamTwo');
      table.string('pitcherOne');
      table.string('pitcherTwo');
      table.string('winLossOne');
      table.string('winLossTwo');
      table.string('streakOne');
      table.string('streakTwo');
      table.string('openMLOne');
      table.string('openMLTwo');
      table.string('currMLOne');
      table.string('currMLTwo');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('mlb_odds'),
    knex.schema.dropTable('streak_data')
  ]);
};
