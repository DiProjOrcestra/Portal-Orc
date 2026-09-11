package com.orcestra.portal_orc.util;

import java.util.regex.Pattern;

import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Component;

@Component 
public class PasswordValidator {
    private static final Pattern PASSWORD_PATTERN =
        Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$");

    public void validate(String password) throws BadRequestException{
        if(password != null || !PASSWORD_PATTERN.matcher(password).matches()){
            throw new BadRequestException("A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial");
        }
    }
}
