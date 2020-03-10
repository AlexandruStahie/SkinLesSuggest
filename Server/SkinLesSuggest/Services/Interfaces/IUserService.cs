using SkinLesSuggest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Services.Interfaces
{
    public interface IUserService
    {
        public Task<User> Authenticate(string email, string password);
    }
}
