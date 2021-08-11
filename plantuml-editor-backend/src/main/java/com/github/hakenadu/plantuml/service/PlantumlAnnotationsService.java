package com.github.hakenadu.plantuml.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.github.hakenadu.plantuml.model.Annotation;

import net.sourceforge.plantuml.syntax.SyntaxChecker;
import net.sourceforge.plantuml.syntax.SyntaxResult;

@Service
public class PlantumlAnnotationsService implements AnnotationsService {

	@Override
	public List<Annotation> getAnnotations(final String source) {
		if (source == null) {
			return Collections.emptyList();
		}

		final SyntaxResult result = SyntaxChecker.checkSyntax(source);
		if (!result.isError()) {
			return Collections.emptyList();
		}

		// currently only one annotation is supported
		final String annotationText = result.getErrors().stream().map(String::trim).collect(Collectors.joining("; "));

		return Arrays.asList(new Annotation("error", result.getLineLocation().getPosition(), annotationText));
	}
}
