# stock-correlation

To run for the first time (this includes generation of the mongodb collections for the NYSE and NASDAQ Stock symbols):

1) Make sure you have a running instance of mongodb at port 27017 (the default)
2) Create a DB 'stock' (The command 'use stock' from a mongodb shell will do this)
3) 'npm install'
4) 'node index.js --generate'

For any future times running the script, use:

1) node index.js
