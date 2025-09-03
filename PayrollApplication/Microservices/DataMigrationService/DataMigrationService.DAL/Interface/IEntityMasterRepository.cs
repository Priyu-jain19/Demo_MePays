using DataMigrationService.BAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Interface
{
    public interface IEntityMasterRepository
    {
        Task<string> GetByLogIdAsync(string procedureName, object parameters);
        Task<string> AddJsonAsync(string procedureName, EntityMaster model);
        Task<string> UpdateAsync(string procedureName, EntityMasterVerified model);
    }
}
