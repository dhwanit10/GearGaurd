using GearGaurd_Backend.DTOs;

namespace GearGaurd_Backend.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto loginRequest);
    Task<SignupResponseDto> SignupAsync(SignupRequestDto signupRequest);
}
