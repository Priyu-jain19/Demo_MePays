/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-353                                                                         *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the Entity insurance                  *
 *  added bank details for contractor labour.                                                               *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *   GetByIdAsync   : Retrieves a EntityMaster insurance details record by ID using a stored procedure.    *
 *   AddJsonAsync   : Mapping multiple rows to EntityMaster subsidiary.                                    *
 *                                                                                                          *
 *  Author           : Chirag Gurjar                                                                        *
 *  Date             : 1-Jan-2025                                                                          *
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
    public class EntityInsuranceServiceRepository : IEntityInsuranceRepository
    {
        private readonly IDbConnection _dbConnection;
        public EntityInsuranceServiceRepository(IDbConnection dbConnection)
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
        public async Task<string> AddJsonAsync(string procedureName, EntityInsurance model)
        {
            try
            {
                var parameters = new DynamicParameters();
                #region tbl_mst_Entity_BankFinance


                var udtEntityInsuranceDT = new DataTable();
                udtEntityInsuranceDT.Columns.Add("Company_Id", typeof(int));
                udtEntityInsuranceDT.Columns.Add("Company_Code", typeof(string));
                udtEntityInsuranceDT.Columns.Add("Employee_Id", typeof(int));
                udtEntityInsuranceDT.Columns.Add("PayrollNo", typeof(string));
                udtEntityInsuranceDT.Columns.Add("Ins_Company_Name", typeof(string));
                udtEntityInsuranceDT.Columns.Add("PolicyHolder", typeof(int));
                udtEntityInsuranceDT.Columns.Add("Age", typeof(int));
                udtEntityInsuranceDT.Columns.Add("Policy_Paid_By", typeof(int));
                udtEntityInsuranceDT.Columns.Add("Commencement_Date", typeof(DateTime));
                udtEntityInsuranceDT.Columns.Add("Payment_Premium_Day", typeof(int));
                udtEntityInsuranceDT.Columns.Add("PremiumPaidTill_Month", typeof(string));
                udtEntityInsuranceDT.Columns.Add("Purpose_of_Policy_Id", typeof(int));
                udtEntityInsuranceDT.Columns.Add("PolicyFile_No", typeof(string));
                udtEntityInsuranceDT.Columns.Add("Maturity_Date", typeof(DateTime));
                udtEntityInsuranceDT.Columns.Add("MonthlyPremium_Paid", typeof(decimal));
                udtEntityInsuranceDT.Columns.Add("Log_Id", typeof(int));
                udtEntityInsuranceDT.Columns.Add("ExternalUnique_Id", typeof(string));
                udtEntityInsuranceDT.Columns.Add("OperationType", typeof(string));
                udtEntityInsuranceDT.Columns.Add("Is_Imported", typeof(bool));
                udtEntityInsuranceDT.Columns.Add("IsError", typeof(bool));

                foreach (var udtEntityInsurance in model.EntityInsuranceUDT)
                {
                    udtEntityInsuranceDT.Rows.Add(
                    udtEntityInsurance.Company_Id,
                    udtEntityInsurance.Company_Code,
                    udtEntityInsurance.Employee_Id,
                    udtEntityInsurance.PayrollNo,
                    udtEntityInsurance.Ins_Company_Name,
                    udtEntityInsurance.PolicyHolder,
                    udtEntityInsurance.Age,
                    udtEntityInsurance.Policy_Paid_By,
                    udtEntityInsurance.Commencement_Date,
                    udtEntityInsurance.Payment_Premium_Day,
                    udtEntityInsurance.PremiumPaidTill_Month,
                    udtEntityInsurance.Purpose_of_Policy_Id,
                    udtEntityInsurance.PolicyFile_No,
                    udtEntityInsurance.Maturity_Date,
                    udtEntityInsurance.MonthlyPremium_Paid,
                    udtEntityInsurance.Log_Id,
                    udtEntityInsurance.ExternalUnique_Id,
                    udtEntityInsurance.OperationType,
                    udtEntityInsurance.Is_Imported,
                    udtEntityInsurance.IsError
                    

                    );
                }

                #endregion


                // Add parameters
                parameters.Add("@EntitytInsuranceData", udtEntityInsuranceDT.AsTableValuedParameter("dbo.udt_Entity_Insurance"));

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

        public async Task<string> UpdateAsync(string procedureName, EntityInsuranceVerified model)
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
