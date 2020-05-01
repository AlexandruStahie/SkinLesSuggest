using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinLesSuggest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Context.Configurations
{
    public class SuggestionTypeConfig : IEntityTypeConfiguration<Suggestion>
    {
        public void Configure(EntityTypeBuilder<Suggestion> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Lesion)
              .WithMany()
              .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
