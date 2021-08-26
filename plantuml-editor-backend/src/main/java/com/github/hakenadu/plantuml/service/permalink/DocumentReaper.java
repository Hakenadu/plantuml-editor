package com.github.hakenadu.plantuml.service.permalink;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.github.hakenadu.plantuml.service.permalink.exception.DocumentServiceException;

@ConditionalOnBean(DocumentService.class)
@Component
@EnableScheduling
public class DocumentReaper {

	@Value("${document.lifetime}")
	private Duration lifetime;

	@Autowired
	private DocumentService documentService;

	@Scheduled(cron = "${document.reaper.cron}")
	public void deleteOldDocuments() throws DocumentServiceException {
		documentService.deleteDocumentsOlderThan(lifetime);
	}
}
