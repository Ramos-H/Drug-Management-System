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

  function get_drug_inventory()
  {
    global $db;
    $statement = 'SELECT DRUG_INV.INV_NO, 
                          DRUG_NAMES.DRUG_NAME_GEN, 
                          DRUG_INFO.DRUG_STRENGTH, 
                          DRUG_INFO.STRENGTH_UNIT, 
                          DRUG_INFO.DRUG_TYPE, 
                          DRUG_INV.DRUG_MANUFACTURER,
                          DRUG_INV.DRUG_DATE_MAN, 
                          DRUG_INV.DRUG_DATE_EXP, 
                          DRUG_INV.DRUG_QUANTITY
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
                  WHERE DRUG_INV.DRUG_NO = DRUG_INFO.DRUG_NO AND DRUG_INFO.NAME_NO = DRUG_NAMES.NAME_NO AND DRUG_INV.DRUG_QUANTITY < 10';
    $prepped_stmt = $db->prepare($statement);
    $exec_success = $prepped_stmt->execute();
    if(!$exec_success) { return false; }
    $result = $prepped_stmt->fetchAll(PDO::FETCH_NAMED);
    return $result;
  }

  function get_drug_expire_report()
  {
    global $db;
    $statement = 'SELECT DRUG_NAMES.DRUG_NAME_GEN, 
                          DRUG_INV.DRUG_DATE_MAN, 
                          DRUG_INV.DRUG_DATE_EXP, 
                          DRUG_INV.DRUG_DATE_EXP as "EXPIRY_DAYS",
                          DRUG_INV.DRUG_QUANTITY
                  FROM DRUG_INV, DRUG_INFO, DRUG_NAMES
                  WHERE DRUG_INV.DRUG_NO = DRUG_INFO.DRUG_NO AND DRUG_INFO.NAME_NO = DRUG_NAMES.NAME_NO';
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

  // Running out: when quantity is less than 10
?>