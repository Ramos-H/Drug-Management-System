<?php
  require_once 'constants.php';
  if(!file_exists(DB_PATH)) { die('Database file could not be found.'); }

  $conn_str = sprintf('odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)}; Dbq=%s;', realpath(DB_PATH));
  $db = null;
  try 
  {
    $db = new PDO($conn_str);
  } catch (PDOException $err) 
  {
    echo $conn_str . '<br>';
    print_r($err->getMessage());
  }

  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  function insert_new_user($username, $password)
  {
    global $db;
    $statement = 'INSERT INTO USERS (USERNAME, PASSWORD) VALUES (?, ?)';
    $prepped_stmt = $db->prepare($statement);
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    return $prepped_stmt->execute([$username, $hashed_password]);
  }
  
  function check_user_exists($username)
  {
    global $db;
    $statement = 'SELECT USERNAME FROM USERS WHERE USERNAME = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$username]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll();
    return count($result) > 0;
  }
  
  function verify_credentials($username, $password)
  {
    if(!check_user_exists($username)) { return false; }

    global $db;
    $statement = 'SELECT * FROM USERS WHERE USERNAME = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$username]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);

    foreach ($result as $row) 
    {
      if(password_verify($password, $row['PASSWORD']))
      {
        return intval($row['USER_NO']);
      }
    }

    return -1;
  }

  function get_main_table()
  {
    global $db;
    $statement = 'SELECT DRUG_INV.INV_NO
                          ,DRUG_NAMES.DRUG_NAME_GEN
                          ,DRUG_INV.DRUG_DATE_MAN
                          ,DRUG_INV.DRUG_DATE_ORDER
                          ,DRUG_INV.DRUG_DATE_EXP
                          ,DRUG_INFO.DRUG_STRENGTH
                          ,DRUG_INFO.STRENGTH_UNIT
                          ,DRUG_INFO.DRUG_TYPE
                          ,DRUG_INV.DRUG_QUANTITY 
                  FROM DRUG_INV, DRUG_INFO, DRUG_NAMES
                  WHERE DRUG_INV.DRUG_NO = DRUG_INFO.DRUG_NO AND DRUG_INFO.NAME_NO = DRUG_NAMES.NAME_NO';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_drug_manufacturer_count()
  {
    global $db;
    $statement = 'SELECT DRUG_MANUFACTURER, COUNT(DRUG_MANUFACTURER) AS "COUNT", 
                          CINT(ROUND(COUNT(DRUG_MANUFACTURER) / (select COUNT(*) from DRUG_INV) * 100)) AS "PERCENTAGE"
                  FROM DRUG_INV 
                  GROUP BY DRUG_MANUFACTURER
                  ORDER BY COUNT(DRUG_MANUFACTURER) DESC';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_drug_type_count()
  {
    global $db;
    $statement = 'SELECT DRUG_TYPE, COUNT(DRUG_TYPE) AS "COUNT", 
                          CINT(ROUND(COUNT(DRUG_TYPE) / (select COUNT(*) from DRUG_INFO) * 100)) AS "PERCENTAGE"
                  FROM DRUG_INFO 
                  GROUP BY DRUG_TYPE
                  ORDER BY COUNT(DRUG_TYPE) DESC';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_drug_inventory()
  {
    global $db;
    $statement = 'SELECT DRUG_INV.INV_NO
                        ,DRUG_NAMES.DRUG_NAME_GEN
                        ,DRUG_INFO.DRUG_STRENGTH
                        ,DRUG_INFO.STRENGTH_UNIT
                        ,DRUG_INFO.DRUG_TYPE
                        ,DRUG_INV.DRUG_MANUFACTURER
                        ,DRUG_INV.DRUG_DATE_MAN
                        ,DRUG_INV.DRUG_DATE_ORDER
                        ,DRUG_INV.DRUG_DATE_EXP
                        ,DRUG_INV.DRUG_QUANTITY
                  FROM DRUG_INV, DRUG_INFO, DRUG_NAMES
                  WHERE DRUG_INV.DRUG_NO = DRUG_INFO.DRUG_NO AND DRUG_INFO.NAME_NO = DRUG_NAMES.NAME_NO';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_low_drug_count()
  {
    global $db;
    $statement = 'SELECT DRUG_NAMES.DRUG_NAME_GEN, 
                          DRUG_INV.DRUG_QUANTITY
                  FROM DRUG_INV, DRUG_INFO, DRUG_NAMES
                  WHERE DRUG_INV.DRUG_NO = DRUG_INFO.DRUG_NO AND DRUG_INFO.NAME_NO = DRUG_NAMES.NAME_NO AND DRUG_INV.DRUG_QUANTITY < 10
                  ORDER BY DRUG_INV.DRUG_QUANTITY';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_drug_expire_report()
  {
    global $db;
    $statement = 'SELECT DRUG_NAMES.DRUG_NAME_GEN
                        ,DRUG_INV.DRUG_DATE_MAN
                        ,DRUG_INV.DRUG_DATE_ORDER
                        ,DRUG_INV.DRUG_DATE_EXP
                        ,DRUG_INV.DRUG_DATE_EXP as "EXPIRY_DAYS"
                        ,DRUG_INV.DRUG_QUANTITY
                  FROM DRUG_INV, DRUG_INFO, DRUG_NAMES
                  WHERE DRUG_INV.DRUG_NO = DRUG_INFO.DRUG_NO AND DRUG_INFO.NAME_NO = DRUG_NAMES.NAME_NO
                  ORDER BY DRUG_INV.DRUG_DATE_EXP';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);

    // Manually calculate days before expiration because DateDiff isn't working here
    foreach ($result as $key => $value) 
    {
      $current_date = new DateTimeImmutable();
      $exp_date = new DateTimeImmutable(explode(" ", $value['EXPIRY_DAYS'])[0]);
      $diff = date_diff($current_date, $exp_date);

      if($current_date > $exp_date) { $value['EXPIRY_DAYS'] = 'ALREADY EXPIRED'; }
      elseif($diff->d == 0) { $value['EXPIRY_DAYS'] = 'END OF DAY'; }
      else { $value['EXPIRY_DAYS'] = sprintf('%d %s left', $diff->d, ($diff->d > 1) ? 'days' : 'day'); }
      
      $result[$key] = $value;
    }

    return $result;
  }

  function get_all_drug_info($inv_num)
  {
    global $db;
    $statement = 'SELECT DRUG_INV.INV_NO, 
                          DRUG_INV.DRUG_MANUFACTURER,
                          DRUG_INV.DRUG_DATE_MAN, 
                          DRUG_INV.DRUG_DATE_ORDER, 
                          DRUG_INV.DRUG_DATE_EXP, 
                          DRUG_INV.DRUG_QUANTITY,
                          DRUG_INFO.DRUG_STRENGTH, 
                          DRUG_INFO.STRENGTH_UNIT, 
                          DRUG_INFO.DRUG_DOSE, 
                          DRUG_INFO.DRUG_TYPE, 
                          DRUG_NAMES.DRUG_MNEMONIC, 
                          DRUG_NAMES.DRUG_NAME_GEN, 
                          DRUG_NAMES.DRUG_NAME_BRAND, 
                          DRUG_NAMES.DRUG_SYNONYM
                  FROM DRUG_INV, DRUG_INFO, DRUG_NAMES
                  WHERE DRUG_INV.INV_NO = ?
                        AND DRUG_INV.DRUG_NO = DRUG_INFO.DRUG_NO 
                        AND DRUG_INFO.NAME_NO = DRUG_NAMES.NAME_NO';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$inv_num]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetch(PDO::FETCH_NAMED);
    return $result;
  }

  function insert_new_drug($values)
  {
    $name_num = insert_new_name($values['drug_mnemonic'], $values['name_generic'], $values['name_brand'], $values['drug_synonym']);
    $drug_num = insert_new_drug_info($name_num, $values['drug_strength'], $values['drug_strength_unit'], $values['drug_dosage'], $values['drug_type']);
    global $db;
    $statement = 'INSERT INTO DRUG_INV (DRUG_NO
                                        ,DRUG_MANUFACTURER
                                        ,DRUG_DATE_MAN
                                        ,DRUG_DATE_ORDER
                                        ,DRUG_DATE_EXP
                                        ,DRUG_QUANTITY)
                  VALUES (?, ?, ?, ?, ?, ?)';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$drug_num, $values['drug_manufacturer'], $values['date_manufactured'], $values['date_ordered'], $values['date_expiration'], $values['quantity']]);
    return $exec_success;
  }

  function insert_new_name($drug_mnemonic, $name_generic, $name_brand, $drug_synonym)
  {
    global $db;
    $statement = 'INSERT INTO DRUG_NAMES (DRUG_MNEMONIC, DRUG_NAME_GEN, DRUG_NAME_BRAND, DRUG_SYNONYM) 
                  VALUES (?, ?, ?, ?)';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$drug_mnemonic, $name_generic, $name_brand, $drug_synonym]);
    if(!$exec_success) { return false; }
    return get_name_num($drug_mnemonic, $name_generic, $name_brand, $drug_synonym);
  }
  
  function get_name_num($drug_mnemonic, $name_generic, $name_brand, $drug_synonym)
  {
    global $db;
    $statement = 'SELECT NAME_NO FROM DRUG_NAMES 
                  WHERE DRUG_MNEMONIC = ?
                        AND DRUG_NAME_GEN = ?
                        AND DRUG_NAME_BRAND = ?
                        AND DRUG_SYNONYM = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$drug_mnemonic, $name_generic, $name_brand, $drug_synonym]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NUM)[0][0];
    return $result;
  }

  function insert_new_drug_info($name_num, $drug_strength, $strength_unit, $drug_dose, $drug_type)
  {
    global $db;
    $statement = 'INSERT INTO DRUG_INFO (NAME_NO, DRUG_STRENGTH, STRENGTH_UNIT, DRUG_DOSE, DRUG_TYPE)
                  VALUES (?, ?, ?, ?, ?)';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$name_num, $drug_strength, $strength_unit, $drug_dose, $drug_type]);
    if(!$exec_success) { return false; }
    return get_info_num($name_num, $drug_strength, $strength_unit, $drug_dose, $drug_type);
  }

  function get_info_num($name_num, $drug_strength, $strength_unit, $drug_dose, $drug_type)
  {
    global $db;
    $statement = 'SELECT DRUG_NO FROM DRUG_INFO 
                  WHERE NAME_NO = ?
                        AND DRUG_STRENGTH = ?
                        AND STRENGTH_UNIT = ?
                        AND DRUG_DOSE = ?
                        AND DRUG_TYPE = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$name_num, $drug_strength, $strength_unit, $drug_dose, $drug_type]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NUM)[0][0];
    return $result;
  }

  function edit_drug($values)
  {
    $keys = get_primary_keys($values['inv_num']);
    update_drug_name($keys['NAME_NO'] ,$values['drug_mnemonic'], $values['name_generic'], $values['name_brand'], $values['drug_synonym']);
    update_drug_info($keys['DRUG_NO'], $values['drug_strength'], $values['drug_strength_unit'], $values['drug_dosage'], $values['drug_type']);

    global $db;
    $statement = 'UPDATE DRUG_INV 
                  SET DRUG_MANUFACTURER = ?
                      ,DRUG_DATE_MAN = ?
                      ,DRUG_DATE_ORDER = ?
                      ,DRUG_DATE_EXP = ?
                  WHERE INV_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$values['drug_manufacturer'], $values['date_manufactured'], $values['date_ordered'], $values['date_expiration'], $values['inv_num']]);
    return $exec_success;
  }

  function get_primary_keys($inv_num)
  {
    global $db;
    $statement = 'SELECT DRUG_INV.INV_NO, DRUG_INV.DRUG_NO, DRUG_INFO.NAME_NO 
                  FROM DRUG_INV, DRUG_INFO
                  WHERE DRUG_INV.INV_NO = ? AND DRUG_INFO.DRUG_NO = DRUG_INV.DRUG_NO';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$inv_num]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED)[0];
    return $result;
  }

  function update_drug_info($drug_num, $drug_strength, $strength_unit, $drug_dose, $drug_type)
  {
    global $db;
    $statement = 'UPDATE DRUG_INFO 
                  SET DRUG_STRENGTH = ?, STRENGTH_UNIT = ?, DRUG_DOSE = ?, DRUG_TYPE = ?
                  WHERE DRUG_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$drug_strength, $strength_unit, $drug_dose, $drug_type, $drug_num]);
    return $exec_success;
  }

  function update_drug_name($name_num, $drug_mnemonic, $name_generic, $name_brand, $drug_synonym)
  {
    global $db;
    $statement = 'UPDATE DRUG_NAMES 
                  SET DRUG_MNEMONIC = ?, DRUG_NAME_GEN = ?, DRUG_NAME_BRAND = ?, DRUG_SYNONYM = ?
                  WHERE NAME_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$drug_mnemonic, $name_generic, $name_brand, $drug_synonym, $name_num]);
    return $exec_success;
  }

  function delete_name($name_num)
  {
    global $db;
    $statement = 'DELETE FROM DRUG_NAMES WHERE NAME_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$name_num]);
    return $exec_success;
  }

  function delete_info($drug_num)
  {
    global $db;
    $statement = 'DELETE FROM DRUG_INFO WHERE DRUG_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$drug_num]);
    return $exec_success;
  }

  function delete_drug($inv_num)
  {
    $keys = get_primary_keys($inv_num);
    
    global $db;
    $statement = 'DELETE FROM DRUG_INV WHERE INV_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$inv_num]);
    if(!$exec_success) { return false; }
    if(!delete_info($keys['DRUG_NO'])) { return false; }
    if(!delete_name($keys['NAME_NO'])) { return false; }
    return true;
  }
?>