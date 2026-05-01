namespace GuitariaApi.Models;

public record RunLessonRequest(
    string Message,
    string FretboardSnapshot,
    Guid? SessionId = null
);
