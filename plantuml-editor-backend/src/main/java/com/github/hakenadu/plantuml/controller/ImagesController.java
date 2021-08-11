package com.github.hakenadu.plantuml.controller;

import java.util.Base64;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.hakenadu.plantuml.service.ImageService;
import com.github.hakenadu.plantuml.service.exception.ImageServiceException;

@CrossOrigin
@RestController
@RequestMapping("/images")
public class ImagesController {

	private final ImageService imageService;

	public ImagesController(final ImageService imageService) {
		this.imageService = imageService;
	}

	@PostMapping(path = "/svg")
	public String getSvg(final @RequestBody String source) throws ImageServiceException {
		return toDataUri("image/svg+xml", imageService.getSvg(source));
	}

	@PostMapping(path = "/png", produces = MediaType.IMAGE_PNG_VALUE)
	public String getPng(final @RequestBody String source) throws ImageServiceException {
		return toDataUri("image/png", imageService.getPng(source));
	}

	private String toDataUri(final String type, final byte[] data) {
		return new StringBuilder().append("data:").append(type).append(";base64, ")
				.append(Base64.getEncoder().encodeToString(data)).toString();
	}
}
