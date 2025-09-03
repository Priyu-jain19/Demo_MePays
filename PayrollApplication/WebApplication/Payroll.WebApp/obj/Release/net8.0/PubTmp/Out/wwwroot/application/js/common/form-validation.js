$(document).ready(function () {

    // 1. Text Level Validations
    window.validateTextField = function (value) { // Make it globally accessible
        const specialCharRegex = /[!@#$%^&*()_":;?/>><,]/;
        if (specialCharRegex.test(value)) {
            return "Special characters are not allowed.";
        }

        const consecutiveSpacesRegex = /\s{2,}/;
        if (consecutiveSpacesRegex.test(value)) {
            return "Consecutive blank spaces are not allowed.";
        }

        value = $.trim(value);

        const numericValueRegex = /^[0-9]+(\.[0-9]+)?$/;
        if (!numericValueRegex.test(value) && !isNaN(value)) {
            return "Numeric values must be in a valid format with decimal if applicable.";
        }

        const monetaryValueRegex = /^(?:\d{1,3})(?:,\d{3})*(?:\.\d{1,2})?$/;
        if (monetaryValueRegex.test(value)) {
            return "Monetary values must have commas and decimals in the correct format.";
        }

        return null;
    };

    // 2. Special Field Validations
    function validateEmail(value) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) {
            return "Please provide a valid email address.";
        }
        return null;
    }

    function validateMobile(value) {
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(value)) {
            return "Please provide a valid mobile number.";
        }
        return null;
    }

    function validatePincode(value) {
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(value)) {
            return "Please provide a valid pincode.";
        }
        return null;
    }

    function validateIFSC(value) {
        const ifscRegex = /^[A-Za-z]{4}[0-9]{7}$/;
        if (!ifscRegex.test(value)) {
            return "Please provide a valid IFSC code.";
        }
        return null;
    }

    function validatePAN(value) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(value)) {
            return "Please provide a valid PAN.";
        }
        return null;
    }

    function validateAadhaar(value) {
        const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
        if (!aadhaarRegex.test(value)) {
            return "Please provide a valid Aadhaar number.";
        }
        return null;
    }

    function validateVoterCard(value) {
        const voterCardRegex = /^[A-Za-z]{3}[0-9]{7}$/;
        if (!voterCardRegex.test(value)) {
            return "Please provide a valid Voter Card number.";
        }
        return null;
    }

    function validatePassport(value) {
        const passportRegex = /^[A-PR-WY][1-9][0-9]{6,8}$/;
        if (!passportRegex.test(value)) {
            return "Please provide a valid Passport number.";
        }
        return null;
    }

    // Validation for dropdown
    function validateDropdown(dropdown) {
        const selectedValue = dropdown.val();
        if (selectedValue === "" || selectedValue === null) {
            return `Please select ${dropdown.attr('data-name')}.`;
        }
        return null;
    }

    // Validate on form submission
    $('form').on('submit', function (e) {
        let isValid = true;

        // Validate text fields
        $('input[type="text"], textarea').each(function () {
            const errorMsg = validateTextField($(this).val());
            if (errorMsg) {
                $(this).next('.error-message').text(errorMsg);
                isValid = false;
            } else {
                $(this).next('.error-message').text('');
            }
        });

        // Validate email
        $('input[type="email"]').each(function () {
            const errorMsg = validateEmail($(this).val());
            if (errorMsg) {
                $(this).next('.error-message').text(errorMsg);
                isValid = false;
            } else {
                $(this).next('.error-message').text('');
            }
        });

        // Validate mobile
        $('input[type="tel"]').each(function () {
            const errorMsg = validateMobile($(this).val());
            if (errorMsg) {
                $(this).next('.error-message').text(errorMsg);
                isValid = false;
            } else {
                $(this).next('.error-message').text('');
            }
        });

        // Validate other fields
        $('input[name="pincode"]').each(function () {
            const errorMsg = validatePincode($(this).val());
            if (errorMsg) {
                $(this).next('.error-message').text(errorMsg);
                isValid = false;
            } else {
                $(this).next('.error-message').text('');
            }
        });

        $('input[name="ifsc"]').each(function () {
            const errorMsg = validateIFSC($(this).val());
            if (errorMsg) {
                $(this).next('.error-message').text(errorMsg);
                isValid = false;
            } else {
                $(this).next('.error-message').text('');
            }
        });

        // Validate dropdowns
        $('select').each(function () {
            const errorMsg = validateDropdown($(this));
            if (errorMsg) {
                $(this).next('.error-message').text(errorMsg);
                isValid = false;
            } else {
                $(this).next('.error-message').text('');
            }
        });

        // Prevent form submission if not valid
        if (!isValid) {
            e.preventDefault();
        }
    });

});
