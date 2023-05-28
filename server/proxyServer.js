var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();

app.use(cors());

const API_KEY = "RGAPI-3e301ea5-16e4-4822-a03a-da36cc2a55ca";

function searchForPlayer(summonerName) {
    // Set up the correct API call
    let APICallString = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key="  + API_KEY;
    // Handle the API call
    return axios.get(APICallString).then(function (response) {
        // Success
        return response.data;
    }).catch(function (error) {
        // Error
        console.log(error);
    });
}

function getSummonersPuuid(summonerName) {
    let APICallString = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key="  + API_KEY;

    return axios.get(APICallString).then(function (response) {
        console.log(response.data);
        return response.data.puuid;
    }).catch(function (error) {
        console.log(error);
    });
}

function getLastSummonerGames(puuid) {
    let APICallString = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids" + "?api_key="  + API_KEY;

    return axios.get(APICallString).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
}

// GET summoner by name
// localhost:4000/summonername
app.get('/summonername', async (req, res) => {
    const playerData = await searchForPlayer(req.query.username);

    res.json(playerData);
});

// GET summoners last 5 games
// localhost:4000/last5games
app.get('/last5games', async (req, res) => {
    const summonerPuuid = await getSummonersPuuid(req.query.username);
    console.log(summonerPuuid);
    const matches = await getLastSummonerGames(summonerPuuid);

    res.json(matches);
});

app.listen(4000, function () {
    console.log("Server started on port 4000");
}) //localhost:4000






