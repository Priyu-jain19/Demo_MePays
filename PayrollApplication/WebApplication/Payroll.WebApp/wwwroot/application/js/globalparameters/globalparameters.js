/// <summary>
/// Developer Name :- Harshida Parmar
///  Created Date  :- 14-05-2025
///  IMP NOTE      :-
///                1) IF any function shows "0 references" then still do not remove because we are calling that
///                   function from BUTTON CLICK OR in MODEL-POP-UP.
/// </summary>
$(document).ready(function () {
    setTimeout(function () {
        var companyId = $('#SessionCompanyId').val();
    
        $.ajax({
            //url: '/PayrollGlobalParameters/FetchPayrollSettings', // Adjust URL as per your controller
            url: '/PayrollGlobalParameters/FetchPayrollSettings?companyId=' + companyId, 
            type: 'GET',
            success: function (response) {
                var hasValidData = false;
                //////////////////////////// Bind 1st Tab:- Start/////////////////////////////
                if (response.success && response.data && response.data.globalParams) {
                    hasValidData = true;
                    var payrollParam = response.data.globalParams;
                    if (payrollParam) {
                        //console.log(response.data.globalParams);
                        $('#GlobalParamId').val(payrollParam.global_Param_ID);
                        if (payrollParam.salary_Frequency != null) {
                            $('#SalaryFrequency').val(payrollParam.salary_Frequency).trigger('change');
                        }
                        if (payrollParam.monthlySalary_Based_On != null) {
                            $('#MonthlySalaryBasedOn').val(payrollParam.monthlySalary_Based_On).trigger('change');
                        }
                        if (payrollParam.effectivePayroll_start_Mnth != null) {
                            $('#EffectivePayrollStartMonth').val(payrollParam.effectivePayroll_start_Mnth).trigger('change');
                        }
                        if (payrollParam.allow_Adhoc_Components != null) {
                            $('#AllowAdHocComponents').val(payrollParam.allow_Adhoc_Components ? 1 : 0).trigger('change');
                        }
                        if (payrollParam.lOckSalary_Post_Payroll != null) {
                            $('#LockSalary').val(payrollParam.lOckSalary_Post_Payroll ? 1 : 0).trigger('change');
                        }
                        if (payrollParam.round_Off_Components != null) {
                            $('#RoundSalary').val(payrollParam.round_Off_Components ? 1 : 0).trigger('change');
                        }

                        ///Enable Toggle 
                        if (payrollParam.global_Param_ID) {                           
                            $('#toggleContainer').show(); // Show toggle
                            if (payrollParam.isActive) {
                                $('#formulaActiveToggle').prop('checked', true);
                                $('#formulaStatusLabel').text("Active");
                            } else {
                                $('#formulaActiveToggle').prop('checked', false);
                                $('#formulaStatusLabel').text("Inactive");
                            }
                        }
                    }
                }              
                //////////////////////////// Bind 1st Tab:- End/////////////////////////////

                //////////////////////////// Bind 2nd Tab:- Start/////////////////////////////
                //console.log("response.data.compliances");
                //console.log(response.data.compliances);
                if (response.success && response.data && response.data.compliances) {
                    hasValidData = true;
                    const comp = response.data.compliances;
                    $('#Prm_Comlliance_ID').val(comp.prm_Comlliance_ID ?? "");

                    if (comp.pf_Applicable != null) {
                        $('#Pf_Applicable').val(comp.pf_Applicable).trigger('change');
                    }
                    if (comp.pf_Based_on != null) {
                        $('#Pf_Based_on').val(comp.pf_Based_on).trigger('change');
                    }

                    if (comp.pf_Applicable_Percentage != null) {
                        $('#Pf_Applicable_Percentage').val(comp.pf_Applicable_Percentage);
                    }
                    if (comp.esi_Based_on != null) {
                        $('#Esic_Based_on').val(comp.esi_Based_on).trigger('change');
                    }
                    if (comp.esi_Employer_Percentage != null) {
                        $('#Esi_Employer_Percentage').val(comp.esi_Employer_Percentage);
                    }

                    if (comp.pf_Share_Mode_Employer != null) {
                        $('#Pf_Share_Mode_Employer').val(comp.pf_Share_Mode_Employer).trigger('change');
                    }

                    if (comp.epf_Employer_Share_Percentage != null) {
                        $('#Epf_Employer_Share_Percentage').val(comp.epf_Employer_Share_Percentage);
                    }

                    if (comp.eps_Employer_Share_Percentage != null) {
                        $('#Eps_Employer_Share_Percentage').val(comp.eps_Employer_Share_Percentage);
                    }

                    if (comp.vpF_Applicable != null) {
                        $('#VPF_Applicable').val(comp.vpF_Applicable ? 1 : 0).trigger('change');
                    }

                    if (comp.vpF_Mode != null) {
                        $('#VPF_Mode').val(comp.vpF_Mode).trigger('change');
                    }

                    if (comp.esic_Applicable != null) {
                        $('#Esic_Applicable').val(comp.esic_Applicable ? 1 : 0).trigger('change');
                    }

                    if (comp.esic_Salary_Limit != null) {
                        $('#Esic_Salary_Limit').val(comp.esic_Salary_Limit);
                    }

                    if (comp.pT_Applicable != null) {
                        $('#PT_Applicable').val(comp.pT_Applicable ? 1 : 0).trigger('change');
                    }

                    if (comp.pt_Registration_Mode != null) {
                        $('#Pt_Regisdtration_Mode').val(comp.pt_Registration_Mode).trigger('change');
                    }

                    if (comp.lwf_Mode != null) {
                        $('#Lwf_Mode').val(comp.lwf_Mode).trigger('change');
                    }

                    if (comp.lwf_Cycle != null) {
                        $('#Lwf_Cycle').val(comp.lwf_Cycle).trigger('change');
                    }

                    if (comp.lwf_Contribution != null) {
                        $('#Lwf_Contribution').val(comp.lwf_Contribution);
                    }
                    if (comp.tDsDeducted_On_Actual_Date != null) {
                        $('#TDsDeducted_On_Actual_Date').val(comp.tDsDeducted_On_Actual_Date ? 1 : 0).trigger('change');
                    }
                    if (comp.esi_Applicable_Percentage != null) {
                        $('#Esi_Applicable_Percentage').val(comp.esi_Applicable_Percentage);
                    }
                    // Show toggle only if Prm_Comlliance_ID is present and > 0
                    if (comp.prm_Comlliance_ID && comp.prm_Comlliance_ID > 0) {
                        $('#toggleContainerTabSecond').show();

                        // Set checkbox based on isActive value
                        if (comp.isActive === true) {
                            $('#formulaActiveToggleTabSecond').prop('checked', true);
                            $('#formulaStatusLabelTabSecond').text('Active');
                        } else {
                            $('#formulaActiveToggleTabSecond').prop('checked', false);
                            $('#formulaStatusLabelTabSecond').text('Inactive');
                        }
                    } else {
                        $('#toggleContainerTabSecond').hide();
                    }

                }
                //////////////////////////// Bind 2nd Tab:- End/////////////////////////////

                //////////////////////////// Bind 3rd Tab:- Start/////////////////////////////
                //console.log("response.data.settings");
                //console.log(response.data.settings);
                if (response.success && response.data && response.data.settings) {
                    hasValidData = true;
                    var settings = response.data.settings;

                    $('#Payroll_Setin_ID').val(settings.payroll_Setin_ID);
                    $('#Initial_char').val(settings.initial_char || '');

                    // Bind selects with boolean properties as 0/1 and others directly
                    $('#Enable_Pay').val(settings.payslip_Generation ? 1 : 0).trigger('change');  // If Enable_Pay is supposed to be Payslip_Generation? Confirm mapping.

                    $('#Payslip_Generation').val(settings.payslip_Generation ? 1 : 0).trigger('change');

                    $('#Payslip_Format').val(settings.payslip_Format).trigger('change');

                    var payslipFormatArr = (settings.payslipNumber_Format || '')
                        .split(',')
                        .map(s => s.trim()) // Remove any extra spaces
                        .filter(s => s);     // Remove empty values if any
                    $('#PayslipNumber_Format').val(payslipFormatArr).trigger('change');

                    $('#PaySlip_Number_Scope').val(settings.paySlip_Number_Scope).trigger('change');

                    //$('#PaySlip_Number_Scope').val(settings.paySlip_Number_Scope);

                    $('#Auto_Numbering').val(settings.auto_Numbering ? 1 : 0).trigger('change');

                    $('#IsPayslipNo_Reset').val(settings.isPayslipNo_Reset ? 1 : 0).trigger('change');

                    $('#DigitalSignatur_Requirede').val(settings.digitalSignatur_Requirede ? 1 : 0).trigger('change');

                    $('#PaySlipAutoEmail').val(settings.paySlipAutoEmail ? 1 : 0).trigger('change');
                    if (settings.payroll_Setin_ID && settings.payroll_Setin_ID > 0) {
                        $('#toggleContainerTabThird').show();

                        if (settings.isActive === true) {
                            $('#formulaActiveToggleTabThird').prop('checked', true);
                            $('#formulaStatusLabelTabThird').text('Active');
                        } else {
                            $('#formulaActiveToggleTabThird').prop('checked', false);
                            $('#formulaStatusLabelTabThird').text('Inactive');
                        }
                    } else {
                        $('#toggleContainerTabThird').hide();
                    }
                }
               
                //////////////////////////// Bind 3rd Tab:- End/////////////////////////////

                //////////////////////////// Bind 4th Tab:- Start /////////////////////////////
                //console.log("response.data.thirdPartyParams");
                //console.log(response.data.thirdPartyParams);
                if (response.success && response.data && response.data.thirdPartyParams) {
                    hasValidData = true;
                    var thirdParty = response.data.thirdPartyParams;

                    $('#Clms_Param_ID').val(thirdParty.clms_Param_ID);

                    $('#DataSyncType').val(thirdParty.dataSync ? 1 : 0).trigger('change');
                    $('#WorkOrder').val(thirdParty.wo_Sync_Frequency || '').trigger('change');
                    $('#ContractorMaster').val(thirdParty.cl_Sync_Frequency || '').trigger('change');
                    $('#LabourMaster').val(thirdParty.entity_Sync_Frequency || '').trigger('change');
                    $('#Attendance').val(thirdParty.entity_Sync_Frequency || '').trigger('change');
                    $('#IsContractLabourPayment').val(thirdParty.contractlabour_payment ? 1 : 0).trigger('change');
                    $('#IsAttendanceProcessed').val(thirdParty.isAttendanceProcessed ? 1 : 0).trigger('change');
                    $('#IntegratedLogin').val(thirdParty.integratedLog_in ? 1 : 0).trigger('change');
                    $('#PayregisterFormatId').val(thirdParty.payregisterFormat_ID || '').trigger('change');
                    $('#AttendanceProxcessType').val(thirdParty.attendanceProxcessType || '').trigger('change');

                    if (thirdParty.clms_Param_ID && thirdParty.clms_Param_ID > 0) {
                        $('#toggleContainerTabFourth').show();
                        if (thirdParty.isActive === true) {
                            $('#formulaActiveToggleTabFourth').prop('checked', true);
                            $('#formulaStatusLabelTabFourth').text('Active');
                        } else {
                            $('#formulaActiveToggleTabFourth').prop('checked', false);
                            $('#formulaStatusLabelTabFourth').text('Inactive');
                        }
                    } else {
                        $('#toggleContainerTabFourth').hide();
                    }

                    var selectedEntities = (thirdParty.entityparam || "").split(',').map(s => s.trim());
                    fetchAndBindMultiSelectDropdownForGlobal(
                        '/DropDown/FetchEntityTypeDropdown',
                        '#EntityTypeMigration',
                        'Select Entity Type(s)',
                        null,
                        selectedEntities
                    );
                    //hasValidData = true;
                    //var thirdParty = response.data.thirdPartyParams;
                    //$('#Clms_Param_ID').val(thirdParty.clms_Param_ID);
                    //$('#DataSyncType').val(thirdParty.dataSync ? 1 : 0).trigger('change');
                    //$('#WorkOrder').val(thirdParty.wo_Sync_Frequency).trigger('change');
                    //$('#ContractorMaster').val(thirdParty.cl_Sync_Frequency).trigger('change');                 
                    ////$('#LabourMaster').val(thirdParty.cl_Sync_Frequency).trigger('change');
                    //$('#LabourMaster').val(thirdParty.entity_Sync_Frequency).trigger('change');
                    //$('#IsContractLabourPayment').val(thirdParty.contractlabour_payment ? 1 : 0).trigger('change');
                    //$('#IsAttendanceProcessed').val(thirdParty.isAttendanceProcessed ? 1 : 0).trigger('change');                   
                    //$('#Attendance').val(thirdParty.entity_Sync_Frequency).trigger('change');
                    //$('#IntegratedLogin').val(thirdParty.integratedLog_in ? 1 : 0).trigger('change');
                    //$('#PayregisterFormatId').val(thirdParty.payregisterFormat_ID).trigger('change');
                    //$('#AttendanceProxcessType').val(thirdParty.attendanceProxcessType).trigger('change');
                    //if (thirdParty.clms_Param_ID && thirdParty.clms_Param_ID > 0) {
                    //    $('#toggleContainerTabFourth').show();
                    //    if (thirdParty.isActive === true) {
                    //        $('#formulaActiveToggleTabFourth').prop('checked', true);
                    //        $('#formulaStatusLabelTabFourth').text('Active');
                    //    } else {
                    //        $('#formulaActiveToggleTabFourth').prop('checked', false);
                    //        $('#formulaStatusLabelTabFourth').text('Inactive');
                    //    }
                    //} else {
                    //    $('#toggleContainerTabFourth').hide();
                    //}                 
                    //var selectedEntities = (thirdParty.entityparam || "").split(',').map(s => s.trim());
                    //// Call dropdown binding with selected values
                    //fetchAndBindMultiSelectDropdownForGlobal(
                    //    '/DropDown/FetchEntityTypeDropdown',
                    //    '#EntityTypeMigration',
                    //    'Select Entity Type(s)',
                    //    null,
                    //    selectedEntities
                    //);
                }
                //////////////////////////// Bind 4th Tab:- End /////////////////////////////


                /////////////////////////// Hide-Show Model Popup:-Start///////////////////////////
                if (hasValidData) {
                    $('#btnCopySettings').show();
                } else {
                    $('#btnCopySettings').hide();  
                }
                ////////////////////////   Hide-Show Model Popup:-End///////////////////////////
            },
            error: function (xhr, status, error) {
                //console.error("Error fetching payroll settings:", error);
            }
        });
    }, 500); 
    bindAllDropdowns();
    function bindAllDropdowns() {
        $('#globalDropdownLoader').show(); // 👈 Show loader before binding starts

        const dropdownPromises = [];

        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchSalaryFrequencyDropdown', '#SalaryFrequency', 'Select Salary Frequency'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchMonthlySalaryDropdown', '#MonthlySalaryBasedOn', 'Select Monthly Salary Type'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchEnablePayDropdown', '#RoundSalary', 'Select Round Salary Type'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchEffectivePayrollStartMonthDropdown', '#EffectivePayrollStartMonth', 'Select Payroll Start Month'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchAllowAdhocComponentsDropdown', '#AllowAdHocComponents', 'Select AdHoc Components'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchLockSalaryEditsPostPayrollDropdown', '#LockSalary', 'Select Lock Salary'));

        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPFApplicableDropdown', '#Pf_Applicable', 'Select PF Applicability'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchESICBasedOnDropdown', '#Esic_Based_on', 'Select ESIC Based On'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPFEmployerShareDropdown', '#Pf_Share_Mode_Employer', 'Select PF Share Mode'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchVoluntaryPFDropdown', '#VPF_Applicable', 'Select VPF Applicability'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchVPFModeDropdown', '#VPF_Mode', 'Select VPF Mode'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchESICApplicabilityDropdown', '#Esic_Applicable', 'Select ESIC Applicability'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchProfessionalTaxDropdown', '#PT_Applicable', 'Select PT Applicability'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPTRegistrationModeDropdown', '#Pt_Regisdtration_Mode', 'Select PT Registration Mode'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchLabourWelfareFundDropdown', '#Lwf_Mode', 'Select LWF Mode'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchLWFCycleDropdown', '#Lwf_Cycle', 'Select LWF Cycle'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchTDSDeductedOnActualDateDropdown', '#TDsDeducted_On_Actual_Date', 'Select TDS Deducted On Actual Date'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPFBasedOnDropdown', '#Pf_Based_on', 'Select PF Based On'));

        //dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchEnablePayDropdown', '#Enable_Pay', 'Select Enable Pay'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchSlipGenerationDropdown', '#Payslip_Generation', 'Select Enable Pay Slip Generation'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPayslipFormatDropdown', '#Payslip_Format', 'Select Payslip Format'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPaySlipNumberingScopeDropdown', '#PaySlip_Number_Scope', 'Select Payslip Number Scope'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPayResetNumberingDropdown', '#IsPayslipNo_Reset', 'Select Reset Payslip Numbering'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchAutoNumberingDropdown', '#Auto_Numbering', 'Select Auto Numbering'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPaySlipIDFormatDropdown', '#PayslipNumber_Format', 'Select Payslip Number Format'));
        dropdownPromises.push(fetchAndBindMultiSelectDropdownForPaySlipIDFormat(
            '/DropDown/FetchPaySlipIDFormatDropdown',
            '#PayslipNumber_Format',
            'Select Payslip Number Format'
        ));
     
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchDigitalSignatureDropdown', '#DigitalSignatur_Requirede', 'Select Digital Signature Requirement'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchAutoEmailPayslipsDropdown', '#PaySlipAutoEmail', 'Select Auto Email Payslips'));

        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchCommongYesNoDropdown', '#DataSyncType', 'Select Data Sync Type'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchCommongYesNoDropdown', '#IsContractLabourPayment', 'Select Is ContractLabour Payment'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchSyncFrequencyDropdown', '#ContractorMaster', 'Select Contractor Master'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchSyncFrequencyDropdown', '#LabourMaster', 'Select Entity Sync Frequency'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchSyncFrequencyDropdown', '#WorkOrder', 'Select Work Details'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchSyncFrequencyDropdown', '#Attendance', 'Select Attendance'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchCommongYesNoDropdown', '#IsAttendanceProcessed', 'Select Is Attendance Processed'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchSyncFrequencyDropdown', '#AttendanceProxcessType', 'Select Attendance Process Type'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchCommongYesNoDropdown', '#IntegratedLogin', 'Select Integrated Login'));
        dropdownPromises.push(fetchAndBindDropdownForGlobal('/DropDown/FetchPaymentFormatDropdown', '#PayregisterFormatId', 'Select Pay RegisterFormat'));

        dropdownPromises.push(fetchAndBindMultiSelectDropdownForGlobal('/DropDown/FetchEntityTypeDropdown', '#EntityTypeMigration', 'Select Entity Type(s)'));

        dropdownPromises.push(bindCompanyDropdownOnPageLoad()); // If it returns a promise

        // 👇 Hide loader once all bindings are complete
        //Promise.all(dropdownPromises).then(() => {
        //    $('#globalDropdownLoader').hide();
        //    // ✅ Then show the modal
        //    const copySettingsModal = new bootstrap.Modal(document.getElementById('copySettingsModal'));
        //    copySettingsModal.show();
        //});
        Promise.all([
            ...dropdownPromises,
            //new Promise(resolve => setTimeout(resolve, 10000)) // ⏱ Ensure at least 10 seconds wait
            new Promise(resolve => setTimeout(resolve, 5000)) // ⏱ Ensure at least 5 seconds wait
        ]).then(() => {
            $('#globalDropdownLoader').hide();
            //const copySettingsModal = new bootstrap.Modal(document.getElementById('copySettingsModal'));
            //copySettingsModal.show();
        });
    }
    // Initial call on page load
    togglePfFields();
    toggleEsicFields();

    // Call on ESIC dropdown change
    $('#Esic_Applicable').on('change', function () {
        toggleEsicFields();
    });
    // When PF_Applicable changes
    $('#Pf_Applicable').on('change', function () {
        togglePfFields();
    });

    // When VPF_Applicable changes (only if PF is "Yes")
    $('#VPF_Applicable').on('change', function () {
        if ($('#Pf_Applicable').val() === "1") {
            toggleVPFMode();
        }
    });

     //$('#copySettingsModal').modal('show');
    $('#resetfirstTab').on('click', function () {
        //const isEditMode = $('#payComponentForm').data('edit-id') !== undefined;

        //if (isEditMode) {
        //    // Re-populate original values from DB
        //    const id = $('#payComponentForm').data('edit-id');
        //    if (id) {
        //        // Call the same AJAX logic to refill
        //        $('.paycomponent[data-id="' + id + '"]').trigger('click');
        //    }
        //} else {
            // Reset all fields for Add mode
            $('#firstTab')[0].reset();
            $(".select2_search_ctm").val(null).trigger("change");
            $(".input_error_msg").text("");           
            //$('#payComponentActiveToggle').prop('checked', false);
            //$('#activeStatusLabel').text('Inactive');
            $('#btnfirstTab').text('Add');
        //}
    });
});
$(document).ready(function () {
    ////////////////////////////////////////////First Tab Insert Data :- Start ///////////////////////////////////////////
    $('#btnfirstTab').click(function () {
        // 1. Read form values
        var salaryFrequency = $('#SalaryFrequency').val();
        var monthlySalaryBasedOn = $('#MonthlySalaryBasedOn').val();
        var roundSalary = $('#RoundSalary').val();
        var effectiveMonth = $('#EffectivePayrollStartMonth').val();
        var allowAdhoc = $('#AllowAdHocComponents').val();
        var lockSalary = $('#LockSalary').val();
        var companyIdForTabOne = $('#SelectedCompanyIdOnPageLoad').val();
        companyIdForTabOne = companyIdForTabOne && !isNaN(companyIdForTabOne) ? parseInt(companyIdForTabOne) : 0;
        // 2. Validate form
        var isValid = true;
        isValid &= validateDPFormRequired(salaryFrequency, "#SalaryFrequency-error", "Please select Salary Frequency.");
        isValid &= validateDPFormRequired(monthlySalaryBasedOn, "#MonthlySalaryBasedOn-error", "Please select Monthly Salary Based On.");
        isValid &= validateDPFormRequired(roundSalary, "#RoundSalary-error", "Please select Round-off Salary.");
        isValid &= validateDPFormRequired(effectiveMonth, "#EffectivePayrollStartMonth-error", "Please select Effective Payroll Start Month.");
        isValid &= validateDPFormRequired(allowAdhoc, "#AllowAdHocComponents-error", "Please select Allow Ad-Hoc Components.");
        isValid &= validateDPFormRequired(lockSalary, "#LockSalary-error", "Please select Lock Salary.");

        if (!isValid) return;

        // 4. Get Global Param ID safely
        var globalParamId = $('#GlobalParamId').val();
        globalParamId = globalParamId && !isNaN(globalParamId) ? parseInt(globalParamId) : 0;
        var isActive = $('#formulaActiveToggle').is(':visible') ? $('#formulaActiveToggle').is(':checked') : false;
        var data = {
            Global_Param_ID: globalParamId,
            Company_ID: companyIdForTabOne, 
            Salary_Frequency: parseInt(salaryFrequency),
            MonthlySalary_Based_On: parseInt(monthlySalaryBasedOn),
            Round_Off_Components: roundSalary === "1" || roundSalary === "true",
            EffectivePayroll_start_Mnth: effectiveMonth,
            Allow_Adhoc_Components: allowAdhoc === "1",
            LOckSalary_Post_Payroll: lockSalary === "1",
            IsActive: isActive
        };
        //console.log(data);
        $.ajax({
            url: '/PayrollGlobalParameters/InsertPGlobalParameter', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.success) {
                    showAlert("success", response.message);                 
                    setTimeout(function () {
                        window.location.href = '/PayrollGlobalParameters/Index';
                    }, 5500);
                } else {
                    showAlert("danger", response.message);
                }
            },
            error: function (xhr, status, error) {                
                showAlert("danger", "An unexpected error occurred.");
            }
        });
    });
    ////////////////////////////////////////////First Tab Insert Data :- End ///////////////////////////////////////////

    ////////////////////////////////////////////Second Tab Insert Data :- Start ///////////////////////////////////////////
    $('#Pf_Applicable_Percentage, #Epf_Employer_Share_Percentage').on('input', function () {
        const pfApplicable = $('#Pf_Applicable').val();
        if (pfApplicable === "1") {
            var value = this.value;

            // Sanitize input
            var cleaned = value
                .replace(/[^\d.]/g, '')                 // Remove non-digits except .
                .replace(/(\..*?)\..*/g, '$1')          // Allow only one dot
                .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2'); // Limit to 2 decimal places

            // Only update if different
            if (value !== cleaned) {
                this.value = cleaned;
            }

            const id = `#${this.id}`;
            const label = $(this).attr('name').replace(/_/g, ' ');
            validateFloat2DecimalLive(this.value, id, label);
        }
    });
    $('#Pf_Applicable_Percentage, #Epf_Employer_Share_Percentage').on('keydown', function (e) {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    });
    $('#Esic_Salary_Limit, #Esi_Applicable_Percentage').on('input', function () {
        const esicApplicable = $('#Esic_Applicable').val();
        if (esicApplicable === "1") {
            var value = this.value;

            // Sanitize input
            var cleaned = value
                .replace(/[^\d.]/g, '')                 // Remove non-digits except .
                .replace(/(\..*?)\..*/g, '$1')          // Allow only one dot
                .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2'); // Limit to 2 decimal places

            // Only update if different
            if (value !== cleaned) {
                this.value = cleaned;
            }

            const id = `#${this.id}`;
            const label = $(this).attr('name').replace(/_/g, ' ');
            validateFloat2DecimalLive(this.value, id, label);
        }
    });
    $('#Esic_Salary_Limit, #Esi_Applicable_Percentage').on('keydown', function (e) {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    });
    OnKeyUPandInput("#Eps_Employer_Share_Percentage", "#Eps_Employer_Share_Percentage-error");
    $('#Pf_Applicable').on('change', function () {
        if ($(this).val()) {
            $('#Pf_Applicable-error').text('');
        }
    });
    $('#Pf_Based_on').on('change', function () {
        const pfApplicable = $('#Pf_Applicable').val();
        const selectedValue = $(this).val();

        if (pfApplicable === "1") {
            if (selectedValue) {
                $('#Pf_Based_on-error').text('');
            } else {
                $('#Pf_Based_on-error').text('Please select PF Based On');
            }
        } else {
            $('#Pf_Based_on-error').text('');
        }
    });
    $('#Pf_Share_Mode_Employer').on('change', function () {
        const pfApplicable = $('#Pf_Applicable').val();
        const selectedValue = $(this).val();
        if (pfApplicable === "1") {
            if (selectedValue) {
                $('#Pf_Share_Mode_Employer-error').text('');
            } else {
                $('#Pf_Share_Mode_Employer-error').text('Please select PF Share Mode');
            }
        } else {
            $('#Pf_Share_Mode_Employer-error').text('');
        }
    });
    //RIGHT PANEL :- Start
    $('#Esic_Salary_Limit, #Esi_Applicable_Percentage,#Esi_Employer_Percentage').on('input', function () {
        const esicApplicable = $('#Esic_Applicable').val();
        if (esicApplicable === "1") {
            var value = this.value;

            // Sanitize input: allow only digits and one dot, with max 2 decimals
            var cleaned = value
                .replace(/[^\d.]/g, '')                 // Remove non-digits except dot
                .replace(/(\..*?)\..*/g, '$1')          // Allow only one dot
                .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2'); // Max 2 decimal digits

            if (value !== cleaned) {
                this.value = cleaned;
            }

            const id = `#${this.id}`;
            const label = $(this).attr('name').replace(/_/g, ' ');
            validateFloat2DecimalLive(this.value, id, label);
        }
    });
    $('#Esic_Salary_Limit, #Esi_Applicable_Percentage,#Esi_Employer_Percentage').on('keydown', function (e) {
        const esicApplicable = $('#Esic_Applicable').val();
        if (esicApplicable === "1") {
            if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
            }
        }       
    });
    $('#Esic_Based_on').on('change', function () {
        const esicApplicable = $('#Esic_Applicable').val();
        const selectedValue = $(this).val();

        if (esicApplicable === "1") {
            if (selectedValue) {
                $('#Esic_Based_on-error').text('');
            } else {
                $('#Esic_Based_on-error').text('Please select ESIC Based On');
            }
        } else {
            $('#Esic_Based_on-error').text('');
        }
    });
    $('#PT_Applicable').on('change', function () {
        if ($(this).val()) {
            $('#PT_Applicable-error').text('');
        }
    });
    $('#Pt_Regisdtration_Mode').on('change', function () {
        if ($(this).val()) {
            $('#Pt_Regisdtration_Mode-error').text('');
        }
    });
    $('#Lwf_Mode').on('change', function () {
        var selectedMode = $(this).val();

        if (selectedMode === "1" || selectedMode === "3") { // Applicable or StateWise
            $('#Lwf_Cycle').closest('.form-group').show();
        } else {
            $('#Lwf_Cycle').val(''); // Clear selection
            $('#Lwf_Cycle-error').text(''); // Clear error if any
            $('#Lwf_Cycle').closest('.form-group').hide();
        }
    });

    $('#Lwf_Cycle').on('change', function () {
        if ($(this).val()) {
            $('#Lwf_Cycle-error').text('');
        }
    });
    //RIGHT PANEL :- End
   

    $('#btnsecondTab').click(function (e) {
        e.preventDefault();

        // 1. Read form values
        var prmComplianceId = $('#Prm_Comlliance_ID').val();
        var pfApplicable = $('#Pf_Applicable').val();
        var pfShareMode = $('#Pf_Share_Mode_Employer').val();
        var epfShare = $('#Epf_Employer_Share_Percentage').val();
        var epsShare = $('#Eps_Employer_Share_Percentage').val();
        var vpfApplicable = $('#VPF_Applicable').val();
        var vpfMode = $('#VPF_Mode').val();
        var esicApplicable = $('#Esic_Applicable').val();
        var esicSalaryLimit = $('#Esic_Salary_Limit').val();
        var ptApplicable = $('#PT_Applicable').val();
        var ptRegMode = $('#Pt_Regisdtration_Mode').val();
        var lwfMode = $('#Lwf_Mode').val();
        var lwfCycle = $('#Lwf_Cycle').val();
        var lwfContribution = $('#Lwf_Contribution').val();
        var esiBasedOn = $('#Esic_Based_on').val();
        var esiEmployerPercentage = $('#Esi_Employer_Percentage').val();
        var tdsOnActualDate = $('#TDsDeducted_On_Actual_Date').val();
        var pfApplicablePercentage = $('#Pf_Applicable_Percentage').val();
        var pfBasedOn = $('#Pf_Based_on').val(); // ✅ New
        var esiApplicablePercentage = $('#Esi_Applicable_Percentage').val(); // ✅ New
        var selectedEntityTypes = $('#EntityTypeMigration').val() || [];
        var companyIdForTabTwo = $('#SelectedCompanyIdOnPageLoad').val();
        companyIdForTabTwo = companyIdForTabTwo && !isNaN(companyIdForTabTwo) ? parseInt(companyIdForTabTwo) : 0;
        // 2. Validate form (adjust as per your exact rules)
        var isValid = true;
        //console.log("Esic_Based_on",$('#Esic_Based_on').val());
        //console.log("Esic_Applicable",$('#Esic_Applicable').val());
        //console.log($('#Esic_Based_on').val());
        isValid &= validateFormRequired(pfApplicable, "#Pf_Applicable-error", "Please select PF Applicability.");
        isValid &= validateFormRequired(esicApplicable, "#Esic_Applicable-error", "Please select ESIC Applicability.");
        if (pfApplicable === "1") {
            isValid &= validateFormRequired(pfBasedOn, "#Pf_Based_on-error", "Please select PF Based On");           
            isValid &= validateFormRequired(pfApplicablePercentage, "#Pf_Applicable_Percentage-error", "Please enter PF Applicable Percentage.");
            isValid &= validateFormRequired(pfShareMode, "#Pf_Share_Mode_Employer-error", "Please select PF Share Mode.");
            isValid &= validateFormRequired(epfShare, "#Epf_Employer_Share_Percentage-error", "Please enter EPF %.");
            //
            isValid &= validateFormRequired(epsShare, "#Eps_Employer_Share_Percentage-error", "Please enter EPS %.");
        }
        //isValid &= validateFormRequired(epsShare, "#Eps_Employer_Share_Percentage-error", "EPS % is required.");
        //if (esicApplicable === "1") {
        //    isValid &= validateFormRequired(esiBasedOn, "#Esic_Based_on-error", "Please select ESIC Based On.");
        //    isValid &= validateFormRequired(esicSalaryLimit, "#Esic_Salary_Limit-error", "Please enter ESIC Limit.");
        //    isValid &= validateFormRequired(esiApplicablePercentage, "#Esi_Applicable_Percentage-error", "Please enter ESIC Applicable %.");
        //}
        if (esicApplicable === "1") {
                isValid &= validateFormRequired(esiBasedOn, "#Esic_Based_on-error", "Please select ESIC Based On.");
                isValid &= validateFormRequired(esicSalaryLimit, "#Esic_Salary_Limit-error", "Please enter ESIC Limit.");
                isValid &= validateFormRequired(esiApplicablePercentage, "#Esi_Applicable_Percentage-error", "Please enter ESIC Applicable %.");
            // Check that ESIC fields are not zero or empty
            if (parseFloat(esicSalaryLimit) === 0 || isNaN(parseFloat(esicSalaryLimit))) {
                $("#Esic_Salary_Limit-error").text("ESIC Wage Limit cannot be 0.");
                isValid = false;
            } else {
                $("#Esic_Salary_Limit-error").text("");
            }

            if (parseFloat(esiEmployerPercentage) === 0 || isNaN(parseFloat(esiEmployerPercentage))) {
                $("#Esi_Employer_Percentage-error").text("ESIC Employer % cannot be 0.");
                isValid = false;
            } else {
                $("#Esi_Employer_Percentage-error").text("");
            }
            if (parseFloat(esiApplicablePercentage) === 0 || isNaN(parseFloat(esiApplicablePercentage))) {
                $("#Esi_Applicable_Percentage-error").text("ESIC Applicable % cannot be 0.");
                isValid = false;
            } else {
                $("#Esi_Applicable_Percentage-error").text("");
            }
        }
        if (lwfMode === "1" || lwfMode === "3") { // Applicable or StateWise
            isValid &= validateFormRequired(lwfCycle, "#Lwf_Cycle-error", "Please select LWF Cycle.");
        } else {
            $("#Lwf_Cycle-error").text(""); // No error if hidden
        }




        //isValid &= validateFormRequired(esicSalaryLimit, "#Esic_Salary_Limit-error", "ESIC Limit is required.");
        isValid &= validateFormRequired(ptApplicable, "#PT_Applicable-error", "Please select PT Applicability.");
        isValid &= validateFormRequired(ptRegMode, "#Pt_Regisdtration_Mode-error", "Please select PT Registration Mode.");
        isValid &= validateFormRequired(lwfMode, "#Lwf_Mode-error", "Please select LWF Mode.");
        //isValid &= validateFormRequired(lwfCycle, "#Lwf_Cycle-error", "Please select LWF Cycle.");
      
       
        //console.log(isValid);
        if (!isValid) return;

        // 3. Construct the DTO
       
        var data = {
            Prm_Comlliance_ID: parseInt(prmComplianceId || 0),
            Company_ID: companyIdForTabTwo,  // REQUIRED
            Pf_Based_on: null,
            Pf_Applicable: parseInt(pfApplicable || 0), // ✅ Always 0 or 1
            Pf_Share_Mode_Employer: null,
            Epf_Employer_Share_Percentage: null,
            Eps_Employer_Share_Percentage: null, // EPS still required
            VPF_Applicable: vpfApplicable === "1",
            VPF_Mode: null,
            VPF_Percent: null,
            VPF_Employer_Share: null,
            Esic_Applicable: esicApplicable === "1",
            Esi_Employer_Percentage: esiEmployerPercentage,
            Esic_Salary_Limit: parseFloat(esicSalaryLimit), // REQUIRED
            PT_Applicable: ptApplicable === "1", // REQUIRED
            Pt_Registration_Mode: parseInt(ptRegMode || 0), // REQUIRED
            Lwf_Mode: parseInt(lwfMode), // REQUIRED
            Lwf_Cycle: parseInt(lwfCycle || 0), // REQUIRED
            Lwf_Contribution: 0, // REQUIRED
            Esi_Based_on: parseInt(esiBasedOn || 0),            
            Esi_Applicable_Percentage: parseFloat(esiApplicablePercentage || 0) // REQUIRED
        };
        // ✅ Apply PF-specific conditions
        if (pfApplicable === "1") {
            data.Pf_Applicable = parseInt(pfApplicable);
            data.Pf_Share_Mode_Employer = parseInt(pfShareMode);
            data.Epf_Employer_Share_Percentage = parseFloat(epfShare);
            data.Pf_Based_on = parseInt(pfBasedOn || 0);
            data.Pf_Applicable_Percentage = parseFloat(pfApplicablePercentage || 0);
            data.Eps_Employer_Share_Percentage = parseFloat(epsShare || 0);
            if (vpfApplicable === "1") {
                data.VPF_Applicable = true;
                data.VPF_Mode = vpfMode ? parseInt(vpfMode) : null;               
            }
            else {              
                data.VPF_Applicable = false;
                data.VPF_Mode = null;               
            }
        }
        else {
            // ✅ When PF is NOT applicable (pfApplicable === "0"), all PF & VPF fields remain null
            data.VPF_Applicable = false;
            data.Pf_Applicable_Percentage = null;
            data.Epf_Employer_Share_Percentage = null;
        }

        // Apply ESIC-specific conditions :- START
        if (esicApplicable === "1") {
            // When ESIC is applicable
            data.Esic_Applicable = true;
            data.Esi_Based_on = parseInt(esiBasedOn || 0);
            data.Esic_Salary_Limit = parseFloat(esicSalaryLimit || 0);
            data.Esi_Employer_Percentage = parseFloat(esiEmployerPercentage || 0);
            data.Esi_Applicable_Percentage = parseFloat(esiApplicablePercentage || 0);
        } else {
            // When ESIC is NOT applicable (esicApplicable === "0")
            data.Esic_Applicable = false;
            data.Esi_Based_on = 0;                // Default value instead of null
            data.Esic_Salary_Limit = 0;           // Default value instead of null
            data.Esi_Employer_Percentage = 0;     // Default value instead of null
            data.Esi_Applicable_Percentage = 0;   // Default value instead of null
        }
        // Apply ESIC-specific conditions :- END


        data.TDsDeducted_On_Actual_Date = tdsOnActualDate === "" ? null : (tdsOnActualDate === "true");
        console.log(data);

        //// 4. AJAX call to controller
        $.ajax({
            url: '/PayrollGlobalParameters/InsertComplianceSettings',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.success) {
                    showAlert("success", response.message);
                    setTimeout(function () {
                        window.location.href = '/PayrollGlobalParameters/Index';
                    }, 5500);
                } else {
                    showAlert("danger", response.message);
                }
            },
            error: function (xhr, status, error) {
                showAlert("danger", "An unexpected error occurred.");
            }
        });
    });
    ////////////////////////////////////////////Second Tab Insert Data :- End ///////////////////////////////////////////

    ////////////////////////////////////////////Third Tab Insert Data :- Start ///////////////////////////////////////////
    $('#Payslip_Generation, #Payslip_Format, #PayslipNumber_Format, #PaySlip_Number_Scope, #Auto_Numbering, #IsPayslipNo_Reset, #DigitalSignatur_Requirede, #PaySlipAutoEmail')
        .on('change', function () {
            const id = $(this).attr('id');
            $(`#${id}-error`).text('').hide();
        });

    $('#btnthirdTab').click(function (e) {
        e.preventDefault();
       
        var isValidThirdTab = true;

        //isValidThirdTab &= validateDropdownRequired('#Initial_char', '#Initial_char-error', 'Initial character is required.');
        isValidThirdTab &= validateDropdownRequired('#Payslip_Generation', '#Payslip_Generation-error', 'Please select Payslip Generation.');
        isValidThirdTab &= validateDropdownRequired('#Payslip_Format', '#Payslip_Format-error', 'Please select Payslip Format.');
        isValidThirdTab &= validateDropdownRequired('#PayslipNumber_Format', '#PayslipNumber_Format-error', 'Please select Payslip ID Format.');
        isValidThirdTab &= validateDropdownRequired('#PaySlip_Number_Scope', '#PaySlip_Number_Scope-error', 'Please select Payslip Scope.');
        isValidThirdTab &= validateDropdownRequired('#Auto_Numbering', '#Auto_Numbering-error', 'Please select Auto Numbering.');
        isValidThirdTab &= validateDropdownRequired('#IsPayslipNo_Reset', '#IsPayslipNo_Reset-error', 'Please select Reset Numbering.');
        isValidThirdTab &= validateDropdownRequired('#DigitalSignatur_Requirede', '#DigitalSignatur_Requirede-error', 'Please select Digital Signature option.');
        isValidThirdTab &= validateDropdownRequired('#PaySlipAutoEmail', '#PaySlipAutoEmail-error', 'Please select Auto Email option.');

        if (!isValidThirdTab) return;
        var data = {
            Payroll_Setin_ID: parseInt($('#Payroll_Setin_ID').val() || 0),
            Company_ID: parseInt($('#SelectedCompanyIdOnPageLoad').val() || 0),
            Initial_char: $('#Initial_char').val().trim() || null,
            Payslip_Generation: $('#Payslip_Generation').val() === "1",
            Payslip_Format: parseInt($('#Payslip_Format').val() || 0),
            PayslipNumber_Format: Array.isArray($('#PayslipNumber_Format').val())
                ? $('#PayslipNumber_Format').val().join(",")
                : "",

            PaySlip_Number_Scope: parseInt($('#PaySlip_Number_Scope').val() || 0),
            Auto_Numbering: $('#Auto_Numbering').val() === "1",
            IsPayslipNo_Reset: $('#IsPayslipNo_Reset').val() === "1",
            DigitalSignatur_Requirede: $('#DigitalSignatur_Requirede').val() === "1",
            PaySlipAutoEmail: $('#PaySlipAutoEmail').val() === "1"
        };


        console.log(data);
            $.ajax({
                url: '/PayrollGlobalParameters/InsertPaySlipSetting',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (response) {
                    if (response.success) {
                        showAlert("success", response.message);
                        setTimeout(function () {
                            window.location.href = '/PayrollGlobalParameters/Index';
                        }, 5500);
                    } else {
                        showAlert("danger", response.message);
                    }
                },
                error: function (xhr, status, error) {
                    showAlert("danger", "An unexpected error occurred.");
                }
            });
    });


    ////////////////////////////////////////////Third Tab Insert Data :- End ///////////////////////////////////////////

    ////////////////////////////////////////////Fourth Tab Insert Data :- Start ///////////////////////////////////////////
    $('#btnfourthTab').click(function (e) {
        e.preventDefault();

        // Gather dropdown values
        //var dataSyncType = parseInt($('#DataSyncType').val() || 0);
        //var contractorMaster = parseInt($('#ContractorMaster').val() || 0);
        //var labourMaster = parseInt($('#LabourMaster').val() || 0);
        //var workOrder = parseInt($('#WorkOrder').val() || 0);
        //var attendance = parseInt($('#Attendance').val() || 0);
        var selectedEntityTypes = $('#EntityTypeMigration').val() || [];
        var companyIdForTabFour = $('#SelectedCompanyIdOnPageLoad').val();
        companyIdForTabFour = companyIdForTabFour && !isNaN(companyIdForTabFour) ? parseInt(companyIdForTabFour) : 0;

        var data = {
            Clms_Param_ID: parseInt($('#Clms_Param_ID').val() || 0), 
            /*Company_Id: parseInt($('#CompanyId').val() || 0),*/
            DataSync: $('#DataSyncType').val() === "1",
            Entityparam: "", 
            Contractlabour_payment: $('#IsContractLabourPayment').val() === "1",
            IsAttendanceProcessed: $('#IsAttendanceProcessed').val() === "1",
            AttendanceProxcessType: parseInt($('#AttendanceProxcessType').val() || 0),
            Wo_Sync_Frequency: parseInt($('#ContractorMaster').val() || 0),
            Entity_Sync_Frequency: parseInt($('#LabourMaster').val() || 0),
            IntegratedLog_in: $('#IntegratedLogin').val() === "1",
            PayregisterFormat_ID: parseInt($('#PayregisterFormatId').val() || 0),
            WorkOrder_Sync_Frequency: parseInt($('#WorkOrder').val() || 0),
            Cl_Sync_Frequency: parseInt($('#LabourMaster').val() || 0)
        };
        data.Entityparam = selectedEntityTypes.join(',');
        data.Company_ID = companyIdForTabFour;
        //console.log(data); // Debug if needed

        // Make AJAX POST request
        $.ajax({
            url: '/PayrollGlobalParameters/InsertThirdPartyData',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.success) {
                    showAlert("success", response.message);
                    setTimeout(function () {
                        window.location.href = '/PayrollGlobalParameters/Index';
                    }, 5500);
                } else {
                    showAlert("danger", response.message);
                }
            },
            error: function (xhr, status, error) {
                showAlert("danger", "An unexpected error occurred.");
            }
        });
    });
    ////////////////////////////////////////////Fourth Tab Insert Data :- End ///////////////////////////////////////////
});
function fetchAndBindDropdownForGlobal(url, dropdownSelector, placeholder, data = null) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            data: data ?? {},
            success: function (response) {
                const $dropdown = $(dropdownSelector);

                if ($.fn.select2 && $dropdown.hasClass("select2-hidden-accessible")) {
                    $dropdown.select2('destroy');
                }

                $dropdown.empty().append(`<option value="">${placeholder}</option>`);

                response.forEach(item => {
                    $dropdown.append(new Option(item.text, item.value));
                });

                if ($.fn.select2) {
                    $dropdown.select2({
                        width: '100%',
                        dropdownAutoWidth: true
                    });
                }

                resolve(); // ✅ done
            },
            error: function (error) {
                // Optional: log or show toast
                reject(error); // ❌ signal failure
            }
        });
    });
}
function fetchAndBindMultiSelectDropdownForGlobal(url, dropdownSelector, placeholder, data = null, selectedValues = []) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            data: data ?? {},
            success: function (response) {
                const $dropdown = $(dropdownSelector);

                if ($.fn.select2 && $dropdown.hasClass("select2-hidden-accessible")) {
                    $dropdown.select2('destroy');
                }

                $dropdown.empty();

                if (Array.isArray(response)) {
                    response.forEach(item => {
                        const option = new Option(item.text, item.value.trim(), false, false);
                        $dropdown.append(option);
                    });
                }

                $dropdown.attr("multiple", "multiple");

                if ($.fn.select2) {
                    $dropdown.select2({
                        width: '100%',
                        dropdownAutoWidth: true,
                        placeholder: placeholder
                    });
                }

                if (selectedValues.length > 0) {
                    $dropdown.val(selectedValues).trigger('change');
                }

                resolve(); // ✅ done
            },
            error: function (error) {
                reject(error); // ❌
            }
        });
    });
}
function fetchAndBindMultiSelectDropdownForPaySlipIDFormat(url, dropdownSelector, placeholder, data = null, selectedValues = []) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            data: data ?? {},
            success: function (response) {
                const $dropdown = $(dropdownSelector);

                // Destroy previous Select2 instance if exists
                if ($.fn.select2 && $dropdown.hasClass("select2-hidden-accessible")) {
                    $dropdown.select2('destroy');
                }

                $dropdown.empty(); // Clear all options

                $dropdown.attr("multiple", "multiple"); // Force multi-select

                // Bind new options
                if (Array.isArray(response)) {
                    response.forEach(item => {
                        const value = (item.value ?? "").toString().trim();
                        const text = item.text ?? value;
                        const option = new Option(text, value, false, false); // false = not selected
                        $dropdown.append(option);
                    });
                }

                // Initialize Select2
                if ($.fn.select2) {
                    $dropdown.select2({
                        width: '100%',
                        dropdownAutoWidth: true,
                        placeholder: placeholder,
                        allowClear: true // Optional: allow clearing selection
                    });
                }

                // Apply pre-selected values only if provided
                if (Array.isArray(selectedValues) && selectedValues.length > 0) {
                    $dropdown.val(selectedValues).trigger('change');
                }

                resolve(); // Success
            },
            error: function (error) {
                reject(error); // Failure
            }
        });
    });
}


