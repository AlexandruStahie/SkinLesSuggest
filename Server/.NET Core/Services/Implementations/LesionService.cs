using SkinLesSuggest.Context;
using SkinLesSuggest.Models;
using SkinLesSuggest.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Services.Implementations
{
    public class LesionService : ILesionService
    {
        private readonly SkinLesSuggestContext _dbContext;

        public LesionService(SkinLesSuggestContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task SaveLesionDetails(Lesion lesion, Suggestion suggestion)
        {
            await _dbContext.Lesions.AddAsync(lesion);
            await _dbContext.Suggestions.AddAsync(suggestion);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Lesion>> GetAllUserLesions(Guid userId)
        {
            return new List<Lesion>();
        }
    }
}
