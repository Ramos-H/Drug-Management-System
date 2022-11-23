<?php
function check_str_empty($str)
{
  return strlen($str) < 1;
}

function bool_to_str($value)
{
  return $value ? 'true' : 'false';
}
?>