//function fetchAndBindDropdownForGlobal(url, dropdownSelector, placeholder, data = null) {
//    $.ajax({
//        url: url,
//        type: 'GET',
//        data: data ?? {},
//        success: function (response) {
//            const $dropdown = $(dropdownSelector);

//            // Destroy select2 if already initialized
//            if ($.fn.select2 && $dropdown.hasClass("select2-hidden-accessible")) {
//                $dropdown.select2('destroy');
//            }

//            // Clear and append placeholder
//            $dropdown.empty().append(`<option value="">${placeholder}</option>`);

//            // Append items
//            response.forEach(function (item) {
//                $dropdown.append(new Option(item.text, item.value));
//            });

//            // Reapply custom select2 style
//            if ($.fn.select2) {
//                $dropdown.select2({
//                    width: '100%', // Ensure it spans correctly
//                    dropdownAutoWidth: true
//                });

//                // Optional: trigger change if needed
//                //$dropdown.trigger('change');
//            }
//        },
//        error: function (error) {
//            //console.error('Dropdown load failed:', error);
//        }
//    });
//}

//function fetchAndBindMultiSelectDropdownForGlobal(url, dropdownSelector, placeholder, data = null, selectedValues = []) {
//    $.ajax({
//        url: url,
//        type: 'GET',
//        data: data ?? {},
//        success: function (response) {
//            //console.log('Dropdown data:', response);

