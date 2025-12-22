const sheetId = "1U7aPpLyUdDa1u1MOhX7i1nq4N-8UzvrlnGjLM6wI9hY";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

console.log("👉 Fetch URL:", url);

fetch(url)
  .then(res => res.text())
  .then(text => {
    console.log("👉 Raw response:", text.substring(0, 200));

    const json = JSON.parse(text.substring(47).slice(0, -2));
    console.log("👉 Parsed JSON:", json);

    const rows = json.table.rows;
    console.log("👉 Rows:", rows);

    const container = document.getElementById("products");

    if (!container) {
      console.error("❌ Không tìm thấy div #products");
      return;
    }

    container.innerHTML = "";

    if (!rows || rows.length === 0) {
      container.innerHTML = "<p>Không có sản phẩm</p>";
      return;
    }

    rows.forEach((r, i) => {
      console.log(`👉 Row ${i}:`, r);

      const ten = r.c[1]?.v || "";
      const gia = Number(r.c[2]?.v || 0);
      const anh = r.c[3]?.v || "";

      if (!ten) return; // bỏ dòng trống

      container.innerHTML += `
        <div class="product">
          <img src="${anh}">
          <h3>${ten}</h3>
          <div class="price">${gia.toLocaleString()} ₫</div>
          <button onclick='addToCart(${JSON.stringify({
            id: ten,
            name: ten,
            price: gia,
            image: anh
          })})'>
            Mua ngay
          </button>
        </div>
      `;
    });
  })
  .catch(err => {
    console.error("❌ Fetch error:", err);
    document.getElementById("products").innerHTML =
      "<p>Lỗi tải sản phẩm</p>";
  });
