$(document).ready(function () {
    // Event: Load partial view content for tab
    //$('#v-pills-settings-tab').on('click', function () {
    //    const target = $(this).data('bs-target');
    //    const url = $(this).data('url');
    //    console.log(target, url);
    //    if (url) {
    //        $(target).html('<div class="text-center my-3"><div class="spinner-border text-primary" role="status"></div></div>');
    //        $.get(url, function (data) {
    //            $(target).html(data);
    //        }).fail(function () {
    //            $(target).html('<div class="alert alert-danger">Failed to load content. Please try again later.</div>');
    //        });
    //    }
    //});
    $('#locationCountryDropdown').on('change', function () {
        if ($(this).val()) {
            $('#locationcountryDropdown-error').text('');
        }
    });
    // Dynamically set the form mode based on locationId (for example)
    $('.btn[data-bs-dismiss="offcanvas"]').on('click', function () {
        const isEditMode = $('#locationId').val() !== '';  // Check if it's Edit mode based on the presence of locationId
        resetForm(isEditMode);  // Dynamically pass true/false for Add/Edit mode
    });
    // Reusable function to clear error messages on input change
    function clearErrorOnChange(selector, errorSelector) {
        $(selector).on('change input', function () {
            if ($(this).val()) {
                $(errorSelector).text('');
            }
        });
    }

    // Clear error messages for dropdowns and inputs
    clearErrorOnChange('#locationCountryDropdown', '#locationcountryDropdown-error');
    clearErrorOnChange('#locationStateDropdown', '#locationstateDropdown-error');
    clearErrorOnChange('#locationCityDropdown', '#locationcityDropdown-error');
    clearErrorOnChange('#locationname', '#locationname-error');

    // Validate and collect form data
    function validateAndCollectFormData() {
        var isValid = true;
        var data = {};
        var fields = [
            { id: '#locationCountryDropdown', errorId: '#locationcountryDropdown-error', errorMsg: 'Country is required', key: 'CountryId' },
            { id: '#locationStateDropdown', errorId: '#locationstateDropdown-error', errorMsg: 'State is required', key: 'StateId' },
            { id: '#locationCityDropdown', errorId: '#locationcityDropdown-error', errorMsg: 'City is required', key: 'CityId' },
            { id: '#locationname', errorId: '#locationname-error', errorMsg: 'Location Name is required', key: 'LocationName' }
        ];

        $('.input_error_msg').text(''); // Clear all error messages

        fields.forEach(function (field) {
            var value = $(field.id).val();
            if (!value) {
                $(field.errorId).text(field.errorMsg);
                isValid = false;
            } else {
                data[field.key] = value; // Collect valid data
            }
        });

        return { isValid: isValid, data: data };
    }
    // Function to set the form title

    // Save form data (Add or Edit)
    function saveFormData(data, url, method) {
        $.ajax({
            type: method,
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.success) {
                    showAlert('success', response.message);
                    if (url == '/PayrollMaster/AddLocation') {
                        resetForm(true);  // Reset the form and set the title for Add mode
                    }
                    else {
                        resetForm(false);  // Reset the form and set the title for Edit mode
                    }
                    //resetForm();
                    $('#addLocation').offcanvas('hide'); // Close the form
                    LoadLocationPartial();
                } else {
                    showAlert('danger', response.message || 'An error occurred.');
                }
            },
            error: function (error) {
                alert('An error occurred: ' + error.statusText);
            }
        });
    }
    $(document).on('click', '#addLocationButton', function () {
        // Reset the form fields when clicking the "Add Location" button
        resetForm(true); // Ensure form resets when adding a new location
        setFormTitle(false); // Set the title to "Add Location Details"
        // Show the form as a new location
        $('#addLocation').offcanvas('show');

        // Fetch countries and populate the country dropdown
        fetchAddLocationDropdownData('/DropDown/FetchCountriesDropdown', {}, '#locationCountryDropdown', 'Select Country')
            .done(function () {
                // Trigger change only after the country dropdown is populated
                const selectedCountryId = $('#locationCountryDropdown').val();
                if (selectedCountryId) {
                    $('#locationCountryDropdown').trigger('change'); // Trigger change to load states
                }
            });
    });

    // Country change handler
    $(document).on('change', '#locationCountryDropdown', function () {
        const countryId = $(this).val();
        if (countryId) {
            fetchLocationStateDropdown(countryId); // Fetch states when country changes
        } else {
            // Clear state and city dropdowns if no country is selected
            clearDropdown('#locationStateDropdown', 'Select State');
            clearDropdown('#locationCityDropdown', 'Select City');
        }
    });

    // State change handler
    $(document).on('change', '#locationStateDropdown', function () {
        const stateId = $(this).val();
        if (stateId) {
            fetchLocationCityDropdown(stateId); // Fetch cities when state changes
        } else {
            // Clear city dropdown if no state is selected
            clearDropdown('#locationCityDropdown', 'Select City');
        }
    });

    // Utility function to clear and reset dropdowns
    function clearDropdown(selector, placeholder) {
        $(selector).empty().append(new Option(placeholder, ''));
    }
    // Generic function to fetch dropdown data
    function fetchAddLocationDropdownData(url, params, targetDropdown, placeholder) {
        return $.ajax({
            url: url,
            type: 'GET',
            data: params,
            success: function (response) {
                const dropdown = $(targetDropdown);
                dropdown.empty().append(new Option(placeholder, '')); // Add placeholder
                if (response && Array.isArray(response)) {
                    response.forEach(function (item) {
                        dropdown.append(new Option(item.text, item.value)); // Populate options
                    });
                }
            },
            error: function (error) {
                console.error(`Error fetching data for ${targetDropdown}:`, error);
            }
        });
    }
    // Update label based on checkbox status
    // Function to show or hide the toggle button based on mode
   
   

    // Click handler for Save button
    // $('#saveLocationButton').on('click', function () {
    $(document).on('click', '#saveLocationButton', function () {
        var formData = validateAndCollectFormData();
        if (formData.isValid) {
            const locationId = $('#locationId').val();
            const locationName = $('#locationname').val();
            console.log(locationId);
            const isEdit = locationId && parseInt(locationId) > 0; // Determine if it's an update
            const url = isEdit ? '/PayrollMaster/UpdateLocation' : '/PayrollMaster/AddLocation';
            const method = isEdit ? 'POST' : 'POST';
            // Add LocationId to formData if it's an update
            if (isEdit) {
                formData.data.Location_Id = locationId;
                formData.data.LocationName = locationName;
            }
            saveFormData(formData.data, url, method);
        }
    });
    // Click handler for Reset button
    $(document).on('click', '#resetLocationButton', function (e) {
        e.preventDefault(); // Prevent form submission or any default behavior
        resetForm();
    });
    $(document).on('click', '[id^="tblLocation-"]', function () {
        const locationId = $(this).data('locationid');
        if (locationId) {
            openEditLocationForm(locationId);
        }
    });
});

