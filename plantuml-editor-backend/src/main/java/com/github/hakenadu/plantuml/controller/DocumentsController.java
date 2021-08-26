package com.github.hakenadu.plantuml.controller;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.github.hakenadu.plantuml.service.permalink.DocumentService;
import com.github.hakenadu.plantuml.service.permalink.exception.DocumentServiceException;

@ConditionalOnBean(DocumentService.class)
@RestController
@RequestMapping("/documents")
@CrossOrigin
public class DocumentsController {

	private final DocumentService documentService;

	public DocumentsController(final DocumentService documentService) {
		this.documentService = documentService;
	}

	@PostMapping
	public ResponseEntity<UUID> createDocument(final @RequestBody String plantuml, final HttpServletRequest request)
			throws DocumentServiceException {
		final UUID uuid = documentService.createDocument(plantuml);
		return ResponseEntity.created(
				UriComponentsBuilder.fromUriString(request.getRequestURI()).path('/' + uuid.toString()).build().toUri())
				.body(uuid);
	}

	@GetMapping("/{id}")
	public String getDocument(final @PathVariable UUID id) throws DocumentServiceException {
		return documentService.getDocument(id);
	}
}
