package com.orcestra.portal_orc.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.UserListResponseDto;
import com.orcestra.portal_orc.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    public List<UserListResponseDto> getAllUsers() {

        return userRepository.findAll().stream()
                                        .map(UserListResponseDto::new)
                                        .toList();
    }
}
