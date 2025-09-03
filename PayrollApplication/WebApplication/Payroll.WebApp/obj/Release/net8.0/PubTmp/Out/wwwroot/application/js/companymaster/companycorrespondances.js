//function editCorrespondance(correspondanceId) {
//    //console.log("correspondanceId: ", correspondanceId);  // Log to check if it's correct
//    //alert("correspondanceId: " + correspondanceId);       // Show alert

//    $.ajax({
//        url: '/Company/GetCorrespondanceDetails?correspondanceId=' + correspondanceId,
//        type: 'GET',
//        success: function (response) {
//            console.log("AJAX response: ", response);  // Log the response
//            $('#editCorrespondanceContainer').html(response);
//            $('#editCorrespondanceModal').modal('show');
//        },
//        error: function () {
//            alert('Error fetching data.');
//        }
//    });
//}
function editCorrespondance(correspondanceId) {
    $.ajax({
        url: '/Company/GetCorrespondanceDetails?correspondanceId=' + correspondanceId,
        type: 'GET',
        success: function (response) {
            console.log("AJAX response: ", response);  // Log the response
            $('#editCorrespondanceContainer').html(response);

            // Initialize and show the offcanvas
            var offcanvasElement = document.getElementById('editCorrespondanceOffcanvas');
            var myOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
            myOffcanvas.show();
        },
        error: function () {
            alert('Error fetching data.');
        }
    });
}

//function saveCorrespondance() {
//    alert("HILLLLLLLLLLLLLLL");
//    // Get the form data
//    var formData = $("#editCorrespondanceForm").serialize();

//    // Make the AJAX call
//    $.ajax({
//        url: '/Company/SaveCorrespondance', // Replace with your actual controller and action
//        type: 'POST',
//        data: formData,
//        success: function (response) {
//            if (response.success) {
//                updateCorrespondancePartial();
//                $('#editCorrespondanceModal').modal('hide');
//            } else {
//                alert("Failed to save correspondance: " + response.message);
//            }
//        },
//        error: function (xhr, status, error) {
//            alert("An error occurred: " + error);
//        }
//    });
//}
//function updateCorrespondancePartial() {
//    // var companyId = $("#CompanyId").val(); // Get the companyId, make sure you have a hidden input or another way to retrieve it
//    var companytCorrespondanceId = $("#CompanyId").val(); // Get the companyId, make sure you have a hidden input or another way to retrieve it
//    $.ajax({
//        url: '/Company/GetCorrespondancePartialByCompanyId', // Replace with your actual controller and action
//        type: 'GET',
//        data: { companytCorrespondanceId: companytCorrespondanceId },
//        success: function (html) {
//            console.log(html); // Debugging: Log the HTML response
//            $("#company-correspondances-container").html(html);
//        },
//        error: function (xhr, status, error) {
//            alert("An error occurred while updating the partial view: " + error);
//        }
//    });
//}