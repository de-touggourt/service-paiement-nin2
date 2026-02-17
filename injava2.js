

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>

// ============================================================
// 1. ثوابت تصميم البطاقة المهنية (CSS)
// ============================================================
const CARD_CSS = `
    :root { --primary-green: #006233; --primary-red: #D22B2B; --text-dark: #2c3e50; }
    
    /* تنسيق صفحة الطباعة A4 */
    .card-page-a4 {
        width: 210mm; min-height: 297mm; background: white; padding: 10mm;
        display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, auto);
        gap: 5mm; page-break-after: always; margin: 0 auto;
        direction: rtl;
    }

    .card-wrapper {
        width: 85.6mm; height: 54mm; position: relative;
        border: 1px solid #ddd; border-radius: 4px; overflow: hidden;
        box-sizing: border-box;
    }

    .card {
        width: 750px; height: 474px; background-color: #fff; position: absolute;
        top: 0; right: 0; transform: scale(0.431); transform-origin: top right;
        display: flex; flex-direction: column;
        background-image: linear-gradient(135deg, #ffffff 0%, #f4f8f6 100%);
    }

    .watermark {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 300px; height: 300px; opacity: 0.1; z-index: 0;
        background-image: url('https://lh3.googleusercontent.com/d/1O9TZQrn9q4iRnI1NldJNxfq0bKuc8S-u');
        background-size: contain; background-repeat: no-repeat;
    }

    .top-deco-bar { width: 100%; height: 8px; display: flex; z-index: 10; }
    .bar-green { flex: 2; background-color: var(--primary-green); }
    .bar-red { flex: 1; background-color: var(--primary-red); }

    .header {
        position: relative; z-index: 2; padding: 10px 15px 0 15px;
        display: flex; justify-content: space-between; align-items: center; height: 100px;
    }

    .main-title { font-family: 'Cairo', sans-serif; font-size: 20px; font-weight: 700; color: var(--text-dark); margin-top: -30px; text-align: center; }
    .logo-box { display: flex; flex-direction: column; align-items: center; min-width: 100px; }
    .header-logo { width: 70px; height: 70px; object-fit: contain; }
    .logo-text { font-size: 15px; font-weight: 900; margin-top: 4px; white-space: nowrap; font-family: 'Amiri', serif; }

    .card-body { position: relative; z-index: 2; display: flex; flex-grow: 1; padding: 5px 25px 0 25px; }
    .info-section { flex: 1.8; display: flex; flex-direction: column; justify-content: center; }
    
    .card-name-title {
        font-family: 'Cairo', sans-serif; font-size: 28px; font-weight: 700;
        color: var(--primary-green); border-bottom: 2px solid var(--primary-red);
        margin-bottom: 10px; width: fit-content;
    }

    .info-row { display: flex; align-items: baseline; margin-bottom: 5px; }
    .label { font-weight: 700; color: #555; min-width: 135px; font-family: 'Cairo', sans-serif; font-size: 15px; }
    .value { font-weight: 700; color: #000; margin-right: 5px; font-size: 22px; font-family: 'Amiri', serif; }

    .photo-section {
        flex: 1; display: flex; flex-direction: column; align-items: center;
        justify-content: flex-start; padding-top: 40px;
    }

    .serial-number {
        font-family: 'Cairo', sans-serif; font-weight: 700; font-size: 16px;
        color: var(--primary-red); background: rgba(210, 43, 43, 0.05);
        padding: 2px 8px; border-radius: 8px; width: 180px;
        display: flex; justify-content: space-between; margin-top: -30px; margin-bottom: 20px;
    }

    .photo-frame {
        width: 130px; height: 170px; background-color: #fafafa;
        border: 2px solid #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow: hidden;
    }
    .photo-frame img { width: 100%; height: 100%; object-fit: cover; }

    .signature-title {
        font-weight: 700; font-size: 18px; color: var(--text-dark);
        border-top: 1px solid #ddd; width: 80%; text-align: center; padding-top: 5px; font-family: 'Amiri', serif;
    }

    .barcode-container {
        width: 100%; display: flex; justify-content: center; align-items: center;
        margin-top: auto; margin-bottom: 12px; z-index: 5;
    }
    .barcode-container svg { height: 30px; width: auto; }

    .footer {
        background-color: var(--primary-green); color: white;
        display: flex; justify-content: center; align-items: center;
        width: 100%; padding: 6px 0; font-family: 'Cairo', sans-serif;
        font-size: 15px; font-weight: 600; position: relative; z-index: 10;
    }

    @media print {
        body { background: white; padding: 0; margin: 0; }
        .card-page-a4 { border: none; padding: 10mm; margin: 0; box-shadow: none; }
        .no-print { display: none !important; }
        /* إخفاء واجهة النظام عند الطباعة */
        #interfaceCard, .swal2-container { display: none !important; }
        #printContainer { display: block !important; }
    }
`;

// ============================================================
// كود استقبال الإشارة السرية (postMessage)
// ============================================================
window.addEventListener("message", (event) => {
    if (event.data === "AUTH_Dir55@tggt") {
        const overlay = document.getElementById("systemLoginOverlay");
        const container = document.getElementById("interfaceCard");
        
        if(overlay) overlay.style.display = 'none';

        if(container && typeof SECURE_INTERFACE_HTML !== 'undefined') {
            if (!container.classList.contains("show-content")) {
                container.innerHTML = SECURE_INTERFACE_HTML;
                container.classList.add("show-content");
                container.style.display = "block";

                const ccpInp = document.getElementById("ccpInput");
                if(ccpInp) {
                    ccpInp.addEventListener("keypress", function(e) {
                        if (e.key === "Enter") { e.preventDefault(); document.getElementById("loginBtn").click(); }
                    });
                }
                
                const Toast = Swal.mixin({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000});
                Toast.fire({ icon: 'success', title: 'تم الاتصال الآمن بلوحة التحكم' });
            }
        }
    }
});

