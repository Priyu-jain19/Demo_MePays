//Dropdown list binding and event


loadDropdown('#salaryBasicDropdown', '/DropDown/FetchSalaryBasicsDropdown');
loadDropdown('#payrollHeadDropdown', '/DropDown/FetchPayrollHeadsDropdown');
loadDropdown('#componentValueTypeDropdown', '/DropDown/FetchComponentValueTypeDropdown');
loadDropdown('#salaryFrequencyDropdown', '/DropDown/FetchSalaryFrequencyDropdown');
//loadDropdown('#formulaDropdown', '/DropDown/FetchFormulaTypeDropdown');


// Add a delay before calling loadPayGradeDropdown
setTimeout(function () {
    loadPayGradeDropdown('#payGradeDropdown', 1);
}, 500); // 500ms delay


// Function to populate dropdown from URL
function loadDropdown(selector, url) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            const $dropdown = $(selector);
            $dropdown.empty().append($('<option>', {
                value: '',
                text: '-- Select --'
            }));

            $.each(data, function (i, item) {
                $dropdown.append($('<option>', {
                    value: item.value,
                    text: item.text
                }));
            });

            const selectedValue = $dropdown.data("selected-value");
            $dropdown.val(selectedValue);

            $dropdown.trigger('change'); // for select2 or any events
        },
        error: function () {
            console.error('Failed to load dropdown data for:', selector);
        }
    });
}

function loadPayGradeDropdown(targetDropdown, companyId) {

    $.ajax({
        url: `/DropDown/FetchActivePayGradeTypeDropdown`,
        method: 'GET',
        data: {
            companyId: companyId
        },
        success: function (data) {
            let dropdown = $(targetDropdown);
            dropdown.empty();
            dropdown.append('<option value="">Select Pay Grade</option>');

            $.each(data, function (index, item) {
                dropdown.append(`<option value="${item.value}">${item.text}</option>`);
            });

            const selectedValue = dropdown.data("selected-value");
            dropdown.val(selectedValue);
            console.log(dropdown.data("selected-value"));

            loadPayComponents('#payComponentDropdown');
        },
        error: function (xhr, status, error) {
            console.error("Failed to load PayGrade dropdown:", error);
            showAlert('danger', "An error occurred while loading the PayGrade dropdown.");
        }
    });
}

function clearSubComponent() {

    $('#dropdownTextbox').text('');
    $('#paycomponentname').val('');
    $('#amountval').val('');
    $('#remarks').val('');
    $('#formualcomp').val('');
    $("#formulaDropdown").val('');
    $("#txtFormula").val('');
    $("#componentValueTypeDropdown").val('');


    // Clear dropdowns and inputs in the component sub form
    $("#txtFormula").val("");

    // Clear error messages
    clearSubComponentError();

}
function clearSubComponentError() {


    // Clear error messages
    $("#payComponentDropdown-error").text("");
    $("#paySubComponentDropdown-error").text("");
    $("#componentValueTypeDropdown-error").text("");
    $("#payrollHeadDropdown-error").text("");
    $("#taxableDropdown-error").text("");
    $("#amountval-error").text("");
    $("#remarks-error").text("");
    $("#formulaDropdown-error").text("");


}

$('#payrollHeadDropdown').on('change', function () {
    if ($(this).val()) {
        clearSubComponent();
        loadPayComponents('#payComponentDropdown');
    }
});


function loadPayComponents(targetDropdown, callback) {
    const payrollHeadID = parseInt($("#payrollHeadDropdown").val()) || 0;
    if (payrollHeadID <= 0) {
        return;
    }

    $.ajax({
        url: '/DropDown/FetchIsParentPaycomponentDropdown',
        method: 'GET',
        data: {
            EarnDedType: payrollHeadID
            // IsChild: isChild
        },
        success: function (data) {
            const dropdown = $(targetDropdown);
            dropdown.empty(); // Clear existing options
            dropdown.append('<option value="">Select Pay Component</option>'); // Add default option

            data.forEach(item => {
                dropdown.append(`<option value="${item.value}">${item.text}</option>`);
            });

            if (callback) callback();

        },
        error: function (xhr, status, error) {
            console.error("Failed to load Component dropdown:", error);
            showAlert('danger', "An error occurred while loading the Component dropdown.");
        }
    });
}