//            const $dropdown = $(dropdownSelector);

//            if ($.fn.select2 && $dropdown.hasClass("select2-hidden-accessible")) {
//                $dropdown.select2('destroy');
//            }

//            $dropdown.empty();

//            if (response && Array.isArray(response)) {
//                response.forEach(function (item) {
//                    const option = new Option(item.text, item.value.trim(), false, false);
//                    $dropdown.append(option);
//                });
//            }

//            $dropdown.attr("multiple", "multiple");

//            if ($.fn.select2) {
//                $dropdown.select2({
//                    width: '100%',
//                    dropdownAutoWidth: true,
//                    placeholder: placeholder
//                });
//            }

//            // ✅ Set selected values if available
//            if (selectedValues.length > 0) {
//                $dropdown.val(selectedValues).trigger('change');
//            }
//        },
//        error: function (error) {
//            //console.error('Multi-select dropdown load failed:', error);
//        }
//    });
//}
//function bindCompanyDropdown(dropdownMenuSelector, excludeSessionCompany = false) {
//    $.ajax({
//        url: '/PayrollMonth/GetCompanyProfilesListJson',
//        type: 'GET',
//        success: function (data) {
//            if (data) {
//                var dropdownMenu = $(dropdownMenuSelector);
//                dropdownMenu.empty();

