<?php
require_once 'database.php';
echo base64_encode(json_encode(get_drug_manufacturer_count()));
?>