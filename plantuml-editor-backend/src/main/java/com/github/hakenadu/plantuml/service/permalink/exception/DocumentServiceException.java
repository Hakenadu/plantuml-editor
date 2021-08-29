package com.github.hakenadu.plantuml.service.permalink.exception;

@SuppressWarnings("serial")
public class DocumentServiceException extends Exception {

	public DocumentServiceException(final String message) {
		super(message);
	}

	public DocumentServiceException(final String message, final Throwable cause) {
		super(message, cause);
	}
}