//                // Add default item
//                dropdownMenu.append(
//                    $('<li>').append(
//                        $('<a>')
//                            .addClass('dropdown-item')
//                            .attr('href', '#')
//                            .attr('data-id', '')
//                            .text('Please Select Value')
//                    )
//                );

//                //var sessionCompanyId = $('#SessionCompanyId').val();
//                var sessionCompanyId = $('#SessionCompanyId').val();
//                var matchedCompanyName = '';
//                console.log(sessionCompanyId);
//                //$.each(data, function (index, company) {
//                //    if (!excludeSessionCompany || company.company_Id != sessionCompanyId) {
//                //        dropdownMenu.append(
//                //            $('<li>').append(
//                //                $('<a>')
//                //                    .addClass('dropdown-item')
//                //                    .attr('href', '#')
//                //                    .attr('data-id', company.company_Id)
//                //                    .text(company.companyName)
//                //            )
//                //        );
//                //    }
//                //});
//                $.each(data, function (index, company) {
//                    if (!excludeSessionCompany || company.company_Id != sessionCompanyId) {
//                        var listItem = $('<a>')
//                            .addClass('dropdown-item')
//                            .attr('href', '#')
//                            .attr('data-id', company.company_Id)
//                            .text(company.companyName);

//                        dropdownMenu.append($('<li>').append(listItem));

