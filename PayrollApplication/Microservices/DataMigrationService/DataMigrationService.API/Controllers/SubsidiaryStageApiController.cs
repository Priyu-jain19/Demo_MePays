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
    public class SubsidiaryStageApiController : ControllerBase
    {
        #region CTOR
        private readonly ISubsidiaryStageRepository _repository;
        public SubsidiaryStageApiController(ISubsidiaryStageRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        #endregion
        #region Subsidiary Master Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Harshida Parmar
        ///  Message detail :- This API handles the bulk addition of Subsidiary Stage details based on the provided data.
        ///  Created Date   :- 12-Dec-2024
        ///  Change Date    :- 12-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>

        [HttpPost("postsubsidiarystage")]
        public async Task<IActionResult> PostSubsidiaryStage([FromBody] SubsidiaryStage subsidiaryStageMaster)
        {
            ApiResponseModel<SubsidiaryStage> apiResponse = new ApiResponseModel<SubsidiaryStage>();
            if (subsidiaryStageMaster == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the subsidiary
            var jsonResult = await _repository.AddAsync(DbConstants.AddSubsidiaryStage, subsidiaryStageMaster);

            if (string.IsNullOrEmpty(jsonResult))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new ApiResponseModel<string>
                {
                    IsSuccess = false,
                    Message = ApiResponseMessageConstant.RecordNotFound,
                    StatusCode = ApiResponseStatusConstant.BadRequest
                });
            }
            var jsonResponse = JToken.Parse(jsonResult);
            var validationRoot = jsonResponse["VALIDATE"]?.FirstOrDefault();
            var countResults = validationRoot?["CountResults"]?.FirstOrDefault();
            var messageType = (int?)(countResults?["ApplicationMessageType"] ?? 0);
            var statusMessage = countResults?["ApplicationMessage"]?.ToString() ?? string.Empty;
            apiResponse.IsSuccess = messageType == 1;
            apiResponse.Message = statusMessage;
            apiResponse.MessageType = messageType ?? 0;
            apiResponse.StatusCode = messageType == 1 ? ApiResponseStatusConstant.Created : ApiResponseStatusConstant.BadRequest;
            // apiResponse.Data = departmentStage;
            apiResponse.JsonResponse = jsonResult;
            return messageType == 1
                ? StatusCode((int)HttpStatusCode.Created, apiResponse)
                : BadRequest(apiResponse);
        }

        [HttpGet("GetSubsidiaryStage/{logId}")]
        public async Task<IActionResult> GetSubsidiaryStageAsync(int logId)
        {
            try
            {
                var result = await _repository.GetSubsidiaryStageAsync(DbConstants.GetSubsidiaryStageByLogId, logId);

                if (result == null || result.Count == 0)
                    return NotFound("No data found.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        #endregion

        #region CRUD for Subsidiary to Master
        [HttpPost("postsubsidiarymaster")]
        public async Task<IActionResult> PostSubsidiaryMaster([FromBody] SubsidiaryStage subsidiaryStageMaster)
        {
            ApiResponseModel<SubsidiaryStage> apiResponse = new ApiResponseModel<SubsidiaryStage>();
            if (subsidiaryStageMaster == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the subsidiary
            var jsonResult = await _repository.ValidateAndTransferSubsidiaryDataAsync(DbConstants.AddSubsidiaryMaster, subsidiaryStageMaster.Log_Id, subsidiaryStageMaster);

            if (string.IsNullOrEmpty(jsonResult))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new ApiResponseModel<string>
                {
                    IsSuccess = false,
                    Message = ApiResponseMessageConstant.RecordNotFound,
                    StatusCode = ApiResponseStatusConstant.BadRequest
                });
            }
            var jsonResponse = JToken.Parse(jsonResult);
            var validationRoot = jsonResponse["VALIDATE"]?.FirstOrDefault();
            var countResults = validationRoot?["CountResults"]?.FirstOrDefault();
            var messageType = (int?)(countResults?["ApplicationMessageType"] ?? 0);
            var statusMessage = countResults?["ApplicationMessage"]?.ToString() ?? string.Empty;
            apiResponse.IsSuccess = messageType == 1;
            apiResponse.Message = statusMessage;
            apiResponse.MessageType = messageType ?? 0;
            apiResponse.StatusCode = messageType == 1 ? ApiResponseStatusConstant.Created : ApiResponseStatusConstant.BadRequest;
            // apiResponse.Data = departmentStage;
            apiResponse.JsonResponse = jsonResult;
            return messageType == 1
                ? StatusCode((int)HttpStatusCode.Created, apiResponse)
                : BadRequest(apiResponse);
        }
        #endregion
    }
}
