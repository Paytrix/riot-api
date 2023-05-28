'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function Body() {
    const [searchText, setSearchText] = useState("");
    const [playerData, setPlayerData] = useState({});
    const [matches, setMatches] = useState([]);
    const API_KEY = "RGAPI-3e301ea5-16e4-4822-a03a-da36cc2a55ca";
  
    function searchForPlayer(event) {
        axios.get("http://localhost:4000/summonername", {params: { username: searchText }})
          .then(function (response) {
            setPlayerData(response.data);
          }).catch(function (error) {
            console.log(error);
          });

        axios.get("http://localhost:4000/last5games", {params: { username: searchText }})
          .then(function (response) {
            setMatches(response.data);
          }).catch(function (error) {
            console.log(error);
          });
    }
  
    return (
      <div className="App">
        <div className="container"> 
          <h5>League of Legends Player Searcher</h5>
          <input type="text" onChange={e => setSearchText(e.target.value)}></input>
          <button onClick={e => searchForPlayer(e)}>Search for player</button>
        </div>
        {JSON.stringify(playerData) != '{}' ? 
            <>
                <p>{playerData.name}</p>
                <img width="100" height="100" src={"http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/" + playerData.profileIconId + ".png"}></img>
                <p>Summoner level {playerData.summonerLevel}</p>
            </> 
            : 
            <><p>No player data</p></>
        }
        {matches.length !== 0 ?
          <>
            <p>We have data!</p>
          </>
        :
          <>
            <p>We have NO data!</p>
          </>
        }
      </div>
    )
  }