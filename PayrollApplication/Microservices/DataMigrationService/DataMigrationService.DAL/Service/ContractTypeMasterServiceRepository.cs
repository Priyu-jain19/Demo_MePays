/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-233                                                                          *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the ContractTypeMaster.             *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific ContractTypeMaster record by ID using a stored procedure.       *
 *  - AddAsync       : Bulk Insert a new ContractTypeMaster record into the database using a sp.            *
 *                                                                                                          *
 *  Key Features:                                                                                           *
 *  - Implements the IContractTypeMasterRepository interface.                                               *
 *  - Handles input/output parameters for stored procedures using Dapper's DynamicParameters.               *
 *  - Includes application-level enums for message type, mode, and module ID.                               *
 *  - Ensures validation of returned messages and status from stored procedure execution.                   *
 *                                                                                                          *
 *  Author: Priyanshi Jain                                                                                  *
 *  Date  : 02-Dec-2024                                                                                     *
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
    public class ContractTypeMasterServiceRepository : IContractTypeMasterRepository
    {
        private readonly IDbConnection _dbConnection;
        public ContractTypeMasterServiceRepository(IDbConnection dbConnection)
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
        public async Task<string> AddAsync(string procedureName, ContractTypeMaster model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @ContractTypeData UDT
            var contractDataTable = new DataTable();
            contractDataTable.Columns.Add("ContractType_Code", typeof(string));
            contractDataTable.Columns.Add("ContractType_Name", typeof(string));
            contractDataTable.Columns.Add("IsError", typeof(bool));
            // Populate DataTable
            foreach (var contract in model.ContractTypes)
            {
                contractDataTable.Rows.Add(
                contract.ContractType_Code,
                contract.ContractType_Name,
                contract.IsError
                );
            }
            // Add parameters
            parameters.Add("@ContractTypeData", contractDataTable.AsTableValuedParameter(DbConstants.UDTContractTypeMaster));
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
        #endregion

    }
}
