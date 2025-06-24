import * as XLSX from "xlsx";

/**
 * Đọc file excel và trả về mảng studentIds (chuỗi), lấy từ cột có header 'ID'
 * @param {File} file - file excel
 * @returns {Promise<string[]>}
 */
export async function unpackExcelStudentIds(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (!json.length) return resolve([]);
      // Tìm cột có header là 'ID' (không phân biệt hoa thường)
      const headerRow = json[0].map((h) => String(h).trim().toLowerCase());
      const idColIdx = headerRow.findIndex((h) => h === "id");
      if (idColIdx === -1) return resolve([]);
      const studentIds = json
        .slice(1)
        .map((row) => String(row[idColIdx] || "").trim())
        .filter((id) => !!id);
      resolve(studentIds);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
