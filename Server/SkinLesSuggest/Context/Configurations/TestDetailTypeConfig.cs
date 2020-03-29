using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkinLesSuggest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Context.Configurations
{
    public class TestDetailTypeConfig : IEntityTypeConfiguration<TestDetail>
    {
        public void Configure(EntityTypeBuilder<TestDetail> builder)
        {
            builder.HasKey(x => x.Id);
            builder
                .HasOne(x => x.Test)
                .WithOne()
                .HasForeignKey<TestDetail>(x => x.TestId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
