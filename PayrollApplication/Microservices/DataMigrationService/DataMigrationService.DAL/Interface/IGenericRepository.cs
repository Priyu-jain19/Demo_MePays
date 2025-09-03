using DataMigrationService.BAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Interface
{
    public interface IGenericRepository<T>
    {
        Task<string> GetByIdAsync(string procedureName, object parameters);
        Task<string> AddAsync(string procedureName, T model);
        Task<string> UpdateAsync(string procedureName, T model);

    }
}
