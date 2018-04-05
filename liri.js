require("dotenv").config();

var keys = require("./keys.js");
var fs = require('fs');
var request = require('request');

//Spotify require
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


//Twitter require
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);


//command line arguments
var args = process.argv;
var command = args[2];

var input = "";
for (var i = 3; i < args.length; i++) {
    input += args[i] + " ";
}

function processInput() {
    switch (command) {
        case 'my-tweets':
            tweet();
            break;
        case 'spotify-this-song':
            songInfo(input);
            break;
        case 'movie-this':
            movie(input);
            break;
        case 'do-what-it-says':
            randomInfo();
            break;
        default:
            console.log("Please enter a valid command. The choices are: \n my-tweets\n spotify-this-song\n movie-this\n do-what-it-says");
            break;
    }
}


// my-tweets

function tweet() {
    console.log("show last 20 tweets");
    var params = { screen_name: 'Billywaynec1', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            var output = "MY TWEETS: \n";
            tweets.forEach(element => {
                output += element.text + '\n' + element.created_at + '\n\n';
            }
            );
            console.log(output);
        }
        else
            return error;
    });
}


// spotify-this-song

function songInfo(songName) {

    if (songName === "") {
        songName = "Numb";
    }
    spotify.search({ type: 'track', query: songName, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var searchedSong = "SPOTIFY THIS SONG: " + songName + "\n";
        data.tracks.items.forEach(element => {
            //console.log(element);
            var artistNames = "";

            for (var i = 0; i < element.artists.length; i++) {
                if (i !== 0) artistNames += ", ";
                artistNames += element.artists[i].name;
            }

            searchedSong += "Artist(s): " + artistNames + '\n';

            searchedSong += "Song Title: " + element.name + '\n';

            searchedSong += "Preview Link: " + element.preview_url + '\n';

            searchedSong += "Album: " + element.album.name + '\n\n';

        });

        console.log(searchedSong);
    });
}


//  movie-this

function movie(movieName) {

    if (movieName === "") {
        movieName = "Mr.Nobody";
        return;
    }

    // OMDB API
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            // console.log(movie);
            console.log("Title: " + movie.Title);
            console.log("Release Year: " + movie.Year);
            console.log("IMdB Rating: " + movie.imdbRating);
            console.log("Country: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);

        }
        else {
            console.log(response);
        }
    });
}


//  do-what-it-says

function randomInfo() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        console.log("Processing do what it says...");
        if (error) return error;

        //console.log(data);
        var dataArr = data.split(",");
        command = dataArr[0];
        input = dataArr[1];
        processInput();
    });
}

processInput();