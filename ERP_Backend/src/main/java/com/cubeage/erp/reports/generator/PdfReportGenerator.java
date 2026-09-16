package com.cubeage.erp.reports.generator;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class PdfReportGenerator {

    public static byte[] generatePdf(String title, List<String> columns, List<Map<String, Object>> data) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        StringBuilder streamContent = new StringBuilder();
        streamContent.append("BT\n");
        streamContent.append("/F1 16 Tf\n");
        streamContent.append("50 800 Td\n");
        streamContent.append("(").append(escapePdf(title)).append(") Tj\n");
        streamContent.append("0 -30 Td\n");
        streamContent.append("/F1 10 Tf\n");

        // Headers
        StringBuilder headerRow = new StringBuilder();
        for (String col : columns) {
            headerRow.append(String.format("%-20s", col));
        }
        streamContent.append("(").append(escapePdf(headerRow.toString())).append(") Tj\n");
        streamContent.append("0 -15 Td\n");

        streamContent.append("(-------------------------------------------------------------------------------------------------) Tj\n");
        streamContent.append("0 -15 Td\n");

        // Rows
        for (Map<String, Object> row : data) {
            StringBuilder rowStr = new StringBuilder();
            for (String col : columns) {
                Object val = row.get(col);
                String valStr = val == null ? "" : val.toString();
                if (valStr.length() > 18) {
                    valStr = valStr.substring(0, 15) + "...";
                }
                rowStr.append(String.format("%-20s", valStr));
            }
            streamContent.append("(").append(escapePdf(rowStr.toString())).append(") Tj\n");
            streamContent.append("0 -15 Td\n");
        }
        streamContent.append("ET\n");

        byte[] streamBytes = streamContent.toString().getBytes(StandardCharsets.UTF_8);

        writer.println("%PDF-1.4");
        writer.println("1 0 obj");
        writer.println("<< /Type /Catalog /Pages 2 0 R >>");
        writer.println("endobj");
        writer.println("2 0 obj");
        writer.println("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
        writer.println("endobj");
        writer.println("3 0 obj");
        writer.println("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>");
        writer.println("endobj");
        writer.println("4 0 obj");
        writer.println("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
        writer.println("endobj");
        writer.println("5 0 obj");
        writer.println("<< /Length " + streamBytes.length + " >>");
        writer.flush();

        try {
            out.write("stream\n".getBytes(StandardCharsets.UTF_8));
            out.write(streamBytes);
            out.write("\nendstream\n".getBytes(StandardCharsets.UTF_8));
        } catch (Exception ignored) {}

        writer.println("endobj");
        writer.println("xref");
        writer.println("0 6");
        writer.println("0000000000 65535 f ");
        writer.println("0000000009 00000 n ");
        writer.println("0000000058 00000 n ");
        writer.println("0000000115 00000 n ");
        writer.println("0000000244 00000 n ");
        writer.println("0000000311 00000 n ");
        writer.println("trailer");
        writer.println("<< /Root 1 0 R /Size 6 >>");
        writer.println("startxref");
        writer.println("380");
        writer.println("%%EOF");
        writer.flush();

        return out.toByteArray();
    }

    private static String escapePdf(String s) {
        if (s == null) return "";
        return s.replace("(", "\\(").replace(")", "\\)");
    }
}
