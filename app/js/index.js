var request = require("request");
var imgur = require('imgur-node-api');
var path = require('path');
var gui = require('nw.gui');
var win = gui.Window.get();
api_status();
$("body").on("click", "a.ex", function () {
    var href = $(this).attr('href');
    gui.Shell.openExternal(href);
    return false;
});

$("#search").click(function () {
    $('#autocomplete').fadeOut('fast');
    showloader();
    var title = $('#movie_search').val();
    if (title == "") {
        hideloader();
        errormsg("Please enter a movie");
    } else {
        getmovie(title);
    }

});

$("#movie_search").keyup(function () {
    var title = $('#movie_search').val();
    var toid = title.substr(0, 2);
    if (toid !== 'tt') {
        if (title.length > 3) {
            $('.load_icon').fadeIn('fast');
            apisearch(title);
        }
    };
});

$("#autocomplete ul").on("click", "li", function () {
    var movieID = $(this).attr("rel");
    $('#movie_search').val(movieID);
    $("#autocomplete").fadeOut('fast');
});

$("#modalFooter li#mpreview").click(function () {
    $('#modalHeader').html("Preview");
    $('#modalFooter li').removeClass('active');
    $(this).addClass('active');
    if ($('#bbcode').is(":visible")) {
        $( "#bbcode" ).fadeOut( "fast", function() {
            $('#preview').fadeIn('fast');
        });
    } else if ($('#html').is(":visible")) {
        $( "#html" ).fadeOut( "fast", function() {
            $('#preview').fadeIn('fast');
        });
    };
});

$("#modalFooter li#mbbcode").click(function () {
    $('#modalHeader').html("BBCode");
    $('#modalFooter li').removeClass('active');
    $(this).addClass('active');
    if ($('#preview').is(":visible")) {
        $( "#preview" ).fadeOut( "fast", function() {
            $('#bbcode').fadeIn('fast');
        });
    } else if ($('#html').is(":visible")) {
        $( "#html" ).fadeOut( "fast", function() {
            $('#bbcode').fadeIn('fast');
        });
    };
});

$("#modalFooter li#mhtml").click(function () {
    $('#modalHeader').html("HTML");
    $('#modalFooter li').removeClass('active');
    $(this).addClass('active');
    if ($('#preview').is(":visible")) {
        $( "#preview" ).fadeOut( "fast", function() {
            $('#html').fadeIn('fast');
        });
    } else if ($('#bbcode').is(":visible")) {
        $( "#bbcode" ).fadeOut( "fast", function() {
            $('#html').fadeIn('fast');
        });
    };
});

function hideloader() {
    $('#loading_container').animate({
        left: '-40%'
    }, 500);
    $('#loading_bg').fadeOut('slow');
}

function showloader() {
    $('#loading_text').html("Loading");
    $('#loading_container').animate({
        left: '35%'
    }, 500);
    $('#loading_bg').fadeIn('slow');
}

function apisearch(title) {
    var title = title;
    var url = "http://omdbapi.com/?s=" + title;

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            if (body.Error) {

            } else {
                $("#autocomplete ul").html(" ");
                $.each(body.Search, function (idx, obj) {
                    $("#autocomplete ul").append('<li rel="' + obj.imdbID + '">' + obj.Title + ' (' + obj.Year + ')</li>');
                    $('#autocomplete').fadeIn('fast');
                    $('.load_icon').fadeOut('fast');
                });
            }
        }
    })
}

function errormsg(msg) {
    var msg = msg;
    $('#error').html(msg);
    $('#error').slideDown('slow', function () {
        $("#error").delay(3000).slideUp('slow');
    });
}

