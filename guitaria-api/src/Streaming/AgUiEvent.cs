using System.Text.Encodings.Web;
using System.Text.Json;

namespace GuitariaApi.Streaming;

public static class AgUiEvent
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    public static string TextMessageContent(string messageId, string delta) =>
        $"event: TEXT_MESSAGE_CONTENT\ndata: {{\"messageId\":\"{messageId}\",\"delta\":{JsonSerializer.Serialize(delta, JsonOpts)}}}\n\n";

    public static string RunFinished(Guid? sessionId = null) =>
        sessionId.HasValue
            ? $"event: RUN_FINISHED\ndata: {{\"sessionId\":\"{sessionId}\"}}\n\n"
            : "event: RUN_FINISHED\ndata: {}\n\n";
}
