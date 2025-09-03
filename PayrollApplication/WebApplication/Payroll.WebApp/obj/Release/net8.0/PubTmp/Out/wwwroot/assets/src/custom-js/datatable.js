/* 
* Added By:- Harshida Parmar (09-01-'25)
* EXPORT DATA FOR CSV AND EXCEL: - Start */
function exportTableToCSV(tableId, fileName) {
    // Get the DataTable instance
    var table = $('#' + tableId).DataTable();

    // Get all data from the DataTable (including filtered rows)
    var allData = table.rows().data();

    var headers = [];
    var data = [];

    // Get the table headers (excluding Actions, Is Active, and Is Deleted columns)
    $('#' + tableId + ' thead th').each(function (index) {
        var headerText = $(this).text().trim();
        // Exclude Actions, Is Active, and Is Deleted columns
        if (headerText !== 'Actions' && headerText !== 'Is Active' && headerText !== 'Is Deleted') {
            headers.push(headerText);
        }
    });

    // Loop through the data and format it
    allData.each(function (value, index) {
        var rowData = [];
        value.forEach(function (cell, cellIndex) {
            var headerText = $('#' + tableId + ' thead th').eq(cellIndex).text().trim();

            // Exclude Is Active and Is Deleted columns
            if (headerText !== 'Is Active' && headerText !== 'Is Deleted' && headerText !== 'Actions') {
                rowData.push(cell);
            }
        });

        data.push(rowData);
    });

    // Generate CSV content
    var csvContent = headers.join(',') + '\n' + data.map(row => row.join(',')).join('\n');

    // Trigger download
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName + '.csv';
    link.click();
}

function exportTableToPDF(tableId, fileName) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get the DataTable instance
    var table = $('#' + tableId).DataTable();

    // Get all data from the DataTable
    var allData = table.rows().data();

    var headers = [];
    var body = [];

    // Get the table headers (excluding Actions, Is Active, and Is Deleted columns)
    $('#' + tableId + ' thead th').each(function (index) {
        var headerText = $(this).text().trim();
        // Exclude Actions, Is Active, and Is Deleted columns
        if (headerText !== 'Actions' && headerText !== 'Is Active' && headerText !== 'Is Deleted') {
            headers.push(headerText);
        }
    });

    // Loop through the data and format it
    allData.each(function (value, index) {
        var rowData = [];
        value.forEach(function (cell, cellIndex) {
            var headerText = $('#' + tableId + ' thead th').eq(cellIndex).text().trim();

            // Exclude Is Active and Is Deleted columns
            if (headerText !== 'Is Active' && headerText !== 'Is Deleted' && headerText !== 'Actions') {
                rowData.push(cell);
            }
        });

        body.push(rowData);
    });

    // Generate PDF content
    doc.text("User List Export", 10, 10);
    doc.autoTable({
        head: [headers],
        body: body,
        theme: 'grid',
        startY: 20
    });

    doc.save(fileName + '.pdf');
}