// --- الثوابت المخفية (HTML المحمي) ---
const SECURE_INTERFACE_HTML = `
    <div class="page-header" id="mainHeader">
      <div class="header-text">
        الجمهورية الجزائرية الديمقراطية الشعبية<br>
        وزارة التربية الوطنية<br>
      </div>
      
      <div class="logo-wrapper">
        <img src="https://lh3.googleusercontent.com/d/1BqWoqh1T1lArUcwAGNF7cGnnN83niKVl" alt="شعار اللجنة" class="header-logo">
      </div>

      <h2 class="gradient-title">
        مديرية التربية لولاية توقرت<br>
        <span class="highlight-text">المنصة الرقمية</span>
      </h2>
      
      <div id="loginSection">
        <input type="text" id="ccpInput" placeholder="أدخل رقم الحساب البريدي بدون المفتاح" oninput="valNum(this)">
        <button class="btn-main" id="loginBtn" onclick="checkEmployee()">تسجيل الدخول</button>
        
        <button class="btn-main" onclick="openAdminModal()" 
                style="background: #fff; color: #2575fc; border: 2px solid #2575fc; margin-top: 10px; font-weight:bold;">
          <i class="fas fa-file-alt"></i> استخراج القوائم والاستمارات
        </button>
      </div>
    </div>

    <div id="formSection" style="display: none;">
      <h2 class="gradient-title" style="margin-bottom: 20px; font-size:20px;">استمارة تحديث بيانات الموظفين</h2>
      <input type="hidden" id="mtrField"><input type="hidden" id="admField"><input type="hidden" id="grField">
      <div class="section-divider"><span class="section-title">البيانات الشخصية للموظف</span></div>
      <div class="info-grid">
        <div class="outer-group"><label>رقم الحساب الجاري CCP:</label><input type="text" id="ccpField" class="readonly-field"></div>
        <div class="outer-group"><label>رقم الضمان الاجتماعي:</label><input type="text" id="assField" class="readonly-field"></div>
        <div class="outer-group"><label>اللقب:</label><input type="text" id="fmnField" class="editable-field" oninput="valAr(this); removeError(this)"></div>
        <div class="outer-group"><label>الاسم:</label><input type="text" id="frnField" class="editable-field" oninput="valAr(this); removeError(this)"></div>
        <div class="outer-group"><label>تاريخ الميلاد:</label><input type="date" id="dizField" class="editable-field" onchange="removeError(this)"></div>
        <div class="outer-group"><label>الوظيفة:</label><input type="text" id="jobField" class="readonly-field"></div>
      </div>
      <div class="section-divider"><span class="section-title">بيانات الموظف المهنية</span></div>
      <div class="outer-group" style="margin-bottom: 20px;">
        <label>الطور:</label>
       <select id="levelField" onchange="resetGeoFields(); updateWorkPlace(); removeError(this)">
          <option value="">-- اختر --</option><option value="ابتدائي">ابتدائي</option><option value="متوسط">متوسط</option><option value="ثانوي">ثانوي</option><option value="مديرية التربية">مديرية التربية</option>
        </select>
      </div>
      <div class="info-grid">
        <div class="outer-group"><label>الدائرة</label><select id="daairaField" onchange="updBal(); updateWorkPlace(); removeError(this)"><option value="">-- اختر --</option><option value="توقرت">توقرت</option><option value="تماسين">تماسين</option><option value="المقارين">المقارين</option><option value="الحجيرة">الحجيرة</option><option value="الطيبات">الطيبات</option></select></div>
        <div class="outer-group"><label>البلدية</label><select id="baladiyaField" onchange="updateWorkPlace(); removeError(this)"><option value="">-- اختر --</option></select></div>
      </div>
      <div class="outer-group">
        <label>مؤسسة العمل:</label><div id="institutionArea"><input readonly placeholder="..." class="readonly-field"></div><input type="hidden" id="institutionCodeField">
      </div>
      <div class="section-divider"><span class="section-title">معلومات الاتصال والهوية</span></div>
      <div class="info-grid">
        <div class="outer-group"><label>رقم الهاتف (10 أرقام)</label><input type="text" id="phoneField" maxlength="10" oninput="valNum(this); removeError(this)" dir="ltr" placeholder="06XXXXXXXX"></div>
        <div class="outer-group"><label>رقم التعريف الوطني (NIN)</label><input type="text" id="ninField" maxlength="18" oninput="valNum(this); removeError(this)" placeholder="رقم البطاقة البيومترية 18 رقم"></div>
      </div>
      <button class="btn-main" onclick="submitRegistration()">حفظ وتأكيد المعلومات</button>
      <button class="btn-main" style="background: #6c757d; margin-top: 10px;" onclick="resetInterface()">إلغاء / خروج</button>
    </div>
    <div id="supportBtnContainer" style="position: fixed; bottom: 20px; left: 20px; z-index: 9999;">
        <button onclick="window.sendSupportRequest()" 
                style="background: #20c997; color: white; border: none; padding: 12px 20px; border-radius: 50px; cursor: pointer; font-family: 'Cairo', sans-serif; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-headset"></i> طلب مساعدة فنية
        </button>
    </div>
`;

