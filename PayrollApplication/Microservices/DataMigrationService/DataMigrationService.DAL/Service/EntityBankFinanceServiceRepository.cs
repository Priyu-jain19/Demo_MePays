/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-333                                                                         *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the Entity master                   *
 *  added bank details for contractor labour.                                                               *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *   GetByIdAsync   : Retrieves a specific EntityMaster bank details record by ID using a stored procedure. *
 *   AddJsonAsync   : Mapping multiple rows to EntityMaster subsidiary.                                    *
 *                                                                                                          *
 *  Author           : Chirag Gurjar                                                                        *
 *  Date             : 30-Dec-2024                                                                          *
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
    public class EntityBankFinanceServiceRepository : IEntityBankFinanceRepository
    {
        private readonly IDbConnection _dbConnection;
        public EntityBankFinanceServiceRepository(IDbConnection dbConnection)
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
        public async Task<string> AddJsonAsync(string procedureName, EntityBankFinance model)
        {
            try
            {
                var parameters = new DynamicParameters();
                #region tbl_mst_Entity_BankFinance


                var udtEntityBankFinanceDT = new DataTable();
                udtEntityBankFinanceDT.Columns.Add("Company_Id", typeof(int));
                udtEntityBankFinanceDT.Columns.Add("Company_Code", typeof(string));
                udtEntityBankFinanceDT.Columns.Add("Employee_Id", typeof(int));
                udtEntityBankFinanceDT.Columns.Add("PayrollNo", typeof(string));
                udtEntityBankFinanceDT.Columns.Add("BankName", typeof(string));
                udtEntityBankFinanceDT.Columns.Add("Account_Type_Id", typeof(int));
                udtEntityBankFinanceDT.Columns.Add("IFSCCode", typeof(string));
                udtEntityBankFinanceDT.Columns.Add("BankBranch_Id", typeof(int));
                udtEntityBankFinanceDT.Columns.Add("NetPay_Share", typeof(int));
                udtEntityBankFinanceDT.Columns.Add("NetPay_Share_Amount", typeof(decimal));
                udtEntityBankFinanceDT.Columns.Add("BankTransferTemplate_Id", typeof(int));
                udtEntityBankFinanceDT.Columns.Add("PaymentMethod", typeof(int));
                udtEntityBankFinanceDT.Columns.Add("Log_id", typeof(int));
                udtEntityBankFinanceDT.Columns.Add("ExternalUnique_Id", typeof(string));
                udtEntityBankFinanceDT.Columns.Add("OperationType", typeof(string));
                udtEntityBankFinanceDT.Columns.Add("Is_Imported", typeof(bool));
                udtEntityBankFinanceDT.Columns.Add("IsError", typeof(bool));

                foreach (var udtEntityBankFinance in model.EntityBankFinanceUDT)
                {
                    udtEntityBankFinanceDT.Rows.Add(
                    udtEntityBankFinance.Company_Id,
                     udtEntityBankFinance.Company_Code,
                    udtEntityBankFinance.Employee_Id,
                    udtEntityBankFinance.PayrollNo,
                    udtEntityBankFinance.BankName,
                    udtEntityBankFinance.Account_Type_Id,
                    udtEntityBankFinance.IFSCCode,
                    udtEntityBankFinance.BankBranch_Id,
                    udtEntityBankFinance.NetPay_Share,
                     udtEntityBankFinance.NetPay_Share_Amount,
                    udtEntityBankFinance.BankTransferTemplate_Id,
                    udtEntityBankFinance.PaymentMethod,
                   udtEntityBankFinance.Log_id,
                    udtEntityBankFinance.ExternalUnique_Id,
                     udtEntityBankFinance.OperationType,
                    udtEntityBankFinance.Is_Imported,
                    udtEntityBankFinance.IsError

                    );
                }

                #endregion



                // Add parameters
                parameters.Add("@EntityBankFinanceData", udtEntityBankFinanceDT.AsTableValuedParameter("dbo.udt_Entity_BankFinance"));

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

        public async Task<string> UpdateAsync(string procedureName, EntityBankFinanceVerified model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @ContractorData UDT
            var udtEntityDataDT = new DataTable();
            udtEntityDataDT.Columns.Add("PayrollNo", typeof(string));
            udtEntityDataDT.Columns.Add("IsVerified", typeof(bool));

            // Populate DataTable
            foreach (var udtEntityData in model.EntityBankValidateUDT)
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
