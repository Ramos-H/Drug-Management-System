<?php
require_once 'database.php';
echo base64_encode(json_encode(get_all_drug_info(intval(@$_POST['inv_num']))));
?>