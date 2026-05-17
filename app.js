// ⚠️ 請替換成你在 Google Apps Script 部署後取得的 Web App 網址
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyR6r33DAdATfV-Dpf5yrXa2-1fBZqUn2qCMczNAHdoOGGRX7WUfdQWhkXLNy_iQg/exec"

// 網頁一打開，立刻自動載入所有歷史檔案列表
document.addEventListener("DOMContentLoaded", loadFileList);

// 函數一：從資料庫（試算表）抓取檔案清單並渲染到網頁
function loadFileList() {
  const listContainer = document.getElementById('listContainer');
  
  // 發送 GET 請求給 Google Apps Script
  fetch(GOOGLE_SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success' && data.files.length > 0) {
        listContainer.innerHTML = ""; // 清空載入中字樣
        
        // 迴圈把所有檔案倒出來做成按鈕
        data.files.forEach(file => {
          const item = document.createElement('div');
          item.className = 'file-item';
          item.innerHTML = `<span>📄 ${file.name}</span> <small style="color:#007bff;">點擊閱讀</small>`;
          
          // 綁定點擊事件：點了就在右側開啟 iframe 預覽
          item.onclick = function() {
            openPdfViewer(file.url);
          };
          listContainer.appendChild(item);
        });
      } else {
        listContainer.innerText = "目前還沒有任何人上傳試卷。";
      }
    })
    .catch(err => {
      console.error(err);
      listContainer.innerText = "無法載入清單，請檢查 API 設定。";
    });
}

// 函數二：在右側框框渲染 Google Drive PDF 線上預覽
function openPdfViewer(embedUrl) {
  const viewerPanel = document.getElementById('viewerPanel');
  // 直接將右側置換成內嵌的 PDF 閱讀器
  viewerPanel.innerHTML = `<iframe src="${embedUrl}" allow="autoplay"></iframe>`;
}

// 函數三：處理檔案上傳
function handleUpload() {
  const fileInput = document.getElementById('examFile');
  const nameInput = document.getElementById('customName');
  const statusText = document.getElementById('statusMessage');
  
  if (fileInput.files.length === 0) { return alert("請先選擇一個 PDF 檔案！"); }
  if (!nameInput.value.trim()) { return alert("請幫這份檔案取個名字！"); }

  const file = fileInput.files[0];
  // 擷取副檔名 (例如 .pdf)
  const extension = file.name.substring(file.name.lastIndexOf('.'));
  
  statusText.innerText = "正在讀取並加密檔案中...";
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const base64String = event.target.result.split(',')[1];
    
    // 打包所有資料，包含自訂名稱與副檔名
    const payload = {
      customName: nameInput.value.trim(),
      fileName: file.name,
      fileExtension: extension,
      mimeType: file.type,
      base64: base64String
    };

    statusText.innerText = "正在上傳至雲端並寫入試算表資料庫...";

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        statusText.innerText = "🎉 上傳成功！清單已更新。";
        nameInput.value = ""; // 清空輸入框
        fileInput.value = ""; // 清空檔案選取器
        
        // 重新整理左側的試卷清單，讓剛剛上傳的考卷立刻出現在列表上！
        loadFileList();
      } else {
        statusText.innerText = "❌ 失敗：" + data.message;
      }
    })
    .catch(err => {
      console.error(err);
      statusText.innerText = "❌ 連線失敗，請檢查網路。";
    });
  };
  
  reader.readAsDataURL(file);
}
