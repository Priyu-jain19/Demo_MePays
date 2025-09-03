/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-241                                                                  *
 *  Description:                                                                                    *
 *  This controller handles CRUD operations for ContractMaster entries.                             *
 *  It includes APIs to retrieve, create, ContractMaster                                            *
 *  records using the repository pattern and stored procedures.                                     *
 *                                                                                                  *
 *  Methods:                                                                                        *
 *  - GetContractMasterById: Retrieves a specific ContractMaster record by ID and Code.             *
 *  - PostContractMaster   : Bulk Insert ContractMaster record.                                     *
 *                                                                                                  *
 *  Author: Priyanshi Jain                                                                          *
 *  Date  : 03-Dec-2024                                                                             *
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
    public class ContractMasterApiController : ControllerBase
    {
        private readonly IContractMasterRepository _repository;
        public ContractMasterApiController(IContractMasterRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        #region Contract Master Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Priyanshi Jain
        ///  Message detail :- This API to show Data in the staging API details based on the provided organization data.
        ///  Created Date   :- 03-Dec-2024
        ///  Change Date    :- 03-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="id">The ID of the contract to retrieve</param>
        /// <param name="code">The contract code of the contract to retrieve</param>
        /// <returns>Returns an API response with contract staging details or an error message.</returns>
        [HttpGet("getcontractmasterbyid/")]
        public async Task<IActionResult> GetContractMasterById(int contract_Id, string contract_Code)
        {
            ApiResponseModel<ContractMaster> apiResponse = new ApiResponseModel<ContractMaster>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByIdAsync(DbConstants.GetContractMasterById, new { Contract_Id = contract_Id, Contract_Code = contract_Code });

            if (string.IsNullOrEmpty(jsonResult))
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.RecordNotFound;
                apiResponse.StatusCode = ApiResponseStatusConstant.NotFound;
                return NotFound(apiResponse);
            }
            // Parse JSON result if necessary or return as is
            //var parsedResult = JToken.Parse(jsonResult); // Parse JSON for additional validation if needed
            apiResponse.IsSuccess = true;
            apiResponse.JsonResponse = jsonResult; // Include parsed JSON in the response
            apiResponse.Message = ApiResponseMessageConstant.GetRecord;
            apiResponse.StatusCode = ApiResponseStatusConstant.Ok;
            return Ok(apiResponse);
        }

        /// <summary>
        ///  Developer Name :- Priyanshi Jain
        ///  Message detail :- This API handles the bulk addition of Contract Master details based on the provided organization data.
        ///  Created Date   :- 03-Dec-2024
        ///  Change Date    :- 03-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>

        [HttpPost("postcontractmaster")]
        public async Task<IActionResult> PostContractMaster([FromBody] ContractMaster contractMaster)
        {
            ApiResponseModel<ContractMaster> apiResponse = new ApiResponseModel<ContractMaster>();
            if (contractMaster == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the contract
            var jsonResult = await _repository.AddAsync(DbConstants.AddContractMaster, contractMaster);

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
