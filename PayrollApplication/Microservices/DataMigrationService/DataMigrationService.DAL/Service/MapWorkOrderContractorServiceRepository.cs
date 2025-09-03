/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-250,251                                                                      *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the MapWorkOrderContractor.         *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific MapWorkOrderContractor record by ID using a stored procedure.   *
 *  - AddAsync       : Bulk Insert a new MapWorkOrderContractor record into the database using a sp.        *
 *  - UpdateAsync    : Move staging data to Actual table.                                                   *               
 *                                                                                                          *
 *  Key Features:                                                                                           *
 *  - Implements the IMapWorkOrderContractorRepository interface.                                           *
 *  - Handles input/output parameters for stored procedures using Dapper's DynamicParameters.               *
 *  - Includes application-level enums for message type, mode, and module ID.                               *
 *  - Ensures validation of returned messages and status from stored procedure execution.                   *
 *                                                                                                          *
 *  Author: Priyanshi Jain                                                                                  *
 *  Date  : 09-Dec-2024                                                                                     *
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
    public class MapWorkOrderContractorServiceRepository : IMapWorkOrderContractorRepository
    {
        private readonly IDbConnection _dbConnection;
        public MapWorkOrderContractorServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        #region Map Work Order Master Crud Methods
        public async Task<string> AddAsync(string procedureName, MapWorkOrderContractor model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var workOrderDataTable = new DataTable();
            workOrderDataTable.Columns.Add("Contractor_Code", typeof(string));
            workOrderDataTable.Columns.Add("Company_Id", typeof(int));
            workOrderDataTable.Columns.Add("Company_Code", typeof(string));
            workOrderDataTable.Columns.Add("WorkOrder_Id", typeof(int));
            workOrderDataTable.Columns.Add("Contractor_Id", typeof(int));
            workOrderDataTable.Columns.Add("Contractor_Name", typeof(string));
            workOrderDataTable.Columns.Add("Contact_No", typeof(string));
            workOrderDataTable.Columns.Add("Email_Id", typeof(string));
            workOrderDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            workOrderDataTable.Columns.Add("Location_Id", typeof(int));
            workOrderDataTable.Columns.Add("IsError", typeof(bool));
            // Populate DataTable
            foreach (var workorder in model.workOrderContractors)
            {
                workOrderDataTable.Rows.Add(
                workorder.Contractor_Code,
                workorder.Company_Id,
                workorder.Company_Code,
                workorder.WorkOrder_Id,
                workorder.Contractor_Id,
                workorder.Contractor_Name,
                workorder.Contact_No,
                workorder.Email_Id,
                workorder.ExternalUnique_Id,
                workorder.Location_Id,
                workorder.IsError
                );
            }
            // Add parameters
            parameters.Add("@MapwocontractorData", workOrderDataTable.AsTableValuedParameter(DbConstants.UDTMapWorkOrderMaster));
            parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
            parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
            parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);
            parameters.Add("@CreatedBy", model.CreatedBy);
            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportData);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
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
        public async Task<string> UpdateAsync(string procedureName, MapWorkOrderContractor model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var workOrderDataTable = new DataTable();
            workOrderDataTable.Columns.Add("Contractor_Code", typeof(string));
            workOrderDataTable.Columns.Add("Company_Id", typeof(int));
            workOrderDataTable.Columns.Add("Company_Code", typeof(string));
            workOrderDataTable.Columns.Add("WorkOrder_Id", typeof(int));
            workOrderDataTable.Columns.Add("Contractor_Id", typeof(int));
            workOrderDataTable.Columns.Add("Contractor_Name", typeof(string));
            workOrderDataTable.Columns.Add("Contact_No", typeof(string));
            workOrderDataTable.Columns.Add("Email_Id", typeof(string));
            workOrderDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            workOrderDataTable.Columns.Add("Location_Id", typeof(int));
            workOrderDataTable.Columns.Add("IsError", typeof(bool));
            // Populate DataTable
            foreach (var workorder in model.workOrderContractors)
            {
                workOrderDataTable.Rows.Add(
                workorder.Contractor_Code,
                workorder.Company_Id,
                workorder.Company_Code,
                workorder.WorkOrder_Id,
                workorder.Contractor_Id,
                workorder.Contractor_Name,
                workorder.Contact_No,
                workorder.Email_Id,
                workorder.ExternalUnique_Id,
                workorder.Location_Id,
                workorder.IsError
                );
            }
            // Add parameters
            parameters.Add("@MapwocontractorData", workOrderDataTable.AsTableValuedParameter(DbConstants.UDTMapWorkOrderMaster));
            parameters.Add("@Log_Id", model.Log_id, DbType.Int64);
            parameters.Add("@UpdatedBy", model.UpdatedBy);
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
