package com.cubeage.erp.documents.exception;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DocumentNotFoundException extends ResourceNotFoundException {
    public DocumentNotFoundException(Long id) {
        super("Document not found with id: " + id);
    }
}