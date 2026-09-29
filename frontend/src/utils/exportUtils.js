import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Format date string for export filename & document headers
 */
export const getFormattedTimestamp = () => {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  return `${dateStr}_${timeStr}`;
};

/**
 * Helper to trigger browser file download for Blobs
 */
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export Document Data to PDF
 */
export const exportToPDF = (
  documentTitle,
  headers,
  rows,
  summaryStats = [],
) => {
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  // Header Banner
  doc.setFillColor(8, 127, 140); // Healthcare Primary Teal
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("CareSphere Healthcare System", 14, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Document Export", 196, 15, { align: "right" });

  // Document Title & Metadata
  doc.setTextColor(16, 42, 67);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(documentTitle, 14, 38);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(130, 154, 177);
  doc.text(`Generated on: ${timestamp} | System User: Administrator`, 14, 45);

  let startY = 52;

  // Add Summary Stats Cards if available
  if (summaryStats.length > 0) {
    let xPos = 14;
    const cardWidth =
      (182 - (summaryStats.length - 1) * 6) / summaryStats.length;
    summaryStats.forEach((stat) => {
      doc.setFillColor(242, 249, 248);
      doc.setDrawColor(223, 240, 239);
      doc.roundedRect(xPos, startY, cardWidth, 16, 2, 2, "FD");

      doc.setFontSize(8);
      doc.setTextColor(130, 154, 177);
      doc.text(stat.label.toUpperCase(), xPos + 4, startY + 6);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(8, 127, 140);
      doc.text(String(stat.value), xPos + 4, startY + 13);

      xPos += cardWidth + 6;
    });
    startY += 24;
  }

  // Data Table
  autoTable(doc, {
    startY: startY,
    head: [headers],
    body: rows,
    theme: "striped",
    headStyles: {
      fillColor: [8, 127, 140],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [36, 59, 83],
    },
    alternateRowStyles: {
      fillColor: [248, 251, 253],
    },
    margin: { left: 14, right: 14 },
  });

  // Footer Page Numbering
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `CareSphere Geo-Fence Management • Page ${i} of ${pageCount}`,
      105,
      288,
      { align: "center" },
    );
  }

  const safeFilename = documentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
  doc.save(`${safeFilename}_${getFormattedTimestamp()}.pdf`);
};

/**
 * Export Document Data to DOCX (Word Document)
 */
export const exportToWord = (
  documentTitle,
  headers,
  rows,
  summaryStats = [],
) => {
  const timestamp = new Date().toLocaleString();

  // Create formatted HTML content with Word XML styling
  let htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${documentTitle}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #102a43; }
        .header { background-color: #087f8c; color: white; padding: 18px 24px; border-radius: 6px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 4px 0 0 0; font-size: 12px; opacity: 0.9; }
        .title { margin-top: 24px; font-size: 18px; color: #087f8c; border-bottom: 2px solid #087f8c; padding-bottom: 6px; }
        .meta { font-size: 11px; color: #627d98; margin-bottom: 20px; }
        .stats-container { display: flex; gap: 12px; margin-bottom: 20px; }
        .stat-card { background: #f2f9f8; border: 1px solid #dff0ef; padding: 10px 14px; border-radius: 6px; min-width: 120px; }
        .stat-label { font-size: 10px; color: #627d98; font-weight: bold; text-transform: uppercase; }
        .stat-val { font-size: 16px; color: #087f8c; font-weight: bold; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background-color: #087f8c; color: white; text-align: left; padding: 10px; font-size: 12px; }
        td { padding: 9px 10px; border-bottom: 1px solid #e8eef2; font-size: 11px; color: #243b53; }
        tr:nth-child(even) { background-color: #f8fbfd; }
        .footer { margin-top: 40px; font-size: 10px; color: #9fb3c8; text-align: center; border-top: 1px solid #e8eef2; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CareSphere Healthcare Management System</h1>
        <p>Official System Export & Audit Document</p>
      </div>

      <h2 class="title">${documentTitle}</h2>
      <div class="meta">Exported on: ${timestamp} | Authority: Lead Administrator</div>
  `;

  if (summaryStats.length > 0) {
    htmlContent += `<div class="stats-container">`;
    summaryStats.forEach((stat) => {
      htmlContent += `
        <div class="stat-card">
          <div class="stat-label">${stat.label}</div>
          <div class="stat-val">${stat.value}</div>
        </div>
      `;
    });
    htmlContent += `</div>`;
  }

  htmlContent += `
    <table>
      <thead>
        <tr>
          ${headers.map((h) => `<th>${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${cell !== null && cell !== undefined ? cell : ""}</td>`).join("")}</tr>`,
          )
          .join("")}
      </tbody>
    </table>

    <div class="footer">
      CareSphere Geo-Fence Healthcare Application • Confidential Document
    </div>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + htmlContent], {
    type: "application/msword;charset=utf-8",
  });

  const safeFilename = documentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
  downloadBlob(blob, `${safeFilename}_${getFormattedTimestamp()}.docx`);
};

/**
 * Export Document Data to Excel (.xlsx)
 */
export const exportToExcel = (documentTitle, headers, rows) => {
  const workbook = XLSX.utils.book_new();

  // Combine headers and rows
  const data = [headers, ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths based on longest string
  const colWidths = headers.map((header, colIndex) => {
    let maxLen = header.toString().length;
    rows.forEach((row) => {
      if (row[colIndex]) {
        maxLen = Math.max(maxLen, row[colIndex].toString().length);
      }
    });
    return { wch: Math.min(Math.max(maxLen + 4, 12), 40) };
  });
  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Document Data");

  const safeFilename = documentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
  XLSX.writeFile(workbook, `${safeFilename}_${getFormattedTimestamp()}.xlsx`);
};
