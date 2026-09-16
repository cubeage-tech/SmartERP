package com.cubeage.erp.reports.generator;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class ExcelReportGenerator {

    public static byte[] generateExcel(String title, List<String> columns, List<Map<String, Object>> data) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" ");
        sb.append("xmlns:x=\"urn:schemas-microsoft-com:office:excel\" ");
        sb.append("xmlns=\"http://www.w3.org/TR/REC-html40\">\n");
        sb.append("<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
        sb.append("<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>\n");
        sb.append("<x:Name>").append(title).append("</x:Name>\n");
        sb.append("<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>\n");
        sb.append("</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->\n");
        sb.append("<style>\n");
        sb.append("table { border-collapse: collapse; font-family: sans-serif; }\n");
        sb.append("th { background-color: #f2f2f2; border: 1px solid #dddddd; padding: 8px; text-align: left; }\n");
        sb.append("td { border: 1px solid #dddddd; padding: 8px; text-align: left; }\n");
        sb.append(".title { font-size: 16pt; font-weight: bold; margin-bottom: 20px; }\n");
        sb.append("</style>\n</head>\n<body>\n");
        sb.append("<div class=\"title\">").append(title).append("</div>\n");
        sb.append("<table>\n<thead>\n<tr>\n");

        for (String col : columns) {
            sb.append("<th>").append(col).append("</th>\n");
        }
        sb.append("</tr>\n</thead>\n<tbody>\n");

        for (Map<String, Object> row : data) {
            sb.append("<tr>\n");
            for (String col : columns) {
                Object val = row.get(col);
                sb.append("<td>").append(val == null ? "" : val.toString()).append("</td>\n");
            }
            sb.append("</tr>\n");
        }
        sb.append("</tbody>\n</table>\n</body>\n</html>");

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }
}
