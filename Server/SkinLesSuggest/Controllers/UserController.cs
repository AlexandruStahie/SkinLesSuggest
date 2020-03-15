using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public UserController(IUserService userService)
        {
            _userService = userService;
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

            return Ok(user);
        }

        [HttpGet("testAuth")]
        public IActionResult TestAuth()
        {
             List<User> users = new List<User>
            {
                new User { Id = Guid.NewGuid(), Email = "Test1", Password = "test1"},
                new User { Id = Guid.NewGuid(), Email = "Test2", Password = "test2"},
            };

            return Ok(users);
        }
    }
}