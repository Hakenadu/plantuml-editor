package com.github.hakenadu.plantuml.model;

import java.time.LocalDateTime;

public final class LocalDocument extends DocumentMetaData {

	private final String content;

	public LocalDocument(final String content, final String documentName, final LocalDateTime creationDate) {
		super(documentName, creationDate);
		this.content = content;
	}

	public String getContent() {
		return content;
	}
}
