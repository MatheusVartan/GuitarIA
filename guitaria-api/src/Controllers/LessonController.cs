using System.Text;
using System.Text.Json;
using GuitariaApi.Data;
using GuitariaApi.Models;
using GuitariaApi.Services;
using GuitariaApi.Streaming;
using Microsoft.AspNetCore.Mvc;

namespace GuitariaApi.Controllers;

[ApiController]
[Route("lesson")]
public class LessonController(LessonAgentService agentService, AppDbContext db) : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    [HttpPost("run")]
    public async Task Run([FromBody] RunLessonRequest request, CancellationToken ct)
    {
        Response.ContentType = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["X-Accel-Buffering"] = "no";

        var session = request.SessionId.HasValue
            ? await db.LessonSessions.FindAsync([request.SessionId.Value], ct)
            : null;

        var isNew = session is null;
        session ??= new LessonSession();

        var history = JsonSerializer.Deserialize<List<MessageDto>>(session.MessagesJson, JsonOpts) ?? [];

        var messageId = Guid.NewGuid().ToString();
        var fullResponse = new StringBuilder();

        await foreach (var delta in agentService.StreamResponseAsync(request, history, ct))
        {
            fullResponse.Append(delta);
            await Response.WriteAsync(AgUiEvent.TextMessageContent(messageId, delta), ct);
            await Response.Body.FlushAsync(ct);
        }

        history.Add(new MessageDto("user", request.Message));
        history.Add(new MessageDto("assistant", fullResponse.ToString()));
        session.MessagesJson = JsonSerializer.Serialize(history, JsonOpts);

        if (isNew)
            db.LessonSessions.Add(session);

        await db.SaveChangesAsync(ct);

        await Response.WriteAsync(AgUiEvent.RunFinished(session.Id), ct);
        await Response.Body.FlushAsync(ct);
    }
}