// 🛑🛑🛑 ضع رابط لوحة التحكم الخاصة بك هنا 🛑🛑🛑
const ADMIN_DASHBOARD_URL = "admin0955tggt2.html"; 

// --- إعدادات Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyAkQz9pB2ZNlYIvdlTRvi4try3D8LLXS4g",
  authDomain: "databaseemploye.firebaseapp.com",
  projectId: "databaseemploye",
  storageBucket: "databaseemploye.firebasestorage.app",
  messagingSenderId: "408231477466",
  appId: "1:408231477466:web:e3bf5bd3eaca7cdcd3a5e3",
  measurementId: "G-DW8QJ5B231"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🛑🛑🛑 استبدل هذا الرابط برابط السكريبت الخاص بك 🛑🛑🛑
const scriptURL = "https://script.google.com/macros/s/AKfycbyXEdCPd-rrImLFLZObPXbeELUqj71mknOOFB7sjMCh6JQE-L7yMIsgFlFXrA5-VTUjRg/exec";

// --- خريطة الرتب ---
const gradeMap = {
    "1006": "أستاذ إبتدائي (متعاقد)", "1007": "أستاذ تعليم إبتدائي قسم أول", "1008": "أستاذ تعليم إبتدائي قسم ثان", "1009": "أستاذ مميز في التعليم الإبتدائي", "1010": "أستاذ التعليم الإبتدائي", "2021": "ناظر في التعليم الإبتدائي", "2031": "مربي متخصص رئيسي في الدعم", "2100": "مدير مدرسة إبتدائية", "3010": "أستاذ مميز في التعليم المتوسط", "3005": "أستاذ التعليم المتوسط قسم ثاني", "3001": "أستاذ التعليم المتوسط قسم أول", "3012": "أستاذ التعليم المتوسط / متعاقد", "3020": "أستاذ ت م متعاقد ق 01 (13)", "4000": "مدير متوسطة", "4006": "ناظر في التعليم المتوسط", "5019": "أستاذ تعليم ثانوي", "5020": "أستاذ تعليم ثانوي (متعاقد)", "5021": "أستاذ تعليم ثانوي مستخلف", "5022": "أستاذ مميز في التعليم الثانوي", "5023": "أستاذ التعليم الثانوي قسم ثان", "5024": "أستاذ التعليم الثانوي قسم أول", "6001": "مدير ثانوية", "6004": "ناظر في التعليم الثانوي", "4030": "مستشار التربية", "4031": "مستشار توجيه وارشاد مدرسي", "4032": "مستشار محلل لتوجيه والارشاد", "4033": "مستشار رئيسي للتوجيه", "4034": "مستشار رئيس للتوجيه", "6003": "مستشار رئيس توجيه وارشاد", "6008": "مستشار محلل توجيه وارشاد", "6009": "مستشار رئيسي توجيه وارشاد", "6025": "مستشار للتوجيه المدرسي", "6035": "مستشار للتربية", "7160": "مستشار محلل للتوجيه والإرشاد المدرسي", "7025": "مفتش التعليم الثانوي للتوجيه والإرشاد", "4025": "مقتصد", "4040": "نائب مقتصد مسير", "4060": "نائب مقتصد", "4065": "مساعد رئيسي للمصالح الاقتصادية", "6010": "مقتصد رئيسي", "6015": "مقتصد", "6085": "نائب مقتصد", "7220": "نائب مقتصد", "7260": "م مصالح اقتصادية رئيسي", "4087": "مشرف تربية", "4088": "مشرف رئيسي للتربية", "4089": "مشرف رئيس للتربية", "4090": "مشرف عام للتربية", "4085": "مساعد رئيسي للتربية", "6006": "مشرف رئيس للتربية", "6007": "مشرف عام للتربية", "6117": "مشرف رئيسي للتربية", "6118": "مشرف للتربية", "4072": "ملحق بالمخبر", "4076": "ملحق رئيسي للمخبر", "4077": "ملحق رئيس بالمخابر", "4078": "ملحق مشرف بالمخابر", "6046": "ملحق رئيسي للمخبر", "6047": "ملحق مشرف بالمخابر", "6048": "ملحق رئيس بالمخابر", "7005": "مدير التربية", "7682": "مدير التربية", "7011": "الأمين العام", "7013": "رئيس مصلحة بمديرية التربية", "7071": "رئيس مصلحة بمديرية التربية", "7073": "رئيس مكتب", "7074": "رئيس مكتب", "7023": "مفتش التعليم المتوسط تخصص مواد", "7024": "مفتش التعليم الثانوي تخصص مواد", "7036": "مفتش تعليم متوسط تخصص إدارة", "7044": "مفتش ت.إ تخصص إدارة مدارس ابتدائي", "7045": "مفتش تغذية مدرسية", "7046": "مفتش التغذية المدرسية", "7047": "مفتش التعليم الابتدائي تخصص مواد", "7042": "مفتش التغذية المدرسية", "6081": "ملحق إدارة", "7210": "ملحق إدارة", "7155": "ملحق إدارة رئيسي", "6100": "عون إدارة رئيسي", "6185": "عون إدارة", "7311": "عون إدارة", "8380": "عون إدارة", "6194": "كاتب مديرية", "6195": "كاتب", "6215": "عون حفظ بيانات", "7345": "عون حجز بيانات", "6082": "مساعد وثائقي أمين محفوظات", "6083": "أمين وثائقي للمحفوظات رئيسي", "7271": "مساعد وثائقي أمين محفوظات", "7075": "مهندس دولة في الإعلام الآلي", "7095": "مهندس مستوى أول في الإحصاء", "7105": "تقني سامي في الاعلام الآلي", "7150": "تقني سامي في الاعلام الآلي مستوى 3", "7099": "متصرف محلل", "7100": "متصرف", "7445": "متصرف محلل", "6038": "ممرض حاصل على شهادة دولة", "6041": "ممرض للصحة العمومية", "7032": "نفساني عيادي للصحة العمومية", "7033": "نفساني عيادي للصحة العمومية", "6140": "رئيس فرقة للامن و الوقاية", "6165": "عون أمن ووقاية", "6225": "عون أمن ووقاية", "6201": "سائق سيارة مستوى أول", "6110": "عامل مهني خارج الصنف", "6155": "عامل مهني الصنف 1", "6161": "عامل مهني مستوى ثالث", "6205": "عامل مهني الصنف 2", "6221": "عامل مهني مستوى ثاني", "6241": "عامل مهني مستوى أول", "7280": "عامل مهني مستوى أول", "7310": "عامل مهني مستوى أول", "7434": "عامل مهني مستوى 1"
};

