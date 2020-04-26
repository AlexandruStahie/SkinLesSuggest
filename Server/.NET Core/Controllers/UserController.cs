using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkinLesSuggest.Models;
using SkinLesSuggest.Services.Implementations;
using SkinLesSuggest.Services.Interfaces;
using SkinLesSuggest.ViewModels;

namespace SkinLesSuggest.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserViewModel model)
        {
            bool emailExists = await _userService.CheckDuplicateEmail(model.Email);
            if (emailExists)
                return new JsonResult(new { error = true, message = "An User already exists with this email!"});

            await _userService.Register(model.Email, model.Password);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] UserViewModel model)
        {
            var user = await _userService.Authenticate(model.Email, model.Password);
            if (user == null)
                return BadRequest(new { message = "Email or password is incorrect" });

            return Ok(user.Token);
        }

        [HttpGet("testAuth")]
        public IActionResult TestAuth()
        {
            return Ok();
        }


        [HttpGet("userDetails/{id:guid}")]
        public async Task<UserDetailsViewModel> GetUserDetails(Guid id)
        {
            UserDetails userDetails = await _userService.GetUserDetails(id);
            if (userDetails == null)
                return null;

            return _mapper.Map<UserDetailsViewModel>(userDetails);
        }

        [HttpPost("userDetails/{id:guid}")]
        public async Task<IActionResult> SaveUserDetails(Guid id, [FromBody] UserDetailsViewModel model)
        {
            UserDetails userDetails = _mapper.Map<UserDetails>(model);
            await _userService.SaveUserDetails(id, userDetails);
            return Ok();
        }

        [HttpDelete("userDetails/{id:guid}")]
        public async Task<IActionResult> ClearUserDetails(Guid id)
        {
            await _userService.ClearUserDetails(id);
            return new JsonResult(new { message = "All your saved data was deleted" });
        }
    }
}