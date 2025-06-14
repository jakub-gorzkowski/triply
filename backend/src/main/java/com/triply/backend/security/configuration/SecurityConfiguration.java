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
        httpSecurity
                .cors(cors -> cors.configure(httpSecurity))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> {
                    authorize.requestMatchers(
                            HttpMethod.POST,
                            "/api/v1/auth/register",
                            "/api/v1/auth/authenticate"
                    ).permitAll();

                    // User endpoints
                    authorize.requestMatchers(HttpMethod.GET, "/data/uploads/**").authenticated();

                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/**").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/latest").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/popular").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/reviews").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/search").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/ratings").authenticated();
                    authorize.requestMatchers(HttpMethod.POST, "/api/v1/place/add").authenticated();
                    authorize.requestMatchers(HttpMethod.POST, "/api/v1/review/add").authenticated();

                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/user/update").authenticated();

                    authorize.requestMatchers(HttpMethod.POST, "/api/v1/todo/add").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/todo").authenticated();
                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/todo/toggle").authenticated();

                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/trip/**").authenticated();
                    authorize.requestMatchers(HttpMethod.POST, "/api/v1/trip/add").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/trip/upcoming").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/trip/past").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/trip/next").authenticated();
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/trip/places").authenticated();
                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/trip/update").authenticated();
                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/trip/add-place").authenticated();
                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/trip/remove-place").authenticated();
                    authorize.requestMatchers(HttpMethod.DELETE, "/api/v1/trip/remove").authenticated();

                    // Admin endpoints
                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/place/update").hasRole("ADMIN");
                    authorize.requestMatchers(HttpMethod.GET, "/api/v1/place/unapproved").hasRole("ADMIN");
                    authorize.requestMatchers(HttpMethod.PATCH, "/api/v1/place/approve").hasRole("ADMIN");
                    authorize.requestMatchers(HttpMethod.DELETE, "/api/v1/place/remove").hasRole("ADMIN");
                    authorize.requestMatchers(HttpMethod.DELETE, "/api/v1/review/remove").hasRole("ADMIN");
                    authorize.requestMatchers(HttpMethod.DELETE, "/api/v1/user/delete").hasRole("ADMIN");
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
