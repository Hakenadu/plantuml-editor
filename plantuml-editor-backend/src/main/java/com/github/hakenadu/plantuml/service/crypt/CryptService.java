package com.github.hakenadu.plantuml.service.crypt;

public interface CryptService {

	String encrypt(String unencrypted, String password);

	String decrypt(String encrypted, String password);
}
