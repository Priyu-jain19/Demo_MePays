$(document).ready(function () {
    // Step 1: Restrict OTP input to only numeric characters
    $("#txtOTP").on('input', function () {
        // Replace any non-numeric characters with an empty string
        this.value = this.value.replace(/\D/g, '');

        // Limit input to 6 digits
        if (this.value.length > 6) {
            this.value = this.value.slice(0, 6);
        }
    });
});

$('#btnShowPassword').click(function () {
    var passwordInput = $('#txtPassword');
    var passwordFieldType = passwordInput.attr('type');

    // Toggle password visibility
    if (passwordFieldType === 'password') {
        passwordInput.attr('type', 'text');
        $(this).addClass('fa fa-eye-slash').removeClass('icon-eye');
    } else {
        passwordInput.attr('type', 'password');
        $(this).addClass('icon-eye').removeClass('fa fa-eye-slash');
    }
});

/// Added by Krunali gohil payroll-377
// code start

$('#userRole').on('Keyup change', function () {

    let roleId = $("#userRole").val(); // Selected role ID from populated dropdown
    if (roleId != 0) {
        const companyId = $("#CompanyName").attr("itemid");
        let userId = $("#UserTypeName").attr("itemid");// Get selected company ID
        fetchMenuData(companyId, roleId, userId);
    }
});


function fetchMenuData(companyId, roleId, userId) {
    $.ajax({
        url: `/User/FetchUserRoleMenuByUserIdRoleIdCompanyId?companyId=${companyId}&roleId=${roleId}&userId=${userId}`,  // Example URL (adjust as needed)
        method: 'GET',
        success: function (response) {
            if (response.success) {
                // alert("Data fetched successfully");
                console.log("Menu Data:", response.data);

                // Clear previous treeview data
                $('.treeview').empty();

                // Ensure `response.data.result` exists
                const menuData = response.data.result;
                if (menuData && menuData.length > 0) {
                    const menuTreeHtml = generateTreeView(menuData, 0);  // Start with ParentMenu_Id = 0
                    $('.treeview').append(menuTreeHtml);
                    initializeTreeToggle();  // Initialize toggle functionality
                } else {
                    alert('No menu data available');
                }
            } else {
                alert(response.message);
            }
        },
        error: function () {
            alert('Error fetching menu data.');
        }
    });
}

function initializeTreeToggle() {
    // Ensure all submenus are hidden initially, except the root menu
    $('.treeview ul').hide();  // Hide all nested <ul> by default
    $('.treeview > ul').show(); // Show only the top-level <ul> (root menu)

    // Toggle submenu visibility on click
    $('.treeview').on('click', '.toggle', function () {
        // Toggle the visibility of the next <ul> sibling (the submenu)
        $(this).siblings('ul').toggle();

        // Toggle the 'open' class to change the appearance of the toggle button
        $(this).toggleClass('open');

        // Optional: Change the icon or appearance based on the open/close state
        if ($(this).hasClass('open')) {
            $(this).text('-');  // Example: change to a minus sign when open
        } else {
            $(this).text('+');  // Example: change to a plus sign when closed
        }
    });
}


function generateTreeView(menuItems, parentId) {
    let treeHtml = '<ul>';

    menuItems.forEach(function (item) {
        // Only include items that belong to the current parentId
        if (item.parentMenuId === parentId)
        {
           
 
            let permissionsHtml = '';

            console.log("Generating Parent and child Menu...");

            //   let isChecked; (item.grantRptDownload == true ) ? 'checked' : '';

            // Check if permissions need to be shown
            if (item.hasPerDtl == true) {
                permissionsHtml = `
        <div id="permissions-${item.menu_Id}" class="permissions" style="padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
            <div style="display: flex;flex-direction: row; flex-wrap: wrap; gap: 10px;">
                <label style="flex: 1 0 45%;"><input type="checkbox" id="add-${item.menu_Id}" ${item.grantAdd ? 'checked' : ''}> Add</label>
                <label style="flex: 1 0 45%;"><input type="checkbox" id="view-${item.menu_Id}" ${item.grantView ? 'checked' : ''}> View</label>
                <label style="flex: 1 0 45%;"><input type="checkbox" id="edit-${item.menu_Id}" ${item.grantEdit ? 'checked' : ''}> Edit</label>
                <label style="flex: 1 0 45%;"><input type="checkbox" id="delete-${item.menu_Id}" ${item.grantDelete ? 'checked' : ''}> Delete</label>
                <label style="flex: 1 0 45%;"><input type="checkbox" id="approve-${item.menu_Id}" ${item.grantApprove ? 'checked' : ''}> Approve</label>
                <label style="flex: 1 0 45%;"><input type="checkbox" id="rptprint-${item.menu_Id}" ${item.grantRptPrint ? 'checked' : ''}> Report Print</label>
                <label style="flex: 1 0 45%;"><input type="checkbox" id="rptdownload-${item.menu_Id}" ${item.grantRptDownload ? 'checked' : ''}> Report Download</label>
            </div>
        </div>`;
            }
            else {
                permissionsHtml = `<div id="permissions-${item.menu_Id}" class="permissions" style="display: none; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
							  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
							  <label style="flex: 1 0 45%;"><input type="checkbox" id="add-${item.menu_Id}" > Add</label>
							<label style="flex: 1 0 45%;"><input type="checkbox" id="view-${item.menu_Id}" > View</label>
							<label style="flex: 1 0 45%;"><input type="checkbox" id="edit-${item.menu_Id}" >Edit </label>
							<label style="flex: 1 0 45%;"><input type="checkbox" id="delete-${item.menu_Id}" > Delete </label>
							<label style="flex: 1 0 45%;"><input type="checkbox" id="approve-${item.menu_Id}" > Approve </label>
							<label style="flex: 1 0 45%;"><input type="checkbox" id="rptprint-${item.menu_Id}" >Report Print </label>
							<label style="flex: 1 0 45%;"><input type="checkbox" id="rptdownload-${item.menu_Id}" > Report Download</label>
							  </div></div>`;
            }
          
            treeHtml += `
					<li>
						  <span class="toggle"></span>
							  <input type="checkbox" id="menu1-${item.Menu_Id}" class="menu-checkbox" data-menu-id="${item.menu_Id}" ${item.hasPerDtl ? 'checked' : ''} />
							  <label class="lg-text-500" for="menu-${item.Menu_Id}">${item.menuName}</label>
						${permissionsHtml}

						<!-- Recursive Call for child menus -->
						${generateTreeView(menuItems, item.menu_Id)} <!-- Recursive Call -->
					</li>`;
        }
    });

    treeHtml += '</ul>';
    return treeHtml;
}


