$(document).ready(function () {
    initializeForms();

    $(document).on("click", ".edit-btn", function () {
        var areaId = $(this).attr("id").split("-")[1];
        showEditAreaForm(areaId);
    });

    $(document).on("click", "#addAreaButton", function () {
        showAddAreaForm();
    });

    // Clear error messages on dropdown change
    $(document).on('change', '#CountryDropdown, #StateDropdown, #CityDropdown, #LocationDropdown, #EditCountryDropdown, #EditStateDropdown, #EditCityDropdown, #EditLocationDropdown', function () {
        var dropdownId = $(this).attr('id');
        var formPrefix = dropdownId.startsWith('Edit') ? 'edit' : ''; // Check if it's an edit form
        var errorId = formPrefix + dropdownId + '-error';

        hideError(errorId);
    });

    // Dropdown Change Events for Add Form
    $(document).on('change', '#CountryDropdown', function () {
        var countryId = $(this).val();
        loadStates(countryId, '#StateDropdown', function () {
            $('#StateDropdown').trigger('change');
        });
    });

    $(document).on('change', '#StateDropdown', function () {
        var stateId = $(this).val();
        loadCities(stateId, '#CityDropdown', function () {
            $('#CityDropdown').trigger('change');
        });
    });

    $(document).on('change', '#CityDropdown', function () {
        var cityId = $(this).val();
        loadLocations(cityId, '#LocationDropdown');
    });

    // Dropdown Change Events for Edit Form
    $(document).on('change', '#EditCountryDropdown', function () {
        var countryId = $(this).val();
        loadStates(countryId, '#EditStateDropdown', function () {
            $('#EditStateDropdown').trigger('change');
        });
    });

    $(document).on('change', '#EditStateDropdown', function () {
        var stateId = $(this).val();
        loadCities(stateId, '#EditCityDropdown', function () {
            $('#EditCityDropdown').trigger('change');
        });
    });

    $(document).on('change', '#EditCityDropdown', function () {
        var cityId = $(this).val();
        loadLocations(cityId, '#EditLocationDropdown');
    });
});

// Initialize dropdowns for both Add and Edit forms
function initializeForms() {
    loadCountries('#CountryDropdown', function () {
        $('#CountryDropdown').trigger('change');
    });

    loadCountries('#EditCountryDropdown', function () {
        $('#EditCountryDropdown').trigger('change');
    });
}

// Load countries dropdown
function loadCountries(targetDropdown, callback) {
    $.ajax({
        url: '/DropDown/FetchCountriesDropdown',
        method: 'GET',
        success: function (data) {
            populateDropdown(targetDropdown, data);
            if (callback) callback();
        },
        error: function () {
            showError(targetDropdown + '-error', 'Failed to load countries.');
        }
    });
}

// Load states dropdown based on selected country
function loadStates(countryId, targetDropdown, callback) {
    if (!countryId) return;
    $.ajax({
        url: '/DropDown/FetchStateDropdown/' + countryId,
        method: 'GET',
        success: function (data) {
            populateDropdown(targetDropdown, data);
            if (callback) callback();
        },
        error: function () {
            showError(targetDropdown + '-error', 'Failed to load states.');
        }
    });
}

// Load cities dropdown based on selected state
function loadCities(stateId, targetDropdown, callback) {
    if (!stateId) return;
    $.ajax({
        url: '/DropDown/FetchCityDropdown/' + stateId,
        method: 'GET',
        success: function (data) {
            populateDropdown(targetDropdown, data);
            if (callback) callback();
        },
        error: function () {
            showError(targetDropdown + '-error', 'Failed to load cities.');
        }
    });
}

// Load locations dropdown based on selected city
function loadLocations(cityId, targetDropdown, callback) {
    if (!cityId) return;
    $.ajax({
        url: '/DropDown/FetchLocationsDropdown/' + cityId,
        method: 'GET',
        success: function (data) {
            populateDropdown(targetDropdown, data);
            if (callback) callback();
        },
        error: function () {
            showError(targetDropdown + '-error', 'Failed to load locations.');
        }
    });
}

