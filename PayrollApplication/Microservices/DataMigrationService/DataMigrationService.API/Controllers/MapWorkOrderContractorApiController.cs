/****************************************************************************************************
 *  Jira Task Ticket : PAYROLL-250,251                                                              *
 *  Description:                                                                                    *
 *  This controller handles CRUD operations for mapWorkOrderContractor entries.                     *
 *  It includes APIs to retrieve, create, update, mapWorkOrderContractor                            *
 *  records using the repository pattern and stored procedures.                                     *
 *                                                                                                  *
 *  Methods:                                                                                        *
 *  - GetMapWorkOrderContractorById: To show Data in the staging API record by Log_ID.              *
 *  - PostMapWorkOrderContractor   : Adds a new mapWorkOrderContractor record.                      *
 *  - PutMapWorkOrderContractor    : Move staging data to Actual table.                             *
 *                                                                                                  *
 *  Author: Priyanshi Jain                                                                          *
 *  Date  : 09-Dec-2024                                                                             *
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
    public class MapWorkOrderContractorAPiController : ControllerBase
    {
        private readonly IMapWorkOrderContractorRepository _repository;
        public MapWorkOrderContractorAPiController(IMapWorkOrderContractorRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        #region Map Work Order Contractor CRUD APIs
        /// <summary>
        ///  Developer Name :- Priyanshi Jain
        ///  Message detail :- This API to show Data in the staging API details based on the provided organization data.
        ///  Created Date   :- 09-Dec-2024
        ///  Change Date    :- 09-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="id">The ID of the Map Work Order Contractor staging to retrieve</param>
        /// <returns>Returns an API response with Map Work Order Contractor staging details or an error message.</returns>
        [HttpGet("getmapworkordercontractorbyid/{id}")]
        public async Task<IActionResult> GetMapWorkOrderContractorById(int id)
        {
            ApiResponseModel<MapWorkOrderContractor> apiResponse = new ApiResponseModel<MapWorkOrderContractor>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByIdAsync(DbConstants.GetMapWorkOrderContractorById, new { Log_ID = id });

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
        ///  Message detail :- This API handles the bulk addition of Map Work Order Contractor Stage details based on the provided organization data.
        ///  Created Date   :- 09-Dec-2024
        ///  Change Date    :- 09-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="mapWorkOrderContractor">Map Work Order Contractor detail to be added.</param>
        /// <returns>Returns an API response with the result of the operation.</returns>
        [HttpPost("postmapworkordercontractor")]
        public async Task<IActionResult> PostMapWorkOrderContractor([FromBody] MapWorkOrderContractor mapWorkOrderContractor)
        {
            ApiResponseModel<MapWorkOrderContractor> apiResponse = new ApiResponseModel<MapWorkOrderContractor>();
            if (mapWorkOrderContractor == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the MapWorkOrderContractor stage
            var jsonResult = await _repository.AddAsync(DbConstants.AddMapWorkOrderContractor, mapWorkOrderContractor);

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
        ///  Message detail :- Updates the Map Work Order Contractor staging detail based on the provided Map Work Order Contractor staging and Log_ID. 
        ///                    If the ID does not match or mapWorkOrderContractor is null, returns a BadRequest. 
        ///                    If the record does not exist, returns a NotFound.Move staging data to Actual table
        ///                    Upon successful update, returns the appropriate status and message.
        ///  Created Date   :- 09-Dec-2024
        ///  Last Updated   :- 09-Dec-2024
        ///  Change Details :- None.
        /// </summary>
        /// <param name="id">The ID of the Map Work Order Contractor Stage to update.</param>
        /// <param name="mapWorkOrderContractor">The mapWorkOrderContractor Stage detail to update with.</param>
        /// <returns>Returns an ApiResponseModel with a success or failure message.</returns>
        [HttpPut("updatemapworkordercontractor/{id}")]
        public async Task<IActionResult> PutMapWorkOrderContractor(int id, [FromBody] MapWorkOrderContractor mapWorkOrderContractor)
        {
            ApiResponseModel<WorkOrderMaster> apiResponse = new ApiResponseModel<WorkOrderMaster>();
            if (mapWorkOrderContractor == null || id <= 0 || mapWorkOrderContractor.workOrderContractors == null || !mapWorkOrderContractor.workOrderContractors.Any())
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
            // Call the UpdateAsync method in the repository
            mapWorkOrderContractor.Log_id = id;
            var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateMapWorkOrderContractor, mapWorkOrderContractor);
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
