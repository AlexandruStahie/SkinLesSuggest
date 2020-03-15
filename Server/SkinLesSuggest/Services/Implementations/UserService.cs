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
using System.Security.Cryptography;
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

        public async Task<bool> CheckDuplicateEmail(string email)
        {
            return await _dbContext.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }

        public async Task Register(string email, string password)
        {
            string hashedPass = getHashedPassword(password);
            User user = new User()
            {
                Email = email,
                Password = hashedPass
            };

            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<User> Authenticate(string email, string password)
        {
            User user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return null;

            byte[] hashBytes = Convert.FromBase64String(user.Password);
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(20);
            for (int i = 0; i < 20; i++)
                if (hashBytes[i + 16] != hash[i])
                    return null;
            
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]{ new Claim(ClaimTypes.Email, user.Email.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user.WithoutPassword();
        }

        private string getHashedPassword(string originalPass)
        {
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            var pbkdf2 = new Rfc2898DeriveBytes(originalPass, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(20);

            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);

            return Convert.ToBase64String(hashBytes);
        }
    }
}
