package com.klef.soa.docker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PrintingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrintingServiceApplication.class, args);
		System.out.println("Printing Service is running");
	}

}