// Populate dropdowns with API data
function populateDropdown(dropdownId, data) {
    var dropdown = $(dropdownId);
    dropdown.empty();
    dropdown.append('<option value="" disabled selected>Select an option</option>');

    if (!data || !Array.isArray(data)) {
        console.error('Invalid data for', dropdownId, data);
        return;
    }

    data.forEach(function (item) {
        if (item && item.value !== undefined && item.text) {
            dropdown.append('<option value="' + item.value + '">' + item.text + '</option>');
        }
    });
}

// Show Add Area Form
function showAddAreaForm() {
    $('#addAreaForm')[0].reset();
    $('#addArea').show();
    $('#EditArea').hide();

    loadCountries('#CountryDropdown', function () {
        $('#CountryDropdown').trigger('change');
    });
}

// Show Edit Area Form
function showEditAreaForm(areaId) {
    $('#editAreaForm')[0].reset();
    $('#EditArea').show();
    $('#addArea').hide();

    $.ajax({
        url: '/PayrollMaster/GetAreaDetailsById/' + areaId,
        method: 'GET',
        success: function (response) {
            var area = response.data;

            loadCountries('#EditCountryDropdown', function () {
                $('#EditCountryDropdown').val(area.countryId).trigger('change');

                loadStates(area.countryId, '#EditStateDropdown', function () {
                    $('#EditStateDropdown').val(area.state_Id).trigger('change');

                    loadCities(area.state_Id, '#EditCityDropdown', function () {
                        $('#EditCityDropdown').val(area.cityid).trigger('change');

                        loadLocations(area.cityid, '#EditLocationDropdown', function () {
                            $('#EditLocationDropdown').val(area.location_Id).trigger('change');
                        });
                    });
                });
            });

            $('#areaId').val(area.area_Id);
            $('#editareaname').val(area.areaName);
            // Set the checkbox state and label
            var isActive = area.isActive;
            console.log(isActive, "isActive");
            $('#EditAreaIsActive').prop('checked', isActive);
            updateIsActiveLabel(isActive); // Update the label based on IsActive value
        },
        error: function () {
            alert('Failed to fetch area details.');
        }
    });
}

// Toggle label based on the IsActive checkbox
function updateIsActiveLabel(isActive) {
    if (isActive) {
        $('#isActiveLabel').text('Active');
    } else {
        $('#isActiveLabel').text('Inactive');
    }
}

// Listen for checkbox toggle and update label
$(document).on('change', '#EditAreaIsActive', function () {
    var isChecked = $(this).prop('checked');
    updateIsActiveLabel(isChecked);
});

// Ensure checkbox reflects correct state when page is loaded
$(document).ready(function () {
    var isActive = $('#EditAreaIsActive').prop('checked');
    updateIsActiveLabel(isActive);
});
// Show error message for dropdowns
function showError(elementId, message) {
    $('#' + elementId).text(message).show();
}

//// Function to hide error message
function hideError(elementId) {
    $('#' + elementId).hide();
}


