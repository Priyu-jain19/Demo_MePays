using DataMigrationService.BAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataMigrationService.DAL.Interface
{
    public interface ISubsidiaryStageRepository
    {
        Task<string> AddAsync(string procedureName, SubsidiaryStage model);
        Task<List<SubsidiaryStageUDT>> GetSubsidiaryStageAsync(string procedureName, int logId);

        Task<string> ValidateAndTransferSubsidiaryDataAsync(string procedureName, int logId, SubsidiaryStage model);
    }
}
