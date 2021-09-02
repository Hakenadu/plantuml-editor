package com.github.hakenadu.plantuml.model;

import java.time.LocalDateTime;
import java.util.UUID;

public final class LocalDocument extends DocumentMetaData {

	private final String content;

	public LocalDocument(final String content, final UUID id, final LocalDateTime creationDate) {
		super(id, creationDate);
		this.content = content;
	}

	public String getContent() {
		return content;
	}
}
