package com.github.hakenadu.plantuml.service.completion;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ConditionalOnProperty(prefix = "plantuml-editor.openai", name = "api-key")
@ActiveProfiles("openai")
@SpringBootTest
public class OpenAiChatCompletionServiceTest {

	@Autowired
	private CompletionService completionService;

	@Test
	public void testCompletion() {
		final String completionNewSpec = completionService.getCompletion(null,
				"generate a use case diagram with one actor user who can read data from a database", null);
		assertNotNull(completionNewSpec, "got no completionNewSpec");

		System.out.println(completionNewSpec);

		final String completionChangedSpec = completionService.getCompletion(completionNewSpec,
				"add another function 'drink a beer' for the actor User", null);
		assertNotNull(completionChangedSpec, "got no completionChangedSpec");

		System.out.println(completionChangedSpec);
	}
}
