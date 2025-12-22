const sheetId = "1U7aPpLyUdDa1u1MOhX7i1nq4N-8UzvrlnGjLM6wI9hY";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

fetch(url)
  .then(res => res.text())
  .then(text => {
    // 🔥 CẮT JSON AN TOÀN
    const jsonText = text.match(/google.visualization.Query.setResponse\((.*)\);/)[1];
    const json = JSON.parse(jsonText);

    const rows = json.table.rows;
    const container = document.getElementById("products");
    container.innerHTML = "";

    if (!rows || rows.length === 0) {
      container.innerHTML = "<p>Không có sản phẩm</p>";
      return;
    }

    rows.forEach(r => {
      const ten = r.c[1]?.v || "";
      const gia = Number(r.c[2]?.v || 0);
      const anh = r.c[3]?.v || "";

      container.innerHTML += `
        <div class="product">
          <img src="${anh}" alt="${ten}">
          <h3>${ten}</h3>
          <div class="price">${gia.toLocaleString()} ₫</div>
          <button onclick='addToCart({
            id: "${ten}",
            name: "${ten}",
            price: ${gia},
            image: "${anh}"
          })'>Mua ngay</button>
        </div>
      `;
    });
  })
  .catch(err => {
    console.error("Lỗi fetch sheet:", err);
    document.getElementById("products").innerHTML =
      "<p>Lỗi tải sản phẩm</p>";
  });