//                        if (company.company_Id == sessionCompanyId) {
//                            matchedCompanyName = company.companyName;
//                        }
//                    }
//                });
//                if (!excludeSessionCompany && sessionCompanyId && matchedCompanyName) {
//                    $('#SelectedCompanyIdOnPageLoad').val(sessionCompanyId);
//                    $('#dropdownTextboxOnPageLoad').text(matchedCompanyName);
//                }
//            }
//        },
//        error: function () {
//            //console.error('Failed to load company list.');
//        }
//    });
//}
function togglePfFields() {
    var pfApplicable = $('#Pf_Applicable').val();

    if (!pfApplicable || pfApplicable === "0") {
        // Hide all PF related fields
        $('#Pf_Based_on').closest('.form-group').hide();
        $('#Pf_Applicable_Percentage').closest('.form-group').hide();
        $('#Pf_Share_Mode_Employer').closest('.form-group').hide();
        $('#Epf_Employer_Share_Percentage').closest('.form-group').hide();
        $('#VPF_Applicable').closest('.form-group').hide();
        $('#VPF_Mode').closest('.form-group').hide();
        $('#Eps_Employer_Share_Percentage').closest('.form-group').hide();

        // Reset values
        $('#Pf_Based_on').val('').trigger('change');
        $('#Pf_Applicable_Percentage').val('');
        $('#Pf_Share_Mode_Employer').val('').trigger('change');
        $('#Epf_Employer_Share_Percentage').val('');
        $('#VPF_Applicable').val('').trigger('change');
        $('#VPF_Mode').val('').trigger('change');
    } else {
        // Show PF related fields
        $('#Pf_Based_on').closest('.form-group').show();
        $('#Eps_Employer_Share_Percentage').closest('.form-group').show();
        $('#Pf_Applicable_Percentage').closest('.form-group').show();
        $('#Pf_Share_Mode_Employer').closest('.form-group').show();
        $('#Epf_Employer_Share_Percentage').closest('.form-group').show();
        $('#VPF_Applicable').closest('.form-group').show();

        // VPF_Mode will be toggled separately based on VPF_Applicable value
        toggleVPFMode();
    }
}
function toggleVPFMode() {
    var vpfApplicable = $('#VPF_Applicable').val();
    if (vpfApplicable === "1") {
        $('#VPF_Mode').closest('.form-group').show();
    } else {
        $('#VPF_Mode').closest('.form-group').hide();
        $('#VPF_Mode').val('').trigger('change');
    }
}
function toggleEsicFields() {
    var esicApplicable = $('#Esic_Applicable').val();

    if (!esicApplicable || esicApplicable === "0") {
        // Hide ESIC related fields
        $('#Esic_Based_on').closest('.form-group').hide();
        $('#Esic_Salary_Limit').closest('.form-group').hide();
        $('#Esi_Applicable_Percentage').closest('.form-group').hide();
        $('#Esi_Employer_Percentage').closest('.form-group').hide();
      

        // Reset values
        $('#Esic_Based_on').val('').trigger('change');
        $('#Esic_Salary_Limit').val('');
        $('#Esi_Applicable_Percentage').val('');
    } else {
        // Show ESIC related fields
        $('#Esic_Based_on').closest('.form-group').show();
        $('#Esic_Salary_Limit').closest('.form-group').show();
        $('#Esi_Applicable_Percentage').closest('.form-group').show();
        $('#Esi_Employer_Percentage').closest('.form-group').show();
    }
}
function bindCompanyDropdownOnPageLoad() {
    var sessionCompanyId = parseInt($('#SessionCompanyId').val());
    console.log("sessionCompanyId", sessionCompanyId);
    $.ajax({
        //url: '/PayrollMonth/GetCompanyProfilesListJson',
        url: '/PayrollPeriod/GetCompanyProfilesListJson',
        type: 'GET',
        success: function (data) {
            if (data) {
                var dropdownMenu = $('#dropdownMenuOnPageLoad');
                dropdownMenu.empty();

                dropdownMenu.append(
                    $('<li>').append(
                        $('<a>')
                            .addClass('dropdown-item')
                            .attr('href', '#')
                            .attr('data-id', '')
                            .text('Select Company')
                    )
                );

                var matchedCompanyName = '';

                $.each(data, function (index, company) {
                    var listItem = $('<a>')
                        .addClass('dropdown-item')
                        .attr('href', '#')
                        .attr('data-id', company.company_Id)
                        .text(company.companyName);

                    dropdownMenu.append($('<li>').append(listItem));

                    if (company.company_Id === sessionCompanyId) {
                        matchedCompanyName = company.companyName;
                    }
                });

                if (matchedCompanyName) {
                    $('#dropdownTextboxOnPageLoad').text(matchedCompanyName);
                    $('#SelectedCompanyIdOnPageLoad').val(sessionCompanyId);
                }
            }
        },
        error: function () {
            console.error('Failed to load company list.');
        }
    });
}
function bindCompanyDropdownInModalPopup() {
    var selectedCompanyId = $('#SelectedCompanyIdOnPageLoad').val();
    console.log("MY NEW COMPANY SELECTED",selectedCompanyId);
    $.ajax({
       // url: '/PayrollMonth/GetCompanyProfilesListJson',
        url: '/PayrollPeriod/GetCompanyProfilesListJson',
        type: 'GET',
        success: function (data) {
            if (data) {
                var dropdownMenu = $('#dropdownMenuCompanyOnModelPopUp');
                dropdownMenu.empty();

                dropdownMenu.append(
                    $('<li>').append(
                        $('<a>')
                            .addClass('dropdown-item')
                            .attr('href', '#')
                            .attr('data-id', '')
                            .text('Select Company')
                    )
                );

                $.each(data, function (index, company) {
                  
                        var listItem = $('<a>')
                            .addClass('dropdown-item')
                            .attr('href', '#')
                            .attr('data-id', company.company_Id)
                            .text(company.companyName);

                        dropdownMenu.append($('<li>').append(listItem));
                   
                    //if (company.company_Id != selectedCompanyId) {
                    //    var listItem = $('<a>')
                    //        .addClass('dropdown-item')
                    //        .attr('href', '#')
                    //        .attr('data-id', company.company_Id)
                    //        .text(company.companyName);

                    //    dropdownMenu.append($('<li>').append(listItem));
                    //}
                });
            }
        },
        error: function () {
            console.error('Failed to load company list.');
        }
    });
}
function resetToCompanyDropdownInModalPopup() {
    $('#SelectedToCompanyIdOnModelPopUp').val('');
    $('#dropdownToCompanyOnModelPopUp').addClass('disabled').text('Select To Company');

    var toMenu = $('#dropdownMenuToCompanyOnModelPopUp');
    toMenu.empty().append(
        $('<li>').append(
            $('<a>')
                .addClass('dropdown-item')
                .attr('href', '#')
                .attr('data-id', '')
                .text('Select Company')
        )
    );
}
function refreshFromCompanyDropdown(selectedFromId, excludeToId) {
    $.ajax({
        url: '/PayrollPeriod/GetCompanyProfilesListJson',
        type: 'GET',
        success: function (data) {
            if (data) {
                var dropdownMenu = $('#dropdownMenuCompanyOnModelPopUp');
                dropdownMenu.empty();

                dropdownMenu.append(
                    $('<li>').append(
                        $('<a>')
                            .addClass('dropdown-item')
                            .attr('href', '#')
                            .attr('data-id', '')
                            .text('Select Company')
                    )
                );

                $.each(data, function (index, company) {
                    if (company.company_Id != excludeToId) {
                        var listItem = $('<a>')
                            .addClass('dropdown-item')
                            .attr('href', '#')
                            .attr('data-id', company.company_Id)
                            .text(company.companyName);

                        dropdownMenu.append($('<li>').append(listItem));
                    }
                });

                // If previously selected From Company is still valid, keep it highlighted
                if (selectedFromId && selectedFromId != excludeToId) {
                    var selectedName = $('#dropdownCompanyOnModelPopUp').text();
                    $('#dropdownCompanyOnModelPopUp').text(selectedName);
                } else {
                    // Reset if the previous selection was excluded
                    $('#SelectedCompanyIdOnModelPopUp').val('');
                    $('#dropdownCompanyOnModelPopUp').text('Select Company');
                }
            }
        },
        error: function () {
            console.error('Failed to refresh From Company list.');
        }
    });
}


