<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <title>Register</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
  <script src='main.js'></script>
</head>
<body>
  <?php
    require_once 'utils.php';
    require_once 'constants.php';
    require_once 'database.php';

    $submit_value = $_POST['submit'] ?? null;
    $username = isset($_POST['username']) ? trim($_POST['username']) : null;
    $password = $_POST['password'] ?? null;
    $confirm_password = $_POST['confirm_password'] ?? null;

    $has_submitted = !check_str_empty($submit_value);
    $has_username = !check_str_empty($username);
    $has_password = !check_str_empty($password);
    $has_confirm_password = !check_str_empty($confirm_password);

    $username_too_long = $has_username ? (strlen($username) > MAX_LENGTH_USERNAME) : false;

    // Passwords are not max char limited because having more characters actually help.
    // See: https://stackoverflow.com/a/98786
    $password_too_short = $has_password ? (strlen($password) < MIN_LENGTH_PASSWORD) : false;

    $confirm_password_matches = ($has_password && $has_confirm_password) ? ($password === $confirm_password) : false;

    if(DEBUG_MODE)
    {
      echo 'DEBUG MODE: ON<br>';
      echo sprintf('Has submitted: %s<br>', bool_to_str($has_submitted));
      echo sprintf('Has username: %s<br>', bool_to_str($has_username));
      echo sprintf('Has password: %s<br>', bool_to_str($has_password));
      echo sprintf('Has confirm password: %s<br>', bool_to_str($has_confirm_password));
      echo '<br>';
      echo sprintf('Submit value: %s<br>', ($has_submitted) ? $submit_value : 'none');
      echo sprintf('Username: %s<br>', ($has_username) ? $username : 'none');
      echo sprintf('Password: %s<br>', ($has_password) ? $password : 'none');
      echo sprintf('Confirm Password: %s<br>', ($has_confirm_password) ? $confirm_password : 'none');
      echo '<br>';
      echo sprintf('Username too long: %s<br>', bool_to_str($username_too_long));
      echo sprintf('Password too short: %s<br>', bool_to_str($password_too_short));
      echo sprintf('Confirm password matches: %s<br>', bool_to_str($confirm_password_matches));
      echo '<br>';
    }

    // Error reporting
    $errors = array('username' => '',
                    'password' => '',
                    'confirm_password' => '');

    if(!$has_username)
    {
      $errors['username'] = 'Please enter a username.';
    }
    else if($username_too_long)
    {
      $errors['username'] = sprintf('Your username cannot be longer than %d characters. Please remove %d characters to continue.', MAX_LENGTH_USERNAME, strlen($username) - MAX_LENGTH_USERNAME);
    }

    if(!$has_password)
    {
      $errors['password'] = 'Please enter a password.';
    }
    else if($password_too_short)
    {
      $errors['password'] = sprintf('Your password cannot be shorter than %d characters. Please add at least %d more characters to continue. ', MIN_LENGTH_PASSWORD, MIN_LENGTH_PASSWORD - strlen($password));
    }
    
    if(!$has_confirm_password)
    {
      $errors['confirm_password'] = 'Please enter your password again.';
    }
    else if(!$confirm_password_matches)
    {
      $errors['confirm_password'] = 'Your password and confirm password fields do not match.';
    }

    if($has_submitted && $has_username && $has_password && $has_confirm_password
     && !$username_too_long && !$password_too_short && $confirm_password_matches)
    {
      insert_new_user($username, $password);
      header('Location: test_login.php');
    }
  ?>

  <a href="test_login.php">Login</a>
  <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
    <label for="username">Username</label><br>
    <input type="text" name="username" id="username"><br>
    <?php if($has_submitted && !check_str_empty($errors['username'])) { echo sprintf('<span style="color: red">%s</span><br>', $errors['username']); } ?>
    
    <label for="password">Password</label><br>
    <input type="text" name="password" id="password"><br>
    <?php if($has_submitted && !check_str_empty($errors['password'])) { echo sprintf('<span style="color: red">%s</span><br>', $errors['password']);} ?>
    
    <label for="confirm_password">Confirm Password</label><br>
    <input type="text" name="confirm_password" id="confirm_password"><br>
    <?php if($has_submitted && !check_str_empty($errors['confirm_password'])) { echo sprintf('<span style="color: red">%s</span><br>', $errors['confirm_password']); } ?>

    <button type="submit" name="submit" value="register">Register</button>
  </form>
</body>
</html>