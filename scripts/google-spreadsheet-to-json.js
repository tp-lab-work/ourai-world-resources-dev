const fs = require("fs");
const axios = require("axios");
const { parse } = require("csv-parse/sync");

// 引数の取得
const spreadsheetId = process.env.SPREADSHEET_FILE_ID;
const gid = process.env.GID || "0"; // シートID（GID）を指定。デフォルトは最初のシート
const destinationPath = process.env.DESTINATION_PATH;

// CSVのダウンロードURL
const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

// CSVをダウンロードしてJSONに変換
async function downloadAndConvertCSVToJSON() {
  try {
    const response = await axios.get(url);

    // CSVデータをパースし、JSONに変換
    const jsonData = parse(response.data, { columns: true });
    console.log("CSV has been successfully converted to JSON.");
    // JSONファイルとして保存
    try {
      fs.writeFileSync(destinationPath, JSON.stringify(jsonData));
      console.log("JSON file saved successfully.");
    } catch (writeError) {
      console.error("Error writing JSON file:", writeError);
      throw writeError;
    }
  } catch (downloadError) {
    console.error("Error downloading spreadsheet:", downloadError);
    throw downloadError;
  }
}

downloadAndConvertCSVToJSON();
