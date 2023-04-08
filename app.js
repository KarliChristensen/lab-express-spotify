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

// ------------- Retrieve access token  ------------- //

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// ------------- Routs go here ------------- //

app.get("/", (req, res) => res.render(__dirname + "/views/index.hbs"));

app.get("/artist-search", (req, res) => {
  console.log(`This artist: ${req.query.artist}`);
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const artists = data.body.artists;
      res.render("artist-search-results", artists);
    })
    .catch((err) =>
      console.log("The following error ocurred while searching: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      res.render("albums", data.body);
    })
    .catch((err) => console.log("The following error occured: ", err));
});

app.get("/tracks/:albumId", (req, res) => {
  tracksId = req.params.albumId;
  console.log(tracksId);
  spotifyApi
    .getAlbumTracks(tracksId)
    .then((data) => {
      res.render("tracks", data.body);
    })
    .catch((err) => console.log("The following error has occured ", err));
});

// ------------- Search results ------------- //

app.get("/artists-search-results", (req, res) =>
  res.render(__dirname + "/views/artist-search-results.hbs")
);

// ------------- Listening ------------- //

app.listen(3000, () => console.log("Spotify running on port 3000"));
