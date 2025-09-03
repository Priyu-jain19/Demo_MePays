using DataMigrationService.BAL.Models;
using Payroll.Common.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataMigrationService.DAL.Interface
{
    public interface IDepartmentStageRepository 
    {
        Task<string> GetByIdAsync(string procedureName, object parameters);
        Task<string> AddAsync(string procedureName, DepartmentStage model);
        Task<string> UpdateAsync(string procedureName, DepartmentStage model);
    }
}
