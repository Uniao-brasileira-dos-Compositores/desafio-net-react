using Microsoft.EntityFrameworkCore;
using StudentManager.Api.Models;

namespace StudentManager.Api.Entity
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Student> Students { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
