package com.github.hakenadu.plantuml.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class DocumentMetaData {

	private final UUID id;
	private final LocalDateTime creationDate;

	public DocumentMetaData(final UUID id, final LocalDateTime creationDate) {
		super();
		this.id = id;
		this.creationDate = creationDate;
	}

	public UUID getId() {
		return id;
	}

	public LocalDateTime getCreationDate() {
		return creationDate;
	}
}
