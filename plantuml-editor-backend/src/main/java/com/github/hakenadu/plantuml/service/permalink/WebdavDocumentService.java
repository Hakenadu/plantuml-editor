package com.github.hakenadu.plantuml.service.permalink;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Base64;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.encrypt.BytesEncryptor;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.github.hakenadu.plantuml.service.permalink.exception.DocumentEncryptionFailedException;
import com.github.hakenadu.plantuml.service.permalink.exception.DocumentServiceException;

@Profile("webdav")
@Service
public class WebdavDocumentService implements DocumentService {

	private static final Logger LOGGER = LoggerFactory.getLogger(WebdavDocumentService.class);

	private final String webdavSecret;
	private final String webdavUsername;
	private final String webdavPassword;
	private final URI webdavUri;

	private String webdavCollection;

	public WebdavDocumentService(final @Value("${plantuml-editor.webdav.collection}") String webdavCollection,
			final @Value("${plantuml-editor.webdav.secret}") String webdavSecret,
			final @Value("${plantuml-editor.webdav.username}") String webdavUsername,
			final @Value("${plantuml-editor.webdav.password}") String webdavPassword,
			final @Value("${plantuml-editor.webdav.url}") URI webdavUri) {
		this.webdavCollection = webdavCollection;
		this.webdavSecret = webdavSecret;
		this.webdavUsername = webdavUsername;
		this.webdavPassword = webdavPassword;
		this.webdavUri = webdavUri;
	}

	@PostConstruct
	public void createCollection() throws DocumentServiceException {
		if (!this.webdavCollection.trim().isEmpty()) {
			return;
		}

		this.webdavCollection = "/data";

		final URI collectionUri = webdavCollectionUriComponentsBuilder().build().toUri();
		LOGGER.info("creating collection {}", collectionUri);

		final HttpRequest request = httpRequestBuilder().uri(collectionUri).method("MKCOL", BodyPublishers.noBody())
				.build();

		try {
			final HttpResponse<byte[]> response = HttpClient.newHttpClient().send(request, BodyHandlers.ofByteArray());
			if (response.statusCode() >= 300) {
				throw new DocumentServiceException(
						"unexpected http status creating collection: " + response.statusCode());
			}
		} catch (final IOException | InterruptedException ioException) {
			throw new DocumentServiceException("error creating collection", ioException);
		}
	}

	@Override
	public UUID createDocument(final String plantuml) throws DocumentServiceException {
		final UUID uuid = UUID.randomUUID();

		/*
		 * the document bytes are encrypted using the random uuid which therefore needs
		 * to be passed by the client for decryption
		 */
		final byte[] dataBytes = createEncryptor(uuid).encrypt(plantuml.getBytes(StandardCharsets.UTF_8));

		storeDocument(createDocumentName(uuid), dataBytes);

		return uuid;
	}

	@Override
	public String getDocument(final UUID id) throws DocumentServiceException {
		final String documentName = createDocumentName(id);

		final byte[] encryptedDocumentBytes = readDocument(documentName);

		return new String(createEncryptor(id).decrypt(encryptedDocumentBytes), StandardCharsets.UTF_8);
	}

	@Override
	public void deleteDocument(final UUID id) throws DocumentServiceException {
		// TODO Auto-generated method stub

	}

	@Override
	public void deleteDocumentsOlderThan(final Duration lifetime) throws DocumentServiceException {
		// TODO Auto-generated method stub

	}

	private UriComponentsBuilder webdavCollectionUriComponentsBuilder() {
		return UriComponentsBuilder.fromUri(webdavUri).path(webdavCollection);
	}

	private BytesEncryptor createEncryptor(final UUID id) {
		return Encryptors.standard(webdavSecret, bytesToHex(id.toString().getBytes(StandardCharsets.UTF_8)));
	}

	private HttpRequest.Builder httpRequestBuilder() {
		return HttpRequest.newBuilder().header(HttpHeaders.AUTHORIZATION,
				"Basic " + Base64.getEncoder().encodeToString((webdavUsername + ":" + webdavPassword).getBytes()));
	}

	private byte[] readDocument(final String documentName) throws DocumentServiceException {
		final URI documentUri = webdavCollectionUriComponentsBuilder().path('/' + documentName).build().toUri();
		LOGGER.info("reading document {}", documentUri);

		final HttpRequest request = httpRequestBuilder().uri(documentUri).GET().build();

		try {
			final HttpResponse<byte[]> response = HttpClient.newHttpClient().send(request, BodyHandlers.ofByteArray());
			if (response.statusCode() >= 300) {
				throw new DocumentServiceException("unexpected http status reading document: " + response.statusCode());
			}
			return response.body();
		} catch (final IOException | InterruptedException ioException) {
			throw new DocumentServiceException("error reading document", ioException);
		}
	}

	private void storeDocument(final String documentName, final byte[] dataBytes) throws DocumentServiceException {
		final URI documentUri = webdavCollectionUriComponentsBuilder().path('/' + documentName).build().toUri();
		LOGGER.info("storing document {}", documentUri);

		final HttpRequest request = httpRequestBuilder().uri(documentUri).PUT(BodyPublishers.ofByteArray(dataBytes))
				.build();

		try {
			final HttpResponse<?> response = HttpClient.newHttpClient().send(request, BodyHandlers.discarding());
			if (response.statusCode() >= 300) {
				throw new DocumentServiceException("unexpected http status storing document: " + response.statusCode());
			}
		} catch (final IOException | InterruptedException ioException) {
			throw new DocumentServiceException("error storing document", ioException);
		}
	}

	private String createDocumentName(final UUID uuid) throws DocumentEncryptionFailedException {
		final MessageDigest digest;
		try {
			digest = MessageDigest.getInstance("SHA3-256");
		} catch (final NoSuchAlgorithmException noSuchAlgorithmException) {
			throw new DocumentEncryptionFailedException("failed to encrypt", noSuchAlgorithmException);
		}

		/*
		 * the documentName is generated from the hash of the random uuid
		 */
		return bytesToHex(digest.digest(uuid.toString().getBytes(StandardCharsets.UTF_8)));
	}

	/**
	 * see <a href="https://www.baeldung.com/sha-256-hashing-java">baeldung.com</a>
	 */
	private String bytesToHex(final byte[] hash) {
		final StringBuilder hexString = new StringBuilder(2 * hash.length);
		for (int i = 0; i < hash.length; i++) {
			final String hex = Integer.toHexString(0xff & hash[i]);
			if (hex.length() == 1) {
				hexString.append('0');
			}
			hexString.append(hex);
		}
		return hexString.toString();
	}
}
