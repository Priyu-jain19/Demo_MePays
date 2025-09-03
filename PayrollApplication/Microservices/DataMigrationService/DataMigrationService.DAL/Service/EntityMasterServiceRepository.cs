/************************************************************************************************************
 *  Jira Task Ticket : PAYROLL-287                                                                          *
 *  Description:                                                                                            *
 *  This repository class handles bulk insert and select operations for the Entity master.                  *
 *  It uses the Dapper library for efficient database interaction and stored procedure execution.           *
 *                                                                                                          *
 *  Methods:                                                                                                *
 *  - GetByIdAsync   : Retrieves a specific EntityMaster record by ID using a stored procedure.             *
 *  - AddAsync       : Bulk Insert a new EntityMaster record into the database using a sp.                  *
 *                                                                                                          *
 *  Author           : Chirag Gurjar                                                                        *
 *  Date             : 18-Dec-2024                                                                          *
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
    public class EntityMasterServiceRepository : IEntityMasterRepository
    {
        private readonly IDbConnection _dbConnection;
        public EntityMasterServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        #region Entity Master CRUD Method

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
        public async Task<string> AddJsonAsync(string procedureName, EntityMaster model)
        {
            try
            {
                var parameters = new DynamicParameters();
                #region tbl_mst_Entity
                // Create a DataTable for the @EntityData UDT

                var udtEntityDataDT = new DataTable();
                udtEntityDataDT.Columns.Add("Company_Id", typeof(int));
                udtEntityDataDT.Columns.Add("Company_Code", typeof(string));

                udtEntityDataDT.Columns.Add("EmploymentType", typeof(int));
                udtEntityDataDT.Columns.Add("Contractor_id", typeof(int));
                udtEntityDataDT.Columns.Add("PayrollNo", typeof(string));
                udtEntityDataDT.Columns.Add("Title", typeof(string));
                udtEntityDataDT.Columns.Add("FirstName", typeof(string));
                udtEntityDataDT.Columns.Add("MiddleName", typeof(string));
                udtEntityDataDT.Columns.Add("LastName", typeof(string));
                udtEntityDataDT.Columns.Add("DateOfJoining", typeof(DateTime));
                udtEntityDataDT.Columns.Add("HOD", typeof(int));
                udtEntityDataDT.Columns.Add("Superior", typeof(int));
                udtEntityDataDT.Columns.Add("EmpCategory", typeof(int));
                udtEntityDataDT.Columns.Add("Religion", typeof(int));
                udtEntityDataDT.Columns.Add("Nationality", typeof(int));
                udtEntityDataDT.Columns.Add("Gender", typeof(int));
                udtEntityDataDT.Columns.Add("BirthDate", typeof(DateTime));
                udtEntityDataDT.Columns.Add("MaritalStatus", typeof(int));
                udtEntityDataDT.Columns.Add("Children", typeof(int));
                udtEntityDataDT.Columns.Add("UserRole", typeof(int));
                udtEntityDataDT.Columns.Add("BloodGroup", typeof(string));
                udtEntityDataDT.Columns.Add("Emergency_Contact_Name", typeof(string));
                udtEntityDataDT.Columns.Add("Police_verification", typeof(bool));

                udtEntityDataDT.Columns.Add("WorkOrder_Id", typeof(int));
                udtEntityDataDT.Columns.Add("WeekOff_Type", typeof(int));
                udtEntityDataDT.Columns.Add("WeekOff_Day", typeof(int));
                udtEntityDataDT.Columns.Add("Job_Description", typeof(string));
                udtEntityDataDT.Columns.Add("Contract_Applicable", typeof(bool));
                udtEntityDataDT.Columns.Add("Contract_Start_date", typeof(DateTime));
                udtEntityDataDT.Columns.Add("Contract_End_date", typeof(DateTime));
                udtEntityDataDT.Columns.Add("OT_Applicable", typeof(bool));
                udtEntityDataDT.Columns.Add("Shift_Id", typeof(int));
                udtEntityDataDT.Columns.Add("Is_Auto_Renewal", typeof(bool));

                udtEntityDataDT.Columns.Add("Location_Id", typeof(int));
                udtEntityDataDT.Columns.Add("Department_Id", typeof(int));
                udtEntityDataDT.Columns.Add("Sub_Department", typeof(int));
                udtEntityDataDT.Columns.Add("Designation", typeof(int));
                udtEntityDataDT.Columns.Add("Position_Id", typeof(int));
                udtEntityDataDT.Columns.Add("Organization_Unit", typeof(int));

                udtEntityDataDT.Columns.Add("EmailType_Id", typeof(int));
                udtEntityDataDT.Columns.Add("EmailAddress", typeof(string));
                udtEntityDataDT.Columns.Add("Is_Default", typeof(bool));
                udtEntityDataDT.Columns.Add("EmailType_Id2", typeof(int));
                udtEntityDataDT.Columns.Add("EmailAddress2", typeof(string));
                udtEntityDataDT.Columns.Add("Is_Default2", typeof(bool));

                udtEntityDataDT.Columns.Add("PhoneType_Id", typeof(int));
                udtEntityDataDT.Columns.Add("PhoneNo", typeof(string));
                udtEntityDataDT.Columns.Add("Phone_Exchange", typeof(string));
                udtEntityDataDT.Columns.Add("Is_Default_C", typeof(bool));
                udtEntityDataDT.Columns.Add("PhoneType_Id2", typeof(int));
                udtEntityDataDT.Columns.Add("PhoneNo2", typeof(string));
                udtEntityDataDT.Columns.Add("Phone_Exchange2", typeof(string));
                udtEntityDataDT.Columns.Add("Is_Default2_C", typeof(bool));

                udtEntityDataDT.Columns.Add("Log_id", typeof(int));
                udtEntityDataDT.Columns.Add("ExternalUnique_Id", typeof(string));
                udtEntityDataDT.Columns.Add("IsError", typeof(bool));

                foreach (var udtEntityData in model.EntityDataUDTList)
                {
                    udtEntityDataDT.Rows.Add(

                    udtEntityData.Company_Id,
                    udtEntityData.Company_Code,

                    udtEntityData.EmploymentType,
                    udtEntityData.Contractor_id,
                    udtEntityData.PayrollNo,
                    udtEntityData.Title,
                    udtEntityData.FirstName,
                    udtEntityData.MiddleName,
                    udtEntityData.LastName,
                    udtEntityData.DateOfJoining,
                    udtEntityData.HOD,
                    udtEntityData.Superior,
                    udtEntityData.EmpCategory,
                    udtEntityData.Religion,
                    udtEntityData.Nationality,
                    udtEntityData.Gender,
                    udtEntityData.BirthDate,
                    udtEntityData.MaritalStatus,
                    udtEntityData.Children,
                    udtEntityData.UserRole,
                    udtEntityData.BloodGroup,
                    udtEntityData.Emergency_Contact_Name,
                    udtEntityData.Police_verification,

                    udtEntityData.WorkOrder_Id,
                    udtEntityData.WeekOff_Type,
                    udtEntityData.WeekOff_Day,
                    udtEntityData.Job_Description,
                    udtEntityData.Contract_Applicable,
                    udtEntityData.Contract_Start_date,
                    udtEntityData.Contract_End_date,
                    udtEntityData.OT_Applicable,
                    udtEntityData.Shift_Id,
                    udtEntityData.Is_Auto_Renewal,

                    udtEntityData.Location_Id,
                    udtEntityData.Department_Id,
                    udtEntityData.Sub_Department,
                    udtEntityData.Designation,
                    udtEntityData.Position_Id,
                    udtEntityData.Organization_Unit,

                    udtEntityData.EmailType_Id,
                    udtEntityData.EmailAddress,
                    udtEntityData.Is_Default,
                    udtEntityData.EmailType_Id2,
                    udtEntityData.EmailAddress2,
                    udtEntityData.Is_Default2,

                    udtEntityData.PhoneType_Id,
                    udtEntityData.PhoneNo,
                    udtEntityData.Phone_Exchange,
                    udtEntityData.Is_Default_C,
                    udtEntityData.PhoneType_Id2,
                    udtEntityData.PhoneNo2,
                    udtEntityData.Phone_Exchange2,
                    udtEntityData.Is_Default2_C,

                    udtEntityData.Log_id,
                    udtEntityData.ExternalUnique_Id,
                    udtEntityData.IsError

                    );
                }

                #endregion



                // Add parameters
                parameters.Add("@EntityData", udtEntityDataDT.AsTableValuedParameter("dbo.udt_EntityData"));

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

        public async Task<string> UpdateAsync(string procedureName, EntityMasterVerified model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @ContractorData UDT
            var udtEntityDataDT = new DataTable();
            udtEntityDataDT.Columns.Add("PayrollNo", typeof(string));
            udtEntityDataDT.Columns.Add("IsVerified", typeof(bool));

            // Populate DataTable
            foreach (var udtEntityData in model.EntityDataValidateUDT)
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
