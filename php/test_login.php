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

    session_start();

    $submit_value = $_POST['submit'] ?? null;
    $username = isset($_POST['username']) ? trim($_POST['username']) : null;
    $password = $_POST['password'] ?? null;

    $has_submitted = !check_str_empty($submit_value);
    $has_username = !check_str_empty($username);
    $has_password = !check_str_empty($password);

    if(DEBUG_MODE)
    {
      echo 'DEBUG MODE: ON<br>';
      echo sprintf('Has submitted: %s<br>', bool_to_str($has_submitted));
      echo sprintf('Has username: %s<br>', bool_to_str($has_username));
      echo sprintf('Has password: %s<br>', bool_to_str($has_password));
      echo '<br>';
      echo sprintf('Submit value: %s<br>', ($has_submitted) ? $submit_value : 'none');
      echo sprintf('Username: %s<br>', ($has_username) ? $username : 'none');
      echo sprintf('Password: %s<br>', ($has_password) ? $password : 'none');
      echo '<br>';
    }

    // Error reporting
    $errors = array('username' => '', 'password' => '', 'verify' => '');

    if(!$has_username) { $errors['username'] = 'Please enter your username.'; }
    if(!$has_password) { $errors['password'] = 'Please enter your password.'; }

    if($has_submitted && $has_username && $has_password)
    {
      $user_id = verify_credentials($username, $password);
      if($user_id > -1)
      {
        $_SESSION['user_id'] = $user_id;
      }
      else
      {
        $errors['verify'] = 'Your username or password is incorrect.';
      }
    }
  ?>

  <a href="test_register.php">Register</a>
  <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
    <label for="username">Username</label><br>
    <input type="text" name="username" id="username"><br>
    <?php if($has_submitted && !check_str_empty($errors['username'])) { echo sprintf('<span style="color: red">%s</span><br>', $errors['username']); } ?>
    
    <label for="password">Password</label><br>
    <input type="text" name="password" id="password"><br>
    <?php if($has_submitted && !check_str_empty($errors['password'])) { echo sprintf('<span style="color: red">%s</span><br>', $errors['password']);} ?>
    
    <?php if($has_submitted && !check_str_empty($errors['verify'])) { echo sprintf('<span style="color: red">%s</span><br>', $errors['verify']);} ?>
    <button type="submit" name="submit" value="login">Login</button>
  </form>
</body>
</html>