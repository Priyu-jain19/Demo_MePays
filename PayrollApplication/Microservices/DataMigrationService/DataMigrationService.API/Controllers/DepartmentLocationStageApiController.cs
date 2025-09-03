/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-221                                                                  *
 *  Author: Chirag Gurjar                                                                           *
 *  Date  : 29-Nov-2024                                                                             *
 *  Description:                                                                                    *
 *  This controller handles CRUD operations for Department Location Stage entries.                  *
 *  It includes APIs to retrieve, create, update, and delete Department Location Stage              * 
 *                                                                                                  *
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
    public class DepartmentLocationStageApiController : ControllerBase
    {
        private readonly IDepartmentLocationStageRepository _repository;
        public DepartmentLocationStageApiController(IDepartmentLocationStageRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        #region Department Stage Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Chirag Gurjar
        ///  Message detail :- This API use to get Department Stage details based on the llog id.
        ///  Jira           :- PAYROLL-238
        ///  Created Date   :- 3-Dec-2024
        ///  Change Date    :- 3-Dec-2024       
        /// </summary>
        [HttpGet("getdepartmentlocationstagebylogid/{id}")]
        public async Task<IActionResult> GetDepartmentlocationStageByLogId(int id)
        {
            ApiResponseModel<DepartmentLocationStage> apiResponse = new ApiResponseModel<DepartmentLocationStage>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByLogIdAsync(DbConstants.GetDepartmentLocationStageById, new { Log_ID = id });

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
        ///  Message detail :- This API handles the bulk addition of Department Location Stage details.
        ///  Created Date   :- 29-Nov-2024    
        /// </summary>
        [HttpPost("postdepartmentlocationstage")]
        public async Task<IActionResult> PostDepartmentLocationStage([FromBody] DepartmentLocationStage departmentLocationStage)
        {
            ApiResponseModel<DepartmentLocationStage> apiResponse = new ApiResponseModel<DepartmentLocationStage>();
            if (departmentLocationStage == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the department location stage
            var jsonResult = await _repository.AddJsonAsync(DbConstants.AddDepartmentLocationStage, departmentLocationStage);

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

        /// <summary>
        ///  Developer Name :- Chirag Gurjar
        ///  Message detail :- Updates the department location staging detail based on the provided department staging data and Log_ID. 
        ///                    If the ID does not match or department location Stage is null, returns a BadRequest. 
        ///                    If the record does not exist, returns a NotFound. Move staging data to Actual table
        ///                    Upon successful update, returns the appropriate status and message.
        ///  Created Date   :- 2-dec-2024
        ///  Last Updated   :- 
        ///  Change Details :- Added a bulk insert functionality using a User-Defined Table (UDT).
        /// </summary>
        [HttpPut("updatedepartmentlocationstage/{id}")]
        public async Task<IActionResult> updateDepartmentLocationStage(int id, [FromBody] DepartmentLocationStage departmentLocationStage)
        {
            ApiResponseModel<DepartmentLocationStage> apiResponse = new ApiResponseModel<DepartmentLocationStage>();
            if (departmentLocationStage == null || id <= 0 || departmentLocationStage.DepartmentLocation == null || !departmentLocationStage.DepartmentLocation.Any())
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
            // Call the UpdateAsync method in the repository
            departmentLocationStage.Log_Id = id;
            var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateDepartmentLocationStage, departmentLocationStage);
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
