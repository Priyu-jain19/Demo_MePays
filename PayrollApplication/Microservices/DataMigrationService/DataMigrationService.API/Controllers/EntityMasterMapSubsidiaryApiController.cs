/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-287                                                                 *
 *  Author: Chirag Gurjar                                                                          *
 *  Date  : 18-Dec-2024                                                                            *                             
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
    public class EntityMasterMapSubsidiaryApiController : ControllerBase
    {
        private readonly IEntityMasterMapSubsidiaryRepository _repository;
        public EntityMasterMapSubsidiaryApiController(IEntityMasterMapSubsidiaryRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        #region Contractor Stage Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Chirag Gurjar
        ///  Message detail :- This API use to get entity master Stage details based on the log id.
        ///  Jira           :- PAYROLL-287
        ///  Created Date   :- 18-Dec-2024
        ///  Change Date    :      
        /// </summary>
        [HttpGet("getentitymasgtermapsubsidiarybyid/{id}")]
        public async Task<IActionResult> GetEntityMasterMapSubsidiaryById(int id, int CompanyId)
        {
            ApiResponseModel<EntityMaster> apiResponse = new ApiResponseModel<EntityMaster>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByIdAsync(DbConstants.GetEntityMasterMapSubsidiaryById, new { Entity_Subsidiary_Id = id , Company_Id =CompanyId});

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
        ///  Created Date   :- 18-Dec-2024    
        /// </summary>
        [HttpPost("postentitymastermapsubsidiary")]
        public async Task<IActionResult> PostEntityMasterMapSubsidiary([FromBody] EntityMasterMapSubsidiary entityMastermapSubsidiary)
        {
            ApiResponseModel<EntityMaster> apiResponse = new ApiResponseModel<EntityMaster>();
            if (entityMastermapSubsidiary == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the contractor  stage
            var jsonResult = await _repository.AddJsonAsync(DbConstants.AddEntityMasterMapSubsidiary, entityMastermapSubsidiary);

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




        #endregion
    }
}
