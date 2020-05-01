
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Models
{
    public class Lesion
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Localization { get; set; }
        public Guid UserId { get; set; }

        public virtual User User { get; set; }
    }
}
