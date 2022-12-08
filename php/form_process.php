<?php
  require_once 'database.php';
  require_once 'utils.php';
  $has_submitted = !empty($_POST);
  if($has_submitted)
  {
    // Decode JSON data from AJAX submission
    $_POST = json_decode(base64_decode(array_keys($_POST)[0]), true);
  }

  // $name_generic       = isset($_POST['name_generic'])       ? trim($_POST['name_generic'])       : null;
  // $name_brand         = isset($_POST['name_brand'])         ? trim($_POST['name_brand'])         : null;
  // $drug_manufacturer  = isset($_POST['drug_manufacturer'])  ? trim($_POST['drug_manufacturer'])  : null;
  // $drug_strength      = isset($_POST['drug_strength'])      ? trim($_POST['drug_strength'])      : null;
  // $drug_strength_unit = isset($_POST['drug_strength_unit']) ? trim($_POST['drug_strength_unit']) : null;
  // $drug_dosage        = isset($_POST['drug_dosage'])        ? trim($_POST['drug_dosage'])        : null;
  // $drug_mnemonic      = isset($_POST['drug_mnemonic'])      ? trim($_POST['drug_mnemonic'])      : null;
  // $drug_synonym       = isset($_POST['drug_synonym'])       ? trim($_POST['drug_synonym'])       : null;
  // $drug_type          = isset($_POST['drug_type'])          ? trim($_POST['drug_type'])          : null;
  // $quantity           = isset($_POST['quantity'])           ? trim($_POST['quantity'])           : null;
  // $date_manufactured  = isset($_POST['date_manufactured'])  ? trim($_POST['date_manufactured'])  : null;
  // $date_expiration    = isset($_POST['date_expiration'])    ? trim($_POST['date_expiration'])    : null;

  // $has_name_generic       = !check_str_empty($name_generic);
  // $has_name_brand         = !check_str_empty($name_brand);
  // $has_drug_manufacturer  = !check_str_empty($drug_manufacturer);
  // $has_drug_strength      = !check_str_empty($drug_strength);
  // $has_drug_strength_unit = !check_str_empty($drug_strength_unit);
  // $has_drug_dosage        = !check_str_empty($drug_dosage);
  // $has_drug_mnemonic      = !check_str_empty($drug_mnemonic);
  // $has_drug_synonym       = !check_str_empty($drug_synonym);
  // $has_drug_type          = !check_str_empty($drug_type);
  // $has_quantity           = !check_str_empty($quantity);
  // $has_date_manufactured  = !check_str_empty($date_manufactured);
  // $has_date_expiration    = !check_str_empty($date_expiration);

  // $too_long_name_generic       = $has_name_generic       ? strlen($has_name_generic)       > MAX_LENGTH_FIELD : false ;
  // $too_long_name_brand         = $has_name_brand         ? strlen($has_name_brand)         > MAX_LENGTH_FIELD : false ;
  // $too_long_drug_manufacturer  = $has_drug_manufacturer  ? strlen($has_drug_manufacturer)  > MAX_LENGTH_FIELD : false ;
  // $too_long_drug_strength      = $has_drug_strength      ? strlen($has_drug_strength)      > MAX_LENGTH_FIELD : false ;
  // $too_long_drug_strength_unit = $has_drug_strength_unit ? strlen($has_drug_strength_unit) > MAX_LENGTH_FIELD : false ;
  // $too_long_drug_dosage        = $has_drug_dosage        ? strlen($has_drug_dosage)        > MAX_LENGTH_FIELD : false ;
  // $too_long_drug_mnemonic      = $has_drug_mnemonic      ? strlen($has_drug_mnemonic)      > MAX_LENGTH_FIELD : false ;
  // $too_long_drug_synonym       = $has_drug_synonym       ? strlen($has_drug_synonym)       > MAX_LENGTH_FIELD : false ;
  // $too_long_drug_type          = $has_drug_type          ? strlen($has_drug_type)          > MAX_LENGTH_FIELD : false ;
  // $too_long_quantity           = $has_quantity           ? strlen($has_quantity)           > MAX_LENGTH_FIELD : false ;
  // $too_long_date_manufactured  = $has_date_manufactured  ? strlen($has_date_manufactured)  > MAX_LENGTH_FIELD : false ;
  // $too_long_date_expiration    = $has_date_expiration    ? strlen($has_date_expiration)    > MAX_LENGTH_FIELD : false ;

  $op_result = array('status' => 'SUCCESS', 'data' => '');

  $errors = array();

  foreach (array_keys($_POST) as $key => $value) 
  {
    $errors[$key] = '';
  }

  $property_names = array('name_generic'        => 'generic name'
                          ,'name_brand'         => 'brand name'
                          ,'drug_manufacturer'  => 'manufacturer name'
                          ,'drug_strength'      => 'drug strength'
                          ,'drug_strength_unit' => 'drug strength unit'
                          ,'drug_dosage'        => 'drug dosage'
                          ,'drug_mnemonic'      => 'drug mnemonic'
                          ,'drug_synonym'       => 'drug synonym'
                          ,'drug_type'          => 'drug type'
                          ,'quantity'           => 'quantity'
                          ,'date_manufactured'  => 'manufacture date'
                          ,'date_ordered'       => 'order date'
                          ,'date_expiration'    => 'expiration date');

  foreach ($_POST as $key => $value) 
  {
    if($key === 'inv_no') { continue; }
    elseif(in_array($key, array('drug_strength', 'drug_dosage', 'quantity'))) // Numbers
    {
      $numVal = intval($value);
      if($numVal < 0 || $numVal > MAX_VALUE_NUMBER)
      {
        $op_result['status'] = 'FAILURE';
        $errors[$key] = sprintf('Please choose a value from 0 to 1 000 000');
      }
    }
    elseif(in_array($key, array('date_manufactured', 'date_ordered'))) // Dates
    {
      if(check_str_empty($value))
      {
        $op_result['status'] = 'FAILURE';
        $errors[$key] = sprintf('Please enter the %s.', $property_names[$key]);
      }
      else
      {
        $current_date = new DateTimeImmutable();
        $other_date = new DateTimeImmutable(explode(" ", $value)[0]);
        if($other_date > $current_date)
        {
          $op_result['status'] = 'FAILURE';
          $errors[$key] = sprintf('Please don\'t choose a date set in the future');
        }
      }
    }
    else // Inputs
    {
      $value = trim($value);
      if(check_str_empty($value))
      {
        $op_result['status'] = 'FAILURE';
        $errors[$key] = sprintf('Please enter the %s.', $property_names[$key]);
      }
      elseif(strlen($value) > MAX_LENGTH_FIELD)
      {
        $op_result['status'] = 'FAILURE';
        $errors[$key] = sprintf('The %s entered is too long.', $property_names[$key]);
      }
    }
  }


  // if(!$has_name_generic)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['name_generic'] = 'Please enter the generic name.';
  // }
  // elseif($too_long)
  
  // if(!$has_name_brand)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['name_brand'] = 'Please enter the brand name.';
  // }
  
  // if(!$has_drug_manufacturer)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['drug_manufacturer'] = 'Please enter the manufacturer name.';
  // }
  
  // if(!$has_drug_strength)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['drug_strength'] = 'Please enter the drug strength.';
  // }
  
  // if(!$has_drug_strength_unit)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['drug_strength_unit'] = 'Please enter the drug strength unit.';
  // }

  // if(!$has_drug_dosage)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['drug_dosage'] = 'Please enter the dosage.';
  // }
  
  // if(!$has_drug_mnemonic)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['drug_mnemonic'] = 'Please enter the drug mnemonic.';
  // }
  
  // if(!$has_drug_synonym)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['drug_synonym'] = 'Please enter the drug synonym.';
  // }
  
  // if(!$has_drug_type)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['drug_type'] = 'Please choose a drug type.';
  // }
  
  // if(!$has_quantity)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['quantity'] = 'Please enter the quantity.';
  // }
  
  // if(!$has_date_manufactured)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['date_manufactured'] = 'Please enter the manufacture date.';
  // }
  
  // if(!$has_date_expiration)
  // {
  //   $op_result['status'] = 'FAILURE';
  //   $errors['date_expiration'] = 'Please enter the expiration date.';
  // }

  if($op_result['status'] === 'FAILURE')
  {
    $op_result['data'] = $errors;
  }
?>