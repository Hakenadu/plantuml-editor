package com.github.hakenadu.plantuml.service.permalink.exception;

@SuppressWarnings("serial")
public class DocumentNotFoundException extends DocumentServiceException {

	public DocumentNotFoundException(final String message) {
		super(message);
	}
}
