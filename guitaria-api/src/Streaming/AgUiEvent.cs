namespace GuitariaApi.Streaming;

public static class AgUiEvent
{
    public static string TextMessageContent(string messageId, string delta) =>
        $"event: TEXT_MESSAGE_CONTENT\ndata: {{\"messageId\":\"{messageId}\",\"delta\":\"{delta}\"}}\n\n";

    public static string RunFinished(Guid? sessionId = null) =>
        sessionId.HasValue
            ? $"event: RUN_FINISHED\ndata: {{\"sessionId\":\"{sessionId}\"}}\n\n"
            : "event: RUN_FINISHED\ndata: {}\n\n";
}
