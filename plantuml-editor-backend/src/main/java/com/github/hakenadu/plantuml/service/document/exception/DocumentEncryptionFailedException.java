package com.github.hakenadu.plantuml.service.document.exception;

@SuppressWarnings("serial")
public class DocumentEncryptionFailedException extends DocumentServiceException {

	public DocumentEncryptionFailedException(final String message, final Throwable cause) {
		super(message, cause);
	}
}
