using CarDepreciationApi.models.dtos;

namespace CarDepreciationApi.services.interfaces;

public interface IUserService
{
    public Task AddUser(Guid userId, string  Email);
}