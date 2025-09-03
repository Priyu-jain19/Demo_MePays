/// <summary>
/// Developer Name :- Harshida Parmar
///  Created Date  :- 23-April-2025
///  IMP NOTE      :- IF any function shows "0 references" then still do not remove because we are calling that
///                   function from BUTTON CLICK OR in MODEL-POP-UP.
/// </summary>
$(document).ready(function () {
   
    // Track formula text
    const $formulaInput = $("#formulaInput");
    var $formulaClearInput = $("#formulaInput");
    var $formulaClearCode = $("#formulaCode");
    var $formulaClearName = $("#formulaName");
    // Append clicked operator or condition to the formula box
    $(".operator").on("click", function () {
        const value = $(this).text().trim();
        appendToFormula(value);
    });   
    $("#formulaInput").on('keydown', function (e) {
        if (e.key === "Backspace") {
            var formula = $(this).val().trim();

            // Match the last field inside square brackets (e.g., [House Rent Allowance])
            const lastFieldMatch = formula.match(/\[([^\[\]]+)\]$/);

            if (lastFieldMatch) {
                // Remove the last field from the formula
                formula = formula.slice(0, formula.lastIndexOf(lastFieldMatch[0]));
                $(this).val(formula.trim());
            }
        }
    });   
    $("#searchFields").on("keyup", function () {
        const searchVal = $(this).val().toLowerCase();
        $("#componentList li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchVal) > -1);
        });
    });
    $("#btnApplyFormula").on("click", function () {
        if (!validateFormulaForm()) {
            return; // Stop execution if validation fails
        }
        var finalformulaInput = $("#formulaInput").val();
        //console.log("Raw Input:", $("#formulaInput").val());

       // finalformulaInput = finalformulaInput.replace(/\[([^\]]+)\]/g, '$1');
        //var status = $("#formulaActiveToggle").is(":checked"); 
        var data = {
            Formula_Id: $("#formula_Id").val(),
            Formula_Code: $("#formulaCode").val(),
            Formula_Computation: finalformulaInput,
            FormulaName: $("#formulaName").val()
        };
        // 👇 Only add IsActive if editing (toggle is visible)
        if ($("#formulaActiveToggle").length > 0) {
            data.IsActive = $("#formulaActiveToggle").is(":checked");
        }   
        console.log(data);
        $.ajax({
            url: "/FormulaMaster/AddFormula",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.success) {
                    showAlert("success", response.message);
                    var formulaIdStatus = parseInt($("#formula_Id").val() || 0); 
                    if (formulaIdStatus === 0) {
                        $("#formulaCode").val('');
                        $("#formulaName").val('');
                        $("#formulaInput").val('');
                        setTimeout(function () {
                            window.location.href = '/FormulaMaster/Index';
                        }, 5500);
                    }
                } else {
                    showAlert("danger", response.message);
                }
            },
            error: function (xhr, status, error) {
                alert("Error: " + xhr.responseText);
            }
        });
    });
   
    $("#btnClear").on("click", function () {
        const urlParams = new URLSearchParams(window.location.search);
        const formulaIdForReset = urlParams.get('formulaId');

        if (formulaIdForReset) {
            // Edit Mode: Reload original formula from backend
            $.ajax({
                url: `/FormulaMaster/GetFormulaData?formulaId=${encodeURIComponent(formulaIdForReset)}`,
                type: "GET",
                success: function (response) {
                    if (response) {
                        $formulaClearCode.val(response.formula_Code);
                        $formulaClearName.val(response.formulaName);
                        $formulaClearInput.val(response.formula_Computation);

                        // 🟡 Update the hidden field with the original formula
                        $('#hiddenFieldWithUnderscores').val(response.formula_Computation);

                        // 🔁 Re-run component loader to apply grey highlighting again
                        loadPayComponentList();
                    }
                },
                error: function () {
                    alert("Failed to reload formula details.");
                }
            });
        } else {
            // Add Mode: Just clear everything
            $formulaClearInput.val('');
            $formulaClearCode.val('');
            $formulaClearName.val('');
            $('#hiddenFieldWithUnderscores').val('');

            // Re-load list without highlighting any field
            loadPayComponentList();
        }
    });

    function updateComponentListHighlight(formulaString) {
        // Loop all component list items and toggle 'field-appended' based on formula string
        $('#componentList li.field-item').each(function () {
            var componentName = $(this).data('name');
            var regex = new RegExp('\\b' + componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
            if (regex.test(formulaString)) {
                $(this).addClass('field-appended');
            } else {
                $(this).removeClass('field-appended');
            }
        });
    }

    $("#btnFormulaCancle").on("click", function () {
        window.location.href = "/FormulaMaster/Index";
    });
    function validateFormulausingNCalc() {
        var validateformulaInput = $("#formulaInput").val();
        var validateformulaInputWithUnderscore = $("#hiddenFieldWithUnderscores").val();
        validateformulaInput = validateformulaInput.replace(/\[([^\]]+)\]/g, '$1'); // Optional: If needed to modify brackets
        //console.log(validateformulaInput);

        $.ajax({
            url: "/FormulaMaster/ValidateFormula",           
            datatype: "json",
            data: { formulaVal: validateformulaInputWithUnderscore },
            success: function (response) {
                if (response.success) {
                   
                } else {
                    $("#formulaInput-error").text("");
                    $("#formulaInput-error").text(response.message);
                }
            },
            error: function (err) {
                alert('Error in validating formula');
                console.error(err);
            }
        });
    }   

    function validateFormulaForm() {
        var isValid = true;
        var firstInvalidField = null;

        const formulaCode = $("#formulaCode").val();
        const formulaName = $("#formulaName").val();
        //const formulaInput = $("#formulaInput").val().trim();
        var rawformulaInput = $("#formulaInput").val().trim();
        var formulaInput = rawformulaInput.trim(); 
        //    // ✅ Validate formulaCode
            if (!validateFormRequired(formulaCode, "#formulaCode-error", "Please enter formula code.")) {
                isValid = false;
                firstInvalidField ??= "#formulaCode";
            } else if (!validateFormMaxLength(formulaCode, 20, "#formulaCode-error", "Formula code must not exceed 20 characters.")) {
                isValid = false;
                firstInvalidField ??= "#formulaCode";
            } else if (!doesNotStartWithSpace(formulaCode)) {
                $("#formulaCode-error").text("Formula code should not start with a space.");
                isValid = false;
                firstInvalidField ??= "#formulaCode";
            } else if (!hasNoConsecutiveSpaces(formulaCode)) {
                $("#formulaCode-error").text("Formula code should not contain consecutive spaces.");
                isValid = false;
                firstInvalidField ??= "#formulaCode";
            } else if (!hasOnlyAllowedCharacters(formulaCode)) {
                $("#formulaCode-error").text("Formula code should not contains special characters.");
                isValid = false;
                firstInvalidField ??= "#formulaCode";
            }
            //} else if (isOnlyDigits(formulaCode)) {
            //    $("#formulaCode-error").text("Formula code cannot contain only numbers.");
            //    isValid = false;
            //    firstInvalidField ??= "#formulaCode";
            //}
            else {
                $("#formulaCode-error").text("");
            }

            // ✅ Validate formulaName
            if (!validateFormRequired(formulaName, "#formulaName-error", "Please enter formula name.")) {
                isValid = false;
                firstInvalidField ??= "#formulaName";
            } else if (!validateFormMaxLength(formulaName, 50, "#formulaName-error", "Formula name must not exceed 50 characters.")) {
                isValid = false;
                firstInvalidField ??= "#formulaName";
            } else if (!doesNotStartWithSpace(formulaName)) {
                $("#formulaName-error").text("Formula name should not start with a space.");
                isValid = false;
                firstInvalidField ??= "#formulaName";
            } else if (!hasNoConsecutiveSpaces(formulaName)) {
                $("#formulaName-error").text("Formula name should not contain consecutive spaces.");
                isValid = false;
                firstInvalidField ??= "#formulaName";
            } else if (!hasOnlyAllowedCharacters(formulaName)) {
                $("#formulaName-error").text("Formula name should not contains special characters.");
                isValid = false;
                firstInvalidField ??= "#formulaName";
            } else if (isOnlyDigits(formulaName)) {
                $("#formulaName-error").text("Formula name cannot contain only numbers.");
                isValid = false;
                firstInvalidField ??= "#formulaName";
            } else {
                $("#formulaName-error").text("");
            }

            // ✅ Validate formulaInput
            if (!validateFormRequired(formulaInput, "#formulaInput-error", "Please enter formula.")) {
                isValid = false;
                firstInvalidField ??= "#formulaInput";
            } else if (!validateFormMaxLength(formulaInput, 250, "#formulaInput-error", "Formula must not exceed 250 characters.")) {
                isValid = false;
                firstInvalidField ??= "#formulaInput";
            } else if (!doesNotStartWithSpace(formulaInput)) {
                $("#formulaInput-error").text("Formula should not start with a space.");
                isValid = false;
                firstInvalidField ??= "#formulaInput";
            } else if (isOnlyDigits(formulaInput)) {
                $("#formulaInput-error").text("Formula cannot contain only numbers.");
                isValid = false;
                firstInvalidField ??= "#formulaInput";
            } else if (!hasNoConsecutiveNumbers(formulaInput)) {
                $("#formulaInput-error").text("Formula cannot contain consecutive numeric values. Add variables between numbers.");
                isValid = false;
                firstInvalidField ??= "#formulaInput";
            } else if (!hasNoConsecutiveSpaces(formulaInput)) {
                $("#formulaInput-error").text("Formula should not contain consecutive spaces.");
                isValid = false;
                firstInvalidField ??= "#formulaInput";
            } else {
                const basicValidationMessage = validateFormula(formulaInput);
                if (basicValidationMessage) {
                    $("#formulaInput-error").text(basicValidationMessage);
                    isValid = false;
                    firstInvalidField ??= "#formulaInput";
                }
                else {
                    const formulaValidationMessage = validateFormulausingNCalc(formulaInput);
                    if (formulaValidationMessage) {
                        $("#formulaInput-error").text(formulaValidationMessage);
                        isValid = false;
                        firstInvalidField ??= "#formulaInput";
                    } else {
                        $("#formulaInput-error").text("");
                    }
                }           
            }
        if (!isValid && firstInvalidField) {
            $(firstInvalidField).focus();
        }

        return isValid;
    }
    function isField(value) {
        // For example, consider a field to be any value that consists of alphanumeric characters (could be enhanced with regex)
        return /^[a-zA-Z0-9_]+$/.test(value);
    }
    function tokenizeFormula(formula) {
        const regex = /\[[^\]]+\]|AND|OR|[+\-*/=<>()]|<=|>=|<>|\d+(\.\d+)?/gi;
        return formula.match(regex) || [];
    }
    function validateFormula(formula) {
        const mathOperators = ["+", "-", "*", "/", "%"];
        const logicalOperators = ["AND", "OR"];
        const comparisonOperators = ["=", "<>", "<", ">", "<=", ">="];
        const brackets = ["(", ")", "{", "}", "[", "]"];
        const operators = [...mathOperators, ...logicalOperators, ...comparisonOperators];

        const tokenizeFormula = (formula) => {
            const regex = /\d+(\.\d+)?|<=|>=|<>|[+\-*/%=(){}\[\]]|AND|OR|\[([^\]]+)\]|[a-zA-Z0-9_ ]+/gi;
            return [...formula.matchAll(regex)].map(m => m[2] ? m[2].trim() : m[0].trim()).filter(Boolean);
        };

        const isOperator = (token) => typeof token === "string" && operators.includes(token.toUpperCase());
        const isBracket = (token) => typeof token === "string" && brackets.includes(token);
        const isComparisonOperator = (token) => typeof token === "string" && comparisonOperators.includes(token.toUpperCase());
        const isLogicalOperator = (token) => typeof token === "string" && logicalOperators.includes(token.toUpperCase());
        const isNumber = (token) => /^[0-9]+(\.[0-9]+)?$/.test(token);
        const isField = (token) => typeof token === "string" && !isOperator(token) && !isBracket(token) && !isNumber(token);
        const isValidToken = (token) => isField(token) || isNumber(token) || isOperator(token) || isBracket(token);

        const tokens = tokenizeFormula(formula);
        if (tokens.length === 0) return "Formula cannot be empty.";

        const bracketStack = [];
        var comparisonCount = 0;

        for (var i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const prev = tokens[i - 1];
            const next = tokens[i + 1];

            if (!isValidToken(token)) return `Invalid token: "${token}"`;

            // Bracket matching
            if (["(", "[", "{"].includes(token)) bracketStack.push(token);
            if ([")", "]", "}"].includes(token)) {
                const lastOpen = bracketStack.pop();
                const expected = { ")": "(", "]": "[", "}": "{" }[token];
                if (lastOpen !== expected) return `Unbalanced or mismatched bracket: expected "${expected}" but found "${token}"`;
            }

            // Field or number followed directly by another field or number = ❌
            if ((isField(token) || isNumber(token)) && (isField(next) || isNumber(next))) {
                return "Missing operator between fields or numbers.";
            }

            // Operator issues
            if (isOperator(token)) {
                if (!prev) return `Operator "${token}" cannot be at the start.`;
                if (!next) return `Operator "${token}" cannot be at the end.`;
                if (isOperator(prev)) return `Invalid sequence: "${prev} ${token}"`;
                if (isOperator(next)) return `Invalid sequence: "${token} ${next}"`;
                if (isComparisonOperator(token)) {
                    comparisonCount++;
                    if (comparisonCount > 1) return "Only one comparison operator allowed.";
                }
            }

            // % must be between valid operands
            if (token === "%" && (!prev || !next || isOperator(prev) || isOperator(next))) {
                return `"%" operator must be between two valid operands.`;
            }

            // Bracket usage checks
            if (["(", "[", "{"].includes(token) && next && !(isField(next) || isNumber(next) || ["(", "[", "{"].includes(next))) {
                return `Invalid token after "${token}": "${next}"`;
            }
            if ([")", "]", "}"].includes(token) && prev && !(isField(prev) || isNumber(prev) || [")", "]", "}"].includes(prev))) {
                return `Invalid token before "${token}": "${prev}"`;
            }
            if ((isField(token) || isNumber(token)) && ["(", "[", "{"].includes(next)) {
                return `Missing operator before "${next}": "${token} ${next}"`;
            }
            if ([")", "]", "}"].includes(token) && (isField(next) || isNumber(next))) {
                return `Missing operator after "${token}": "${token} ${next}"`;
            }

            // ❌ Reject any number with ≥8 digits before decimal
            if (isNumber(token)) {
                const intPart = token.split(".")[0];
                if (intPart.length >= 8) {
                    return `Long numbers (≥8 digits) are not allowed: "${token}"`;
                }
            }
        }

        if (bracketStack.length !== 0) return "Unbalanced parentheses/brackets/braces.";
        return null; // ✅ Valid
    }


});
var allowedComponents = []; // Global list of valid components

