using AutoMapper;
using SkinLesSuggest.Models;
using SkinLesSuggest.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Engine
{
    public class DefaultMapper : Profile
    {
        public DefaultMapper()
        {
            int result;

            CreateMap<UserDetails, UserDetailsViewModel>().ReverseMap();


            //    .ForMember(x => x.Age, y => y.MapFrom(h => h.Age.ToString()));

            //CreateMap<UserDetailsViewModel, UserDetails>()
            //  .ForMember(x => x.Age, y => y.MapFrom(h => 
            //    string.IsNullOrEmpty(h.Age) || string.IsNullOrWhiteSpace(h.Age) || int.TryParse(h.Age, out result) == false 
            //        ? 0 
            //        : int.Parse(h.Age)
            //  ));
        }
    }
}
