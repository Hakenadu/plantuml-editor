package com.github.hakenadu.plantuml.controller;

import java.util.UUID;

import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.hakenadu.plantuml.service.ImageService;
import com.github.hakenadu.plantuml.service.document.DocumentService;
import com.github.hakenadu.plantuml.service.document.exception.DocumentServiceException;
import com.github.hakenadu.plantuml.service.exception.ImageServiceException;

@Profile({ "local", "webdav", "redis" })
@RestController
@RequestMapping("/documents/{id}")
@CrossOrigin
public class DocumentImagesController {

	private final DocumentService documentService;
	private final ImageService imageService;

	public DocumentImagesController(final DocumentService documentService, final ImageService imageService) {
		this.documentService = documentService;
		this.imageService = imageService;
	}

	@GetMapping(path = "/images/svg", produces = "image/svg+xml")
	public byte[] getSvg(final @PathVariable UUID id, final @RequestParam String key)
			throws ImageServiceException, DocumentServiceException {
		return imageService.getSvg(documentService.getDocument(id, key));
	}

	@GetMapping(path = "/images/png", produces = MediaType.IMAGE_PNG_VALUE)
	public byte[] getPng(final @PathVariable UUID id, final @RequestParam String key)
			throws ImageServiceException, DocumentServiceException {
		return imageService.getPng(documentService.getDocument(id, key));
	}
}
