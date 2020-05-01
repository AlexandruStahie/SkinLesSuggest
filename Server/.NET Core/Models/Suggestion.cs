using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Models
{
    public class Suggestion
    {
        public Guid Id { get; set; }
        public string SuggestionReceived { get; set; }
        public byte[] Image { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid LesionId { get; set; }

        public virtual Lesion Lesion { get; set; }
    }
}
