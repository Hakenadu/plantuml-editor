package com.github.hakenadu.plantuml;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan
public class Application extends SpringApplication {

	public static void main(String[] args) {
		run(Application.class, args);
	}
}
