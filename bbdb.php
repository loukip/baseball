<?php

    // open db connection
    try {
        $db = new PDO("redacted","redacted","redacted");
        $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    } catch(Exception $e) {
        echo "Could not connect to the database.";
        exit;
    }

    // URL parameters:
    // team - corresponds with schedule.home or schedule.visitor
    // month - schedule.month

    // pull cities and team names to populate dropdown menu
    if (isset($_GET["team"]) && ($_GET["team"] == "ALL")) {
        try {
            $results = $db->query("SELECT abbr, city, team FROM teams")->fetchAll(PDO::FETCH_ASSOC);
            $res_json = json_encode($results);
            header('Content-Type: application/json');
            echo $res_json;
            exit;
        } catch(Exception $e) {
            echo "No go!";
            exit;
        }
    }

    // get dates, teams to populate calendar
    if (isset($_GET["team"]) && isset($_GET["month"])) {

        $team = $_GET["team"];
        $month = $_GET["month"];

        try {
            $results = $db->query("SELECT day, visitor, home FROM schedule WHERE month = '$month' && (home = '$team' || visitor = '$team')")->fetchAll(PDO::FETCH_ASSOC);
            $res_json = json_encode($results);
            header('Content-Type: application/json');
            echo $res_json;
            exit;
        } catch(Exception $e) {
            echo "No go!";
            exit;
        }

    }

?>