function loadPayComponentsChild(targetDropdown, selectType, selectedId, callback) {
    if (selectedId <= 0) {
        return;
    }

    $.ajax({
        url: `/DropDown/FetchPaycomponentChildDropdown?selectType=${encodeURIComponent(selectType)}&EarningDeduction_Id=${encodeURIComponent(selectedId)}`,
        method: 'GET',

        success: function (data) {
            const dropdown = $(targetDropdown);
            dropdown.empty(); // Clear existing options
            dropdown.append('<option value="">Select Pay Component</option>'); // Add default option

            data.forEach(item => {
                dropdown.append(`<option value="${item.value}">${item.text}</option>`);
            });
            if (callback) callback();
        },
        error: function (xhr, status, error) {
            console.error("Failed to load Component dropdown:", error);
            showAlert('danger', "An error occurred while loading the Component dropdown.");
        }
    });
}


let isProgrammaticChange = false;
let isEditMode = false;
let activeEditIndex = -1;

function editDetail(index) {
    debugger;
    activeEditIndex = index;

    $('#addMoreDetails').hide();
    $('#saveDetails').show();

    clearSubComponentError();

    // Get the selected detail from the list
    const detail = salaryStructureDetailsList[index];

    if (detail) {

        // Populate the form fields in the 'salary-structure-card' div
        isProgrammaticChange = true;
        isEditMode = true;

        $("#payrollHeadDropdown").val(detail.earningDeductionType).trigger('change');
        // Use the callback to set child dropdown value after AJAX completes
        loadPayComponents('#payComponentDropdown', function () {
            // set selected value for component
            $("#payComponentDropdown").val(detail.earningDeductionID).trigger('change');
            $('#payrollHeadDropdown-error').text('');

            // 🔥 only after main component is loaded & set, load the child dropdown
            loadPayComponentsChild('#paySubComponentDropdown', 'H', detail.earningDeductionID, function () {
                $("#paySubComponentDropdown").val(detail.subEarningDeductionID).trigger('change');
            });
        });

        $("#componentValueTypeDropdown").val(detail.calculationType).trigger('change');
        $("#taxableDropdown").val(detail.iStaxable ? "1" : "0").trigger('change');

        //$("#paycomponentname").val(detail.earningDeductionValue || "");
        $("#amountval").val(isNaN(parseFloat(detail.earningDeductionValue)) ? 0 : parseFloat(detail.earningDeductionValue));
        $("#formulaDropdown").val(detail.formula_ID);
        $("#txtFormula").val(detail.formulaName);
        $("#formualcomp").val(detail.formula_Computation);
        $("#remarks").val(detail.remarks || "");

        // Store the index of the row being edited
        $("#saveDetails").data("edit-index", index);

        setTimeout(() => {
        }, 999);

        //let totalCount = $("#payComponentDropdown option").length;
        //console.log('c' + totalCount); // 3


        //let visibleCount = $("#payComponentDropdown option:visible").length;
        //console.log('v' + visibleCount);



        // loadPayComponents('#payComponentDropdown');

        // Scroll to the component input section
        document.getElementById("componentSection").scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    } else {
        showAlert('danger', "Failed to load the selected detail for editing.");
    }
}

