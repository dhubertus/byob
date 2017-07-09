// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/espn_streak',
    migrations: {
      directory: 'db/migrations'
    },
    seeds: {
      directory: 'db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
