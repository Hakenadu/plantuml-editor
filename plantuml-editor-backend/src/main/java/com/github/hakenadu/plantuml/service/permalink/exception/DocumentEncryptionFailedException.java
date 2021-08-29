package com.github.hakenadu.plantuml.service.permalink.exception;

@SuppressWarnings("serial")
public class DocumentEncryptionFailedException extends DocumentServiceException {

	public DocumentEncryptionFailedException(final String message, final Throwable cause) {
		super(message, cause);
	}
}