const baladiyaMap = { "توقرت": ["توقرت", "النزلة", "تبسبست", "الزاوية العابدية"], "تماسين": ["تماسين", "بلدة عمر"], "المقارين": ["المقارين", "سيدي سليمان"], "الحجيرة": ["الحجيرة", "العالية"], "الطيبات": ["الطيبات", "المنقر", "ابن ناصر"] };

window.primarySchoolsByBaladiya = { /* ... (تم الاحتفاظ بالبيانات) ... */ };
window.institutionsByDaaira = { /* ... (تم الاحتفاظ بالبيانات) ... */ };
// (نفس البيانات في الكود السابق)

// --- دوال مساعدة ---
const valNum = (e) => e.value = e.value.replace(/\D/g, '');
const valAr = (e) => e.value = e.value.replace(/[^\u0600-\u06FF\s]/g, '');
const getJob = (c) => gradeMap[c] || "غير محدد";
const removeError = (input) => { if (input.classList.contains("input-error")) input.classList.remove("input-error"); };
const fmtDate = (d) => {
  if (!d) return "";
  try {
    const dateObj = (typeof d.toDate === 'function') ? d.toDate() : new Date(d);
    if(isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) { return ""; }
};
function getCurrentDateTime() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

let currentEmployeeData = null;

// ======================== دالة التحقق والحقن الآمن ========================
async function verifySystemLogin() {
  const passInput = document.getElementById("systemPassInput").value.trim();
  const overlay = document.getElementById("systemLoginOverlay");
  const loginBtn = document.querySelector('.btn-login-system');
  const container = document.getElementById("interfaceCard");
  
  if (!passInput) return Swal.fire({icon: 'warning', title: 'تنبيه', text: 'يرجى إدخال كلمة المرور', confirmButtonColor: '#6a11cb'});

  const originalText = loginBtn.innerText;
  loginBtn.innerText = 'جاري التحقق...';
  loginBtn.disabled = true;

  try {
    const docSnap = await db.collection("config").doc("pass").get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const userPass = data.service_pay;
      const adminPass = data.service_pay_admin;
      
      if (String(passInput) === String(userPass)) {
        container.innerHTML = SECURE_INTERFACE_HTML;
        container.classList.add("show-content"); 
        overlay.style.display = 'none'; 
        const ccpInp = document.getElementById("ccpInput");
        if(ccpInp) ccpInp.addEventListener("keypress", function(e) { if (e.key === "Enter") { e.preventDefault(); document.getElementById("loginBtn").click(); }});
        Swal.mixin({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true}).fire({ icon: 'success', title: 'مرحباً بك في المنصة' });
      } else if (String(passInput) === String(adminPass)) {
        sessionStorage.setItem("admin_secure_access", "granted_by_login_page");
        window.location.href = ADMIN_DASHBOARD_URL;
      } else {
        Swal.fire({icon: 'error', title: 'خطأ', text: 'كلمة المرور غير صحيحة', confirmButtonColor: '#dc3545'});
      }
    } else { Swal.fire("خطأ", "لم يتم العثور على إعدادات الدخول", "error"); }
  } catch (error) { console.error("Login Error:", error); Swal.fire("خطأ", "حدث خطأ في الاتصال بقاعدة البيانات", "error"); } 
  finally { loginBtn.innerText = originalText; loginBtn.disabled = false; }
}

document.getElementById("systemPassInput").addEventListener("keypress", function(event) { if (event.key === "Enter") { event.preventDefault(); verifySystemLogin(); }});

function resetInterface() {
    currentEmployeeData = null;
    document.getElementById("formSection").style.display = "none";
    document.getElementById("mainHeader").style.display = "block";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("interfaceCard").classList.remove("expanded-mode");
    document.getElementById("ccpInput").value = ""; 
}

