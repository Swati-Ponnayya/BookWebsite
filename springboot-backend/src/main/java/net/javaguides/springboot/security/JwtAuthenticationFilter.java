package net.javaguides.springboot.security;

import org.springframework.stereotype.Component;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.javaguides.springboot.model.JwtUtil;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
    	String authHeader = request.getHeader("Authorization");
//    	System.out.println("Authorization header: " + authHeader);
    	
    	if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    	    chain.doFilter(request, response);
    	    return;
    	}

    	String token = authHeader.substring(7);
    	System.out.println("Token extracted: " + token);
        
        try {
        	String email = jwtUtil.extractEmail(token);
//            System.out.println("Email extracted from token: " + email);
            
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);  // Load user details by email

                boolean isValid = jwtUtil.validateToken(token, userDetails);
//            	System.out.println("Token valid: " + isValid);
                if (jwtUtil.isTokenExpired(token)) {
                    System.out.println("Token is expired");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Token expired");
                    return;
                }

            
//                 System.out.println("UserDetails loaded: " + userDetails);
                
                // Validate the token and check for expiration
                if (jwtUtil.validateToken(token, userDetails) && !jwtUtil.isTokenExpired(token)) {
                    // If valid, set authentication context for the user
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid or expired token");
                    return;  // Early exit if token is invalid or expired
                }
            }

        } catch (Exception e) {
            // Handle any exceptions related to token parsing or validation
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authorization failed: " + e.getMessage());
            return;  // Early exit if there is any issue
        }

        // Continue with the request chain
        chain.doFilter(request, response);
    }
}
