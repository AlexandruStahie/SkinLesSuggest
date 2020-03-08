using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Models
{
    public class TestDetail
    {
        public Guid Id { get; set; }
        public Guid TestId { get; set; }

        public virtual Test Test { get; set; }
    }
}
