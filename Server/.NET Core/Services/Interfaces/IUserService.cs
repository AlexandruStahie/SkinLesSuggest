using SkinLesSuggest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Services.Interfaces
{
    public interface IUserService
    {
        public Task<bool> CheckDuplicateEmail(string email);
        public Task Register(string email, string password);
        public Task<User> Authenticate(string email, string password);
    }
}
