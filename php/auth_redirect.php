<?php
  session_start();
  $auth_result = array('status' => 'FAILURE', 'data' => 'login.html');
  if(isset($_SESSION['user_id']))
  {
    $auth_result['status'] = 'SUCCESS';
  }

  echo json_encode($auth_result);
?>