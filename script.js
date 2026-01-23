// ===============================
// KONSTANT BISNIS MINUMO
// ===============================
const MODAL_PER_GALON = 4000;
const INFAQ_PER_GALON = 500;

// ===============================
// LOAD DATA DARI LOCAL STORAGE
// ===============================
let data = JSON.parse(localStorage.getItem("minumoData")) || [];

// ===============================
// SIMPAN DATA KE LOCAL STORAGE
// ===============================
function simpanData() {
  localStorage.setItem("minumoData", JSON.stringify(data));
}

// ===============================
// TAMBAH DATA
// ===============================
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

  const total = jumlah * harga;
  const potongan = jenis === "Pemasukan" ? jumlah * INFAQ_PER_GALON : 0;
  const modal = jenis === "Pemasukan" ? jumlah * MODAL_PER_GALON : 0;
  const profit = jenis === "Pemasukan" ? total - modal - potongan : -total;

  data.push({
    nama,
    tanggal,
    jenis,
    jumlah,
    harga,
    total,
    potongan,
    modal,
    profit
  });

  simpanData();
  renderTable();
  updateInfo();

  document.getElementById("namaPelanggan").value = "";
  document.getElementById("jumlah").value = "";
  document.getElementById("harga").value = "";
}

// ===============================
// TAMPILKAN DATA KE TABEL
// ===============================
function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.tanggal}</td>
      <td>${item.jenis}</td>
      <td>${item.jumlah}</td>
      <td>${item.harga}</td>
      <td>${item.potongan}</td>
      <td><button onclick="hapusBaris(${index})">Hapus</button></td>
    `;
    tbody.appendChild(row);
  });
}

// ===============================
// HAPUS SATU BARIS
// ===============================
function hapusBaris(index) {
  data.splice(index, 1);
  simpanData();
  renderTable();
  updateInfo();
}

// ===============================
// HAPUS SEMUA DATA
// ===============================
function hapusSemua() {
  if (confirm("Yakin mau hapus semua data?")) {
    data = [];
    simpanData();
    renderTable();
    updateInfo();
  }
}

// ===============================
// HITUNG TOTAL (EXTEND, BUKAN GANTI)
// ===============================
function updateInfo() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalInfaq = 0;
  let totalGalon = 0;
  let totalModal = 0;
  let profitOperasional = 0;

  data.forEach(item => {
    if (item.jenis === "Pemasukan") {
      totalPemasukan += item.total;
      totalGalon += item.jumlah;
      totalInfaq += item.potongan;
      totalModal += item.modal;
      profitOperasional += item.profit;
    } else {
      totalPengeluaran += item.total;
    }
  });

  document.getElementById("totalPemasukan").textContent = totalPemasukan;
  document.getElementById("totalPengeluaran").textContent = totalPengeluaran;
  document.getElementById("saldoAkhir").textContent =
    profitOperasional - totalPengeluaran;

  document.getElementById("totalInfaq").textContent = totalInfaq;

  // 👉 data tambahan (belum ditampilkan di HTML, tapi SIAP)
  console.log("Total Galon:", totalGalon);
  console.log("Total Modal:", totalModal);
  console.log("Profit Operasional:", profitOperasional);
}

// ===============================
// EXPORT EXCEL (TETAP + TAMBAHAN)
// ===============================
function exportExcel() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const exportData = data.map((item, i) => ({
    No: i + 1,
    "Nama Pelanggan": item.nama,
    Tanggal: item.tanggal,
    Jenis: item.jenis,
    Galon: item.jumlah,
    Harga: item.harga,
    Omzet: item.total,
    Modal: item.modal,
    Infaq: item.potongan,
    Profit: item.profit
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "MINUMO");

  XLSX.writeFile(workbook, "Pembukuan_MINUMO.xlsx");
}

// ===============================
// EXPORT PDF (LOGIC SIAP, TAMPILAN NANTI)
// ===============================
function exportPDF() {
  alert("PDF tetap versi lama, profit akan ditambahkan di tahap berikutnya.");
}

// ===============================
// LOAD DATA SAAT APP DIBUKA
// ===============================
renderTable();
updateInfo();
