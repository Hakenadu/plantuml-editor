package com.github.hakenadu.plantuml.controller;

import java.util.Base64;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

	/*
	 * we'd like to use a getmapping here, but we need the request body
	 */
	@PostMapping(path = "/svg", produces = "image/svg+xml") // :-(
	public byte[] getSvg(final @RequestBody String source) throws ImageServiceException {
		return imageService.getSvg(source);
	}

	@PostMapping(path = "/svg", produces = MediaType.TEXT_PLAIN_VALUE)
	public String getSvgDataUri(final @RequestBody String source) throws ImageServiceException {
		return toDataUri("image/svg+xml", imageService.getSvg(source));
	}

	@GetMapping(path = "/svg", produces = "image/svg+xml")
	public byte[] getSvgByBase64Source(final @RequestParam String source) throws ImageServiceException {
		final String sourceDecoded = new String(Base64.getDecoder().decode(source));
		return imageService.getSvg(sourceDecoded);
	}

	@PostMapping(path = "/png", produces = MediaType.IMAGE_PNG_VALUE) // :-(
	public byte[] getPng(final @RequestBody String source) throws ImageServiceException {
		return imageService.getPng(source);
	}

	@PostMapping(path = "/png", produces = MediaType.TEXT_PLAIN_VALUE) // :-(
	public String getPngDataUri(final @RequestBody String source) throws ImageServiceException {
		return toDataUri("image/png", imageService.getPng(source));
	}

	@GetMapping(path = "/png", produces = MediaType.IMAGE_PNG_VALUE)
	public byte[] getPngByBase64Source(final @RequestParam String source) throws ImageServiceException {
		final String sourceDecoded = new String(Base64.getDecoder().decode(source));
		return imageService.getPng(sourceDecoded);
	}

	private String toDataUri(final String type, final byte[] data) {
		return new StringBuilder().append("data:").append(type).append(";base64, ")
				.append(Base64.getEncoder().encodeToString(data)).toString();
	}
}
