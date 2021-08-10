package com.hakenadu.plantuml;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan
public class PlantumlEditorApplication extends SpringApplication {

	public static void main(String[] args) {
		run(PlantumlEditorApplication.class, args);
	}
}
