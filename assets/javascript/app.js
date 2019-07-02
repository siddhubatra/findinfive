$(document).ready(function () {
  $(".carousel").carousel();
  $('#run').on('click', go);
  $("#initial-hide").hide();
  $("#timeUpDiv").hide();
});

$("#run").on("click", function () {
  $("#splash").hide();
  $("#initial-hide").show();
});

//This section for Ajax Calls
var randomIndex = Math.floor(Math.random() * 10);
var movieArray = [];
var netflixMovies = [];
var netflixMoviesDuplicate;
var genre;
var startYear;
var endYear;
$("#platform").hide();
$("#progressMessage").hide();
$("#progressBar").hide();
$("#submit2").hide();
$("#submit3").hide();
$(".genre").on("click", function () {
  genre = $(this).attr("id");
  console.log(genre);
});

$(".year").on("click", function () {
  startYear = parseInt($(this).attr("id"));
  endYear = startYear + 9;
  console.log(startYear);
  console.log(endYear);
});

$("#submit1").on("click", function (event) {
  event.preventDefault();
  for (var i = 1; i < 6; i++) {
    var queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=3c08d2c0cdfa9dd48041ef2cdea4b2f3&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" + i + "&release_date.gte=" + startYear + "&release_date.lte=" + endYear + "&with_genres=" + genre;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      for (i = 0; i < 20; i++) {
        movieArray.push(response.results[i].title);
      }
    });
  }
  console.log(movieArray);
  $("#submit1").hide();
  $("#progressMessage").text("Generating movies based on your request...");
  $("#progressMessage").show();
  $("#progressBar").show();
  setTimeout(showSubmit2, 2000);
});

function showSubmit2() {
  $("#submit2").show();
  $("#progressMessage").hide();
  $("#progressBar").hide();
}

$("#submit2").on("click", function () {
  var queryURL;
  for (var i = 0; i < 100; i++) {
    queryURL = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + movieArray[i] + "&country=us";
    $.ajax({
      url: queryURL,
      method: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("X-RapidAPI-Host", "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com");
        xhr.setRequestHeader("X-RapidAPI-Key", "d9f5020bf5msh750d2aa0c867c03p1c6d01jsneb02922e33b5");
      }
    }).then(function (response) {
      for (var i = 0; i < response.results[0].locations.length; i++) {
        if (response.results[0].locations[i].display_name == "Netflix") {
          var movieData = { name: response.results[0].name, picture: response.results[0].picture, url: response.results[0].locations[i].url };
          netflixMovies.push(movieData);
        }
      }
    });
  }
  console.log(netflixMovies);
  $("#submit2").hide();
  $("#progressMessage").text("Finding movies available on Netflix...");
  $("#progressMessage").show();
  $("#progressBar").show();
  setTimeout(showSubmit3, 2500);

});

function showSubmit3() {
  $("#submit3").show();
  $("#progressMessage").hide();
  $("#progressBar").hide();
}

$("#submit3").on("click", function () {
  $("#submit3").hide();
  $("#submit1").show();
  $("#platform").show();
  for (var i = 1; i < 11; i++) {
    var posterName = "poster-" + i;
    var titleName = "title-" + i;
    var linkName = "link-" + i;
    console.log("inside for loop");
    $("#" + posterName).attr("src", netflixMovies[i - 1].picture).attr("max-width", "300px");
    $("#" + titleName).text(netflixMovies[i - 1].name);
    $("#" + linkName).attr("href", netflixMovies[i - 1].url);
    $("#" + linkName).text("Link to film");

  }
  movieArray = [];
  netflixMoviesDuplicate = netflixMovies.slice(0);
  netflixMovies = [];
});

// This Section for Timer
var intervalId;
var clockRunning = false;
var time = 300;

function go() {
  if (!clockRunning) {
    intervalId = setInterval(count, 1000);
    clockRunning = true;
  }
}

function stop() {
  clearInterval(intervalId);
  clockRunning = false;

}

function count() {
  if (time === 0) {
    stop();
    setTimeout(redirect, 3000);
    $("#initial-hide").hide();
    $("#timeUpDiv").show();
    $("#finalMoviePic").attr("src", netflixMoviesDuplicate[randomIndex].picture).attr("width", "350px");
    $("#finalMovieName").text(netflixMoviesDuplicate[randomIndex].name);
  } else {
    time--;
    var converted = timeConverter(time);
    // console.log(converted);
    $('#timer').text(converted);
  }
}

function timeConverter(t) {
  var minutes = Math.floor(t / 60);
  var seconds = t - minutes * 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  if (minutes === 0) {
    minutes = '00';
  } else if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return minutes + ':' + seconds;
}
function redirect() {
  window.location = netflixMoviesDuplicate[randomIndex].url;
}