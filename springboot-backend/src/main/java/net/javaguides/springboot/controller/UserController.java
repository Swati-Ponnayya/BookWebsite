package net.javaguides.springboot.controller;

import net.javaguides.springboot.model.User;
import net.javaguides.springboot.model.userProfile;
import net.javaguides.springboot.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import net.javaguides.springboot.model.Role;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "Authorization")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public User getUserProfile(@AuthenticationPrincipal Object principal) {
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            // Sometimes JWT filters just set the email directly
            email = (String) principal;
        } else {
            throw new RuntimeException("Invalid user");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
    
    @PostMapping("/update-profile")
    public ResponseEntity<?> updateUserProfile(
    		@AuthenticationPrincipal Object principal,
            @RequestBody userProfile updatedUser) {

        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            // Sometimes JWT filters just set the email directly
            email = (String) principal;
        } else {
            throw new RuntimeException("Invalid user");
        }

        try {
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            
            // Check if updatedUser is null
            if (updatedUser == null) {
                return ResponseEntity.badRequest().body("Invalid update data");
            }
            
            // Check individual fields
            if (updatedUser.getFullName() != null) {
                currentUser.setFullName(updatedUser.getFullName());
            }
            
            if (updatedUser.getPhoneNumber() != null) {
                currentUser.setPhoneNumber(updatedUser.getPhoneNumber());
            }
            
            if (updatedUser.getAddress() != null) {
                currentUser.setAddress(updatedUser.getAddress());
            }
            
            userRepository.save(currentUser);
            return ResponseEntity.ok("User profile updated successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }



    
    @PutMapping("/update-role")
    public User updateUserRole(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body
    ) {
        String email = userDetails.getUsername();
        String newRole = body.get("role");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        try {
            Role roleEnum = Role.valueOf(newRole.toUpperCase());
            user.setRole(roleEnum);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + newRole);
        }

        return userRepository.save(user);
    }

    @GetMapping("/list-user")
    public ResponseEntity<?> getUsersGroupedByRole() {
        try {
            List<User> users = userRepository.findAll();

            Map<Role, List<Map<String, Object>>> grouped = users.stream()
                .collect(Collectors.groupingBy(
                    User::getRole,
                    Collectors.mapping(user -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("fullName", user.getFullName());
                        map.put("email", user.getEmail());
                        map.put("phoneNumber", user.getPhoneNumber());
                        map.put("address", user.getAddress());
                        return map;
                    }, Collectors.toList())
                ));

            // Convert to desired list format
            List<Map<String, Object>> response = grouped.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> roleGroup = new HashMap<>();
                    roleGroup.put("role", entry.getKey().name());
                    roleGroup.put("list", entry.getValue());
                    return roleGroup;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching users: " + e.getMessage());
        }}}
