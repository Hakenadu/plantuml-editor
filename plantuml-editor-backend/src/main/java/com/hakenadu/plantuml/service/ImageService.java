package com.hakenadu.plantuml.service;

import com.hakenadu.plantuml.service.exception.ImageServiceException;

public interface ImageService {

	public byte[] getSvg(String source) throws ImageServiceException;

	public byte[] getPng(String source) throws ImageServiceException;
}
