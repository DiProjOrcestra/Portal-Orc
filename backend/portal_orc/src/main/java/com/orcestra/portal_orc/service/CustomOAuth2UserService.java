package com.orcestra.portal_orc.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String emailGoogle = oAuth2User.getAttribute("email");

        UserEntity usuario = userRepository.findByEmail(emailGoogle)
            .orElseThrow(() -> new OAuth2AuthenticationException("Usuário não cadastrado"));
        
        return oAuth2User;
    }
}
