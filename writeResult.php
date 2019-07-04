<?php

$attr = $_POST;

$getJsonData = file_get_contents("topScore.json");

$arr_data = json_decode($getJsonData, true);

if (empty($arr_data)) {
	$arr_data = array();
}

array_push($arr_data, $attr);

$jsondata = json_encode($arr_data);

file_put_contents("topScore.json", $jsondata);

?>