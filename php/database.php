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
    return $prepped_stmt->execute([$username, $password]);
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
      if($row['PASSWORD'] === $password)
      {
        return intval($row['USER_NO']);
      }
    }

    return -1;
  }

  function get_all_drug_info()
  {
    global $db;
    $statement = 'SELECT * FROM DRUG_INFO';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_all_drugs_in_inventory()
  {
    global $db;
    $statement = 'SELECT * FROM DRUG_INV';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_all_drugs_name_info()
  {
    global $db;
    $statement = 'SELECT * FROM DRUG_NAMES';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_drug_info($drug_num)
  {
    global $db;
    $statement = 'SELECT * FROM DRUG_INFO WHERE DRUG_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$drug_num]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return !empty($result) ? $result[0] : 'No drug info associated with drug number ' . $drug_num;
  }

  function get_drug_in_inventory($inv_num)
  {
    global $db;
    $statement = 'SELECT * FROM DRUG_INV WHERE INV_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$inv_num]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return !empty($result) ? $result[0] : 'No inventory info associated with inventory number ' . $inv_num;
  }

  function get_drug_name_info($name_num)
  {
    global $db;
    $statement = 'SELECT * FROM DRUG_NAMES WHERE NAME_NO = ?';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute([$name_num]);
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return !empty($result) ? $result[0] : 'No name info associated with name number ' . $name_num;
  }

  function get_main_table()
  {
    global $db;
    $statement = 'SELECT DRUG_NAMES.DRUG_NAME_GEN, DRUG_INV.DRUG_DATE_MAN, DRUG_INV.DRUG_DATE_EXP,
                          DRUG_INFO.DRUG_STRENGTH, DRUG_INFO.STRENGTH_UNIT, DRUG_INFO.DRUG_TYPE, 
                          DRUG_INV.DRUG_QUANTITY
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
                  GROUP BY DRUG_MANUFACTURER';
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
                  GROUP BY DRUG_TYPE';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  // Running out: when quantity is less than 10
?>