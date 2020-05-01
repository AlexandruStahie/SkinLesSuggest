using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkinLesSuggest.Helpers;
using SkinLesSuggest.Models;
using SkinLesSuggest.Services.Interfaces;
using SkinLesSuggest.ViewModels;

namespace SkinLesSuggest.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LesionController : ControllerBase
    {
        private readonly ILesionService _lesionService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public LesionController(ILesionService lesionService, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _lesionService = lesionService;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> SaveSuggestion([FromBody] LesionViewModel model)
        {
            var userId = _httpContextAccessor.HttpContext.User.GetLoggedInUserId<string>();
            Lesion lesion = _mapper.Map<Lesion>(model);
            lesion.UserId = Guid.Parse(userId);
            lesion.Id = Guid.NewGuid();

            Suggestion suggestion = _mapper.Map<Suggestion>(model);
            suggestion.Id = Guid.NewGuid();
            suggestion.LesionId = lesion.Id;

            await _lesionService.SaveLesionDetails(lesion, suggestion);

            return Ok();
        }

        [HttpGet]
        public async Task<List<LesionViewModel>> GetAllUserLesions()
        {
            var userId = _httpContextAccessor.HttpContext.User.GetLoggedInUserId<string>();
            List<Lesion> userLesions = await _lesionService.GetAllUserLesions(Guid.Parse(userId));
            return _mapper.Map<List<LesionViewModel>>(userLesions);
        }

        [HttpGet("{lesionId:guid}")]
        public async Task<List<SuggestionViewModel>> GetLesionSuggestions(Guid lesionId)
        {
            List<Suggestion> lesionSuggestions = await _lesionService.GetLesionSuggestions(lesionId);
            return _mapper.Map<List<SuggestionViewModel>>(lesionSuggestions);
        }
    }
}