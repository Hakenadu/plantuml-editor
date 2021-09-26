package com.github.hakenadu.plantuml.service.document;

import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

import com.github.hakenadu.plantuml.config.RedisConfig;
import com.github.hakenadu.plantuml.model.DocumentMetaData;
import com.github.hakenadu.plantuml.service.crypt.CryptService;
import com.github.hakenadu.plantuml.service.document.exception.DocumentNotFoundException;
import com.github.hakenadu.plantuml.service.document.exception.DocumentServiceException;

import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisClientConfig;
import redis.clients.jedis.params.SetParams;

@ConditionalOnBean(RedisConfig.class)
@Service
public class RedisDocumentService implements DocumentService {

	private final CryptService cryptService;
	private final HostAndPort hostAndPort;
	private final JedisClientConfig jedisClientConfig;
	private final String prefix;
	private final Duration documentLifetime;

	public RedisDocumentService(final CryptService cryptService, HostAndPort hostAndPort,
			final JedisClientConfig jedisClientConfig, final @Value("${plantuml-editor.redis.prefix}") String prefix,
			final @Value("${plantuml-editor.document.lifetime}") Duration documentLifetime) {
		this.cryptService = cryptService;
		this.hostAndPort = hostAndPort;
		this.jedisClientConfig = jedisClientConfig;
		this.prefix = prefix;
		this.documentLifetime = documentLifetime;
	}

	@Override
	public UUID createDocument(final String plantuml, final String key) throws DocumentServiceException {
		final String encrypted = cryptService.encrypt(plantuml, key);
		final UUID documentId = UUID.randomUUID();
		createClient().set(prefix + documentId, encrypted, new SetParams().ex(documentLifetime.getSeconds()));
		return documentId;
	}

	@Override
	public String getDocument(final UUID id, final String key) throws DocumentServiceException {
		final String encrypted = createClient().get(prefix + id);
		if (encrypted == null) {
			throw new DocumentNotFoundException(id.toString());
		}
		return cryptService.decrypt(encrypted, key);
	}

	@Override
	public void deleteDocument(final DocumentMetaData metaData) throws DocumentServiceException {
		createClient().del(prefix + metaData.getId());
	}

	/**
	 * {@link Jedis} is not threadsafe, therefore we only provide the configurations as beans
	 * and instantiate a new client for each request.
	 */
	private Jedis createClient() {
		return new Jedis(hostAndPort, jedisClientConfig);
	}
}
