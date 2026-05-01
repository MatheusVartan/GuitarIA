using GuitariaApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GuitariaApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<LessonSession> LessonSessions => Set<LessonSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LessonSession>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.MessagesJson).HasColumnName("messages").HasColumnType("jsonb");
        });
    }
}
