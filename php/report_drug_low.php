<?php
require_once 'database.php';
echo base64_encode(json_encode(get_low_drug_count()));
?>