// ... (دوال checkEmployee, showReviewModal, showConfirmedModal, confirmData, fillForm, submitRegistration, printA4, updBal, resetGeoFields, updateWorkPlace - كما هي بدون تغيير جوهري) ...
// (للاختصار، يفترض أن الدوال الأساسية لعمل الموظف موجودة هنا كما في كودك الأصلي)
// 1️⃣ الفحص
async function checkEmployee() {
  const rawInput = document.getElementById("ccpInput").value.trim();
  const cleanInput = rawInput.replace(/\D/g, ''); 

  if (cleanInput.length < 3) return Swal.fire("تنبيه", "رقم الحساب البريدي الجاري CCP غير صحيح", "warning");

  Swal.fire({ title: 'جاري التحقق...', didOpen:()=>Swal.showLoading(), allowOutsideClick: false });

  try {
    const baseCCP = cleanInput.replace(/^0+/, ''); 
    const candidates = [ baseCCP, baseCCP.padStart(10, '0'), cleanInput ];
    const uniqueCandidates = [...new Set(candidates)];

    let fbData = null;
    let finalCCP = rawInput; 

    for (const candidate of uniqueCandidates) {
        const docSnap = await db.collection("employeescompay").doc(candidate).get();
        if (docSnap.exists) {
            fbData = docSnap.data();
            finalCCP = candidate; 
            break; 
        }
    }

    const res = await fetch(scriptURL, { method: "POST", body: new URLSearchParams({ action: "check_existing", ccp: finalCCP }) });
    const result = await res.json();
    Swal.close();

    const displayData = result.result === "exists" ? result.data : fbData;
    if (!displayData) return Swal.fire("غير موجود", "الرقم غير مسجل في قاعدة البيانات الأولية", "error");

    Swal.fire({
      title: 'تم تسجيل الدخول بنجاح',
      html: `مرحباً بك: <span style="color:#6a11cb; font-weight:700; font-size:18px;">${displayData.fmn || ''} ${displayData.frn || ''}</span>`,
      icon: 'success', showCancelButton: true, confirmButtonText: 'متابعة', cancelButtonText: 'خروج', confirmButtonColor: '#2575fc', cancelButtonColor: '#6c757d', allowOutsideClick: false
    }).then((welcomeRes) => {
      if (welcomeRes.isConfirmed) {
        if (result.result === "exists") {
          const d = result.data;
          d.confirmed = (d.confirmed === true || String(d.confirmed).toLowerCase() === "true");
          currentEmployeeData = d; 
          d.confirmed ? showConfirmedModal(d) : showReviewModal(d, "unconfirmed_duplicate");
        } else {
          fillForm(fbData, null);
          document.getElementById("ccpField").value = finalCCP;
        }
      } else { resetInterface(); }
    });
  } catch (e) { console.error(e); Swal.fire("خطأ", "فشل الاتصال", "error"); }
}

function showReviewModal(data, context) {
  document.getElementById("interfaceCard").classList.add("expanded-mode");
  const htmlTable = `
    <div class="swal-table-container">
      <div style="border: 2px solid #dc3545; background-color: #fff8f8; color: #dc3545; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-weight: bold; text-align: center; font-size: 14px;">⚠️ معلومات التسجيل (غير مؤكدة)</div>
      <table class="data-table">
        <tr><th>رقم الحساب البريدي</th><td>${data.ccp}</td></tr>
        <tr><th>اللقب والاسم</th><td>${data.fmn} ${data.frn}</td></tr>
        <tr><th>المؤسسة</th><td>${data.schoolName}</td></tr>
      </table>
    </div>`;
  Swal.fire({
    title: context === 'new' ? 'تم التسجيل بنجاح' : 'مراجعة البيانات',
    html: htmlTable, icon: 'info', showDenyButton: true, showCancelButton: true, confirmButtonText: '✅ تأكيد المعلومات', denyButtonText: '✏️ تعديل المعلومات', cancelButtonText: 'إغلاق', confirmButtonColor: '#28a745', denyButtonColor: '#1a73e8'
  }).then((res) => {
    if (res.isConfirmed) showConfirmerInput(data);
    else if (res.isDenied) fillForm(null, data);
    else if (res.dismiss === Swal.DismissReason.cancel) resetInterface(); 
  });
}

function showConfirmerInput(data) {
    Swal.fire({
        title: 'تأكيد المعلومات',
        html: `<input id="swal-name" placeholder="الاسم واللقب" class="swal2-input"><input id="swal-phone" placeholder="06XXXXXXXX" class="swal2-input">`,
        confirmButtonText: 'حفظ وطباعة', showCancelButton: true,
        preConfirm: () => {
            const name = document.getElementById('swal-name').value;
            const phone = document.getElementById('swal-phone').value;
            if (!name || !phone) Swal.showValidationMessage('يرجى ملء البيانات');
            return { name, phone };
        }
    }).then((res) => {
        if(res.isConfirmed) {
            data.confirmed_by = res.value.name; data.reviewer_phone = res.value.phone;
            confirmData(data);
        }
    });
}

function showConfirmedModal(data) {
  document.getElementById("interfaceCard").classList.add("expanded-mode");
  Swal.fire({
    title: 'الملف الشخصي',
    html: `<div style="background:#d4edda; padding:10px; margin-bottom:10px;"><strong>معلومات مؤكدة</strong></div>`,
    showDenyButton: true, showCancelButton: true, confirmButtonText: '🖨️ طباعة الاستمارة', denyButtonText: '✏️ تعديل', cancelButtonText: 'خروج'
  }).then((res) => {
    if (res.isConfirmed) printA4(data);
    else if (res.isDenied) fillForm(null, data);
    else resetInterface();
  });
}

