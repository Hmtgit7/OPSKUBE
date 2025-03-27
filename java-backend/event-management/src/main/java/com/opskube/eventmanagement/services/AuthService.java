package com.opskube.eventmanagement.services;

import com.opskube.eventmanagement.dto.AuthDto.AuthResponse;
import com.opskube.eventmanagement.dto.AuthDto.LoginRequest;
import com.opskube.eventmanagement.dto.AuthDto.RegisterRequest;
import com.opskube.eventmanagement.dto.UserDto;
import com.opskube.eventmanagement.exception.BadRequestException;
import com.opskube.eventmanagement.exception.ResourceNotFoundException;
import com.opskube.eventmanagement.model.User;
import com.opskube.eventmanagement.repository.UserRepository;
import com.opskube.eventmanagement.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        // Save user
        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(mapToUserDetails(user));

        // Create DTO for response
        UserDto userDto = mapToUserDto(user);

        // Return AuthResponse
        return AuthResponse.builder()
                .message("User registered successfully")
                .user(userDto)
                .token(token)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Generate JWT token
        String token = jwtUtil.generateToken(mapToUserDetails(user));

        // Create DTO for response
        UserDto userDto = mapToUserDto(user);

        // Return AuthResponse
        return AuthResponse.builder()
                .message("Login successful")
                .user(userDto)
                .token(token)
                .build();
    }

    public UserDto getCurrentUser() {
        // Get currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        // Find user by email
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        // Map to DTO and return
        return mapToUserDto(user);
    }

    // Helper methods
    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private UserDetails mapToUserDetails(User user) {
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();
    }
}