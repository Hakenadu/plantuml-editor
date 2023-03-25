package com.github.hakenadu.plantuml.service.completion;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

	private static final Pattern PLANTUML_CUT_PATTERN = Pattern.compile(
			".*(@start(?:[a-z]+)(?:.*)@end(?:[a-z]+))(?:\\s|\\t|\\r|\\n|$).*",
			Pattern.DOTALL | Pattern.CASE_INSENSITIVE);

	@Autowired(required = false)
	private OpenAiService openAiService;

	@Value("${plantuml-editor.openai.model}")
	private String model;

	@Value("${plantuml-editor.openai.max-tokens}")
	private int maxTokens;

	protected abstract String getCompletion(final OpenAiService openAiService, final String originalSpec,
			final String textualDescription);

	@Override
	public boolean hasApiKey() {
		return openAiService != null;
	}

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

		final Matcher matcher = PLANTUML_CUT_PATTERN.matcher(completion);
		if (!matcher.matches()) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return matcher.group(1);
	}

	protected final String getModel() {
		return model;
	}

	protected final int getMaxTokens() {
		return maxTokens;
	}
}
