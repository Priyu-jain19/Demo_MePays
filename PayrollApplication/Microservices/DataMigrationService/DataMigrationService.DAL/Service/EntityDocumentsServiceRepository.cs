/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-333                                                                         *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the Entity master                   *
 *  Document assignment for contractor labour.                                                            *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific EntityMaster subsidiary record by ID using a stored procedure.  *
 *  - AddJsonAsync   : Mapping multiple rows to EntityMaster subsidiary.                                    *
 *                                                                                                          *
 *  Author           : Chirag Gurjar                                                                        *
 *  Date             : 31-Dec-2024                                                                          *
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
using static Dapper.SqlMapper;

namespace DataMigrationService.DAL.Service
{
    public class EntityDocumentsServiceRepository : IEntityDocumentsRepository
    {
        private readonly IDbConnection _dbConnection;
        public EntityDocumentsServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        #region Entity Master Subsidiary CRUD Method

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
        public async Task<string> AddJsonAsync(string procedureName, EntityDocuments model)
        {
            try
            {
                var parameters = new DynamicParameters();
                #region tbl_mst_Entity_Documents


                var udtEntityDocumentDT = new DataTable();
                udtEntityDocumentDT.Columns.Add("Company_Id", typeof(int));
                udtEntityDocumentDT.Columns.Add("Company_Code", typeof(string));
                udtEntityDocumentDT.Columns.Add("Employee_Id", typeof(int));
                udtEntityDocumentDT.Columns.Add("PayrollNo", typeof(string));
                udtEntityDocumentDT.Columns.Add("DocumentName", typeof(string));
                udtEntityDocumentDT.Columns.Add("Document_Type_Id", typeof(int));
                udtEntityDocumentDT.Columns.Add("DocumentPath", typeof(string));
                udtEntityDocumentDT.Columns.Add("OperationType", typeof(string));
                udtEntityDocumentDT.Columns.Add("Is_Imported", typeof(bool));
                udtEntityDocumentDT.Columns.Add("ExternalUnique_Id", typeof(string));
                udtEntityDocumentDT.Columns.Add("Log_id", typeof(int));

                foreach (var udtEntityDocument in model.EntityDocumentsUDT)
                {
                    udtEntityDocumentDT.Rows.Add(
                    udtEntityDocument.Company_Id,
                    udtEntityDocument.Company_Code,
                    udtEntityDocument.Employee_Id,
                    udtEntityDocument.PayrollNo,
                    udtEntityDocument.DocumentName,
                    udtEntityDocument.Document_Type_Id,
                    udtEntityDocument.DocumentPath,
                    udtEntityDocument.OperationType,
                    udtEntityDocument.Is_Imported,
                    udtEntityDocument.ExternalUnique_Id,
                    udtEntityDocument.Log_id
                    

                    );
                }

                #endregion



                // Add parameters
                parameters.Add("@EntityDocumentData", udtEntityDocumentDT.AsTableValuedParameter("dbo.udt_Entity_Document"));

                parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
                parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
                parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);
                parameters.Add("@CreatedBy", model.CreatedBy);
                //parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
                //parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportData);
                parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
                // Execute stored procedure and return JSON result
                var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
                return result; // Return the JSON string directly
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public async Task<string> UpdateAsync(string procedureName, EntityDocumentsVerified model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @ContractorData UDT
            var udtEntityDataDT = new DataTable();
            udtEntityDataDT.Columns.Add("PayrollNo", typeof(string));
            udtEntityDataDT.Columns.Add("IsVerified", typeof(bool));

            // Populate DataTable
            foreach (var udtEntityData in model.EntityDocumentsValidateUDT)
            {
                udtEntityDataDT.Rows.Add(
                udtEntityData.PayrollNo,
                 udtEntityData.IsVerified

                );
            }
            // Add parameters
            parameters.Add("@Log_Id", model.Log_Id, DbType.Int64);
            parameters.Add("@EntityData", udtEntityDataDT.AsTableValuedParameter("dbo.udt_EntityData_Validate"));
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


        #endregion
    }
}
