<?php 
  require_once 'form_process.php';

  if($op_result['status'] === 'SUCCESS')
  {
    $op_result['data'] = $_POST;
    if(edit_drug($_POST))
    {
      $op_result['data'] = 'Your changes have been saved.';
    }
    else
    {
      $op_result['status'] = 'FAILURE';
      $op_result['data'] = 'Something went wrong. Your changes have not been saved. Please try again.';
    }
  }

  echo json_encode($op_result);
?>