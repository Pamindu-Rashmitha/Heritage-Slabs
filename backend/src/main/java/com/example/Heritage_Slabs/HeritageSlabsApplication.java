package com.example.Heritage_Slabs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // <-- NEW IMPORT

@SpringBootApplication
@EnableScheduling // <-- NEW: Enables Spring Boot's background task scheduler
public class HeritageSlabsApplication {

	public static void main(String[] args) {
		SpringApplication.run(HeritageSlabsApplication.class, args);
	}

}