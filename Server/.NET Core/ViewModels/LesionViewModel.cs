using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.ViewModels
{
    public class LesionViewModel
    {
        public string Name { get; set; }
        public string Localization { get; set; }
        public string Suggestion { get; set; }
        public string Image { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
