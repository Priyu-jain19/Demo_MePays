/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-280,290,367                                                          *
 *  Description:                                                                                    *
 *  This JavaScript code implements validation, dynamic behavior, and treeview navigation           *
 *  for a multi-tab form containing user information and company details. It includes:              *
 *  - Real-time validation for individual input fields and dropdowns.                               *
 *  - Dynamic filtering of text fields to prevent special characters.                               *
 *  - Cascading dropdowns to dynamically load values based on user selection.                       *
 *  - Form submission using AJAX with client-side validation before sending data.                   *
 *  - Treeview navigation to dynamically enable, disable, and switch tabs based on validation.      *
 *                                                                                                  *                                                                                                  *
 *  Methods:                                                                                        *
 *  - validateField : Validates individual fields and displays error messages as needed.            *
 *  - validatePhoneNumber : Validates phone numbers to ensure they contain 10 digits.               *
 *  - validateEmail : Validates email format using a regular expression.                            *
 *  - validateSpecialCharacters : Ensures text fields like names contain no special characters.     *
 *  - validateMinLength : Validates if a field value meets the minimum required length.             *
 *  - validateNameFields : Validates both first and last name fields for required and length rules. *
 *  - validateFirstTab : Validates all fields in the user information tab.                          *
 *  - validateSecondTab : Validates all fields in the company details tab.                          *
 *  - toggleCompanyDetailsTab : Enables or disables the "Company Details" tab.                      *
 *  - handleFormSubmission : Handles the final form submission after validation.                    *
 *  - Treeview Tab Navigation: Prevents manual tab switching unless the current tab is valid.       *
 *                                                                                                  *
 *  Author: Priyanshi Jain                                                                          *
 *  Date  : 30-Dec-2024                                                                             *
 *                                                                                                  *
 ****************************************************************************************************/

