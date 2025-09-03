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
    public class ContractorDocumentMasterApiController : ControllerBase
    {
        #region CTOR
        private readonly IContractorDocumentMasterInterface _repository;
        public ContractorDocumentMasterApiController(IContractorDocumentMasterInterface repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        #endregion
        #region Contractor Document Master Crud APIs Functionality

        /// <summary>
        ///  Developer Name :- Harshida Parmar
        ///  Message detail :- This API to show Data in the staging API details based on the provided organization data.
        ///  Created Date   :- 06-Dec-'24
        ///  Change Date    :- 06-Dec-'24
        ///  Change detail  :- Not yet modified.
        /// </summary>
        /// <param name="id">The ID of the contractorDocumentMaster staging to retrieve</param>
        /// <returns>Returns an API response with contractorDocumentMaster staging details or an error message.</returns>
        [HttpGet("getcontractordocumentmasterbyid/{id}")]
        public async Task<IActionResult> GetContractorDocumentMasterById(int id)
        {
            ApiResponseModel<ContractorDocumentMaster> apiResponse = new ApiResponseModel<ContractorDocumentMaster>();
            // Fetch JSON result directly from the stored procedure
            var jsonResult = await _repository.GetByIdAsync(DbConstants.GetContractorDocumentMasterById, new { Contractor_Doc_Id = id });

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
        ///  Developer Name :- Harshida Parmar
        ///  Message detail :- This API handles the bulk addition of Contractor Document Master details based on the provided data.
        ///  Created Date   :- 06-Dec-2024
        ///  Change Date    :- 06-Dec-2024
        ///  Change detail  :- Not yet modified.
        /// </summary>

        [HttpPost("postcontractordocumentmaster")]
        public async Task<IActionResult> PostContractorDocumentMaster([FromBody] ContractorDocumentMaster contractDocumentMaster)
        {
            ApiResponseModel<ContractorDocumentMaster> apiResponse = new ApiResponseModel<ContractorDocumentMaster>();
            if (contractDocumentMaster == null)
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.NullData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }

            // Call the repository to add the contractor document stage
            var jsonResult = await _repository.AddAsync(DbConstants.AddContractorDocumentMaster, contractDocumentMaster);

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

        [HttpPut("updatecontractordocumentpathmaster/{id}")]
        public async Task<IActionResult> PutContractorDocumentPathMaster(int id, [FromBody] ContractDocumentFTP contractDocumentMaster)
        {
            ApiResponseModel<ContractDocumentFTP> apiResponse = new ApiResponseModel<ContractDocumentFTP>();
            if (contractDocumentMaster == null )
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = ApiResponseMessageConstant.InvalidData;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }            
            var jsonResult = await _repository.UpdateAsync(DbConstants.UpdateContractorDocumentMaster, contractDocumentMaster);
            //if (string.IsNullOrEmpty(jsonResult))
            //{
            //    return StatusCode((int)HttpStatusCode.InternalServerError, new ApiResponseModel<string>
            //    {
            //        IsSuccess = false,
            //        Message = ApiResponseMessageConstant.RecordNotFound,
            //        StatusCode = ApiResponseStatusConstant.BadRequest
            //    });
            //}
            var statusMessage = contractDocumentMaster.StatusMessage;
            if (contractDocumentMaster.MessageType == 1)
            {
                apiResponse.IsSuccess = true;
                apiResponse.Message = ApiResponseMessageConstant.UpdateSuccessfully;
                apiResponse.StatusCode = ApiResponseStatusConstant.Created;
                return StatusCode((int)HttpStatusCode.Created, apiResponse);
            }
            else
            {
                apiResponse.IsSuccess = false;
                apiResponse.Message = statusMessage;
                apiResponse.StatusCode = ApiResponseStatusConstant.BadRequest;
                return BadRequest(apiResponse);
            }
        }
    }
}
