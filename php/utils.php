<?php
function check_str_empty($str)
{
  return strlen($str) < 1;
}

function bool_to_str($value)
{
  return $value ? 'true' : 'false';
}

function has_whitespace($value)
{
  $whitespaceRegex = "/\s/";
  return preg_match($whitespaceRegex, $value) > 0;
}
?>