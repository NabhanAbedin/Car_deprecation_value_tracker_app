using CarDepreciationApi.models.dtos;
using Microsoft.AspNetCore.Mvc;
using CarDepreciationApi.services.interfaces;

namespace CarDepreciationApi.controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService, IWebHostEnvironment env)
    {
        _userService = userService;
        _env = env;
    }

    [HttpPost]
    public async Task<IActionResult> AddUser([FromBody] NewUserDto newUserDto)
    {
        if (!_env.IsDevelopement()) return NotFound();

        var userId = Guid.Parse(newUserDto.UserId);

        await _userService.AddUser(userId, newUserDto.Email);

        return Ok();

    }
}






