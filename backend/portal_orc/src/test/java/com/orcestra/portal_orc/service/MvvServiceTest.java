package com.orcestra.portal_orc.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.orcestra.portal_orc.dto.MvvRequestDto;
import com.orcestra.portal_orc.dto.MvvResponseDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.MvvEntity;
import com.orcestra.portal_orc.repository.MvvRepository;

@ExtendWith(MockitoExtension.class)
class MvvServiceTest {

    @Mock
    private MvvRepository mvvRepository;

    @InjectMocks
    private MvvService mvvService;

    @Test
    @DisplayName("Deve criar o MVV quando ainda não existe cadastro")
    void deveCriarMvvQuandoNaoExisteCadastro() throws BadRequestException {
        MvvRequestDto request = request();
        MvvEntity savedEntity = entity(1);

        when(mvvRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());
        when(mvvRepository.save(any(MvvEntity.class))).thenReturn(savedEntity);

        MvvResponseDto response = mvvService.createMvv(request);

        assertEquals(1, response.getId());
        assertEquals(request.getQuote(), response.getQuote());
        assertEquals(request.getMission(), response.getMission());
        assertEquals(request.getVision(), response.getVision());
        assertEquals(request.getValuesText(), response.getValuesText());
        assertEquals(request.getValues(), response.getValues());
        verify(mvvRepository).save(any(MvvEntity.class));
    }

    @Test
    @DisplayName("Deve rejeitar novo MVV quando já existe cadastro")
    void deveRejeitarSegundoCadastroDeMvv() {
        when(mvvRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(entity(1)));

        assertThrows(
                BadRequestException.class,
                () -> mvvService.createMvv(request()));

        verify(mvvRepository, never()).save(any(MvvEntity.class));
    }

    @Test
    @DisplayName("Deve consultar o MVV existente")
    void deveConsultarMvvExistente() throws NotFoundException {
        when(mvvRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(entity(1)));

        MvvResponseDto response = mvvService.getMvv();

        assertEquals(1, response.getId());
        assertEquals("Servir com excelência", response.getMission());
        assertEquals(List.of("Ética", "Colaboração"), response.getValues());
        verify(mvvRepository).findFirstByOrderByIdAsc();
    }

    @Test
    @DisplayName("Deve lançar exceção ao consultar MVV inexistente")
    void deveRejeitarConsultaQuandoMvvNaoExiste() {
        when(mvvRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> mvvService.getMvv());
    }

    @Test
    @DisplayName("Deve atualizar o MVV existente")
    void deveAtualizarMvvExistente() throws NotFoundException {
        MvvEntity entity = entity(1);
        MvvRequestDto request = request("Nova missão", "Nova visão");
        when(mvvRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(entity));
        when(mvvRepository.save(entity)).thenReturn(entity);

        MvvResponseDto response = mvvService.updateMvv(request);

        assertEquals("Nova missão", response.getMission());
        assertEquals("Nova visão", response.getVision());
        assertEquals(request.getQuote(), response.getQuote());
        assertEquals(request.getValuesText(), response.getValuesText());
        assertEquals(request.getValues(), response.getValues());
        verify(mvvRepository).save(entity);
    }

    @Test
    @DisplayName("Deve rejeitar atualização quando o MVV não existe")
    void deveRejeitarAtualizacaoQuandoMvvNaoExiste() {
        when(mvvRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> mvvService.updateMvv(request()));
        verify(mvvRepository, never()).save(any(MvvEntity.class));
    }

    private MvvRequestDto request() {
        return request("Servir com excelência", "Ser referência no setor");
    }

    private MvvRequestDto request(String mission, String vision) {
        return MvvRequestDto.builder()
                .quote("A união faz a força")
                .mission(mission)
                .vision(vision)
                .valuesText("Valores que orientam nossas decisões")
                .values(List.of("Ética", "Colaboração"))
                .build();
    }

    private MvvEntity entity(Integer id) {
        return MvvEntity.builder()
                .id(id)
                .quote("A união faz a força")
                .mission("Servir com excelência")
                .vision("Ser referência no setor")
                .valuesText("Valores que orientam nossas decisões")
                .values(List.of("Ética", "Colaboração"))
                .build();
    }
}