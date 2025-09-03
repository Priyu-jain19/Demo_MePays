using DataMigrationService.BAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Interface
{
    public interface IContractTypeMasterRepository
    {
        Task<string> GetByIdAsync(string procedureName, object parameters);
        Task<string> AddAsync(string procedureName, ContractTypeMaster model);
    }
}
