$(function() {
    var isBlankCal = true,
        dayOne,
        numDays;

    var logos = {
        ARI: "https://upload.wikimedia.org/wikipedia/en/8/89/Arizona_Diamondbacks_logo.svg",
        ATL: "https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg",
        BAL: "https://upload.wikimedia.org/wikipedia/en/e/e9/Baltimore_Orioles_Script.svg",
        BOS: "https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg",
        CHI: "https://upload.wikimedia.org/wikipedia/commons/8/80/Chicago_Cubs_logo.svg",
        CWS: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Chicago_White_Sox.svg",
        CIN: "https://upload.wikimedia.org/wikipedia/commons/0/01/Cincinnati_Reds_Logo.svg",
        CLE: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Indians_Logo_-_2014_Season.svg",
        COL: "https://cdn.worldvectorlogo.com/logos/colorado-rockies-4.svg",
        DET: "https://upload.wikimedia.org/wikipedia/commons/2/20/Detroit_tigers_textlogo.svg",
        HOU: "http://cdn-s3.si.com/s3fs-public/teams/baseball/mlb/logos/astros_onDark.svg",
        KC: "https://upload.wikimedia.org/wikipedia/en/1/1c/Kansas_City_Royals.svg",
        LAA: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Los_Angeles_Angels_of_Anaheim.svg",
        LAD: "https://upload.wikimedia.org/wikipedia/de/0/0e/Los_Angeles_Dodgers_Logo.svg",
        MIA: "https://www.mlbstatic.com/mlb.com/builds/site-core/bcc8660b97da2944759c7fc5ab4a9d8e1ddff5a6_1504035876/images/logos/team-primary-on-light/146.svg",
        MIL: "https://upload.wikimedia.org/wikipedia/en/1/11/Milwaukee_Brewers_Logo.svg",
        MIN: "https://upload.wikimedia.org/wikipedia/en/2/2f/Minnesota_Twins_Insignia.svg",
        NYM: "http://newyork.mets.mlb.com/documents/9/7/0/111239970/NYM_header_logo_rxxf7e6q.svg",
        NYY: "https://upload.wikimedia.org/wikipedia/en/2/25/NewYorkYankees_PrimaryLogo.svg",
        OAK: "https://upload.wikimedia.org/wikipedia/commons/6/63/Oakland_athl_primlogo.svg",
        PHI: "https://upload.wikimedia.org/wikipedia/en/8/84/Philadelphia_Phillies.svg",
        PIT: "https://upload.wikimedia.org/wikipedia/en/b/b4/Pittsburgh_Pirates_MLB_Logo.svg",
        SD: "https://upload.wikimedia.org/wikipedia/commons/a/a4/SDPadres_logo.svg",
        SF: "http://sanfrancisco.giants.mlb.com/documents/6/0/2/111217602/sf_logo_o65167ja.svg",
        SEA: "https://upload.wikimedia.org/wikipedia/en/b/b0/Seattle_Mariners_logo.svg",
        STL: "https://cdn.worldvectorlogo.com/logos/st-louis-cardinals.svg",
        TB: "http://mlb.com/documents/3/0/8/111213308/TB_header_logo_01_1_u0syanwd.svg",
        TEX: "https://upload.wikimedia.org/wikipedia/en/4/41/Texas_Rangers.svg",
        TOR: "http://mlb.com/documents/0/5/0/111201050/TOR_header_logo_4_4nk7pr2x.svg",
        WSH: "https://sportsfly.cbsistatic.com/fly-683/bundles/sportsmediacss/images/team-logos/mlb/WAS.svg"
    }

    // populate teams dropdown menu
    $.get( "bbdb.php", { team: "ALL" }, function(data) { for(var i in data) { $("#teams").append("<option value='" + data[i].abbr + "'>" + data[i].city + " " + data[i].team + "</option>") } });

    // populate calendar
    $("#getcal").click( function(e) {
        e.preventDefault();
        var $teamSel = $("#teams").val(),
            $monthSel = $("#months").val(),
            $days = $(".day"),
            GRIDSIZE = 35;

        // if calendar isn't blank, clear it
        if(!isBlankCal) {
            $days.removeClass("here away off");
            $days.find(".date").text("");
            $days.find(".vis").text("");
            $days.find(".home").text("");
            isBlankCal = true;
        }

        // assigns location of first day of month on calendar
        switch($monthSel) {
            case "April":
                dayOne = 6; /* Saturday */
                numDays = 30;
                break;
            case "May":
                dayOne = 1; /* Monday */
                numDays = 31;
                break;
            case "June":
                dayOne = 4; /* Thursday */
                numDays = 30;
                break;
            case "July":
                dayOne = 6; /* Saturday */
                numDays = 31;
                break;
            case "August":
                dayOne = 2; /* Tuesday */
                numDays = 31;
                break;
            case "September":
                dayOne = 5; /* Friday */
                numDays = 30;
                break;
            case "October":
                dayOne = 0; /* Sunday */
                numDays = 31;
                break;
            default:
                break;
        }

        if($teamSel != "0" && $monthSel != "0") {
            $.get( "bbdb.php", { team: $teamSel, month: $monthSel }, function(data) {
                var thisMonth = [];

                if( $(".logo object").attr("data-team") != $teamSel ) {
                    $(".logo object").attr("data", logos[$teamSel]);
                    $(".logo object").attr("data-team", $teamSel);
                }

                $(".logo span").text($monthSel);
                $(".logo .sr-only").text($("#teams option:selected").text());

                $(".calendar").attr("data-team", $teamSel);

                // populate array with games; index maps to date
                for(var i = 0; i < data.length; i++) {
                    var idx = parseInt(data[i].day, 10) - 1;
                    thisMonth[idx] = data[i];
                }

                // enter off days into array
                for(var i = 0; i < numDays; i++) {
                    if(!thisMonth[i]) {
                        thisMonth[i] = { day: i+1 };
                    }
                }

                // adjust layout, adding or subtracting days as needed
                if ($(".day").size() > (numDays + dayOne)) {
                    while($(".day").size() > GRIDSIZE) {
                        $(".day").last().remove();
                    }
                }

                if((numDays + dayOne) > $(".day").size()) {
                    var diff = (numDays + dayOne) - $(".day").size();
                    for(var i = 1; i <= diff; i++) {
                        $(".day").first().clone().addClass("extra").appendTo($(".calendar"));
                    }
                }

                var days = $(".day").toArray();

                for(var i = dayOne, j = 0; i < days.length; i++, j++) {
                    if(thisMonth[j]) {
                        days[i].querySelector(".date").textContent = thisMonth[j].day;

                        if(thisMonth[j].visitor) {
                            days[i].querySelector(".vis").textContent = thisMonth[j].visitor;
                        }
                        if(thisMonth[j].home) {
                            days[i].querySelector(".home").textContent = thisMonth[j].home;
                        }

                        // add appropriate style classes for home/away/off days
                        if(thisMonth[j].home === $teamSel) {
                            days[i].className += " here";
                        }
                        if(thisMonth[j].visitor === $teamSel) {
                            days[i].className += " away";
                        }
                        if(thisMonth[j].day && !(thisMonth[j].visitor) && !(thisMonth[j].home)) {
                            days[i].className += " off";
                        }
                    }
                }

                isBlankCal = false;
            });
        }
    });
});