package com.github.hakenadu.plantuml.service.completion;

/**
 * Interface for services which generate completions by using large language
 * models
 */
public interface CompletionService {

	boolean hasApiKey();

	String getCompletion(String originalSpec, String textualDescription, String openAiApiKey);
}
