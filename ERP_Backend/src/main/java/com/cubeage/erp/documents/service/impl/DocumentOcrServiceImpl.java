package com.cubeage.erp.documents.service.impl;

import com.cubeage.erp.documents.dto.ocr.OcrExtractionResponse;
import com.cubeage.erp.documents.dto.ocr.OcrStatsResponse;
import com.cubeage.erp.documents.entity.Document;
import com.cubeage.erp.documents.entity.OcrExtraction;
import com.cubeage.erp.documents.enums.OcrStatus;
import com.cubeage.erp.documents.exception.DocumentNotFoundException;
import com.cubeage.erp.documents.mapper.OcrMapper;
import com.cubeage.erp.documents.repository.DocumentRepository;
import com.cubeage.erp.documents.repository.OcrExtractionRepository;
import com.cubeage.erp.documents.service.DocumentOcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentOcrServiceImpl implements DocumentOcrService {

    private static final double TARGET_ACCURACY = 98.0;

    private final OcrExtractionRepository ocrRepository;
    private final DocumentRepository documentRepository;
    private final OcrMapper mapper;

    @Override
    public OcrExtractionResponse process(Long companyId, Long documentId) {
        Document document = documentRepository.findByIdAndCompanyId(documentId, companyId)
                .orElseThrow(() -> new DocumentNotFoundException(documentId));

        OcrExtraction extraction = ocrRepository
                .findByDocument_IdAndCompanyId(documentId, companyId)
                .orElseGet(() -> OcrExtraction.builder()
                        .companyId(companyId)
                        .document(document)
                        .autoPostedToGl(false)
                        .manualReviewRequired(false)
                        .build());

        extraction.setStatus(OcrStatus.PROCESSING);
        extraction.setProcessedAt(LocalDateTime.now());
        extraction = ocrRepository.save(extraction);

        try {
            String text = extractText(Path.of(document.getStoragePath()));
            String normalized = text == null ? "" : text.trim();

            extraction.setExtractedText(normalized);
            extraction.setVendorName(findLineValue(normalized, "vendor"));
            extraction.setInvoiceNumber(firstNonBlank(
                    findLineValue(normalized, "invoice no"),
                    findLineValue(normalized, "invoice number"),
                    findLineValue(normalized, "invoice")
            ));
            extraction.setInvoiceDate(firstNonBlank(
                    findLineValue(normalized, "invoice date"),
                    findLineValue(normalized, "date")
            ));
            extraction.setAmount(extractAmount(normalized));
            extraction.setGstin(extractRegex(normalized,
                    "\\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]\\b"));
            extraction.setHsnCode(extractRegex(normalized, "(?i)\\bHSN\\s*(?:Code)?\\s*[:#-]?\\s*([0-9]{4,8})\\b"));

            double confidence = calculateHeuristicConfidence(extraction, normalized);
            extraction.setConfidence(confidence);
            extraction.setManualReviewRequired(confidence < 90.0);
            extraction.setStatus(confidence < 90.0
                    ? OcrStatus.MANUAL_REVIEW
                    : OcrStatus.COMPLETED);
            extraction.setProcessedAt(LocalDateTime.now());

            document.setOcrCompleted(true);
            document.setOcrConfidence(confidence);
            documentRepository.save(document);

            return mapper.toResponse(ocrRepository.save(extraction));

        } catch (Exception e) {
            extraction.setStatus(OcrStatus.FAILED);
            extraction.setConfidence(0.0);
            extraction.setManualReviewRequired(true);
            extraction.setProcessedAt(LocalDateTime.now());
            ocrRepository.save(extraction);

            document.setOcrCompleted(false);
            document.setOcrConfidence(0.0);
            documentRepository.save(document);

            return mapper.toResponse(extraction);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<OcrExtractionResponse> getAll(Long companyId) {
        return ocrRepository.findByCompanyIdOrderByProcessedAtDesc(companyId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OcrExtractionResponse getLatest(Long companyId) {
        return ocrRepository.findByCompanyIdOrderByProcessedAtDesc(companyId)
                .stream()
                .findFirst()
                .map(mapper::toResponse)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public OcrStatsResponse getStats(Long companyId) {
        List<OcrExtraction> all = ocrRepository.findByCompanyIdOrderByProcessedAtDesc(companyId);

        long processed = all.stream()
                .filter(item -> item.getStatus() == OcrStatus.COMPLETED
                        || item.getStatus() == OcrStatus.MANUAL_REVIEW)
                .count();

        long processedThisMonth = ocrRepository
                .countByCompanyIdAndProcessedAtGreaterThanEqual(
                        companyId,
                        YearMonth.now().atDay(1).atStartOfDay()
                );

        double averageAccuracy = ocrRepository.averageConfidence(
                companyId,
                List.of(OcrStatus.COMPLETED, OcrStatus.MANUAL_REVIEW)
        );

        long autoPostedDocuments = ocrRepository
                .countByCompanyIdAndAutoPostedToGlTrue(companyId);

        double autoPostedPercent = processed == 0
                ? 0.0
                : autoPostedDocuments * 100.0 / processed;

        long manualReviewCount = ocrRepository
                .countByCompanyIdAndManualReviewRequiredTrue(companyId);

        return new OcrStatsResponse(
                processed,
                processedThisMonth,
                averageAccuracy,
                TARGET_ACCURACY,
                autoPostedPercent,
                autoPostedDocuments,
                manualReviewCount
        );
    }

    private String extractText(Path path) {
        try {
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "";
        }
    }

    private double calculateHeuristicConfidence(OcrExtraction extraction, String text) {
        if (text == null || text.isBlank()) {
            return 0.0;
        }

        int fields = 0;
        if (notBlank(extraction.getVendorName())) fields++;
        if (notBlank(extraction.getInvoiceNumber())) fields++;
        if (notBlank(extraction.getInvoiceDate())) fields++;
        if (extraction.getAmount() != null) fields++;
        if (notBlank(extraction.getGstin())) fields++;
        if (notBlank(extraction.getHsnCode())) fields++;

        return Math.min(99.0, 88.0 + fields * 1.8);
    }

    private String findLineValue(String text, String key) {
        if (text == null || text.isBlank()) return null;

        return text.lines()
                .filter(line -> line.toLowerCase().contains(key.toLowerCase()))
                .findFirst()
                .map(line -> {
                    int index = line.indexOf(':');
                    return index >= 0 ? line.substring(index + 1).trim() : line.trim();
                })
                .filter(value -> !value.isBlank())
                .orElse(null);
    }

    private BigDecimal extractAmount(String text) {
        if (text == null) return null;

        Pattern pattern = Pattern.compile(
                "(?i)(?:grand\\s*total|invoice\\s*total|total\\s*amount|amount)" +
                        "[^0-9₹]{0,20}₹?\\s*([0-9,]+(?:\\.[0-9]{1,2})?)"
        );

        Matcher matcher = pattern.matcher(text);
        if (!matcher.find()) return null;

        try {
            return new BigDecimal(matcher.group(1).replace(",", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String extractRegex(String text, String regex) {
        if (text == null) return null;

        Matcher matcher = Pattern.compile(regex).matcher(text);
        if (!matcher.find()) return null;

        return matcher.groupCount() > 0 ? matcher.group(1) : matcher.group();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (notBlank(value)) return value;
        }
        return null;
    }

    private boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }
}
