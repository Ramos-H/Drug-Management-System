<?php
require_once 'database.php';
if(!empty($_POST))
{
  echo json_encode(get_all_drug_info(intval(@$_POST['inv_num'])));
}
?>