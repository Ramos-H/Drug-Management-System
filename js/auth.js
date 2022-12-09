function authRedirect()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/auth_redirect.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let response = JSON.parse(xhr.responseText);
      if (response.status === 'SUCCESS')
      {
        document.body.classList.remove('d-none');
      }
      else
      {
        window.location.href = response.data;
      }
    }
  }

  xhr.send();
}

function logOut()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/logout.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let response = JSON.parse(xhr.responseText);
      if (response === 'SUCCESS')
      {
        window.location.href = 'login.html';
      }
    }
  }

  xhr.send();
}