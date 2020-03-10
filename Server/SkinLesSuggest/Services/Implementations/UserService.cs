using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SkinLesSuggest.Context;
using SkinLesSuggest.Helpers;
using SkinLesSuggest.Models;
using SkinLesSuggest.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SkinLesSuggest.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly SkinLesSuggestContext _dbContext;
        private readonly AppSettings _appSettings;

        public UserService(SkinLesSuggestContext dbContext, IOptions<AppSettings> appSettings)
        {
            _dbContext = dbContext;
            _appSettings = appSettings.Value;
        }

        public async Task<User> Authenticate(string email, string password)
        {
            List<User> testHardcodedUsers = new List<User>();
            testHardcodedUsers.Add(new User()
                {
                    Id = Guid.NewGuid(),
                    Email = "test@test.com",
                    Password = "test"
                });

            //var user = await _dbContext.Users.SingleOrDefaultAsync(x => x.Email == email && x.Password == password);
            var user = testHardcodedUsers.SingleOrDefault(x => x.Email == email && x.Password == password);
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, user.Email.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user.WithoutPassword();
        }
    }
}
