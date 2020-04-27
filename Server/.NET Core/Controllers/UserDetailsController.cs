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
    public class UserDetailsController : Controller
    {
        private readonly IUserDetailsService _userDetailsService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserDetailsController(IUserDetailsService userDetailsService, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _userDetailsService = userDetailsService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        public async Task<UserDetailsViewModel> GetUserDetails()
        {
            var userId = _httpContextAccessor.HttpContext.User.GetLoggedInUserId<string>();
            UserDetails userDetails = await _userDetailsService.GetUserDetails(Guid.Parse(userId));
            if (userDetails == null)
                return null;

            return _mapper.Map<UserDetailsViewModel>(userDetails);
        }

        [HttpPost]
        public async Task<IActionResult> SaveUserDetails([FromBody] UserDetailsViewModel model)
        {
            var userId = _httpContextAccessor.HttpContext.User.GetLoggedInUserId<string>();
            UserDetails userDetails = _mapper.Map<UserDetails>(model);
            await _userDetailsService.SaveUserDetails(Guid.Parse(userId), userDetails);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> ClearUserDetails()
        {
            var userId = _httpContextAccessor.HttpContext.User.GetLoggedInUserId<string>();
            await _userDetailsService.ClearUserDetails(Guid.Parse(userId));
            return new JsonResult(new { message = "All your saved data was deleted" });
        }
    }
}