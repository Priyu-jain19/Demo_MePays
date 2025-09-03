using Dapper;
using DataMigrationService.BAL.Models;
using DataMigrationService.DAL.Interface;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Payroll.Common.ApplicationConstant;
using Payroll.Common.ApplicationModel;
using Payroll.Common.EnumUtility;
using Payroll.Common.Helpers;
using Payroll.Common.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Service
{
    public class DepartmentLocationStageServiceRepository : IDepartmentLocationStageRepository
    {
        private readonly IDbConnection _dbConnection;
        public DepartmentLocationStageServiceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<string> AddJsonAsync(string procedureName, DepartmentLocationStage model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var departmentLocationDT = new DataTable();
            departmentLocationDT.Columns.Add("Company_Id", typeof(int));
            departmentLocationDT.Columns.Add("Correspondance_ID", typeof(int));
            departmentLocationDT.Columns.Add("Department_Id", typeof(int));
            departmentLocationDT.Columns.Add("Department_Code", typeof(string));
            departmentLocationDT.Columns.Add("Area_Id", typeof(int));
            departmentLocationDT.Columns.Add("Floor_Id", typeof(int));
            // Populate DataTable
            foreach (var deptLocation in model.DepartmentLocation)
            {
                departmentLocationDT.Rows.Add(
                deptLocation.Company_Id,
                deptLocation.Correspondance_ID,
                deptLocation.Department_Id,
                deptLocation.Department_Code,
                deptLocation.Area_Id,
                deptLocation.Floor_Id
                );
            }
            // Add parameters

            parameters.Add("@TemplateFileName", model.TemplateFileName, DbType.String);
            parameters.Add("@UploadFileName", model.UploadFileName, DbType.String);
            parameters.Add("@UploadFilePath", model.UploadFilePath, DbType.String);

            parameters.Add("@LocationData", departmentLocationDT.AsTableValuedParameter("dbo.udt_departmentlocation_data"));

            parameters.Add("@CreatedBy", model.CreatedBy);
            parameters.Add("@Module_Id", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            parameters.Add("@Company_Id", model.Company_Id);

            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);

            return result; // Return the JSON string directly
        }

        public async Task<string> UpdateAsync(string procedureName, DepartmentLocationStage model)
        {
            var parameters = new DynamicParameters();
            // Create a DataTable for the @DepartmentData UDT
            var departmentLocationDT = new DataTable();
            departmentLocationDT.Columns.Add("Company_Id", typeof(int));
            departmentLocationDT.Columns.Add("Correspondance_ID", typeof(int));
            departmentLocationDT.Columns.Add("Department_Id", typeof(int));
            departmentLocationDT.Columns.Add("Department_Code", typeof(string));
            departmentLocationDT.Columns.Add("Area_Id", typeof(int));
            departmentLocationDT.Columns.Add("Floor_Id", typeof(int));
            // Populate DataTable
            foreach (var deptLocation in model.DepartmentLocation)
            {
                departmentLocationDT.Rows.Add(
                  deptLocation.Company_Id,
                  deptLocation.Correspondance_ID,
                  deptLocation.Department_Id,
                  deptLocation.Department_Code,
                  deptLocation.Area_Id,
                  deptLocation.Floor_Id
                );
            }
            // Add parameters
            parameters.Add("@Log_Id", model.Log_Id, DbType.Int64);
            parameters.Add("@LocationData", departmentLocationDT.AsTableValuedParameter("dbo.udt_departmentlocation_data"));
            parameters.Add("@UpdatedBy", model.UpdatedBy, DbType.Int64);

            parameters.Add("@Messagetype", (int)EnumUtility.ApplicationMessageTypeEnum.Information);
            parameters.Add("@MessageMode", (int)EnumUtility.ApplicationMessageModeEnum.ImportVerified);
            parameters.Add("@ModuleId", (int)EnumUtility.ModuleEnum.DataMigrationImport);
            // Execute stored procedure and return JSON result
            var result = await _dbConnection.QueryFirstOrDefaultAsync<string>(procedureName, parameters, commandType: CommandType.StoredProcedure);
            return result; // Return the JSON string directly
        }

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
    }
}
