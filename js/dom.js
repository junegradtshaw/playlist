// Eventually do the document ready wrapper for whole js file.

// API String
var APIStringGet = "https://lit-fortress-6467.herokuapp.com/object";
var APIStringPost = "https://lit-fortress-6467.herokuapp.com/post";

// Data to post
// jsonString = "{"results":[{"id":2,"title":"Ghost in the Machine","artist":"The Police","cover_art":"ghost_in_the_machine.jpg"},{"id":6,"title":"Red","artist":"Black Uhuru","cover_art":"red.jpg"},{"id":22,"title":"The Division Bell","artist":"Pink Floyd","cover_art":"the_division_bell.jpg"},{"id":18,"title":"Thriller","artist":"Michael Jackson","cover_art":"thriller.jpg"},{"id":55,"title":"21","artist":"Adele","cover_art":"21.jpg"}]}";

var jsonObject = {
        "id": 13,
		    "title": "Buffalo Soldier",
		    "artist": "Bob Marley",
		    "cover_art": "bestOfBobMarley.jpg"};
// CLICKABLES

// If user clicks choose tracks, open playlist page.
$('#chooseTracks').click(function () {
  window.open("file:///Users/June/Workspace/playlist/public/tracks.html");
});

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
function initAPIPost (APIString) {
  var getter = $.ajax({
  url: APIStringPost,
  type: "POST",
  data: jsonObject})

  // Successful get
  getter.done(processAPIPost);

  // Failed get
  getter.fail(function () {
    console.log("Failed API");
  });
};

// Process API get
function processAPIGet(response) {

  var numAlbumsNeeded = 3;

  // Get an array of 3 album covers based on the response.
  var arrAlbumCovers = getAlbumCovers(numAlbumsNeeded, response["results"]);
};

//Get an array of random album covers. albumAvailArray is the JSON format array.
function getAlbumCovers(numAlbumsNeeded, albumAvailArray) {

  //Initialize the return array
  var albumCovers = [];
  var numAlbumsAvail = albumAvailArray.length;

  //For each album cover needed, until we have the number needed.
  var numAlbum = 1;
  while ((albumCovers.length < numAlbumsNeeded) && (numAlbum <= numAlbumsNeeded+1)) {

  // Get a random number within the number of albums we have available.
  // Number returned will be 0 to numAlbumsNeeded -1,
  // to index the albumAvailArray correctly.
    var randomNumber = Math.floor((Math.random() * albumAvailArray.length) + 1) -1;

    //Check that this album has not already been randomly chosen
    var filteredArray = [];
    filteredArray = albumCovers.filter (function (element) {
      return (element === albumAvailArray[randomNumber]["cover_art"]);
    });

    //If the filtered array of the same number returned nothing (not a duplicate)
    if (filteredArray.length === 0) {

      //This is a new album cover, so push it to our album cover array.
      albumCovers.push(albumAvailArray[randomNumber]["cover_art"]);
      numAlbum++;
    }

    //Look at the next album.
  };


  for (var i = 0; i < albumCovers.length; i++) {
    var id = "splashImage" + i;
    // $( "img" ).attr( "src", function() {
    $('#'+id).attr( "src", "images/"+albumCovers[i]);

    // $('#'+id).src = albumCovers[i];
  }
  // return (albumCovers);
};

// Process API post
function processAPIPost(response) {
  console.log(response);
};

// Initialize the API
function readyFunction () {
  initAPIGet(APIStringGet);
  initAPIPost(APIStringPost);
};

// When document is ready, call the ready function
$(document).ready (readyFunction);
