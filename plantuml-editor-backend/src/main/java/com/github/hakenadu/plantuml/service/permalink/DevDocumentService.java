package com.github.hakenadu.plantuml.service.permalink;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.github.hakenadu.plantuml.service.permalink.exception.DocumentServiceException;

/**
 * ONLY FOR LOCAL DEVELOPMENT PURPOSES
 */
@Profile("dev")
@Service
public class DevDocumentService implements DocumentService {

	private static final Logger LOGGER = LoggerFactory.getLogger(DevDocumentService.class);

	private final Map<UUID, String> data = new ConcurrentHashMap<>();

	public DevDocumentService() {
		LOGGER.warn("DevDocumentService is used -- not usable for production scenarios!");
	}

	@Override
	public UUID createDocument(final String plantuml) throws DocumentServiceException {
		final UUID uuid = UUID.randomUUID();
		data.put(uuid, plantuml);
		return uuid;
	}

	@Override
	public String getDocument(final UUID id) throws DocumentServiceException {
		return data.get(id);
	}

	@Override
	public void deleteDocument(final UUID id) throws DocumentServiceException {
		this.data.remove(id);
	}

	@Override
	public void deleteDocumentsOlderThan(final Duration lifetime) throws DocumentServiceException {
		// noop
	}
}
