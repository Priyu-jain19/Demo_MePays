using DataMigrationService.BAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Interface
{
    public interface IContractorDocumentMasterInterface 
    {
        Task<string> GetByIdAsync(string procedureName, object parameters);
        Task<string> AddAsync(string procedureName, ContractorDocumentMaster model);
        Task<ContractDocumentFTP> UpdateAsync(string procedureName, ContractDocumentFTP model);
    }
}