async function confirmData(data) {
  Swal.fire({ title: 'جاري التأكيد...', didOpen:()=>Swal.showLoading() });
  data.confirmed = true; 
  const params = new URLSearchParams();
  for(let k in data) if(data[k]) params.append(k, data[k]);
  params.set("action", "update"); params.set("confirmed", "true"); params.append("date_confirm", getCurrentDateTime());

  try {
    const res = await fetch(scriptURL, { method: "POST", body: params });
    const result = await res.json();
    if(result.result === "success") {
      data.date_confirm = getCurrentDateTime(); currentEmployeeData = data;
      Swal.fire({ title: 'تم التأكيد', icon: 'success', confirmButtonText: 'طباعة' }).then((r) => { if(r.isConfirmed) printA4(data); else resetInterface(); });
    } else Swal.fire("خطأ", result.message, "error");
  } catch(e) { Swal.fire("خطأ", "فشل الاتصال", "error"); }
}

function fillForm(fbData, savedData) {
  document.getElementById("interfaceCard").classList.add("expanded-mode");
  document.getElementById("mainHeader").style.display = "none";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("formSection").style.display = "block";
  const d = savedData || fbData || {};
  document.getElementById("ccpField").value = d.ccp || d.empId || '';
  document.getElementById("fmnField").value = d.fmn || '';
  document.getElementById("frnField").value = d.frn || '';
  document.getElementById("dizField").value = fmtDate(d.diz);
  document.getElementById("jobField").value = getJob(d.gr);
  // ... (تكملة تعبئة الحقول كما في الكود الأصلي) ...
  if(savedData) {
      document.getElementById("levelField").value = savedData.level || "";
      document.getElementById("daairaField").value = savedData.daaira || "";
      updBal();
      setTimeout(() => { document.getElementById("baladiyaField").value = savedData.baladiya || ""; updateWorkPlace(); }, 100);
  }
}

async function submitRegistration() {
    // ... (منطق الحفظ كما هو) ...
    // دالة وهمية لتجنب الاخطاء في التجميع
    Swal.fire("تنبيه", "يجب نسخ دالة submitRegistration من الكود الأصلي", "info");
}

function printA4(d) {
  // ... (منطق الطباعة الفردية) ...
   window.print();
   setTimeout(() => resetInterface(), 500);
}

function updBal() {
  const d = document.getElementById("daairaField").value;
  const b = document.getElementById("baladiyaField");
  b.innerHTML = '<option value="">-- اختر --</option>';
  if(d && baladiyaMap[d]) baladiyaMap[d].forEach(o=>{let op=document.createElement("option");op.text=o;op.value=o;b.add(op)});
}
function resetGeoFields() { /* ... */ }
function updateWorkPlace() { /* ... */ }

// ============================================================
// +++ وظائف الإدارة (Admin Functions) - المعدلة +++
// ============================================================

// 1. فتح نافذة التحقق من المدير
function openAdminModal() {
  const popupHtml = `
    <div style="font-family: 'Cairo'; direction: rtl;">
      <h3 style="color:#2575fc;">بوابة استخراج الوثائق</h3>
      <input type="text" id="adminCcpInput" maxlength="10" placeholder="رقم الحساب (مثال: 0000012345)" class="swal2-input" style="text-align: center; font-weight: bold;">
    </div>`;

  Swal.fire({
    html: popupHtml, showCancelButton: true, confirmButtonText: 'تحقق ودخول', cancelButtonText: 'إلغاء',
    preConfirm: () => {
      let cleanStr = document.getElementById('adminCcpInput').value.replace(/\D/g, '').replace(/^0+/, '');
      const finalCcp = cleanStr.padStart(10, '0');
      return fetch(scriptURL, { method: 'POST', body: new URLSearchParams({ action: 'check_existing', ccp: finalCcp }) })
      .then(r => r.json()).then(data => { if (data.result !== 'exists') throw new Error('غير مسجل كمسؤول'); return data.data; })
      .catch(error => Swal.showValidationMessage(`${error}`));
    }
  }).then((result) => { if (result.isConfirmed) showRestrictedAdminPanel(result.value); });
}

// 2. عرض لوحة الاستخراج (معدلة لإضافة زر البطاقات)
function showRestrictedAdminPanel(empData) {
  const schoolName = empData.schoolName || "غير محدد";
  const directorName = `${empData.fmn} ${empData.frn}`;
  const lockedStyle = `background: #f1f3f4; border: 1px solid #ced4da; color: #495057; font-weight: 600; cursor: not-allowed; text-align: center; font-size: 14px; height: 40px; margin-bottom: 12px;`;

  const popupHtml = `
    <div style="font-family: 'Cairo', sans-serif; direction: rtl; text-align: right;">
      <div style="background: linear-gradient(45deg, #2575fc, #6a11cb); color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <div style="font-size: 12px;">مرحباً بالسيد(ة) المدير(ة):</div>
        <div style="font-size: 18px; font-weight: bold;">${directorName}</div>
      </div>
      <label style="font-size: 12px; font-weight:bold; color:#2575fc;">المؤسسة:</label>
      <input type="text" value="${schoolName}" class="swal2-input" style="${lockedStyle}; width: 100%;" disabled readonly>
      
      <div style="display: grid; gap: 10px; margin-top: 20px;">
          <button id="btn-forms" class="swal2-confirm swal2-styled" style="width:100%; margin:0; background:#333;"><i class="fas fa-print"></i> طباعة الاستمارات</button>
          <button id="btn-list" class="swal2-deny swal2-styled" style="width:100%; margin:0; background:#28a745;"><i class="fas fa-list"></i> عرض القائمة</button>
          <button id="btn-cards" class="swal2-confirm swal2-styled" style="width:100%; margin:0; background:#6a11cb;"><i class="fas fa-id-card"></i> بطاقات مهنية</button>
      </div>
    </div>`;

  Swal.fire({
    html: popupHtml, showConfirmButton: false, showCancelButton: true, cancelButtonText: 'خروج', cancelButtonColor: '#d33', width: '450px',
    didOpen: () => {
        document.getElementById('btn-forms').addEventListener('click', () => { Swal.clickConfirm(); fetchAndHandleData(schoolName, 'forms'); });
        document.getElementById('btn-list').addEventListener('click', () => { Swal.clickConfirm(); fetchAndHandleData(schoolName, 'list'); });
        document.getElementById('btn-cards').addEventListener('click', () => { Swal.clickConfirm(); fetchAndHandleData(schoolName, 'cards'); });
    }
  });
}

