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
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let table = JSON.parse(xhr.responseText);
      let main_table = document.getElementById('main_table');
      for (const entry of table)
      {
        let row = document.createElement('tr');

        // Add checkbox
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        let checkboxCell = document.createElement('td');
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        // Add all property values
        for (let key in entry)
        {
          if (Object.hasOwnProperty.call(entry, key))
          {
            let value = entry[key];
            let column = document.createElement('td');
            if (key === 'DRUG_NAME_GEN')
            {
              column.classList.add('text-start');
            }
            
            let valueText = null;
            if (key === 'DRUG_DATE_MAN' || key === 'DRUG_DATE_EXP')
            {
              valueText = document.createTextNode(value.split(' ')[0]);
            }
            else
            {
              valueText = document.createTextNode(value);
            }

            column.appendChild(valueText);

            row.appendChild(column);
          }
        }

        // Create operation buttons
        let btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');

        let updateButton = document.createElement('button');
        updateButton.appendChild(document.createTextNode('Update'));
        updateButton.setAttribute('type', 'button');
        updateButton.classList.add('btn', 'btn-primary');

        let deleteButton = document.createElement('button');
        deleteButton.appendChild(document.createTextNode('Delete'));
        deleteButton.setAttribute('type', 'button');
        deleteButton.classList.add('btn', 'btn-primary');

        btnGroup.appendChild(updateButton);
        btnGroup.appendChild(deleteButton);

        let btnGroupCell = document.createElement('td');
        btnGroupCell.appendChild(btnGroup);

        row.appendChild(btnGroupCell);

        // Append row to table
        main_table.appendChild(row);
      }

      // Refresh table styles
      let tableContainer = main_table.parentElement;
      let classes = [];
      for (const value of tableContainer.classList.values())
      {
        classes.push(value);
        tableContainer.classList.remove(value);
      }

      for (const value of classes)
      {
        tableContainer.classList.add(value);
      }
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