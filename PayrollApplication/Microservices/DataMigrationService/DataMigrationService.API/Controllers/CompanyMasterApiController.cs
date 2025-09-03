/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-257,258                                                              *
 *  Description:                                                                                    *
 *  This controller handles CRUD operations for CompanyMaster entries.                              *
 *  It includes APIs to retrieve, create, update, CompanyMaster                                     *
 *  records using the repository pattern and stored procedures.                                     *
 *                                                                                                  *
 *  Methods:                                                                                        *
 *  - GetCompanyById      : To show Data in the staging API record by Log_ID.                       *
 *  - PostCompanyMaster   : Adds a new CompanyMaster record.                                        *
 *  - PutCompanyMaster    : Move staging data to Actual table.                                      *
 *                                                                                                  *
 *  Author: Priyanshi Jain                                                                          *
 *  Date  : 11-Dec-2024                                                                             *
 *                                                                                                  *
 ****************************************************************************************************/
using DataMigrationService.BAL.Models;
using DataMigrationService.DAL.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Payroll.Common.ApplicationConstant;
using Payroll.Common.ApplicationModel;
using System.Net;

namespace DataMigrationService.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class CompanyMasterApiController : ControllerBase
    {
        private readonly ICompanyMasterRepository _repository;
        public CompanyMasterApiController(ICompanyMasterRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        #region Company Master Staging CRUD API
        ///<summary>
        ///Developer Name :- Priyanshi Jain
        ///Message detail :- This API to show Data in the staging API details based on the provided organization data.
        ///Created Date   :- 11-Dec-2024
        ///Change Date    :- 11-Dec-2024
        ///Change detail  :- Not yet modified.
        ///<param name="id">The ID of the company master to retrieve</param>
        ///<returns>Returns an API response with Company Master staging details or an error message.</returns>
        ///</summary>
        [HttpGet("getcompanymasterbyid/{id}")]
        public async Task<IActionResult> GetCompanyMasterById(int id)
        {
            ApiResponseModel<CompanyMasterDataMigration> apiResponse = new ApiResponseModel<CompanyMasterDataMigration>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByIdAsync(DbConstants.GetStgCompanyMasterById, new { Log_ID = id });

            if (string.IsNullOrEmpty(jsonResult))
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.RecordNotFound;
                apiResponse.StatusCode = ApiResponseStatusConstant.NotFound;
                return NotFound(apiResponse);
            }
            // Parse JSON result if necessary or return as is
            apiResponse.IsSuccess = true;
            apiResponse.JsonResponse = jsonResult; // Include parsed JSON in the response
            apiResponse.Message = ApiResponseMessageConstant.GetRecord;
            apiResponse.StatusCode = ApiResponseStatusConstant.Ok;
            return Ok(apiResponse);
        }

        /// <summary>
        ///  Developer Name :- Priyanshi Jain
        ///  Message detail :- This API handles the bulk addition of Company Master details based on the provided organization data.
        ///  Created Date   :- 11-Dec-2024
        ///  Change Date    :- 11-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        [HttpPost("postcompanymaster")]
        public async Task<IActionResult> PostCompanyMaster([FromBody] CompanyMasterDataMigration companyMaster)
        {
            ApiResponseModel<CompanyMasterDataMigration> apiResponse = new ApiResponseModel<CompanyMasterDataMigration>();
            if (companyMaster == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the contract
            var jsonResult = await _repository.AddAsync(DbConstants.AddStgCompanyMaster, companyMaster);

            if (string.IsNullOrEmpty(jsonResult))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new ApiResponseModel<string>
                {
                    IsSuccess = false,
                    Message = ApiResponseMessageConstant.RecordNotFound,
                    StatusCode = ApiResponseStatusConstant.BadRequest
                });
            }
            // Parse the JSON result if needed
            var jsonResponse = JToken.Parse(jsonResult);
            var validationRoot = jsonResponse["VALIDATE"]?.FirstOrDefault();
            var countResults = validationRoot?["CountResults"]?.FirstOrDefault();
            // Extract message type and status message
            var messageType = (int?)(countResults?["ApplicationMessageType"] ?? 0);
            var statusMessage = countResults?["ApplicationMessage"]?.ToString() ?? string.Empty;
            // Update API response based on extracted data
            apiResponse.IsSuccess = messageType == 1;
            apiResponse.Message = statusMessage;
            apiResponse.MessageType = messageType ?? 0;
            apiResponse.StatusCode = messageType == 1 ? ApiResponseStatusConstant.Created : ApiResponseStatusConstant.BadRequest;
            apiResponse.JsonResponse = jsonResult;// Return the raw JSON string in the response
            // Return the appropriate HTTP status code
            return messageType == 1
                ? StatusCode((int)HttpStatusCode.Created, apiResponse)
                : BadRequest(apiResponse);
        }

        /// <summary>
        ///  Developer Name :- Priyanshi Jain
        ///  Message detail :- Updates the company master staging detail based on the provided company master staging and Log_ID. 
        ///                    If the ID does not match or companyMaster is null, returns a BadRequest. 
        ///                    If the record does not exist, returns a NotFound.Move staging data to Actual table
        ///                    Upon successful update, returns the appropriate status and message.
        ///  Created Date   :- 12-Dec-2024
        ///  Last Updated   :- 12-Dec-2024
        ///  Change Details :- None.
        /// </summary>
        /// <param name="id">The ID of the Company Master Stage to update.</param>
        /// <param name="companyMaster">The company Master detail to update with.</param>
        /// <returns>Returns an ApiResponseModel with a success or failure message.</returns>
        [HttpPut("updatecompanymaster/{id}")]
        public async Task<IActionResult> PutCompanyMaster(int id, [FromBody] CompanyMasterDataMigration companyMaster)
        {
            ApiResponseModel<CompanyMasterDataMigration> apiResponse = new ApiResponseModel<CompanyMasterDataMigration>();
            if (companyMaster == null || id <= 0 || companyMaster.CompanyList == null || !companyMaster.CompanyList.Any())
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
            // Call the UpdateAsync method in the repository
            companyMaster.Log_Id = id;
            var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateStgCompanyMaster, companyMaster);
            if (string.IsNullOrEmpty(jsonResult))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new ApiResponseModel<string>
                {
                    IsSuccess = false,
                    Message = ApiResponseMessageConstant.RecordNotFound,
                    StatusCode = ApiResponseStatusConstant.BadRequest
                });
            }
            // Parse the JSON result if needed
            var jsonResponse = JToken.Parse(jsonResult);
            var validationRoot = jsonResponse["VALIDATE"]?.FirstOrDefault();
            var countResults = validationRoot?["CountResults"]?.FirstOrDefault();
            // Extract message type and status message
            var messageType = (int?)(countResults?["ApplicationMessageType"] ?? 0);
            var statusMessage = countResults?["ApplicationMessage"]?.ToString() ?? string.Empty;
            // Update API response based on extracted data
            apiResponse.IsSuccess = messageType == 1;
            apiResponse.Message = statusMessage;
            apiResponse.MessageType = messageType ?? 0;
            apiResponse.StatusCode = messageType == 1 ? ApiResponseStatusConstant.Created : ApiResponseStatusConstant.BadRequest;
            apiResponse.JsonResponse = jsonResult;// Return the raw JSON string in the response
            // Return the appropriate HTTP status code
            return messageType == 1
                ? StatusCode((int)HttpStatusCode.Created, apiResponse)
                : BadRequest(apiResponse);
        }
        #endregion
    }
}
