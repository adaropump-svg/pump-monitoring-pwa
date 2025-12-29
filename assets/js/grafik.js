document.addEventListener("DOMContentLoaded",()=>{

let chart;
const ctx = document.getElementById("chartGrafik").getContext("2d");

const lokasi   = document.getElementById("lokasi");
const kategori = document.getElementById("kategori");
const unit     = document.getElementById("unit");
const tahun    = document.getElementById("tahun");
const bulan    = document.getElementById("bulan");
const tanggal  = document.getElementById("tanggal");

// ================= DATA UNIT =================
const unitData = {
  adaro:["MP 01","MP 02","MP 06","MP 08","BP 01","BP 02"],
  sis:Array.from({length:101},(_,i)=>"ATS "+(100+i)),
  sera:["ATS 131","ATS 132","ATS 134","ATS 321"],
  maco:["ATS 211","ATS 213","ATS 214"]
};

// ================= WARNA PER KATEGORI =================
const kategoriCfg = {
  volume:  { label:"Volume (M3)",   color:"#1f77b4" },
  elevasi: { label:"Elevasi (M)",    color:"#ff7f0e" },
  kwh:     { label:"KWH",            color:"#2ca02c" },
  fuel:    { label:"Fuel (Liter)",   color:"#d62728" },
  running: { label:"Running Hour",   color:"#9467bd" }
};

// ================= TAHUN =================
for(let y=2025;y<=2033;y++){
  tahun.innerHTML += `<option>${y}</option>`;
}

// ================= TANGGAL =================
function updateTanggal(){
  tanggal.innerHTML='<option value="">-- Optional --</option>';

  if(bulan.value==="yearly"){
    tanggal.disabled=true;
    return;
  }

  tanggal.disabled=false;
  const days=new Date(tahun.value,Number(bulan.value)+1,0).getDate();
  for(let i=1;i<=days;i++){
    tanggal.innerHTML+=`<option>${i}</option>`;
  }
}
bulan.addEventListener("change",updateTanggal);
tahun.addEventListener("change",updateTanggal);

// ================= UNIT =================
lokasi.addEventListener("change",()=>{
  unit.innerHTML='<option value="">-- Pilih Unit --</option>';

  if(lokasi.value==="all"){
    unit.disabled=true;
    updateChart();
    return;
  }

  unit.disabled=false;
  unitData[lokasi.value].forEach(u=>{
    unit.innerHTML+=`<option>${u}</option>`;
  });
  updateChart();
});

// ================= FILTER DATA RECORD =================
function getFilteredData(){
  return window.DATA_RECORD.filter(d=>{
    if(lokasi.value!=="all" && d.lokasi!==lokasi.value) return false;
    if(unit.value && d.unit!==unit.value) return false;

    const t = new Date(d.tanggal);
    if(t.getFullYear()!=tahun.value) return false;

    if(bulan.value!=="yearly" && t.getMonth()!=bulan.value) return false;
    if(tanggal.value && t.getDate()!=tanggal.value) return false;

    return true;
  });
}

// ================= RENDER CHART =================
function renderChart(type, labels, datasets, title, stacked=false){
  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type,
    data:{ labels, datasets },
    options:{
      responsive:true,
      plugins:{
        title:{ display:true, text:title },
        datalabels:{
          color:"#000",
          anchor:"end",
          align:"top",
          formatter:v=>v
        }
      },
      scales:{
        x:{ stacked },
        y:{ stacked }
      }
    },
    plugins:[ChartDataLabels]
  });
}

// ================= UPDATE CHART =================
function updateChart(){

  const data = getFilteredData();
  const cfg = kategoriCfg[kategori.value] || {label:kategori.value,color:"#555"};

  // ================= ELEVASI = LINE PER LOKASI SAJA =================
  if(kategori.value === "elevasi" && lokasi.value !== "all" && !unit.value){

    // group per tanggal
    const map = {};
    data.forEach(d=>{
      if(!map[d.tanggal]) map[d.tanggal]=0;
      map[d.tanggal] += Number(d.elevasi || 0);
    });

    const labels = Object.keys(map);
    const values = Object.values(map);

    renderChart(
      "line",
      labels,
      [{
        label: cfg.label,
        data: values,
        borderColor: cfg.color,
        backgroundColor: cfg.color,
        fill: false,
        tension: 0.4      // smooth line
      }],
      `${cfg.label} - ${lokasi.value.toUpperCase()}`
    );
    return;
  }

  // ===== YEARLY (12 BULAN) =====
  if(bulan.value==="yearly"){
    const bulanLabel=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const values = Array(12).fill(0);

    data.forEach(d=>{
      const m=new Date(d.tanggal).getMonth();
      values[m]+=Number(d[kategori.value]||0);
    });

    renderChart(
      "bar",
      bulanLabel,
      [{
        label:cfg.label,
        data:values,
        backgroundColor:cfg.color
      }],
      `${cfg.label} - YEARLY ${tahun.value}`
    );
    return;
  }

  // ===== ALL LOCATION (STACKED) =====
  if(lokasi.value==="all"){
    const lokasiList=["adaro","sis","sera","maco"];
    const datasets = lokasiList.map(loc=>{
      const vals = Array(12).fill(0);

      data.filter(d=>d.lokasi===loc).forEach(d=>{
        const m=new Date(d.tanggal).getMonth();
        vals[m]+=Number(d[kategori.value]||0);
      });

      return {
        label:loc.toUpperCase(),
        data:vals,
        backgroundColor:({
          adaro:"#1f77b4",
          sis:"#ff7f0e",
          sera:"#2ca02c",
          maco:"#d62728"
        })[loc]
      };
    });

    renderChart(
      "bar",
      ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
      datasets,
      `${cfg.label} - All Location`,
      true
    );
    return;
  }

  // ===== PER LOKASI =====
  if(lokasi.value!=="all" && !unit.value){
    const unitList=[...new Set(data.map(d=>d.unit))];
    const values = unitList.map(u=>{
      return data.filter(d=>d.unit===u)
                 .reduce((s,d)=>s+Number(d[kategori.value]||0),0);
    });

    renderChart(
      "bar",
      unitList,
      [{
        label:cfg.label,
        data:values,
        backgroundColor:cfg.color
      }],
      `${cfg.label} - ${lokasi.value.toUpperCase()}`
    );
    return;
  }

  // ===== PER UNIT (LINE) =====
  if(unit.value){
    const labels = data.map(d=>d.tanggal);
    const values = data.map(d=>Number(d[kategori.value]||0));

    renderChart(
      "line",
      labels,
      [{
        label:cfg.label,
        data:values,
        borderColor:cfg.color,
        backgroundColor:cfg.color,
        fill:false,
        tension:0.3
      }],
      `${cfg.label} - ${unit.value}`
    );
  }
}

// ================= EXPORT =================
window.exportPNG=()=>{
  const a=document.createElement("a");
  a.href=chart.toBase64Image();
  a.download="grafik.png";
  a.click();
};

window.exportPDF=()=>{
  const {jsPDF}=window.jspdf;
  const pdf=new jsPDF();
  pdf.addImage(chart.toBase64Image(),"PNG",10,10,180,100);
  pdf.save("grafik.pdf");
};

// ================= EVENT =================
[kategori,unit,bulan,tahun,tanggal].forEach(el=>{
  el.addEventListener("change",updateChart);
});

// DEFAULT
updateChart();

});


