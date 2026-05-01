using GuitariaApi.Streaming;

namespace GuitariaApi.Tests.Streaming;

public class AgUiEventTests
{
    [Fact]
    public void TextMessageContent_FormatsCorrectly()
    {
        var result = AgUiEvent.TextMessageContent("msg-1", "olá");
        Assert.Equal("event: TEXT_MESSAGE_CONTENT\ndata: {\"messageId\":\"msg-1\",\"delta\":\"olá\"}\n\n", result);
    }

    [Fact]
    public void RunFinished_FormatsCorrectly()
    {
        var result = AgUiEvent.RunFinished();
        Assert.Equal("event: RUN_FINISHED\ndata: {}\n\n", result);
    }
}
