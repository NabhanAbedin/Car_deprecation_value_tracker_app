using CarDepreciationApi.data;
using CarDepreciationApi.models.dtos;
using CarDepreciationApi.models.entities;
using CarDepreciationApi.services.interfaces;

namespace CarDepreciationApi.services.implementations;

public class UserService : IUserService
{
    private readonly CarDepreciationAppContext _context;

    public UserService(CarDepreciationAppContext context)
    {
        _context = context;
    }

    public async Task AddUser(Guid userId, string Email)
    {
        var user = new User
        {
            Id = userId,
            Email = Email,
            CreatedAt = DateTime.UtcNow,
        };

        _context.User.Add(user);

        await _context.SaveChangesAsync();
    }
}