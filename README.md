## Hosted on Heroku
https://crypto-bull.herokuapp.com/

## Application Features
Track your portfolio or favorite coins and see how each is doing. Flip to the news tab and see recent and relevant news articles covering the space.

## Technologies Used
Node.js, Express and MongoDB are used for my backend. I have .ejs files as my frontend template. There is an ajax API call to get the news articles, and an axios API call to coinmarketcap to get my cryptocurrency data.

## Installation Steps
Clone down the repository, run npm install, get the DB going by running $ mongod in the terminal, and in another tab start the server with the $ nodemon command. Go to your localhost:3000 and the app will be set up.

## Future Development
* Sort by market cap, price, % change in a day
* Change time frame between 1d, 7d, 1m, 3m, YTD, 1y
* Implement pagination
* View page for each coin with a graph of % price change over time frame
* Trading simulator for interested investors to track pretend investments / portfolio

<img src="https://user-images.githubusercontent.com/34493689/40591502-5dc665e0-61c7-11e8-80f9-222898b49028.png" alt="img of app" width="800" />
