var FilterModal = {
    init: async function () {
        try {
            const sessionCompanyId = $("#sessionCompanyId").val();

            await $.getScript('/assets/src/js/select2.min.js');
            await $.getScript('/assets/src/custom-js/select2.js');

            await FilterModal.fetchCompanies(sessionCompanyId);
            FilterModal.resetFilters();
            await FilterModal.fetchPreviousMonthYear(sessionCompanyId);
            await FilterModal.fetchContractors(sessionCompanyId);
            await FilterModal.fetchLocations(sessionCompanyId);

            console.log("✅ Filter modal initialized successfully");
            FilterModal.bindEvents();
        } catch (error) {
            console.error("❌ Filter modal init failed:", error);
            alert("Something went wrong while initializing filters. Please try again.");
        }
    },

    bindEvents: function () {
        $('#mapCompanyDropdown').on('change', async function () {
            const companyId = $(this).val();
            if (companyId) {
                await FilterModal.fetchPreviousMonthYear(companyId);
                await FilterModal.fetchContractors(companyId);
                await FilterModal.fetchLocations(companyId);
            }
        });

        $('#mapContractorDropdown').on('change', async function () {
            const companyId = $('#mapCompanyDropdown').val();
            if (companyId) {
                await FilterModal.fetchLocations(companyId);
            }
        });

        $('#resetEntityFilterBtn').on('click', function () {
            FilterModal.resetFilters();
        });
    },

    resetFilters: function () {
        $('#mapContractorDropdown').val([]).trigger('change');
        $('#mapLocationDropdown').val([]).trigger('change');
        $('#edatef').val('');
        $('#monthName').val('');
        $('#year').val('');
        $('.input_error_msg').text('');
    },

    fetchCompanies: function (selectedValue = '') {
        return $.ajax({
            url: '/DropDown/FetchCompaniesDropdown',
            type: 'GET',
            success: function (data) {
                FilterModal.populateSingleSelect('#mapCompanyDropdown', data, 'value', 'text', selectedValue);
            },
            error: function () {
                console.error("❌ Error fetching companies.");
            }
        });
    },

    fetchContractors: function (companyId) {
        return $.ajax({
            url: `/DropDown/FetchContractorDropdown?contractor_ID=0&company_ID=${companyId}`,
            type: 'GET',
            success: function (data) {
                FilterModal.populateMultiSelect('#mapContractorDropdown', data, 'value', 'text');
            },
            error: function () {
                console.error("❌ Error fetching contractors.");
            }
        });
    },

    fetchLocations: function (companyId) {
        return $.ajax({
            url: `/DropDown/FetchDistinctLocationDropdown?companyId=${companyId}`,
            type: 'GET',
            success: function (data) {
                FilterModal.populateMultiSelect('#mapLocationDropdown', data, 'value', 'text');
            },
            error: function () {
                console.error("❌ Error fetching locations.");
            }
        });
    },

    fetchPreviousMonthYear: function (companyId) {
        return $.ajax({
            url: '/ContractorValidation/GetPreviousMonthYearPeriod',
            type: 'GET',
            data: { companyId: companyId }
        }).done(function (response) {
            if (response.isSuccess && response.data) {
                $('#hiddenMonthId').val(response.data.month_Id);
                $('#year').val(response.data.year);
                $('#monthName').val(response.data.monthName);
            } else {
                alert(response.message || "⚠️ Failed to fetch pay period.");
            }
        }).fail(function () {
            alert("❌ Error fetching month/year.");
        });
    },

    populateSingleSelect: function (selector, data, valueField, textField, selectedValue = "") {
        const dropdown = $(selector);
        dropdown.empty().append('<option value="">Select</option>');

        if (Array.isArray(data) && data.length > 0) {
            $.each(data, function (index, item) {
                dropdown.append(
                    $('<option></option>')
                        .attr("value", item[valueField])
                        .text(item[textField])
                );
            });
        }

        dropdown.val(selectedValue).trigger('change');

        if ($.fn.select2) {
            dropdown.select2("destroy").select2({
                placeholder: dropdown.data('placeholder') || 'Select',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                dropdownParent: $('#standardFilterModal')
            });
        }
    },

    populateMultiSelect: function (selector, data, valueField, textField, selectedValues = []) {
        const dropdown = $(selector);
        dropdown.empty();

        if (Array.isArray(data) && data.length > 0) {
            $.each(data, function (index, item) {
                dropdown.append(
                    $('<option></option>')
                        .attr("value", item[valueField])
                        .text(item[textField])
                );
            });
        }

        dropdown.val(selectedValues).trigger('change');

        if ($.fn.select2) {
            dropdown.select2("destroy").select2({
                placeholder: dropdown.data('placeholder') || 'Select',
                allowClear: true,
                multiple: true,
                width: '100%',
                dropdownAutoWidth: true,
                dropdownParent: $('#standardFilterModal')
            });
        }
    }
};