function exportData(type, tableId) {
    const table = $(`#${tableId}`).DataTable();

    if (!table) {
        console.error(`Table with ID '${tableId}' not found.`);
        return;
    }

    // Perform export logic based on type
    switch (type) {
        case 'csv':
            exportTableToCSV(tableId, tableId + '-export');
            break;
        case 'pdf':
            exportTableToPDF(tableId, tableId + '-export');
            break;
        default:
            console.error(`Unsupported export type: ${type}`);
    }
}
/* EXPORT DATA FOR CSV AND EXCEL: - End */
function makeDataTable(tableId) {
    var searchbox = '<"form-group has-search margin-bottom-search mb-0"f>';
    var _buttons = '<"#customButtons.d-flex align-items-center gap-4 me-4">'; // Container for buttons

    var _language = {
        "info": "<span class='active'>_START_</span> - <span>_END_</span> of <span class='dataTables_info_total'>_TOTAL_</span>",
        "infoFiltered": "",
        "infoEmpty": "",
        "search": "<img src='/assets/img/icons/search.svg' class='' alt='search' width='20' height='20'>",
        "lengthMenu": "Show rows per page _MENU_",
        "paginate": {
            "next": "<img src='/assets/img/icons/next-table-data.svg' width='12' height='12' />",
            "previous": "<img src='/assets/img/icons/prev-table-data.svg' width='12' height='12' />"
        }
    };

    var _dom = `<"d-flex justify-content-between align-items-center p-2"
                    <"d-flex align-items-center"
                        ${searchbox}
                    >
                    <"#last_section.align-items-center d-flex"
                        ${_buttons}<"#dt_length.custom_table_length d-flex align-items-center"l>
                        <"#dt_info"i>
                        <"#dt_paginate.dt_paginate"p>
                    >
                >t`;

    document.addEventListener('DOMContentLoaded', function () {
        const customButtonsContainer = document.getElementById('customButtons');
        if (customButtonsContainer && customButtonsContainer.children.length === 0) {
            const buttons = [
                { id: "btn1", icon: "/assets/img/icons/column-edit.svg", target: "#offcanvas1", tooltip: "edit column", iconWidth: 20, iconHeight: 20 },
                { id: "btn2", icon: "/assets/img/icons/filter.svg", target: "#offcanvas2", tooltip: "filter", iconWidth: 20, iconHeight: 20 },
                { id: "btn3", icon: "/assets/img/icons/download.svg", tooltip: "Download Options", iconWidth: 20, iconHeight: 20 }
            ];

            buttons.forEach(button => {
                if (button.id === "btn3") {
                    // Create a dropdown button
                    const dropdownContainer = document.createElement('div');
                    dropdownContainer.className = 'dropdown'; // Bootstrap dropdown class

                    const dropdownButton = document.createElement('button');
                    dropdownButton.id = button.id;
                    dropdownButton.className = 'btn btn_primary_light_icon_sm'; // Add dropdown classes
                    dropdownButton.setAttribute('data-bs-toggle', 'dropdown'); // Bootstrap dropdown toggle
                    dropdownButton.setAttribute('aria-expanded', 'false'); // Accessibility
                    dropdownButton.setAttribute('title', button.tooltip); // Tooltip text
                    dropdownButton.setAttribute('aria-label', button.tooltip); // Accessibility

                    const icon = document.createElement('img');
                    icon.src = button.icon; // Path to the custom icon
                    icon.alt = button.tooltip; // Alternate text for the icon
                    icon.width = button.iconWidth; // Adjust icon width
                    icon.height = button.iconHeight; // Adjust icon height
                    dropdownButton.appendChild(icon);

                    // Create the dropdown menu
                    const dropdownMenu = document.createElement('ul');
                    dropdownMenu.className = 'dropdown-menu'; // Bootstrap dropdown menu class

                    // Add dropdown items
                    const options = [
                        { text: "CSV", value: "csv", icon: "/assets/img/icons/csv.svg" },
                        { text: "PDF", value: "pdf", icon: "/assets/img/icons/pdf.svg" }
                    ];

                    options.forEach(option => {
                        const listItem = document.createElement('li');
                        const anchor = document.createElement('a');
                        anchor.className = 'dropdown-item d-flex align-items-center flex-row-reverse justify-content-end'; // Bootstrap dropdown item class
                        anchor.href = '#'; // Replace with your action or JavaScript

                        // Added By:- Harshida Parmar (09-01-'25) :- Start
                        anchor.setAttribute('data-export-type', option.value);
                        anchor.setAttribute('data-table-id', tableId); // Add custom attribute for table ID
                        anchor.addEventListener('click', function (e) {
                            e.preventDefault();
                            const type = this.getAttribute('data-export-type');
                            const tableId = this.getAttribute('data-table-id');
                            exportData(type, tableId);
                        });
                        // Added By:- Harshida Parmar (09-01-'25) :- End

                        const optionIcon = document.createElement('img');
                        optionIcon.src = option.icon; // Path to the option icon
                        optionIcon.alt = option.text; // Alternate text for the icon
                        optionIcon.width = 24; // Icon width
                        optionIcon.height = 24; // Icon height
                        optionIcon.className = 'me-2'; // Add some margin for spacing

                        anchor.innerText = option.text;
                        anchor.appendChild(optionIcon); // Append icon
                        // anchor.appendChild(textNode); // Append text
                        listItem.appendChild(anchor);
                        dropdownMenu.appendChild(listItem);
                    });

                    dropdownContainer.appendChild(dropdownButton);
                    dropdownContainer.appendChild(dropdownMenu);
                    customButtonsContainer.appendChild(dropdownContainer);
                } else {
                    const btn = document.createElement('button');
                    btn.id = button.id;
                    btn.className = 'btn btn_primary_light_icon_sm';
                    btn.setAttribute('data-bs-toggle', 'offcanvas');
                    btn.setAttribute('data-bs-target', button.target);
                    btn.setAttribute('title', button.tooltip); // Tooltip text
                    btn.setAttribute('aria-label', button.tooltip); // Accessibility
                    btn.style.border = "none"; // Remove the border
                    btn.style.outline = "none"; // Remove the outline (focus state)

                    const icon = document.createElement('img');
                    icon.src = button.icon; // Path to the custom icon
                    icon.alt = button.tooltip; // Alternate text for the icon
                    icon.width = button.iconWidth; // Adjust icon width
                    icon.height = button.iconHeight; // Adjust icon height
                    btn.appendChild(icon);

                    customButtonsContainer.appendChild(btn);
                }
            });
        }
    });


    // Initialize the DataTable
    table = $('#' + tableId).DataTable({
        scrollY: true,
        fixedHeader: true,
        className: 'mdl-data-table__cell--non-numeric',
        language: _language,
        dom: _dom,
        "columnDefs": [
            { "orderable": false, "targets": 0 }
        ],
        drawCallback: function (settings) {
            // Update checkbox states when clicked
        }
    });

    // Adjust table header
    setTimeout(function () {
        $("#" + tableId + "_wrapper #dataTables_tbl_header").insertBefore($("#tableResponsive"));
    }, 100);
}

// Initialize DataTables for specific tables
makeDataTable("user-list");
makeDataTable("roles-permission");
makeDataTable("company-correspondances-list");
makeDataTable("company-statutory-list");
makeDataTable("area-master-list");
//makeDataTable("roles-permission");

