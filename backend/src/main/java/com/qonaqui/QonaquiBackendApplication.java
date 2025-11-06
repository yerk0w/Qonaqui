package com.qonaqui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.qonaqui.security.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class QonaquiBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(QonaquiBackendApplication.class, args);
    }
}