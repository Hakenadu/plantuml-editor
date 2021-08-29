package com.github.hakenadu.plantuml.service.document;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.github.hakenadu.plantuml.model.DocumentMetaData;
import com.github.hakenadu.plantuml.model.LocalDocument;
import com.github.hakenadu.plantuml.service.document.exception.DocumentServiceException;

@Profile("local")
@Service
public class LocalDocumentService implements DocumentService {

	private final Map<String, LocalDocument> data = new ConcurrentHashMap<>();

	@Override
	public UUID createDocument(final String plantuml) throws DocumentServiceException {
		final UUID uuid = UUID.randomUUID();
		data.put(uuid.toString(), new LocalDocument(plantuml, uuid.toString(), LocalDateTime.now()));
		return uuid;
	}

	@Override
	public String getDocument(final UUID id) throws DocumentServiceException {
		return data.get(id.toString()).getContent();
	}

	@Override
	public void deleteDocument(final DocumentMetaData metaData) throws DocumentServiceException {
		this.data.remove(metaData.getDocumentName());
	}

	@Override
	public Collection<? extends DocumentMetaData> getDocumentMetaData() throws DocumentServiceException {
		return data.values();
	}
}
