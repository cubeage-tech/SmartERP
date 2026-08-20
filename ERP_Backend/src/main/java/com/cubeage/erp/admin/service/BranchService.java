package com.cubeage.erp.admin.service;

import com.cubeage.erp.admin.dto.BranchRequest;
import com.cubeage.erp.admin.entity.Branch;
import com.cubeage.erp.admin.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BranchService {

    private final BranchRepository branchRepository;

    public Branch create(
            BranchRequest request
    ) {

        if (branchRepository
                .existsByTenantIdAndNameIgnoreCase(
                        request.getTenantId(),
                        request.getName()
                )) {

            throw new RuntimeException(
                    "Branch already exists"
            );
        }

        Branch branch = Branch.builder()
                .tenantId(
                        request.getTenantId()
                )
                .name(
                        request.getName()
                )
                .address(
                        request.getAddress()
                )
                .currency(
                        request.getCurrency()
                )
                .active(true)
                .build();

        return branchRepository.save(branch);
    }

    @Transactional(readOnly = true)
    public List<Branch> getAll(
            Long tenantId
    ) {

        return branchRepository
                .findByTenantIdOrderByNameAsc(
                        tenantId
                );
    }

    @Transactional(readOnly = true)
    public Branch getById(
            Long id,
            Long tenantId
    ) {

        return branchRepository
                .findByIdAndTenantId(
                        id,
                        tenantId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Branch not found"
                        )
                );
    }

    public Branch update(
            Long id,
            BranchRequest request
    ) {

        Branch branch =
                getById(
                        id,
                        request.getTenantId()
                );

        branch.setName(
                request.getName()
        );

        branch.setAddress(
                request.getAddress()
        );

        branch.setCurrency(
                request.getCurrency()
        );

        return branchRepository.save(
                branch
        );
    }
}