// 3. جلب البيانات والتوجيه
async function fetchAndHandleData(schoolName, mode) {
    Swal.fire({ title: 'جاري جلب البيانات...', didOpen: () => Swal.showLoading() });
    try {
        const res = await fetch(scriptURL, { method: "POST", body: new URLSearchParams({ action: "get_by_school", schoolName: schoolName }) });
        const json = await res.json();
        Swal.close();
        let data = (json.result === "success") ? json.data : (json.data || []);
        const filteredData = data.filter(emp => emp.schoolName === schoolName);
        if (filteredData.length === 0) return Swal.fire("تنبيه", "لا يوجد موظفين مسجلين", "info");

        if (mode === 'forms') generateBulkForms(filteredData, schoolName);
        else if (mode === 'cards') generateCardsUI(filteredData, schoolName);
        else generateEmployeesTable(filteredData, schoolName);
    } catch (e) { console.error(e); Swal.fire("خطأ", "حدث خطأ أثناء جلب البيانات", "error"); }
}

function generateEmployeesTable(data, schoolName) { /* ... (دالة عرض القائمة العادية كما كانت) ... */ }
function generateBulkForms(data, schoolName) { /* ... (دالة طباعة الاستمارات كما كانت) ... */ }

// ==========================================
// 4. واجهة البطاقات المهنية (جديدة)
// ==========================================
function generateCardsUI(data, schoolName) {
    const confirmedData = data.filter(d => d.confirmed === true || String(d.confirmed).toLowerCase() === "true");
    if (confirmedData.length === 0) return Swal.fire("تنبيه", "لا توجد ملفات مؤكدة لاستخراج البطاقات", "warning");

    // تخزين البيانات مؤقتاً
    window.cardsData = confirmedData.map(emp => ({ ...emp, tempPhoto: null, tempFuncId: '' }));

    let rows = '';
    window.cardsData.forEach((emp, index) => {
        rows += `
            <tr id="row-${index}">
                <td style="font-weight:bold;">${index + 1}</td>
                <td>${emp.fmn} ${emp.frn}</td>
                <td style="font-size:11px;">${getJob(emp.gr)}</td>
                <td>
                    <input type="text" placeholder="رقم التعريف الوظيفي" class="swal2-input" 
                           style="width:90%; height:30px; font-size:12px; margin:0 auto;"
                           oninput="window.cardsData[${index}].tempFuncId = this.value">
                </td>
                <td style="text-align:center;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
                        <div id="img-preview-${index}" style="width:35px; height:45px; background:#eee; border:1px solid #ddd; overflow:hidden;">
                            <i class="fas fa-user" style="color:#ccc; line-height:45px;"></i>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:2px;">
                            <input type="file" id="file-${index}" accept="image/*" style="display:none" onchange="handleImageUpload(this, ${index})">
                            <button onclick="document.getElementById('file-${index}').click()" class="btn-sm" style="background:#2575fc; color:white; border:none; border-radius:3px; cursor:pointer; font-size:10px; padding:2px 5px;">رفع</button>
                            <button onclick="deleteImage(${index})" class="btn-sm" style="background:#dc3545; color:white; border:none; border-radius:3px; cursor:pointer; font-size:10px; padding:2px 5px;">حذف</button>
                        </div>
                    </div>
                </td>
                <td>
                    <button onclick="previewSingleCard(${index})" style="background:#6a11cb; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px;"><i class="fas fa-eye"></i> معاينة</button>
                </td>
            </tr>`;
    });

    const tableHtml = `
        <style>
            .cards-table { width: 100%; border-collapse: collapse; text-align: right; direction: rtl; font-family: 'Cairo'; }
            .cards-table th { background: #6a11cb; color: white; padding: 8px; font-size: 12px; }
            .cards-table td { padding: 5px; border-bottom: 1px solid #eee; font-size: 12px; vertical-align: middle; }
            .swal-wide { width: 95% !important; max-width: 1000px; }
        </style>
        <div style="text-align:center; margin-bottom:15px;">
            <h3 style="color:#6a11cb; margin:0;">إصدار البطاقات المهنية</h3>
            <p style="font-size:12px; color:#666;">${schoolName}</p>
            <button onclick="printAllCards()" style="background:#28a745; color:white; border:none; padding:10px 20px; border-radius:50px; font-weight:bold; margin-top:10px; cursor:pointer; box-shadow:0 4px 6px rgba(0,0,0,0.1);"><i class="fas fa-print"></i> طباعة الكل (8/صفحة)</button>
        </div>
        <div style="max-height:60vh; overflow-y:auto; border:1px solid #ddd;">
            <table class="cards-table">
                <thead><tr><th width="5%">#</th><th width="20%">الموظف</th><th width="20%">الرتبة</th><th width="20%">رقم التعريف الوظيفي</th><th width="20%">الصورة</th><th width="15%">إجراءات</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;

    Swal.fire({ title: '', html: tableHtml, showConfirmButton: false, showCloseButton: true, customClass: { popup: 'swal-wide' } });
}

// --- 5.1 دوال مساعدة للبطاقات ---
window.handleImageUpload = function(input, index) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            window.cardsData[index].tempPhoto = e.target.result;
            document.getElementById(`img-preview-${index}`).innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

window.deleteImage = function(index) {
    window.cardsData[index].tempPhoto = null;
    document.getElementById(`file-${index}`).value = "";
    document.getElementById(`img-preview-${index}`).innerHTML = `<i class="fas fa-user" style="color:#ccc; line-height:45px;"></i>`;
}

// --- 5.2 قالب البطاقة ---
function getCardHTML(emp) {
    const photoElement = emp.tempPhoto 
        ? `<img src="${emp.tempPhoto}" style="width:100%; height:100%; object-fit:cover;">`
        : `<span style="color:#ccc; font-size:14px">صورة شمسية</span>`;
        
    const funcId = emp.tempFuncId || "....................";
    const currentYear = new Date().getFullYear();
    // استخدام CCP كقيمة للباركود (مع إكمال أصفار)
    const barcodeValue = (emp.ccp || "0000000000").replace(/\D/g, '').padStart(10, '0');

    return `
    <div class="card-wrapper">
        <div class="card">
            <div class="top-deco-bar"><div class="bar-green"></div><div class="bar-red"></div></div>
            <div class="watermark"></div>
            <div class="header">
                <div class="logo-box"><img src="https://lh3.googleusercontent.com/d/1O9TZQrn9q4iRnI1NldJNxfq0bKuc8S-u" class="header-logo"><div class="logo-text">وزارة التربية الوطنية</div></div>
                <div class="header-center"><div class="main-title">الجمهورية الجزائرية الديمقراطية الشعبية</div></div>
                <div class="logo-box"><img src="https://lh3.googleusercontent.com/d/1O9TZQrn9q4iRnI1NldJNxfq0bKuc8S-u" class="header-logo"><div class="logo-text">مديرية التربية لولاية توقرت</div></div>
            </div>
            <div class="card-body">
                <div class="info-section">
                    <div class="card-name-title">بطاقة التعريف المهنية</div>
                    <div class="info-row"><span class="label">اللقب والاسم:</span><span class="value">${emp.fmn} ${emp.frn}</span></div>
                    <div class="info-row"><span class="label">تاريخ الميلاد:</span><span class="value">${fmtDate(emp.diz)}</span></div>
                    <div class="info-row"><span class="label">الرتبة:</span><span class="value">${getJob(emp.gr)}</span></div>
                    <div class="info-row"><span class="label">مكان العمل:</span><span class="value">${emp.schoolName}</span></div>
                    <div class="info-row"><span class="label">الرقم التعريف الوظيفي:</span><span class="value">${funcId}</span></div>
                </div>
                <div class="photo-section">
                    <div class="serial-number"><span>الرقم:</span><span dir="ltr">${currentYear} / .....</span></div>
                    <div class="photo-frame">${photoElement}</div>
                    <div class="signature-title">مدير التربية</div>
                </div>
            </div>
            <div class="barcode-container">
                <svg class="barcode-svg" jsbarcode-value="${barcodeValue}" jsbarcode-format="CODE128" jsbarcode-displayValue="false" jsbarcode-height="28" jsbarcode-width="1.5" jsbarcode-margin="0" jsbarcode-background="transparent"></svg>
            </div>
            <div class="footer">على السلطات المدنية والعسكرية أن تسمح لحامل هذه البطاقة بالمرور في كل الحالات</div>
        </div>
    </div>`;
}

window.previewSingleCard = function(index) {
    const emp = window.cardsData[index];
    const html = `<style>${CARD_CSS}</style><div style="display:flex; justify-content:center; padding:20px; background:#e0e0e0; transform: scale(0.8);">${getCardHTML(emp)}</div>`;
    Swal.fire({ html: html, width: '700px', showCloseButton: true, showConfirmButton: false, didOpen: () => { try { JsBarcode(".barcode-svg").init(); } catch(e){} } });
}

window.printAllCards = function() {
    const data = window.cardsData;
    if (!data || data.length === 0) return;

    const printContainer = document.getElementById("printContainer");
    const originalContent = printContainer.innerHTML;
    const chunkSize = 8;
    let allPagesHTML = `<style>${CARD_CSS}</style>`;

    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        let pageContent = `<div class="card-page-a4">`;
        chunk.forEach(emp => { pageContent += getCardHTML(emp); });
        pageContent += `</div>`;
        allPagesHTML += pageContent;
    }

    printContainer.innerHTML = allPagesHTML;

    try {
        const svgs = printContainer.querySelectorAll(".barcode-svg");
        svgs.forEach(svg => {
            const val = svg.getAttribute("jsbarcode-value");
            JsBarcode(svg, val, { format: "CODE128", displayValue: false, height: 28, width: 1.5, margin: 0, background: "transparent" });
        });
    } catch (e) { console.error("Barcode Error", e); }

    setTimeout(() => {
        window.print();
        setTimeout(() => { printContainer.innerHTML = originalContent; }, 1000);
    }, 500);
}

// دالة الدعم الفني (كما هي في السابق)
window.sendSupportRequest = async function() { /* ... */ };
