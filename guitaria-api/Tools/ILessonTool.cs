using System.Text.Json;

namespace GuitariaApi.Tools;

public interface ILessonTool
{
    string Name { get; }
    string Description { get; }
    Task<object> ExecuteAsync(JsonElement args, CancellationToken ct);
}