$(document).ready(function () {
    let userId = $("UserTypeName").itemid;// Get selected company ID
    userId = $("#UserTypeName").attr("itemid");// Get selected company ID
    if (userId != 0)
    {
        populateRoleDropdown(userId); // Populate role dropdown
    }

});

function populateRoleDropdown(userId) {
    console.log("Populating dropdown...");
    const roleDropdown = $("#userRole");
    roleDropdown.empty();  // Clear previous options
    roleDropdown.append(new Option("--Select Role--", ""));

    // Make an AJAX request to fetch roles
    $.ajax({
        url: `/User/FetchUserRoleMenuByUserId?userId=${userId}`,  // Replace with your actual endpoint to fetch roles
        method: 'GET',  // Method type (GET, POST, etc.)
        success: function (response) {
            console.log("Success", response);  // Log the response for debugging

            // Check if response.data and response.data.result exist and are not empty
            if (response && response.data && response.data.result && response.data.result.length > 0) {
                console.log("Data found")
                // Populate dropdown with roles
                response.data.result.forEach(function (role) {

                    roleDropdown.append(new Option(role.roleName, role.role_Id));
                });

            } else {
                // If no roles are available, show a default option
                roleDropdown.append(new Option("No Role Selected", ""));
            }
        },
        error: function () {
            // If there's an error fetching the roles, display an error message
            roleDropdown.append(new Option("Error fetching roles", ""));
            console.error("Error fetching roles");  // Log the error for debugging
        }
    });
}


// end code payroll-377

var authConfig = null;

function SendEmailAndVerifyOTP(template) {

    showLoader();
    $('#email-validation-message').text('');
    $('#OTP-validation-message').text('');

    var email = $("#txtEmail").val();
    var templateType = template; // forgor password & reset password set from template value.
    var otp = $("#txtOTP").val();
    var isOtpStage = $('#otp-section').hasClass('div-show'); // Check if OTP is visible

    if (!isOtpStage) {
        if (email === '') {
            $('#email-validation-message').text('Please enter your email.');
            return;
        }

        if (!validateEmail(email)) {
            $('#email-validation-message').text('Valid email is required.');
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/User/SendUpdateUserPasswordEmailWithOTP/',
            data: JSON.stringify({ Email: email, TemplateType: templateType }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (responseModel) {
                if (responseModel.isSuccess) {
                    hideLoader();
                    $("#txtEmail").prop('disabled', true);
                    $('#otp-section').toggleClass('div-hide div-show');
                    $('#verify-btn').text('Verify OTP');
                    toastr.success(responseModel.message, 'Success');
                }
                else {

                    if (responseModel.StatusCode === 404) {
                        hideLoader();
                        toastr.error(responseModel.message, 'Error');
                    }
                    else {
                        hideLoader();
                        $('#otp-section').toggleClass('div-hide div-show');
                        $('#verify-btn').text('Verify OTP');
                        toastr.error(responseModel.message, 'Error');
                    }
                }
            },
            error: function (xhr, status, error) {
                hideLoader();
                $('#email-validation-message').text('An error occurred. Please try again later.');
            }
        });
    }
    else {
        $('#OTP-validation-message').text('');

        var otp = $("#txtOTP").val();

        // Check if OTP is empty
        if (otp === '') {
            $('#OTP-validation-message').text('Please enter your OTP.');
            return;
        }

        // Validate OTP (must be 6 digits)
        var otpPattern = /^[0-9]{6}$/;
        if (!otpPattern.test(otp)) {
            $('#OTP-validation-message').text('OTP must be a 6-digit number.');
            return;
        }

        // Prepare ForgotPasswordModel object with Email and OTP
        var forgotPasswordModel = {
            Email: email,
            OTP: otp
        };

        // Make AJAX POST request
        $.ajax({
            type: 'POST',
            url: '/User/VerifyOTP/',
            data: JSON.stringify(forgotPasswordModel), // Passing model
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (responseModel) {
                authConfig = responseModel.result;
                if (responseModel.isSuccess) {
                    hideLoader();
                    toastr.success(responseModel.message, 'Success');  // OTP verified successfully
                    $('#UpdatePasswordForm').toggleClass('div-show div-hide');
                    $('#verify-btn').addClass('div-hide');
                }
                else {
                    hideLoader();
                    toastr.error(responseModel.message, 'Error');
                }
            },
            error: function (xhr, status, error) {
                hideLoader();
                $('#OTP-validation-message').text('An error occurred. Please try again later.');
            }
        });
    }
}


