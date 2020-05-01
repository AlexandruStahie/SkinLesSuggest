using SkinLesSuggest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Services.Interfaces
{
    public interface ILesionService
    {
        Task SaveLesionDetails(Lesion lesion, Suggestion suggestion);
        Task<List<Lesion>> GetAllUserLesions(Guid userId);
        Task<List<Suggestion>> GetLesionSuggestions(Guid lesionId);
    }
}
