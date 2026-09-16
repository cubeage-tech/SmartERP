package com.cubeage.erp.reports.generator;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class CsvReportGenerator {

    public static byte[] generateCsv(List<String> columns, List<Map<String, Object>> data) {
        StringBuilder sb = new StringBuilder();

        // Headers
        for (int i = 0; i < columns.size(); i++) {
            sb.append(escapeCsv(columns.get(i)));
            if (i < columns.size() - 1) sb.append(",");
        }
        sb.append("\n");

        // Rows
        for (Map<String, Object> row : data) {
            for (int i = 0; i < columns.size(); i++) {
                Object val = row.get(columns.get(i));
                sb.append(escapeCsv(val == null ? "" : val.toString()));
                if (i < columns.size() - 1) sb.append(",");
            }
            sb.append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static String escapeCsv(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n") || val.contains("\r")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }
}
