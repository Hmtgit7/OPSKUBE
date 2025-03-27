package com.opskube.eventmanagement.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class SecurityProperties {
    private String secret;
    private long expiration;
    private String header;
    private String prefix;
}