// Function to reset the form
function resetForm(isAddMode = false) {
    // Set the form title based on whether it's Add or Edit mode
    setFormTitle(!isAddMode);  // Pass true for Edit mode, false for Add mode
    // Toggle visibility of the toggle button
    toggleVisibility(isAddMode);
    if (isAddMode) {
        // Reset everything for adding a new location
        $('#locationId').val(''); // Clear hidden Location ID
        $('#locationCountryDropdown').val('').trigger('change');
        $('#locationStateDropdown').val('').trigger('change');
        $('#locationCityDropdown').val('').trigger('change');
        $('#locationname').val('');
        // Hide the toggle in Add mode
        $('#toggleContainer').hide();
    } else {
        // Check if it's in edit mode (locationId is not empty)
        const isEditMode = originalLocationFormData.Location_Id !== '';
        if (isEditMode) {
            $('#toggleContainer').show();
            // Reset the form fields to original values for the edit form
            $('#locationId').val(originalLocationFormData.Location_Id);
            $('#locationCountryDropdown').val(originalLocationFormData.Country_Id).trigger('change');
            $('#locationStateDropdown').val(originalLocationFormData.State_Id).trigger('change');
            $('#locationCityDropdown').val(originalLocationFormData.CityId).trigger('change');
            $('#locationname').val(originalLocationFormData.LocationName);
            // Set toggle based on the original data for edit mode
            if (originalLocationFormData.IsActive) {
                $('#locationActiveToggle').prop('checked', true);
                $('#activeStatusLabel').text('Active');
            } else {
                $('#locationActiveToggle').prop('checked', false);
                $('#activeStatusLabel').text('Inactive');
            }
        }
    }
    // Clear error messages (common for both add & edit modes)
    $('.input_error_msg').text('');
}
function toggleVisibility(isAddMode) {
    // Handle initial state of the label based on the checkbox
    if ($('#locationActiveToggle').prop('checked')) {
        $('#activeStatusLabel').text('Active');
    } else {
        $('#activeStatusLabel').text('Inactive');
    }

    // Bind the change event to update the label dynamically
    $('#locationActiveToggle').on('change', function () {
        if ($(this).prop('checked')) {
            $('#activeStatusLabel').text('Active');
        } else {
            $('#activeStatusLabel').text('Inactive');
        }
    });

    // For Add mode, ensure the toggle is set to Inactive by default
    if (isAddMode) {
        $('#locationActiveToggle').prop('checked', false); // Set to Inactive
        $('#activeStatusLabel').text('Inactive'); // Update label text
        $('#toggleContainer').hide(); // Hide toggle in Add mode
    } else {
        $('#toggleContainer').show(); // Show toggle in Edit mode
    }
}
function setFormTitle(isTitleEditMode) {
    console.log("Title", isTitleEditMode);
    const title = isTitleEditMode ? "Update Location Details" : "Add Location Details";
    $('#formTitle').text(title); // Assuming the form title has an ID `formTitle`
}

