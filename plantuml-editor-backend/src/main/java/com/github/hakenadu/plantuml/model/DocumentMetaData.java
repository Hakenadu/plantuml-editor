package com.github.hakenadu.plantuml.model;

import java.time.LocalDateTime;

public class DocumentMetaData {

	private final String documentName;
	private final LocalDateTime creationDate;

	public DocumentMetaData(final String documentName, final LocalDateTime creationDate) {
		super();
		this.documentName = documentName;
		this.creationDate = creationDate;
	}

	public String getDocumentName() {
		return documentName;
	}

	public LocalDateTime getCreationDate() {
		return creationDate;
	}
}
