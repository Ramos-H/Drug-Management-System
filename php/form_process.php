<?php
  require_once 'database.php';
  require_once 'utils.php';
  $has_submitted = !empty($_POST);
  if($has_submitted)
  {
    // Decode JSON data from AJAX submission
    $_POST = json_decode(base64_decode(array_keys($_POST)[0]), true);
  }

  $name_generic       = isset($_POST['name_generic'])       ? trim($_POST['name_generic'])       : null;
  $name_brand         = isset($_POST['name_brand'])         ? trim($_POST['name_brand'])         : null;
  $drug_manufacturer  = isset($_POST['drug_manufacturer'])  ? trim($_POST['drug_manufacturer'])  : null;
  $drug_strength      = isset($_POST['drug_strength'])      ? trim($_POST['drug_strength'])      : null;
  $drug_strength_unit = isset($_POST['drug_strength_unit']) ? trim($_POST['drug_strength_unit']) : null;
  $drug_dosage        = isset($_POST['drug_dosage'])        ? trim($_POST['drug_dosage'])        : null;
  $drug_mnemonic      = isset($_POST['drug_mnemonic'])      ? trim($_POST['drug_mnemonic'])      : null;
  $drug_synonym       = isset($_POST['drug_synonym'])       ? trim($_POST['drug_synonym'])       : null;
  $drug_type          = isset($_POST['drug_type'])          ? trim($_POST['drug_type'])          : null;
  $quantity           = isset($_POST['quantity'])           ? trim($_POST['quantity'])           : null;
  $date_manufactured  = isset($_POST['date_manufactured'])  ? trim($_POST['date_manufactured'])  : null;
  $date_expiration    = isset($_POST['date_expiration'])    ? trim($_POST['date_expiration'])    : null;

  $has_name_generic       = !check_str_empty($name_generic);
  $has_name_brand         = !check_str_empty($name_brand);
  $has_drug_manufacturer  = !check_str_empty($drug_manufacturer);
  $has_drug_strength      = !check_str_empty($drug_strength);
  $has_drug_strength_unit = !check_str_empty($drug_strength_unit);
  $has_drug_dosage        = !check_str_empty($drug_dosage);
  $has_drug_mnemonic      = !check_str_empty($drug_mnemonic);
  $has_drug_synonym       = !check_str_empty($drug_synonym);
  $has_drug_type          = !check_str_empty($drug_type);
  $has_quantity           = !check_str_empty($quantity);
  $has_date_manufactured  = !check_str_empty($date_manufactured);
  $has_date_expiration    = !check_str_empty($date_expiration);

  $op_result = array('status' => 'SUCCESS', 'data' => '');

  $errors = array('name_generic'       => '', 
                  'name_brand'         => '', 
                  'drug_manufacturer'  => '', 
                  'drug_strength'      => '', 
                  'drug_strength_unit' => '', 
                  'drug_dosage'        => '', 
                  'drug_mnemonic'      => '', 
                  'drug_synonym'       => '', 
                  'drug_type'          => '', 
                  'quantity'           => '', 
                  'date_manufactured'  => '', 
                  'date_expiration'    => '');

  if(!$has_name_generic)
  {
    $op_result['status'] = 'FAILURE';
    $errors['name_generic'] = 'Please enter the generic name.';
  }
  
  if(!$has_name_brand)
  {
    $op_result['status'] = 'FAILURE';
    $errors['name_brand'] = 'Please enter the brand name.';
  }
  
  if(!$has_drug_manufacturer)
  {
    $op_result['status'] = 'FAILURE';
    $errors['drug_manufacturer'] = 'Please enter the manufacturer name.';
  }
  
  if(!$has_drug_strength)
  {
    $op_result['status'] = 'FAILURE';
    $errors['drug_strength'] = 'Please enter the drug strength.';
  }
  
  if(!$has_drug_strength_unit)
  {
    $op_result['status'] = 'FAILURE';
    $errors['drug_strength_unit'] = 'Please enter the drug strength unit.';
  }

  if(!$has_drug_dosage)
  {
    $op_result['status'] = 'FAILURE';
    $errors['drug_dosage'] = 'Please enter the dosage.';
  }
  
  if(!$has_drug_mnemonic)
  {
    $op_result['status'] = 'FAILURE';
    $errors['drug_mnemonic'] = 'Please enter the drug mnemonic.';
  }
  
  if(!$has_drug_synonym)
  {
    $op_result['status'] = 'FAILURE';
    $errors['drug_synonym'] = 'Please enter the drug synonym.';
  }
  
  if(!$has_drug_type)
  {
    $op_result['status'] = 'FAILURE';
    $errors['drug_type'] = 'Please choose a drug type.';
  }
  
  if(!$has_quantity)
  {
    $op_result['status'] = 'FAILURE';
    $errors['quantity'] = 'Please enter the quantity.';
  }
  
  if(!$has_date_manufactured)
  {
    $op_result['status'] = 'FAILURE';
    $errors['date_manufactured'] = 'Please enter the manufacture date.';
  }
  
  if(!$has_date_expiration)
  {
    $op_result['status'] = 'FAILURE';
    $errors['date_expiration'] = 'Please enter the expiration date.';
  }

  if($op_result['status'] === 'FAILURE')
  {
    $op_result['data'] = $errors;
  }
?>