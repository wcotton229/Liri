//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter(keys.twitterKeys);
var fs = require('fs');

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length) {
        x = x + "+" + nodeArgv[i];
    } else {
        x = x + nodeArgv[i];
    }
}

//switch case
switch (command) {
    case "my-tweets":
        showTweets();
        break;

    case "spotify-this-song":
        if (x) {
            spotifySong(x);
        } else {
            spotifySong("Fluorescent Adolescent");
        }
        break;

    case "movie-this":
        if (x) {
            omdbData(x)
        } else {
            omdbData("Mr. Nobody")
        }
        break;

    case "do-what-it-says":
        doThing();
        break;

    default:
        console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
        break;
}

function showTweets() {
    //Display last 20 Tweets
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
                logThis(output);
            }
            else
                return error;
        });
    }

    function spotifySong(song) {
        spotify.search({ type: 'track', query: song }, function (error, data) {
            if (!error) {
                for (var i = 0; i < data.tracks.items.length; i++) {
                    var songData = data.tracks.items[i];
                    //artist
                    console.log("Artist: " + songData.artists[0].name);
                    //song name
                    console.log("Song: " + songData.name);
                    //spotify preview link
                    console.log("Preview URL: " + songData.preview_url);
                    //album name
                    console.log("Album: " + songData.album.name);
                    console.log("-----------------------");
                }
            } else {
                console.log('Error occurred.');
            }
        });
    }

    function omdbData(movie) {
        var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true';

        request(omdbURL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var body = JSON.parse(body);

                console.log("Title: " + body.Title);
                console.log("Release Year: " + body.Year);
                console.log("IMdB Rating: " + body.imdbRating);
                console.log("Country: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);
                console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                console.log("Rotten Tomatoes URL: " + body.tomatoURL);

            } else {
                console.log('Error occurred.')
            }
            if (movie === "Inception") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Inception,' then you should: http://www.imdb.com/title/tt0485947/");

            }
        });

    }

    function doThing() {
        fs.readFile('random.txt', "utf8", function (error, data) {
            var txt = data.split(',');

            spotifySong(txt[1]);
        });
    };
};