var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();

app.use(cors());

const API_KEY = "RGAPI-fda3d542-3411-4f40-af07-8422a6f181bb";

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
    const matches = await getLastSummonerGames(summonerPuuid);

    let matchDataArray = [];

    if(Array.isArray(matches) && matches !== []) {
        for(var i = 0; i < matches.length -15; i++) {
            const matchID = matches[i];
            const matchData = await axios.get("https://europe.api.riotgames.com/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
                .then(response => response.data)
                .catch(err => err);
            matchDataArray.push(matchData);
        }
    }

    res.json(matchDataArray);
});

app.get('/winrateLast20Games', async (req, res) => {
    const summonerPuuid = await getSummonersPuuid(req.query.username);
    const matches = await getLastSummonerGames(summonerPuuid);
    let totalWins = 0;
    let winrate = 10.0;
    let matchDataArray = [];

    if(Array.isArray(matches) && matches !== []) {
        for(var i = 0; i < matches.length; i++) {
            const matchID = matches[i];
            const matchData = await axios.get("https://europe.api.riotgames.com/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
                .then(response => response.data)
                .catch(err => err);
            matchDataArray.push(matchData);
        }
    }
    
    if(matchDataArray.length !== 0) {
        matchDataArray.map((gameData, index) => {
            gameData.info?.participants?.map((data, participantsIndex) => {
                if(data.puuid === summonerPuuid) {
                    if(data.win) {
                        totalWins++;
                    }
                }
            })
        });
    }

    winrate = totalWins / matchDataArray.length;

    res.json(winrate);
});

app.listen(4000, function () {
    console.log("Server started on port 4000");
}) //localhost:4000






