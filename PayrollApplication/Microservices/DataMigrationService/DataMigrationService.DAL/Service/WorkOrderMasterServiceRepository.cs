/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-244                                                                          *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the WorkOrderMaster.                *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific WorkOrderMaster record by ID using a stored procedure.          *
 *  - AddAsync       : Bulk Insert a new WorkOrderMaster record into the database using a sp.               *
 *  - UpdateAsync    : Move staging data to Actual table.                                                   *               
 *                                                                                                          *
 *  Key Features:                                                                                           *
 *  - Implements the IWorkOrderMasterRepository interface.                                                  *
 *  - Handles input/output parameters for stored procedures using Dapper's DynamicParameters.               *
 *  - Includes application-level enums for message type, mode, and module ID.                               *
 *  - Ensures validation of returned messages and status from stored procedure execution.                   *
 *                                                                                                          *
 *  Author: Priyanshi Jain                                                                                  *
 *  Date  : 05-Dec-2024                                                                                     *
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
    public class WorkOrderMasterServiceRepository : IWorkOrderMasterRepository
    {
        private readonly IDbConnection _dbConnection;
        public WorkOrderMasterServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        #region Work Order Master Crud Methods
        public async Task<string> AddAsync(string procedureName, WorkOrderMaster model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var workOrderDataTable = new DataTable();
            workOrderDataTable.Columns.Add("Company_Id", typeof(int));
            workOrderDataTable.Columns.Add("Company_Code", typeof(string));
            workOrderDataTable.Columns.Add("Contract_Id", typeof(int));
            workOrderDataTable.Columns.Add("WorkOrder_No", typeof(string));
            workOrderDataTable.Columns.Add("WorkOrder_Code", typeof(int));
            workOrderDataTable.Columns.Add("Work_Description", typeof(string));
            workOrderDataTable.Columns.Add("Wo_Start_Date", typeof(DateTime));
            workOrderDataTable.Columns.Add("Wo_End_Date", typeof(DateTime));
            workOrderDataTable.Columns.Add("Wo_New_Date", typeof(DateTime));
            workOrderDataTable.Columns.Add("Estimated_Cost", typeof(decimal));
            workOrderDataTable.Columns.Add("Actual_Cost", typeof(decimal));
            workOrderDataTable.Columns.Add("Required_Menpower", typeof(int));
            workOrderDataTable.Columns.Add("Total_Menpower", typeof(int));
            workOrderDataTable.Columns.Add("Wo_FileName", typeof(string));
            workOrderDataTable.Columns.Add("Wo_FilePath", typeof(string));
            workOrderDataTable.Columns.Add("Status", typeof(int));
            workOrderDataTable.Columns.Add("Compliance_Status", typeof(int));
            workOrderDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            workOrderDataTable.Columns.Add("IsError", typeof(bool));
            // Populate DataTable
            foreach (var workorder in model.workOrders)
            {
                workOrderDataTable.Rows.Add(
                workorder.Company_Id,
                workorder.Company_Code,
                workorder.Contract_Id,
                workorder.WorkOrder_No,
                workorder.WorkOrder_Code,
                workorder.Work_Description,
                workorder.Wo_Start_Date,
                workorder.Wo_End_Date,
                workorder.Wo_New_Date,
                workorder.Estimated_Cost,
                workorder.Actual_Cost,
                workorder.Required_Menpower,
                workorder.Total_Menpower,
                workorder.Wo_FileName,
                workorder.Wo_FilePath,
                workorder.Status,
                workorder.Compliance_Status,
                workorder.ExternalUnique_Id,
                workorder.IsError
                );
            }
            // Add parameters
            parameters.Add("@WorkOrderData", workOrderDataTable.AsTableValuedParameter(DbConstants.UDTWorkOrderMaster));
            parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
            parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
            parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);
            //parameters.Add("@CompanyId", model.CompanyId, DbType.Int16);
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
        public async Task<string> UpdateAsync(string procedureName, WorkOrderMaster model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var workOrderDataTable = new DataTable();
            workOrderDataTable.Columns.Add("Company_Id", typeof(int));
            workOrderDataTable.Columns.Add("Company_Code", typeof(string));
            workOrderDataTable.Columns.Add("Contract_Id", typeof(int));
            workOrderDataTable.Columns.Add("WorkOrder_No", typeof(string));
            workOrderDataTable.Columns.Add("WorkOrder_Code", typeof(int));
            workOrderDataTable.Columns.Add("Work_Description", typeof(string));
            workOrderDataTable.Columns.Add("Wo_Start_Date", typeof(DateTime));
            workOrderDataTable.Columns.Add("Wo_End_Date", typeof(DateTime));
            workOrderDataTable.Columns.Add("Wo_New_Date", typeof(DateTime));
            workOrderDataTable.Columns.Add("Estimated_Cost", typeof(decimal));
            workOrderDataTable.Columns.Add("Actual_Cost", typeof(decimal));
            workOrderDataTable.Columns.Add("Required_Menpower", typeof(int));
            workOrderDataTable.Columns.Add("Total_Menpower", typeof(int));
            workOrderDataTable.Columns.Add("Wo_FileName", typeof(string));
            workOrderDataTable.Columns.Add("Wo_FilePath", typeof(string));
            workOrderDataTable.Columns.Add("Status", typeof(int));
            workOrderDataTable.Columns.Add("Compliance_Status", typeof(int));
            workOrderDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            workOrderDataTable.Columns.Add("IsError", typeof(bool));
            // Populate DataTable
            foreach (var workorder in model.workOrders)
            {
                workOrderDataTable.Rows.Add(
                workorder.Company_Id,
                workorder.Company_Code,
                workorder.Contract_Id,
                workorder.WorkOrder_No,
                workorder.WorkOrder_Code,
                workorder.Work_Description,
                workorder.Wo_Start_Date,
                workorder.Wo_End_Date,
                workorder.Wo_New_Date,
                workorder.Estimated_Cost,
                workorder.Actual_Cost,
                workorder.Required_Menpower,
                workorder.Total_Menpower,
                workorder.Wo_FileName,
                workorder.Wo_FilePath,
                workorder.Status,
                workorder.Compliance_Status,
                workorder.ExternalUnique_Id,
                workorder.IsError
                );
            }
            // Add parameters
            parameters.Add("@WorkOrderData", workOrderDataTable.AsTableValuedParameter(DbConstants.UDTWorkOrderMaster));
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
