package com.example.Heritage_Slabs.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. Avatar Configuration
        // Maps http://localhost:8080/avatars/** -> uploads/avatars/
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("file:uploads/avatars/");

        // 2. Product Images Configuration
        // Using absolute path for better reliability across different OS environments
        Path productUploadDir = Paths.get("uploads/products");
        String productUploadPath = productUploadDir.toFile().getAbsolutePath();

        // Maps http://localhost:8080/product-images/** -> uploads/products/
        registry.addResourceHandler("/product-images/**")
                .addResourceLocations("file:" + productUploadPath + "/");
    }
}