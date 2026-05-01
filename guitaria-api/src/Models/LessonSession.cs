namespace GuitariaApi.Models;

public class LessonSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string MessagesJson { get; set; } = "[]";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
