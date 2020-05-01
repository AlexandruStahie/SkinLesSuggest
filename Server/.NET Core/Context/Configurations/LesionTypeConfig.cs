using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinLesSuggest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Context.Configurations
{
    public class LesionTypeConfig : IEntityTypeConfiguration<Lesion>
    {
        public void Configure(EntityTypeBuilder<Lesion> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.User)
              .WithMany()
              .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
