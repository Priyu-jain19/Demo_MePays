/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-243                                                                 *
 *  Author: Chirag Gurjar                                                                          *
 *  Date  : 5-Dec-2024                                                                             *                             
 *  Modify: 6-Dec-2024                                                                             *
 *  Description:                                                                                   *
 *  This controller handles CRUD operations for Contractor Stage entries.                          *
 *  It includes APIs to retrieve, create, update atcontractor  Stage                               * 
 *                                                                                                 *
 ****************************************************************************************************/
using DataMigrationService.BAL.Models;
using DataMigrationService.DAL.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Payroll.Common.ApplicationConstant;
using Payroll.Common.ApplicationModel;
using Payroll.Common.Helpers;
using System.Net;

namespace DataMigrationService.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class ContractorStageControllerApiController : ControllerBase
    {
        private readonly IContractorStageServiceRepository _repository;
        public ContractorStageControllerApiController(IContractorStageServiceRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        #region Contractor Stage Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Chirag Gurjar
        ///  Message detail :- This API use to get Contractor Stage details based on the llog id.
        ///  Jira           :- PAYROLL-243
        ///  Created Date   :- 5-Dec-2024
        ///  Change Date    :- 6-Dec-2024      
        /// </summary>
        [HttpGet("getcontractorstagebylogid/{id}")]
        public async Task<IActionResult> GetContractorStageByLogId(int id)
        {
            ApiResponseModel<ContractorStage> apiResponse = new ApiResponseModel<ContractorStage>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByLogIdAsync(DbConstants.GetContractorStageByLogId, new { Log_ID = id });

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
        ///  Developer Name :- Chirag Gurjar
        ///  Message detail :- This API handles the bulk addition of contractor  Stage details.
        ///  Created Date   :- 5-Dec-2024    
        /// </summary>
        [HttpPost("postcontractorstage")]
        public async Task<IActionResult> PostContractorStage([FromBody] ContractorStage contractorStage)
        {
            ApiResponseModel<ContractorStage> apiResponse = new ApiResponseModel<ContractorStage>();
            if (contractorStage == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the contractor  stage
            var jsonResult = await _repository.AddJsonAsync(DbConstants.AddContractorStage, contractorStage);

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
           // apiResponse.Data = contractorStage;
            apiResponse.JsonResponse = jsonResult;// Return the raw JSON string in the response
            // Return the appropriate HTTP status code
            return messageType == 1
                ? StatusCode((int)HttpStatusCode.Created, apiResponse)
                : BadRequest(apiResponse);
        }

        /// <summary>
        ///  Developer Name :- Chirag Gurjar
        ///  Message detail :- Updates the Contractor staging detail based on the provided contractor staging data and Log_ID. 
        ///                    If the ID does not match or contractor  Stage is null, returns a BadRequest. 
        ///                    If the record does not exist, returns a NotFound. Move staging data to Actual table
        ///                    Upon successful update, returns the appropriate status and message.
        ///  Created Date   :- 5-Dec-2024
        ///  Last Updated   :- 6-Dec-2024
        ///  Change Details :- Added a bulk insert functionality using a User-Defined Table (UDT).
        /// </summary>
        [HttpPut("updatecontractorstage/{id}")]
        public async Task<IActionResult> updateContractorStage(int id, [FromBody] ContractorStage contractorStage)
        {
            ApiResponseModel<ContractorStage> apiResponse = new ApiResponseModel<ContractorStage>();
            if (contractorStage == null || id <= 0 || contractorStage.ContractorUDTList == null || !contractorStage.ContractorUDTList.Any())
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
            // Call the UpdateAsync method in the repository
            contractorStage.Log_Id = id;
            var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateContractorStage, contractorStage);
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
