// =====================================
// KONSTANTA BISNIS
// =====================================
const MODAL_PER_GALON = 4000;
const INFAQ_PER_GALON = 500;

// =====================================
// LOAD DATA DARI LOCAL STORAGE
// =====================================
let data = JSON.parse(localStorage.getItem("minumoData")) || [];

// =====================================
// HELPER AMAN UNTUK SET TEXT
// =====================================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// =====================================
// SIMPAN DATA
// =====================================
function simpanData() {
  localStorage.setItem("minumoData", JSON.stringify(data));
}

// =====================================
// TAMBAH DATA
// =====================================
function tambahData() {
  const nama = document.getElementById("namaPelanggan").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  const harga = parseInt(document.getElementById("harga").value) || 0;

  if (!nama || !tanggal || jumlah <= 0 || harga <= 0) {
    alert("Isi semua data dengan benar!");
    return;
  }

  const potongan = jenis === "Pemasukan" ? jumlah * INFAQ_PER_GALON : 0;

  data.push({ nama, tanggal, jenis, jumlah, harga, potongan });
  simpanData();
  renderTable();
  updateInfo();

  document.getElementById("namaPelanggan").value = "";
  document.getElementById("jumlah").value = "";
  document.getElementById("harga").value = "";
}

// =====================================
// TAMPILKAN DATA KE TABEL
// =====================================
function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.tanggal}</td>
      <td>${item.jenis}</td>
      <td>${item.jumlah}</td>
      <td>Rp ${item.harga.toLocaleString("id-ID")}</td>
      <td>Rp ${item.potongan.toLocaleString("id-ID")}</td>
      <td><button onclick="hapusBaris(${index})">Hapus</button></td>
    `;
    tbody.appendChild(row);
  });
}

// =====================================
// HAPUS SATU BARIS
// =====================================
function hapusBaris(index) {
  data.splice(index, 1);
  simpanData();
  renderTable();
  updateInfo();
}

// =====================================
// HAPUS SEMUA DATA
// =====================================
function hapusSemua() {
  if (confirm("Yakin mau hapus semua data?")) {
    data = [];
    simpanData();
    renderTable();
    updateInfo();
  }
}

// =====================================
// HITUNG TOTAL + PROFIT
// =====================================
function updateInfo() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalInfaq = 0;
  let totalGalon = 0;

  data.forEach(item => {
    const total = item.jumlah * item.harga;

    if (item.jenis === "Pemasukan") {
      totalPemasukan += total;
      totalGalon += item.jumlah;
      totalInfaq += item.potongan;
    } else {
      totalPengeluaran += total;
    }
  });

  const totalModal = totalGalon * MODAL_PER_GALON;
  const profitOperasional =
    totalPemasukan - totalModal - totalInfaq - totalPengeluaran;

  setText("totalPemasukan", totalPemasukan.toLocaleString("id-ID"));
  setText("totalPengeluaran", totalPengeluaran.toLocaleString("id-ID"));
  setText("saldoAkhir", (totalPemasukan - totalPengeluaran).toLocaleString("id-ID"));
  setText("totalInfaq", totalInfaq.toLocaleString("id-ID"));

  // TAMBAHAN INFO
  setText("totalGalon", totalGalon.toLocaleString("id-ID"));
  setText("totalModal", totalModal.toLocaleString("id-ID"));
  setText("profitOperasional", profitOperasional.toLocaleString("id-ID"));
}

// =====================================
// EXPORT EXCEL
// =====================================
function exportExcel() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const exportData = data.map((item, i) => ({
    No: i + 1,
    Nama: item.nama,
    Tanggal: item.tanggal,
    Jenis: item.jenis,
    Jumlah: item.jumlah,
    Harga: item.harga,
    Total: item.jumlah * item.harga,
    Infaq: item.potongan
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "MINUMO");

  XLSX.writeFile(workbook, "Pembukuan_MINUMO.xlsx");
}

// =====================================
// EXPORT PDF (STABIL)
// =====================================
function exportPDF() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF("p", "mm", "a4");

  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalInfaq = 0;
  let totalGalon = 0;

  data.forEach(item => {
    const total = item.jumlah * item.harga;
    if (item.jenis === "Pemasukan") {
      totalPemasukan += total;
      totalGalon += item.jumlah;
      totalInfaq += item.potongan;
    } else {
      totalPengeluaran += total;
    }
  });

  const totalModal = totalGalon * MODAL_PER_GALON;
  const profitOperasional =
    totalPemasukan - totalModal - totalInfaq - totalPengeluaran;

  doc.setFontSize(16);
  doc.text('Makmur Sentosa "MINUMO"', 14, 15);
  doc.setFontSize(10);
  doc.text(`Export: ${new Date().toLocaleString("id-ID")}`, 14, 22);

  doc.autoTable({
    startY: 30,
    head: [[
      "No", "Nama", "Tanggal", "Jenis", "Galon", "Harga", "Total", "Infaq"
    ]],
    body: data.map((item, i) => ([
      i + 1,
      item.nama,
      item.tanggal,
      item.jenis,
      item.jumlah,
      `Rp ${item.harga.toLocaleString("id-ID")}`,
      `Rp ${(item.jumlah * item.harga).toLocaleString("id-ID")}`,
      `Rp ${item.potongan.toLocaleString("id-ID")}`
    ])),
    theme: "grid",
    headStyles: { fillColor: [33, 150, 243], textColor: 255 }
  });

  // ===============================
// RINGKASAN (TABEL RAPIH & SEJAJAR)
// ===============================
doc.autoTable({
  startY: doc.lastAutoTable.finalY + 10,
  theme: "plain",
  styles: {
    fontSize: 11,
    cellPadding: 2
  },
  columnStyles: {
    0: { cellWidth: 60, fontStyle: "bold" },
    1: { cellWidth: 5, halign: "center" },
    2: { cellWidth: 60 }
  },
  body: [
    ["Total Pemasukan", ":", `Rp ${totalPemasukan.toLocaleString("id-ID")}`],
    ["Total Pengeluaran", ":", `Rp ${totalPengeluaran.toLocaleString("id-ID")}`],
    ["Total Galon", ":", totalGalon.toLocaleString("id-ID")],
    ["Total Modal", ":", `Rp ${totalModal.toLocaleString("id-ID")}`],
    ["Total Infaq", ":", `Rp ${totalInfaq.toLocaleString("id-ID")}`],
    ["Profit", ":", `Rp ${profitOperasional.toLocaleString("id-ID")}`]
  ]
});


  doc.save("Pembukuan_MINUMO_Lengkap.pdf");
}

// =====================================
// LOAD AWAL
// =====================================
renderTable();
updateInfo();

