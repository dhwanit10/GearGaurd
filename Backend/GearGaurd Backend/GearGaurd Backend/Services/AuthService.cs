using GearGaurd_Backend.Data;
using GearGaurd_Backend.DTOs;
using GearGaurd_Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GearGaurd_Backend.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly SymmetricSecurityKey _securityKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expiryInMinutes;
    private readonly SigningCredentials _signingCredentials;
    private readonly JwtSecurityTokenHandler _tokenHandler;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;

        // Cache JWT configuration to avoid repeated reads
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["Secret"]!;
        _issuer = jwtSettings["Issuer"]!;
        _audience = jwtSettings["Audience"]!;
        _expiryInMinutes = int.Parse(jwtSettings["ExpiryInMinutes"] ?? "1440");

        // Pre-initialize security objects (reusable across requests)
        _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        _signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);
        _tokenHandler = new JwtSecurityTokenHandler();
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto loginRequest)
    {
        // Find user by email with AsNoTracking for faster read-only query
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

        if (user == null)
        {
            return null;
        }

        // Verify password using BCrypt
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password);

        if (!isPasswordValid)
        {
            return null;
        }

        // Generate JWT token (now optimized)
        var token = GenerateJwtToken(user);

        // Return user details without password
        return new LoginResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            UserType = user.UserType,
            Token = token
        };
    }

    public async Task<SignupResponseDto> SignupAsync(SignupRequestDto signupRequest)
    {
        // Check if user already exists - optimized with AsNoTracking and Select
        var emailExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.Email == signupRequest.Email);

        if (emailExists)
        {
            return new SignupResponseDto
            {
                Success = false,
                Message = "User with this email already exists"
            };
        }

        // Hash password using BCrypt
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(signupRequest.Password);

        // Create new user
        var newUser = new User
        {
            Name = signupRequest.Name,
            Email = signupRequest.Email,
            Password = hashedPassword,
            UserType = "User" // Default user type
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return new SignupResponseDto
        {
            Success = true,
            Message = "User registered successfully"
        };
    }

    private string GenerateJwtToken(User user)
    {
        // Use Span<T> for stack allocation and avoid array allocations where possible
        var claims = new Claim[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.UserType),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_expiryInMinutes),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = _signingCredentials
        };

        var token = _tokenHandler.CreateToken(tokenDescriptor);
        return _tokenHandler.WriteToken(token);
    }
}
