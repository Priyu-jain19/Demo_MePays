/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-325                                                                         *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the Entity master                   *
 *  Subsidiary assignment for contractor labour.                                                            *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific EntityMaster subsidiary record by ID using a stored procedure.  *
 *  - AddJsonAsync   : Mapping multiple rows to EntityMaster subsidiary.                                    *
 *                                                                                                          *
 *  Author           : Chirag Gurjar                                                                        *
 *  Date             : 26-Dec-2024                                                                          *
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
    public class EntityMasterMapSubsidiaryServiceRepository : IEntityMasterMapSubsidiaryRepository
    {
        private readonly IDbConnection _dbConnection;
        public EntityMasterMapSubsidiaryServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        #region Entity Master Subsidiary CRUD Method

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
        public async Task<string> AddJsonAsync(string procedureName, EntityMasterMapSubsidiary model)
        {
            try
            {
                var parameters = new DynamicParameters();
                #region tbl_mst_subsidiary
                // Create a DataTable for the @MapEntitySubsidiaryData UDT

                var udtMapEntitySubsidiaryDT = new DataTable();
                udtMapEntitySubsidiaryDT.Columns.Add("Company_Id", typeof(int));
                udtMapEntitySubsidiaryDT.Columns.Add("Subsidiary_Id", typeof(int));
                udtMapEntitySubsidiaryDT.Columns.Add("Employee_Id", typeof(int));
                udtMapEntitySubsidiaryDT.Columns.Add("PayrollNo", typeof(string));
                udtMapEntitySubsidiaryDT.Columns.Add("Log_id", typeof(int));
                udtMapEntitySubsidiaryDT.Columns.Add("Is_Imported", typeof(bool));
                udtMapEntitySubsidiaryDT.Columns.Add("OperationType", typeof(string));

                foreach (var udtMapEntitySubsidiary in model.EntityMasterMapSubsidiaryUDT)
                {
                    udtMapEntitySubsidiaryDT.Rows.Add(
                    udtMapEntitySubsidiary.Company_Id,
                    udtMapEntitySubsidiary.Subsidiary_Id,
                    udtMapEntitySubsidiary.Employee_Id,
                    udtMapEntitySubsidiary.PayrollNo,
                    udtMapEntitySubsidiary.Log_id,
                    udtMapEntitySubsidiary.Is_Imported,
                    udtMapEntitySubsidiary.OperationType                    

                    );
                }

                #endregion



                // Add parameters
                parameters.Add("@MapEntitySubsidiaryData", udtMapEntitySubsidiaryDT.AsTableValuedParameter("dbo.udt_Map_Entity_Subsidiary"));

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

       
        #endregion
    }
}
