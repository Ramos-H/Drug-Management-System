<?php
  require_once 'utils.php';
  require_once 'constants.php';
  require_once 'database.php';

  $has_submitted = !empty($_POST);
  if($has_submitted)
  {
    // Decode JSON data from AJAX submission
    $_POST = json_decode(base64_decode(array_keys($_POST)[0]), true);
  }

  $username         = isset($_POST['username'])  ? trim($_POST['username']) : null;
  $password         = $_POST['password']         ?? null;
  $confirm_password = $_POST['confirm_password'] ?? null;

  $has_username         = !check_str_empty($username);
  $has_password         = !check_str_empty($password);
  $has_confirm_password = !check_str_empty($confirm_password);

  $username_too_long   = $has_username ? (strlen($username) > MAX_LENGTH_USERNAME) : false;
  $username_has_spaces = $has_username ? has_whitespace($username)                 : false;
  $username_is_taken   = $has_username ? check_user_exists($username)              : false;

  // Passwords are not max char limited because having more characters actually help.
  // See: https://stackoverflow.com/a/98786
  $password_too_short = $has_password ? (strlen($password) < MIN_LENGTH_PASSWORD) : false;

  $confirm_password_matches = ($has_password && $has_confirm_password) ? ($password === $confirm_password) : false;

  if(false)
  {
    echo 'DEBUG MODE: ON<br>';
    echo sprintf('Has submitted: %s<br>', bool_to_str($has_submitted));
    echo sprintf('Has username: %s<br>', bool_to_str($has_username));
    echo sprintf('Has password: %s<br>', bool_to_str($has_password));
    echo sprintf('Has confirm password: %s<br>', bool_to_str($has_confirm_password));
    echo '<br>';
    echo sprintf('Username: %s<br>', ($has_username) ? $username : 'none');
    echo sprintf('Password: %s<br>', ($has_password) ? $password : 'none');
    echo sprintf('Confirm Password: %s<br>', ($has_confirm_password) ? $confirm_password : 'none');
    echo '<br>';
    echo sprintf('Username too long: %s<br>', bool_to_str($username_too_long));
    echo sprintf('Password too short: %s<br>', bool_to_str($password_too_short));
    echo sprintf('Confirm password matches: %s<br>', bool_to_str($confirm_password_matches));
    echo '<br>';
  }

  $auth_result = array('status' => 'SUCCESS', 'data' => 'login.html');
  // Error reporting
  $errors = array('username' => '',
                  'password' => '',
                  'confirm_password' => '');

  if(!$has_username)
  {
    $errors['username'] = 'Please enter a username.';
    $auth_result['status'] = 'FAILURE';
  }
  elseif($username_too_long)
  {
    $errors['username'] = sprintf('Your username cannot be longer than %d characters. Please remove %d characters to continue.', MAX_LENGTH_USERNAME, strlen($username) - MAX_LENGTH_USERNAME);
    $auth_result['status'] = 'FAILURE';
  }
  elseif($username_has_spaces)
  {
    $errors['username'] = 'Your username cannot have any spaces.';
    $auth_result['status'] = 'FAILURE';
  }
  elseif ($username_is_taken) 
  {
    $errors['username'] = 'Username already taken. Please enter a different one.';
    $auth_result['status'] = 'FAILURE';
  }

  if(!$has_password)
  {
    $errors['password'] = 'Please enter a password.';
    $auth_result['status'] = 'FAILURE';
  }
  elseif($password_too_short)
  {
    $errors['password'] = sprintf('Your password cannot be shorter than %d characters. Please add at least %d more characters to continue. ', MIN_LENGTH_PASSWORD, MIN_LENGTH_PASSWORD - strlen($password));
    $auth_result['status'] = 'FAILURE';
  }
  
  if(!$has_confirm_password)
  {
    $errors['confirm_password'] = 'Please enter your password again.';
    $auth_result['status'] = 'FAILURE';
  }
  elseif(!$confirm_password_matches)
  {
    $errors['confirm_password'] = 'Your password and confirm password fields do not match.';
    $auth_result['status'] = 'FAILURE';
  }

  if($auth_result['status'] === 'SUCCESS')
  {
    if(!insert_new_user($username, $password)) { $auth_result['status'] = 'FAILURE'; }
  }

  if($auth_result['status'] === 'FAILURE')
  {
    $auth_result['data'] = $errors;
  }

  echo base64_encode(json_encode($auth_result));
?>