package com.example.Heritage_Slabs.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. Avatar Configuration
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("file:uploads/avatars/");

        // 2. Product Images Configuration (Fix applied here)
        registry.addResourceHandler("/product-images/**")
                .addResourceLocations("file:uploads/products/");
    }
}