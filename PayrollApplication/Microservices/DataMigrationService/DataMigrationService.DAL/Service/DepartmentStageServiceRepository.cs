/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-211,223,225                                                                  *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the DepartmentStage.                *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific DepartmentStage record by ID using a stored procedure.          *
 *  - AddAsync       : Bulk Insert a new DepartmentStage record into the database using a sp.               *
 *  - UpdateAsync    : Move staging data to Actual table.                                                   *               
 *                                                                                                          *
 *  Key Features:                                                                                           *
 *  - Implements the IContractTypeMasterRepository interface.                                               *
 *  - Handles input/output parameters for stored procedures using Dapper's DynamicParameters.               *
 *  - Includes application-level enums for message type, mode, and module ID.                               *
 *  - Ensures validation of returned messages and status from stored procedure execution.                   *
 *                                                                                                          *
 *  Author: Priyanshi Jain                                                                                  *
 *  Date  : 26-Nov-2024                                                                                     *
 *                                                                                                          *
 ************************************************************************************************************/
using Dapper;
using DataMigrationService.BAL.Models;
using DataMigrationService.DAL.Interface;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Payroll.Common.ApplicationConstant;
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
    public class DepartmentStageServiceRepository : IDepartmentStageRepository
    {
        private readonly IDbConnection _dbConnection;
        public DepartmentStageServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        #region Department Stage CRUD Method
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
        public async Task<string> AddAsync(string procedureName, DepartmentStage model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var departmentDataTable = new DataTable();
            departmentDataTable.Columns.Add("DepartmentCode", typeof(string));
            departmentDataTable.Columns.Add("DepartmentName", typeof(string));
            departmentDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            departmentDataTable.Columns.Add("IsError", typeof(bool));
            // Populate DataTable
            foreach (var department in model.Departments)
            {
                departmentDataTable.Rows.Add(
                department.DepartmentCode,
                department.DepartmentName,
                department.ExternalUnique_Id,
                department.IsError
                );
            }
            // Add parameters
            parameters.Add("@DepartmentData", departmentDataTable.AsTableValuedParameter(DbConstants.UDTDepartmentStage));
            parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
            parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
            parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);
            parameters.Add("@CompanyId", model.CompanyId, DbType.Int16);
            parameters.Add("@CreatedBy", model.CreatedBy);
            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportData);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
            return result; // Return the JSON string directly
        }
        public async Task<string> UpdateAsync(string procedureName, DepartmentStage model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var departmentDataTable = new DataTable();
            departmentDataTable.Columns.Add("DepartmentCode", typeof(string));
            departmentDataTable.Columns.Add("DepartmentName", typeof(string));
            departmentDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            departmentDataTable.Columns.Add("IsError", typeof(bool));
            // Populate DataTable
            foreach (var department in model.Departments)
            {
                departmentDataTable.Rows.Add(
                department.DepartmentCode,
                department.DepartmentName,
                department.ExternalUnique_Id,
                department.IsError
                );
            }
            // Add parameters
            parameters.Add("@DepartmentData", departmentDataTable.AsTableValuedParameter(DbConstants.UDTDepartmentStage));
            parameters.Add("@UpdatedBy", model.UpdatedBy, DbType.Int64);
            parameters.Add("@Log_Id", model.Log_Id, DbType.Int64);
            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportVerified);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
            return result; // Return the JSON string directly
        }
        #endregion
    }
}
