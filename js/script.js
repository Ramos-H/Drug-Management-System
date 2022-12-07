

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

function loadAllData()
{
  loadMainTable();
  loadDrugExpireReport();
  loadLowDrugReport();
  loadDrugTypeReport();
  loadManufacturerReport();
  loadInventoryReport();
}

function loadMainTable()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/main_table.php', true);
  
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

        let inv_no = null;

        // Add all property values
        for (let key in entry)
        {
          if (Object.hasOwnProperty.call(entry, key))
          {
            let value = entry[key];

            if (key === 'INV_NO')
            {
              inv_no = value;
              row.setAttribute('onclick', `viewEntry(${inv_no})`);
              continue;
            }

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
        updateButton.setAttribute('onclick', `editEntry(event, ${inv_no})`);
        updateButton.classList.add('btn', 'btn-primary');
        
        let deleteButton = document.createElement('button');
        deleteButton.appendChild(document.createTextNode('Delete'));
        deleteButton.setAttribute('onclick', `deleteEntry(event, ${inv_no})`);
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
    }
  }
  xhr.send();
}

function viewEntry(inv_no)
{
  loadDrugInModal(inv_no);
  setFormReadOnly(true);

  let confirmBtn = document.getElementById('drugInfoConfirmBtn');
  
  document.getElementById('drugInfoCancelBtn').innerText = 'Close';
  confirmBtn.innerText = 'Edit';

  confirmBtn.setAttribute('onclick', `editEntry(event, ${inv_no})`);
  
  let modal = document.getElementById('drugInfoModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.show();
}

function editEntry(event, inv_no)
{
  event.stopPropagation();

  loadDrugInModal(inv_no);
  setFormReadOnly(false);
  
  document.getElementById('drugInfoCancelBtn').innerText = 'Cancel';
  document.getElementById('drugInfoConfirmBtn').innerText = 'Save changes';

  let modal = document.getElementById('drugInfoModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.show();
}

function deleteEntry(event, inv_no)
{
  event.stopPropagation();
  alert('Delete: ' + inv_no);
}

function loadDrugInModal(inv_no)
{
  setFormValuesToLoading();
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/modal_drug_load.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let table = JSON.parse(xhr.responseText);

      let field_name_generic = document.getElementById('name_generic');
      let field_name_brand = document.getElementById('name_brand');
      let field_drug_strength = document.getElementById('drug_strength');
      let field_drug_strength_unit = document.getElementById('drug_strength_unit');
      let field_drug_dosage = document.getElementById('drug_dosage');
      let field_drug_type = document.getElementById('drug_type');
      let field_date_manufactured = document.getElementById('date_manufactured');
      let field_date_expiration = document.getElementById('date_expiration');
      let field_quantity = document.getElementById('quantity');
      let field_drug_manufacturer = document.getElementById('drug_manufacturer');
      let field_drug_mnemonic = document.getElementById('drug_mnemonic');
      let field_drug_synonym = document.getElementById('drug_synonym');

      field_name_generic.value = table.DRUG_NAME_GEN;
      field_name_brand.value = table.DRUG_NAME_BRAND;
      field_drug_strength.value = table.DRUG_STRENGTH;
      field_drug_strength_unit.value = table.STRENGTH_UNIT;
      field_drug_dosage.value = table.DRUG_DOSE;
      field_drug_type.selectedIndex = field_drug_type.options.namedItem(table.DRUG_TYPE);
      field_date_manufactured.value = table.DRUG_DATE_MAN.split(" ")[0];
      field_date_expiration.value = table.DRUG_DATE_EXP.split(" ")[0];
      field_quantity.value = table.DRUG_QUANTITY;
      field_drug_manufacturer.value = table.DRUG_MANUFACTURER;
      field_drug_mnemonic.value = table.DRUG_MNEMONIC;
      field_drug_synonym.value = table.DRUG_SYNONYM;
    }
  }
  xhr.send(JSON.stringify({inv_num : inv_no}));
}

