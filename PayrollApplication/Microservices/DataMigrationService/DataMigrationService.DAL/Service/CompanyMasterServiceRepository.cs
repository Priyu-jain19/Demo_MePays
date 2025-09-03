/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-257,258                                                                      *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the CompanyMaster.                  *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific CompanyMaster record by ID using a stored procedure.            *
 *  - AddAsync       : Bulk Insert a new CompanyMaster record into the database using a sp.                 *
 *  - UpdateAsync    : Move staging data to Actual table.                                                   *               
 *                                                                                                          *
 *  Key Features:                                                                                           *
 *  - Implements the ICompanyMasterRepository interface.                                                    *
 *  - Handles input/output parameters for stored procedures using Dapper's DynamicParameters.               *
 *  - Includes application-level enums for message type, mode, and module ID.                               *
 *  - Ensures validation of returned messages and status from stored procedure execution.                   *
 *                                                                                                          *
 *  Author: Priyanshi Jain                                                                                  *
 *  Date  : 11-Dec-2024                                                                                     *
 *                                                                                                          *
 ************************************************************************************************************/
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
    public class CompanyMasterServiceRepository : ICompanyMasterRepository
    {
        private readonly IDbConnection _dbConnection;
        public CompanyMasterServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        #region Company Master Staging CRUD Method
        public async Task<string> AddAsync(string procedureName, CompanyMasterDataMigration model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @ContractData UDT
            var companyDataTable = new DataTable();
            companyDataTable.Columns.Add("Company_Type_Id", typeof(int));
            companyDataTable.Columns.Add("Company_Code", typeof(string));
            companyDataTable.Columns.Add("CompanyName", typeof(string));
            companyDataTable.Columns.Add("CompanyShortName", typeof(string));
            companyDataTable.Columns.Add("CompanyPrintName", typeof(string));
            companyDataTable.Columns.Add("ParentCompany_Id", typeof(int));
            companyDataTable.Columns.Add("Has_Subsidary", typeof(bool));
            companyDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            //companyDataTable.Columns.Add("ErrorMessage", typeof(string));
            // Populate DataTable
            foreach (var company in model.CompanyList)
            {
                companyDataTable.Rows.Add(
                company.CompanyType_ID,
                company.Company_Code,
                company.CompanyName,
                company.CompanyShortName,
                company.CompanyPrintName,
                company.ParentCompany_Id,
                company.Has_Subsidary,
                company.ExternalUnique_Id
                //company.ErrorMessage
                );
            }
            // Add parameters
            parameters.Add("@Company", companyDataTable.AsTableValuedParameter(DbConstants.UDTCompanyMaster));
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
        public async Task<string> UpdateAsync(string procedureName, CompanyMasterDataMigration model)
        {
            var parameters = new DynamicParameters();
            var companyDataTable = new DataTable();
            companyDataTable.Columns.Add("Company_Type_Id", typeof(int));
            companyDataTable.Columns.Add("Company_Code", typeof(string));
            companyDataTable.Columns.Add("CompanyName", typeof(string));
            companyDataTable.Columns.Add("CompanyShortName", typeof(string));
            companyDataTable.Columns.Add("CompanyPrintName", typeof(string));
            companyDataTable.Columns.Add("ParentCompany_Id", typeof(int));
            companyDataTable.Columns.Add("Has_Subsidary", typeof(bool));
            companyDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            // Populate DataTable
            foreach (var company in model.CompanyList)
            {
                companyDataTable.Rows.Add(
                company.CompanyType_ID,
                company.Company_Code,
                company.CompanyName,
                company.CompanyShortName,
                company.CompanyPrintName,
                company.ParentCompany_Id,
                company.Has_Subsidary,
                company.ExternalUnique_Id
                );
            }
            // Add parameters
            parameters.Add("@Company", companyDataTable.AsTableValuedParameter(DbConstants.UDTCompanyMaster));
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
