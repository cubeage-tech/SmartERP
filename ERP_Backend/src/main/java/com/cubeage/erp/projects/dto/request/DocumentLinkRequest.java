package com.cubeage.erp.projects.dto.request; import jakarta.validation.constraints.NotNull;
public record DocumentLinkRequest(Long taskId,@NotNull Long documentId,String documentTitle) {}
