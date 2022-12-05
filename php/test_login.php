<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <title>Test Login</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
  <script src='main.js'></script>
</head>
<body>
  <?php require_once 'login.php'; ?>

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