<?php 
  require_once 'form_process.php';

  if($op_result['status'] === 'SUCCESS')
  {
    if(insert_new_drug($_POST))
    {
      $op_result['data'] = 'The drug has been successfully added to the database!';
    }
    else
    {
      $op_result['status'] = 'FAILURE';
      $op_result['data'] = 'Something went wrong. The drug has not been added to the database. Please try again.';
    }
  }

  echo base64_encode(json_encode($op_result));
?>