using AutoMapper;
using SkinLesSuggest.Models;
using SkinLesSuggest.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkinLesSuggest.Engine
{
    public class DefaultMapper : Profile
    {
        public DefaultMapper()
        {
            CreateMap<UserDetails, UserDetailsViewModel>().ReverseMap();

            CreateMap<LesionViewModel, Lesion>().ReverseMap();
            CreateMap<LesionViewModel, Suggestion>()
                .ForMember(x => x.SuggestionReceived, y => y.MapFrom(h => h.Suggestion))
                .ForMember(x => x.Image, y => y.MapFrom(h => System.Text.Encoding.Unicode.GetBytes(h.Image)));

            CreateMap<Suggestion, SuggestionViewModel>()
                .ForMember(x => x.Suggestion , y => y.MapFrom(h => h.SuggestionReceived))
                .ForMember(x => x.Image, y => y.MapFrom(h => System.Text.Encoding.Unicode.GetString(h.Image)));
        }
    }
}
