var studyList = ["2668545","2605117"];
console.log("Extension UTscrapper loaded");

$(document).ready(
    function(){
        $(window).on('hashchange', function() {
            scrapeIt();
        });
        scrapeIt();
});

function scrapeIt()
{
    if( window.location.href.lastIndexOf("/study/") != -1 )
    {
        studyList.forEach( function(item, index) {
            var url = "https://www.usertesting.com/dashboard#!/study/" + item + "/sessions";
            if (window.location.href == url)
            {
                console.log("Study found: " + item + " Yay!!!");
                console.log("Waiting 5 seconds for participant data...");
                var scrapeTimeout = setTimeout(
                    function() 
                    {
                    getList(item);
                    }, 5000);
            }
        });
    }
    else
        console.log("Not a study page...");
}

function getList(item)
{
    $(".list-row-container__item").each( function () {
        if ( $(this).find(".tester-details__username").length > 0 )
            {
            var user = $(this).find(".tester-details__username").first().text().trim();
            var time = $(this).find(".ml-2x.ng-binding.ng-scope").first().text().trim();
            var seconds = toSeconds(time);
            var completed = false;
            if (seconds > 180)
                completed = true;
            console.log("participant: "+ user + ", time:  " + time + ", test: " + item + ", completed: " + completed);
        }
    });
    console.log("Waiting 5 seconds to reload...");
    var reloadTimeout = setTimeout(
        function() 
        {
            location.reload();
    }, 9000);
}

function toSeconds(time)
{
    var timeArray = time.split(":");
    var totalTime = 0;
    if((timeArray.length == 2))
    {
        var hours = parseInt(timeArray[0]); 
        var mins = parseInt(timeArray[1]);
        var secs = parseInt(timeArray[2]);
        totalTime = hours * 3600 + mins * 60 + secs;
    }
    else if (timeArray.length == 2)
    {
        var mins = parseInt(timeArray[0]);
        var secs = parseInt(timeArray[1]);
        totalTime = mins * 60 + secs;
    }
    else if (timeArray.length == 1)
        totalTime = parseInt(timeArray[0]);
    return totalTime;
}

