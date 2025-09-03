/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-244                                                                  *
 *  Description:                                                                                    *
 *  This controller handles CRUD operations for WorkOrderMaster entries.                            *
 *  It includes APIs to retrieve, create, update, WorkOrderMaster                                   *
 *  records using the repository pattern and stored procedures.                                     *
 *                                                                                                  *
 *  Methods:                                                                                        *
 *  - GetWorkOrderById      : To show Data in the staging API record by Log_ID.                     *
 *  - PostWorkOrderMaster   : Adds a new WorkOrderMaster record.                                    *
 *  - PutWorkOrderMaster    : Move staging data to Actual table.                                    *
 *                                                                                                  *
 *  Author: Priyanshi Jain                                                                          *
 *  Date  : 05-Dec-2024                                                                             *
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
    public class WorkOrderMasterApiController : ControllerBase
    {
        private readonly IWorkOrderMasterRepository _repository;
        public WorkOrderMasterApiController(IWorkOrderMasterRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        #region Work Order Master CRUD APIs
        /// <summary>
        ///  Developer Name :- Priyanshi Jain
        ///  Message detail :- This API to show Data in the staging API details based on the provided organization data.
        ///  Created Date   :- 05-Dec-2024
        ///  Change Date    :- 05-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="id">The ID of the Work Order staging to retrieve</param>
        /// <returns>Returns an API response with Work Order staging details or an error message.</returns>
        [HttpGet("getworkorderbyid/{id}")]
        public async Task<IActionResult> GetWorkOrderById(int id)
        {
            ApiResponseModel<WorkOrderMaster> apiResponse = new ApiResponseModel<WorkOrderMaster>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByIdAsync(DbConstants.GetWorkOrderMasterById, new { Log_ID = id });

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
        ///  Message detail :- This API handles the bulk addition of Work Order Stage details based on the provided organization data.
        ///  Created Date   :- 04-Dec-2024
        ///  Change Date    :- 04-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="workOrderMaster"> Work Order detail to be added.</param>
        /// <returns>Returns an API response with the result of the operation.</returns>
        [HttpPost("postworkordermaster")]
        public async Task<IActionResult> PostWorkOrderMaster([FromBody] WorkOrderMaster workOrderMaster)
        {
            ApiResponseModel<WorkOrderMaster> apiResponse = new ApiResponseModel<WorkOrderMaster>();
            if (workOrderMaster == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the department stage
            var jsonResult = await _repository.AddAsync(DbConstants.AddWorkOrderMaster, workOrderMaster);

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
        ///  Message detail :- Updates the work order staging detail based on the provided work order staging and Log_ID. 
        ///                    If the ID does not match or workOrderMaster is null, returns a BadRequest. 
        ///                    If the record does not exist, returns a NotFound.Move staging data to Actual table
        ///                    Upon successful update, returns the appropriate status and message.
        ///  Created Date   :- 05-Dec-2024
        ///  Last Updated   :- 05-Dec-2024
        ///  Change Details :- None.
        /// </summary>
        /// <param name="id">The ID of the Work Order Stage to update.</param>
        /// <param name="workOrderMaster">The Department Stage detail to update with.</param>
        /// <returns>Returns an ApiResponseModel with a success or failure message.</returns>
        [HttpPut("updateworkordermaster/{id}")]
        public async Task<IActionResult> PutWorkOrderMaster(int id, [FromBody] WorkOrderMaster workOrderMaster)
        {
            ApiResponseModel<WorkOrderMaster> apiResponse = new ApiResponseModel<WorkOrderMaster>();
            if (workOrderMaster == null || id <= 0 || workOrderMaster.workOrders == null || !workOrderMaster.workOrders.Any())
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
            // Call the UpdateAsync method in the repository
            workOrderMaster.Log_id = id;
            var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateWorkOrderMaster, workOrderMaster);
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
