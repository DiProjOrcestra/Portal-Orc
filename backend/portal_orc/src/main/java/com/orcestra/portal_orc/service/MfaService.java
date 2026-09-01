package com.orcestra.portal_orc.service;

import java.time.LocalDateTime;

import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.CodeRequestDto;
import com.orcestra.portal_orc.dto.LoginRequestDto;
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

    public void generateAndSendCode(LoginRequestDto dto) throws BadRequestException {
        String code = randomCodeGenerator.generateRandomCode(CODE_LENGTH);
        String hashedCode = passwordEncoder.encode(code);
        UserEntity user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        user.setMfaCode(hashedCode);
        user.setMfaCodeExpiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        user.setMfaAttempts(0);
        userRepository.save(user);

        mailSender.sendEmail(user.getEmail(), "Código de verificação", "Este é o seu código: " + code);
    }

    public boolean validateCode(LoginRequestDto dto, CodeRequestDto codeRequestDto) throws BadRequestException {
        UserEntity user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        String inputCode = codeRequestDto.getCode();

        if (user.getMfaCode() == null
                || user.getMfaCodeExpiresAt() == null
                || user.getMfaCodeExpiresAt().isBefore(LocalDateTime.now())
                || user.getMfaAttempts() >= MAX_ATTEMPTS) {
            return false;
        }

        user.setMfaAttempts(user.getMfaAttempts() + 1);

        boolean matches = passwordEncoder.matches(inputCode, user.getMfaCode());
        if (matches) {
            user.setMfaCode(null);
            user.setMfaCodeExpiresAt(null);
            user.setMfaAttempts(0);
        }

        userRepository.save(user);
        return matches;
    }
}
