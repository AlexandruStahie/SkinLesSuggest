using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Guid? UserDetailsId { get; set; }


        public virtual UserDetails UserDetails { get; set; }


        [NotMapped]
        public string Token { get; set; }
    }
}
