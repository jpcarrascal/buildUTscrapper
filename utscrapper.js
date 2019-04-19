var studyList = ["2668545","2605117"];
console.log("Extension UTscrapper loaded");


$(document).ready(function(){
        $(window).on('hashchange', function() {
            scrapeIt();
        });
        scrapeIt();
});

function scrapeIt()
{
    if( window.location.href.lastIndexOf("/study/") != -1 )
    {
        studyList.forEach( function(study, index) {
            var url = "https://www.usertesting.com/dashboard#!/study/" + study + "/sessions";
            if (window.location.href == url)
            {
                console.log("Study found: " + study + " Yay!!!");
                console.log("Waiting 5 seconds for participant data...");
                var scrapeTimeout = setTimeout(
                    function() 
                    {
                        getList(study);
                    }, 5000);
            }
        });
    }
    else
        console.log("Not a study page...");
}

function getList(study)
{
    var studyData = new Array();
    $(".list-row-container__item").each( function () {
        if ( $(this).find(".tester-details__username").length > 0 )
            {
            var user = $(this).find(".tester-details__username").first().text().trim();
            var time = $(this).find(".ml-2x.ng-binding.ng-scope").first().text().trim();
            var seconds = toSeconds(time);
            var session = {email: user, studyid: study, time: seconds};
            studyData.push(session);
            var completed = false;
            if (seconds > 180)
                completed = true;
            text = "participant: "+ user + ", time:  " + seconds + ", test: " + study + ", completed: " + completed;
            console.log("participant: "+ user + ", time:  " + seconds + ", test: " + study + ", completed: " + completed);
        }
    });
    saveText("studyData.txt",JSON.stringify(studyData));
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
    var seconds = 0;
    if((timeArray.length == 3))
    {
        var hours = parseInt(timeArray[0]); 
        var mins = parseInt(timeArray[1]);
        var secs = parseInt(timeArray[2]);
        seconds = hours * 3600 + mins * 60 + secs;
    }
    else if (timeArray.length == 2)
    {
        var mins = parseInt(timeArray[0]);
        var secs = parseInt(timeArray[1]);
        seconds = mins * 60 + secs;
    }
    else if (timeArray.length == 1)
        seconds = parseInt(timeArray[0]);
    return seconds;
}

function saveText(filename, text) {
    var tempElem = document.createElement('a');
    tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    tempElem.setAttribute('download', filename);
    tempElem.click();
 }