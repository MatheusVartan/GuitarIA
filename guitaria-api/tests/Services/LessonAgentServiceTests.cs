using GuitariaApi.Services;

namespace GuitariaApi.Tests.Services;

public class LessonAgentServiceTests
{
    [Fact]
    public void PhilosophyInstructions_ContainsCagedReference()
    {
        Assert.Contains("CAGED", LessonAgentService.PhilosophyInstructions);
    }

    [Fact]
    public void PhilosophyInstructions_IsNotEmpty()
    {
        Assert.NotEmpty(LessonAgentService.PhilosophyInstructions);
    }

    [Fact]
    public void FormatUserMessage_ContainsFretboardSnapshot()
    {
        const string snapshot = "{\"mode\":\"scale\",\"root\":\"A\"}";
        var result = LessonAgentService.FormatUserMessage(snapshot, "test message");
        Assert.Contains(snapshot, result);
    }

    [Fact]
    public void FormatUserMessage_ContainsUserMessage()
    {
        var result = LessonAgentService.FormatUserMessage("{}", "What is pentatonic?");
        Assert.Contains("What is pentatonic?", result);
    }
}
