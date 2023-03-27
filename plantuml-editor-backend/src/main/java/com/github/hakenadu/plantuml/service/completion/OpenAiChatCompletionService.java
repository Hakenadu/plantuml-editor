package com.github.hakenadu.plantuml.service.completion;

import java.util.Arrays;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

/**
 * Abstract base class for {@link CompletionService} implementations using the
 * OpenAI API
 */
@ConditionalOnProperty(prefix = "plantuml-editor.openai", name = "chat", havingValue = "true", matchIfMissing = false)
@Service
@Profile("completion")
public class OpenAiChatCompletionService extends OpenAiCompletionService {

	private static final String CURRENT_PLANTUML_SPEC_PLACEHOLDER = "%currentPlantumlSpec";
	private static final String TEXTUAL_DESCRIPTION_PLACEHOLDER = "%textualDescription";

	private final ChatMessage systemScopeMessage;
	private final String promptPattern;

	public OpenAiChatCompletionService(final @Value("${plantuml-editor.openai.system-scope}") String systemScope,
			final @Value("${plantuml-editor.openai.prompt-pattern}") String promptPattern) {
		this.systemScopeMessage = new ChatMessage("system", systemScope);

		if (!promptPattern.contains(CURRENT_PLANTUML_SPEC_PLACEHOLDER)) {
			throw new IllegalArgumentException(CURRENT_PLANTUML_SPEC_PLACEHOLDER + " missing in prompt-pattern");
		}

		if (!promptPattern.contains(TEXTUAL_DESCRIPTION_PLACEHOLDER)) {
			throw new IllegalArgumentException(TEXTUAL_DESCRIPTION_PLACEHOLDER + " missing in prompt-pattern");
		}

		this.promptPattern = promptPattern;
	}

	@Override
	protected String getCompletion(final OpenAiService openAiService, final String originalSpec,
			final String textualDescription) {
		final ChatCompletionRequest chatCompletionRequest = createChatCompletionRequest(originalSpec,
				textualDescription);

		final ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(chatCompletionRequest);

		/*
		 * not really safe and many implications ... but many python examples work
		 * exactly like this so it should be okay ^^
		 */
		return chatCompletionResult.getChoices().get(0).getMessage().getContent();
	}

	private ChatCompletionRequest createChatCompletionRequest(final String originalSpec,
			final String textualDescription) {
		return ChatCompletionRequest.builder().model(getModel()).maxTokens(getMaxTokens())
				.messages(Arrays.asList(systemScopeMessage,
						new ChatMessage("user", createUserPrompt(originalSpec, textualDescription))))
				.build();
	}

	private String createUserPrompt(final String originalSpec, final String textualDescription) {
		final String currentPlantumlSpec = Optional.ofNullable(originalSpec).orElse("");
		final String userPrompt = promptPattern.replaceAll(CURRENT_PLANTUML_SPEC_PLACEHOLDER, currentPlantumlSpec)
				.replaceAll(TEXTUAL_DESCRIPTION_PLACEHOLDER, textualDescription);
		return userPrompt;
	}
}