function loadManufacturerReport()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/report_manufacturer.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let table = JSON.parse(xhr.responseText);
      let main_table = document.getElementById('report_manufacturer');
      for (const entry of table)
      {
        let row = document.createElement('tr');

        // Add all property values
        for (let key in entry)
        {
          if (Object.hasOwnProperty.call(entry, key))
          {
            let value = entry[key];
            let column = document.createElement('td');
            if (key === 'DRUG_MANUFACTURER')
            {
              column.classList.add('text-start');
            }

            if (key === 'PERCENTAGE')
            {
              value += '%';
            }
            let valueText = document.createTextNode(value);
            column.appendChild(valueText);
            row.appendChild(column);
          }
        }

        // Append row to table
        main_table.appendChild(row);
      }
    }
  }

  xhr.send();
}

function loadDrugTypeReport()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/report_drug_type.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let table = JSON.parse(xhr.responseText);
      let main_table = document.getElementById('report_drug_type');
      for (const entry of table)
      {
        let row = document.createElement('tr');

        // Add all property values
        for (let key in entry)
        {
          if (Object.hasOwnProperty.call(entry, key))
          {
            let value = entry[key];
            let column = document.createElement('td');
            if (key === 'DRUG_TYPE')
            {
              column.classList.add('text-start');
            }

            if (key === 'PERCENTAGE')
            {
              value += '%';
            }
            let valueText = document.createTextNode(value);
            column.appendChild(valueText);
            row.appendChild(column);
          }
        }

        // Append row to table
        main_table.appendChild(row);
      }
    }
  }

  xhr.send();
}

function loadInventoryReport()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/report_drug_inventory.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let table = JSON.parse(xhr.responseText);
      let main_table = document.getElementById('report_drug_inventory');
      for (const entry of table)
      {
        let row = document.createElement('tr');

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

function loadLowDrugReport()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/report_drug_low.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let table = JSON.parse(xhr.responseText);
      let main_table = document.getElementById('report_drug_low');
      for (const entry of table)
      {
        let row = document.createElement('tr');

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

            let valueText = document.createTextNode(value);
            column.appendChild(valueText);
            row.appendChild(column);
          }
        }

        // Append row to table
        main_table.appendChild(row);
      }
    }
  }

  xhr.send();
}

function loadDrugExpireReport()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/report_drug_expire.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let table = JSON.parse(xhr.responseText);
      let main_table = document.getElementById('report_drug_expire');
      for (const entry of table)
      {
        let row = document.createElement('tr');

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

        // Append row to table
        main_table.appendChild(row);
      }
    }
  }

  xhr.send();
}

