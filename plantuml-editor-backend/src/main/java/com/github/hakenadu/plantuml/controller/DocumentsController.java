package com.github.hakenadu.plantuml.controller;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import com.github.hakenadu.plantuml.service.AnnotationsService;
import com.github.hakenadu.plantuml.service.document.DocumentService;
import com.github.hakenadu.plantuml.service.document.exception.DocumentServiceException;

@Profile({ "local", "webdav", "redis" })
@RestController
@RequestMapping("/documents")
@CrossOrigin
public class DocumentsController {

	private final DocumentService documentService;
	private final AnnotationsService annotationsService;
	private final boolean overridingEnabled;

	public DocumentsController(final DocumentService documentService, final AnnotationsService annotationsService,
			final @Value("${plantuml-editor.document.overriding-enabled}") boolean overridingEnabled) {
		this.documentService = documentService;
		this.annotationsService = annotationsService;
		this.overridingEnabled = overridingEnabled;
	}

	@GetMapping
	public boolean documentOverridingEnabled() {
		return overridingEnabled;
	}

	@PostMapping
	public ResponseEntity<UUID> createDocument(final @RequestBody Map<String, String> body,
			final HttpServletRequest request) throws DocumentServiceException {

		final String source = Optional.ofNullable(body.get("source"))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "source missing"));

		final String key = Optional.ofNullable(body.get("key"))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "key missing"));

		if (!annotationsService.getAnnotations(source).isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid source");
		}

		final UUID uuid = documentService.createDocument(source, key);
		return ResponseEntity.created(
				UriComponentsBuilder.fromUriString(request.getRequestURI()).path('/' + uuid.toString()).build().toUri())
				.body(uuid);
	}

	/*
	 * GET would be semantically correct but then the query parameters would be
	 * logged by most reverse proxies and therefore the service provider could
	 * theoretically lookup the data needed to decrypt the stored plantuml spec.
	 * 
	 * So we are posting the data... yay paradigm violation
	 */
	@PostMapping("/{id}")
	public String getDocument(final @PathVariable UUID id, @RequestBody Map<String, String> body)
			throws DocumentServiceException {

		final String key = Optional.ofNullable(body.get("key"))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "key missing"));

		return documentService.getDocument(id, key);
	}

	@PutMapping("/{id}")
	public void overrideDocument(final @PathVariable UUID id, @RequestBody Map<String, String> body)
			throws DocumentServiceException {
		if (!overridingEnabled) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}

		final String source = Optional.ofNullable(body.get("source"))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "source missing"));

		final String key = Optional.ofNullable(body.get("key"))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "key missing"));

		if (!annotationsService.getAnnotations(source).isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid source");
		}

		documentService.setDocument(id, source, key);
	}
}
