$(document).ready(function () {
    // Open Add Department Form
    $('#addDepartmentButton').click(function () {
        console.log("add");
        loadDepartmentForm(0); // Load empty form for adding a new department
    });

    // Open Edit Department Form
    window.openDepartmentEditButton = function (departmentId) {
        console.log("Edit", departmentId);
        loadDepartmentForm(departmentId);
    };

    // Reset Form
    $('#resetDepartmentButton').click(function () {
        $('#departmentForm')[0].reset();
        $('#departmentId').val(0);
    });

    // Save or Update Department
    window.saveDepartmentButton = function () {
        var isValid = true;

        var departmentName = $('#departmentName').val().trim();
        var departmentCode = $('#departmentCode').val().trim();

        // Clear previous error messages
        $('.input_error_msg').text('');

        // Validate Department Name
        if (!departmentName) {
            $('#departmentName-error').text('Department Name is required.');
            isValid = false;
        } else if (departmentName.length < 3) {
            $('#departmentName-error').text('Department Name must be at least 3 characters.');
            isValid = false;
        }

        // Validate Department Code
        if (!departmentCode) {
            $('#departmentCode-error').text('Department Code is required.');
            isValid = false;
        } else if (departmentCode.length < 2) {
            $('#departmentCode-error').text('Department Code must be at least 2 characters.');
            isValid = false;
        }

        if (!isValid) return; // Stop submission if validation fails

        var departmentMasterDTO = {
            Department_Id: $('#departmentId').val() || 0,
            DepartmentName: departmentName,
            DepartmentCode: departmentCode,
            IsActive: $('#departmentActiveToggle').prop('checked'),
            CreatedBy: 1,
            UpdatedBy: 1
        };

        $.ajax({
            url: '/PayrollMaster/SaveOrUpdateDepartment',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(departmentMasterDTO),
            success: function (response) {
                if (response.success) {
                    alert('Department saved successfully.');
                    $('#addDepartment').offcanvas('hide');
                    fetchDepartmentList();
                } else {
                    alert('Failed to save department: ' + response.message);
                }
            },
            error: function () {
                alert('An error occurred while saving the department.');
            }
        });
    };


    // Load Add/Edit Department Form
    function loadDepartmentForm(departmentId) {
        $.ajax({
            url: '/PayrollMaster/GetDepartmentDetailsById/' + departmentId, 
            type: 'GET',
            success: function (response) {
                $('#editdepartmentContainer').html(response);
                var offcanvasElement = document.getElementById('addDepartment');
                            var myOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
                myOffcanvas.show();
                // Update form title based on Add or Edit mode
                if (departmentId === 0) {
                    $('#formTitle').text('Add Department Details');
                } else {
                    $('#formTitle').text('Update Department Details');
                }
                // Show toggle container only for Edit mode
                if (departmentId !== 0) {
                    $('#toggleContainer').show();
                }

                // Set initial label based on the toggle state
                updateStatusLabel();

                // Listen for toggle change and update label
                $('#departmentActiveToggle').change(function () {
                    updateStatusLabel();
                });
            },
            error: function () {
                alert('Failed to load the department form.');
            }
        });
    }

    // Update Status Label based on the toggle state
    function updateStatusLabel() {
        if ($('#departmentActiveToggle').prop('checked')) {
            $('#activeStatusLabel').text('Active');
        } else {
            $('#activeStatusLabel').text('Inactive');
        }
    }
    // Fetch and Reload Department List
    function fetchDepartmentList() {
        $.ajax({
            url: '/PayrollMaster/FetchDepartmentList',
            type: 'GET',
            success: function (response) {
                $('#department-master-list tbody').html($(response).find('tbody').html());
            },
            error: function () {
                alert('Failed to refresh department list.');
            }
        });
    }
});


//function openDepartmentEditButton(departmentId) {
//    $.ajax({
//        url: '/PayrollMaster/GetDepartmentDetailsById/' + departmentId, // Updated URL to match route
//        type: 'GET',
//        success: function (response) {
//            $("#editdepartmentContainer").html(response);
//            // Initialize and show the offcanvas
//            var offcanvasElement = document.getElementById('addDepartment');
//            var myOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
//            myOffcanvas.show();

//        },
//        error: function () {
//            alert("Error loading department details.");
//        }
//    });
//}


