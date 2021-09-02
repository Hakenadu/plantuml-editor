package com.github.hakenadu.plantuml.service.crypt;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.security.crypto.encrypt.BytesEncryptor;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.stereotype.Service;

import com.github.hakenadu.plantuml.service.document.DocumentService;

@ConditionalOnBean(DocumentService.class)
@Service
public class StandardCryptService implements CryptService {

	private final String salt;

	public StandardCryptService(final @Value("${plantuml-editor.document.salt}") String salt) {
		this.salt = bytesToHex(salt.getBytes(StandardCharsets.UTF_8));
	}

	@Override
	public String encrypt(final String unencrypted, final String password) {
		return Base64.getEncoder()
				.encodeToString(createEncryptor(password, salt).encrypt(unencrypted.getBytes(StandardCharsets.UTF_8)));
	}

	@Override
	public String decrypt(final String encrypted, final String password) {
		return new String(createEncryptor(password, salt).decrypt(Base64.getDecoder().decode(encrypted)),
				StandardCharsets.UTF_8);
	}

	private BytesEncryptor createEncryptor(final String password, final String salt) {
		return Encryptors.standard(password, salt);
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
