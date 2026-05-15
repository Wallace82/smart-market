package com.smartmarket.gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .cors(ServerHttpSecurity.CorsSpec::disable) // CORS is configured at Gateway level
            .authorizeExchange(exchanges -> exchanges
                // Public and Management endpoints
                .pathMatchers(HttpMethod.POST, "/api/v1/auth/login", "/api/v1/auth/register").permitAll()
                .pathMatchers("/actuator/**").permitAll()
                .pathMatchers("/api/v1/supermercados/**").permitAll()
                .pathMatchers("/api/v1/users/**").permitAll()
                .pathMatchers("/api/v1/admin/billing/**").permitAll()
                .pathMatchers("/api/v1/subscriptions/**").permitAll()
                .pathMatchers("/api/v1/produtos-base/**").permitAll()
                .pathMatchers("/api/v1/temas-encarte/**").permitAll()
                .pathMatchers("/api/v1/categorias/**").permitAll()
                .anyExchange().permitAll()
            )

            .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .build();
    }
}
