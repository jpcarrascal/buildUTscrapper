console.log("Extension UTscraper loaded");
var win;

$(document).ready(function(){
        $(window).on('hashchange', function() {
            scrapeIt();
        });
        scrapeIt();
});

function scrapeIt()
{
    // https://www.usertesting.com/dashboard#!/study/2668545/sessions
    if( window.location.href.lastIndexOf("/study/") != -1  && window.location.href.lastIndexOf("/sessions") != -1)
    {
        var urlArray = window.location.href.split("/");
        var study = urlArray[5];
        console.log("Study found: " + study + " Yay!!!");
        console.log("Waiting 10 seconds for participant data...");
        window.scrollTo(0,document.body.scrollHeight);
        var scrapeTimeout = setTimeout(
            function() 
            {
                window.scrollTo(0,document.body.scrollHeight);
                getList(study);
            }, 15000);
    }
    else
        console.log("Not a study page.");
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
    //saveText("studyData.txt",JSON.stringify(studyData));
    console.log("Sending to backend... " + studyData.length + " sessions");
    submitData(JSON.stringify(studyData));
    console.log("Waiting 5 seconds to reload...");
    var reloadTimeout = setTimeout(
        function() 
        {
            //location.reload();
            self.close ();
    }, 5000);
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

 function submitData(studyJsonData)
 {
    var saveStudyForm = document.createElement("form");
    saveStudyForm.target = "Submitting";
    saveStudyForm.method = "POST"; // or "post" if appropriate
    saveStudyForm.action = "https://buildleaderboardapi.azurewebsites.net/insert-sessions.php";

    var studyInput = document.createElement("input");
    studyInput.type = "text";
    studyInput.name = "studyData";
    studyInput.value = studyJsonData;
    saveStudyForm.appendChild(studyInput);

    document.body.appendChild(saveStudyForm);
    
    win = window.open("", "Submitting", "status=0,title=0,height=100,width=100,scrollbars=1");

    if (win) {
        saveStudyForm.submit();
        setTimeout(function() 
            {
                win.close();
        }, 4000);
    } else {
        alert('You must allow popups for this extension to work.');
    }
 }