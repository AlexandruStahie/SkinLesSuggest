using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkinLesSuggest.Services.Interfaces;

namespace SkinLesSuggest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ITestService _testService;

        public TestController(ITestService testService)
        {
            _testService = testService;
        }

        [HttpGet]
        [Route("test")]
        public async Task<ActionResult> Test()
        {
            await _testService.AddTestRecord();
            return Ok();
        }
    }
}