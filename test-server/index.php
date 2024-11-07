<?php

$valid_passwords = array ("mario" => "carbonell");
$valid_users = array_keys($valid_passwords);

$user = $_SERVER['PHP_AUTH_USER'];
$pass = $_SERVER['PHP_AUTH_PW'];

$validated = (in_array($user, $valid_users)) && ($pass == $valid_passwords[$user]);

if (!$validated) {
  header('WWW-Authenticate: Basic realm="My Realm"');
  header('HTTP/1.0 401 Unauthorized');
  die ("Not authorized");
}

// If we arrive here, we have a valid user. Simulate a download next.
// disable output buffering
while (ob_get_level())
 ob_end_flush();

$file = "data/" . $_GET['filename'];
$file = realpath($file);
// TODO: Would need to test if file is in "data/" still.
if (!file_exists($file)) {
  header('WWW-Authenticate: Basic realm="My Realm"');
  header('HTTP/1.0 404 Not Found');
  die("Error: The file ".$_GET['filename']." does not exist!");
}

header("Content-Description: File Transfer");
header("Content-Type: application/octet-stream"); 
header("Content-Disposition: attachment; filename=\"". basename($file) ."\""); 
header("Content-Length: " . filesize($file));
flush();
syslog(LOG_EMERG, "start reading file ". $file);
readfile ($file);
syslog(LOG_EMERG, "done reading file");
exit();

?>
