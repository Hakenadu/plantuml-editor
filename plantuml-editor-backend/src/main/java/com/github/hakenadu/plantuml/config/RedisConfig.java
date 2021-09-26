package com.github.hakenadu.plantuml.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.util.StringUtils;

import redis.clients.jedis.DefaultJedisClientConfig;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisClientConfig;

@Profile("redis")
@Configuration
public class RedisConfig {

	@Bean
	public HostAndPort hostAndPort(final @Value("${plantuml-editor.redis.host}") String host,
			final @Value("${plantuml-editor.redis.port}") int port) {
		return new HostAndPort(host, port);
	}

	@Bean
	public JedisClientConfig jedisClientConfig(final @Value("${plantuml-editor.redis.username}") String username,
			final @Value("${plantuml-editor.redis.password}") String password) {
		final DefaultJedisClientConfig.Builder builder = DefaultJedisClientConfig.builder();

		if (StringUtils.hasLength(username)) {
			builder.user(username);
		}

		if (StringUtils.hasLength(password)) {
			builder.password(password);
		}

		return builder.build();
	}
}
