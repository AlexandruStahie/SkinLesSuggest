using Microsoft.EntityFrameworkCore;
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


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) 
        { 

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Test>().ToTable("Tests");
        }
    }
}
