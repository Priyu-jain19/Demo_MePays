//function validateFormRequired(value, errorElement, errorMessage) {
//    if (!value || value.trim() === "") {
//        $(errorElement).text(errorMessage);
//        return false;
//    }
//    $(errorElement).text(""); // Clear error if valid
//    return true;
//}
function validateDPFormRequired(value, errorElement, errorMessage) {
    if (!value || value.trim() === "") {
        $(errorElement).text(errorMessage);
        return false;
    }    
    $(errorElement).text("");
    return true;
}
function validateFormRequired(value, errorElement, errorMessage) { 
    if (!value || value.trim() === "") {
        $(errorElement).text(errorMessage);
        return false;
    }
    if (/\s{2,}/.test(value)) {
        $(errorElement).text("Value should not contain consecutive white spaces.");
        return false;
    }
    $(errorElement).text(""); 
    return true;
}
function validateDropdownRequired(selector, errorSelector, message) {
    var value = $(selector).val();

    if (!value || String(value).trim() === "") {
        $(errorSelector).text(message).show();
        return false;
    } else {
        $(errorSelector).text('').hide();
        return true;
    }
}


function bindRequiredDropdown(selector, errorSelector, message) {
    $(selector).on('change', function () {
        const val = $(this).val();
        if (!val) {
            $(errorSelector).text(message);
        } else {
            $(errorSelector).text('');
        }
    });
}
function OnKeyUPandInput(inputSelector, errorSelector) {
    const $input = $(inputSelector);
    const $error = $(errorSelector);

    if (!$input.length) return;

    // Prevent invalid key characters
    $input.on('keydown', function (e) {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Validate and sanitize input
    $input.on('input', function () {
        var original = this.value;

        var cleaned = original
            .replace(/[^\d.]/g, '')                 // Remove non-digit except dot
            .replace(/(\..*?)\..*/g, '$1')          // Only one dot
            .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2'); // Max 2 decimals

        if (original !== cleaned) {
            this.value = cleaned;
        }

        // Remove error message if valid input
        if (cleaned) {
            $error.text('');
        }
    });
}
function removeErrorOnChange(selector) {
    $(document).on('input change', selector, function () {
        var fieldId = $(this).attr('id');
        $('#' + fieldId + '-error').text('');
    });
}

//function preventNegativeInputById(inputId) {
//    $(document).on('keydown', `#${inputId}`, function (e) {
//        if (e.key === '-' || e.keyCode === 189) {
//            e.preventDefault();
//        }
//    });
//}
//Common Function for prevent negative value by Class
function preventNegativeInputByClass(className) {
    $(document).on('keydown', `.${className}`, function (e) {
        // Block: minus sign (-), 'e', and 'E'
        if (
            e.key === '-' ||
            e.key === 'e' ||
            e.key === 'E' ||
            e.keyCode === 69 ||   // 'E' key
            e.keyCode === 189     // minus key
        ) {
            e.preventDefault();
        }
    });
  
}
function validateFloat2DecimalLive(value, fieldId, fieldName) {
    const errorId = `${fieldId}-error`;

    if (!value) {
        $(errorId).text(`${fieldName} is required.`);
        return false;
    }

    const regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(value)) {
        $(errorId).text(`${fieldName} must be a number with up to 2 decimal places.`);
        return false;
    } else {
        $(errorId).text("");
        return true;
    }
}

//ONLY USED IN FORMULA PLEASE DO NOT CHANGE IT.
function hasNoConsecutiveNumbers(input) { 
    const formula = input.trim();

    if (formula === "") return true;

    const tokens = formula.split(/([+\-*/%()\[\]{}\s]+)/).map(t => t.trim()).filter(t => t !== "");

    var lastWasNumber = false;

    for (const token of tokens) {
        if (/^\d+$/.test(token)) {
            if (lastWasNumber) {
                return false; 
            }
            lastWasNumber = true;
        } else if (!/^[+\-*/%()\[\]{}]$/.test(token)) {         
            lastWasNumber = false;
        }       
    }
    return true; 
}

function validateFormMaxLength(value, maxLength, errorElement, errorMessage) {  
    if (value.trim().length > maxLength) {
        $(errorElement).text(errorMessage);
        return false;
    }
    $(errorElement).text(""); // Clear error if valid
    return true;
}

// Checks if from <= to (for numbers like salary, amount etc.)
function validateNumericRange(minVal, maxVal, errorSelector, message) {
    if (parseFloat(minVal) > parseFloat(maxVal)) {
        $(errorSelector).text(message);
        return false;
    } else {
        $(errorSelector).text("");
        return true;
    }
}

// Checks if from <= to (for dates)
function validateDateRange(fromDateStr, toDateStr, errorSelector, message) {
    var fromDate = new Date(fromDateStr);
    var toDate = new Date(toDateStr);
    if (fromDate > toDate) {
        $(errorSelector).text(message);
        return false;
    } else {
        $(errorSelector).text("");
        return true;
    }
}

// Checks if numeric field is not negative
function validateNonNegative(value, errorSelector, message) {
    if (parseFloat(value) < 0) {
        $(errorSelector).text(message);
        return false;
    } else {
        $(errorSelector).text("");
        return true;
    }
}

function validateMonthRange(value, errorSelector, errorMessage) {
    if (value && (value < 1 || value > 12)) {
        $(errorSelector).text(errorMessage);
        return false;
    }
    $(errorSelector).text("");
    return true;
}

function validateNonNegativeIfNotNull(value, errorSelector, errorMessage) {
    if (value !== "" && parseFloat(value) < 0) {
        $(errorSelector).text(errorMessage);
        return false;
    }
    $(errorSelector).text("");
    return true;
}
function hasOnlyAllowedCharacters(value) {
    const allowedRegex = /^[a-zA-Z0-9 _-]*$/; // letters, numbers, space, underscore, hyphen
    return allowedRegex.test(value);
}
function hasNoConsecutiveSpaces(value) {
    return !/\s{2,}/.test(value);
}
function doesNotStartWithSpace(value) {
    return !(value.length > 0 && value.charAt(0) === " ");
}
function isOnlyDigits(value) {
    return /^\d+$/.test(value);
}

////////////////////////////////// Phone Number Validation Data Type Start:- nvarchar(20)/////////////////////////////////////
function validateFormPrimaryPhoneNumber(value, errorElement) {
    var phoneRegex = /^[0-9]{10,11}$/; // Only digits, min 10 - max 11 characters

    if (!value.trim()) {
        $(errorElement).text("Primary phone number is required.");
        return false;
    }

    if (!phoneRegex.test(value)) {
        $(errorElement).text("Primary phone number must be 10 to 11 digits long.");
        return false;
    }

    $(errorElement).text("");
    return true;
}
function validateFormSecondaryPhoneNumber(value, errorElement) {
    var phoneRegex = /^[0-9]{10,11}$/; // Only digits, min 10 - max 11 characters

    if (value.trim() === "") {
        $(errorElement).text(""); // Secondary phone is optional
        return true;
    }

    if (!phoneRegex.test(value)) {
        $(errorElement).text("Secondary phone number must be 10 to 11 digits long.");
        return false;
    }

    $(errorElement).text("");
    return true;
}
////////////////////////////////// Phone Number Validation Data Type End:- nvarchar(20)/////////////////////////////////////

////////////////////////////////// Email Validation Data Type Start:- nvarchar(100)/////////////////////////////////////

function validateFormPrimaryEmail(value, errorElement) {
    // Trim spaces
    value = value.trim();

    // Check for leading spaces or leading dots
    if (/^[.\s]/.test(value)) {
        $(errorElement).text("Email should not start with a space or dot.");
        return false;
    }
    if (value.trim() === "") {
        $(errorElement).text("Please Provide Email Address."); 
        return true;
    }
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
        $(errorElement).text("Please enter a valid email address (e.g., example@domain.com).");
        return false;
    }
    $(errorElement).text("");
    return true;
}
function validateFormSecondaryEmail(value, errorElement) {
    // Trim spaces
    value = value.trim();

    // Check for leading spaces or leading dots
    if (/^[.\s]/.test(value)) {
        $(errorElement).text("Email should not start with a space or dot.");
        return false;
    }
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
        $(errorElement).text("Please enter a valid email address (e.g., example@domain.com).");
        return false;
    }
    $(errorElement).text("");
    return true;
}
////////////////////////////////// Email Validation Data Type End:- nvarchar(100)/////////////////////////////////////

function validateFormURL(value, errorElement) {
    var urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i;
    if (value.trim() !== "" && !urlRegex.test(value)) {
        $(errorElement).text("Please enter a valid Website URL (e.g., https://example.com).");
        return false;
    }
    $(errorElement).text("");
    return true;
}
function validateFormDropdown(value, errorElement, errorMessage) {
    if (!value || value === "") {
        $(errorElement).text(errorMessage);
        return false;
    }
    $(errorElement).text("");
    return true;
}