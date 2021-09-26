package com.github.hakenadu.plantuml.service.document;

import java.util.Collection;

import com.github.hakenadu.plantuml.model.DocumentMetaData;
import com.github.hakenadu.plantuml.service.document.exception.DocumentServiceException;

/**
 * Some implementations may use some sort of persistence which already supports
 * expiration time (for example redis) and therefore do not need the
 * {@link DocumentReaper}.
 * 
 * However if this interface is implemented, the {@link DocumentReaper} will find
 * your documents an reap them ;-)
 */
public interface DocumentServiceWithoutExpirationMechanism extends DocumentService {

	Collection<? extends DocumentMetaData> getDocumentMetaData() throws DocumentServiceException;
}
