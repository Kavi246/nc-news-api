# NC-News

## To run

### Enviroment Variables

To run this project some enviroment variables will need to be added so that we can connect to the correct database. These are '.env.test' to connect to our smaller test database, and '.env.development' to connect to our larger database.

These two files should be created in the root of this project folder.

'.env.test' should contain the line:

    PGDATABASE=nc_news_test

'.env.development' should contain the line:

    PGDATABASE=nc_news

(Both with no semi-colon)

Where our connections to the databases are made in 'db/connection.js', the suitable database will be chosen. If running tests using jest nc_news_test will be chosen, else nc_news will be chosen.