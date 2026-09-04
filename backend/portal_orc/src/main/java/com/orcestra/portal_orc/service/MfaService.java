package com.orcestra.portal_orc.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.LoginRequestDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.UserRepository;
import com.orcestra.portal_orc.util.RandomCodeGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MfaService {

    private static final int CODE_LENGTH = 4;
    private static final int EXPIRATION_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 3;

    private final UserRepository userRepository;
    private final EmailSenderService mailSender;
    private final RandomCodeGenerator randomCodeGenerator;
    private final PasswordEncoder passwordEncoder;

    public void generateAndSendCode(UserEntity user) throws BadRequestException {
        String code = randomCodeGenerator.generateRandomCode(CODE_LENGTH);
        String hashedCode = passwordEncoder.encode(code);

        user.setMfaCode(hashedCode);
        user.setMfaCodeExpiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        user.setMfaAttempts(0);
        userRepository.save(user);

        mailSender.sendEmail(user.getEmail(), "Código de verificação", "Este é o seu código: " + code);
    }

    public boolean validateCode(String email, String inputCode) throws BadRequestException {
        UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        if (user.getMfaCode() == null || user.getMfaCodeExpiresAt() == null
            || user.getMfaCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Código expirado ou não solicitado. Solicite um novo código.");
        }

        if (user.getMfaAttempts() >= MAX_ATTEMPTS) {
            throw new BadRequestException("Número de tentativas excedido. Solicite um novo código.");
        }

        boolean matches = passwordEncoder.matches(inputCode, user.getMfaCode());

        if (matches) {
            user.setMfaCode(null);
            user.setMfaCodeExpiresAt(null);
            user.setMfaAttempts(0);
            userRepository.save(user);
            return true;
        }

        user.setMfaAttempts(user.getMfaAttempts() + 1);
        userRepository.save(user);

        if (user.getMfaAttempts() >= MAX_ATTEMPTS) {
            throw new BadRequestException("Número de tentativas excedido. Solicite um novo código.");
        }

        return false;
    }
}
