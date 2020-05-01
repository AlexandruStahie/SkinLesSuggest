using Microsoft.EntityFrameworkCore;
using SkinLesSuggest.Context.Configurations;
using SkinLesSuggest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkinLesSuggest.Context
{
    public class SkinLesSuggestContext : DbContext
    {
        public SkinLesSuggestContext(DbContextOptions<SkinLesSuggestContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Lesion> Lesions { get; set; }
        public DbSet<Suggestion> Suggestions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserTypeConfig());
            modelBuilder.ApplyConfiguration(new UserDetailsTypeConfig());
            modelBuilder.ApplyConfiguration(new LesionTypeConfig());
            modelBuilder.ApplyConfiguration(new SuggestionTypeConfig());
        }
    }
}
