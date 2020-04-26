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
            CreateMap<UserDetails, UserDetailsViewModel>().ReverseMap();
        }
    }
}