/* #region 1: User Creation and Save User Permissions */
$(document).ready(function ()
{
    // Function to validate a field based on field ID and error message
    function validateField(fieldId, errorMessage) {
        const field = $(`#${fieldId}`);
        const errorElement = $(`#${fieldId}-error`);
        const value = field.val() ? String(field.val()).trim() : '';  // Ensure the value is always a string
        // If field value is empty, show error
        if (!value) {
            field.addClass('error_input');
            errorElement.text(errorMessage).show();
            return false;
        } else {
            // If field value is valid, remove error
            field.removeClass('error_input');
            errorElement.text('').hide();
            return true;
        }
    }

    // Validate Phone Number (10-digit number)
    function validatePhoneNumber(phone) {
        const phoneRegex = /^[0-9]{10}$/; // Allows only 10-digit numbers
        return phoneRegex.test(phone);
    }

    // Validate Email format (simple regex)
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
        return emailRegex.test(email);
    }

    // Validate Special Characters (for names like first name, last name)
    function validateSpecialCharacters(name) {
        const specialCharRegex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
        return specialCharRegex.test(name);
    }

    // Dynamically filter input for First Name (remove special characters)
    $('#fname').on('input', function () {
        const fname = $(this).val();

        // Check if the first name contains special characters
        if (!validateSpecialCharacters(fname)) {
            // Remove special characters if found
            $(this).val(fname.replace(/[^a-zA-Z\s]/g, ''));
            // Display error message for special characters
            $('#fname-error').text('First Name cannot contain special characters or numbers.');
        }
        else {
            // Clear error message if input is valid
            $('#fname-error').text('');
        }
    });
    // Dynamically filter input for Last Name (remove special characters)
    $('#lname').on('input', function () {
        const lname = $(this).val();
        // Check if the last name contains special characters
        if (!validateSpecialCharacters(lname)) {
            // Remove special characters if found
            $(this).val(lname.replace(/[^a-zA-Z\s]/g, ''));
            // Display error message for special characters
            $('#lname-error').text('Last Name cannot contain special characters or numbers.');
        }
        else {
            // Clear error message if input is valid
            $('#lname-error').text('');
        }
    });

    //Added by krunali gohil - 16/01/2025 payroll-377
   
    $(document).on('click', '#getDataButton[data-bs-target="#viewUser"]', function () {
        var viewUserID = $(this).data('userid'); // Get the data-userid attribute value
        console.log('User ID:', viewUserID);
            if (viewUserID) { // Check if userId is not null, undefined, or empty
                fetchuserProfile(viewUserID);
            } else {
                alert('Please select a user to view the profile!');
            }      
    });

    function fetchuserProfile(userId) {
        var id = userId;
        //alert(id);
        $.ajax({
            type: 'GET',
            url: `/User/UserProfile?userId=${userId}`,
            contentType: 'application/json',
            success: function (response) {
                const redirectUrl = `/User/UserProfile?userId=${userId}`;
                window.location.href = redirectUrl;
            },
            error: function (response) {
                alert("Error to send data: " + response);
            }
        });
    }

    //end method payroll-377

    // Validate minimum length (e.g., for name fields)
    function validateMinLength(fieldId, minLength) {
        const field = $(`#${fieldId}`);
        const value = field.val().trim();
        if (value.length < minLength) {
            field.addClass('error_input');
            $(`#${fieldId}-error`).text(`Minimum ${minLength} characters required`).show();
            return false;
        }
        return true;
    }

    // Validate First and Last Name fields (required and minimum 2 characters)
    function validateNameFields() {
        let isValid = true;

        // Validate First Name: Required and Minimum 2 characters
        isValid &= validateField('fname', 'First Name is required.');
        isValid &= validateMinLength('fname', 2);

        // Validate Last Name: Required and Minimum 2 characters
        isValid &= validateField('lname', 'Last Name is required.');
        isValid &= validateMinLength('lname', 2);

        return isValid;
    }
    // Validate fields in the first tab (user information)
    function validateFirstTab() {
        let isValid = true;

        isValid &= validateField('phone', 'Enter phone number is required.') &&
            validatePhoneNumber($('#phone').val().trim());
        // Validate Email - Show error message if email format is invalid
        const email = $('#email').val().trim();
        if (!email) {
            isValid &= validateField('email', 'Enter email address is required.');
        } else if (!validateEmail(email)) {
            $('#email-error').text('Enter a valid email address.').show();
            $('#email').addClass('error_input');
            isValid = false;
        } else {
            $('#email-error').text('').hide();
            $('#email').removeClass('error_input');
        }

        isValid &= validateField('countries', 'Enter country is required.');
        isValid &= validateField('salutationsDropdown', 'Enter salutation is required.');
        isValid &= validateField('username', 'Enter username is required.');
        //isValid &= validateField('fname', 'Enter first name is required.');
        //isValid &= validateField('lname', 'Enter last name is required.');
        // Check First and Last Name validation
        isValid &= validateNameFields();
        return isValid;
    }
    // Prevent manual input of non-numeric values in Phone Field
    $('#phone').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, ''); // Replace non-numeric characters
    });

    // Validate fields in the second tab (company details)
    function validateSecondTab() {
        let isValid = true;

        isValid &= validateField('Companies', 'Company is required.');
        isValid &= validateField('countriesname', 'Country is required.');
        isValid &= validateField('state', 'State is required.');
        isValid &= validateField('branch', 'City is required.');
        isValid &= validateField('department', 'Location is required.');
        isValid &= validateField('role', 'Role is required.');
        isValid &= validateField('effectiveFromDt', 'Effective From Date is required.');

        return isValid;
    }

    // Attach real-time validation for text fields (user information)
    $('#fname, #lname, #email, #phone, #username,#countries').on('input', function () {
        validateField($(this).attr('id'), `${$(this).attr('placeholder')} is required.`);
    });

    // Attach real-time validation for dropdown fields (company details)
    $('#usertype, #salutationsDropdown, #countries, #state, #branch, #department, #role, #Companies, #countriesname').on('change', function () {
        validateField($(this).attr('id'), 'This field is required.');
    });

    // Attach onfocus event to clear error messages and styles when the user focuses on the field
    $('#fname, #lname, #email, #phone, #username,#countries').on('focus', function () {
        const fieldId = $(this).attr('id');
        $(`#${fieldId}`).removeClass('error_input');
        $(`#${fieldId}-error`).text('').hide();
    });


    // Function to toggle tab state based on validation
    function toggleTabState(tabId, disable) {
        const tabElement = $(`#${tabId}`);
        if (disable) {
            tabElement.addClass('disabled').attr('aria-disabled', 'true').attr('tabindex', '-1');
        } else {
            tabElement.removeClass('disabled').removeAttr('aria-disabled').removeAttr('tabindex');
        }
    }


    // Initial State: Disable all tabs except the first
    toggleTabState('v-pills-profile-tab', true);
    toggleTabState('v-pills-messages-tab', true);

    // Prevent manual tab switching if validation fails
    $('button[data-bs-toggle="pill"]').on('click', function (e) {
        const clickedTabId = $(this).attr('id');

        if (clickedTabId === 'v-pills-profile-tab' && !validateFirstTab()) {
            e.preventDefault();
            $('#common-validation-message').text('Please correct the errors in the User Information tab.');
        } else if (clickedTabId === 'v-pills-messages-tab' && !validateSecondTab()) {
            e.preventDefault();
            $('#common-validation-message').text('Please correct the errors in the Company Details tab.');
        }
    });

    // Handle "Next" button on the first tab
    $('#nextTab').on('click', function () {
        if (validateFirstTab()) {
            toggleTabState('v-pills-profile-tab', false);
            $('#v-pills-profile-tab').trigger('click');
        } else {
            $('#common-validation-message').text('Please correct the errors in the User Information tab.');
        }
    });

    // Handle "Previous" button on the second tab with validation
    $('#previousFirstTab').on('click', function (e) {
        if (validateFirstTab()) {
            toggleTabState('v-pills-home-tab', false);  // Enable tab explicitly to ensure it's clickable
            $('#v-pills-home-tab').trigger('click');
        } else {
            $('#common-validation-message').text('Please correct the errors in the User Information tab.');
        }
    });

    let selectedRoles = [];  // Declare outside the function to store roles globally

    // Handle form submission or tab change after validating second tab
    $("#nextButton").on("click", function (e) {
        e.preventDefault();
        if (validateSecondTab()) {
            const data = {
                userType_Id: $("#usertype").val(),
                Entity: $("#dropdownTextbox").text().trim(),
                Salutation: $("#salutationsDropdown").val(),
                FirstName: $("#fname").val(),
                MiddleName: $("#mname").val(),
                LastName: $("#lname").val(),
                country: $("#countries").val(),
                PhoneNumber: $('#countries option:selected').text() + '-' + $('#phone').val(),
                Email: $("#email").val(),
                Username: $("#username").val(),
                CompanyId: $("#Companies").val(), // Select2 dropdown
                CountryId: $("#countriesname").val(),
                State: $("#state").val(),
                City: $("#branch").val(),
                EffectiveFromDt: $("#effectiveFromDt").val(),
                Correspondance_ID: $("#department").val() ? $("#department").val().map(Number) : [], // Multi-select values
                Role_Menu_Header_Id: $("#role").val() ? $("#role").val().map(Number) : [] // Multi-select values
            };
            selectedRoles = $("#role").val() ? $("#role").val().map(function (roleId) {
                return {
                    id: roleId,
                    text: $("#role option[value='" + roleId + "']").text().trim()
                };
            }) : [];

            $.ajax({
                url: "/User/AddRecord",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    console.log("usereffectiveFromDt" + response.usereffectiveFromDt);
                    if (response.success != null && response.success != "") {
                        $("#userId").val(response.userId); //Added By Harshida Save value of UserID in Textbox for future use.
                        $("#usereffectiveFromDt").val(response.usereffectiveFromDt); //Added By Harshida Save value of effectiveFromDt in Textbox for future use.
                        showAlert("success", response.message);
                        $("#v-pills-messages-tab").tab('show');
                    } else {
                        showAlert("danger", response.message);
                    }
                },
                error: function (xhr) {
                    showAlert("danger", "An error occurred while creating the user: " + xhr.responseText);
                }
            });
            // Add your form submission or tab change logic here
        } else {
            $('#common-validation-message').text('Please correct the errors in the second tab.');

        }

    });
    function populateRoleDropdown() {
        const roleDropdown = $("#userRole");
        roleDropdown.empty();  // Clear previous options

        if (selectedRoles.length > 0) {
            selectedRoles.forEach(function (role) {
                roleDropdown.append(new Option(role.text, role.id));
            });
        } else {
            roleDropdown.append(new Option("No Role Selected", ""));
        }
    }

    // Clear errors on input focus
    $('input, select').on('focus change', function () {
        $(this).removeClass('error_input');
        $(`#${$(this).attr('id')}-error`).text('').hide();
    });

    $('#v-pills-messages-tab').on('shown.bs.tab', function ()
    {
        populateRoleDropdown(); // Populate role dropdown

        // Initialize variables for roleId and companyId
        let roleId = $("#userRole").val(); // Selected role ID from populated dropdown
        const companyId = $("#Companies").val(); // Get selected company ID

        // Attach change event to dynamically update roleId
        $('#userRole').on('change', function () {
            roleId = $(this).val();  // Update roleId based on current dropdown selection
            if (roleId && companyId) {
                fetchMenuData(roleId, companyId); // Fetch menu data with new roleId
            } else {
                alert('Please select a role.');
            }
        });

        // Initial fetch when tab is shown
        if (roleId && companyId) {
            fetchMenuData(roleId, companyId);  // Fetch menu data with the initial selection
        } else {
            alert('Please select a role.');
        }
    });
    // Function to fetch menu data
    function fetchMenuData(roleId, companyId) {
        $.ajax({
            url: `/User/FetchUserRoleMenuByRoleId?roleId=${roleId}&company_Id=${companyId}`,
            method: 'GET',
            success: function (response) {
                if (response.success) {
                    const menuData = response.data.result;
                    console.log("Menu With Header And Details ID"+ menuData);
                    $('.treeview').empty();  // Clear previous treeview data
                    const menuTreeHtml = generateTreeView(menuData, 0);  // Start with ParentMenu_Id = 0
                    $('.treeview').append(menuTreeHtml);
                    initializeTreeToggle();  // Initialize toggle functionality
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error fetching menu data.');
            }
        });
    }

    // Recursive function to generate tree view HTML
    /*Created By Priyanshi :- Start*/
    //function generateTreeView(menuItems, parentId) {
    //    let treeHtml = '<ul>';
    //    menuItems.forEach(function (item) {
    //        if (item.parentMenuId === parentId) {
    //            let permissionsHtml = '';
    //            if (item.hasPerDtl) {
    //                permissionsHtml = `
    //                <div id="permissions-${item.menu_Id}" class="permissions" style="display: none; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
    //                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
    //                        ${item.grantAdd ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="add-' + item.menu_Id + '"> Add</label>' : ''}
    //                        ${item.grantView ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="view-' + item.menu_Id + '"> View</label>' : ''}
    //                        ${item.grantEdit ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="edit-' + item.menu_Id + '"> Edit</label>' : ''}
    //                        ${item.grantDelete ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="delete-' + item.menu_Id + '"> Delete</label>' : ''}
    //                        ${item.grantRptPrint ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="rptprint-' + item.menu_Id + '"> Report Print</label>' : ''}
    //                        ${item.grantRptDownload ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="rptdownload-' + item.menu_Id + '"> Report Download</label>' : ''}
    //                        ${item.docDownload ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="docdownload-' + item.menu_Id + '"> Document Download</label>' : ''}
    //                        ${item.docUpload ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="docupload-' + item.menu_Id + '"> Document Upload</label>' : ''}
    //                    </div>
    //                </div>`;
    //            }
    //            treeHtml += `
    //            <li>
    //                <span class="toggle"></span>
    //                <input type="checkbox" id="menu-${item.menu_Id}" class="menu-checkbox" data-menu-id="${item.menu_Id}"
    //                    data-role-menu-hdr-id="${item.role_Menu_Hdr_Id}"
    //                    data-role-menu-dtl-id="${item.role_Menu_Dtl_Id}"
    //                >
    //                <label class="lg-text-500" for="menu-${item.menu_Id}">${item.menuName}</label>
    //                ${permissionsHtml}
    //                ${generateTreeView(menuItems, item.menu_Id)} <!-- Recursive Call -->
    //            </li>`;
    //        }
    //    });
    //    treeHtml += '</ul>';
    //    return treeHtml;
    //}

    // Function to recursively uncheck a checkbox, its children, grandchildren, and the permission checkboxes inside the permission div
    /* Created By Priyanshi:- End */
  
    function generateTreeView(menuItems, parentId) {
        let treeHtml = '<ul>';
        menuItems.forEach(function (item) {
            if (item.parentMenuId === parentId) {  // Parent-child relation is maintained here
                let permissionsHtml = '';
                if (item.hasPerDtl)
                {
                    permissionsHtml = `
                <div id="permissions-${item.menu_Id}" class="permissions" style="display: none; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${item.grantAdd ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="add-' + item.menu_Id + '"> Add</label>' : ''}
                        ${item.grantView ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="view-' + item.menu_Id + '"> View</label>' : ''}
                        ${item.grantEdit ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="edit-' + item.menu_Id + '"> Edit</label>' : ''}
                        ${item.grantDelete ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="delete-' + item.menu_Id + '"> Delete</label>' : ''}
                        ${item.grantRptPrint ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="rptprint-' + item.menu_Id + '"> Report Print</label>' : ''}
                        ${item.grantRptDownload ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="rptdownload-' + item.menu_Id + '"> Report Download</label>' : ''}
                        ${item.docDownload ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="docdownload-' + item.menu_Id + '"> Document Download</label>' : ''}
                        ${item.docUpload ? '<label style="flex: 1 0 45%;"><input type="checkbox" id="docupload-' + item.menu_Id + '"> Document Upload</label>' : ''}
                    </div>
                </div>`;
                }
                treeHtml += `
            <li>
                <span class="toggle"></span>
                <input type="checkbox" id="menu-${item.menu_Id}" 
                    class="menu-checkbox" 
                    data-menu-id="${item.menu_Id}" 
                    data-role-menu-hdr-id="${item.role_Menu_Hdr_Id}" 
                    data-role-menu-dtl-id="${item.role_Menu_Dtl_Id}">
                <label class="lg-text-500" for="menu-${item.menu_Id}">${item.menuName}</label>
                ${permissionsHtml}
                ${generateTreeView(menuItems, item.menu_Id)} <!-- Recursive Call -->
            </li>`;
            }
        });
        treeHtml += '</ul>';
        return treeHtml;
    }
    function uncheckAllChildren(menuId) {
        // Uncheck the current checkbox
        $(`#menu-${menuId}`).prop('checked', false);

        // Uncheck all permission checkboxes within the associated permission div
        $(`#permissions-${menuId}`).find('input[type="checkbox"]').prop('checked', false);

        // Hide the permissions for this menu item
        $(`#permissions-${menuId}`).slideUp();

        // Find and recursively uncheck all child checkboxes
        $(`#menu-${menuId}`).closest('li').find('ul li').each(function () {
            const childMenuId = $(this).find('.menu-checkbox').data('menu-id');
            uncheckAllChildren(childMenuId); // Recursively uncheck all child checkboxes and hide permissions
        });
    }

    // Handle checkbox click to toggle permissions visibility and uncheck child/grandchild checkboxes when parent is unchecked
    $(document).on('change', '.menu-checkbox', function () {
        const menuId = $(this).data('menu-id');
        const isChecked = $(this).is(':checked');

        // Toggle visibility of permissions based on checkbox state
        if (isChecked) {
            $(`#permissions-${menuId}`).slideDown();
        } else {
            $(`#permissions-${menuId}`).slideUp();
        }

        // If this checkbox is unchecked, uncheck all child/grandchild checkboxes and hide permissions
        if (!isChecked) {
            uncheckAllChildren(menuId); // Uncheck child/grandchild checkboxes and hide permissions
        }
    });

    // Initialize toggle functionality
    function initializeTreeToggle() {
        $('.treeview').on('click', '.toggle', function () {
            $(this).siblings('ul').toggle();
            $(this).toggleClass('open');
        });
    }

    $('#savePermissions').on('click', function () {
        const permissionsData = getSelectedPermissions();
        console.log(permissionsData);

        const roleId = $('#userRole').val();  // Get selected role ID
        const companyId = $('#Companies').val();  // Get selected company ID
        const userId = $('#userId').val(); //Added By Harshida 13-01-'25
        const effectiveFromDt = $('#effectiveFromDt').val(); //Added By Harshida 13-01-'25
        if (permissionsData.length > 0 && roleId && companyId) {
            $.ajax({
                url: '/User/SaveUserRoleMenuPermissions',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ roleId, companyId, permissionsData, userId, effectiveFromDt }),
                success: function (response) {
                    if (response.type == "success") {                       
                        //showAlert("success", response.message || 'Permissions saved successfully!');   
                        var userAddedModal = new bootstrap.Modal(document.getElementById('userAddedModal'));
                        userAddedModal.show();                       
                    }
                    else {
                        showAlert("danger", response.message || 'Failed to save permissions.');
                    }
                },
                error: function () {
                    showAlert("danger", "An error occurred while creating the user: " + xhr.responseText);
                }
            });
        } else {
            showAlert("danger", "Please select permissions and ensure Role are selected.");
        }
    });

});
/* #endregion */

