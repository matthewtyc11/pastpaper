// ⚠️ 請換成你在上面「步驟一」重新新增部署後拿到的全新網址！
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyR6r33DAdATfV-Dpf5yrXa2-1fBZqUn2qCMczNAHdoOGGRX7WUfdQWhkXLNy_iQg/exec";

document.addEventListener("DOMContentLoaded", loadFileList);

function loadFileList() {
  const listContainer = document.getElementById('listContainer');
  
  // 移除所有 headers，用最純粹的請求連線
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'GET',
    redirect: 'follow'
  })
    .then(res => res.json()) // 雖然回傳是 TEXT，但內容是 JSON 字串，res.json() 可以正常解析
    .then(data => {
      if (data.status === 'success' && data.files.length > 0) {
        listContainer.innerHTML = "";
        data.files.forEach(file => {
          const item = document.createElement('div');
          item.className = 'file-item';
          item.innerHTML = `<span>📄 ${file.name}</span> <small style="color:#007bff; font-weight:bold;">線上看</small>`;
          item.onclick = function() { openPdfViewer(file.url); };
          listContainer.appendChild(item);
        });
      } else {
        listContainer.className = "placeholder-text";
        listContainer.style.fontSize = "14px";
        listContainer.innerText = "目前資料庫內還沒有檔案，歡迎成為第一位貢獻者！";
      }
    })
    .catch(err => {
      console.error(err);
      listContainer.innerText = "無法同步雲端清單，連線可能被阻擋。";
    });
}

function openPdfViewer(embedUrl) {
  const viewerPanel = document.getElementById('viewerPanel');
  viewerPanel.innerHTML = `<iframe src="${embedUrl}" allow="autoplay"></iframe>`;
}

function handleUpload() {
  const fileInput = document.getElementById('examFile');
  const nameInput = document.getElementById('customName');
  const statusText = document.getElementById('statusMessage');
  
  if (fileInput.files.length === 0) { return alert("請先選擇一個 PDF 檔案！"); }
  if (!nameInput.value.trim()) { return alert("請輸入自訂的試卷檔案名稱！"); }

  const file = fileInput.files[0];
  const extension = file.name.substring(file.name.lastIndexOf('.'));
  
  statusText.style.color = "#007bff";
  statusText.innerText = "正在將檔案打包加密中...";
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const base64String = event.target.result.split(',')[1];
    
    const payload = {
      customName: nameInput.value.trim(),
      fileName: file.name,
      fileExtension: extension,
      mimeType: file.type,
      base64: base64String
    };

    statusText.innerText = "正在上傳至 Google 雲端儲存庫...";

    // 核心修正：不帶任何 content-type header，徹底防範 CORS 阻擋
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        statusText.style.color = "#28a745";
        statusText.innerText = "🎉 上傳成功！清單已自動更新。";
        nameInput.value = ""; 
        fileInput.value = ""; 
        loadFileList(); 
      } else {
        statusText.style.color = "#dc3545";
        statusText.innerText = "❌ 上傳失敗：" + data.message;
      }
    })
    .catch(err => {
      console.error(err);
      statusText.style.color = "#dc3545";
      statusText.innerText = "❌ 連線失敗，請確認網址是否填寫正確。";
    });
  };
  
  reader.readAsDataURL(file);
}
