using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.ViewModels
{
    public class SuggestionViewModel
    {
        public string Suggestion { get; set; }
        public string Image { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
