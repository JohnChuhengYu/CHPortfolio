using CHPortfolio.Backend.Data;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CHPortfolio.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration, ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        if (string.IsNullOrEmpty(request.IdToken))
        {
            _logger.LogWarning("Google login failed: ID Token is empty.");
            return BadRequest(new { Message = "ID Token is required" });
        }

        try
        {
            // First try to validate as a standard JWT ID Token (if client sent one)
            string userEmail = string.Empty;
            
            try 
            {
                var clientId = _configuration["Authentication:Google:ClientId"];
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
                if (payload != null) {
                    userEmail = payload.Email;
                }
            }
            catch (InvalidJwtException)
            {
                // If it's not a valid JWT (i.e. it's an access_token from useGoogleLogin),
                // fallback to validating via Google's UserInfo endpoint
                _logger.LogInformation("Token is not a valid JWT. Attempting to validate as an access_token via UserInfo endpoint.");
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", request.IdToken);
                var userInfoResponse = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");
                
                if (!userInfoResponse.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Google login failed: Invalid access_token or userinfo request failed.");
                    return Unauthorized(new { Message = "Invalid Google token." });
                }

                var userInfoConfig = await userInfoResponse.Content.ReadFromJsonAsync<GoogleUserInfoResponse>();
                if (userInfoConfig == null || string.IsNullOrEmpty(userInfoConfig.Email))
                {
                    _logger.LogWarning("Google login failed: Could not extract email from userinfo.");
                    return Unauthorized(new { Message = "Invalid Google token." });
                }
                userEmail = userInfoConfig.Email;
            }

            if (string.IsNullOrEmpty(userEmail))
            {
                _logger.LogWarning("Google login failed: Email is empty after validation.");
                return Unauthorized(new { Message = "Invalid Google token." });
            }

            _logger.LogInformation("Google token validated for email: {Email}. Checking if user exists in DB...", userEmail);
            var user = await _userManager.FindByEmailAsync(userEmail);
            
            // If user doesn't exist, we can register them automatically since they are authenticated via Google.
            if (user == null)
            {
                _logger.LogInformation("User {Email} not found. Creating a new account automatically...", userEmail);
                user = new IdentityUser { 
                    UserName = userEmail, 
                    Email = userEmail,
                    EmailConfirmed = true 
                };
                
                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    _logger.LogError("Failed to create user {Email}: {Errors}", userEmail, string.Join(", ", createResult.Errors.Select(e => e.Description)));
                    return StatusCode(500, new { Message = "Failed to create user account." });
                }
            }

            _logger.LogInformation("User {Email} found. Creating signing principal...", userEmail);
            // Create principal and let the BearerToken handler return the token JSON
            var principal = await _signInManager.CreateUserPrincipalAsync(user);
            return SignIn(principal, authenticationScheme: IdentityConstants.BearerScheme);
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogError(ex, "Google login failed: InvalidJwtException thrown.");
            return Unauthorized(new { Message = "Invalid Google token." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Google login failed: General exception thrown.");
            return StatusCode(500, new { Message = "An error occurred during authentication." });
        }
    }
}

public class GoogleLoginRequest
{
    public string IdToken { get; set; } = string.Empty;
}

public class GoogleUserInfoResponse
{
    public string Sub { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool Email_Verified { get; set; }
}
