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
import com.github.hakenadu.plantuml.service.crypt.CryptService;
import com.github.hakenadu.plantuml.service.document.exception.DocumentServiceException;

@Profile("local")
@Service
public class LocalDocumentService implements DocumentServiceWithoutExpirationMechanism {

	private final CryptService cryptService;
	private final Map<UUID, LocalDocument> data = new ConcurrentHashMap<>();

	public LocalDocumentService(final CryptService cryptService) {
		this.cryptService = cryptService;
	}

	@Override
	public UUID createDocument(final String source, final String key) throws DocumentServiceException {
		final UUID id = UUID.randomUUID();
		data.put(id, new LocalDocument(cryptService.encrypt(source, key), id, LocalDateTime.now()));
		return id;
	}

	@Override
	public String getDocument(final UUID id, final String key) throws DocumentServiceException {
		return cryptService.decrypt(data.get(id).getContent(), key);
	}

	@Override
	public void deleteDocument(final DocumentMetaData metaData) throws DocumentServiceException {
		this.data.remove(metaData.getId());
	}

	@Override
	public Collection<? extends DocumentMetaData> getDocumentMetaData() throws DocumentServiceException {
		return data.values();
	}
}
