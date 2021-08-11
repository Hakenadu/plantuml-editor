package com.github.hakenadu.plantuml.service;

import java.util.List;

import com.github.hakenadu.plantuml.model.Annotation;

public interface AnnotationsService {

	public List<Annotation> getAnnotations(String source);
}
