function requestLogin()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/login.php', true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let response = JSON.parse(xhr.responseText);
      if (response.status === 'SUCCESS')
      {
        window.location.href = response.data;
      }
      else if (response.status === 'FAILURE')
      {
        let usernameField = document.getElementById('username');
        let passwordField = document.getElementById('password');
        let usernameFeedback = usernameField.parentElement.getElementsByClassName('invalid-feedback')[0];
        let passwordFeedback = passwordField.parentElement.getElementsByClassName('invalid-feedback')[0];

        if (!isNullOrWhitespace(response.data.username))
        {
          usernameField.classList.add('is-invalid');
          usernameFeedback.innerHTML = response.data.username;
        }
        else
        {
          usernameField.classList.remove('is-invalid');
          usernameFeedback.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.password))
        {
          passwordField.classList.add('is-invalid');
          passwordFeedback.innerHTML = response.data.password;
        }
        else
        {
          passwordField.classList.remove('is-invalid');
          passwordFeedback.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.verify))
        {
          usernameField.classList.add('is-invalid');
          passwordField.classList.add('is-invalid');
          passwordFeedback.innerHTML = response.data.verify;
        }
      }
    }
  }

  let data = jsonifyForm(document.forms['loginForm']);
  xhr.send(encodeURIComponent(data));
}

function requestRegister()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/register.php', true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let response = JSON.parse(xhr.responseText);
      if (response.status === 'SUCCESS')
      {
        window.location.href = response.data;
      }
      else if (response.status === 'FAILURE')
      {
        let usernameField = document.getElementById('username');
        let passwordField = document.getElementById('password');
        let confPasswordField = document.getElementById('confirm_password');
        let usernameFeedback = usernameField.parentElement.getElementsByClassName('invalid-feedback')[0];
        let passwordFeedback = passwordField.parentElement.getElementsByClassName('invalid-feedback')[0];
        let confPasswordFeedback = confPasswordField.parentElement.getElementsByClassName('invalid-feedback')[0];

        if (!isNullOrWhitespace(response.data.username))
        {
          usernameField.classList.add('is-invalid');
          usernameFeedback.innerHTML = response.data.username;
        }
        else
        {
          usernameField.classList.remove('is-invalid');
          usernameFeedback.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.password))
        {
          passwordField.classList.add('is-invalid');
          passwordFeedback.innerHTML = response.data.password;
        }
        else
        {
          passwordField.classList.remove('is-invalid');
          passwordFeedback.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.confirm_password))
        {
          confPasswordField.classList.add('is-invalid');
          confPasswordFeedback.innerHTML = response.data.confirm_password;
        }
        else
        {
          confPasswordField.classList.remove('is-invalid');
          confPasswordFeedback.innerHTML = '';
        }
      }
    }
  }

  let data = jsonifyForm(document.forms['registerForm']);
  xhr.send(encodeURIComponent(data));
}

function loadTable()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/test.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      console.log(response);
    }
  }
  xhr.send();
}

function isNullOrWhitespace(str) { return (str == null) || (str.trim().length < 1); }

function jsonifyForm(form)
{
  let inputs = form.elements;
  let array = {};
  for (const element of inputs)
  {
    if (element.tagName.toLowerCase() === 'button') { continue; }
    array[element.getAttribute('name')] = element.value;
  }
  return JSON.stringify(array);
}