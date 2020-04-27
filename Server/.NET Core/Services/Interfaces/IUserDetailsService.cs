using SkinLesSuggest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Services.Interfaces
{
    public interface IUserDetailsService
    {
        public Task<UserDetails> GetUserDetails(Guid id);
        Task SaveUserDetails(Guid id, UserDetails userDetails);
        Task ClearUserDetails(Guid id);
    }
}
