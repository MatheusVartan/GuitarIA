using GuitariaApi.Data;
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
    new OpenAIClient(builder.Configuration["OpenAI:ApiKey"]!)
        .GetChatClient("gpt-4o-mini")
        .AsIChatClient());

var app = builder.Build();

app.MapControllers();
app.Run();
