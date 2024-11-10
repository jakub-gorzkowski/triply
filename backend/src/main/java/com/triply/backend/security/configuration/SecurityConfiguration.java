package com.triply.backend.security.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> {
                    authorize.requestMatchers(
                            HttpMethod.POST,
                            "/api/v1/auth/register",
                            "/api/v1/auth/authenticate"
                    ).permitAll();

                    // User endpoints
                    authorize.requestMatchers(HttpMethod.GET, "/data/uploads/**").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/latest").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/reviews").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/ratings").authenticated();
                    authorize.requestMatchers(HttpMethod.POST, "/api/v1/place/add").authenticated();

                    // Admin endpoints
                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/place/update").authenticated();
                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/place/approve").authenticated();
                    authorize.requestMatchers(HttpMethod.DELETE, "/api/v1/place/remove").authenticated();
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
