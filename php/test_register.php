<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <title>Test Register</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
  <script src='main.js'></script>
</head>
<body>
  <?php require_once 'register.php'; ?>
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