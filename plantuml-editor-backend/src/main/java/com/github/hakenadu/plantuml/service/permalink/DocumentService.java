package com.github.hakenadu.plantuml.service.permalink;

import java.util.UUID;

import com.github.hakenadu.plantuml.service.permalink.exception.DocumentServiceException;

public interface DocumentService {

	UUID createDocument(String plantuml) throws DocumentServiceException;

	String getDocument(UUID id) throws DocumentServiceException;
}
