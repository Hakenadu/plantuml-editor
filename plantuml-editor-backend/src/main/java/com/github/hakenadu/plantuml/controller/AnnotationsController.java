package com.github.hakenadu.plantuml.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.hakenadu.plantuml.model.Annotation;
import com.github.hakenadu.plantuml.service.AnnotationsService;
import com.github.hakenadu.plantuml.service.exception.ImageServiceException;

@CrossOrigin
@RestController
@RequestMapping("/annotations")
public class AnnotationsController {

	private final AnnotationsService annotationsService;

	public AnnotationsController(final AnnotationsService annotationsService) {
		this.annotationsService = annotationsService;
	}

	@PostMapping
	public List<Annotation> getAnnotations(final @RequestBody(required = false) String source)
			throws ImageServiceException {
		return annotationsService.getAnnotations(source);
	}
}
