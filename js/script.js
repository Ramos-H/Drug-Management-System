// REGISTER and LOGIN
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
        let inv_no = entry['INV_NO'];
        row.setAttribute('onclick', `showViewModal(${inv_no})`);

        // Add checkbox
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', inv_no);
        let checkboxCell = document.createElement('td');
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        // Add all property values
        for (let key in entry)
        {
          if (Object.hasOwnProperty.call(entry, key))
          {
            let value = entry[key];

            if (key === 'INV_NO') { continue; }

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
        updateButton.setAttribute('onclick', `showEditModal(event, ${inv_no})`);
        updateButton.classList.add('btn', 'btn-primary');
        
        let deleteButton = document.createElement('button');
        deleteButton.appendChild(document.createTextNode('Delete'));
        deleteButton.setAttribute('onclick', `showDeleteSanityModal(event, [${inv_no}])`);
        deleteButton.setAttribute('type', 'button');
        deleteButton.classList.add('btn', 'btn-danger');

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

// DRUG INFO MODAL
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

function showViewModal(inv_no)
{
  hideSanityModal();
  loadDrugInModal(inv_no);
  setFormReadOnly(true);

  let confirmBtn = document.getElementById('drugInfoConfirmBtn');
  
  document.getElementById('drugInfoCancelBtn').innerText = 'Close';
  confirmBtn.innerText = 'Edit';

  confirmBtn.setAttribute('onclick', `showEditModal(event, ${inv_no})`);
  
  let modal = document.getElementById('drugInfoModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.show();
}

function showEditModal(event = null, inv_no = -1)
{
  if(event !== null) { event.stopPropagation(); }

  hideSanityModal();
  if(inv_no > -1) { loadDrugInModal(inv_no); }
  setFormReadOnly(false);
  
  document.getElementById('drugInfoCancelBtn').innerText = 'Cancel';
  const confirmBtn = document.getElementById('drugInfoConfirmBtn');
  confirmBtn.innerText = 'Save changes';
  confirmBtn.setAttribute('onclick', `validateDrugForm(${inv_no})`);

  let modal = document.getElementById('drugInfoModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.show();
}

function showAddModal(shouldReset = true)
{
  hideSanityModal();
  setFormReadOnly(false);
  if (shouldReset)
  {
    document.forms['drugModalForm'].reset();
  }

  let drugInfoModal = document.getElementById('drugInfoModal');
  let drugInfoModalObject = bootstrap.Modal.getOrCreateInstance(drugInfoModal);
  drugInfoModalObject.hide();

  let confirmBtn = document.getElementById('drugInfoConfirmBtn');

  document.getElementById('drugInfoCancelBtn').innerText = 'Cancel';
  confirmBtn.innerText = 'Add new drug';

  confirmBtn.setAttribute('onclick', `validateDrugForm()`);

  let modal = document.getElementById('drugInfoModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.show();
}

function hideDrugModal()
{
  let modal = document.getElementById('drugInfoModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.hide();
}

// DRUG INFO LOGIC
function validateDrugForm(inv_no = -1)
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/validate_form.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let response = JSON.parse(xhr.response);
      if (response.status === 'SUCCESS')
      {
        if (inv_no > -1) { showEditDrugSanityModal(inv_no); }
        else { showAddDrugSanityModal(); }
      }
      else if (response.status === 'FAILURE')
      {
        let field_name_generic       = document.getElementById('name_generic');
        let field_name_brand         = document.getElementById('name_brand');
        let field_drug_strength      = document.getElementById('drug_strength');
        let field_drug_strength_unit = document.getElementById('drug_strength_unit');
        let field_drug_dosage        = document.getElementById('drug_dosage');
        let field_drug_type          = document.getElementById('drug_type');
        let field_date_manufactured  = document.getElementById('date_manufactured');
        let field_date_expiration    = document.getElementById('date_expiration');
        let field_quantity           = document.getElementById('quantity');
        let field_drug_manufacturer  = document.getElementById('drug_manufacturer');
        let field_drug_mnemonic      = document.getElementById('drug_mnemonic');
        let field_drug_synonym       = document.getElementById('drug_synonym');

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

        setFieldState(response.data.name_generic,       field_name_generic,       feedback_name_generic);
        setFieldState(response.data.name_brand,         field_name_brand,         feedback_name_brand);
        setFieldState(response.data.drug_strength,      field_drug_strength,      feedback_drug_strength);
        setFieldState(response.data.drug_strength_unit, field_drug_strength_unit, feedback_drug_strength_unit);
        setFieldState(response.data.drug_dosage,        field_drug_dosage,        feedback_drug_dosage);
        setFieldState(response.data.drug_type,          field_drug_type,          feedback_drug_type);
        setFieldState(response.data.date_manufactured,  field_date_manufactured,  feedback_date_manufactured);
        setFieldState(response.data.date_expiration,    field_date_expiration,    feedback_date_expiration);
        setFieldState(response.data.quantity,           field_quantity,           feedback_quantity);
        setFieldState(response.data.drug_manufacturer,  field_drug_manufacturer,  feedback_drug_manufacturer);
        setFieldState(response.data.drug_mnemonic,      field_drug_mnemonic,      feedback_drug_mnemonic);
        setFieldState(response.data.drug_synonym,       field_drug_synonym,       feedback_drug_synonym);
      }
    }
  }

  let data = formToArray(document.forms['drugModalForm']);
  data['inv_num'] = inv_no;
  xhr.send(encodeURIComponent(JSON.stringify(data)));
}

function submitDrugForm(inv_no = -1)
{
  const xhr = new XMLHttpRequest();
  let address = '../php/';
  address += (inv_no > -1) ? 'drug_edit.php' : 'drug_add.php';

  xhr.open("POST", address, true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      let response = JSON.parse(xhr.response);
      if (response.status === 'SUCCESS')
      {
        document.getElementById('sanityBody').innerText = response.data;
        document.getElementById('sanityFooter').classList.add('d-none');
      }
      else if (response.status === 'FAILURE')
      {
        document.getElementById('sanityBody').innerText = response.data;
        document.getElementById('sanityCancelBtn').innerText = 'Go back';
        document.getElementById('sanityConfirmBtn').classList.add('d-none');
      }
    }
  }

  let data = formToArray(document.forms['drugModalForm']);
  data['inv_num'] = inv_no;
  xhr.send(encodeURIComponent(JSON.stringify(data)));
}

function deleteDrugs(inv_nums)
{
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '../php/delete_drugs.php', true);
  
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = () => { // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
    {
      console.log(xhr.response);
      let response = JSON.parse(xhr.response);
      if (response.status === 'SUCCESS')
      {
        document.getElementById('sanityBody').innerText = response.data;
        document.getElementById('sanityFooter').classList.add('d-none');
      }
      else if (response.status === 'FAILURE')
      {
        document.getElementById('sanityBody').innerText = response.data;
        document.getElementById('sanityCancelBtn').innerText = 'Go back';
        document.getElementById('sanityConfirmBtn').classList.add('d-none');
      }
    }
  }

  let data = {};
  for (let index = 0; index < inv_nums.length; index++)
  {
    let element = inv_nums[index].toString();
    let idx = index.toString();
    data[idx] = element.toString();
    console.log(`idx: ${idx}`);
    console.log(`element: ${element}`);
  }

  let result = JSON.stringify(data);
  console.log(result);
  xhr.send(encodeURIComponent(result));
}

// SANITY CHECK MODAL
function showMassDeleteSanityModal()
{
  let table = document.getElementById('main_table').getElementsByTagName('input');
  let inv_nums = [];
  for (let item of table)
  {
    if (item.getAttribute('type') === 'checkbox')
    {
      let inv_num = item.getAttribute('id');
      if (!isNullOrWhitespace(inv_num) && item.checked)
      {
        inv_nums.push(inv_num);
        console.log(item);
      }
    }
  }

  showDeleteSanityModal(null, inv_nums);
}

function showDeleteSanityModal(event, inv_nums)
{
  if(event !== null) { event.stopPropagation() };
  hideDrugModal();
  resetSanityModal();

  let sanityBody = document.getElementById('sanityBody');
  sanityBody.innerText = `Are you sure you want to delete ${(inv_nums.length > 1) ? 'the selected drugs' : 'this drug'}?`;
  document.getElementById('sanityCancelBtn') .setAttribute('onclick', 'hideSanityModal()');
  document.getElementById('sanityConfirmBtn').setAttribute('onclick', `deleteDrugs([${inv_nums}])`);

  let sanityModal = document.getElementById('sanityModal');
  let sanityModalObject = bootstrap.Modal.getOrCreateInstance(sanityModal);
  sanityModalObject.show();
}

function resetSanityModal()
{
  document.getElementById('sanityCancelBtn') .classList.remove('d-none');
  document.getElementById('sanityConfirmBtn').classList.remove('d-none');
  document.getElementById('sanityFooter')    .classList.remove('d-none');
}

function showAddDrugSanityModal()
{
  hideDrugModal();
  resetSanityModal();

  let sanityBody = document.getElementById('sanityBody');
  sanityBody.innerText = 'Are you sure you want to add this drug?';
  document.getElementById('sanityCancelBtn') .setAttribute('onclick', 'showAddModal(false)');
  document.getElementById('sanityConfirmBtn').setAttribute('onclick', 'submitDrugForm()');

  let sanityModal = document.getElementById('sanityModal');
  let sanityModalObject = bootstrap.Modal.getOrCreateInstance(sanityModal);
  sanityModalObject.show();
}

function showEditDrugSanityModal(inv_no)
{
  hideDrugModal();
  resetSanityModal();

  let sanityBody = document.getElementById('sanityBody');
  sanityBody.innerText = 'Are you sure you want to save your changes to this drug?';
  document.getElementById('sanityCancelBtn').setAttribute('onclick', `showEditModal(null, ${inv_no})`);
  if (inv_no > -1)
  {
    document.getElementById('sanityConfirmBtn').setAttribute('onclick', `submitDrugForm(${inv_no})`);
  }

  let sanityModal = document.getElementById('sanityModal');
  let sanityModalObject = bootstrap.Modal.getOrCreateInstance(sanityModal);
  sanityModalObject.show();
}

function hideSanityModal()
{
  let modal = document.getElementById('sanityModal');
  let modalObject = bootstrap.Modal.getOrCreateInstance(modal);
  modalObject.hide();
}

// REPORTS
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

// UTILITIES

function isNullOrWhitespace(str) { return (str == null) || (str.trim().length < 1); }

function formToArray(form)
{
  let inputs = form.elements;
  let array = {};
  for (const element of inputs)
  {
    if (element.tagName.toLowerCase() === 'button') { continue; }
    array[element.getAttribute('name')] = element.value;
  }
  return array;
}

function jsonifyForm(form)
{
  return JSON.stringify(formToArray(form));
}

function setFieldState(value, field, feedback)
{
  if (!isNullOrWhitespace(value))
  {
    field.classList.add('is-invalid');
    feedback.innerHTML = value;
  }
  else
  {
    field.classList.remove('is-invalid');
    feedback.innerHTML = '';
  }
}