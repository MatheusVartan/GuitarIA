using GuitariaApi.Streaming;
using Microsoft.AspNetCore.Mvc;

namespace GuitariaApi.Controllers;

[ApiController]
[Route("lesson")]
public class LessonController : ControllerBase
{
    [HttpPost("run")]
    public async Task Run(CancellationToken ct)
    {
        Response.ContentType = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["X-Accel-Buffering"] = "no";

        var messageId = Guid.NewGuid().ToString();
        await Response.WriteAsync(AgUiEvent.TextMessageContent(messageId, "olá"), ct);
        await Response.Body.FlushAsync(ct);
        await Response.WriteAsync(AgUiEvent.RunFinished(), ct);
        await Response.Body.FlushAsync(ct);
    }
}