function getmovie(title) {
    var title = title;
    var toid = title.substr(0, 2);
    $('#loading_text').html("fetching movie");
    if (toid == 'tt') {
        var url = "http://omdbapi.com/?i=" + title;
    } else {
        var url = "http://omdbapi.com/?t=" + title;
    };
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (body.Error) {

            } else {
                var movie = body;
                var title = movie.Title;
                var year = movie.Year;
                var genre = movie.Genre
                var rating = movie.imdbRating + " (" + movie.imdbVotes + " votes)"
                var runtime = movie.Runtime;
                var director = movie.Director;
                var cast = movie.Actors;
                var plot = movie.Plot;
                var imdb = movie.imdbID;
                var imgurl = movie.Poster;

                var bbcode_movie = "[b]Title:[/b] " + title + "\n\n[b]Year:[/b] " + year + "\n\n[b]Genre:[/b] " + genre + "\n\n[b]Rating:[/b] " + rating + "\n\n[b]Runtime:[/b] " + runtime + "\n\n[b]Director:[/b] " + director + "\n\n[b]Cast:[/b] " + cast + "\n\n[b]Plot:[/b] " + plot + "\n\n[b]Imdb url:[/b] [code]http://www.imdb.com/title/" + imdb + "/[/code]";

                var html_movie = "<b>Title:</b> " + title + "<br />\n\n<b>Year:</b> " + year + "<br />\n\n<b>Genre:</b> " + genre + "<br />\n\n<b>Rating:</b> " + rating + "<br />\n\n<b>Runtime:</b> " + runtime + "<br />\n\n<b>Director:</b> " + director + "<br />\n\n<b>Cast:</b> " + cast + "<br />\n\n<b>Plot:</b> " + plot + "<br />\n\n<b>Imdb url:</b> <a href=\"http://www.imdb.com/title/" + imdb + "/\">http://www.imdb.com/title/" + imdb + "/</a>";

                $('#movie_title span').html(title);
                $('#movie_year span').html(year);
                $('#movie_genre span').html(genre);
                $('#movie_rating span').html(rating);
                $('#movie_runtime span').html(runtime);
                $('#movie_director span').html(director);
                $('#movie_cast span').html(cast);
                $('#movie_plot span').html(plot);
                $('#movie_ulr span').html('<a class="ex" href="http://www.imdb.com/title/'+ imdb + '/">imdb.com/title/'+ imdb + '/</a>');

                $("textarea#txtarea.bbcode").text(bbcode_movie);

                $("textarea#txtarea2.html").text(html_movie);

                imgurUpload(imgurl);
            }
        }
    })
}

function imgurUpload(imgurl) {
    var imgurl;
    $('#loading_text').html("uploading image to imgur");
    if (imgurl !== "N/A") {
        imgur.setClientID('310d6d9c658dec0');
        imgur.upload(imgurl, function (err, res) {
            var imgurLink = res.data.link;
            $('#movie_cover img').attr("src", imgurLink);
            $('.bbcode').prepend("[img]" + imgurLink + "[/img]\n\n");
            //$('.html').prepend("<img src=\" " + imgurLink + " \"/> ");
            hideloader();
            showmodal();
        });
    } else {
        var imgurLink = "https://i.imgur.com/qdt2XZO.jpg";
        $('#movie_cover img').attr("src", imgurLink);
        $('.bbcode').prepend("[img]" + imgurLink + "[/img]\n\n");
        hideloader();
        showmodal();
    }
}

function showmodal() {
    $('#myModal').reveal({
        animation: 'fadeAndPop',
        animationspeed: 300,
        closeonbackgroundclick: true,
        dismissmodalclass: 'close-reveal-modal'
    });
}

function SelectAll(id){
    document.getElementById(id).focus();
    document.getElementById(id).select();
}

function errormsg(msg) {
    var msg = msg;
    $('#error').html(msg);
    $('#error').slideDown('slow', function () {
        $("#error").delay(3000).slideUp('slow');
    });
}

function api_status() {
    var url = "http://omdbapi.com/";
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //online
            $('#status').addClass("online");
            $('#led').addClass("led-green");
            $('#status-text').html("Imdb api online");
        } else {
            //offline
            $('#status').addClass("offline");
            $('#led').addClass("led-red");
            $('#status-text').html("Imdb api offline");
        }
    })
}