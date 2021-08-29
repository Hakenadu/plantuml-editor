package com.github.hakenadu.plantuml.service.permalink;

import java.util.Collection;
import java.util.UUID;

import com.github.hakenadu.plantuml.model.DocumentMetaData;
import com.github.hakenadu.plantuml.service.permalink.exception.DocumentServiceException;

public interface DocumentService {

	UUID createDocument(String plantuml) throws DocumentServiceException;

	String getDocument(UUID id) throws DocumentServiceException;

	void deleteDocument(DocumentMetaData metaData) throws DocumentServiceException;

	Collection<? extends DocumentMetaData> getDocumentMetaData() throws DocumentServiceException;
}