var appendedComponents = []; // Tracks appended components

function loadPayComponentList() {
    $('#componentList').empty();
    allowedComponents = []; // Clear previous values before loading new ones

    // Get the formula string from hidden field or variable
    // Assuming you have a hidden input with id 'hiddenFieldWithUnderscores'
    var formulaString = $('#hiddenFieldWithUnderscores').val() || '';

    $.ajax({
        url: '/FormulaMaster/GetPayComponentList',
        type: 'GET',
        success: function (data) {
            if (data.success === false) {
                $('#componentList').append('<li class="text-danger">' + data.message + '</li>');
                return;
            }

            data.data.forEach(function (item) {
                var colorClass = 'text_primary'; // default blue
                if (item.earningDeductionType === 1) {
                    colorClass = 'text-success'; // green
                } else if (item.earningDeductionType === 2) {
                    colorClass = 'text-danger'; // red
                }

                // Check if formulaString contains this component name (case-insensitive)
                // Adjust your logic if the separator is "+" or other
                var componentName = item.earningDeductionName.trim();
                var regex = new RegExp('\\b' + componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');

                var isUsed = regex.test(formulaString);

                $('#componentList').append(`
                    <li class="list-group-item field-item ${isUsed ? 'field-appended' : ''}" 
                        data-id="${item.earningDeduction_Id}" 
                        data-name="${componentName}" 
                        data-status="${item.isActive}">
                        <span class="${colorClass}">${componentName}</span>
                    </li>
                `);

                allowedComponents.push(componentName);
            });

        },
        error: function () {
            $('#componentList').append('<li class="text-danger">Failed to load fields.</li>');
        }
    });
}

/////////////////////////////////////////// OPEN MODEL POP UP:- Start///////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.getElementById('activatePayComponentChk');

    checkbox.addEventListener('change', function () {
        const isChecked = this.checked;

        if (isChecked) {
            // Fetch InActive + Active components
            fetch(`/FormulaMaster/ActivateInActivePayComponentList?IsActive=true`)
                .then(response => response.json())
                .then(data => {
                    $('#componentList').empty();
                    if (data.success === false) {
                        $('#componentList').append('<li class="text-danger">' + data.message + '</li>');
                    } else if (data.data && data.data.length > 0) {
                        data.data.forEach(function (item) {
                            var colorClass = 'text-primary';
                            if (item.earningDeductionType === 1) {
                                colorClass = 'text-success';
                            } else if (item.earningDeductionType === 2) {
                                colorClass = 'text-danger';
                            }
                            $('#componentList').append(`
                                <li class="list-group-item field-item" data-id="${item.earningDeduction_Id}" data-name="${item.earningDeductionName}" data-status="${item.isActive}">
                                    <span class="${colorClass}">${item.earningDeductionName}</span>
                                </li>
                            `);
                        });
                    } else {
                        $('#componentList').append('<li class="text-warning">No components found.</li>');
                    }
                    // ✅ Keep checkbox checked — no code needed here
                })
                .catch(error => {
                    console.error('Error:', error);
                    $('#componentList').append('<li class="text-danger">Something went wrong!</li>');
                });
        } else {
            // Checkbox unchecked — show only active components
            loadPayComponentList();
        }
    });
});

