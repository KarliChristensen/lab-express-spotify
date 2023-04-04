require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// ------------- Spotify-web-api-node package here:  ------------- //
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// ------------- Spotify-api goes here  ------------- //
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// ------------- Retrieve an access token  ------------- //
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body.access_token))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// ------------- Routs go here ------------- //
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.hbs"));
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) => console.log("The search threw the following error: ", err));
});

// ------------- Search results ------------- //
app.get("/artists-search-results", (req, res) =>
  res.sendFile(__dirname + "/views/search-results.hbs")
);
app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
});

app.listen(3000, () => console.log("Spotify running on port 3000"));
