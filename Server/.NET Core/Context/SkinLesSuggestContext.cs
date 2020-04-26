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

        public DbSet<Test> Tests { get; set; }
        public DbSet<TestDetail> TestDetails { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new TestTypeConfig());
            modelBuilder.ApplyConfiguration(new TestDetailTypeConfig());

            modelBuilder.ApplyConfiguration(new UserTypeConfig());
            modelBuilder.ApplyConfiguration(new UserDetailsTypeConfig());
        }
    }
}