/////////////////////////////////////////// From Index Page///////////////////////////////////////////////
function showSuggestionDropdown(suggestions) {
    var suggestionBox = $('#suggestionBox');
    suggestionBox.empty();

    suggestions.forEach(function (item) {
        var div = $('<div></div>').addClass('suggestion-item').text(item.formula_Computation);
        div.on('click', function () {
            $('#formulaInput').val(item.formula_Computation);
            hideSuggestionDropdown();
        });
        suggestionBox.append(div);
    });

    var inputOffset = $('#formulaInput').offset();
    suggestionBox.css({
        top: inputOffset.top + $('#formulaInput').outerHeight(),
        left: inputOffset.left,
        width: $('#formulaInput').outerWidth()
    });

    suggestionBox.show();
}

function hideSuggestionDropdown() {
    $('#suggestionBox').hide();
}
function fetchFormulaSuggestions(searchText) {
    $.ajax({
        url: '/FormulaMaster/GetFormulaSuggestions',
        type: 'POST',
        data: { searchParam: searchText },
        success: function (response) {
            if (response.success && response.data.length > 0) {
                showSuggestionDropdown(response.data);
            } else {
                hideSuggestionDropdown();
            }
        },
        error: function () {
            hideSuggestionDropdown();
        }
    });
}
function getCurrentFormulaComponents() {
    const formula = $('#formulaInput').val();
    return formula
        .split('+') // split on +
        .map(comp => comp.trim()) // trim whitespace
        .filter(comp => comp.length > 0); // remove empty
}

