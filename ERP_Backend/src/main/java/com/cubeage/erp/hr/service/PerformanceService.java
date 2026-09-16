package com.cubeage.erp.hr.service;

import com.cubeage.erp.hr.dto.performance.DepartmentScoreResponse;
import com.cubeage.erp.hr.dto.performance.PerformanceReviewRequest;
import com.cubeage.erp.hr.dto.performance.PerformanceReviewResponse;
import com.cubeage.erp.hr.dto.performance.PerformanceSummaryResponse;
import com.cubeage.erp.hr.entity.PerformanceReview;
import com.cubeage.erp.hr.repository.PerformanceReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceService {

    private final PerformanceReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public PerformanceSummaryResponse getSummary(Long tenantId) {
        return PerformanceSummaryResponse.builder()
                .reviewPeriod("Q2 2026 Reviews")
                .description("Employee performance reviews and department scores")
                .reviews(getReviews(tenantId))
                .departmentScores(getDepartmentScores(tenantId))
                .build();
    }

    @Transactional(readOnly = true)
    public List<PerformanceReviewResponse> getReviews(Long tenantId) {
        List<PerformanceReview> list = reviewRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
        if (list.isEmpty()) {
            return getDefaultReviews(tenantId);
        }
        return list.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<DepartmentScoreResponse> getDepartmentScores(Long tenantId) {
        return List.of(
                new DepartmentScoreResponse("Finance", "4.6", "92%", 4.6),
                new DepartmentScoreResponse("Sales", "4.2", "84%", 4.2),
                new DepartmentScoreResponse("Operations", "3.9", "78%", 3.9),
                new DepartmentScoreResponse("HR", "4.5", "90%", 4.5),
                new DepartmentScoreResponse("IT", "4.1", "82%", 4.1)
        );
    }

    public PerformanceReviewResponse addReview(Long tenantId, PerformanceReviewRequest request) {
        String initials = request.getInitials();
        if ((initials == null || initials.isBlank()) && request.getEmployeeName() != null) {
            String[] parts = request.getEmployeeName().split(" ");
            initials = "";
            for (String p : parts) {
                if (!p.isBlank()) initials += p.substring(0, 1).toUpperCase();
            }
            if (initials.length() > 2) initials = initials.substring(0, 2);
        }

        PerformanceReview entity = PerformanceReview.builder()
                .tenantId(tenantId)
                .employeeId(request.getEmployeeId())
                .employeeName(request.getEmployeeName())
                .initials(initials != null ? initials : "EM")
                .designation(request.getDesignation())
                .department(request.getDepartment())
                .rating(request.getRating() != null ? request.getRating() : 5)
                .reviewPeriod(request.getReviewPeriod() != null ? request.getReviewPeriod() : "Q2 2026")
                .status(request.getStatus() != null ? request.getStatus() : "ON TRACK")
                .feedback(request.getFeedback())
                .build();

        return toResponse(reviewRepository.save(entity));
    }

    private PerformanceReviewResponse toResponse(PerformanceReview item) {
        return PerformanceReviewResponse.builder()
                .id(item.getId())
                .tenantId(item.getTenantId())
                .employeeId(item.getEmployeeId())
                .employeeName(item.getEmployeeName())
                .name(item.getEmployeeName())
                .initials(item.getInitials() != null ? item.getInitials() : "EM")
                .designation(item.getDesignation())
                .department(item.getDepartment())
                .rating(item.getRating())
                .reviewPeriod(item.getReviewPeriod())
                .status(item.getStatus())
                .feedback(item.getFeedback())
                .build();
    }

    private List<PerformanceReviewResponse> getDefaultReviews(Long tenantId) {
        return List.of(
                PerformanceReviewResponse.builder()
                        .tenantId(tenantId)
                        .initials("AM")
                        .name("Arjun Mehta")
                        .employeeName("Arjun Mehta")
                        .designation("Managing Director")
                        .rating(5)
                        .status("ON TRACK")
                        .build(),
                PerformanceReviewResponse.builder()
                        .tenantId(tenantId)
                        .initials("RS")
                        .name("Rahul Sharma")
                        .employeeName("Rahul Sharma")
                        .designation("Finance Manager")
                        .rating(4)
                        .status("ON TRACK")
                        .build(),
                PerformanceReviewResponse.builder()
                        .tenantId(tenantId)
                        .initials("AS")
                        .name("Ananya Singh")
                        .employeeName("Ananya Singh")
                        .designation("Sales Manager")
                        .rating(5)
                        .status("ON TRACK")
                        .build(),
                PerformanceReviewResponse.builder()
                        .tenantId(tenantId)
                        .initials("DR")
                        .name("Deepika Rao")
                        .employeeName("Deepika Rao")
                        .designation("HR Manager")
                        .rating(4)
                        .status("AT RISK")
                        .build(),
                PerformanceReviewResponse.builder()
                        .tenantId(tenantId)
                        .initials("VJ")
                        .name("Vikram Joshi")
                        .employeeName("Vikram Joshi")
                        .designation("Ops Manager")
                        .rating(5)
                        .status("AT RISK")
                        .build()
        );
    }
}