/* #region 2: User Creation and Save User Permissions */

//
////MOST IMP NOTE:- For below function
    ////1 . "addNewUser()" is used after inserted successfully and if wish to insert to another user.
    ////2 . "goToUserList()" is used after  inserted successfully and if wish to redirect to LIST PAGE.
//
function addNewUser() { //Please do not remove these fuction READ ABOVE NOTE
    const url = "/User/AddRecord";
    window.location.href = url;
}
function goToUserList() { //Please do not remove these fuction READ ABOVE NOTE
    const url = "/User/Index";
    window.location.href = url; 
}
//Added By Harshida 09-01-'25:- Start
function getSelectedPermissions() {
    const selectedPermissions = [];

    // Loop through each checkbox with the class 'menu-checkbox'
    $('.menu-checkbox:checked').each(function () {
        const menuId = $(this).data('menu-id');

        // Traverse up the DOM tree to find the closest parent 'li' and its associated 'parent-id'
        const parentMenuId = $(this).closest("ul").closest("li").find("input.menu-checkbox").data("menu-id") || null;

        const roleMenuHdrId = $(this).data('role-menu-hdr-id');
        const roleMenuDtlId = $(this).data('role-menu-dtl-id');

        // Collect permissions for the current menu item
        const permissions = {
            menuId: menuId,
            parentMenuId: parentMenuId, // Parent ID of the current menu item
            roleMenuHdrId: roleMenuHdrId,
            roleMenuDtlId: roleMenuDtlId,
            permissions: {
                add: $('#add-' + menuId).prop('checked'),
                view: $('#view-' + menuId).prop('checked'),
                edit: $('#edit-' + menuId).prop('checked'),
                delete: $('#delete-' + menuId).prop('checked'),
                rptPrint: $('#rptprint-' + menuId).prop('checked'),
                rptDownload: $('#rptdownload-' + menuId).prop('checked'),
                docDownload: $('#docdownload-' + menuId).prop('checked'),
                docUpload: $('#docupload-' + menuId).prop('checked')
            }
        };

        // Add the collected permissions data to the selectedPermissions array
        selectedPermissions.push(permissions);
    });

    // Return the array of selected permissions
    return selectedPermissions;
}
$(document).ready(function () {
    let selectedButton = null;

    $(document).on('click', '.btn-danger-light-icon[data-bs-target="#deleteUser"]', function () {
        selectedButton = $(this);
        console.log('Delete button selected:', selectedButton);
    });

    $('#confirmUserDelete').on('click', function () {
        console.log('Confirm delete clicked');
        if (selectedButton) {
            var userId = selectedButton.data('userid');
            let rowId = `row-${userId}`; // Construct the row ID
            var email = selectedButton.data('email');
            var contactNo = selectedButton.data('contactno');
            var companyName = selectedButton.data('companyname');
            console.log('Sending data to server:', userId);

            // Prepare data object
            var rowData = {
                UserId: userId,
                Email: email,
                ContactNo: contactNo,
                CompanyName: companyName
            };
            console.log('Sending data to server:', rowData);

            $.ajax({
                url: '/User/DeleteUser', // Use the URL directly
                datatype: 'json',
                data: rowData,
                success: function (response) {
                    if (response === 'Record deleted successfully') {
                        // Hide the row
                        $(`#${rowId}`).fadeOut(500, function () {
                            $(this).remove(); // Remove the row from DOM after fadeOut
                        });
                        showAlert('success', response);
                    }
                    $('#deleteUser').modal('hide');
                },
                error: function (error) {
                    console.error('Error deleting user:', error);
                    $('#deleteUser').modal('hide');
                }
            });
        }
    });
    $("#username").on("keydown", function (event) {      
        if (event.keyCode === 9) {           
            $(this).trigger("change");
        }
    });
    $("#username").on("change", function () {
        var email = $(this).val();
        if (email) {          
            $.ajax({
                url: '/User/CheckUserExist',
                type: 'GET',
                data: { email: email },
                success: function (response) {                   
                    if (response.success) {                      
                        showAlert("success", response.message);                       
                    }
                    else {                       
                        showAlert("danger", response.message);                    
                        $("#username").focus();
                    }
                },
                error: function () {
                    showAlert("danger", "An error occurred while checking the email.");                      
                }
            });
        } else {
            showAlert("danger","Please enter a valid email.");             
        }
    });

});

