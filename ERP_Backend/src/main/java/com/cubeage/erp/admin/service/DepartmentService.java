package com.cubeage.erp.admin.service;

import com.cubeage.erp.admin.dto.DepartmentRequest;
import com.cubeage.erp.admin.entity.Branch;
import com.cubeage.erp.admin.entity.Department;
import com.cubeage.erp.admin.repository.BranchRepository;
import com.cubeage.erp.admin.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    private final BranchRepository branchRepository;

    public Department create(
            DepartmentRequest request
    ) {

        Branch branch =
                branchRepository
                        .findByIdAndTenantId(
                                request.getBranchId(),
                                request.getTenantId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Branch not found"
                                )
                        );

        Department parent = null;

        if (request.getParentDepartmentId()
                != null) {

            parent =
                    departmentRepository
                            .findByIdAndTenantId(
                                    request
                                            .getParentDepartmentId(),
                                    request
                                            .getTenantId()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Parent department not found"
                                    )
                            );
        }

        Department department =
                Department.builder()
                        .tenantId(
                                request.getTenantId()
                        )
                        .name(
                                request.getName()
                        )
                        .branch(branch)
                        .parentDepartment(parent)
                        .active(true)
                        .build();

        return departmentRepository.save(
                department
        );
    }

    @Transactional(readOnly = true)
    public List<Department> getAll(
            Long tenantId
    ) {

        return departmentRepository
                .findByTenantIdOrderByNameAsc(
                        tenantId
                );
    }

    @Transactional(readOnly = true)
    public List<Department> getByBranch(
            Long branchId
    ) {

        return departmentRepository
                .findByBranchIdOrderByNameAsc(
                        branchId
                );
    }
}