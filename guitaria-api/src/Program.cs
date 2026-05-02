using GuitariaApi.Data;
using GuitariaApi.Services;
using GuitariaApi.Tools;
using Microsoft.Agents.AI;
using Microsoft.EntityFrameworkCore;
using OpenAI;
using OpenAI.Chat;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddSingleton<IEnumerable<ILessonTool>>([]);
builder.Services.AddSingleton<AIAgent>(_ =>
    new OpenAIClient(
        new System.ClientModel.ApiKeyCredential(builder.Configuration["Gemini:ApiKey"]!),
        new OpenAIClientOptions { Endpoint = new Uri("https://generativelanguage.googleapis.com/v1beta/openai/") }
    )
    .GetChatClient("gemini-1.5-flash")
    .AsAIAgent(new ChatClientAgentOptions
    {
        ChatOptions = new() { Instructions = LessonAgentService.PhilosophyInstructions },
        ChatHistoryProvider = new InMemoryChatHistoryProvider()
    }));
builder.Services.AddSingleton<SessionStore>();
builder.Services.AddScoped<LessonAgentService>();

var app = builder.Build();

app.MapControllers();
app.Run();
