/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-241                                                                          *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the ContractMaster.                 *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific ContractMaster record by ID using a stored procedure.           *
 *  - AddAsync       : Bulk Insert a new ContractMaster record into the database using a sp.                *
 *                                                                                                          *
 *  Key Features:                                                                                           *
 *  - Implements the IContractMasterRepository interface.                                                   *
 *  - Handles input/output parameters for stored procedures using Dapper's DynamicParameters.               *
 *  - Includes application-level enums for message type, mode, and module ID.                               *
 *  - Ensures validation of returned messages and status from stored procedure execution.                   *
 *                                                                                                          *
 *  Author: Priyanshi Jain                                                                                  *
 *  Date  : 03-Dec-2024                                                                                     *
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
    public class ContractMasterServiceRepository : IContractMasterRepository
    {
        private readonly IDbConnection _dbConnection;
        public ContractMasterServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        #region Contract Type Master CRUD Method
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
        public async Task<string> AddAsync(string procedureName, ContractMaster model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @ContractData UDT
            var contractDataTable = new DataTable();
            contractDataTable.Columns.Add("Contract_Code", typeof(string));
            contractDataTable.Columns.Add("Contract_Name", typeof(string));
            contractDataTable.Columns.Add("Company_Id", typeof(int));
            contractDataTable.Columns.Add("Company_Code", typeof(string));
            contractDataTable.Columns.Add("Contract_Description", typeof(string));
            contractDataTable.Columns.Add("Start_Date", typeof(DateTime));
            contractDataTable.Columns.Add("End_Date", typeof(DateTime));
            contractDataTable.Columns.Add("Contract_Status", typeof(int));
            contractDataTable.Columns.Add("Contract_Type", typeof(int));
            contractDataTable.Columns.Add("Contract_Value", typeof(decimal));
            contractDataTable.Columns.Add("Payment_Terms", typeof(int));
            contractDataTable.Columns.Add("Bank_Guarantee_Amount", typeof(decimal));
            contractDataTable.Columns.Add("Is_Joint_Venture", typeof(bool));
            contractDataTable.Columns.Add("Is_Sublet_Allowed", typeof(bool));
            contractDataTable.Columns.Add("IsError", typeof(bool));
            // Populate DataTable
            foreach (var contract in model.contracts)
            {
                contractDataTable.Rows.Add(
                contract.Contract_Code,
                contract.Contract_Name,
                contract.Company_Id,
                contract.Company_Code,
                contract.Contract_Description,
                contract.Start_Date,
                contract.End_Date,
                contract.Contract_Status,
                contract.Contract_Type,
                contract.Contract_Value,
                contract.Payment_Terms,
                contract.Bank_Guarantee_Amount,
                contract.Is_Joint_Venture,
                contract.Is_Sublet_Allowed,
                contract.IsError
                );
            }
            // Add parameters
            parameters.Add("@ContractData", contractDataTable.AsTableValuedParameter(DbConstants.UDTContractMaster));
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
        #endregion
    }
}
