using DataMigrationService.BAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Interface
{
    public interface IEntityBankFinanceRepository
    {
        Task<string> GetByLogIdAsync(string procedureName, object parameters);
        Task<string> AddJsonAsync(string procedureName, EntityBankFinance model);
        Task<string> UpdateAsync(string procedureName, EntityBankFinanceVerified model);
    }
}
