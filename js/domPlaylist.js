// // When document is ready, call the ready function
$(document).ready (readyFunction);

// Global variable holding JSON response.
var albumTracks;

// API String
var APIStringGet = "https://lit-fortress-6467.herokuapp.com/object";
var APIStringPost = "https://lit-fortress-6467.herokuapp.com/post";

// Data to post
// jsonString = "{"results":[{"id":2,"title":"Ghost in the Machine","artist":"The Police","cover_art":"ghost_in_the_machine.jpg"},{"id":6,"title":"Red","artist":"Black Uhuru","cover_art":"red.jpg"},{"id":22,"title":"The Division Bell","artist":"Pink Floyd","cover_art":"the_division_bell.jpg"},{"id":18,"title":"Thriller","artist":"Michael Jackson","cover_art":"thriller.jpg"},{"id":55,"title":"21","artist":"Adele","cover_art":"21.jpg"}]}";

//offline below

// var response = JSON.parse('"{"results":[{"id":2,"title":"Ghost in the Machine","artist":"The Police","cover_art":"ghost_in_the_machine.jpg"},{"id":6,"title":"Red","artist":"Black Uhuru","cover_art":"red.jpg"},{"id":22,"title":"The Division Bell","artist":"Pink Floyd","cover_art":"the_division_bell.jpg"},{"id":18,"title":"Thriller","artist":"Michael Jackson","cover_art":"thriller.jpg"},{"id":55,"title":"21","artist":"Adele","cover_art":"21.jpg"}]}"');

// processAPIGet(response);
//offline above

//
// var jsonObject = {
//         "id": 13,
// 		    "title": "Buffalo Soldier",
// 		    "artist": "Bob Marley",
// 		    "cover_art": "bestOfBobMarley.jpg"};

// CLICKABLES

// Process the click of an image.
$(document).on("click", ".playlistImage",
function() {

  // Get the matching artist and title for the image's id number.
  // var albumId = this.parentNode.attr("id");
  var albumId = $(this.parentNode).attr("id");
  var artist;
  var title;

  //Cycle through the albums and find the matching id.
  for (var i = 0; i < albumTracks.length; i++) {
    if (albumTracks[i].id == albumId) {

      //Get the artist and title
      var artist = albumTracks[i].artist;
      var title = albumTracks[i].title;

    }
  }

  // Now that we have the album's info,
  // make sure the newly selected album is not already on the playlist.
  var allAlbums=$('#playlistTitles');
  var foundMatch = false;
  var playlistTitleChildren = allAlbums.children();

  for (var i = 0; i < playlistTitleChildren.length; i++) {
    if (playlistTitleChildren[i].data.id == albumId) {
        foundMatch = true;
    }
  };

  // If that track isn't already in the playlist,
  // then append the artist and title to the container of
  // results.  Store the album id as the arbitrary data
  // of the new container element.
  if (!foundMatch) {
    var albumNode = document.createElement("p");
    albumNode.innerHTML = artist + ': ' + title;
    albumNode.data = {"id":albumId, "artist":artist, "title":title};
    allAlbums.append(albumNode);

  }
});

// When the user clicks the empty button,
// we will empty the container.
$(document).on("click", "#clearButton", emptyDiv);

// Empty the results container of all prior picks for a playlist.
function emptyDiv() {

  // Get all the playlist titles added to the container.
  var allAlbums = $('playlistTitles').children();

  //Iterate through the playlist title and remove each child, or album.
  var album = allAlbums.firstChild;
  while( album ) {
      allAlbums.removeChild(album);
      album = allAlbums.firstChild;
  }

  // Empty out any associated leftover elements for the albums that
  // were just deleted.
  $('#playlistTitles').empty();

};

// When the user clicks submit, post the query
// of those playlist articles to the API.
$(document).on("click", "#submitButton", createPlaylist);

// Submit the playlist to the API
function createPlaylist() {

  // Initialize the JSON data to post to the API for the new playlist.
  var album = {};
  album.results = [];

  // For each string in the playlist container,
  // crete a JSON object and push it to an array to
  // make an API post.
  var albumResultsIndex = 0;

  var allAlbums = $('#playlistTitles').children();
  for (var i = 0; i < allAlbums.length; i++) {

    // Create a new object for the JSON package.
    var albumId = allAlbums[i].id;
    var albumArtist = allAlbums[i].artist;
    var albumTitle = allAlbums[i].title;
    album.results.push(
      {id: albumId,
      artist: albumArtist,
      title: albumTitle});
  };

  // Post the playlist to the API.
  initAPIPost (APIStringPost, album);

  //Empty the container to start over.
  emptyDiv();
};

// Create an object with artist and title
function createPlaylistObject(artist, title) {
  var playlistObject = {"artist": artist, "title": title};
  return(playlistObject);
}

// Initialize the API
function initAPIGet (APIString) {
  var getter = $.ajax({
  url: APIString,
  method: "GET",
  dataType: "json"});

  // Successful get
  getter.done(processAPIGet);

  // Failed get
  getter.fail(function () {
    console.log("Failed API");
  });
};

// Initialize the API
function initAPIPost (APIString, jsonObject) {
  var getter = $.ajax({
    url: APIString,
    type: "POST",
    data: JSON.stringify(jsonObject),
    contentType: "application/json"
  });

  // Successful get
  getter.done(processAPIPost);

  // Failed get
  getter.fail(function () {
    console.log("Failed API");
  });
};

// Process API get
function processAPIGet(response) {

  // Save JSON of track information
  albumTracks = response.results;

  //Empty last playlist selections.
  emptyDiv();

  // Populate album gallery.
  fillPlaylistGallery(response);

};

function fillPlaylistGallery (response) {

  // Get the array of objects from the response
  var arrayAlbums = response["results"];

  //Go through each object in the response array
  for (var i = 0; i < arrayAlbums.length; i++) {

    //Build an id for the div picture
    var idAlbumCover = arrayAlbums[i]["id"];

    // Build the HTML string for the album art div.
    var htmlStringDiv = "<div id = " + idAlbumCover + "> </div>"

    // Append the picture to the gallery.
    $('#albumGallery').append(htmlStringDiv);

    // Build the HTML string for the album art itself.
    var htmlStringImg ="<img class = playlistImage src= images/" + arrayAlbums[i]["cover_art"] + " alt = Gallery pic #" + i + ">";

    // Append the album art to that new div.
    $('#'+idAlbumCover).append(htmlStringImg);
  }
};

// Process API post
function processAPIPost(response) {
  console.log(response);
};

// Initialize the API
function readyFunction () {
  initAPIGet(APIStringGet);
};
