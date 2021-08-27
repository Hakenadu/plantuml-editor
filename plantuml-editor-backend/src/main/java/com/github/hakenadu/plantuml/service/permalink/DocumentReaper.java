package com.github.hakenadu.plantuml.service.permalink;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.github.hakenadu.plantuml.model.DocumentMetaData;
import com.github.hakenadu.plantuml.service.permalink.exception.DocumentServiceException;

@ConditionalOnBean(DocumentService.class)
@Component
@EnableScheduling
public class DocumentReaper {

	@Value("${plantuml-editor.document.lifetime}")
	private Duration lifetime;

	@Autowired
	private DocumentService documentService;

	@Scheduled(cron = "${plantuml-editor.document.reaper.cron}")
	public void deleteOldDocuments() throws DocumentServiceException {
		final LocalDateTime now = LocalDateTime.now();

		for (final DocumentMetaData metaData : documentService.getDocumentMetaData()) {
			if (metaData.getCreationDate().plus(lifetime).isAfter(now)) {
				documentService.deleteDocument(metaData);
			}
		}
	}
}