$(document).ready(function () {

    $('.select2_search_ctm').select2({
        placeholder: function () {
            return $(this).data('placeholder'); // Set dynamic placeholder from data-placeholder attribute
        },
        allowClear: true,  // Allows clearing the selection (if needed)
        multiple: false,   // Ensure it's a single select dropdown
        dropdownAutoWidth: true,  // Auto adjust dropdown width
        width: '100%'      // Ensures the dropdown takes up full width of its container
    });

    renderSalaryStructureTable();

    // Attach change event to payGradeDropdown
    $('#payGradeDropdown').on('change', function () {
        const selectedId = $(this).val(); // Get the selected value (ID)

        if (selectedId) {
            // Make an AJAX call to fetch data based on the selected ID
            $.ajax({
                url: `/PayConfiguration/GetPayGradeDetailsById/${selectedId}`, // API endpoint
                method: 'GET',
                success: function (response) {
                    if (response.success) {
                        let data = response.data;
                        console.log(data);
                        // Set minSalary and maxSalary values
                        $('#minsalary').val(parseFloat(data.minSalary).toFixed(0));
                        $('#maxsalary').val(parseFloat(data.maxSalary).toFixed(0));

                        // Calculate the difference and set it in the salaryRange text box
                        const salaryRange = data.minSalary + '-' + data.maxSalary;
                        $('#salaryRange').val(salaryRange);
                    } else {
                        // alert('No data found for the selected Pay Grade.');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error fetching Pay Grade details:', error);
                    showAlert('danger', 'An error occurred while fetching Pay Grade details.');
                }
            });
        } else {
            // Clear the fields if no value is selected..
            $('#minsalary').val('');
            $('#maxsalary').val('');
            $('#salaryRange').val('');
        }
    });


    // Live validation for input
    $('.form-control').on('input change', function () {
        const fieldId = $(this).attr('id');
        $(`#${fieldId}-error`).text('');
    });


    // Attach change event to payComponentDropdown
    $('#payComponentDropdown').on('change', function () {

        const selectedId = $(this).val(); // Get the selected value (ID)
        loadPayComponentsChild('#paySubComponentDropdown', 'H', selectedId);

        isProgrammaticChange = false;
        // Add a delay before continuing
        setTimeout(function () {
            if (!isProgrammaticChange) {
                if (selectedId) {
                    // Make an AJAX call to fetch data based on the selected ID
                    $.ajax({
                        url: `/PayConfiguration/GetPayComponentDetailsById/${selectedId}`, // API endpoint
                        method: 'GET',
                        success: function (response) {
                            if (response.success) {
                                let data = response.data;
                                console.log(response.data);
                                // Bind the fetched data to the respective fields
                                // $('#salaryFrequencyDropdown').val(data.salaryFrequency).trigger('change'); // Set value and trigger change event
                                if (data.calculationType === 3) {
                                    $('#formulaSection').show();
                                    $('#amountSection').hide();
                                    // $('#formulaSectionbutton').show();
                                    // loadDropdownWithSelectedValue('#formulaDropdown', '/DropDown/FetchFormulaTypeDropdown', function () {
                                    //     setSelectedValueInDropdown('#formulaDropdown', data.formula_Id);
                                    // });
                                }
                                else if (data.calculationType === 2 || data.calculationType === 1) {
                                    $('#formulaSection').hide();
                                    $('#amountSection').show();
                                }
                                else {
                                    $('#formulaSection').hide();
                                    $('#amountSection').hide();
                                }
                                //////////////////////////For Formula Check:- End
                                // $('#payrollHeadDropdown').val(data.earningDeductionType).trigger('change');
                                $('#amoutval').text(data.Formula || ''); // Set text for dropdownTextbox
                                $('#paycomponentname').val(data.earningDeductionName || ''); // Set value for paycomponentname
                                // $('#payrollHeadDropdown').val(data.earningDeductionType).trigger('change');
                                $("#taxableDropdown").val(data.taxable).trigger('change');
                                $("#componentValueTypeDropdown").val(data.calculationType).trigger('change');
                                $("#formulaDropdown").val(data.formula_Id);
                                $("#txtFormula").val(data.formulaName);
                                $("#formualcomp").val(data.formula_Computation);
                                // $('#remarks').val(data.remarks || ''); // Set value for remarks

                                $('#minValue').val(parseFloat(data.minimumUnit_value).toFixed(0));
                                $('#maxValue').val(parseFloat(data.maximumUnit_value).toFixed(0));

                                
                                    if (data.amount != null && parseFloat(data.amount) > 0) {
                                        // Set fixed value and make readonly
                                        $('#amountval')
                                            .val(parseFloat(data.amount).toFixed(0))
                                            .prop('readonly', true)
                                            .attr('placeholder', ''); // clear placeholder if fixed
                                    } else {

                                        if (!isEditMode) {
                                            // Reset input, allow typing, and show min-max as placeholder
                                            $('#amountval')
                                                .val('')
                                                .prop('readonly', false)
                                                .attr("placeholder", "Enter amount (" + data.minimumUnit_value + " - " + data.maximumUnit_value + ")");
                                        }
                                    }
                                
                                if (callback) callback();
                            } else {
                                // showAlert('danger', 'No data found for the selected Pay Component.');
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error('Error fetching Pay Component details:', error);
                            showAlert('danger', 'An error occurred while fetching Pay Component details.');
                        }
                    });
                } else {
                    // Clear the fields if no value is selected
                    // $('#salaryFrequencyDropdown').val('').trigger('change');
                    clearSubComponent();
                }
            }
        }, 111); // 500ms delay before continuing
    });

    // Attach change event to payComponentDropdown
    $('#paySubComponentDropdown').on('change', function () {
        const selectedId = $(this).val(); // Get the selected value (ID)

        // alert(selectedId);
        //  isProgrammaticChange = false;
        // Add a delay before continuing
        setTimeout(function () {
            if (!isProgrammaticChange) {
                if (selectedId) {
                    // Make an AJAX call to fetch data based on the selected ID
                    $.ajax({
                        url: `/PayConfiguration/GetPaySubComponentDetailsById/${selectedId}`, // API endpoint
                        method: 'GET',
                        success: function (response) {
                            if (response.success) {
                                let data = response.data;
                                console.log(response.data);
                                // Bind the fetched data to the respective fields
                                // $('#salaryFrequencyDropdown').val(data.salaryFrequency).trigger('change'); // Set value and trigger change event
                                if (data.calculationType === 3) {
                                    $('#formulaSection').show();
                                    $('#amountSection').hide();
                                    // $('#formulaSectionbutton').show();
                                    // loadDropdownWithSelectedValue('#formulaDropdown', '/DropDown/FetchFormulaTypeDropdown', function () {
                                    //     setSelectedValueInDropdown('#formulaDropdown', data.formula_Id);
                                    // });
                                }
                                else if (data.calculationType === 2 || data.calculationType === 1) {
                                    $('#formulaSection').hide();
                                    $('#amountSection').show();
                                }
                                else {
                                    $('#formulaSection').hide();
                                    $('#amountSection').hide();
                                }
                                //////////////////////////For Formula Check:- End
                                // $('#payrollHeadDropdown').val(data.earningDeductionType).trigger('change');
                                $('#amoutval').text(data.Formula || ''); // Set text for dropdownTextbox
                                $('#paycomponentname').val(data.earningDeductionName || ''); // Set value for paycomponentname
                                // $('#payrollHeadDropdown').val(data.earningDeductionType).trigger('change');
                                $("#taxableDropdown").val(data.taxable).trigger('change');
                                $("#componentValueTypeDropdown").val(data.calculationType).trigger('change');
                                $("#formulaDropdown").val(data.formula_Id);
                                // alert(data.formulaName);
                                $("#txtFormula").val(data.formulaName);
                                $("#formualcomp").val(data.formula_Computation);
                                // $('#remarks').val(data.remarks || ''); // Set value for remarks

                                $('#minValue').val(parseFloat(data.minimumUnit_value).toFixed(0));
                                $('#maxValue').val(parseFloat(data.maximumUnit_value).toFixed(0));

                                if (data.amount != null && parseFloat(data.amount) > 0) {
                                    // Set fixed value and make readonly
                                    $('#amountval')
                                        .val(parseFloat(data.amount).toFixed(0))
                                        .prop('readonly', true)
                                        .attr('placeholder', ''); // clear placeholder if fixed
                                } else {
                                    // Reset input, allow typing, and show min-max as placeholder
                                    $('#amountval')
                                        .val('')
                                        .prop('readonly', false)
                                        .attr("placeholder", "Enter amount (" + data.minimumUnit_value + " - " + data.maximumUnit_value + ")");
                                }

                                if (callback) callback();
                            } else {
                                showAlert('danger', 'No data found for the selected Pay Component.' + selectedId);
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error('Error fetching Pay Component details:', error);
                            showAlert('danger', 'An error occurred while fetching Pay Component details.');
                        }
                    });
                } else {
                    // Clear the fields if no value is selected
                    // $('#salaryFrequencyDropdown').val('').trigger('change');
                    debugger;
                    // clearSubComponent();
                }
            }
        }, 333); // 500ms delay before continuing
    });



    $('#componentValueTypeDropdown').on('change', function () {
        const selectedValue = $(this).val();
        if (selectedValue === "3") {
            $('#formulaSection').show();
            $('#amountSection').hide();
            $('#amountval').val('');
        } else {
            $('#formulaSection').hide();
            $('#amountSection').show();
            $("#formulaDropdown").val("");
            $("#txtFormula").val("");
        }
    });


    //$('#formulaDropdown').on('change', function () {
    //    debugger;
    //    var formulaId = parseInt($("#formulaDropdown").val()) || 0;
    //    if (formulaId > 0) {
    //        $.ajax({
    //            url: `/formulamaster/getformulabyid?formulaId=${formulaId}`, // Replace with actual route
    //            method: 'GET',
    //            async: false, // Make it synchronous to assign before next line
    //            success: function (response) {
    //                if (response.success && response.data) {
    //                    $('#formualcomp').val(response.data.formula_Computation);
    //                }
    //                else {
    //                    $('#formualcomp').val('');
    //                }
    //            },
    //            error: function (xhr) {
    //                console.error("Error fetching formula:", xhr);
    //            }
    //        });
    //    }
    //});


    $('#amountval').on('input', function () {
        const val = $(this).val().trim();
        const regex = /^\d+(\.\d{1,2})?$/;
        if (val && regex.test(val)) {
            $('#amountval-error').text('');
        }
    });

    // Allow only valid decimal input while typing
    $('#amountval').on('input', function () {
        var val = $(this).val();
        // Remove invalid characters and ensure only 1 decimal point and max 2 decimal places
        val = val.replace(/[^0-9.]/g, '')
            .replace(/(\..*)\./g, '$1') // prevent multiple dots
            .replace(/^(\d*\.\d{0,2}).*$/, '$1'); // max 2 decimal places
        $(this).val(val);
    });


});




function loadDropdownWithSelectedValue(selector, url, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            const $dropdown = $(selector);
            $dropdown.empty().append($('<option>', {
                value: '',
                text: '-- Select --'
            }));

            $.each(data, function (i, item) {
                $dropdown.append($('<option>', {
                    value: item.value,
                    text: item.text
                }));
            });
            $dropdown.trigger('change');
            if (callback) {
                callback();
            }
        },
        error: function () {
            console.error('Failed to load dropdown data for:', selector);
        }
    });
}

function setSelectedValueInDropdown(selector, value) {
    const $dropdown = $(selector);

    // Check if the value exists in the dropdown
    if ($dropdown.find(`option[value='${value}']`).length > 0) {
        //console.log(`Setting value '${value}' in the dropdown`);
        $dropdown.val(value).trigger('change'); // Trigger 'change' to handle select2 events
    } else {
        console.warn(`Value '${value}' not found in dropdown: ${selector}`);
    }
}
