using GuitariaApi.Data;
using GuitariaApi.Services;
using GuitariaApi.Tools;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using OpenAI;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddSingleton<IEnumerable<ILessonTool>>([]);
builder.Services.AddSingleton<IChatClient>(_ =>
    new OpenAIClient(
        new System.ClientModel.ApiKeyCredential(builder.Configuration["Gemini:ApiKey"]!),
        new OpenAIClientOptions { Endpoint = new Uri("https://generativelanguage.googleapis.com/v1beta/openai/") }
    )
    .GetChatClient("gemini-2.0-flash")
    .AsIChatClient());
builder.Services.AddScoped<LessonAgentService>();

var app = builder.Build();

app.MapControllers();
app.Run();
