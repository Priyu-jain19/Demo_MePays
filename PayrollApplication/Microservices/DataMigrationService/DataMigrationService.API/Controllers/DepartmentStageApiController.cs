/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-211,223,225                                                                  *
 *  Description:                                                                                    *
 *  This controller handles CRUD operations for DepartmentStage entries.                            *
 *  It includes APIs to retrieve, create, update, DepartmentStage                                   *
 *  records using the repository pattern and stored procedures.                                     *
 *                                                                                                  *
 *  Methods:                                                                                        *
 *  - GetDepartmentStageById: To show Data in the staging API record by Log_ID.                     *
 *  - PostDepartmentStage   : Adds a new DepartmentStage record.                                    *
 *  - PutDepartmentStage    : Move staging data to Actual table.                                    *
 *                                                                                                  *
 *  Author: Priyanshi Jain                                                                          *
 *  Date  : 26-Nov-2024                                                                             *
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
    public class DepartmentStageApiController : ControllerBase
    {
        private readonly IDepartmentStageRepository _repository;
        public DepartmentStageApiController(IDepartmentStageRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        #region Department Stage Crud APIs Functionality
        /// <summary>
        ///  Developer Name :- Priyanshi Jain
        ///  Message detail :- This API to show Data in the staging API details based on the provided organization data.
        ///  Created Date   :- 26-Nov-2024
        ///  Change Date    :- 26-Nov-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="id">The ID of the department staging to retrieve</param>
        /// <returns>Returns an API response with department staging details or an error message.</returns>
        [HttpGet("getdepartmentstagebyid/{id}")]
        public async Task<IActionResult> GetDepartmentStageById(int id)
        {
            ApiResponseModel<DepartmentStage> apiResponse = new ApiResponseModel<DepartmentStage>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByIdAsync(DbConstants.GetDepartmentStageById, new { Log_ID = id });

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
        ///  Message detail :- This API handles the bulk addition of Department Stage details based on the provided organization data.
        ///  Created Date   :- 26-Nov-2024
        ///  Change Date    :- 26-Nov-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="departmentStage"> Department detail to be added.</param>
        /// <returns>Returns an API response with the result of the operation.</returns>
        [HttpPost("postdepartmentstage")]
        public async Task<IActionResult> PostDepartmentStage([FromBody] DepartmentStage departmentStage)
        {
            ApiResponseModel<DepartmentStage> apiResponse = new ApiResponseModel<DepartmentStage>();
            if (departmentStage == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the department stage
            var jsonResult = await _repository.AddAsync(DbConstants.AddDepartmentStage, departmentStage);

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
        ///  Message detail :- Updates the department staging detail based on the provided department staging and Log_ID. 
        ///                    If the ID does not match or departmentStage is null, returns a BadRequest. 
        ///                    If the record does not exist, returns a NotFound.Move staging data to Actual table
        ///                    Upon successful update, returns the appropriate status and message.
        ///  Created Date   :- 26-Nov-2024
        ///  Last Updated   :- 26-Nov-2024
        ///  Change Details :- Added a bulk insert functionality using a User-Defined Table (UDT).
        /// </summary>
        /// <param name="id">The ID of the Department Stage to update.</param>
        /// <param name="departmentStage">The Department Stage detail to update with.</param>
        /// <returns>Returns an ApiResponseModel with a success or failure message.</returns>
        [HttpPut("updatedepartmentstage/{id}")]
        public async Task<IActionResult> PutDepartmentStage(int id, [FromBody] DepartmentStage departmentStage)
        {
            ApiResponseModel<DepartmentStage> apiResponse = new ApiResponseModel<DepartmentStage>();
            if (departmentStage == null || id <= 0 || departmentStage.Departments == null || !departmentStage.Departments.Any())
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
            // Call the UpdateAsync method in the repository
            departmentStage.Log_Id = id;
           var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateDepartmentStage, departmentStage);
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