///////////////////////////////////////////////////////////Copy From Company :- Start////////////////////////////////////////////////////////
$(document).ready(function () {
    // On "Yes" click, hide first modal and show second modal
    $('#yesSettingPermission').on('click', function () {
        $(this).blur(); // Remove focus from the button

        $('#copySettingsModal').modal('hide');
        setTimeout(function () {        
            $('#FromCompany-error').text('');
            $('#ToCompany-error').text('');
            $('#SettingsType-error').text('');
            $('#selectCompanySettingModal').modal('show');

            bindCompanyDropdownInModalPopup();
            resetToCompanyDropdownInModalPopup();  
        }, 500);
    });
    $(document).on('click', '#dropdownMenuCompanyOnModelPopUp .dropdown-item', function (e) {
        e.preventDefault();
        var companyId = $(this).data('id');
        var companyName = $(this).text();

        if (companyId) {
            // Set hidden field and button text
            $('#SelectedCompanyIdOnModelPopUp').val(companyId);
            $('#dropdownCompanyOnModelPopUp').text(companyName);

            // Enable To Company dropdown
            $('#dropdownToCompanyOnModelPopUp').removeClass('disabled').text('Select Company');

            // Bind To Company dropdown excluding selected company
            bindToCompanyDropdown(companyId);
        }
    });
    function bindToCompanyDropdown(excludeCompanyId) {
        $.ajax({
            url: '/PayrollPeriod/GetCompanyProfilesListJson',
            type: 'GET',
            success: function (data) {
                if (data) {
                    var dropdownMenu = $('#dropdownMenuToCompanyOnModelPopUp');
                    dropdownMenu.empty();

                    dropdownMenu.append(
                        $('<li>').append(
                            $('<a>')
                                .addClass('dropdown-item')
                                .attr('href', '#')
                                .attr('data-id', '')
                                .text('Select Company')
                        )
                    );

                    $.each(data, function (index, company) {
                        if (company.company_Id != excludeCompanyId) {
                            var listItem = $('<a>')
                                .addClass('dropdown-item')
                                .attr('href', '#')
                                .attr('data-id', company.company_Id)
                                .text(company.companyName);

                            dropdownMenu.append($('<li>').append(listItem));
                        }
                    });
                }
            },
            error: function () {
                console.error('Failed to load company list.');
            }
        });
    }

    $(document).on('click', '#dropdownMenuToCompanyOnModelPopUp .dropdown-item', function (e) {
        e.preventDefault();
        var companyId = $(this).data('id');
        var companyName = $(this).text();

        if (companyId) {
            // Set hidden field and button text
            $('#SelectedToCompanyIdOnModelPopUp').val(companyId);
            $('#dropdownToCompanyOnModelPopUp').text(companyName);

            // Refresh From Company dropdown excluding the selected To Company
            refreshFromCompanyDropdown($('#SelectedCompanyIdOnModelPopUp').val(), companyId);
        }
    });

    $('#noSettingPermission').on('click', function () {
        $(this).blur(); // Optional: remove focus
        $('#copySettingsModal').modal('hide'); // Hide the modal
    });

    // Handle click on dropdown items to update button text and hidden input

    //$(document).on('click', '#dropdownMenuOnPageLoad a.dropdown-item', function (e) {
    //    e.preventDefault();
    //    var selectedText = $(this).text();
    //    var selectedId = $(this).data('id');
    //    $('#dropdownTextboxOnPageLoad').text(selectedText);
    //    $('#SelectedCompanyIdOnPageLoad').val(selectedId || '');
    //});

    function resetAllPayrollForms() {
        // Reset each form by ID
        $('#firstTab')[0].reset();
        $('#secondTab')[0].reset();
        $('#thirdTab')[0].reset();
        $('#fourthTab')[0].reset();

        // Also reset any select2 dropdowns
        $('.select2_search_ctm').val(null).trigger('change');

        // Reset toggle switches and labels if needed
        $('#formulaActiveToggle').prop('checked', false);
        $('#formulaStatusLabel').text('Inactive');

        $('#formulaActiveToggleTabSecond').prop('checked', false);
        $('#formulaStatusLabelTabSecond').text('Inactive');

        $('#formulaActiveToggleTabThird').prop('checked', false);
        $('#formulaStatusLabelTabThird').text('Inactive');

        $('#formulaActiveToggleTabFourth').prop('checked', false);
        $('#formulaStatusLabelTabFourth').text('Inactive');
        $("#toggleContainer, #toggleContainerTabSecond, #toggleContainerTabThird, #toggleContainerTabFourth").hide();
    }
    function fetchPayrollSettings(companyId) {
        $.ajax({
            url: '/PayrollGlobalParameters/FetchPayrollSettings?companyId=' + companyId,
            type: 'GET',
            success: function (response) {
                if (response.success) {
                    // Bind data as you already do
                    bindPayrollSettings(response); 
                    //console.log('Payroll settings:', response.data);
                } else {
                    //alert('No data found');
                    showCustomAlert('No data found');
                   
                    // Reset all form tabs
                    resetAllPayrollForms();
                }
            },
            error: function () {
                alert('Error fetching payroll settings.');
            }
        });
    }
    function bindPayrollSettings(response) {
        console.log("response.data.settings:", response.data?.settings);
        var hasValidData = false;

        //////////////////////////// Bind 1st Tab:- Start/////////////////////////////
        if (response.success && response.data && response.data.globalParams) {
            hasValidData = true;
            var payrollParam = response.data.globalParams;
            if (payrollParam) {
                console.log(response.data.globalParams);
                $('#GlobalParamId').val(payrollParam.global_Param_ID);
                $('#SalaryFrequency').val(payrollParam.salary_Frequency ?? '').trigger('change');
                $('#RoundSalary').val(payrollParam.round_Off_Components ? 1 : 0).trigger('change');
                $('#MonthlySalaryBasedOn').val(payrollParam.monthlySalary_Based_On ?? '').trigger('change');
                $('#EffectivePayrollStartMonth').val(payrollParam.effectivePayroll_start_Mnth ?? '').trigger('change');
                $('#AllowAdHocComponents').val(payrollParam.allow_Adhoc_Components ? 1 : 0).trigger('change');
                $('#LockSalary').val(payrollParam.lOckSalary_Post_Payroll ? 1 : 0).trigger('change');

                if (payrollParam.global_Param_ID) {
                    $('#toggleContainer').show();
                    $('#formulaActiveToggle').prop('checked', payrollParam.isActive);
                    $('#formulaStatusLabel').text(payrollParam.isActive ? 'Active' : 'Inactive');
                }
               // console.log(response.data.globalParams);
               // $('#GlobalParamId').val(payrollParam.global_Param_ID);
               // $('#SalaryFrequency').val(payrollParam.salary_Frequency ?? '').trigger('change');
               //// $('#RoundSalary').val(payrollParam.round_Off_Components ?? '').trigger('change');
               // $('#RoundSalary').val(payrollParam.round_Off_Components ? 1 : 0).trigger('change');
               // $('#MonthlySalaryBasedOn').val(payrollParam.monthlySalary_Based_On ?? '').trigger('change');
               // $('#EffectivePayrollStartMonth').val(payrollParam.effectivePayroll_start_Mnth ?? '').trigger('change');
               // $('#AllowAdHocComponents').val(payrollParam.allow_Adhoc_Components ? 1 : 0).trigger('change');
               // $('#LockSalary').val(payrollParam.lOckSalary_Post_Payroll ? 1 : 0).trigger('change');
               // if (payrollParam.global_Param_ID) {
               //     $('#toggleContainer').show();
               //     $('#formulaActiveToggle').prop('checked', payrollParam.isActive);
               //     $('#formulaStatusLabel').text(payrollParam.isActive ? 'Active' : 'Inactive');
               // }
            }

        }
        else {
            resetTab1Fields();
        }
        //////////////////////////// Bind 2nd Tab:- Start/////////////////////////////
        if (response.success && response.data && response.data.compliances) {
            hasValidData = true;
            const comp = response.data.compliances;
            $('#Prm_Comlliance_ID').val(comp.prm_Comlliance_ID ?? "");

            if (comp.pf_Applicable != null) {
                $('#Pf_Applicable').val(comp.pf_Applicable).trigger('change');
            }
            if (comp.pf_Based_on != null) {
                $('#Pf_Based_on').val(comp.pf_Based_on).trigger('change');
            }

            if (comp.pf_Applicable_Percentage != null) {
                $('#Pf_Applicable_Percentage').val(comp.pf_Applicable_Percentage);
            }
            if (comp.esi_Based_on != null) {
                $('#Esic_Based_on').val(comp.esi_Based_on).trigger('change');
            }
            if (comp.esi_Employer_Percentage != null) {
                $('#Esi_Employer_Percentage').val(comp.esi_Employer_Percentage);
            }

            if (comp.pf_Share_Mode_Employer != null) {
                $('#Pf_Share_Mode_Employer').val(comp.pf_Share_Mode_Employer).trigger('change');
            }

            if (comp.epf_Employer_Share_Percentage != null) {
                $('#Epf_Employer_Share_Percentage').val(comp.epf_Employer_Share_Percentage);
            }

            if (comp.eps_Employer_Share_Percentage != null) {
                $('#Eps_Employer_Share_Percentage').val(comp.eps_Employer_Share_Percentage);
            }

            if (comp.vpF_Applicable != null) {
                $('#VPF_Applicable').val(comp.vpF_Applicable ? 1 : 0).trigger('change');
            }

            if (comp.vpF_Mode != null) {
                $('#VPF_Mode').val(comp.vpF_Mode).trigger('change');
            }

            if (comp.esic_Applicable != null) {
                $('#Esic_Applicable').val(comp.esic_Applicable ? 1 : 0).trigger('change');
            }

            if (comp.esic_Salary_Limit != null) {
                $('#Esic_Salary_Limit').val(comp.esic_Salary_Limit);
            }

            if (comp.pT_Applicable != null) {
                $('#PT_Applicable').val(comp.pT_Applicable ? 1 : 0).trigger('change');
            }

            if (comp.pt_Registration_Mode != null) {
                $('#Pt_Regisdtration_Mode').val(comp.pt_Registration_Mode).trigger('change');
            }

            if (comp.lwf_Mode != null) {
                $('#Lwf_Mode').val(comp.lwf_Mode).trigger('change');
            }

            if (comp.lwf_Cycle != null) {
                $('#Lwf_Cycle').val(comp.lwf_Cycle).trigger('change');
            }

            if (comp.lwf_Contribution != null) {
                $('#Lwf_Contribution').val(comp.lwf_Contribution);
            }
            if (comp.tDsDeducted_On_Actual_Date != null) {
                $('#TDsDeducted_On_Actual_Date').val(comp.tDsDeducted_On_Actual_Date ? 1 : 0).trigger('change');
            }
            if (comp.esi_Applicable_Percentage != null) {
                $('#Esi_Applicable_Percentage').val(comp.esi_Applicable_Percentage);
            }
            // Show toggle only if Prm_Comlliance_ID is present and > 0
            if (comp.prm_Comlliance_ID && comp.prm_Comlliance_ID > 0) {
                $('#toggleContainerTabSecond').show();

                // Set checkbox based on isActive value
                if (comp.isActive === true) {
                    $('#formulaActiveToggleTabSecond').prop('checked', true);
                    $('#formulaStatusLabelTabSecond').text('Active');
                } else {
                    $('#formulaActiveToggleTabSecond').prop('checked', false);
                    $('#formulaStatusLabelTabSecond').text('Inactive');
                }
            } else {
                $('#toggleContainerTabSecond').hide();
            }

            ///OLD CODE
            //hasValidData = true;
            //const comp = response.data.compliances;
            //$('#Prm_Comlliance_ID').val(comp.prm_Comlliance_ID ?? '');

            //$('#Pf_Applicable').val(comp.pf_Applicable ?? '').trigger('change');
            //$('#Pf_Share_Mode_Employer').val(comp.pf_Share_Mode_Employer ?? '').trigger('change');
            //$('#Epf_Employer_Share_Percentage').val(comp.epf_Employer_Share_Percentage ?? '');
            //$('#Eps_Employer_Share_Percentage').val(comp.eps_Employer_Share_Percentage ?? '');
            //$('#VPF_Applicable').val(comp.vpF_Applicable ? 1 : 0).trigger('change');
            //$('#VPF_Mode').val(comp.vpF_Mode ?? '').trigger('change');
            //$('#Esic_Applicable').val(comp.esic_Applicable ? 1 : 0).trigger('change');
            //$('#Esic_Salary_Limit').val(comp.esic_Salary_Limit ?? '');
            //$('#PT_Applicable').val(comp.pT_Applicable ? 1 : 0).trigger('change');
            //$('#Pt_Regisdtration_Mode').val(comp.pt_Registration_Mode ?? '').trigger('change');
            //$('#Lwf_Mode').val(comp.lwf_Mode ?? '').trigger('change');
            //$('#Lwf_Cycle').val(comp.lwf_Cycle ?? '').trigger('change');
            //$('#Lwf_Contribution').val(comp.lwf_Contribution ?? '');
            //$('#TDsDeducted_On_Actual_Date').val(comp.tDsDeducted_On_Actual_Date ? 1 : 0).trigger('change');
            //$('#Esi_Applicable_Percentage').val(comp.esi_Applicable_Percentage ?? '');

            //// ✅ Added Bindings
            //$('#Pf_Based_on').val(comp.pf_Based_on ?? '').trigger('change');
            //$('#Pf_Applicable_Percentage').val(comp.pf_Applicable_Percentage ?? '');
            //$('#Esic_Based_on').val(comp.esi_Based_on ?? '').trigger('change');
            //$('#Esi_Employer_Percentage').val(comp.esi_Employer_Percentage ?? '');

            //if (comp.prm_Comlliance_ID && comp.prm_Comlliance_ID > 0) {
            //    $('#toggleContainerTabSecond').show();
            //    $('#formulaActiveToggleTabSecond').prop('checked', comp.isActive === true);
            //    $('#formulaStatusLabelTabSecond').text(comp.isActive ? 'Active' : 'Inactive');
            //} else {
            //    $('#toggleContainerTabSecond').hide();
            //}
        }
        else {
            resetTab2Fields();
        }

        //////////////////////////// Bind 3rd Tab:- Start/////////////////////////////
        console.log('Settings:', response.data.settings); // Confirm it's really null

        if (response.success && response.data && response.data.settings) {
            hasValidData = true;
            var settings = response.data.settings;

            $('#Payroll_Setin_ID').val(settings.payroll_Setin_ID);
            $('#Initial_char').val(settings.initial_char || '');

            // Bind selects with boolean properties as 0/1 and others directly
            $('#Enable_Pay').val(settings.payslip_Generation ? 1 : 0).trigger('change');  // If Enable_Pay is supposed to be Payslip_Generation? Confirm mapping.

            $('#Payslip_Generation').val(settings.payslip_Generation ? 1 : 0).trigger('change');

            $('#Payslip_Format').val(settings.payslip_Format).trigger('change');

            var payslipFormatArr = (settings.payslipNumber_Format || '')
                .split(',')
                .map(s => s.trim()) // Remove any extra spaces
                .filter(s => s);     // Remove empty values if any
            $('#PayslipNumber_Format').val(payslipFormatArr).trigger('change');

            $('#PaySlip_Number_Scope').val(settings.paySlip_Number_Scope).trigger('change');

            //$('#PaySlip_Number_Scope').val(settings.paySlip_Number_Scope);

            $('#Auto_Numbering').val(settings.auto_Numbering ? 1 : 0).trigger('change');

            $('#IsPayslipNo_Reset').val(settings.isPayslipNo_Reset ? 1 : 0).trigger('change');

            $('#DigitalSignatur_Requirede').val(settings.digitalSignatur_Requirede ? 1 : 0).trigger('change');

            $('#PaySlipAutoEmail').val(settings.paySlipAutoEmail ? 1 : 0).trigger('change');
            if (settings.payroll_Setin_ID && settings.payroll_Setin_ID > 0) {
                $('#toggleContainerTabThird').show();

                if (settings.isActive === true) {
                    $('#formulaActiveToggleTabThird').prop('checked', true);
                    $('#formulaStatusLabelTabThird').text('Active');
                } else {
                    $('#formulaActiveToggleTabThird').prop('checked', false);
                    $('#formulaStatusLabelTabThird').text('Inactive');
                }
            } else {
                $('#toggleContainerTabThird').hide();
            }
           
        }
        else {
            resetTab3Fields();
        }
        //////////////////////////// Bind 4th Tab:- Start /////////////////////////////
        if (response.success && response.data && response.data.thirdPartyParams) {
            hasValidData = true;
            var thirdParty = response.data.thirdPartyParams;
            $('#Clms_Param_ID').val(thirdParty.clms_Param_ID);
            $('#DataSyncType').val(thirdParty.dataSync ? 1 : 0).trigger('change');
            $('#WorkOrder').val(thirdParty.wo_Sync_Frequency).trigger('change');
            $('#ContractorMaster').val(thirdParty.cl_Sync_Frequency).trigger('change');
            //$('#LabourMaster').val(thirdParty.cl_Sync_Frequency).trigger('change');
            $('#LabourMaster').val(thirdParty.entity_Sync_Frequency).trigger('change');
            $('#IsContractLabourPayment').val(thirdParty.contractlabour_payment ? 1 : 0).trigger('change');
            $('#IsAttendanceProcessed').val(thirdParty.isAttendanceProcessed ? 1 : 0).trigger('change');
            $('#Attendance').val(thirdParty.entity_Sync_Frequency).trigger('change');
            $('#IntegratedLogin').val(thirdParty.integratedLog_in ? 1 : 0).trigger('change');
            $('#PayregisterFormatId').val(thirdParty.payregisterFormat_ID).trigger('change');
            $('#AttendanceProxcessType').val(thirdParty.attendanceProxcessType).trigger('change');
            if (thirdParty.clms_Param_ID && thirdParty.clms_Param_ID > 0) {
                $('#toggleContainerTabFourth').show();
                if (thirdParty.isActive === true) {
                    $('#formulaActiveToggleTabFourth').prop('checked', true);
                    $('#formulaStatusLabelTabFourth').text('Active');
                } else {
                    $('#formulaActiveToggleTabFourth').prop('checked', false);
                    $('#formulaStatusLabelTabFourth').text('Inactive');
                }
            } else {
                $('#toggleContainerTabFourth').hide();
            }
            var selectedEntities = (thirdParty.entityparam || "").split(',').map(s => s.trim());
            // Call dropdown binding with selected values
            fetchAndBindMultiSelectDropdownForGlobal(
                '/DropDown/FetchEntityTypeDropdown',
                '#EntityTypeMigration',
                'Select Entity Type(s)',
                null,
                selectedEntities
            );
            //hasValidData = true;
            //var thirdParty = response.data.thirdPartyParams;

            //$('#Clms_Param_ID').val(thirdParty.clms_Param_ID ?? '');
            //$('#DataSyncType').val(thirdParty.dataSync ? 1 : 0).trigger('change');
            //$('#WorkOrder').val(thirdParty.wo_Sync_Frequency ?? '').trigger('change');
            //$('#ContractorMaster').val(thirdParty.workOrder_Sync_Frequency ?? '').trigger('change');
            //$('#LabourMaster').val(thirdParty.entity_Sync_Frequency ?? '').trigger('change');
            //$('#IsContractLabourPayment').val(thirdParty.contractlabour_payment ? 1 : 0).trigger('change');
            //$('#IsAttendanceProcessed').val(thirdParty.isAttendanceProcessed ? 1 : 0).trigger('change');
            //$('#Attendance').val(thirdParty.entity_Sync_Frequency ?? '').trigger('change');
            //$('#IntegratedLogin').val(thirdParty.integratedLog_in ? 1 : 0).trigger('change');
            //$('#PayregisterFormatId').val(thirdParty.payregisterFormat_ID ?? '').trigger('change');
            //$('#AttendanceProxcessType').val(thirdParty.attendanceProxcessType ?? '').trigger('change');

            //if (thirdParty.clms_Param_ID && thirdParty.clms_Param_ID > 0) {
            //    $('#toggleContainerTabFourth').show();
            //    $('#formulaActiveToggleTabFourth').prop('checked', thirdParty.isActive === true);
            //    $('#formulaStatusLabelTabFourth').text(thirdParty.isActive ? 'Active' : 'Inactive');
            //} else {
            //    $('#toggleContainerTabFourth').hide();
            //}

            //var selectedEntities = (thirdParty.entityparam || "").split(',').map(s => s.trim());
            //fetchAndBindMultiSelectDropdownForGlobal(
            //    '/DropDown/FetchEntityTypeDropdown',
            //    '#EntityTypeMigration',
            //    'Select Entity Type(s)',
            //    null,
            //    selectedEntities
            //);
        }
        else {
            resetTab4Fields();
        }
        /////////////////////////// Hide/Show Button Based on Data Availability ///////////////////////////
        if (hasValidData) {
            $('#btnCopySettings').show();
        } else {
            $('#btnCopySettings').hide();
        }
    }

    $('#dropdownMenuOnPageLoad').on('click', '.dropdown-item', function (e) {
        e.preventDefault();

        var selectedId = $(this).data('id');
        var selectedText = $(this).text();

        $('#SelectedCompanyIdOnPageLoad').val(selectedId);
        $('#dropdownTextboxOnPageLoad').text(selectedText);

        if (!selectedId) {
            showCustomAlert('Please select a valid company');
            return;
        }

        fetchPayrollSettings(selectedId); // Your existing logic
    });

    $(document).on('click', '#dropdownMenuCompanyOnModelPopUp a.dropdown-item', function (e) {
        e.preventDefault();
        var selectedText = $(this).text();
        var selectedId = $(this).data('id');
        $('#dropdownCompanyOnModelPopUp').text(selectedText);
        $('#SelectedCompanyIdOnModelPopUp').val(selectedId || '');
    });
    $('.modal .btn[data-bs-dismiss="modal"]').on('click', function () {
        $(this).blur();
    });
    $('#btnCopySettings').click(function (e) {
        e.preventDefault(); // prevent default button behavior if any
        $('#FromCompany-error').text('');
        $('#ToCompany-error').text('');
        $('#SettingsType-error').text('');
        $('#selectCompanySettingModal').modal('show');
        // Bind the dropdown inside modal, excluding the selected company
        bindCompanyDropdownInModalPopup();
    });

});
function resetTab1Fields() {
    $('#GlobalParamId').val('');
    $('#SalaryFrequency, #RoundSalary, #MonthlySalaryBasedOn, #EffectivePayrollStartMonth').val('').trigger('change');
    $('#AllowAdHocComponents, #LockSalary').val(0).trigger('change');
    $('#toggleContainer').hide();
    $('#formulaActiveToggle').prop('checked', false);
    $('#formulaStatusLabel').text('Inactive');
}

