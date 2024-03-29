package com.github.hakenadu.plantuml.service.document;

import java.util.UUID;

import com.github.hakenadu.plantuml.model.DocumentMetaData;
import com.github.hakenadu.plantuml.service.document.exception.DocumentServiceException;

public interface DocumentService {

	UUID createDocument(String plantuml, String key) throws DocumentServiceException;

	String getDocument(UUID id, String key) throws DocumentServiceException;

	void deleteDocument(DocumentMetaData metaData) throws DocumentServiceException;

	void setDocument(UUID id, String plantuml, String key) throws DocumentServiceException;
}
