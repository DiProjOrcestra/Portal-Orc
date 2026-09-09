package com.orcestra.portal_orc.util;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class RandomPasswordGenerator {
    
    public String generateRandomPassword(Integer length) {

        String letters_up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String letters_low = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String symbols = "!@#$%^&*()-_=+";
        String dictionary = letters_low + letters_up + numbers + symbols;
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(dictionary.length());
            char randomCharacter = dictionary.charAt(randomIndex);
            password.append(randomCharacter);
        }
        return password.toString();       
    }
}
