/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-246                                                                          *
 *  Description:                                                                                            *
 *  This repository class handles CRUD for the ContractorDocument.                                          *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific ContractorDocument record by ID using a stored procedure.       *
 *  - AddAsync       : Bulk Insert a new ContractorDocument record into the database using a SP.            *
 *                                                                                                          *
 *  Key Features:                                                                                           *
 *  - Implements the IContractorDocumentMasterInterface interface.                                          *
 *  - Handles input/output parameters for stored procedures using Dapper's DynamicParameters.               *
 *  - Includes application-level enums for message type, mode, and module ID.                               *
 *  - Ensures validation of returned messages and status from stored procedure execution.                   *
 *                                                                                                          *
 *  Author: Harshida Parmar                                                                                 *
 *  Date  : 06-Dec-2024                                                                                     *
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
    public class ContractorDocumentMasterServiceRepository: IContractorDocumentMasterInterface
    {
        #region CTOR
        private readonly IDbConnection _dbConnection;
        public ContractorDocumentMasterServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        #endregion
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
        public async Task<string> AddAsync(string procedureName, ContractorDocumentMaster model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var contractorDocumentDataTable = new DataTable();
            contractorDocumentDataTable.Columns.Add("Contractor_Id", typeof(int));
            contractorDocumentDataTable.Columns.Add("Company_Code", typeof(string));
            contractorDocumentDataTable.Columns.Add("DocumentName", typeof(string));
            contractorDocumentDataTable.Columns.Add("Document_Type_Id", typeof(int));
            contractorDocumentDataTable.Columns.Add("DocumentPath", typeof(string));                 
            contractorDocumentDataTable.Columns.Add("ExternalUnique_Id", typeof(string));           
            contractorDocumentDataTable.Columns.Add("IsError", typeof(bool));

            // Populate the DataTable with data from the model
            foreach (var document in model.ContractDocumentTypes)
            {
                contractorDocumentDataTable.Rows.Add(
                    document.Contractor_Id,
                    document.Company_Code,
                    document.DocumentName,
                    document.Document_Type_Id,
                    document.DocumentPath,                                       
                    document.ExternalUnique_Id,                    
                    document.IsError
                );
            }
            // Add parameters
            parameters.Add("@ContractorDocument", contractorDocumentDataTable.AsTableValuedParameter(DbConstants.UDTContractorDocumentMaster));
            parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
            parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
            parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);
            //parameters.Add("@Company_Id", model.Company_Id, DbType.Int16);
            parameters.Add("@CreatedBy", model.CreatedBy);
            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportData);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
            return result; // Return the JSON string directly
        }
        public async Task<ContractDocumentFTP> UpdateAsync(string procedureName, ContractDocumentFTP contractDocumentFTPPathDetail)
        {
            var parameters = new DynamicParameters();

            // Assuming contractDocumentFTPPathDetail is passed as the object        

            parameters.Add("@Contractor_Doc_Id", contractDocumentFTPPathDetail.Contractor_Doc_Id);
            parameters.Add("@Contractor_Id", contractDocumentFTPPathDetail.Contractor_Id);
            parameters.Add("@DocumentPath", contractDocumentFTPPathDetail.DocumentPath);
            // Additional parameters for messages and status using enum values
            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information); // Cast enum to int
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.Update); // Cast enum to int
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport); // Cast enum to int

            var result = await _dbConnection.QueryFirstOrDefaultAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);

            if (result != null)
            {
                contractDocumentFTPPathDetail.StatusMessage = result.ApplicationMessage;
                contractDocumentFTPPathDetail.MessageType = result.ApplicationMessageType;
            }
            return contractDocumentFTPPathDetail;
        }

        #endregion
    }
}
