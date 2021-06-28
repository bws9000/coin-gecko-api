var express = require("express");
var app = express();

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

var timestamp = Math.floor(Date.now() / 1000);
var timerStarted = false;
var btcEthData = {};
var apiCallInterval = 60000;

var btcEth = async () => {
    return await CoinGeckoClient.simple.price({
        ids: ['bitcoin', 'ethereum'],
        vs_currencies: ['eur', 'usd'],
    });
}

app.get("/btc-eth-price", async (req, res, next) => {
    if (!timerStarted) {
        setTimeout(async function () {
            btcEthData = await btcEth();
            timestamp = Math.floor(Date.now() / 1000);
            timerStarted = false;
        }, apiCallInterval);
        timerStarted = true;
    }
    let response = new Object();
    response.timestamp = timestamp;
    response.data = btcEthData;
    res.json(response);
});

app.listen(3002, async () => {
    btcEthData = await btcEth();
});
