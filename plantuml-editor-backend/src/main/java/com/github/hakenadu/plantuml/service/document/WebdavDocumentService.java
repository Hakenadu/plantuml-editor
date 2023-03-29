package com.github.hakenadu.plantuml.service.document;

import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpClient.Redirect;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.github.hakenadu.plantuml.model.DocumentMetaData;
import com.github.hakenadu.plantuml.service.crypt.CryptService;
import com.github.hakenadu.plantuml.service.document.exception.DocumentNotFoundException;
import com.github.hakenadu.plantuml.service.document.exception.DocumentServiceException;

@Profile("webdav")
@Service
public class WebdavDocumentService implements DocumentServiceWithoutExpirationMechanism {

	private static final Logger LOGGER = LoggerFactory.getLogger(WebdavDocumentService.class);
	private static final Pattern UUID_PATTERN = Pattern.compile(".*/([a-f0-9]{8}(-[a-f0-9]{4}){4}[a-f0-9]{8})$");
	private static final String DAV_NAMESPACE = "DAV:";
	private static final DocumentBuilderFactory DOCUMENT_BUILDER_FACTORY;
	static {
		DOCUMENT_BUILDER_FACTORY = DocumentBuilderFactory.newInstance();
		DOCUMENT_BUILDER_FACTORY.setNamespaceAware(true);
	}

	private final CryptService cryptService;

	private final String webdavUsername;
	private final String webdavPassword;
	private final URI webdavUri;

	private String webdavCollection;

