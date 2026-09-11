package com.orcestra.portal_orc.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.LinkUsersToActionPlanRequestDto;
import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanRequestDto;
import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanResponseDto;
import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanStatusRequestDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.ActionPlanEntity;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.ObjectiveEntity;
import com.orcestra.portal_orc.model.SubtaskEntity;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.ActionPlanRepository;
import com.orcestra.portal_orc.repository.DirectorateRepository;
import com.orcestra.portal_orc.repository.ObjectiveRepository;
import com.orcestra.portal_orc.repository.SubtaskRepository;
import com.orcestra.portal_orc.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActionPlanService {
    
    private final ActionPlanRepository actionPlanRepository;
    private final DirectorateRepository directorateRepository;
    private final ObjectiveRepository objectiveRepository;
    private final UserRepository userRepository;
    private final SubtaskRepository subtaskRepository;

    public void createActionPlan(Integer objectiveId, ActionPlanRequestDto actionPlanRequestDto) throws BadRequestException, NotFoundException {

        ObjectiveEntity objective = objectiveRepository.findById(objectiveId)
                                    .orElseThrow(() -> new NotFoundException(String
                                    .format("Objetivo com id %d não existe", objectiveId)));

        ActionPlanEntity actionPlan = new ActionPlanEntity(actionPlanRequestDto);
        DirectorateEntity directorate = directorateRepository
                                        .findByDirectorateName(
                                                actionPlanRequestDto
                                                .getDirectorate()
                                                .name())
                                                .orElseThrow(() -> new BadRequestException(
                                                    String.format(
                                                        "A diretoria %s não existe",
                                                        actionPlanRequestDto.getDirectorate()
                                                                                        .name())));
        List<SubtaskEntity> subtasks = actionPlanRequestDto.getSubtasks()
                                                                .stream()
                                                                .map(SubtaskEntity::new)
                                                                .toList(); 
        
        Set<UserEntity> users = new HashSet<>();
                                                
        for (String id : actionPlanRequestDto.getUsersId()) {
            String cpf = id.replaceAll("\\D", "");
            UserEntity user = userRepository.findById(cpf).orElse(null);
            if (user == null) {
                throw new NotFoundException(String.format("Usuário com CPF %s não existe", cpf));
            }
            users.add(user);
        }

        actionPlan.setUsers(users);
        actionPlan.setObjective(objective);
        actionPlan.setSubtasks(subtasks);
        actionPlan.setDirectorate(directorate);

        subtasks.forEach(subtask -> subtask.setActionPlan(actionPlan));
        actionPlanRepository.save(actionPlan);
    }

    public List<ActionPlanResponseDto> getAllActionPlan() {
        return actionPlanRepository.findAll().stream().map(ActionPlanResponseDto::new ).toList();        
    }

    public void linkUserToActionPlan(Integer actionPlanId, LinkUsersToActionPlanRequestDto requestDto) throws NotFoundException {
        
        ActionPlanEntity actionPlan = actionPlanRepository.findById(actionPlanId).orElseThrow(() -> new 
                                                NotFoundException(String.format("Plano de ação com id %d não existe", actionPlanId)));

        Set<UserEntity> users = new HashSet<>();
                                                
        for (String id : requestDto.getUsersId()) {
            String cpf = id.replaceAll("\\D", "");
            UserEntity user = userRepository.findById(cpf).orElse(null);
            if (user == null) {
                throw new NotFoundException(String.format("Usuário com CPF %s não existe", cpf));
            }
            users.add(user);
        }
        actionPlan.getUsers().addAll(users);
        actionPlanRepository.save(actionPlan);                                                                
    }

    public void updateActionPlan(Integer actionPlanId, ActionPlanRequestDto actionPlanRequestDto) throws NotFoundException, BadRequestException {

        ActionPlanEntity actionPlan = actionPlanRepository.findById(actionPlanId).orElseThrow(() -> 
                                            new NotFoundException(String.format("Plano de ação com id %d não existe", actionPlanId)));
        actionPlan.setName(actionPlanRequestDto.getName());
        actionPlan.setTerm(actionPlanRequestDto.getTerm());
        actionPlan.setProgress(actionPlanRequestDto.getProgress());
        actionPlan.setDirectorate(directorateRepository.findByDirectorateName(
                                                        actionPlanRequestDto
                                                                            .getDirectorate()
                                                                            .name())
                                                                            .orElseThrow(() -> new 
                                                                                                BadRequestException(String
                                                                                                .format("Diretoria com nome %s não existe", 
                                                                                                            actionPlanRequestDto.getDirectorate()
                                                                                                                                .name()))));
        actionPlan.setPriority(actionPlanRequestDto.getPriority());
        List<SubtaskEntity> subtasks = actionPlanRequestDto.getSubtasks()
                                                            .stream()
                                                            .map(SubtaskEntity::new)
                                                            .toList();

        subtasks.forEach(subtask -> subtask.setActionPlan(actionPlan));
        actionPlan.setSubtasks(subtasks);
        Set<UserEntity> users = new HashSet<>();

        for (String id : actionPlanRequestDto.getUsersId()) {
            String cpf = id.replaceAll("\\D", "");
            UserEntity user = userRepository.findById(cpf)
                                            .orElseThrow(() -> new NotFoundException(
                                                                    String.format("Usuário com CPF %s não existe",cpf)));
            users.add(user);
        }
        actionPlan.setUsers(users);
        actionPlanRepository.save(actionPlan); 
    }

    public void updateActionPlanStatus(Integer id, ActionPlanStatusRequestDto actionPlanStatusRequestDto) throws NotFoundException {
        ActionPlanEntity actionPlan = actionPlanRepository.findById(id)
                                                            .orElseThrow(() -> new 
                                                                            NotFoundException(String.format("Plano de ação com id %d não existe", id)));
        if(actionPlanStatusRequestDto.getProgress() != null) actionPlan.setProgress(actionPlanStatusRequestDto.getProgress());
        actionPlanRepository.save(actionPlan);
    }

    public void updateActionPlanSubtask(Integer actionPlanId, Integer subtaskId) throws NotFoundException {
        actionPlanRepository.findById(actionPlanId).orElseThrow(
                                                     () -> new NotFoundException(String.format("Plano de ação com id %d não existe", actionPlanId)));
        
        SubtaskEntity subtask = subtaskRepository.findById(subtaskId).orElseThrow(
                                                     () -> new NotFoundException(String.format("Tarefa com id %d não existe", subtaskId)));

        subtask.setDone(!subtask.getDone());
        subtaskRepository.save(subtask);
    }

    public void deleteActionPlan(Integer actionPlanId) throws NotFoundException {
        ActionPlanEntity actionPlan = actionPlanRepository.findById(actionPlanId).orElseThrow(
                                                     () -> new NotFoundException(String.format("Plano de ação com id %d não existe", actionPlanId)));

        actionPlanRepository.delete(actionPlan);
    }
}
