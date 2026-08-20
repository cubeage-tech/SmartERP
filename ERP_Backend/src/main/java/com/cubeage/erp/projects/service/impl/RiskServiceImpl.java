package com.cubeage.erp.projects.service.impl;
import com.cubeage.erp.projects.dto.request.RiskRequest; import com.cubeage.erp.projects.dto.response.RiskResponse;
import com.cubeage.erp.projects.entity.*; import com.cubeage.erp.projects.enums.RiskStatus; import com.cubeage.erp.projects.exception.*;
import com.cubeage.erp.projects.mapper.ProjectMapper; import com.cubeage.erp.projects.repository.*; import com.cubeage.erp.projects.service.RiskService;
import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.util.List;
@Service @RequiredArgsConstructor @Transactional
public class RiskServiceImpl implements RiskService {
 private final ProjectRepository projectRepository; private final ProjectTaskRepository taskRepository; private final ProjectRiskRepository repository; private final ProjectMapper mapper;
 @Override public RiskResponse create(Long tenantId,Long projectId,RiskRequest r){Project p=projectRepository.findByIdAndTenantId(projectId,tenantId).orElseThrow(()->new ProjectNotFoundException(projectId));ProjectTask t=null;if(r.taskId()!=null){t=taskRepository.findByIdAndTenantId(r.taskId(),tenantId).orElseThrow(()->new TaskNotFoundException(r.taskId()));if(!t.getProject().getId().equals(projectId))throw new ProjectValidationException("Task does not belong to project");}ProjectRisk risk=ProjectRisk.builder().tenantId(tenantId).project(p).task(t).title(r.title()).description(r.description()).type(r.type()).level(r.level()).status(RiskStatus.OPEN).probabilityPercent(r.probabilityPercent()).impactScore(r.impactScore()).mitigationPlan(r.mitigationPlan()).ownerUserId(r.ownerUserId()).ownerName(r.ownerName()).aiGenerated(false).build();return mapper.risk(repository.save(risk));}
 @Override @Transactional(readOnly=true) public List<RiskResponse> list(Long tenantId,Long projectId){return repository.findByTenantIdAndProject_IdOrderByCreatedAtDesc(tenantId,projectId).stream().map(mapper::risk).toList();}
 @Override public RiskResponse resolve(Long tenantId,Long riskId){ProjectRisk r=repository.findByIdAndTenantId(riskId,tenantId).orElseThrow(()->new ProjectValidationException("Risk not found: "+riskId));r.setStatus(RiskStatus.RESOLVED);return mapper.risk(repository.save(r));}
}
