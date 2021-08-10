package com.hakenadu.plantuml.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hakenadu.plantuml.service.ImageService;
import com.hakenadu.plantuml.service.exception.ImageServiceException;

@CrossOrigin
@RestController
@RequestMapping("/images")
public class ImagesController {

	private final ImageService imageService;

	public ImagesController(final ImageService imageService) {
		this.imageService = imageService;
	}

	@PostMapping(path = "/svg")
	public byte[] getSvg(final @RequestBody String source) throws ImageServiceException {
		return imageService.getSvg(source);
	}

	@PostMapping(path = "/png", produces = MediaType.IMAGE_PNG_VALUE)
	public byte[] getPng(final @RequestBody String source) throws ImageServiceException {
		return imageService.getPng(source);
	}
}
