<?php
  require_once 'database.php';
  require_once 'utils.php';
  $has_submitted = !empty($_POST);
  if($has_submitted)
  {
    // Decode JSON data from AJAX submission
    $_POST = json_decode(array_keys($_POST)[0], true);
  }

  $op_result = array('status' => 'SUCCESS', 
                      'data' => 'The selected drug/s were deleted successfully!');

  foreach ($_POST as $key => $inv_num)
  {
    if(!delete_drug($inv_num)) 
    {
      $op_result['status'] = 'FAILURE';
      $op_result['data'] = 'Something went wrong. Please refresh the page and try again. ';
      break;
    }
  }

  echo json_encode($op_result);
?>