function validateAreaForm(formType) {
    var isValid = true;
    var formPrefix = formType === 'add' ? '' : 'edit';

    console.log('validateAreaForm called for form type: ' + formType);

    // Validate Area Name
    var areaName = $('#' + formPrefix + 'areaname').val();
    var areaNameError = validateTextField(areaName);

    if (areaName === '') {
        showError(formPrefix + 'areaname-error', 'Area name is required.');
        isValid = false;
    } else if (areaNameError) {
        showError(formPrefix + 'areaname-error', areaNameError);
        isValid = false;
    } else {
        hideError(formPrefix + 'areaname-error');
    }


    // Validate Country Dropdown
    var countryValue = $('#' + formPrefix + 'CountryDropdown').val();
    if (countryValue === '' || countryValue === null) {
        showError(formPrefix + 'countryDropdown-error', 'Country is required.');
        isValid = false;
    } else {
        hideError(formPrefix + 'countryDropdown-error');
    }

    // Validate State Dropdown
    var stateValue = $('#' + formPrefix + 'StateDropdown').val();
    if (stateValue === '' || stateValue === null) {
        showError(formPrefix + 'stateDropdown-error', 'State is required.');
        isValid = false;
    } else {
        hideError(formPrefix + 'stateDropdown-error');
    }

    // Validate City Dropdown
    var cityValue = $('#' + formPrefix + 'CityDropdown').val();
    if (cityValue === '' || cityValue === null) {
        showError(formPrefix + 'cityDropdown-error', 'City is required.');
        isValid = false;
    } else {
        hideError(formPrefix + 'cityDropdown-error');
    }

    // Validate Location Dropdown
    var locationValue = $('#' + formPrefix + 'LocationDropdown').val();
    if (locationValue === '' || locationValue === null) {
        showError(formPrefix + 'locationDropdown-error', 'Location is required.');
        isValid = false;
    } else {
        hideError(formPrefix + 'locationDropdown-error');
    }

    return isValid;
}

// Function to clear error messages immediately when user selects a valid option
function clearErrorOnSelect(dropdownId, errorId) {
    $('#' + dropdownId).on('change', function () {
        var selectedValue = $(this).val();
        if (selectedValue !== '' && selectedValue !== null) {
            hideError(errorId);
        }
    });
}

// Bind the clear error function to each dropdown
clearErrorOnSelect('CountryDropdown', 'countryDropdown-error');
clearErrorOnSelect('StateDropdown', 'stateDropdown-error');
clearErrorOnSelect('CityDropdown', 'cityDropdown-error');
clearErrorOnSelect('LocationDropdown', 'locationDropdown-error');





$(document).ready(function () {
    $('#saveDetailsButton').on('click', function () {
        // Prevent default form submission if needed
        //e.preventDefault();

        if (validateAreaForm('add')) {
            var areaData = {
                CountryId: $('#CountryDropdown').val(),
                State_Id: $('#StateDropdown').val(),
                cityid: $('#CityDropdown').val(),
                Location_Id: $('#LocationDropdown').val(),
                AreaName: $('#areaname').val(),
                IsActive: $('#IsActive').prop('checked')
            };

            $.ajax({
                url: '/PayrollMaster/AreaList',
                method: 'POST',
                data: JSON.stringify(areaData),
                contentType: 'application/json',
                success: function (response) {
                    if (response.success) {
                        alert(response.message);
                        $('#addArea').offcanvas('hide');
                        FetchAreaList();  // Update the area list
                        // Optional: reinitialize the DataTable if necessary
                        // makeDataTable("area-master-list");
                    } else {
                        alert(response.message);
                    }
                },
                error: function () {
                    alert('An error occurred while adding the area.');
                }
            });
        }
    });
    $('#editDetailsButton').on('click', function () {
        if (validateAreaForm('edit')) {
            var areaData = {
                Area_Id: $('#areaId').val(),
                Location_Id: $('#EditLocationDropdown').val(),
                AreaName: $('#editareaname').val(),
                IsActive: $('#EditAreaIsActive').prop('checked')
            };

            $.ajax({
                url: '/PayrollMaster/UpdateArea',
                method: 'PUT',
                data: JSON.stringify(areaData),
                contentType: 'application/json',
                success: function (response) {
                    if (response.success) {
                        alert(response.message);
                        $('#EditArea').offcanvas('hide');
                        FetchAreaList();  // Update the area list after the update
                        // Optional: clear the form or reset state if necessary
                        // clearAreaForm();
                    } else {
                        alert(response.message);
                    }
                },
                error: function () {
                    alert('An error occurred while updating the area.');
                }
            });
        }
    });
});

function FetchAreaList() {
    $.ajax({
        url: '/PayrollMaster/FetchAreaList', // Ensure this matches your controller route
        type: 'GET',
        success: function (response) {
            console.log("");
            $('#area-master-list tbody').html($(response).find('tbody').html());
        },
        error: function () {
            alert('Failed to refresh department list.');
        }
    });
}