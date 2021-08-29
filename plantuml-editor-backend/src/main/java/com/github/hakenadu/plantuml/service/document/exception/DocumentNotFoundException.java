package com.github.hakenadu.plantuml.service.document.exception;

@SuppressWarnings("serial")
public class DocumentNotFoundException extends DocumentServiceException {

	public DocumentNotFoundException(final String message) {
		super(message);
	}
}
