$(document).ready(function () {
    $(".select2_search_ctm").select2(); // Initialize select2 dropdowns

    $(document).on("click", "#addmapdepartmentButton", function () {
        showAddMapDepartmentForm();
    });

    window.openMapDepartmentEditButton = function (departmentId) {
        console.log("Edit", departmentId);
        loadMapDepartmentForm(departmentId);
    };

    function showAddMapDepartmentForm() {
        $('#addmapdepartmentForm')[0].reset();
        $('#addmapdepartment').show();

        loadCountries(function () {
            $('#CountryDropdown').trigger('change');
        });
    }

    function loadMapDepartmentForm(departmentId) {
        $.ajax({
            url: '/PayrollMaster/GetMapDepartmentLocationsById/' + departmentId,
            type: 'GET',
            success: function (response) {
                $('#addmapdepartmentContainer').html(response);
                var offcanvasElement = document.getElementById('addmapdepartment');
                var myOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
                myOffcanvas.show();

                if (departmentId === 0) {
                    $('#formTitle').text('Add Map Department Details');
                } else {
                    $('#formTitle').text('Update Map Department Details');
                    populateDropdowns();
                }
            },
            error: function () {
                alert('Failed to load the department form.');
            }
        });
    }

    function populateDropdowns() {
        let countryId = $('#CountryDropdown').data('selected');
        let stateId = $('#StateDropdown').data('selected');
        let cityId = $('#CityDropdown').data('selected');
        let locationId = $('#LocationDropdown').data('selected');
        let areaId = $('#AreaDropdown').data('selected');

        if (countryId) {
            loadStates(countryId, function () {
                $('#StateDropdown').val(stateId).trigger('change');
            });
        }
        if (stateId) {
            loadCities(stateId, function () {
                $('#CityDropdown').val(cityId).trigger('change');
            });
        }
        if (cityId) {
            loadLocations(cityId, function () {
                $('#LocationDropdown').val(locationId).trigger('change');
            });
        }
        if (locationId) {
            loadAreas(locationId, function () {
                $('#AreaDropdown').val(areaId).trigger('change');
            });
        }
        if (areaId) {
            loadDepartments(areaId, function () {
                $('#DepartmentDropdown').val($('#DepartmentDropdown').data('selected')).trigger('change');
            });
        }
    }

    function loadCountries(callback) {
        $.ajax({
            url: "/DropDown/FetchCountriesDropdown",
            type: "GET",
            success: function (data) {
                $("#CountryDropdown").append(data.map(item => `<option value="${item.id}">${item.name}</option>`));
                if (callback) callback();
            }
        });
    }

    function loadStates(countryId, callback) {
        $.ajax({
            url: `/DropDown/FetchStateDropdown/${countryId}`,
            type: "GET",
            success: function (data) {
                $("#StateDropdown").html('<option value="">Select State</option>' +
                    data.map(item => `<option value="${item.id}">${item.name}</option>`));
                if (callback) callback();
            }
        });
    }

    function loadCities(stateId, callback) {
        $.ajax({
            url: `/DropDown/FetchCityDropdown/${stateId}`,
            type: "GET",
            success: function (data) {
                $("#CityDropdown").html('<option value="">Select City</option>' +
                    data.map(item => `<option value="${item.id}">${item.name}</option>`));
                if (callback) callback();
            }
        });
    }

    function loadLocations(cityId, callback) {
        $.ajax({
            url: `/DropDown/FetchLocationsDropdown/${cityId}`,
            type: "GET",
            success: function (data) {
                $("#LocationDropdown").html('<option value="">Select Location</option>' +
                    data.map(item => `<option value="${item.id}">${item.name}</option>`));
                if (callback) callback();
            }
        });
    }

    function loadAreas(locationId, callback) {
        $.ajax({
            url: `/DropDown/FetchAreaDropdown/${locationId}`,
            type: "GET",
            success: function (data) {
                $("#AreaDropdown").html('<option value="">Select Area</option>' +
                    data.map(item => `<option value="${item.id}">${item.name}</option>`));
                if (callback) callback();
            }
        });
    }

    function loadDepartments(areaId, callback) {
        $.ajax({
            url: `/DropDown/FetchDepartmentDropdown/${areaId}`,
            type: "GET",
            success: function (data) {
                $("#DepartmentDropdown").html('<option value="">Select Department</option>' +
                    data.map(item => `<option value="${item.id}">${item.name}</option>`));
                if (callback) callback();
            }
        });
    }
});
