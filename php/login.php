<?php
  require_once 'utils.php';
  require_once 'constants.php';
  require_once 'database.php';

  session_start();
  
  $has_submitted = !empty($_POST);
  if($has_submitted)
  {
    // Decode JSON data from AJAX submission
    $_POST = json_decode(base64_decode(array_keys($_POST)[0]), true);
  }
  
  $username = isset($_POST['username']) ? trim($_POST['username']) : null;
  $password = $_POST['password'] ?? null;

  $has_username = !check_str_empty($username);
  $has_password = !check_str_empty($password);

  if(false)
  {
    echo 'DEBUG MODE: ON<br>';
    echo sprintf('Has submitted: %s<br>', bool_to_str($has_submitted));
    echo sprintf('Has username: %s<br>', bool_to_str($has_username));
    echo sprintf('Has password: %s<br>', bool_to_str($has_password));
    echo '<br>';
    echo sprintf('Username: %s<br>', ($has_username) ? $username : 'none');
    echo sprintf('Password: %s<br>', ($has_password) ? $password : 'none');
    echo '<br>';
  }

  $auth_result = array('status' => '', 'data' => '');
  // Error reporting
  $errors = array('username' => '', 'password' => '', 'verify' => '');

  if(!$has_username) 
  {
    $errors['username'] = 'Please enter your username.';
    $auth_result['status'] = 'FAILURE';
  }

  if(!$has_password) 
  {
    $errors['password'] = 'Please enter your password.';
    $auth_result['status'] = 'FAILURE';
  }

  if($has_submitted && $has_username && $has_password)
  {
    $user_id = verify_credentials($username, $password);
    if($user_id > -1)
    {
      $_SESSION['user_id'] = $user_id;
      $auth_result['status'] = 'SUCCESS';
    }
    else
    {
      $errors['verify'] = 'Your username or password is incorrect.';
      $auth_result['status'] = 'FAILURE';
    }
  }

  if($auth_result['status'] === 'SUCCESS')
  {
    $auth_result['data'] = 'index.html';
  }
  else
  {
    $auth_result['data'] = $errors;
  }

  echo base64_encode(json_encode($auth_result));
?>