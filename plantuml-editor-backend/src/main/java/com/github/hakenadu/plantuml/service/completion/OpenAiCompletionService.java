package com.github.hakenadu.plantuml.service.completion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.theokanning.openai.service.OpenAiService;

/**
 * Abstract base class for {@link CompletionService} implementations using the
 * OpenAI API
 */
public abstract class OpenAiCompletionService implements CompletionService {

	private static final String CODE_START_END_SEQUENCE = "```";

	@Autowired(required = false)
	private OpenAiService openAiService;

	@Value("${plantuml-editor.openai.model}")
	private String model;

	@Value("${plantuml-editor.openai.max-tokens}")
	private int maxTokens;

	protected abstract String getCompletion(final OpenAiService openAiService, final String originalSpec,
			final String textualDescription);

	@Override
	public String getCompletion(final String originalSpec, final String textualDescription, final String openAiApiKey) {
		final OpenAiService openAiService;
		if (this.openAiService != null) {
			openAiService = this.openAiService;
		} else {
			if (openAiApiKey != null) {
				openAiService = new OpenAiService(openAiApiKey);
			} else {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "no OPENAI_API_KEY");
			}
		}
		final String completion = getCompletion(openAiService, originalSpec, textualDescription);
		if (completion.contains(CODE_START_END_SEQUENCE)) {
			final int startIndex = completion.indexOf(CODE_START_END_SEQUENCE + CODE_START_END_SEQUENCE.length());
			final String completionFromStartIndex = completion.substring(startIndex);

			// we do it that way to prevent a response with multiple code fragments
			final int endIndex = completionFromStartIndex.indexOf(CODE_START_END_SEQUENCE);
			return completionFromStartIndex.substring(0, endIndex);
		}
		return completion;
	}

	protected final String getModel() {
		return model;
	}

	protected final int getMaxTokens() {
		return maxTokens;
	}
}
