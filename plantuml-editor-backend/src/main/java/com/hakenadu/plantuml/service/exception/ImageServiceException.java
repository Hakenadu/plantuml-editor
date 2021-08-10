package com.hakenadu.plantuml.service.exception;

@SuppressWarnings("serial")
public class ImageServiceException extends Exception {

	public ImageServiceException(final String message) {
		super(message);
	}

	public ImageServiceException(final String message, final Throwable cause) {
		super(message, cause);
	}
}