function openEditLocationForm(locationId) {
    if (locationId) {
        $.get(`/PayrollMaster/GetLocationDetails?id=${locationId}`, function (response) {
            if (response.success) {
                const location = response.data;
                console.log(location);
                console.log(" response.data", response.data);
                // Store the original form data
                originalLocationFormData = {
                    Location_Id: location.location_Id,
                    Country_Id: location.countryId,
                    State_Id: location.state_Id,
                    CityId: location.cityId,
                    City_Name: location.city_Name,
                    LocationName: location.locationName,
                    IsActive: location.isActive
                };
                $('#locationId').val(location.location_Id);
                $('#locationCountryDropdown').val(location.countryId).trigger('change'); // Trigger change for state population
                $('#locationStateDropdown').val(location.state_Id).trigger('change'); // Trigger change for city population
                $('#locationCityDropdown').val(location.cityId);
                $('#locationname').val(location.locationName);
                // Set the active/inactive toggle
                $('#locationActiveToggle').prop('checked', location.isActive); // Set the toggle based on `isActive`
                $('#activeStatusLabel').text(location.isActive ? 'Active' : 'Inactive'); // Update label text
                // Reset form to Edit mode
                setFormTitle(true); // Set the title to "Update Location Details"
                $('#addLocation').offcanvas('show'); // Open the form
                populateLocationDropdownValues(response.data);
                resetForm(false);
            }
        }).fail(function () {
            alert('Failed to fetch location details.');
        });
    } else {
        $('#locationForm')[0].reset();
        $('#locationId').val('');
    }

}
// On page load, check for the stored active tab and activate it
$(document).ready(function () {
    // Check if there's an active tab saved in localStorage
    var activeTab = localStorage.getItem('activeTab');

    if (activeTab) {
        // If activeTab is found in localStorage, activate it
        $('#' + activeTab).addClass('active');
        $('#' + activeTab).attr('aria-selected', 'true');

        // Show the content corresponding to the active tab
        $('#' + activeTab.replace('-tab', '')).addClass('show active');

        // Remove active class from other tabs and content
        $('.nav-link').not('#' + activeTab).removeClass('active').attr('aria-selected', 'false');
        $('.tab-content > .tab-pane').not('#' + activeTab.replace('-tab', '')).removeClass('show active');
        // Set a timeout to clear localStorage after 5 seconds
        setTimeout(function () {
            localStorage.removeItem('activeTab'); // Clear the active tab from localStorage
        }, 5000); // 5000ms = 5 seconds
    }
});

// Open Edit Form when a location is selected
function LoadLocationPartial() {
    $.ajax({
        url: '/PayrollMaster/LoadLocationPartial', // Ensure this matches your controller route
        type: 'GET',
        success: function (response) {
            console.log("");
            $('#tblLocation tbody').html($(response).find('tbody').html());
        },
        error: function () {
            alert('Failed to refresh Location list.');
        }
    });
}
function populateLocationDropdownValues(data) {
    fetchLocationDropdownData('/DropDown/FetchCountriesDropdown', {}, '#locationCountryDropdown', 'Select Country')
        .done(() => {
            console.log("Fetched country data");
            $('#locationCountryDropdown').val(data.countryId).trigger('change'); // Set value and trigger change
            console.log(" cvcxb data", data);
            return fetchLocationStateDropdown(data.countryId, data.state_Id || '');
        })
        .done(() => {
            console.log("Fetched state data");
            return fetchLocationCityDropdown(data.state_Id || '', data.cityId || '');
        })
        .fail(() => alert('Error loading dropdown data.'));
}
function fetchLocationDropdownData(url, data, dropdownId, placeholderText) {
    const deferred = $.Deferred();
    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        async: false,
        success: function (response) {
            console.log(`Dropdown data for ${dropdownId}:`, response);
            populateLocationDropdown(dropdownId, response, placeholderText);
            deferred.resolve();
        },
        error: function () {
            console.error(`Failed to fetch data for ${dropdownId}`);
            deferred.reject();
        }
    });
    return deferred.promise();
}
function populateLocationDropdown(dropdownId, items, placeholderText) {
    const dropdown = $(dropdownId);
    dropdown.empty().append(new Option(placeholderText, ''));
    items.forEach(item => {
        dropdown.append(new Option(item.text, item.value));
    });
}
function fetchLocationStateDropdown(countryId, stateId) {
    console.log("fetchStateDropdown", countryId, stateId);
    return fetchLocationDropdownData('/DropDown/FetchStateDropdown/' + countryId, {  }, '#locationStateDropdown', 'Select State')
        .done(() => {
            if (stateId) {
                $('#locationStateDropdown').val(stateId).trigger('change');
            }
        });
}
function fetchLocationCityDropdown(stateId, cityId) {
    console.log("fetchCityDropdown called with:", stateId, cityId);
    return fetchLocationDropdownData('/DropDown/FetchCityDropdown/' + stateId, {}, '#locationCityDropdown', 'Select City')
        .done(() => {
            console.log("Setting city dropdown value:", cityId);
            if (cityId) {
                $('#locationCityDropdown').val(cityId).trigger('change');
            }
        });
}








