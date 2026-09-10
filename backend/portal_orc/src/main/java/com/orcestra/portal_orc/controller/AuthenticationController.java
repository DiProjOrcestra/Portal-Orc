package com.orcestra.portal_orc.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.config.CookieProvider;
import com.orcestra.portal_orc.dto.CodeRequestDto;
import com.orcestra.portal_orc.dto.LoginRequestDto;
import com.orcestra.portal_orc.dto.MfaTokenResponseDto;
import com.orcestra.portal_orc.dto.RegisterRequestDto;
import com.orcestra.portal_orc.dto.ResendCodeRequestDto;
import com.orcestra.portal_orc.exception.BadRequestException;
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
    public MfaTokenResponseDto login(@Valid @RequestBody LoginRequestDto loginRequestDto) throws Exception{
        return authenticationService.loginUser(loginRequestDto);
    }

    @PostMapping("/login/mfa")
    @ResponseStatus(HttpStatus.OK)
    public void mfa(@Valid @RequestBody CodeRequestDto codeRequestDto, HttpServletResponse response) throws Exception{
        String token = authenticationService.validatingCode(codeRequestDto);
        ResponseCookie cookie = cookieProvider.createAccessTokenCookie(token);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PostMapping("/resend/mfa")
    @ResponseStatus(HttpStatus.OK)
    public void resendCodeMfa(@Valid @RequestBody ResendCodeRequestDto resendCodeRequestDto) throws BadRequestException{
        authenticationService.resendCode(resendCodeRequestDto);
    }
}
