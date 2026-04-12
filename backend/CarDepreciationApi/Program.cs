using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Logging;
using CarDepreciationApi.data;
using CarDepreciationApi.services.implementations;
using CarDepreciationApi.services.interfaces;
using Microsoft.EntityFrameworkCore;
using Amazon.Lambda;
using Amazon;

IdentityModelEventSource.ShowPII = true;
IdentityModelEventSource.LogCompleteSecurityArtifact = true;

var builder = WebApplication.CreateBuilder(args);

//var key = Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]);

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Authority = $"https://cognito-idp.{builder.Configuration["AWS:Region"]}.amazonaws.com/{builder.Configuration["AWS:UserPoolId"]}";
        options.Audience = builder.Configuration["AWS:ClientId"];
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            RoleClaimType = "cognito:groups",
            NameClaimType = "sub"
        };
    });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<CarDepreciationAppContext>(options => 
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions => npgsqlOptions.UseVector()
        )
);

builder.Services.AddScoped<IValuationService, ValuationService>();
builder.Services.AddScoped<IMarketService, MarketService>();
builder.Services.AddScoped<ICalculationService, CalcluationService>();
builder.Services.AddSingleton<IAmazonLambda>(new AmazonLambdaClient(RegionEndpoint.USEast1));

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddScoped<IKnnService, DevKnnService>();
    builder.Services.AddScoped<IUserService, UserService>();
}
else
{
    builder.Services.AddScoped<IKnnService, ProdKnnService>();
}

var app = builder.Build();

if (app.Environment.IsDevelopment()) 
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CarDepreciationAppContext>();
    db.Database.Migrate();
}


if (!app.Environment.IsDevelopment())
{
    app.UseMiddleware<CarDepreciationApi.middleware.GatewaySecretMiddleware>();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

