using Microsoft.EntityFrameworkCore;
using SkinLesSuggest.Context;
using SkinLesSuggest.Models;
using SkinLesSuggest.Services.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Services.Implementations
{
    public class UserDetailsService : IUserDetailsService
    {
        private readonly SkinLesSuggestContext _dbContext;

        public UserDetailsService(SkinLesSuggestContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UserDetails> GetUserDetails(Guid id)
        {
            User user = await _dbContext.Users.Where(x => x.Id == id).Include(x => x.UserDetails).FirstOrDefaultAsync();
            if (user == null)
                return null;

            else return user.UserDetails;
        }
        public async Task SaveUserDetails(Guid id, UserDetails userDetails)
        {
            User user = await _dbContext.Users.Where(x => x.Id == id).Include(x => x.UserDetails).FirstOrDefaultAsync();
            if (user != null)
            {
                if (user.UserDetails == null)
                {
                    UserDetails details = new UserDetails() { Id = Guid.NewGuid() };
                    user.UserDetailsId = details.Id;
                    user.UserDetails = details;
                }
   
                user.UserDetails.FirstName = userDetails.FirstName;
                user.UserDetails.LastName = userDetails.LastName;
                user.UserDetails.Age = userDetails.Age;
                user.UserDetails.Gender = userDetails.Gender;

                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();
            }
        }
        public async Task ClearUserDetails(Guid id)
        {
            User user = await _dbContext.Users.Where(x => x.Id == id).Include(x => x.UserDetails).FirstOrDefaultAsync();
            user.UserDetails = null;
            user.UserDetailsId = null;
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();
        }
    }
}
