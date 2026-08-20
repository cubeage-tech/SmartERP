package com.cubeage.erp.projects.service.impl;
import com.cubeage.erp.projects.dto.request.*; import com.cubeage.erp.projects.dto.response.*;
import com.cubeage.erp.projects.entity.*; import com.cubeage.erp.projects.enums.*; import com.cubeage.erp.projects.exception.*;
import com.cubeage.erp.projects.mapper.ProjectMapper; import com.cubeage.erp.projects.repository.*;
import com.cubeage.erp.projects.service.ProjectService; import com.cubeage.erp.projects.specification.ProjectSpecification;
import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal; import java.util.*;
@Service @RequiredArgsConstructor @Transactional
public class ProjectServiceImpl implements ProjectService {
 private final ProjectRepository projectRepository; private final ProjectMilestoneRepository milestoneRepository;
 private final ProjectTaskRepository taskRepository; private final ProjectMemberRepository memberRepository;
 private final ProjectDocumentLinkRepository documentRepository; private final ProjectMapper mapper;
 @Override public ProjectResponse create(Long tenantId,CreateProjectRequest r){
  if(projectRepository.existsByTenantIdAndProjectCodeIgnoreCase(tenantId,r.projectCode())) throw new ProjectValidationException("Project code already exists");
  if(r.endDate().isBefore(r.startDate())) throw new ProjectValidationException("End date cannot be before start date");
  Project p=Project.builder().tenantId(tenantId).projectCode(r.projectCode().trim().toUpperCase()).name(r.name()).description(r.description())
   .customerId(r.customerId()).customerName(r.customerName()).managerUserId(r.managerUserId()).managerName(r.managerName())
   .branchId(r.branchId()).departmentId(r.departmentId()).costCenterId(r.costCenterId()).startDate(r.startDate()).endDate(r.endDate())
   .status(ProjectStatus.PLANNING).priority(r.priority()).plannedBudget(r.plannedBudget()).actualBudget(BigDecimal.ZERO)
   .budgetAlertThresholdPercent(r.budgetAlertThresholdPercent()==null?BigDecimal.valueOf(10):r.budgetAlertThresholdPercent()).progressPercent(0).build();
  return mapper.project(projectRepository.save(p));
 }
 @Override public ProjectResponse update(Long tenantId,Long id,UpdateProjectRequest r){
  Project p=entity(tenantId,id); if(r.name()!=null)p.setName(r.name()); if(r.description()!=null)p.setDescription(r.description());
  if(r.managerUserId()!=null)p.setManagerUserId(r.managerUserId()); if(r.managerName()!=null)p.setManagerName(r.managerName());
  if(r.branchId()!=null)p.setBranchId(r.branchId()); if(r.departmentId()!=null)p.setDepartmentId(r.departmentId()); if(r.costCenterId()!=null)p.setCostCenterId(r.costCenterId());
  if(r.startDate()!=null)p.setStartDate(r.startDate()); if(r.endDate()!=null)p.setEndDate(r.endDate()); if(p.getEndDate().isBefore(p.getStartDate()))throw new ProjectValidationException("End date cannot be before start date");
  if(r.status()!=null)p.setStatus(r.status()); if(r.priority()!=null)p.setPriority(r.priority()); if(r.plannedBudget()!=null)p.setPlannedBudget(r.plannedBudget());
  if(r.budgetAlertThresholdPercent()!=null)p.setBudgetAlertThresholdPercent(r.budgetAlertThresholdPercent()); if(r.progressPercent()!=null)p.setProgressPercent(Math.max(0,Math.min(100,r.progressPercent())));
  return mapper.project(projectRepository.save(p));
 }
 @Override @Transactional(readOnly=true) public ProjectResponse get(Long tenantId,Long id){return mapper.project(entity(tenantId,id));}
 @Override @Transactional(readOnly=true) public List<ProjectResponse> all(Long tenantId){return projectRepository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream().map(mapper::project).toList();}
 @Override @Transactional(readOnly=true) public List<ProjectResponse> search(Long tenantId,ProjectSearchRequest r){return projectRepository.findAll(ProjectSpecification.build(tenantId,r)).stream().map(mapper::project).toList();}
 @Override @Transactional(readOnly=true) public GanttResponse gantt(Long tenantId,Long projectId){Project p=entity(tenantId,projectId);return new GanttResponse(mapper.project(p),milestoneRepository.findByTenantIdAndProject_IdOrderByPlannedDateAsc(tenantId,projectId).stream().map(mapper::milestone).toList(),taskRepository.findByTenantIdAndProject_IdOrderByPlannedStartDateAsc(tenantId,projectId).stream().map(mapper::task).toList());}
 @Override public ProjectMemberResponse addMember(Long tenantId,Long projectId,ProjectMemberRequest r){Project p=entity(tenantId,projectId);ProjectMember m=memberRepository.findByTenantIdAndProject_IdAndUserId(tenantId,projectId,r.userId()).orElseGet(ProjectMember::new);m.setTenantId(tenantId);m.setProject(p);m.setUserId(r.userId());m.setUserName(r.userName());m.setRole(r.role());m.setAllocationPercent(r.allocationPercent());m.setFromDate(r.fromDate());m.setToDate(r.toDate());m.setActive(true);return mapper.member(memberRepository.save(m));}
 @Override @Transactional(readOnly=true) public List<ProjectMemberResponse> members(Long tenantId,Long projectId){entity(tenantId,projectId);return memberRepository.findByTenantIdAndProject_IdAndActiveTrue(tenantId,projectId).stream().map(mapper::member).toList();}
 @Override public DocumentLinkResponse linkDocument(Long tenantId,Long projectId,DocumentLinkRequest r){Project p=entity(tenantId,projectId);ProjectTask task=null;if(r.taskId()!=null){task=taskRepository.findByIdAndTenantId(r.taskId(),tenantId).orElseThrow(()->new TaskNotFoundException(r.taskId()));if(!task.getProject().getId().equals(projectId))throw new ProjectValidationException("Task does not belong to project");}ProjectDocumentLink d=ProjectDocumentLink.builder().tenantId(tenantId).project(p).task(task).documentId(r.documentId()).documentTitle(r.documentTitle()).build();return mapper.document(documentRepository.save(d));}
 @Override @Transactional(readOnly=true) public List<DocumentLinkResponse> documents(Long tenantId,Long projectId){entity(tenantId,projectId);return documentRepository.findByTenantIdAndProject_IdOrderByCreatedAtDesc(tenantId,projectId).stream().map(mapper::document).toList();}
 private Project entity(Long tenantId,Long id){return projectRepository.findByIdAndTenantId(id,tenantId).orElseThrow(()->new ProjectNotFoundException(id));}
}
