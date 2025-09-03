/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-353                                                                 *
 *  Author: Chirag Gurjar                                                                          *
 *  Date  : 1-Jan-2025                                                                            *                             
 *  Modify:                                                                                        *
 *  Description:                                                                                   *
 *  This controller handles CRUD operations for Entity Insurance Stage entries.                    *
 *  It includes APIs to retrieve, create, update at entity master  Stage                           * 
 *                                                                                                 *
 ****************************************************************************************************/
using DataMigrationService.BAL.Models;
using DataMigrationService.DAL.Interface;
using DataMigrationService.DAL.Service;
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
    public class EntityInsuranceApiController : ControllerBase
    {
        private readonly IEntityInsuranceRepository _repository;
        public EntityInsuranceApiController(IEntityInsuranceRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        #region Contractor Stage Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Chirag Gurjar
        ///  Message detail :- This API use to get entity Insurance  details based on the log id.
        ///  Jira           :- PAYROLL-353
        ///  Created Date   :- 1-Jan-2025
        ///  Change Date    :      
        /// </summary>
        [HttpGet("getentityinsurancebylogid/{id}")]
        public async Task<IActionResult> GetEntityInsuranceByLogId(int id)
        {
            ApiResponseModel<EntityInsurance> apiResponse = new ApiResponseModel<EntityInsurance>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByLogIdAsync(DbConstants.GetEntityInsuranceById, new { Log_Id = id });

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
        ///  Message detail :- This API handles the bulk addition of bank details.
        ///  Created Date   :- 1-Jan-2025   
        /// </summary>
        [HttpPost("postentityinsurance")]
        public async Task<IActionResult> PostEntityInsurance([FromBody] EntityInsurance entityInsurance)
        {
            ApiResponseModel<EntityInsurance> apiResponse = new ApiResponseModel<EntityInsurance>();
            if (entityInsurance == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the contractor  stage
            var jsonResult = await _repository.AddJsonAsync(DbConstants.AddEntityInsurance, entityInsurance);

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
        ///  Message detail :- Updates the Entity insurance staging detail based on the provided data with is approved or not by Log_ID. 
        ///  Created Date   :- 1-Jan-2025
        ///  Last Updated   :- 
        ///  Change Details :- 
        /// </summary>
        [HttpPut("updateentityinsurancetage/{id}")]
        public async Task<IActionResult> updateEntityInsuranceStage(int id, [FromBody] EntityInsuranceVerified entityInsuranceVerified)
        {
            ApiResponseModel<ContractorStage> apiResponse = new ApiResponseModel<ContractorStage>();
            if (entityInsuranceVerified == null || id <= 0 || entityInsuranceVerified.EntityBankValidateUDT == null || !entityInsuranceVerified.EntityBankValidateUDT.Any())
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
            // Call the UpdateAsync method in the repository
            entityInsuranceVerified.Log_Id = id;
            var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateEntityMaster, entityInsuranceVerified);
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
