// Function to load content into a container using AJAX
function loadTabContent(tabId, url, containerId, tableId) {
    $(document).on('shown.bs.tab', tabId, function () {
        console.log(`${tabId} activated, making AJAX request...`);

        $(containerId).empty(); // Clear existing content

        $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            success: function (html) {
                console.log("AJAX Success: Data received.");
                $(containerId).html(html); // Load the fetched HTML

                // Ensure the table exists before initializing DataTable
                setTimeout(() => {
                    if ($(tableId).length) {
                        console.log("Table found! Initializing DataTable...");
                        //makeDataTable(tableId); // Initialize DataTable on the loaded table
                    } else {
                        console.error("Table NOT found after AJAX load.");
                    }
                }, 500);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
                console.error("Response:", xhr.responseText);
                $(containerId).html('<p class="text-danger">An error occurred while loading the data.</p>');
            }
        });
    });
}

// Function to initialize the DataTable (you can customize it as needed)
function makeDataTable(tableId) {
    $(tableId).DataTable({
        paging: true,
        searching: true,
        ordering: true,
        responsive: true
    });
}
