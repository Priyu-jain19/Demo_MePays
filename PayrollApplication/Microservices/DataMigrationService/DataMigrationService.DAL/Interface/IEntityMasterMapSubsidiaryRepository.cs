using DataMigrationService.BAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Interface
{
    public interface IEntityMasterMapSubsidiaryRepository
    {
        Task<string> GetByIdAsync(string procedureName, object parameters);
        Task<string> AddJsonAsync(string procedureName, EntityMasterMapSubsidiary model);
       // Task<string> UpdateAsync(string procedureName, EntityMasterVerified model);
    }
}