function resetTab2Fields() {
    $('#Prm_Comlliance_ID, #Epf_Employer_Share_Percentage, #Eps_Employer_Share_Percentage, #Esic_Salary_Limit, #Lwf_Contribution, #Esi_Applicable_Percentage, #Pf_Applicable_Percentage, #Esi_Employer_Percentage').val('');
    $('#Pf_Applicable, #Pf_Share_Mode_Employer, #VPF_Mode, #Esic_Applicable, #PT_Applicable, #Pt_Regisdtration_Mode, #Lwf_Mode, #Lwf_Cycle, #TDsDeducted_On_Actual_Date, #Pf_Based_on, #Esic_Based_on').val('').trigger('change');
    $('#VPF_Applicable').val(0).trigger('change');
    $('#toggleContainerTabSecond').hide();
    $('#formulaActiveToggleTabSecond').prop('checked', false);
    $('#formulaStatusLabelTabSecond').text('Inactive');
}

function resetTab3Fields() {
    console.log('resetTab3Fields() invoked');

    // Clear text/hidden fields
    $('#Payroll_Setin_ID, #Initial_char, #Epf_Employer_Share_Percentage').val('');

    // Reset single-select dropdowns to placeholder (empty string)
    const singleSelects = [
        '#Enable_Pay',
        '#Payslip_Generation',
        '#Payslip_Format',
        '#PaySlip_Number_Scope',
        '#Auto_Numbering',
        '#IsPayslipNo_Reset',
        '#DigitalSignatur_Requirede',
        '#PaySlipAutoEmail'
    ];

    singleSelects.forEach(selector => {
        $(selector).val('').trigger('change');
    });

    // Reset multi-select dropdown
    $('#PayslipNumber_Format').val(null).trigger('change');

    // Hide toggle section
    $('#toggleContainerTabThird').hide();

    // Reset toggle button and label
    $('#formulaActiveToggleTabThird').prop('checked', false);
    $('#formulaStatusLabelTabThird').text('Inactive');

    // Hide validation errors
    $('.input_error_msg').hide();
}