//Added By Harshida 09-01-'25:- End





//$.ajax({
//    type: "POST",
//    url: "/User/GetUsers",
//    data: '{}',
//    contentType: "application/json; charset=utf-8",
//    dataType: "json",
//    success: OnSuccess,
//    failure: function (responseModel) {
//        alert(responseModel.d);
//    },
//    error: function (responseModel) {
//        alert(responseModel.d);
//    }
//});
//function OnSuccess(responseModel) {
//    $("#tblUser").DataTable(
//        {
//            Filter: true,
//            Sort: true,
//            Paginate: true,
//            pageLength: 5,
//            lengthMenu: [5, 10, 15, 20, 25],
//            processing: true,
//            data: responseModel.modelListData,
//            columns: [
//                {
//                    "title": "#",
//                    render: function (data, type, row, meta) {
//                        var index = meta.row + 1 + 1000
//                        return index;
//                    }
//                },
//                {
//                    data: "FullName",
//                    "title": "Full Name",
//                    orderable: false,
//                    render: function (data, type, row, meta) {
//                        return `${row.firstName || ''} ${row.middleName || ''} ${row.lastName || ''}`.trim();
//                    }
//                },
//                {
//                    data: "Gender",
//                    "title": "Gender",
//                    orderable: false,
//                    render: function (data, type, row, meta) {
//                        return row.gender;
//                    }
//                },
//                {
//                    data: "Email",
//                    "title": "Email",
//                    orderable: false,
//                    render: function (data, type, row, meta) {
//                        return row.email;
//                    }
//                },
//                {
//                    data: "DateOfBirth",
//                    "title": "Date Of Birth",
//                    orderable: false,
//                    render: function (data, type, row, meta) {
//                        return row.dateOfBirth;
//                    }
//                },
//                {
//                    data: "IsActive",
//                    "title": "Status",
//                    orderable: false,
//                    render: function (data, type, row, meta) {
//                        const statusButtonClass = row.isActive ? 'btn-success' : 'btn-danger';
//                        const statusButtonText = row.isActive ? 'Active' : '&nbsp Inactive';
//                        const handlePositionClass = row.isActive ? 'handle-right' : 'handle-left';
//                    }
//                }
//            ],
//            "columnDefs": [
//                {
//                    "targets": "_all",
//                    "render": function (data, type, row, meta) {
//                        return "<th>" + row.title + "</th>";
//                    }
//                }
//            ]
//        }
//    );

//};

