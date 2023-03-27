package com.github.hakenadu.plantuml.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.theokanning.openai.service.OpenAiService;

/**
 * Configuration for the community maintained <a href=
 * "https://github.com/TheoKanning/openai-java/blob/main/client/src/main/java/com/theokanning/openai/OpenAiApi.java">OpenAiApi</a>
 */
@Profile("completion")
@ConditionalOnProperty(prefix = "plantuml-editor.openai", name = "api-key")
@Configuration
public class OpenAiConfig {

	@Bean
	public OpenAiService openAiApi(final @Value("${plantuml-editor.openai.api-key}") String openAiApiKey) {
		return new OpenAiService(openAiApiKey);
	}
}