function resetTab4Fields() {
    console.log('resetTab4Fields() invoked');

    // Clear hidden field
    $('#Clms_Param_ID').val('');

    // Reset all single-select dropdowns to placeholder
    const singleSelects = [
        '#DataSyncType',
        '#WorkOrder',
        '#ContractorMaster',
        '#LabourMaster',
        '#AttendanceProxcessType',
        '#PayregisterFormatId',
        '#IsContractLabourPayment',
        '#IsAttendanceProcessed',
        '#IntegratedLogin'
    ];
    singleSelects.forEach(selector => {
        $(selector).val('').trigger('change');
    });

    // Reset multi-select dropdowns
    $('#EntityTypeMigration').val(null).trigger('change');

    // Hide toggle container
    $('#toggleContainerTabFourth').hide();

    // Reset toggle and label
    $('#formulaActiveToggleTabFourth').prop('checked', false);
    $('#formulaStatusLabelTabFourth').text('Inactive');

    // Optionally hide validation errors
    $('.input_error_msg').hide();
}

//////////////////////////////////////////////////////////Copy From Company:- End///////////////////////////////////////////////////////////

////////////////////////////////////////////////////RESET THE DROPDOWN :- Start
function resetCompanySettingsModal() {
  
    $('#dropdownCompanyOnModelPopUp').text('Select Company');

    // Reset To Company dropdown button text
    $('#dropdownToCompanyOnModelPopUp').text('Select Company').addClass('disabled');

    $('#dropdownSettingsType').text('Select Settings Type');

    $('#SelectedCompanyIdOnModelPopUp').val('');
    $('#SelectedToCompanyIdOnModelPopUp').val('');
    $('#SelectedSettingsTypeId').val('');

    $('#dropdownMenuSettingsType input[type="checkbox"]').prop('checked', false);

    $('#dropdownMenuToCompanyOnModelPopUp').empty();
}

$('#btlModelPopupCancle').on('click', function () {
    resetCompanySettingsModal();
});


////////////////////////////////////////////////////RESET THE DROPDOWN :- End

////////////////////////////////////////////////////////// Bind STATIC Setting Type (Multi-Select):- Start ////////////////////////////////////////////////
$(document).ready(function () {
    var items = [
        { id: 1, text: "Global Settings" },
        { id: 2, text: "Compliance Settings" },
        { id: 3, text: "Payroll Settings" },
        { id: 4, text: "Integration & Mapping Settings" }
    ];

    var dropdown = $('#dropdownMenuSettingsType');
    dropdown.empty();

    // Create list items with checkboxes
    items.forEach(function (item) {
        var li = $('<li/>').append(
            $('<div class="form-check dropdown-item"/>').append(
                $('<input type="checkbox" class="form-check-input settings-type-checkbox"/>')
                    .attr('id', 'settingType_' + item.id)
                    .val(item.id),
                $('<label class="form-check-label"/>')
                    .attr('for', 'settingType_' + item.id)
                    .text(item.text)
            )
        );
        dropdown.append(li);
    });

    // Handle checkbox change
    $(document).on('change', '.settings-type-checkbox', function () {
        var selected = [];
        $('.settings-type-checkbox:checked').each(function () {
            selected.push($(this).val());
        });

        $('#SelectedSettingsTypeId').val(selected.join(','));

        if (selected.length === 0) {
            $('#dropdownSettingsType').text('Select Settings Type');
        } else if (selected.length === 1) {
            $('#dropdownSettingsType').text('Selected: ' + selected[0]);
        } else {
            $('#dropdownSettingsType').text(selected.length + ' Selected');
        }
    });

    $('#btnCopyFromCompany').click(function () {
        var fromCompanyId = $('#SelectedCompanyIdOnModelPopUp').val();      // From Company
        var toCompanyId = $('#SelectedToCompanyIdOnModelPopUp').val();      // To Company
        var settingsType = $('#SelectedSettingsTypeId').val();              // comma separated string "1,2,3"

        var isValid = true;

        // Clear previous errors
        $('#FromCompany-error').text('');
        $('#ToCompany-error').text('');
        $('#SettingsType-error').text('');

        if (!fromCompanyId) {
            $('#FromCompany-error').text('Please select From Company.');
            isValid = false;
        }
        if (!toCompanyId) {
            $('#ToCompany-error').text('Please select To Company.');
            isValid = false;
        }
        if (!settingsType) {
            $('#SettingsType-error').text('Please select Settings Type.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        $.ajax({
            url: '/PayrollGlobalParameters/CopySettingsFromCompany',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                CopyFromCompanyID: parseInt(fromCompanyId),
                CopyToCompanyID: parseInt(toCompanyId),
                SelectParam: settingsType
            }),
            success: function (response) {
                if (response.success) {
                    $(this).blur();
                    $('#selectCompanySettingModal').modal('hide');
                    showAlert("success", response.message);
                    setTimeout(function () {
                        window.location.href = '/PayrollGlobalParameters/Index';
                    }, 5500);
                } else {
                    alert('Failed: ' + response.message);
                }
            },
            error: function (xhr) {
                alert('Something went wrong.');
                console.error(xhr.responseText);
            }
        });
    });
    // From Company selection
    $('#dropdownMenuCompanyOnModelPopUp').on('click', 'a.dropdown-item', function () {
        $('#FromCompany-error').text('');
    });

    // To Company selection
    $('#dropdownMenuToCompanyOnModelPopUp').on('click', 'a.dropdown-item', function () {
        $('#ToCompany-error').text('');
    });

    // Settings Type change
    $('#SelectedSettingsTypeId').change(function () {
        $('#SettingsType-error').text('');
    });    
    $('#selectCompanySettingModal').on('hidden.bs.modal', function () {
        resetCompanySettingsModal();
    });

});
function showCustomAlert(message) {
    $('#customAlertMessage').text(message);
    $('#customAlertNo').addClass('d-none'); // Hide cancel button
    var modal = new bootstrap.Modal(document.getElementById('customAlertModal'));
    modal.show();
}

////////////////////////////////////////////////////////// Bind STATIC Setting Type (Multi-Select):- End ////////////////////////////////////////////////
