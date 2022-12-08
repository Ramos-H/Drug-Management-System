<?php
require_once 'database.php';
echo base64_encode(json_encode(get_main_table()));
?>