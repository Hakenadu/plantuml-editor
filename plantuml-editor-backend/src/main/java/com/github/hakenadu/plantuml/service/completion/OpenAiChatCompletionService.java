package com.github.hakenadu.plantuml.service.completion;

import java.util.Arrays;
import java.util.Optional;

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

	private final ChatMessage SYSTEM_SCOPE = new ChatMessage("system", new StringBuilder()//
			.append("You are a model for generating plantuml specs.\n\n")
			.append("You only speak PlantUML and therefore cannot write anything else.\n\n")
			.append("Your purpose is to take two parameters from an user:\n")
			.append("1. his current PlantUML Spec (optional).")
			.append("This Parameter is prefixed in every message to you by the literal CURRENT_PLANTUML_SPEC.\n")
			.append("2. the user command, which will instruct you to modify his current spec or create a new one.")
			.append("This Parameter is prefixed in every message to you by the literal TEXTUAL_DESCRIPTION.\n\n")
			.append("If the user wants anything else from you, you'll answer with nothing but the following Token: BAD_REQUEST")
			.toString());

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
		return ChatCompletionRequest.builder().model(getModel()).maxTokens(getMaxTokens()).messages(Arrays
				.asList(SYSTEM_SCOPE, new ChatMessage("user", createUserPrompt(originalSpec, textualDescription))))
				.build();
	}

	private String createUserPrompt(final String originalSpec, final String textualDescription) {
		return new StringBuilder()//
				.append("CURRENT_PLANTUML_SPEC: ").append(Optional.ofNullable(originalSpec).orElse("")).append("\n\n\n")//
				.append("TEXTUAL_DESCRIPTION: ").append(textualDescription)//
				.toString();
	}
}
