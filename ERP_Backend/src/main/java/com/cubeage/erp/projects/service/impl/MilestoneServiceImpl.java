package com.cubeage.erp.projects.service.impl;
import com.cubeage.erp.projects.dto.request.CreateMilestoneRequest; import com.cubeage.erp.projects.dto.response.MilestoneResponse;
import com.cubeage.erp.projects.entity.*; import com.cubeage.erp.projects.enums.MilestoneStatus; import com.cubeage.erp.projects.exception.*;
import com.cubeage.erp.projects.mapper.ProjectMapper; import com.cubeage.erp.projects.repository.*; import com.cubeage.erp.projects.service.MilestoneService;
import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.time.LocalDate; import java.util.List;
@Service @RequiredArgsConstructor @Transactional
public class MilestoneServiceImpl implements MilestoneService {
 private final ProjectRepository projectRepository; private final ProjectMilestoneRepository repository; private final ProjectMapper mapper;
 @Override public MilestoneResponse create(Long tenantId,Long projectId,CreateMilestoneRequest r){Project p=projectRepository.findByIdAndTenantId(projectId,tenantId).orElseThrow(()->new ProjectNotFoundException(projectId)); if(r.plannedDate().isBefore(p.getStartDate())||r.plannedDate().isAfter(p.getEndDate()))throw new ProjectValidationException("Milestone date must be inside project dates"); ProjectMilestone m=ProjectMilestone.builder().tenantId(tenantId).project(p).name(r.name()).description(r.description()).plannedDate(r.plannedDate()).status(MilestoneStatus.PLANNED).progressPercent(0).build(); return mapper.milestone(repository.save(m));}
 @Override @Transactional(readOnly=true) public List<MilestoneResponse> list(Long tenantId,Long projectId){return repository.findByTenantIdAndProject_IdOrderByPlannedDateAsc(tenantId,projectId).stream().map(mapper::milestone).toList();}
 @Override public MilestoneResponse complete(Long tenantId,Long id){ProjectMilestone m=repository.findByIdAndTenantId(id,tenantId).orElseThrow(()->new MilestoneNotFoundException(id));m.setStatus(MilestoneStatus.COMPLETED);m.setProgressPercent(100);m.setCompletedDate(LocalDate.now());return mapper.milestone(repository.save(m));}
}
