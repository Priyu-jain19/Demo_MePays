/****************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-271                                                                              *
 *  Description:                                                                                                *
 *  This repository class handles bulk insert and select operations for the CompanyCorrespondanceMaster.        *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.               *
 *                                                                                                              *
 *  Methods:                                                                                                    *
 *  - GetByIdAsync   : Retrieves a specific CompanyCorrespondanceMaster record by ID using a stored procedure.  *
 *  - AddAsync       : Bulk Insert a new CompanyCorrespondanceMaster record into the database using a sp.                     *
 *  - UpdateAsync    : Move staging data to Actual table.                                                       *               
 *                                                                                                              *
 *  Key Features:                                                                                               *
 *  - Implements the ICompanyCorrespondanceMasterRepository interface.                                                        *
 *  - Handles input/output parameters for stored procedures using Dapper's DynamicParameters.                   *
 *  - Includes application-level enums for message type, mode, and module ID.                                   *
 *  - Ensures validation of returned messages and status from stored procedure execution.                       *
 *                                                                                                              *
 *  Author: Priyanshi Jain                                                                                      *
 *  Date  : 12-Dec-2024                                                                                         *
 *                                                                                                              *
 ****************************************************************************************************************/

using Dapper;
using DataMigrationService.BAL.Models;
using DataMigrationService.DAL.Interface;
using Payroll.Common.ApplicationConstant;
using Payroll.Common.EnumUtility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Service
{
    public class CompanyCorrespondanceMasterServiceRepository : ICompanyCorrespondanceMasterRepository
    {
        private readonly IDbConnection _dbConnection;
        public CompanyCorrespondanceMasterServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        #region Company Correspondance Master Staging CRUD Method
        public async Task<string> GetByIdAsync(string procedureName, object parameters)
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
        public async Task<string> AddAsync(string procedureName, CompanyCorrespondanceMaster model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @companyCorrespondance UDT
            var companyCorrespondanceDataTable = new DataTable();
            companyCorrespondanceDataTable.Columns.Add("Company_Code", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("CompanyAddress", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Building_No", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Building_Name", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Street", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Country_ID", typeof(int));
            companyCorrespondanceDataTable.Columns.Add("State_Id", typeof(int));
            companyCorrespondanceDataTable.Columns.Add("City_ID", typeof(int));
            companyCorrespondanceDataTable.Columns.Add("Location_ID", typeof(int));
            companyCorrespondanceDataTable.Columns.Add("Primary_Phone_no", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Secondary_Phone_No", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Primary_Email_Id", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Secondary_Email_ID", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("WebsiteUrl", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Company_LogoImage_Path", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            // Populate DataTable
            foreach (var companyCorrespondance in model.companycorrespondanceList)
            {
                companyCorrespondanceDataTable.Rows.Add(
                companyCorrespondance.Company_Code,
                companyCorrespondance.CompanyAddress,
                companyCorrespondance.Building_No,
                companyCorrespondance.Building_Name,
                companyCorrespondance.Street,
                companyCorrespondance.Country_ID,
                companyCorrespondance.State_Id,
                companyCorrespondance.City_ID,
                companyCorrespondance.Location_ID,
                companyCorrespondance.Primary_Phone_no,
                companyCorrespondance.Secondary_Phone_No,
                companyCorrespondance.Primary_Email_Id,
                companyCorrespondance.Secondary_Email_ID,
                companyCorrespondance.WebsiteUrl,
                companyCorrespondance.Company_LogoImage_Path,
                companyCorrespondance.ExternalUnique_Id
                );
            }
            // Add parameters
            parameters.Add("@Companycompanycorrespondance", companyCorrespondanceDataTable.AsTableValuedParameter(DbConstants.UDTCompanyCorrespondanceMaster));
            parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
            parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
            parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);
            parameters.Add("@CreatedBy", model.CreatedBy);
            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportData);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(
                procedureName,
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return result; // Return the JSON string directly
        }
        public async Task<string> UpdateAsync(string procedureName, CompanyCorrespondanceMaster model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @companyCorrespondance UDT
            var companyCorrespondanceDataTable = new DataTable();
            companyCorrespondanceDataTable.Columns.Add("Company_Code", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("CompanyAddress", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Building_No", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Building_Name", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Street", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Country_ID", typeof(int));
            companyCorrespondanceDataTable.Columns.Add("State_Id", typeof(int));
            companyCorrespondanceDataTable.Columns.Add("City_ID", typeof(int));
            companyCorrespondanceDataTable.Columns.Add("Location_ID", typeof(int));
            companyCorrespondanceDataTable.Columns.Add("Primary_Phone_no", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Secondary_Phone_No", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Primary_Email_Id", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Secondary_Email_ID", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("WebsiteUrl", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("Company_LogoImage_Path", typeof(string));
            companyCorrespondanceDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            // Populate DataTable
            foreach (var companyCorrespondance in model.companycorrespondanceList)
            {
                companyCorrespondanceDataTable.Rows.Add(
                companyCorrespondance.Company_Code,
                companyCorrespondance.CompanyAddress,
                companyCorrespondance.Building_No,
                companyCorrespondance.Building_Name,
                companyCorrespondance.Street,
                companyCorrespondance.Country_ID,
                companyCorrespondance.State_Id,
                companyCorrespondance.City_ID,
                companyCorrespondance.Location_ID,
                companyCorrespondance.Primary_Phone_no,
                companyCorrespondance.Secondary_Phone_No,
                companyCorrespondance.Primary_Email_Id,
                companyCorrespondance.Secondary_Email_ID,
                companyCorrespondance.WebsiteUrl,
                companyCorrespondance.Company_LogoImage_Path,
                companyCorrespondance.ExternalUnique_Id
                );
            }
            // Add parameters
            parameters.Add("@Companycompanycorrespondance", companyCorrespondanceDataTable.AsTableValuedParameter(DbConstants.UDTCompanyCorrespondanceMaster));
            parameters.Add("@Log_Id", model.Log_Id, DbType.Int64);
            parameters.Add("@UpdatedBy", model.UpdatedBy);
            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportVerified);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(
                procedureName,
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return result; // Return the JSON string directly
        }
        #endregion
    }
}
