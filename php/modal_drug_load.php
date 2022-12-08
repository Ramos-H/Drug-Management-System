<?php
require_once 'database.php';
$has_submitted = !empty($_POST);
if($has_submitted)
{
  // Decode JSON data from AJAX submission
  $_POST = json_decode(base64_decode(array_keys($_POST)[0]), true);
}

echo base64_encode(json_encode(get_all_drug_info(intval(@$_POST['inv_num']))));
?>