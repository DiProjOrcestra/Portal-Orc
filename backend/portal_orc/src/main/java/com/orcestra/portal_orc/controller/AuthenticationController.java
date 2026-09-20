package com.orcestra.portal_orc.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.config.CookieProvider;
import com.orcestra.portal_orc.dto.MeResponseDto;
import com.orcestra.portal_orc.dto.AuthDto.CodeRequestDto;
import com.orcestra.portal_orc.dto.AuthDto.LoginRequestDto;
import com.orcestra.portal_orc.dto.AuthDto.MfaTokenResponseDto;
import com.orcestra.portal_orc.dto.AuthDto.RegisterRequestDto;
import com.orcestra.portal_orc.dto.AuthDto.ResendPasswordDto;
import com.orcestra.portal_orc.model.UserEntity;

import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.service.AuthenticationService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/v1/auth/")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final CookieProvider cookieProvider;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequestDto userRequestDto) throws BadRequestException{
        authenticationService.registerUser(userRequestDto);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void login(@Valid @RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response) throws Exception{
        MfaTokenResponseDto result = authenticationService.loginUser(loginRequestDto);
        
        ResponseCookie cookie = cookieProvider.createMfaTokenCookie(result.getMfaToken(), result.getMfaExpirationTime());
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PostMapping("/resend/password")
    @ResponseStatus(HttpStatus.OK)
    public void resendRandomPassword(@Valid @RequestBody ResendPasswordDto resendPasswordDto) throws NotFoundException {
        authenticationService.resendRandomPassword(resendPasswordDto);
    }

    @PostMapping("/mfa/validate")
    @ResponseStatus(HttpStatus.OK)
    public void mfa(@Valid @RequestBody CodeRequestDto codeRequestDto, 
                    @CookieValue("temporary_token") String mfaToken, 
                    HttpServletResponse response) throws Exception{
        String token = authenticationService.validatingCode(mfaToken, codeRequestDto);
        ResponseCookie cookie = cookieProvider.createAccessTokenCookie(token);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PostMapping("/mfa/resend")
    @ResponseStatus(HttpStatus.OK)
    public void resendCodeMfa(@CookieValue("temporary_token") String mfaToken) throws BadRequestException{
        authenticationService.resendCode(mfaToken);
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public MeResponseDto me(@AuthenticationPrincipal UserEntity userEntity) {
        return new MeResponseDto(userEntity);
    }
}