$('#UpdatePassword').click(function () {

    showLoader();
    $('#new-password-validation-message').text('');
    $('#confirm-password-validation-message').text('');

    var email = $('#txtEmail').val().trim();
    var newPassword = $("#txtNewPassword").val().trim();
    var confirmPassword = $("#txtConfirmPassword").val().trim();

    // Validate new and confirm password
    if (newPassword === '') {
        $('#new-password-validation-message').text('Please enter your new password.');
        return;
    }
    if (confirmPassword === '') {
        $('#confirm-password-validation-message').text('Please enter your confirm password.');
        return;
    }
    if (newPassword !== confirmPassword) {
        $('#confirm-password-validation-message').text('Password and Confirm password do not match.');
        return;
    }

    // Validate the password configuration
    var validationResult = validatePassword(newPassword, authConfig);
    if (!validationResult.isValid) {
        $('#new-password-validation-message').text(validationResult.message);
        return; // Prevent the request if validation fails
    }

    var forgotPasswordAndResetPasswordModel = {
        Email: email,
        NewPassword: newPassword
    };

    $.ajax({
        type: 'POST',
        url: '/User/UpdateUserPassword/',
        data: JSON.stringify(forgotPasswordAndResetPasswordModel), // Passing model
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (responseModel) {
            if (responseModel.isSuccess) {
                hideLoader();
                toastr.success(responseModel.message, 'Success');
                setTimeout(function () {
                    window.location.href = 'https://localhost:7093/';
                }, 2000);
            } else {
                toastr.error(responseModel.message, 'Error');
            }
        },
        error: function () {
            hideLoader();
            $('#OTP-validation-message').text('An error occurred. Please try again later.');
        }
    });
});

function validatePassword(password, config) {
    let messages = [];

    // Check minimum length
    if (config.passwordMinLength && password.length < config.passwordMinLength) {
        messages.push(`Password must be at least ${config.passwordMinLength} characters long.`);
    }

    // Check maximum length
    if (config.passwordMaxLength && password.length > config.passwordMaxLength) {
        messages.push(`Password must not exceed ${config.passwordMaxLength} characters.`);
    }

    // Check special characters
    if (config.hasSpecialCharacter && config.numberOfSpecialCharacters > 0) {
        const specialChars = password.replace(/[A-Za-z0-9]/g, '').length;
        if (specialChars < config.numberOfSpecialCharacters) {
            messages.push(`Password must contain at least ${config.numberOfSpecialCharacters} special character(s).`);
        }
    }

    // Check starting character
    if (config.startWithCharType && !/^[A-Za-z]/.test(password)) {
        messages.push('Password must start with a letter.');
    }

    // Check ending character
    if (config.endWithNumType && !/\d$/.test(password)) {
        messages.push('Password must end with a number.');
    }

    // Check number of digits
    if (config.numberOfDigits && (password.match(/\d/g) || []).length < config.numberOfDigits) {
        messages.push(`Password must contain at least ${config.numberOfDigits} digit(s).`);
    }

    // Check for sequential characters
    if (config.excludeSequence && hasSequentialChars(password, config.excludeSequence)) {
        messages.push('Password contains a sequence of characters that are not allowed.');
    }

    return { isValid: messages.length === 0, message: messages.join(' ') };
}

function hasSequentialChars(password, length) {
    for (let i = 0; i <= password.length - length; i++) {
        let segment = password.slice(i, i + length);
        if (/(\d)\1{2,}/.test(segment) || /([a-zA-Z])\1{2,}/.test(segment)) {
            return true; // Found sequential characters
        }
    }
    return false;
}

function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

