package com.github.hakenadu.plantuml.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.github.hakenadu.plantuml.service.exception.ImageServiceException;

import net.sourceforge.plantuml.FileFormat;
import net.sourceforge.plantuml.FileFormatOption;
import net.sourceforge.plantuml.SourceStringReader;
import net.sourceforge.plantuml.core.DiagramDescription;

@Service
public class PlantumlImageService implements ImageService {

	private static final Logger LOGGER = LoggerFactory.getLogger(PlantumlImageService.class);

	@Override
	public byte[] getSvg(final String source) throws ImageServiceException {
		return createImage(source, FileFormat.SVG);
	}

	@Override
	public byte[] getPng(final String source) throws ImageServiceException {
		return createImage(source, FileFormat.PNG);
	}

	private byte[] createImage(final String source, final FileFormat fileFormat) throws ImageServiceException {
		final SourceStringReader reader = new SourceStringReader(source);
		try (final ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
			final DiagramDescription desc = reader.outputImage(outputStream, new FileFormatOption(fileFormat));
			LOGGER.info("image created: {}", desc.getDescription());
			return outputStream.toByteArray();
		} catch (final IOException ioException) {
			throw new ImageServiceException("generateImage failed", ioException);
		}
	}
}
