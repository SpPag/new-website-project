using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GuitarLessons.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GuitarLessons.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Video> Videos { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example: Video.Price precision
            modelBuilder.Entity<Video>()
                .Property(v => v.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Order>()
       .Property(o => o.Amount)
       .HasColumnType("decimal(18,2)");
        }
    }
}
