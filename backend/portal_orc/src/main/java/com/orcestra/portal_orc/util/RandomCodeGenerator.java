package com.orcestra.portal_orc.util;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class RandomCodeGenerator {

    public String generateRandomCode(int length) {

        SecureRandom random = new SecureRandom();
        int max = (int) Math.pow(10, length);
        int code = random.nextInt(max);
        
        return String.format("%0" + length + "d", code);
    }
}