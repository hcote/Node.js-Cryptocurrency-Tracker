## Hosted on Heroku
https://mighty-taiga-62216.herokuapp.com/

## Application Features
This app's goal is to be your go-to if you ever want to check in on the cryptocurrency market. Add currencies to your portfolio or favorites tab, and see how each is doing. Flip to the news tab and see recent and relevant news articles covering the space.

## Technologies Used
Node.js, Express and MongoDB are used for my backend. I have .ejs files to render my frontend.  There is an ajax API call to get the news articles, and an axios API call to coinmarketcap to get my cryptocurrency data.

## Installation Steps
Clone down the repository, run npm install, get the DB going by running mongod in the terminal, and in another tab get the server going. Go to your local host address and the app will be set up.

## User Stories
Most similar applications today on the web do a good job at a few things, but there seems to be a lack of one go-to app that has everything you want - so you don't need accounts or to be checking different sites for this information.

## Existing Issues
* Limited to top 100 currencies on coinmarketcap
* Each time the home page refreshes, it creates another 100 coins, rather than updating the existing ones in the DB

## Future Development
* Rather than relying on coinamrketcap's limited (top 100 coins) API data, make API calls to the top exchanges to get their data - then average out their prices
  * Then allow visiters to sort coins by exchange, and see which coins are on which exchanges
* Green text if price is up for the day, red if it's down
* Sort by market cap, price, % change in a day
* Change time frame between 1d, 7d, 1m, 3m, YTD, 1y
* Pagination
* Auto-refreshing prices every 30 seconds
* Refactor to react.js for frontend
* Loading icons between screens
* View page for each coin with a graph of % price change over time frame
* Portfolio page has a dynamic graph showing them their portfolio value over time
* View for mobile
* Sign up for notification if price exceeds present condition
* Insights/analysis tab with info TBD that can help identify trends and guide smart investing strategies
* Trading simulator for young and interested investors to track pretend investments / portfolio
* App visitor can filter coins (ICO - y/n, privacy coin, ERC20, mineable, hashing algorithm, exchanges it is on)