function updateComponentHighlighting() {
    const currentFormulaComponents = getCurrentFormulaComponents();

    $('#componentList .field-item').each(function () {
        const componentName = $(this).data('name').trim();

        if (currentFormulaComponents.includes(componentName)) {
            $(this).css('background-color', '#e0e0e0'); // grey
        } else {
            $(this).css('background-color', ''); // reset
        }
    });
}

function updateHiddenField() {
    const formula = $("#formulaInput").val();
    $("#hiddenFieldWithUnderscores").val(formula);
}
// Function to append value to the formula input (with or without brackets)

function appendToFormula(value) {
    var formula = $("#formulaInput").val();

    if (allowedComponents.includes(value) && !appendedComponents.includes(value)) {
        appendedComponents.push(value);

        // ✅ Highlight the component in the list
        $("#componentList li").each(function () {
            const itemName = $(this).data("name")?.trim();
            if (itemName === value) {
                $(this).addClass("highlighted-component");
            }
        });
    }

    formula += value;
    $("#formulaInput").val(formula.trim());
    updateHiddenField();
}


$(document).ready(function () {
    //////////////////////////////////Bind the Pay Component:- Start///////////////////////////////////
    loadPayComponentList();
    //////////////////////////////////Bind the Pay Component:- End///////////////////////////////////
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#formulaInput, #suggestionBox').length) {
            hideSuggestionDropdown();
        }
    });
  
    // Assuming appendedComponents is an array keeping track of currently highlighted components
    // You can reassign it on each input event to reflect actual components in formula

    $('#formulaInput').on('input', function () {
        const formula = $(this).val();
        var searchText = $(this).val();
        // Update the hidden field
        updateHiddenField();
        // Regex: split on any operators or symbols you expect
        const currentComponents = formula
            .split(/[\+\-\*\/\=\(\)",<>]+|\band\b|\bor\b|\b<=\b|\b>=\b|\b<\b|\b>\b/g)
            .map(c => c.trim())
            .filter(c => c.length > 0);

        const uniqueComponents = [...new Set(currentComponents)];

        // Clear all highlights first
        $('#componentList li').removeClass('highlighted-component');

        // Re-apply highlights only to those present in formula
        uniqueComponents.forEach(component => {
            $('#componentList li').each(function () {
                if ($(this).data('name')?.trim() === component) {
                    $(this).addClass('highlighted-component');
                }
            });
        });
            if (searchText.length > 2) {
                fetchFormulaSuggestions(searchText);
            } else {
                hideSuggestionDropdown(); // Hide suggestions if the text is too short
            }
        // Update global
        appendedComponents = uniqueComponents;
    });



    // Click event for the field-item
    var activateComponentId = null;
    $(document).on("click", ".field-item", function () {
        const status = $(this).data("status");
        activateComponentId = $(this).data("id"); 
        if (status === false) {
            $("#componentEditModal").modal("show");
            $("#yesEditRole").off('click').on("click", function () {
                const button = $(this); // store reference because inside fetch this will change
                $.ajax({
                    url: `/FormulaMaster/ActivateComponent?componentId=${activateComponentId}`,
                    type: "POST",
                    success: function (data) {                       
                        button.blur();
                        $("#componentEditModal").modal("hide");
                        if (data.success) {
                            loadPayComponentList();
                            showAlert("success", data.message);
                        } else {
                            showAlert("danger", data.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        button.blur();
                        $("#componentEditModal").modal("hide");
                        //console.error('Error:', error);
                        showAlert("danger", 'Error activating component');
                    }
                });     
            });
            $("#noAnotherRole").off('click').on("click", function () {
                $(this).blur();
                $("#componentEditModal").modal("hide");
            });
        } else {
            const field = $(this).text().trim();
            appendToFormula(field, true);
        }
    });
    $(document).on("click", ".formula-btn", function () {
        const value = $(this).text().trim();
        appendToFormula(value, false); // false means no square brackets for operators/conditions
    });
///////////////////// SORT THE PAY COMPONENT USING "Search available fields":-Start///////////////////////
    $(document).on("input", "#field", function () {
        const searchText = $(this).val().toLowerCase();
        $("#componentList li").each(function () {
            const itemText = $(this).text().toLowerCase();

            if (itemText.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
///////////////////// SORT THE PAY COMPONENT USING "Search available fields":-End///////////////////////

});
/////////////////////////////////////////// OPEN MODEL POP UP:- End///////////////////////////////////////
