/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-333                                                                 *
 *  Author: Chirag Gurjar                                                                          *
 *  Date  : 30-Dec-2024                                                                            *                             
 *  Modify:                                                                                        *
 *  Description:                                                                                   *
 *  This controller handles CRUD operations for Entity master Stage entries.                       *
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
    public class EntityBankFinanceApiController : ControllerBase
    {
        private readonly IEntityBankFinanceRepository _repository;
        public EntityBankFinanceApiController(IEntityBankFinanceRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        #region Contractor Stage Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Chirag Gurjar
        ///  Message detail :- This API use to get entity master bank  details based on the log id.
        ///  Jira           :- PAYROLL-287
        ///  Created Date   :- 30-Dec-2024
        ///  Change Date    :      
        /// </summary>
        [HttpGet("getentitybankbylogid/{id}")]
        public async Task<IActionResult> GetEntityBankByLogId(int id)
        {
            ApiResponseModel<EntityBankFinance> apiResponse = new ApiResponseModel<EntityBankFinance>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByLogIdAsync(DbConstants.GetEntityBankFinanceById, new { Log_Id = id });

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
        ///  Created Date   :- 30-Dec-2024    
        /// </summary>
        [HttpPost("postentitybankfinance")]
        public async Task<IActionResult> PostEntityBankFinance([FromBody] EntityBankFinance entityBankFinance)
        {
            ApiResponseModel<EntityBankFinance> apiResponse = new ApiResponseModel<EntityBankFinance>();
            if (entityBankFinance == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the contractor  stage
            var jsonResult = await _repository.AddJsonAsync(DbConstants.AddEntityBankFinance, entityBankFinance);

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
        ///  Message detail :- Updates the Entity Bank finance staging detail based on the provided data with is approved or not by Log_ID. 
        ///  Created Date   :- 1-Jan-2025
        ///  Last Updated   :- 
        ///  Change Details :- 
        /// </summary>
        [HttpPut("updateentitybankstage/{id}")]
        public async Task<IActionResult> updateEntityBankStage(int id, [FromBody] EntityBankFinanceVerified entityBankFinanceVerified)
        {
            ApiResponseModel<ContractorStage> apiResponse = new ApiResponseModel<ContractorStage>();
            if (entityBankFinanceVerified == null || id <= 0 || entityBankFinanceVerified.EntityBankValidateUDT == null || !entityBankFinanceVerified.EntityBankValidateUDT.Any())
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
            // Call the UpdateAsync method in the repository
            entityBankFinanceVerified.Log_Id = id;
            var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateEntityMaster, entityBankFinanceVerified);
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
