using GuitariaApi.Data;
using GuitariaApi.Models;
using GuitariaApi.Services;
using GuitariaApi.Streaming;
using Microsoft.AspNetCore.Mvc;

namespace GuitariaApi.Controllers;

[ApiController]
[Route("lesson")]
public class LessonController(LessonAgentService agentService, SessionStore sessionStore, AppDbContext db) : ControllerBase
{
    [HttpPost("run")]
    public async Task Run([FromBody] RunLessonRequest request, CancellationToken ct)
    {
        Response.ContentType = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["X-Accel-Buffering"] = "no";

        var dbSession = request.SessionId.HasValue
            ? await db.LessonSessions.FindAsync([request.SessionId.Value], ct)
            : null;

        var isNew = dbSession is null;
        dbSession ??= new LessonSession();

        var agentSession = await agentService.GetOrCreateSessionAsync(
            isNew ? null : dbSession.Id, ct);

        if (isNew)
        {
            db.LessonSessions.Add(dbSession);
            await db.SaveChangesAsync(ct);
        }

        sessionStore.Store(dbSession.Id, agentSession);

        var messageId = Guid.NewGuid().ToString();

        await foreach (var delta in agentService.StreamResponseAsync(request, agentSession, ct))
        {
            await Response.WriteAsync(AgUiEvent.TextMessageContent(messageId, delta), ct);
            await Response.Body.FlushAsync(ct);
        }

        await Response.WriteAsync(AgUiEvent.RunFinished(dbSession.Id), ct);
        await Response.Body.FlushAsync(ct);
    }
}
