using GuitariaApi.Services;

namespace GuitariaApi.Tests.Services;

public class LessonAgentServiceTests
{
    [Fact]
    public void BuildSystemPrompt_ContainsFretboardSnapshot()
    {
        const string snapshot = "{\"mode\":\"scale\",\"root\":\"A\"}";
        var result = LessonAgentService.BuildSystemPrompt(snapshot);
        Assert.Contains(snapshot, result);
    }

    [Fact]
    public void BuildSystemPrompt_ContainsCagedReference()
    {
        var result = LessonAgentService.BuildSystemPrompt("{}");
        Assert.Contains("CAGED", result);
    }

    [Fact]
    public void BuildSystemPrompt_IsNotEmpty()
    {
        var result = LessonAgentService.BuildSystemPrompt("{}");
        Assert.NotEmpty(result);
    }
}
