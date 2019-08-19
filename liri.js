require("dotenv").config();
var fs = require("fs");
var keys = require("./keys");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var mediaInfo = process.argv.slice(3).join(" ");

//function that reads the user input and executes the correct command
var liriStart = (command, mediaInfo) => {
  switch (command) {
    case "movie-this":
      movieThis(mediaInfo);
      break;
    case "concert-this":
      concertThis(mediaInfo);
      break;
    case "spotify-this-song":
      spotifyThis(mediaInfo);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log(
        `\nWelcome to Liri! Here are the commands that you can execute:\n \n 1) movie-this <option movie title>\n 2) concert-this <option artist name>\n 3) spotify-this-song <optional song title>\n 4) do-what-it-says\n`
      );
  }
};

//command that shows movie data
var movieThis = mediaInfo => {
  !mediaInfo
    ? (console.log(
        `\nI see you didn't include a movie to search. Here's my favorite movie:`
      ),
      (mediaInfo = "Mr Nobody"))
    : (mediaInfo, console.log(`\nYou Searched: ${mediaInfo}`));
  axios
    .get(`http://www.omdbapi.com/?t=${mediaInfo}&y=&plot=short&apikey=trilogy`)
    .then(function(response) {
      var movie = response.data;
      console.log(
        `\nTitle: ${movie.Title}\n\nRelease Year: ${movie.Year}\nIMDB Rating: ${
          movie.imdbRating
        }\nRotten Tomatoes Rating: ${movie.Ratings[1].Value}\nLocation: ${
          movie.Country
        }\nLanguage: ${movie.Language}\nCast: ${movie.Actors}\n\nSynopsis: ${
          movie.Plot
        }\n`
      );
    });
};

//command that find the next 3 shows an artist has booked
var concertThis = mediaInfo => {
  !mediaInfo
    ? (console.log(
        `\nI see you didn't search for an artist's tour dates. Here's Ladygaga's next 3 shows:\n`
      ),
      (mediaInfo = "Ladygaga"))
    : (mediaInfo, console.log(`\n${mediaInfo}'s next three shows:\n`));

  axios
    .get(
      `https://rest.bandsintown.com/artists/${mediaInfo}/events?app_id=codingbootcamp`
    )

    .then(function(response) {
      let shows = response.data;
      for (i = 0; i < 3; i++)
        console.log(
          `Venue: ${shows[i].venue.name}\nLocation: ${
            shows[i].venue.city
          }\nDate: ${moment(shows[i].datetime).format("MM/DD/YYYY")}\n`
        );
    });
};

//command that searches Spotify for a specific song
const spotifyThis = mediaInfo => {
  !mediaInfo
    ? (console.log(
        `\nI see you didn't choose a song. Here's one of my favorites: `
      ),
      (mediaInfo = "The sign by Ace of Base"))
    : mediaInfo;

  spotify.search({ type: "track", query: mediaInfo }, function(err, data) {
    if (err) {
      return console.log(`Error occurred: ${err}`);
    }
    let song = data.tracks.items;
    console.log(
      `\nYou Searched: ${mediaInfo}\n\nArtist: ${
        song[0].artists[0].name
      }\nSong: ${song[0].name}\nAlbum: ${song[0].album.name}\nPreview: ${
        song[0].preview_url
      }\n`
    );
  });
};

//command that reads from the random.txt file
var doWhatItSays = () => {
  fs.readFile("random.txt", "utf8", function(err, data) {
    let randomThing = data.split(",");
    mediaInfo = randomThing[1];
    console.log(`\nI WANT THAT WAY: \n`);
    spotifyThis(mediaInfo);
  });
};

liriStart(command, mediaInfo);