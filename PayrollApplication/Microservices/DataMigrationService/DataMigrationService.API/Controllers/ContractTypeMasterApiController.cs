/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-233                                                                  *
 *  Description:                                                                                    *
 *  This controller handles CRUD operations for ContractTypeMaster entries.                         *
 *  It includes APIs to retrieve, create, update, and delete DepartmentStage                        *
 *  records using the repository pattern and stored procedures.                                     *
 *                                                                                                  *
 *  Methods:                                                                                        *
 *  - GetContractTypeMasterById: Retrieves a specific ContractTypeMaster record by ID.              *
 *  - PostContractTypeMaster   : Bulk Insert ContractTypeMaster record.                             *
 *                                                                                                  *
 *  Author: Priyanshi Jain                                                                          *
 *  Date  : 02-Dec-2024                                                                             *
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
    public class ContractTypeMasterApiController : ControllerBase
    {
        private readonly IContractTypeMasterRepository _repository;
        public ContractTypeMasterApiController(IContractTypeMasterRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        #region Contract Type Master Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Priyanshi Jain
        ///  Message detail :- This API to show Data in the staging API details based on the provided organization data.
        ///  Created Date   :- 26-Nov-2024
        ///  Change Date    :- 26-Nov-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="id">The ID of the contract type master to retrieve</param>
        /// <returns>Returns an API response with contract type master details or an error message.</returns>
        [HttpGet("getcontracttypemasterbyid/{id}")]
        public async Task<IActionResult> GetContractTypeMasterById(int id)
        {
            ApiResponseModel<ContractTypeMaster> apiResponse = new ApiResponseModel<ContractTypeMaster>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByIdAsync(DbConstants.GetContractTypeMasterById, new { ContractType_Id = id });

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
        ///  Message detail :- This API handles the bulk addition of Contract Type Master details based on the provided organization data.
        ///  Created Date   :- 02-Dec-2024
        ///  Change Date    :- 02-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        [HttpPost("postcontracttypemaster")]
        public async Task<IActionResult> PostContractTypeMaster([FromBody] ContractTypeMaster contractTypeMaster)
        {
            ApiResponseModel<ContractTypeMaster> apiResponse = new ApiResponseModel<ContractTypeMaster>();
            if (contractTypeMaster == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the department location stage
            var jsonResult = await _repository.AddAsync(DbConstants.AddContractTypeMaster, contractTypeMaster);

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
            // apiResponse.Data = departmentStage;
            apiResponse.JsonResponse = jsonResult;// Return the raw JSON string in the response
            // Return the appropriate HTTP status code
            return messageType == 1
                ? StatusCode((int)HttpStatusCode.Created, apiResponse)
                : BadRequest(apiResponse);
        }
        #endregion
    }
}
