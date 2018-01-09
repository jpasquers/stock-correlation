# stock-correlation

To run for the first time (this includes generation of the mongodb collections for the NYSE and NASDAQ Stock symbols):

1) You will need the following environment variables set
  a) ALPHA_APIKEY -> get an apikey from https://www.alphavantage.co/support/#api-key
  b) ALPHA_QUERY_URL -> set to https://www.alphavantage.co/query
2) Make sure you have a running instance of mongodb at port 27017 (the default)
3) Create a DB 'stock' (The command 'use stock' from a mongodb shell will do this)
4) 'npm install'
5) 'node index.js --generate'

For any future times running the script, use:

1) node index.js
