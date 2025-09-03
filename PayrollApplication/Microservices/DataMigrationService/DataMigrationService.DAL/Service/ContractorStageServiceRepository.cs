using Dapper;
using DataMigrationService.BAL.Models;
using DataMigrationService.DAL.Interface;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Payroll.Common.ApplicationConstant;
using Payroll.Common.ApplicationModel;
using Payroll.Common.EnumUtility;
using Payroll.Common.Helpers;
using Payroll.Common.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Service
{
    public class ContractorStageServiceRepository : IContractorStageServiceRepository
    {
        private readonly IDbConnection _dbConnection;
        public ContractorStageServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<string> AddJsonAsync(string procedureName, ContractorStage model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @ContractorData UDT
            var udtcontractordataDT = new DataTable();
            udtcontractordataDT.Columns.Add("Contractor_Code", typeof(string));
            udtcontractordataDT.Columns.Add("Company_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Company_Code", typeof(string));
            udtcontractordataDT.Columns.Add("Contract_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Contractor_Name", typeof(string));
            udtcontractordataDT.Columns.Add("Contact_No", typeof(string));
            udtcontractordataDT.Columns.Add("Email_Id", typeof(string));
            udtcontractordataDT.Columns.Add("Address", typeof(string));
            udtcontractordataDT.Columns.Add("License_No", typeof(string));
            udtcontractordataDT.Columns.Add("Max_Labour_Count", typeof(int));
            udtcontractordataDT.Columns.Add("Assigned_Labour_Count", typeof(int));
            udtcontractordataDT.Columns.Add("City_Id", typeof(int));
            udtcontractordataDT.Columns.Add("State_Id", typeof(int));
            udtcontractordataDT.Columns.Add("District_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Country_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Location_Id", typeof(int));
            udtcontractordataDT.Columns.Add("BankBranch_Id", typeof(int));
            udtcontractordataDT.Columns.Add("BankAccountNo", typeof(int));
            udtcontractordataDT.Columns.Add("Bank_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Profile_Photo", typeof(string));
            udtcontractordataDT.Columns.Add("ProfilePhoto_Path", typeof(string));
            udtcontractordataDT.Columns.Add("LIN_No", typeof(string));
            udtcontractordataDT.Columns.Add("PAN_No", typeof(string));
            udtcontractordataDT.Columns.Add("TAN_No", typeof(string));
            udtcontractordataDT.Columns.Add("EPF_No", typeof(string));
            udtcontractordataDT.Columns.Add("ESIC_No", typeof(string));
            udtcontractordataDT.Columns.Add("Bank", typeof(string));
            udtcontractordataDT.Columns.Add("Is_SubContractor", typeof(bool));
            udtcontractordataDT.Columns.Add("Parent_Contractor_Id", typeof(int));
            udtcontractordataDT.Columns.Add("ExportLogId", typeof(int));
            udtcontractordataDT.Columns.Add("IsError", typeof(bool));


            // Populate DataTable
            foreach (var udtcontractordata in model.ContractorUDTList)
            {
                udtcontractordataDT.Rows.Add(
                udtcontractordata.Contractor_Code,
                udtcontractordata.Company_Id,
                udtcontractordata.Company_Code,
                udtcontractordata.Contract_Id,
                udtcontractordata.Contractor_Name,
                udtcontractordata.Contact_No,
                udtcontractordata.Email_Id,
                udtcontractordata.Address,
                udtcontractordata.License_No,
                udtcontractordata.Max_Labour_Count,
                udtcontractordata.Assigned_Labour_Count,
                udtcontractordata.City_Id,
                udtcontractordata.State_Id,
                udtcontractordata.District_Id,
                udtcontractordata.Country_Id,
                udtcontractordata.Location_Id,
                udtcontractordata.BankBranch_Id,
                udtcontractordata.BankAccountNo,
                udtcontractordata.Bank_Id,
                udtcontractordata.Profile_Photo,
                udtcontractordata.ProfilePhoto_Path,
                udtcontractordata.LIN_No,
                udtcontractordata.PAN_No,
                udtcontractordata.TAN_No,
                udtcontractordata.EPF_No,
                udtcontractordata.ESIC_No,
                udtcontractordata.Bank,
                udtcontractordata.Is_SubContractor,
                udtcontractordata.Parent_Contractor_Id,
                udtcontractordata.ExportLogId,
                udtcontractordata.IsError

                );
            }
            // Add parameters

            parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
            parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
            parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);

            parameters.Add("@ContractorData", udtcontractordataDT.AsTableValuedParameter("dbo.udt_contractor_data"));

            parameters.Add("@CreatedBy", model.CreatedBy);
            //parameters.Add("@UpdatedBy", model.UpdatedBy);

            //parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            //parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportVerified);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);

            try
            {
                // Execute stored procedure and return JSON result
                var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);

                return result; // Return the JSON string directly
            }
            catch (Exception ex)
            {

                throw;
            }

        }

        public async Task<string> GetByLogIdAsync(string procedureName, object parameters)
        {
            // Directly returns JSON data from the stored procedure
            var dynamicParameters = new DynamicParameters(parameters);
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(
                procedureName,
                dynamicParameters,
                commandType: CommandType.StoredProcedure
            );
            return result;
        }

        public async Task<string> UpdateAsync(string procedureName, ContractorStage model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @ContractorData UDT
            var udtcontractordataDT = new DataTable();
            udtcontractordataDT.Columns.Add("Contractor_Code", typeof(string));           
            udtcontractordataDT.Columns.Add("Company_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Company_Code", typeof(string));
            udtcontractordataDT.Columns.Add("Contract_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Contractor_Name", typeof(string));
            udtcontractordataDT.Columns.Add("Contact_No", typeof(string));
            udtcontractordataDT.Columns.Add("Email_Id", typeof(string));
            udtcontractordataDT.Columns.Add("Address", typeof(string));
            udtcontractordataDT.Columns.Add("License_No", typeof(string));
            udtcontractordataDT.Columns.Add("Max_Labour_Count", typeof(int));
            udtcontractordataDT.Columns.Add("Assigned_Labour_Count", typeof(int));
            udtcontractordataDT.Columns.Add("City_Id", typeof(int));
            udtcontractordataDT.Columns.Add("State_Id", typeof(int));
            udtcontractordataDT.Columns.Add("District_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Country_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Location_Id", typeof(int));
            udtcontractordataDT.Columns.Add("BankBranch_Id", typeof(int));
            udtcontractordataDT.Columns.Add("BankAccountNo", typeof(int));
            udtcontractordataDT.Columns.Add("Bank_Id", typeof(int));
            udtcontractordataDT.Columns.Add("Profile_Photo", typeof(string));
            udtcontractordataDT.Columns.Add("ProfilePhoto_Path", typeof(string));
            udtcontractordataDT.Columns.Add("LIN_No", typeof(string));
            udtcontractordataDT.Columns.Add("PAN_No", typeof(string));
            udtcontractordataDT.Columns.Add("TAN_No", typeof(string));
            udtcontractordataDT.Columns.Add("EPF_No", typeof(string));
            udtcontractordataDT.Columns.Add("ESIC_No", typeof(string));
            udtcontractordataDT.Columns.Add("Bank", typeof(string));
            udtcontractordataDT.Columns.Add("Is_SubContractor", typeof(bool));
            udtcontractordataDT.Columns.Add("Parent_Contractor_Id", typeof(int));
            udtcontractordataDT.Columns.Add("ExportLogId", typeof(int));
            udtcontractordataDT.Columns.Add("IsError", typeof(bool));


            // Populate DataTable
            foreach (var udtcontractordata in model.ContractorUDTList)
            {
                udtcontractordataDT.Rows.Add(
                udtcontractordata.Contractor_Code,
                 udtcontractordata.Company_Id,
                 udtcontractordata.Company_Code,
                udtcontractordata.Contract_Id,
                udtcontractordata.Contractor_Name,
                udtcontractordata.Contact_No,
                udtcontractordata.Email_Id,
                udtcontractordata.Address,
                udtcontractordata.License_No,
                udtcontractordata.Max_Labour_Count,
                udtcontractordata.Assigned_Labour_Count,
                udtcontractordata.City_Id,
                udtcontractordata.State_Id,
                udtcontractordata.District_Id,
                udtcontractordata.Country_Id,
                udtcontractordata.Location_Id,
                udtcontractordata.BankBranch_Id,
                udtcontractordata.BankAccountNo,
                udtcontractordata.Bank_Id,
                udtcontractordata.Profile_Photo,
                udtcontractordata.ProfilePhoto_Path,
                udtcontractordata.LIN_No,
                udtcontractordata.PAN_No,
                udtcontractordata.TAN_No,
                udtcontractordata.EPF_No,
                udtcontractordata.ESIC_No,
                udtcontractordata.Bank,
                udtcontractordata.Is_SubContractor,
                 udtcontractordata.Parent_Contractor_Id,
                udtcontractordata.ExportLogId,
                udtcontractordata.IsError

                );
            }
            // Add parameters
            parameters.Add("@Log_Id", model.Log_Id, DbType.Int64);
            parameters.Add("@ContractorData", udtcontractordataDT.AsTableValuedParameter("dbo.udt_contractor_data"));
            parameters.Add("@UpdatedBy", model.UpdatedBy, DbType.Int64);

            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportVerified);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            // Execute stored procedure and return JSON result

            try
            {
                var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
                return result; // Return the JSON string directly

            }
            catch (Exception ex)
            {

                throw;
            }

        }


    }
}
