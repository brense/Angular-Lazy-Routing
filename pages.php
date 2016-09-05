<?php

$arr = array();
$arr['template']  = '<p>This is ' . $_GET['page'] . ' demo. {{test}}</p>';
$arr['controller'] = array('name' => 'DemoController', 'path' => 'DemoController.js');
/*
$arr['error'] = 'Not found';
header('HTTP/1.0 404 Not Found');
*/
echo json_encode($arr);