function showAddDrugModal()
{
  setFormReadOnly(false);
  document.forms['drugModalForm'].reset();

  let confirmBtn = document.getElementById('drugInfoConfirmBtn');

  document.getElementById('drugInfoCancelBtn').innerText = 'Cancel';
  confirmBtn.innerText = 'Add new drug';

  confirmBtn.setAttribute('onclick', `addDrug()`);

  let modal = document.getElementById('drugInfoModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.show();
}

function hideModal()
{
  let modal = document.getElementById('drugInfoModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.hide();
}

function setFormReadOnly(value)
{
  let form = document.forms['drugModalForm'];
  let fields = form.elements;
  for (const field of fields)
  {
    if (value)
    {
      field.setAttribute('readonly', true);
      if (field.getAttribute('id') === 'drug_type')
      {
        field.setAttribute('disabled', true);
      }
    }
    else
    {
      field.removeAttribute('readonly');
      if (field.getAttribute('id') === 'drug_type')
      {
        field.removeAttribute('disabled');
      }
    }
  }
}

function setFormValuesToLoading()
{
  let form = document.forms['drugModalForm'];
  let fields = form.elements;
  for (const field of fields)
  {
    field.value = 'Loading...';
  }
}

function addDrug()
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/drug_info_add_edit.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let response = JSON.parse(xhr.response);
      if (response.status === 'SUCCESS')
      {
        console.log(response.data);
      }
      else if (response.status === 'FAILURE')
      {
        let field_name_generic = document.getElementById('name_generic');
        let field_name_brand = document.getElementById('name_brand');
        let field_drug_strength = document.getElementById('drug_strength');
        let field_drug_strength_unit = document.getElementById('drug_strength_unit');
        let field_drug_dosage = document.getElementById('drug_dosage');
        let field_drug_type = document.getElementById('drug_type');
        let field_date_manufactured = document.getElementById('date_manufactured');
        let field_date_expiration = document.getElementById('date_expiration');
        let field_quantity = document.getElementById('quantity');
        let field_drug_manufacturer = document.getElementById('drug_manufacturer');
        let field_drug_mnemonic = document.getElementById('drug_mnemonic');
        let field_drug_synonym = document.getElementById('drug_synonym');

        let feedback_name_generic       = field_name_generic       .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_name_brand         = field_name_brand         .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_drug_strength      = field_drug_strength      .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_drug_strength_unit = field_drug_strength_unit .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_drug_dosage        = field_drug_dosage        .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_drug_type          = field_drug_type          .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_date_manufactured  = field_date_manufactured  .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_date_expiration    = field_date_expiration    .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_quantity           = field_quantity           .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_drug_manufacturer  = field_drug_manufacturer  .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_drug_mnemonic      = field_drug_mnemonic      .parentElement.getElementsByClassName('invalid-feedback')[0];
        let feedback_drug_synonym       = field_drug_synonym       .parentElement.getElementsByClassName('invalid-feedback')[0];

        if (!isNullOrWhitespace(response.data.name_generic))
        {
          field_name_generic.classList.add('is-invalid');
          feedback_name_generic.innerHTML = response.data.name_generic;
        }
        else
        {
          field_name_generic.classList.remove('is-invalid');
          feedback_name_generic.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.name_brand))
        {
          field_name_brand.classList.add('is-invalid');
          feedback_name_brand.innerHTML = response.data.name_brand;
        }
        else
        {
          field_name_brand.classList.remove('is-invalid');
          feedback_name_brand.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.drug_strength))
        {
          field_drug_strength.classList.add('is-invalid');
          feedback_drug_strength.innerHTML = response.data.drug_strength;
        }
        else
        {
          field_drug_strength.classList.remove('is-invalid');
          feedback_drug_strength.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.drug_strength_unit))
        {
          field_drug_strength_unit.classList.add('is-invalid');
          feedback_drug_strength_unit.innerHTML = response.data.drug_strength_unit;
        }
        else
        {
          field_drug_strength_unit.classList.remove('is-invalid');
          feedback_drug_strength_unit.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.drug_dosage))
        {
          field_drug_dosage.classList.add('is-invalid');
          feedback_drug_dosage.innerHTML = response.data.drug_dosage;
        }
        else
        {
          field_drug_dosage.classList.remove('is-invalid');
          feedback_drug_dosage.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.drug_type))
        {
          field_drug_type.classList.add('is-invalid');
          feedback_drug_type.innerHTML = response.data.drug_type;
        }
        else
        {
          field_drug_type.classList.remove('is-invalid');
          feedback_drug_type.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.date_manufactured))
        {
          field_date_manufactured.classList.add('is-invalid');
          feedback_date_manufactured.innerHTML = response.data.date_manufactured;
        }
        else
        {
          field_date_manufactured.classList.remove('is-invalid');
          feedback_date_manufactured.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.date_expiration))
        {
          field_date_expiration.classList.add('is-invalid');
          feedback_date_expiration.innerHTML = response.data.date_expiration;
        }
        else
        {
          field_date_expiration.classList.remove('is-invalid');
          feedback_date_expiration.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.quantity))
        {
          field_quantity.classList.add('is-invalid');
          feedback_quantity.innerHTML = response.data.quantity;
        }
        else
        {
          field_quantity.classList.remove('is-invalid');
          feedback_quantity.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.drug_manufacturer))
        {
          field_drug_manufacturer.classList.add('is-invalid');
          feedback_drug_manufacturer.innerHTML = response.data.drug_manufacturer;
        }
        else
        {
          field_drug_manufacturer.classList.remove('is-invalid');
          feedback_drug_manufacturer.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.drug_mnemonic))
        {
          field_drug_mnemonic.classList.add('is-invalid');
          feedback_drug_mnemonic.innerHTML = response.data.drug_mnemonic;
        }
        else
        {
          field_drug_mnemonic.classList.remove('is-invalid');
          feedback_drug_mnemonic.innerHTML = '';
        }
        
        if (!isNullOrWhitespace(response.data.drug_synonym))
        {
          field_drug_synonym.classList.add('is-invalid');
          feedback_drug_synonym.innerHTML = response.data.drug_synonym;
        }
        else
        {
          field_drug_synonym.classList.remove('is-invalid');
          feedback_drug_synonym.innerHTML = '';
        }
      }
    }
  }

  let data = jsonifyForm(document.forms['drugModalForm']);
  xhr.send(data);
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