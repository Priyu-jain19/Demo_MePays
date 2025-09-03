using DataMigrationService.BAL.Models;
using Microsoft.AspNetCore.Mvc;
using Payroll.Common.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Interface
{
    public interface IDepartmentLocationStageRepository 
    {
        Task<string> GetByLogIdAsync(string procedureName, object parameters);
        Task<string> AddJsonAsync(string procedureName, DepartmentLocationStage model);
        Task<string> UpdateAsync(string procedureName, DepartmentLocationStage model);
    }
}
