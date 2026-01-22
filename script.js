let data = [];

function tambahData() {
  const nama = document.getElementById("namaPelanggan").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  const harga = parseInt(document.getElementById("harga").value) || 0;

  const potongan = jumlah * 500;

  if (!nama || !tanggal || jumlah <= 0 || harga <= 0) {
    alert("Isi semua data dengan benar!");
    return;
  }

  data.push({ nama, tanggal, jenis, jumlah, harga, potongan });

  renderTable();
  updateInfo();

  // reset input biar enak input berikutnya
  document.getElementById("namaPelanggan").value = "";
  document.getElementById("jumlah").value = "";
  document.getElementById("harga").value = "";
}

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

function hapusBaris(index) {
  data.splice(index, 1);
  renderTable();
  updateInfo();
}

function hapusSemua() {
  if (confirm("Yakin mau hapus semua data?")) {
    data = [];
    renderTable();
    updateInfo();
  }
}

function updateInfo() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalInfaq = 0;

  data.forEach((item) => {
    const total = item.jumlah * item.harga;

    if (item.jenis === "Pemasukan") totalPemasukan += total;
    else totalPengeluaran += total;

    totalInfaq += item.potongan;
  });

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  document.getElementById("totalPemasukan").textContent = totalPemasukan;
  document.getElementById("totalPengeluaran").textContent = totalPengeluaran;
  document.getElementById("saldoAkhir").textContent = saldoAkhir;
  document.getElementById("totalInfaq").textContent = totalInfaq;
}

/* ===========================
   EXPORT EXCEL
=========================== */
function exportExcel() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const exportData = data.map((item, no) => ({
    No: no + 1,
    "Nama Pelanggan": item.nama,
    Tanggal: item.tanggal,
    Jenis: item.jenis,
    "Jumlah Barang": item.jumlah,
    "Harga Barang": item.harga,
    "Total": item.jumlah * item.harga,
    "Potongan Infaq": item.potongan,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "MINUMO");

  XLSX.writeFile(workbook, "Pembukuan_MINUMO.xlsx");
}

/* ===========================
   EXPORT PDF
=========================== */
function exportPDF() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text('Makmur Sentosa "MINUMO"', 14, 15);

  doc.setFontSize(10);
  doc.text(`Export: ${new Date().toLocaleString("id-ID")}`, 14, 22);

  const head = [[
    "No",
    "Nama Pelanggan",
    "Tanggal",
    "Jenis",
    "Jumlah",
    "Harga",
    "Total",
    "Infaq"
  ]];

  const body = data.map((item, i) => ([
    i + 1,
    item.nama,
    item.tanggal,
    item.jenis,
    item.jumlah,
    item.harga,
    item.jumlah * item.harga,
    item.potongan
  ]));

  doc.autoTable({
    head: head,
    body: body,
    startY: 28
  });

  // hitung ringkasan
  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let totalInfaq = 0;

  data.forEach((item) => {
    const total = item.jumlah * item.harga;
    if (item.jenis === "Pemasukan") totalPemasukan += total;
    else totalPengeluaran += total;
    totalInfaq += item.potongan;
  });

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  let y = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Pemasukan: ${totalPemasukan}`, 14, y);
  doc.text(`Total Pengeluaran: ${totalPengeluaran}`, 14, y + 6);
  doc.text(`Saldo Akhir: ${saldoAkhir}`, 14, y + 12);
  doc.text(`Akumulasi Infaq: ${totalInfaq}`, 14, y + 18);

  doc.save("Pembukuan_MINUMO.pdf");
}
