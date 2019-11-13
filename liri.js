require("dotenv").config();
const axios = require("axios");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);
const moment = require('moment')

const commandChoice = function() {
  let input = process.argv;
  let searchVal = input.slice(3).join(" ").trim();
  switch (input[2]) {
    case "concert-this":
      findConcert(searchVal);
      break;
    case "spotify-this-song":
      findSong(searchVal);
      break;
    case "movie-this":
      findMovie(!!searchVal ? searchVal : 'mr nobody');
      break;
    case "do-what-it-says":
      doWhatItSays(searchVal);
      break;
    default:
      console.log(
        "Am I supposed to just magically understand what you want me to do?"
      );
  }
};

const findConcert = function(artist) {
  if (artist === "") {
    console.log("Please enter an artist or band");
  } else {
    let wordArray = artist.split(" ");
    let queryString = wordArray[0];

    for (let i = 1; i < wordArray.length; i++) {
      queryString += "+" + wordArray[i];
    }

    const URL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;

    axios.get(URL).then(function(response) {
      const jsonData = response.data;
      

      for (let i = 0; i < jsonData.length; i++) {
        const date = jsonData[i].datetime
      const convertedDate = moment(date).format("DD-MMM-YYYY")
        const showData = `
        Name of venue: ${jsonData[i].venue.name}
        Venue location: ${jsonData[i].venue.city}
        Date of event: ${convertedDate}
        -----------------------------------------
        `;
        console.log(showData);
      }
    });
  }
};

const findSong = function(song) {
  if (song === "") {
    song = "The Sign";
  }

  spotify.search({ type: "track", query: song }, function(err, res) {
    if (err) {
      console.error(err);
    }

    let songArray = res.tracks.items;
    for (let i = 0; i < songArray.length; i++) {
      console.log(i + ":");
      console.log("Artist(s): " + songArray[i].album.artists[0].name);
      console.log("Song name: " + songArray[i].name);
      console.log("Preview song: " + songArray[i].preview_url);
      console.log("Album: " + songArray[i].album.name);
      console.log("-----------------------------------");
    }
  });
};

const findMovie = function(movie) {
  const url =
    "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.get(url).then(function(response) {
    const result = response.data;
    const showData = `
        Title: ${result.Title}
        Year: ${result.Year}
        IMDB Rating: ${result.imdbRating}
        Rotten Tomatoes Rating: ${result.Ratings[1].Value}
        Country produced: ${result.Country}
        Language: ${result.Language}
        Plot: ${result.Plot}
        Actors: ${result.Actors}
        `;
    console.log(showData);
  });
};

const doWhatItSays = function(command) {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.error(error);
    }

    let dataArr = data.split(',')

    findSong(dataArr[1])
  });
};

commandChoice();
