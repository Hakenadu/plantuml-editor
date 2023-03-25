package com.github.hakenadu.plantuml.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.hakenadu.plantuml.service.completion.CompletionService;

/**
 * Uses the OpenAI ChatGPT API to generate and modify PlantUML Specs using Large
 * Language Models. To access the API we use the Library suggested by <a href=
 * "https://platform.openai.com/docs/libraries/community-libraries">OpenAI</a>
 * for Java: <a href=
 * "https://github.com/TheoKanning/openai-java">TheoKanning/openai-java</a>
 */
@CrossOrigin
@RestController
@RequestMapping("/completions")
public class CompletionsController {

	@Autowired
	private CompletionService completionService;

	@GetMapping
	public boolean apiKeyConfiguredTrue() {
		return completionService.hasApiKey();
	}

	@PostMapping
	public String complete(final @RequestBody Map<String, String> body) {
		final String originalSpec = body.get("originalSpec");
		final String textualDescription = body.get("textualDescription");
		final String openAiApiKey = body.get("openAiApiKey");
		return completionService.getCompletion(originalSpec, textualDescription, openAiApiKey);
	}
}