	public WebdavDocumentService(final CryptService cryptService,
			final @Value("${plantuml-editor.webdav.collection}") String webdavCollection,
			final @Value("${plantuml-editor.webdav.username}") String webdavUsername,
			final @Value("${plantuml-editor.webdav.password}") String webdavPassword,
			final @Value("${plantuml-editor.webdav.url}") URI webdavUri) {

		this.cryptService = cryptService;
		this.webdavCollection = webdavCollection;
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
			if (response.statusCode() >= 400) {
				throw new DocumentServiceException(
						"unexpected http status creating collection: " + response.statusCode());
			}
		} catch (final IOException | InterruptedException ioException) {
			throw new DocumentServiceException("error creating collection", ioException);
		}
	}

	@Override
	public void setDocument(final UUID id, final String source, final String key) throws DocumentServiceException {
		final String encrypted = cryptService.encrypt(source, key);

		final URI documentUri = webdavCollectionUriComponentsBuilder().path('/' + id.toString()).build().toUri();
		LOGGER.info("storing document {}", documentUri);

		final HttpRequest request = httpRequestBuilder().uri(documentUri).PUT(BodyPublishers.ofString(encrypted))
				.build();

		try {
			final HttpResponse<?> response = HttpClient.newHttpClient().send(request, BodyHandlers.discarding());
			if (response.statusCode() >= 400) {
				throw new DocumentServiceException("unexpected http status storing document: " + response.statusCode());
			}
		} catch (final IOException | InterruptedException ioException) {
			throw new DocumentServiceException("error storing document", ioException);
		}
	}

	@Override
	public UUID createDocument(final String source, final String key) throws DocumentServiceException {
		final UUID id = UUID.randomUUID();
		setDocument(id, source, key);
		return id;
	}

	@Override
	public String getDocument(final UUID id, final String key) throws DocumentServiceException {
		return cryptService.decrypt(readDocument(id), key);
	}

	@Override
	public void deleteDocument(final DocumentMetaData metaData) throws DocumentServiceException {
		final URI documentUri = webdavCollectionUriComponentsBuilder().path('/' + metaData.getId().toString()).build()
				.toUri();
		LOGGER.info("deleting document {}", documentUri);

		final HttpRequest request = httpRequestBuilder().uri(documentUri).DELETE().build();

		try {
			final HttpResponse<byte[]> response = HttpClient.newHttpClient().send(request, BodyHandlers.ofByteArray());
			if (response.statusCode() >= 500) {
				throw new DocumentServiceException(
						"unexpected http status deleting document: " + response.statusCode());
			}
		} catch (final IOException | InterruptedException ioException) {
			throw new DocumentServiceException("error deleting document", ioException);
		}
	}

	@Override
	public Collection<? extends DocumentMetaData> getDocumentMetaData() throws DocumentServiceException {
		final URI collectionUri = webdavCollectionUriComponentsBuilder().build().toUri();
		LOGGER.info("reading document meta data {}", collectionUri);

		final HttpRequest request = httpRequestBuilder().uri(collectionUri).method("PROPFIND", BodyPublishers.noBody())
				.header("Depth", "1").build();

		try {
			final HttpResponse<String> response = HttpClient.newBuilder().followRedirects(Redirect.NORMAL).build()
					.send(request, BodyHandlers.ofString());
			if (response.statusCode() >= 400) {
				throw new DocumentServiceException("unexpected http status reading metadata: " + response.statusCode());
			}
			return readMetaDataFromResponse(response);
		} catch (final IOException | InterruptedException ioException) {
			throw new DocumentServiceException("error reading metadata", ioException);
		}
	}

	private List<? extends DocumentMetaData> readMetaDataFromResponse(final HttpResponse<String> httpResponse)
			throws DocumentServiceException {
		try {
			final Document document = DOCUMENT_BUILDER_FACTORY.newDocumentBuilder()
					.parse(new InputSource(new StringReader(httpResponse.body())));

			final NodeList responses = document.getElementsByTagNameNS(DAV_NAMESPACE, "response");

			final List<DocumentMetaData> metaData = new LinkedList<>();

			for (int responseIndex = 0; responseIndex < responses.getLength(); responseIndex++) {
				final Element response = (Element) responses.item(responseIndex);

				final Element prop = findSingleNode(response, "prop").map(Element.class::cast).orElseThrow();

				if (isCollection(prop)) {
					continue;
				}

				final String href = findSingleNode(response, "href").map(Node::getTextContent).orElseThrow();
				final LocalDateTime creationdate = findSingleNode(prop, "creationdate").map(Node::getTextContent)
						.map(Instant::parse).map(instant -> LocalDateTime.ofInstant(instant, ZoneOffset.UTC))
						.orElseThrow();

				final Matcher matcher = UUID_PATTERN.matcher(href);
				if (!matcher.find()) {
					throw new DocumentServiceException("no uuid in " + href);
				}
				metaData.add(new DocumentMetaData(UUID.fromString(matcher.group(1)), creationdate));
			}

			return metaData;
		} catch (final SAXException | IOException | ParserConfigurationException exception) {
			throw new DocumentServiceException("error parsing metadata", exception);
		}
	}

	private boolean isCollection(final Element prop) {
		return findSingleNode(prop, "resourcetype").map(Element.class::cast)
				.flatMap(resourcetype -> findSingleNode(resourcetype, "collection")).isPresent();
	}

	private Optional<Node> findSingleNode(final Element element, final String tagName) {
		final NodeList children = element.getElementsByTagNameNS(DAV_NAMESPACE, tagName);
		if (children.getLength() == 0 || children.getLength() > 1) {
			return Optional.empty();
		}
		return Optional.of(children.item(0));
	}

	private UriComponentsBuilder webdavCollectionUriComponentsBuilder() {
		return UriComponentsBuilder.fromUri(webdavUri).path(webdavCollection);
	}

	private HttpRequest.Builder httpRequestBuilder() {
		return HttpRequest.newBuilder().header(HttpHeaders.AUTHORIZATION,
				"Basic " + Base64.getEncoder().encodeToString((webdavUsername + ":" + webdavPassword).getBytes()));
	}

	private String readDocument(final UUID id) throws DocumentServiceException {
		final URI documentUri = webdavCollectionUriComponentsBuilder().path('/' + id.toString()).build().toUri();
		LOGGER.info("reading document {}", documentUri);

		final HttpRequest request = httpRequestBuilder().uri(documentUri).GET().build();

		try {
			final HttpResponse<String> response = HttpClient.newHttpClient().send(request,
					BodyHandlers.ofString(StandardCharsets.UTF_8));
			if (response.statusCode() == 404) {
				throw new DocumentNotFoundException(id.toString());
			}
			if (response.statusCode() >= 400) {
				throw new DocumentServiceException("unexpected http status reading document: " + response.statusCode());
			}
			return response.body();
		} catch (final IOException | InterruptedException ioException) {
			throw new DocumentServiceException("error reading document", ioException);
		}
	}
}
