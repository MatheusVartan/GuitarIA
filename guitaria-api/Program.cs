using GuitariaApi.Data;
using GuitariaApi.Tools;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddSingleton<IEnumerable<ILessonTool>>([]);

var app = builder.Build();

app.MapControllers();
app.Run();
