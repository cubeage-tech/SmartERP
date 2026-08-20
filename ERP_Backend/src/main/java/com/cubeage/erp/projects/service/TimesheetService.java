package com.cubeage.erp.projects.service;
import com.cubeage.erp.projects.dto.request.CreateTimesheetRequest; import com.cubeage.erp.projects.dto.response.TimesheetResponse; import java.util.List;
public interface TimesheetService {
 TimesheetResponse create(Long tenantId,Long userId,String userName,CreateTimesheetRequest request);
 TimesheetResponse submit(Long tenantId,Long userId,Long id);
 TimesheetResponse approve(Long tenantId,Long approverId,String approverName,Long id);
 TimesheetResponse reject(Long tenantId,Long approverId,String approverName,Long id);
 List<TimesheetResponse> my(Long tenantId,Long userId);
 List<TimesheetResponse> project(Long tenantId,Long projectId);
}
