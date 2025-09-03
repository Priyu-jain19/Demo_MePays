/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-265                                                                          *
 *  Description:                                                                                            *
 *  This repository class handles CRUD for the SubsidiaryMaster.                                          *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific SubsidiaryMaster record by ID using a stored procedure.       *
 *  - AddAsync       : Bulk Insert a new SubsidiaryMaster record into the database using a SP.            *
 *                                                                                                          *
 *  Key Features:                                                                                           *
 *  - Implements the ISubsidiaryMaster interface.                                          *
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
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Payroll.Common.ApplicationConstant;
using Payroll.Common.EnumUtility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Service
{
    public class SubsidiaryStageServiceRepository : ISubsidiaryStageRepository
    {
        #region CTOR
        private readonly IDbConnection _dbConnection;
        public SubsidiaryStageServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        #endregion
        #region Subsidiary Master CRUD Method
        public async Task<string> AddAsync(string procedureName, SubsidiaryStage model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @SubsidiaryMaster UDT
            var subsidiaryDataTable = new DataTable();
            subsidiaryDataTable.Columns.Add("SubsidiaryType_Id", typeof(int));
            subsidiaryDataTable.Columns.Add("Subsidiary_Code", typeof(string));
            subsidiaryDataTable.Columns.Add("Subsidiary_Name", typeof(string));
            subsidiaryDataTable.Columns.Add("Company_Code", typeof(string));
          
            subsidiaryDataTable.Columns.Add("ExternalUnique_Id", typeof(string));
            subsidiaryDataTable.Columns.Add("IsError", typeof(bool));
            // Populate the DataTable with data from the model
            foreach (var subsidiary in model.SubsidiariesStageUDT)
            {
                subsidiaryDataTable.Rows.Add(
                    subsidiary.SubsidiaryType_Id,
                    subsidiary.Subsidiary_Code,
                    subsidiary.Subsidiary_Name,
                    subsidiary.Company_Code,                 
                    subsidiary.ExternalUnique_Id,
                    subsidiary.IsError
                );
            }
            // Add parameters
            parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
            parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
            parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);
            //parameters.Add("@CompanyId", model.Company_Id, DbType.Int16);

            parameters.Add("@SubsidiaryData", subsidiaryDataTable.AsTableValuedParameter(DbConstants.UDTSubsidiaryStage));

            parameters.Add("@CreatedBy", model.CreatedBy);

            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportData);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);

            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
            return result; // Return the JSON string directly
        }
        public async Task<List<SubsidiaryStageUDT>> GetSubsidiaryStageAsync(string procedureName, int logId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@log_Id", logId, DbType.Int32);

                // Execute the stored procedure and fetch the JSON string
                var jsonResult = await _dbConnection.QueryFirstOrDefaultAsync<string>(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                if (string.IsNullOrWhiteSpace(jsonResult))
                    return new List<SubsidiaryStageUDT>();

                // Deserialize JSON into a list of SubsidiaryStage
                var result = JsonConvert.DeserializeObject<List<SubsidiaryStageUDT>>(
                    JObject.Parse(jsonResult)["SHOWDATA"].ToString()
                );

                return result;
            }
            catch (Exception ex)
            {
                // Log the exception as needed
                throw new Exception("An error occurred while fetching subsidiary stage data.", ex);
            }
        }

        #endregion
        #region Validate Data From Stage To Master 
        public async Task<string> ValidateAndTransferSubsidiaryDataAsync(string procedureName, int logId, SubsidiaryStage model)
        {
            
                // Map the list of SubsidiaryStage to the UDT type
                var table = new DataTable();
                table.Columns.Add("SubsidiaryType_Id", typeof(byte));
                table.Columns.Add("Subsidiary_Code", typeof(string));
                table.Columns.Add("Subsidiary_Name", typeof(string));
                table.Columns.Add("Company_Code", typeof(string));
                table.Columns.Add("ExternalUnique_Id", typeof(string));
                table.Columns.Add("IsError", typeof(bool));

                foreach (var subsidiary in model.SubsidiariesStageUDT)
                {
                    table.Rows.Add(
                        subsidiary.SubsidiaryType_Id,
                        subsidiary.Subsidiary_Code,
                        subsidiary.Subsidiary_Name,
                        subsidiary.Company_Code,
                        subsidiary.ExternalUnique_Id,
                        subsidiary.IsError
                    );
                }               
                // Define parameters
                var parameters = new DynamicParameters();
                parameters.Add("@Log_Id", logId, DbType.Int32);
                //parameters.Add("@SubsidiaryData", table.AsTableValuedParameter("udt_stgsubsidiary_data"));
                parameters.Add("@SubsidiaryData", table.AsTableValuedParameter(DbConstants.UDTSubsidiaryStage));
                parameters.Add("@UpdatedBy", model.UpdatedBy, DbType.Int32);

                parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
                parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportData);
                parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
                // Execute the stored procedure
                var result = await _dbConnection.ExecuteScalarAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
                return result; // Return the JSON string directly

        }
        #endregion
    }
}
