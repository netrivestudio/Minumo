let data = [];

function tambahData() {
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  const harga = parseInt(document.getElementById("harga").value) || 0;
  const potongan = jumlah * 500; // Rp500 per produk untuk infaq

  if (!tanggal || jumlah <= 0 || harga <= 0) {
    alert("Isi semua field dengan benar!");
    return;
  }

  const item = { tanggal, jenis, jumlah, harga, potongan };
  data.push(item);
  renderTable();
  updateInfo();
}

function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.jenis}</td>
      <td>${item.jumlah}</td>
      <td>${item.harga}</td>
      <td>${item.potongan}</td>
      <td>
        <button onclick="hapusBaris(${index})">Hapus</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function hapusBaris(index) {
  data.splice(index, 1);
  renderTable();
  updateInfo();
}

function hapusSemua() {
  data = [];
  renderTable();
  updateInfo();
}

function updateInfo() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalInfaq = 0;

  data.forEach(item => {
    if(item.jenis === "Pemasukan") totalPemasukan += item.harga * item.jumlah;
    else totalPengeluaran += item.harga * item.jumlah;
    totalInfaq += item.potongan;
  });

  document.getElementById("totalPemasukan").textContent = totalPemasukan;
  document.getElementById("totalPengeluaran").textContent = totalPengeluaran;
  document.getElementById("saldoAkhir").textContent = totalPemasukan - totalPengeluaran;
  document.getElementById("totalInfaq").textContent = totalInfaq;
}

// Placeholder untuk Export (bisa pakai library seperti jsPDF dan SheetJS)
function exportPDF() { alert("Export PDF belum diimplementasikan"); }
function exportExcel() { alert("Export Excel belum diimplementasikan"); }
