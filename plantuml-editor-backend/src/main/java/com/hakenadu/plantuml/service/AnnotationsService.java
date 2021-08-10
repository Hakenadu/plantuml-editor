package com.hakenadu.plantuml.service;

import java.util.List;

import com.hakenadu.plantuml.model.Annotation;

public interface AnnotationsService {

	public List<Annotation> getAnnotations(String source);
}
