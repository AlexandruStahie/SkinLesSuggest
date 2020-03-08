using SkinLesSuggest.Context;
using SkinLesSuggest.Models;
using SkinLesSuggest.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Services.Implementations
{
    public class TestService : ITestService
    {
        private readonly SkinLesSuggestContext _dbContext;

        public TestService(SkinLesSuggestContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddTestRecord()
        {
            Test test = new Test() { 
                Id = Guid.NewGuid(),
                MigrationTest = "Test"
            };

            TestDetail testDetail = new TestDetail() { 
                Test = test
            };

            await _dbContext.TestDetails.AddAsync(testDetail);
            await _dbContext.SaveChangesAsync();
        }
    }
}
