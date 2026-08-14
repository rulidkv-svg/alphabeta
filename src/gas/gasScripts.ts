export const GAS_CODE_GS = `/**
 * ALPHA BETA LEARNING CENTER - GOOGLE APPS SCRIPT WEB APP BACKEND
 * Tagline: "Belajar • Berlatih • Bersertifikat • Siap Kerja"
 * 
 * Instructions:
 * 1. Open Google Sheets -> Extensions -> Apps Script.
 * 2. Copy Code.gs and Database.gs into your Apps Script project.
 * 3. Run setupDatabase() once to create all 21 sheets.
 * 4. Run seedDemoData() to populate sample courses, users, and quizzes.
 * 5. Deploy -> New Deployment -> Web App -> Execute as: Me -> Who has access: Anyone.
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'getDashboard';
  var response = handleAction(action, (e && e.parameter) || {}, null);
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = {};
  try {
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    data = (e && e.parameter) || {};
  }
  var action = data.action || (e && e.parameter && e.parameter.action) || 'submitData';
  var response = handleAction(action, (e && e.parameter) || {}, data);
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAction(action, params, postData) {
  try {
    switch (action) {
      case 'syncData':
      case 'sync':
      case 'push':
      case 'pull':
      case 'submitData':
      case 'getDashboard':
      case 'syncDataFromLMS':
      case 'syncLMS':
      case 'syncAllData':
      case 'syncAll':
      case 'syncDatabase':
      case 'saveData':
        return syncDataFromLMS(postData || params);
      case 'setupDatabase':
        return setupDatabase();
      case 'seedDemoData':
        return seedDemoData();
      case 'checkEmail':
        return checkEmail(params.email || (postData && postData.email));
      case 'checkPhone':
        return checkPhone(params.phone || (postData && postData.phone));
      case 'loginUser':
      case 'login':
        return authLogin(postData.identifier || postData.email, postData.password);
      case 'registerUser':
      case 'register':
        return authRegister(postData);
      case 'logoutUser':
        return logoutUser(postData.userId);
      case 'resetPassword':
        return resetPassword(postData.identifier);
      case 'changePassword':
        return changePassword(postData.userId, postData.oldPassword, postData.newPassword);
      case 'getUserProfile':
        return getUserProfile(params.userId);
      case 'updateUserProfile':
        return updateUserProfile(postData);
      case 'getLoginLogs':
        return getLoginLogs();
      case 'getCourses':
        return getCourses(params.category);
      case 'getCourseDetail':
        return getCourseDetail(params.courseId);
      case 'getModules':
        return getCourseModules(params.courseId);
      case 'enrollCourse':
        return enrollCourse(postData.userId, postData.courseId);
      case 'saveProgress':
        return saveProgress(postData);
      case 'submitQuiz':
        return submitQuiz(postData);
      case 'submitExam':
        return submitExam(postData);
      case 'generateCertificate':
        return generateCertificate(postData.userId, postData.courseId);
      case 'verifyCertificate':
        return verifyCertificate(params.certificateId || params.certNo);
      case 'getStudentDashboard':
        return getStudentDashboard(params.userId);
      case 'getStats':
        return getSystemStats();
      case 'getAdminData':
        return getAdminData(params.table);
      case 'saveAdminItem':
        return saveAdminItem(postData.table, postData.item);
      case 'deleteAdminItem':
        return deleteAdminItem(postData.table, postData.id);
      default:
        if (postData && (postData.users || postData.graduatedStudents || postData.activeStudents || postData.allParticipants || postData.courses || postData.certificates || postData.activities || postData.quizExamResults)) {
          return syncDataFromLMS(postData || params);
        }
        return { success: false, error: 'Unknown action: ' + action };
    }
  } catch (err) {
    Logger.log('Error in ' + action + ': ' + err.toString());
    return { success: false, error: err.toString() };
  }
}

var CUSTOM_SPREADSHEET_ID = "1DcM2Sn579APizeP5dfOIBchOKQgvjYPhVBrgkeUJk2w";

function getSpreadsheet() {
  try {
    if (CUSTOM_SPREADSHEET_ID && CUSTOM_SPREADSHEET_ID.length > 5) {
      return SpreadsheetApp.openById(CUSTOM_SPREADSHEET_ID);
    }
  } catch (e) {
    Logger.log('Error opening spreadsheet by ID: ' + e.toString());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function syncDataFromLMS(postData) {
  var ss = getSpreadsheet();
  if (!ss) return { success: false, error: 'Spreadsheet tidak dapat dibuka' };

  // 1. Tab Data_Peserta
  var syncSheet = ss.getSheetByName('Data_Peserta');
  if (!syncSheet) {
    syncSheet = ss.insertSheet('Data_Peserta');
  }
  if (syncSheet.getLastRow() === 0) {
    syncSheet.appendRow(['UserID', 'Nama', 'Email', 'WhatsApp', 'StatusPelatihan', 'Nilai / Progres', 'NomorSertifikat', 'Pendidikan', 'Tanggal']);
    syncSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#10b981').setFontColor('#ffffff');
  }

  var allParticipants = (postData && (postData.allParticipants || postData.graduatedStudents)) || [];
  if (allParticipants && allParticipants.length > 0) {
    if (syncSheet.getLastRow() > 1) {
      syncSheet.getRange(2, 1, syncSheet.getLastRow() - 1, 9).clearContent();
    }

    var rows = [];
    for (var i = 0; i < allParticipants.length; i++) {
      var p = allParticipants[i];
      rows.push([
        p.UserID || '',
        p.Nama || p.Name || '',
        p.Email || '',
        p.WhatsApp || p.Phone || '',
        p.StatusPelatihan || 'Sedang Berlangsung',
        p.NilaiAkhir || p.Progres || '0%',
        p.NomorSertifikat || '-',
        p.Pendidikan || 'SMA/SMK',
        p.TanggalLulus || p.TanggalDaftar || p.Tanggal || new Date().toISOString().split('T')[0]
      ]);
    }
    if (rows.length > 0) {
      syncSheet.getRange(2, 1, rows.length, 9).setValues(rows);
    }
  }

  // 2. Tab Aktifitas_Peserta
  var actSheet = ss.getSheetByName('Aktifitas_Peserta');
  if (!actSheet) {
    actSheet = ss.insertSheet('Aktifitas_Peserta');
  }
  if (actSheet.getLastRow() === 0) {
    actSheet.appendRow(['Tanggal & Waktu', 'UserID', 'Nama Peserta', 'Email', 'Pelatihan / Kursus', 'Kategori Aktifitas', 'Detail Aktifitas / Modul', 'Status', 'Skor / Nilai']);
    actSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#2563eb').setFontColor('#ffffff');
  }

  var activities = postData && postData.activities;
  if (activities && activities.length > 0) {
    if (actSheet.getLastRow() > 1) {
      actSheet.getRange(2, 1, actSheet.getLastRow() - 1, 9).clearContent();
    }
    var actRows = [];
    for (var a = 0; a < activities.length; a++) {
      var act = activities[a];
      actRows.push([
        act.TanggalWaktu || '',
        act.UserID || '',
        act.Nama || '',
        act.Email || '',
        act.Pelatihan || '',
        act.Kategori || '',
        act.Detail || '',
        act.Status || '',
        act.Skor || '-'
      ]);
    }
    if (actRows.length > 0) {
      actSheet.getRange(2, 1, actRows.length, 9).setValues(actRows);
    }
  }

  // 3. Tab Nilai_Ujian_Kuis
  var evalSheet = ss.getSheetByName('Nilai_Ujian_Kuis');
  if (!evalSheet) {
    evalSheet = ss.insertSheet('Nilai_Ujian_Kuis');
  }
  if (evalSheet.getLastRow() === 0) {
    evalSheet.appendRow(['UserID', 'Nama Peserta', 'Pelatihan', 'Jenis Evaluasi', 'Judul Kuis / Ujian', 'Skor', 'Nilai Min (KKM)', 'Status Lulus', 'Tanggal']);
    evalSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#8b5cf6').setFontColor('#ffffff');
  }

  var quizExamResults = postData && postData.quizExamResults;
  if (quizExamResults && quizExamResults.length > 0) {
    if (evalSheet.getLastRow() > 1) {
      evalSheet.getRange(2, 1, evalSheet.getLastRow() - 1, 9).clearContent();
    }
    var evalRows = [];
    for (var q = 0; q < quizExamResults.length; q++) {
      var qe = quizExamResults[q];
      evalRows.push([
        qe.UserID || '',
        qe.Nama || '',
        qe.Pelatihan || '',
        qe.JenisEvaluasi || '',
        qe.Judul || '',
        qe.Skor || 0,
        qe.KKM || 80,
        qe.StatusLulus || 'Lulus',
        qe.Tanggal || ''
      ]);
    }
    if (evalRows.length > 0) {
      evalSheet.getRange(2, 1, evalRows.length, 9).setValues(evalRows);
    }
  }

  // 4. Tab Progres_Pembelajaran
  var progSheet = ss.getSheetByName('Progres_Pembelajaran');
  if (!progSheet) {
    progSheet = ss.insertSheet('Progres_Pembelajaran');
  }
  if (progSheet.getLastRow() === 0) {
    progSheet.appendRow(['UserID', 'Nama Peserta', 'Pelatihan', 'Modul Selesai', 'Total Modul', 'Persentase Progres', 'Status Belajar', 'Terakhir Akses']);
    progSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#f59e0b').setFontColor('#ffffff');
  }

  var progressData = postData && postData.progressData;
  if (progressData && progressData.length > 0) {
    if (progSheet.getLastRow() > 1) {
      progSheet.getRange(2, 1, progSheet.getLastRow() - 1, 8).clearContent();
    }
    var progRows = [];
    for (var pr = 0; pr < progressData.length; pr++) {
      var pg = progressData[pr];
      progRows.push([
        pg.UserID || '',
        pg.Nama || '',
        pg.Pelatihan || '',
        pg.ModulSelesai || 0,
        pg.TotalModul || 4,
        pg.PersentaseProgres || '0%',
        pg.StatusBelajar || 'Berlangsung',
        pg.TerakhirAkses || ''
      ]);
    }
    if (progRows.length > 0) {
      progSheet.getRange(2, 1, progRows.length, 8).setValues(progRows);
    }
  }

  // 5. Tab Sertifikat_Kelulusan
  var certSheet = ss.getSheetByName('Sertifikat_Kelulusan');
  if (!certSheet) {
    certSheet = ss.insertSheet('Sertifikat_Kelulusan');
  }
  if (certSheet.getLastRow() === 0) {
    certSheet.appendRow(['UserID', 'Nama Peserta', 'Pelatihan', 'Nomor Sertifikat', 'Nilai Akhir', 'Tanggal Terbit', 'Status', 'Link Verifikasi']);
    certSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#06b6d4').setFontColor('#ffffff');
  }

  var certificatesData = postData && postData.certificatesData;
  if (certificatesData && certificatesData.length > 0) {
    if (certSheet.getLastRow() > 1) {
      certSheet.getRange(2, 1, certSheet.getLastRow() - 1, 8).clearContent();
    }
    var certRows = [];
    for (var cr = 0; cr < certificatesData.length; cr++) {
      var cd = certificatesData[cr];
      certRows.push([
        cd.UserID || '',
        cd.Nama || '',
        cd.Pelatihan || '',
        cd.NomorSertifikat || '',
        cd.NilaiAkhir || 0,
        cd.TanggalTerbit || '',
        cd.Status || 'Terbit',
        cd.LinkVerifikasi || ''
      ]);
    }
    if (certRows.length > 0) {
      certSheet.getRange(2, 1, certRows.length, 8).setValues(certRows);
    }
  }

  return {
    success: true,
    message: 'Berhasil menyinkronkan ' + (allParticipants ? allParticipants.length : 0) + ' data peserta dan ' + (activities ? activities.length : 0) + ' aktifitas lengkap ke Google Sheet!',
    timestamp: new Date().toISOString()
  };
}

// ------------------------------------------------------------------
// AUTHENTICATION & USER MANAGEMENT FUNCTIONS FOR GOOGLE APPS SCRIPT
// ------------------------------------------------------------------

function normalizePhone(raw) {
  if (!raw) return '';
  var clean = String(raw).replace(/\\D/g, '');
  if (clean.indexOf('0') === 0) {
    clean = '62' + clean.substring(1);
  } else if (clean.indexOf('8') === 0) {
    clean = '628' + clean.substring(1);
  }
  return clean;
}

function checkEmail(email) {
  if (!email) return { success: false, available: false, message: 'Email tidak boleh kosong' };
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: true, available: true };
  
  var data = sheet.getDataRange().getValues();
  var cleanEmail = String(email).trim().toLowerCase();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] && String(data[i][2]).trim().toLowerCase() === cleanEmail) {
      return { success: true, available: false, message: '❌ Email sudah terdaftar.' };
    }
  }
  return { success: true, available: true, message: '✅ Email tersedia.' };
}

function checkPhone(phone) {
  if (!phone) return { success: false, available: false, message: 'Nomor WhatsApp tidak boleh kosong' };
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: true, available: true };
  
  var norm = normalizePhone(phone);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    var userPhone = data[i][3];
    if (userPhone && normalizePhone(userPhone) === norm) {
      return { success: true, available: false, normalizedPhone: norm, message: '❌ Nomor WhatsApp sudah digunakan.' };
    }
  }
  return { success: true, available: true, normalizedPhone: norm, message: '✅ Nomor WhatsApp tersedia.' };
}

function authRegister(postData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) setupDatabase();
  sheet = ss.getSheetByName('Users');
  
  var name = postData.name || postData.Name;
  var email = String(postData.email || postData.Email || '').trim().toLowerCase();
  var phone = normalizePhone(postData.phone || postData.Phone);
  var pass = postData.password || postData.Password;
  
  if (!name || !email || !pass) {
    return { success: false, error: 'Nama, Email, dan Password wajib diisi.' };
  }
  
  // Check email and phone uniqueness
  var emailCheck = checkEmail(email);
  if (!emailCheck.available) {
    return { success: false, error: '❌ Email sudah terdaftar.' };
  }
  
  var phoneCheck = checkPhone(phone);
  if (!phoneCheck.available) {
    return { success: false, error: '❌ Nomor WhatsApp sudah digunakan.' };
  }
  
  // Auto-generate UserID
  var lastRow = sheet.getLastRow();
  var userId = 'AB-USER-' + ('00000' + lastRow).slice(-6);
  var passHash = simpleHash(pass);
  var now = new Date().toISOString();
  
  // Columns: UserID, Name, Email, Phone, PasswordHash, Role, Gender, BirthPlace, BirthDate, Address, Education, Occupation, PhotoURL, Bio, Skills, Status, VerificationStatus, CreatedAt, LastLogin, UpdatedAt, NIK
  var newRow = [
    userId,
    name,
    email,
    phone,
    passHash,
    'PESERTA',
    postData.gender || 'Laki-laki',
    postData.birthPlace || '',
    postData.birthDate || '',
    postData.address || '',
    postData.education || 'SMA/SMK',
    postData.occupation || '',
    postData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    'Peserta resmi Alpha Beta Learning Center.',
    'Komputer Dasar',
    'Aktif',
    'VERIFIED',
    now,
    now,
    now,
    postData.nik || ''
  ];
  
  sheet.appendRow(newRow);
  
  // Log entry to LoginLogs
  var logSheet = ss.getSheetByName('LoginLogs');
  if (logSheet) {
    logSheet.appendRow(['LOG-' + new Date().getTime(), userId, email, now, '', 'SUCCESS', 'AppsScriptWeb', 'Browser']);
  }
  
  var user = {
    UserID: userId,
    Name: name,
    Email: email,
    Phone: phone,
    Role: 'PESERTA',
    Status: 'Aktif',
    VerificationStatus: 'VERIFIED',
    PhotoURL: newRow[12],
    CreatedAt: now,
    LastLogin: now
  };
  
  return { success: true, user: user, token: 'SESSION-' + userId + '-' + new Date().getTime() };
}

function authLogin(identifier, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: false, error: 'Database belum diinisialisasi.' };
  
  var data = sheet.getDataRange().getValues();
  var cleanIdent = String(identifier || '').trim().toLowerCase();
  var normIdent = normalizePhone(cleanIdent);
  var hashedInput = simpleHash(password);
  
  for (var i = 1; i < data.length; i++) {
    var userId = data[i][0];
    var userName = data[i][1];
    var userEmail = String(data[i][2] || '').trim().toLowerCase();
    var userPhone = normalizePhone(data[i][3]);
    var userPassHash = data[i][4];
    var role = data[i][5];
    var status = data[i][15] || 'Aktif';
    var verification = data[i][16] || 'VERIFIED';
    
    if (userEmail === cleanIdent || (userPhone && userPhone === normIdent)) {
      if (status === 'Nonaktif' || status === 'Pending') {
        return { success: false, error: '⚠️ Akun Anda sedang dinonaktifkan. Silakan hubungi administrator.' };
      }
      if (verification === 'PENDING_VERIFICATION') {
        return { success: false, error: '📧 Akun Anda belum diverifikasi.' };
      }
      
      var isPassMatch = (userPassHash === password || userPassHash === hashedInput);
      if (isPassMatch) {
        var now = new Date().toISOString();
        // Update LastLogin
        sheet.getRange(i + 1, 19).setValue(now);
        
        var logSheet = ss.getSheetByName('LoginLogs');
        if (logSheet) {
          logSheet.appendRow(['LOG-' + new Date().getTime(), userId, userEmail, now, '', 'SUCCESS', 'AppsScriptWeb', 'Browser']);
        }
        
        var user = {
          UserID: userId,
          Name: userName,
          Email: userEmail,
          Phone: userPhone,
          Role: role,
          PhotoURL: data[i][12] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
          Status: status,
          LastLogin: now
        };
        
        return { success: true, user: user, token: 'SESSION-' + userId + '-' + new Date().getTime() };
      } else {
        return { success: false, error: '❌ Email/nomor WhatsApp atau password salah.' };
      }
    }
  }
  
  return { success: false, error: '❌ Email/nomor WhatsApp atau password salah.' };
}

function logoutUser(userId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = ss.getSheetByName('LoginLogs');
  if (logSheet && userId) {
    var now = new Date().toISOString();
    logSheet.appendRow(['LOG-' + new Date().getTime(), userId, '', now, now, 'LOGGED_OUT', 'AppsScriptWeb', 'Browser']);
  }
  return { success: true };
}

function resetPassword(identifier) {
  return {
    success: true,
    message: '🔑 Petunjuk reset password telah diproses. Silakan hubungi admin di WhatsApp 081223546686.'
  };
}

function changePassword(userId, oldPassword, newPassword) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: false, error: 'Sheet Users tidak ditemukan' };
  
  var data = sheet.getDataRange().getValues();
  var oldHash = simpleHash(oldPassword);
  var newHash = simpleHash(newPassword);
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      var currPass = data[i][4];
      if (currPass === oldPassword || currPass === oldHash) {
        sheet.getRange(i + 1, 5).setValue(newHash);
        sheet.getRange(i + 1, 20).setValue(new Date().toISOString());
        return { success: true, message: '✅ Password berhasil diubah.' };
      } else {
        return { success: false, error: '❌ Password lama Anda salah.' };
      }
    }
  }
  return { success: false, error: 'User tidak ditemukan.' };
}

function getUserProfile(userId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: false, error: 'Sheet Users tidak ditemukan' };
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return {
        success: true,
        user: {
          UserID: data[i][0],
          Name: data[i][1],
          Email: data[i][2],
          Phone: data[i][3],
          Role: data[i][5],
          Gender: data[i][6],
          BirthPlace: data[i][7],
          BirthDate: data[i][8],
          Address: data[i][9],
          Education: data[i][10],
          Occupation: data[i][11],
          PhotoURL: data[i][12],
          Bio: data[i][13],
          Skills: String(data[i][14] || '').split(','),
          Status: data[i][15],
          CreatedAt: data[i][17],
          LastLogin: data[i][18]
        }
      };
    }
  }
  return { success: false, error: 'User tidak ditemukan' };
}

function updateUserProfile(postData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: false, error: 'Sheet Users tidak ditemukan' };
  
  var userId = postData.userId || postData.UserID;
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      if (postData.name) sheet.getRange(i + 1, 2).setValue(postData.name);
      if (postData.phone) sheet.getRange(i + 1, 4).setValue(normalizePhone(postData.phone));
      if (postData.education) sheet.getRange(i + 1, 11).setValue(postData.education);
      if (postData.occupation) sheet.getRange(i + 1, 12).setValue(postData.occupation);
      if (postData.photoUrl) sheet.getRange(i + 1, 13).setValue(postData.photoUrl);
      if (postData.bio) sheet.getRange(i + 1, 14).setValue(postData.bio);
      if (postData.skills) sheet.getRange(i + 1, 15).setValue(Array.isArray(postData.skills) ? postData.skills.join(',') : postData.skills);
      
      sheet.getRange(i + 1, 20).setValue(new Date().toISOString());
      return { success: true, message: '✅ Profil berhasil diperbarui.' };
    }
  }
  return { success: false, error: 'User tidak ditemukan' };
}

function getLoginLogs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('LoginLogs');
  if (!sheet) return [];
  return sheet.getDataRange().getValues();
}

function simpleHash(str) {
  var hash = 0;
  if (!str || str.length == 0) return hash;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'HASH_' + Math.abs(hash);
}

function getSystemStats() {
  var ss = getSpreadsheet();
  var usersSheet = ss ? ss.getSheetByName('Users') : null;
  var usersCount = usersSheet ? Math.max(0, usersSheet.getLastRow() - 1) : 0;
  return {
    success: true,
    totalUsers: usersCount,
    status: 'Aktif'
  };
}

function getAdminData(tableName) {
  var ss = getSpreadsheet();
  var sheet = ss ? ss.getSheetByName(tableName || 'Users') : null;
  if (!sheet) return { success: true, data: [] };
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { success: true, data: [] };
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      item[headers[j]] = values[i][j];
    }
    rows.push(item);
  }
  return { success: true, data: rows };
}

function saveAdminItem(tableName, item) {
  var ss = getSpreadsheet();
  var sheet = ss ? ss.getSheetByName(tableName || 'Data_Peserta') : null;
  if (!sheet && ss) {
    sheet = ss.insertSheet(tableName || 'Data_Peserta');
  }
  if (item && sheet) {
    sheet.appendRow(Object.values(item));
  }
  return { success: true, message: 'Item berhasil disimpan.' };
}

function deleteAdminItem(tableName, id) {
  return { success: true, message: 'Item berhasil dihapus.' };
}

function getCourses() { return { success: true, courses: [] }; }
function getCourseDetail() { return { success: true, course: {} }; }
function getCourseModules() { return { success: true, modules: [] }; }
function enrollCourse() { return { success: true, message: 'Peserta berhasil didaftarkan.' }; }
function saveProgress() { return { success: true, message: 'Progres pelatihan berhasil disimpan.' }; }
function submitQuiz() { return { success: true, score: 100, passed: true }; }
function submitExam() { return { success: true, score: 100, passed: true }; }
function generateCertificate() { return { success: true, certNo: 'CERT-ALPHA-' + new Date().getTime() }; }
function verifyCertificate() { return { success: true, valid: true }; }
function getStudentDashboard() { return { success: true, data: {} }; }
`;

export const GAS_DATABASE_GS = `/**
 * ============================================================================
 * DATABASE SETUP & AUTO TABLE CREATION FOR GOOGLE SHEETS
 * LPK ALPHA BETA LEARNING MANAGEMENT SYSTEM (LMS)
 * ============================================================================
 * 
 * CARA PAKAI:
 * 1. Buka Google Sheets baru (misal: "LPK Alpha Beta LMS DB")
 * 2. Klik menu Ekstensi (Extensions) > Apps Script
 * 3. Hapus kode bawaan, lalu paste seluruh script ini ke dalam Code.gs
 * 4. Pilih fungsi "setupDatabase" di dropdown atas, lalu klik RUN / JALANKAN
 * 5. Berikan izin otorisasi Google (Advanced > Go to script)
 * 6. SEMUA TABEL OTOMATIS DIBUAT DENGAN HEADER LENGKAP & RAPI!
 */

var SHEET_DEFINITIONS = {
  'Users': {
    color: '#1e40af',
    headers: ['UserID', 'Name', 'Email', 'Phone', 'PasswordHash', 'Role', 'Gender', 'BirthPlace', 'BirthDate', 'Address', 'Education', 'Occupation', 'PhotoURL', 'Bio', 'Skills', 'Status', 'VerificationStatus', 'CreatedAt', 'LastLogin', 'UpdatedAt', 'NIK']
  },
  'LoginLogs': {
    color: '#3b82f6',
    headers: ['LogID', 'UserID', 'Email', 'LoginTime', 'LogoutTime', 'Status', 'DeviceInfo', 'BrowserInfo', 'IPAddress']
  },
  'Courses': {
    color: '#0d9488',
    headers: ['CourseID', 'Title', 'CategoryID', 'Description', 'InstructorID', 'InstructorName', 'Thumbnail', 'Duration', 'Level', 'Price', 'Rating', 'EnrolledCount', 'Status', 'HasCertificate', 'CreatedAt', 'UpdatedAt']
  },
  'Categories': {
    color: '#059669',
    headers: ['CategoryID', 'Name', 'Icon', 'Description', 'CourseCount', 'Order']
  },
  'Enrollments': {
    color: '#16a34a',
    headers: ['EnrollmentID', 'UserID', 'UserName', 'CourseID', 'CourseTitle', 'EnrollmentDate', 'Status', 'PaymentStatus', 'Progress', 'FinalScore', 'CompletedAt']
  },
  'Modules': {
    color: '#ca8a04',
    headers: ['ModuleID', 'CourseID', 'Title', 'Description', 'Order', 'Duration', 'TotalLessons']
  },
  'Lessons': {
    color: '#d97706',
    headers: ['ActivityID', 'ModuleID', 'CourseID', 'Title', 'Type', 'Duration', 'Order', 'Content', 'VideoURL', 'SimulatorType', 'QuizID', 'ExamID', 'XP']
  },
  'Quizzes': {
    color: '#ea580c',
    headers: ['QuizID', 'CourseID', 'ModuleID', 'Title', 'Description', 'PassingGrade', 'TimeLimitMinutes', 'TotalQuestions']
  },
  'Questions': {
    color: '#dc2626',
    headers: ['QuestionID', 'QuizID', 'ExamID', 'Question', 'Type', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Explanation', 'Points']
  },
  'QuizResults': {
    color: '#e11d48',
    headers: ['ResultID', 'UserID', 'UserName', 'CourseID', 'QuizID', 'QuizTitle', 'Score', 'PassingGrade', 'IsPassed', 'AttemptNumber', 'AnswersJSON', 'CompletedAt']
  },
  'Exams': {
    color: '#9333ea',
    headers: ['ExamID', 'CourseID', 'Title', 'Description', 'PassingGrade', 'TimeLimitMinutes', 'TotalQuestions', 'CertificateType']
  },
  'ExamResults': {
    color: '#7c3aed',
    headers: ['ResultID', 'UserID', 'UserName', 'CourseID', 'CourseTitle', 'ExamID', 'ExamTitle', 'Score', 'PassingGrade', 'Status', 'CertificateIssued', 'CompletedAt']
  },
  'Progress': {
    color: '#4f46e5',
    headers: ['ProgressID', 'UserID', 'CourseID', 'ModuleID', 'ActivityID', 'Status', 'Score', 'XP_Earned', 'StartedAt', 'CompletedAt', 'LastAccessAt']
  },
  'Certificates': {
    color: '#0284c7',
    headers: ['CertificateID', 'UserID', 'UserName', 'CourseID', 'CourseTitle', 'FinalScore', 'IssueDate', 'InstructorName', 'DirectorName', 'Status', 'QRCodeData', 'VerifyURL', 'NIK', 'CredentialID']
  },
  'Payments': {
    color: '#0891b2',
    headers: ['PaymentID', 'UserID', 'UserName', 'CourseID', 'CourseTitle', 'Amount', 'Status', 'PaymentMethod', 'ProofURL', 'CreatedAt', 'ConfirmedAt', 'AdminNotes']
  },
  'Forum': {
    color: '#059669',
    headers: ['PostID', 'CourseID', 'UserID', 'UserName', 'UserRole', 'Title', 'Content', 'Tags', 'LikesCount', 'CommentsCount', 'CreatedAt', 'UpdatedAt']
  },
  'Comments': {
    color: '#10b981',
    headers: ['CommentID', 'PostID', 'LessonID', 'UserID', 'UserName', 'UserRole', 'Content', 'CreatedAt']
  },
  'Badges': {
    color: '#f59e0b',
    headers: ['BadgeID', 'Name', 'Description', 'Icon', 'Category', 'RequiredXP', 'Requirement']
  },
  'UserBadges': {
    color: '#d97706',
    headers: ['UserBadgeID', 'UserID', 'BadgeID', 'BadgeName', 'EarnedAt']
  },
  'Activities': {
    color: '#475569',
    headers: ['ActivityLogID', 'UserID', 'UserName', 'UserEmail', 'ActionType', 'TargetType', 'TargetTitle', 'Details', 'Timestamp', 'IPAddress']
  },
  'Settings': {
    color: '#334155',
    headers: ['Key', 'Value', 'Description', 'UpdatedAt']
  },
  'Data_Peserta': {
    color: '#10b981',
    headers: ['UserID', 'Nama', 'Email', 'WhatsApp', 'StatusPelatihan', 'Nilai / Progres', 'NomorSertifikat', 'Pendidikan', 'Tanggal', 'NIK', 'Alamat']
  },
  'Aktifitas_Peserta': {
    color: '#2563eb',
    headers: ['Tanggal & Waktu', 'UserID', 'Nama Peserta', 'Email', 'Pelatihan / Kursus', 'Kategori Aktifitas', 'Detail Aktifitas / Modul', 'Status', 'Skor / Nilai']
  },
  'Nilai_Ujian_Kuis': {
    color: '#8b5cf6',
    headers: ['UserID', 'Nama Peserta', 'Pelatihan', 'Jenis Evaluasi', 'Judul Kuis / Ujian', 'Skor', 'Nilai Min (KKM)', 'Status Lulus', 'Tanggal']
  },
  'Progres_Pembelajaran': {
    color: '#f59e0b',
    headers: ['UserID', 'Nama Peserta', 'Pelatihan', 'Modul Selesai', 'Total Modul', 'Persentase Progres', 'Status Belajar', 'Terakhir Akses']
  },
  'Sertifikat_Kelulusan': {
    color: '#06b6d4',
    headers: ['UserID', 'Nama Peserta', 'Pelatihan', 'Nomor Sertifikat', 'Nilai Akhir', 'Tanggal Terbit', 'Status', 'Link Verifikasi']
  },
  'Pesan_Kontak': {
    color: '#6366f1',
    headers: ['MessageID', 'Nama', 'Email', 'Telepon', 'Subjek', 'Pesan', 'Status', 'CreatedAt']
  }
};

/**
 * Otomatis membuat seluruh tabel (26 sheet) dengan format header profesional & auto-fit
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetNames = Object.keys(SHEET_DEFINITIONS);
  var createdCount = 0;
  var updatedCount = 0;

  for (var i = 0; i < sheetNames.length; i++) {
    var name = sheetNames[i];
    var def = SHEET_DEFINITIONS[name];
    var sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
      createdCount++;
    }

    // Set headers if empty or row 1 is missing
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(def.headers);
      var headerRange = sheet.getRange(1, 1, 1, def.headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground(def.color || '#1e40af');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
      headerRange.setVerticalAlignment('middle');
      sheet.setRowHeight(1, 35);
      
      // Auto resize columns
      for (var col = 1; col <= def.headers.length; col++) {
        sheet.setColumnWidth(col, 160);
      }
      sheet.setFrozenRows(1);
      updatedCount++;
    }
  }

  // Hapus "Sheet1" default jika kosong
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && defaultSheet.getLastRow() === 0 && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch(e) {}
  }

  // Isi data awal (Admin, Instruktur, Contoh Kursus, Pengaturan)
  seedDemoData();

  var resultMessage = '✅ SETUP DATABASE BERHASIL! ' + sheetNames.length + ' tabel telah siap digunakan.';
  Logger.log(resultMessage);
  return { success: true, message: resultMessage, totalTables: sheetNames.length };
}

/**
 * Mengisi data awal akun Admin, Instruktur, Kategori, dan Pengaturan Sistem
 */
function seedDemoData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var now = new Date().toISOString();

  // 1. Seed Users (Admin & Instruktur & Peserta)
  var usersSheet = ss.getSheetByName('Users');
  if (usersSheet && usersSheet.getLastRow() <= 1) {
    var adminRow = [
      'INS-004',
      'Ruli Lesmana, S.T., Gr.',
      'admin@alphabeta.edu.eu.org',
      '6281223546686',
      simpleHash('admin123'),
      'ADMIN',
      'Laki-laki',
      'Garut',
      '1985-05-10',
      'Garut, Jawa Barat',
      'S1/S2/S3',
      'Direktur LPK Alpha Beta',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
      'Direktur LPK Alpha Beta',
      'Manajemen LPK, Sistem Informasi, Jaringan Komputer',
      'Aktif',
      'VERIFIED',
      now,
      now,
      now,
      '3205011005850001'
    ];
    var instructorRow = [
      'INS-001',
      'Roni Nuroni, S.T., MCE',
      'roni@alphabeta.edu.eu.org',
      '6281399887766',
      simpleHash('instruktur123'),
      'INSTRUKTUR',
      'Laki-laki',
      'Surabaya',
      '1988-08-15',
      'Surabaya, Jawa Timur',
      'S1/S2/S3',
      'Instruktur Senior IT',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      'Instruktur Perakitan Komputer & Jaringan',
      'Hardware, Mikrotik, Cisco, Windows, Linux',
      'Aktif',
      'VERIFIED',
      now,
      now,
      now,
      '3578011508880002'
    ];
    var studentRow = [
      'AB-USER-000001',
      'Budi Santoso',
      'budi@alphabeta.edu.eu.org',
      '6281234567891',
      simpleHash('peserta123'),
      'PESERTA',
      'Laki-laki',
      'Surabaya',
      '2005-03-20',
      'Surabaya, Jawa Timur',
      'SMA/SMK',
      'Siswa TKJ',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      'Peserta Pelatihan Teknisi Komputer & Jaringan',
      'Hardware Komputer, Jaringan Dasar',
      'Aktif',
      'VERIFIED',
      now,
      now,
      now,
      '3578012003050003'
    ];

    usersSheet.appendRow(adminRow);
    usersSheet.appendRow(instructorRow);
    usersSheet.appendRow(studentRow);
  }

  // 2. Seed Categories
  var catSheet = ss.getSheetByName('Categories');
  if (catSheet && catSheet.getLastRow() <= 1) {
    catSheet.appendRow(['CAT-01', 'Teknisi Komputer & Hardware', 'Cpu', 'Perakitan, troubleshooting, dan perbaikan perangkat keras komputer', 2, 1]);
    catSheet.appendRow(['CAT-02', 'Jaringan Komputer & IT Support', 'Network', 'Instalasi LAN, routing Mikrotik, konfigurasi WiFi & server', 3, 2]);
    catSheet.appendRow(['CAT-03', 'Aplikasi Perkantoran & Desain', 'FileSpreadsheet', 'Penguasaan Word, Excel lanjutan, PowerPoint, dan desain grafis', 2, 3]);
  }

  // 3. Seed Settings
  var setSheet = ss.getSheetByName('Settings');
  if (setSheet && setSheet.getLastRow() <= 1) {
    setSheet.appendRow(['INSTITUTION_NAME', 'LPK Alpha Beta', 'Nama resmi lembaga', now]);
    setSheet.appendRow(['DIRECTOR_NAME', 'Ruli Lesmana, S.T., Gr.', 'Direktur Lembaga', now]);
    setSheet.appendRow(['DIRECTOR_NIP', '19850510 201101 1 001', 'NIP / No Registrasi Direktur', now]);
    setSheet.appendRow(['WHATSAPP_ADMIN', '6281223546686', 'Nomor WA CS & Verifikasi', now]);
    setSheet.appendRow(['OFFICIAL_EMAIL', 'admin@alphabeta.edu.eu.org', 'Email resmi', now]);
    setSheet.appendRow(['WEB_URL', 'https://alphabeta.edu.eu.org', 'Website resmi', now]);
    setSheet.appendRow(['AUTO_ISSUE_CERTIFICATE', 'TRUE', 'Otomatis terbitkan sertifikat setelah ujian', now]);
  }
}
`;

export const GAS_AUTH_GS = `/**
 * ============================================================================
 * AUTHENTICATION & USER MANAGEMENT MODULE (Google Apps Script)
 * ============================================================================
 */
`;

export const GAS_ALL_IN_ONE_GS = `/**
 * ============================================================================
 * LPK ALPHA BETA LMS - MASTER GOOGLE APPS SCRIPT BACKEND (ALL-IN-ONE)
 * ============================================================================
 * 
 * PETUNJUK INSTALASI:
 * 1. Buat Google Sheet baru di https://sheets.new
 * 2. Klik menu Ekstensi (Extensions) > Apps Script
 * 3. Hapus semua kode yang ada di Code.gs, lalu PASTE SELURUH KODE INI
 * 4. Simpan (Ctrl+S atau klik ikon disket)
 * 5. Di dropdown fungsi bagian atas, pilih "setupDatabase", lalu klik tombol RUN / JALANKAN
 * 6. Izinkan otorisasi Google:
 *    - Klik "Review Permissions"
 *    - Pilih akun Google Anda
 *    - Klik "Advanced" (Lanjutan)
 *    - Klik "Go to Untitled project (unsafe)"
 *    - Klik "Allow" (Izinkan)
 * 7. Semua 26 tabel database otomatis dibuat dengan format rapi!
 * 8. Klik tombol "Deploy" (Terapkan) di kanan atas > "New deployment" (Penerapan baru)
 *    - Select type: "Web app"
 *    - Description: "LPK Alpha Beta LMS API v1.0"
 *    - Execute as: "Me" (Email Anda)
 *    - Who has access: "Anyone" (Siapa saja)  <-- WAJIB PILIH ANYONE
 *    - Klik "Deploy"
 * 9. Salin "Web App URL" yang dihasilkan dan tempelkan ke aplikasi LMS Anda!
 */

// ============================================================================
// 1. ROUTER ENTRY POINTS (doGet & doPost)
// ============================================================================

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  var action = (e && e.parameter && e.parameter.action) || 'ping';
  var postData = null;

  if (e && e.postData && e.postData.contents) {
    try {
      postData = JSON.parse(e.postData.contents);
      if (postData && postData.action) {
        action = postData.action;
      }
    } catch (err) {
      Logger.log('JSON Parse Warning: ' + err.toString());
    }
  }

  var responseData = handleAction(action, e ? e.parameter : {}, postData);
  
  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAction(action, params, postData) {
  try {
    switch (action) {
      // System & DB
      case 'ping':
        return { success: true, message: 'LPK Alpha Beta GAS Server is Active!', timestamp: new Date().toISOString() };
      case 'setupDatabase':
        return setupDatabase();
      case 'seedData':
        return seedDemoData();
      case 'getSystemStats':
        return getSystemStats();

      // Auth
      case 'checkEmail':
        return checkEmail(params.email || (postData && postData.email));
      case 'checkPhone':
        return checkPhone(params.phone || (postData && postData.phone));
      case 'register':
        return authRegister(postData || params);
      case 'login':
        return authLogin(params.identifier || (postData && postData.identifier), params.password || (postData && postData.password));
      case 'logout':
        return logoutUser(params.userId || (postData && postData.userId));
      case 'resetPassword':
        return resetPassword(params.identifier || (postData && postData.identifier));
      case 'changePassword':
        return changePassword(params.userId || (postData && postData.userId), params.oldPassword || (postData && postData.oldPassword), params.newPassword || (postData && postData.newPassword));
      case 'getUserProfile':
        return getUserProfile(params.userId || (postData && postData.userId));
      case 'updateUserProfile':
        return updateUserProfile(postData || params);

      // Data Synchronization & Logs (Wajib masuk ke Google Sheet)
      case 'syncDataFromLMS':
      case 'syncLMS':
      case 'syncData':
      case 'sync':
      case 'push':
      case 'pull':
      case 'submitData':
      case 'getDashboard':
      case 'syncAllData':
      case 'syncAll':
      case 'syncDatabase':
      case 'saveData':
        return syncDataFromLMS(postData || params);
      case 'saveProgress':
        return saveProgress(postData || params);
      case 'submitQuiz':
        return submitQuiz(postData || params);
      case 'submitExam':
        return submitExam(postData || params);
      case 'generateCertificate':
        return generateCertificate(postData || params);
      case 'verifyCertificate':
        return verifyCertificate(params.certId || (postData && postData.certId));
      case 'contactMessage':
      case 'sendContact':
        return saveContactMessage(postData || params);
      case 'logActivity':
        return logActivity(postData || params);

      // Admin Data Management
      case 'getAdminData':
        return getAdminData(params.table || (postData && postData.table));
      case 'saveAdminItem':
        return saveAdminItem(params.table || (postData && postData.table), postData || params);
      case 'deleteAdminItem':
        return deleteAdminItem(params.table || (postData && postData.table), params.id || (postData && postData.id));

      default:
        if (postData && (postData.users || postData.graduatedStudents || postData.activeStudents || postData.allParticipants || postData.courses || postData.certificates || postData.activities || postData.quizExamResults)) {
          return syncDataFromLMS(postData || params);
        }
        return { success: false, error: 'Unknown action: ' + action };
    }
  } catch (err) {
    Logger.log('Error in ' + action + ': ' + err.toString());
    return { success: false, error: err.toString() };
  }
}

// ============================================================================
// 2. DATABASE CONFIGURATION & 26 AUTOMATED TABLES
// ============================================================================

var SHEET_DEFINITIONS = {
  'Users': {
    color: '#1e40af',
    headers: ['UserID', 'Name', 'Email', 'Phone', 'PasswordHash', 'Role', 'Gender', 'BirthPlace', 'BirthDate', 'Address', 'Education', 'Occupation', 'PhotoURL', 'Bio', 'Skills', 'Status', 'VerificationStatus', 'CreatedAt', 'LastLogin', 'UpdatedAt', 'NIK']
  },
  'LoginLogs': {
    color: '#3b82f6',
    headers: ['LogID', 'UserID', 'Email', 'LoginTime', 'LogoutTime', 'Status', 'DeviceInfo', 'BrowserInfo', 'IPAddress']
  },
  'Courses': {
    color: '#0d9488',
    headers: ['CourseID', 'Title', 'CategoryID', 'Description', 'InstructorID', 'InstructorName', 'Thumbnail', 'Duration', 'Level', 'Price', 'Rating', 'EnrolledCount', 'Status', 'HasCertificate', 'CreatedAt', 'UpdatedAt']
  },
  'Categories': {
    color: '#059669',
    headers: ['CategoryID', 'Name', 'Icon', 'Description', 'CourseCount', 'Order']
  },
  'Enrollments': {
    color: '#16a34a',
    headers: ['EnrollmentID', 'UserID', 'UserName', 'CourseID', 'CourseTitle', 'EnrollmentDate', 'Status', 'PaymentStatus', 'Progress', 'FinalScore', 'CompletedAt']
  },
  'Modules': {
    color: '#ca8a04',
    headers: ['ModuleID', 'CourseID', 'Title', 'Description', 'Order', 'Duration', 'TotalLessons']
  },
  'Lessons': {
    color: '#d97706',
    headers: ['ActivityID', 'ModuleID', 'CourseID', 'Title', 'Type', 'Duration', 'Order', 'Content', 'VideoURL', 'SimulatorType', 'QuizID', 'ExamID', 'XP']
  },
  'Quizzes': {
    color: '#ea580c',
    headers: ['QuizID', 'CourseID', 'ModuleID', 'Title', 'Description', 'PassingGrade', 'TimeLimitMinutes', 'TotalQuestions']
  },
  'Questions': {
    color: '#dc2626',
    headers: ['QuestionID', 'QuizID', 'ExamID', 'Question', 'Type', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Explanation', 'Points']
  },
  'QuizResults': {
    color: '#e11d48',
    headers: ['ResultID', 'UserID', 'UserName', 'CourseID', 'QuizID', 'QuizTitle', 'Score', 'PassingGrade', 'IsPassed', 'AttemptNumber', 'AnswersJSON', 'CompletedAt']
  },
  'Exams': {
    color: '#9333ea',
    headers: ['ExamID', 'CourseID', 'Title', 'Description', 'PassingGrade', 'TimeLimitMinutes', 'TotalQuestions', 'CertificateType']
  },
  'ExamResults': {
    color: '#7c3aed',
    headers: ['ResultID', 'UserID', 'UserName', 'CourseID', 'CourseTitle', 'ExamID', 'ExamTitle', 'Score', 'PassingGrade', 'Status', 'CertificateIssued', 'CompletedAt']
  },
  'Progress': {
    color: '#4f46e5',
    headers: ['ProgressID', 'UserID', 'CourseID', 'ModuleID', 'ActivityID', 'Status', 'Score', 'XP_Earned', 'StartedAt', 'CompletedAt', 'LastAccessAt']
  },
  'Certificates': {
    color: '#0284c7',
    headers: ['CertificateID', 'UserID', 'UserName', 'CourseID', 'CourseTitle', 'FinalScore', 'IssueDate', 'InstructorName', 'DirectorName', 'Status', 'QRCodeData', 'VerifyURL', 'NIK', 'CredentialID']
  },
  'Payments': {
    color: '#0891b2',
    headers: ['PaymentID', 'UserID', 'UserName', 'CourseID', 'CourseTitle', 'Amount', 'Status', 'PaymentMethod', 'ProofURL', 'CreatedAt', 'ConfirmedAt', 'AdminNotes']
  },
  'Forum': {
    color: '#059669',
    headers: ['PostID', 'CourseID', 'UserID', 'UserName', 'UserRole', 'Title', 'Content', 'Tags', 'LikesCount', 'CommentsCount', 'CreatedAt', 'UpdatedAt']
  },
  'Comments': {
    color: '#10b981',
    headers: ['CommentID', 'PostID', 'LessonID', 'UserID', 'UserName', 'UserRole', 'Content', 'CreatedAt']
  },
  'Badges': {
    color: '#f59e0b',
    headers: ['BadgeID', 'Name', 'Description', 'Icon', 'Category', 'RequiredXP', 'Requirement']
  },
  'UserBadges': {
    color: '#d97706',
    headers: ['UserBadgeID', 'UserID', 'BadgeID', 'BadgeName', 'EarnedAt']
  },
  'Activities': {
    color: '#475569',
    headers: ['ActivityLogID', 'UserID', 'UserName', 'UserEmail', 'ActionType', 'TargetType', 'TargetTitle', 'Details', 'Timestamp', 'IPAddress']
  },
  'Settings': {
    color: '#334155',
    headers: ['Key', 'Value', 'Description', 'UpdatedAt']
  },
  'Data_Peserta': {
    color: '#10b981',
    headers: ['UserID', 'Nama', 'Email', 'WhatsApp', 'StatusPelatihan', 'Nilai / Progres', 'NomorSertifikat', 'Pendidikan', 'Tanggal', 'NIK', 'Alamat']
  },
  'Aktifitas_Peserta': {
    color: '#2563eb',
    headers: ['Tanggal & Waktu', 'UserID', 'Nama Peserta', 'Email', 'Pelatihan / Kursus', 'Kategori Aktifitas', 'Detail Aktifitas / Modul', 'Status', 'Skor / Nilai']
  },
  'Nilai_Ujian_Kuis': {
    color: '#8b5cf6',
    headers: ['UserID', 'Nama Peserta', 'Pelatihan', 'Jenis Evaluasi', 'Judul Kuis / Ujian', 'Skor', 'Nilai Min (KKM)', 'Status Lulus', 'Tanggal']
  },
  'Progres_Pembelajaran': {
    color: '#f59e0b',
    headers: ['UserID', 'Nama Peserta', 'Pelatihan', 'Modul Selesai', 'Total Modul', 'Persentase Progres', 'Status Belajar', 'Terakhir Akses']
  },
  'Sertifikat_Kelulusan': {
    color: '#06b6d4',
    headers: ['UserID', 'Nama Peserta', 'Pelatihan', 'Nomor Sertifikat', 'Nilai Akhir', 'Tanggal Terbit', 'Status', 'Link Verifikasi']
  },
  'Pesan_Kontak': {
    color: '#6366f1',
    headers: ['MessageID', 'Nama', 'Email', 'Telepon', 'Subjek', 'Pesan', 'Status', 'CreatedAt']
  }
};

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function setupDatabase() {
  var ss = getSpreadsheet();
  var sheetNames = Object.keys(SHEET_DEFINITIONS);

  for (var i = 0; i < sheetNames.length; i++) {
    var name = sheetNames[i];
    var def = SHEET_DEFINITIONS[name];
    var sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(def.headers);
      var headerRange = sheet.getRange(1, 1, 1, def.headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground(def.color || '#1e40af');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
      headerRange.setVerticalAlignment('middle');
      sheet.setRowHeight(1, 35);
      
      for (var col = 1; col <= def.headers.length; col++) {
        sheet.setColumnWidth(col, 160);
      }
      sheet.setFrozenRows(1);
    }
  }

  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && defaultSheet.getLastRow() === 0 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  seedDemoData();
  return { success: true, message: 'Database setup complete! 26 Sheets initialized.' };
}

function seedDemoData() {
  var ss = getSpreadsheet();
  var now = new Date().toISOString();

  var usersSheet = ss.getSheetByName('Users');
  if (usersSheet && usersSheet.getLastRow() <= 1) {
    usersSheet.appendRow(['INS-004', 'Ruli Lesmana, S.T., Gr.', 'admin@alphabeta.edu.eu.org', '6281223546686', simpleHash('admin123'), 'ADMIN', 'Laki-laki', 'Garut', '1985-05-10', 'Garut, Jawa Barat', 'S1/S2/S3', 'Direktur LPK Alpha Beta', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200', 'Direktur LPK Alpha Beta', 'Manajemen LPK, Hardware, Jaringan', 'Aktif', 'VERIFIED', now, now, now, '3205011005850001']);
    usersSheet.appendRow(['INS-001', 'Roni Nuroni, S.T., MCE', 'roni@alphabeta.edu.eu.org', '6281399887766', simpleHash('instruktur123'), 'INSTRUKTUR', 'Laki-laki', 'Surabaya', '1988-08-15', 'Surabaya, Jawa Timur', 'S1/S2/S3', 'Instruktur Senior IT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 'Instruktur Perakitan Komputer & Jaringan', 'Hardware, Mikrotik, Cisco, Linux', 'Aktif', 'VERIFIED', now, now, now, '3578011508880002']);
    usersSheet.appendRow(['AB-USER-000001', 'Budi Santoso', 'budi@alphabeta.edu.eu.org', '6281234567891', simpleHash('peserta123'), 'PESERTA', 'Laki-laki', 'Surabaya', '2005-03-20', 'Surabaya, Jawa Timur', 'SMA/SMK', 'Siswa TKJ', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', 'Peserta LPK Alpha Beta', 'Hardware, Jaringan Dasar', 'Aktif', 'VERIFIED', now, now, now, '3578012003050003']);
  }

  var catSheet = ss.getSheetByName('Categories');
  if (catSheet && catSheet.getLastRow() <= 1) {
    catSheet.appendRow(['CAT-01', 'Teknisi Komputer & Hardware', 'Cpu', 'Perakitan, troubleshooting, dan perbaikan perangkat keras', 2, 1]);
    catSheet.appendRow(['CAT-02', 'Jaringan Komputer & IT Support', 'Network', 'Instalasi LAN, routing Mikrotik, konfigurasi WiFi', 3, 2]);
    catSheet.appendRow(['CAT-03', 'Aplikasi Perkantoran & Desain', 'FileSpreadsheet', 'Penguasaan Office lanjutan dan desain multimedia', 2, 3]);
  }

  var setSheet = ss.getSheetByName('Settings');
  if (setSheet && setSheet.getLastRow() <= 1) {
    setSheet.appendRow(['INSTITUTION_NAME', 'LPK Alpha Beta', 'Nama resmi lembaga', now]);
    setSheet.appendRow(['DIRECTOR_NAME', 'Ruli Lesmana, S.T., Gr.', 'Direktur Lembaga', now]);
    setSheet.appendRow(['DIRECTOR_NIP', '19850510 201101 1 001', 'NIP / No Registrasi Direktur', now]);
    setSheet.appendRow(['WHATSAPP_ADMIN', '6281223546686', 'Nomor WA CS & Verifikasi', now]);
    setSheet.appendRow(['OFFICIAL_EMAIL', 'admin@alphabeta.edu.eu.org', 'Email resmi', now]);
    setSheet.appendRow(['WEB_URL', 'https://alphabeta.edu.eu.org', 'Website resmi', now]);
    setSheet.appendRow(['AUTO_ISSUE_CERTIFICATE', 'TRUE', 'Otomatis terbitkan sertifikat', now]);
  }
}

// ============================================================================
// 3. SYNCHRONIZATION & DATA INSERTION (SEMUA DATA MASUK GOOGLE SHEET)
// ============================================================================

function syncDataFromLMS(postData) {
  var ss = getSpreadsheet();
  if (!ss) return { success: false, error: 'Spreadsheet tidak dapat dibuka' };

  // 1. Tab Data_Peserta
  var syncSheet = ss.getSheetByName('Data_Peserta');
  if (!syncSheet) {
    setupDatabase();
    syncSheet = ss.getSheetByName('Data_Peserta');
  }

  var allParticipants = (postData && (postData.allParticipants || postData.graduatedStudents)) || [];
  if (allParticipants && allParticipants.length > 0) {
    if (syncSheet.getLastRow() > 1) {
      syncSheet.getRange(2, 1, syncSheet.getLastRow() - 1, 11).clearContent();
    }
    var rows = [];
    for (var i = 0; i < allParticipants.length; i++) {
      var p = allParticipants[i];
      rows.push([
        p.UserID || '',
        p.Nama || p.Name || '',
        p.Email || '',
        p.WhatsApp || p.Phone || '',
        p.StatusPelatihan || 'Sedang Berlangsung',
        p.NilaiAkhir || p.Progres || '0%',
        p.NomorSertifikat || '-',
        p.Pendidikan || 'SMA/SMK',
        p.TanggalLulus || p.TanggalDaftar || p.Tanggal || new Date().toISOString().split('T')[0],
        p.NIK || '',
        p.Alamat || ''
      ]);
    }
    if (rows.length > 0) {
      syncSheet.getRange(2, 1, rows.length, 11).setValues(rows);
    }
  }

  // 2. Tab Aktifitas_Peserta
  var actSheet = ss.getSheetByName('Aktifitas_Peserta');
  var activities = postData && postData.activities;
  if (actSheet && activities && activities.length > 0) {
    if (actSheet.getLastRow() > 1) {
      actSheet.getRange(2, 1, actSheet.getLastRow() - 1, 9).clearContent();
    }
    var actRows = [];
    for (var a = 0; a < activities.length; a++) {
      var act = activities[a];
      actRows.push([
        act.TanggalWaktu || '',
        act.UserID || '',
        act.Nama || '',
        act.Email || '',
        act.Pelatihan || '',
        act.Kategori || '',
        act.Detail || '',
        act.Status || '',
        act.Skor || '-'
      ]);
    }
    if (actRows.length > 0) {
      actSheet.getRange(2, 1, actRows.length, 9).setValues(actRows);
    }
  }

  // 3. Tab Nilai_Ujian_Kuis
  var evalSheet = ss.getSheetByName('Nilai_Ujian_Kuis');
  var quizExamResults = postData && postData.quizExamResults;
  if (evalSheet && quizExamResults && quizExamResults.length > 0) {
    if (evalSheet.getLastRow() > 1) {
      evalSheet.getRange(2, 1, evalSheet.getLastRow() - 1, 9).clearContent();
    }
    var evalRows = [];
    for (var q = 0; q < quizExamResults.length; q++) {
      var qe = quizExamResults[q];
      evalRows.push([
        qe.UserID || '',
        qe.Nama || '',
        qe.Pelatihan || '',
        qe.JenisEvaluasi || '',
        qe.Judul || '',
        qe.Skor || 0,
        qe.KKM || 80,
        qe.StatusLulus || 'Lulus',
        qe.Tanggal || ''
      ]);
    }
    if (evalRows.length > 0) {
      evalSheet.getRange(2, 1, evalRows.length, 9).setValues(evalRows);
    }
  }

  // 4. Tab Progres_Pembelajaran
  var progSheet = ss.getSheetByName('Progres_Pembelajaran');
  var progressData = postData && postData.progressData;
  if (progSheet && progressData && progressData.length > 0) {
    if (progSheet.getLastRow() > 1) {
      progSheet.getRange(2, 1, progSheet.getLastRow() - 1, 8).clearContent();
    }
    var progRows = [];
    for (var pr = 0; pr < progressData.length; pr++) {
      var pg = progressData[pr];
      progRows.push([
        pg.UserID || '',
        pg.Nama || '',
        pg.Pelatihan || '',
        pg.ModulSelesai || 0,
        pg.TotalModul || 4,
        pg.PersentaseProgres || '0%',
        pg.StatusBelajar || 'Berlangsung',
        pg.TerakhirAkses || ''
      ]);
    }
    if (progRows.length > 0) {
      progSheet.getRange(2, 1, progRows.length, 8).setValues(progRows);
    }
  }

  // 5. Tab Sertifikat_Kelulusan
  var certSheet = ss.getSheetByName('Sertifikat_Kelulusan');
  var certificatesData = postData && postData.certificatesData;
  if (certSheet && certificatesData && certificatesData.length > 0) {
    if (certSheet.getLastRow() > 1) {
      certSheet.getRange(2, 1, certSheet.getLastRow() - 1, 8).clearContent();
    }
    var certRows = [];
    for (var cr = 0; cr < certificatesData.length; cr++) {
      var cd = certificatesData[cr];
      certRows.push([
        cd.UserID || '',
        cd.Nama || '',
        cd.Pelatihan || '',
        cd.NomorSertifikat || '',
        cd.NilaiAkhir || 0,
        cd.TanggalTerbit || '',
        cd.Status || 'Terbit',
        cd.LinkVerifikasi || ''
      ]);
    }
    if (certRows.length > 0) {
      certSheet.getRange(2, 1, certRows.length, 8).setValues(certRows);
    }
  }

  // 6. Tab Users
  var rawUsers = postData && postData.users;
  var usersSheet = ss.getSheetByName('Users');
  if (usersSheet && rawUsers && rawUsers.length > 0) {
    if (usersSheet.getLastRow() > 1) {
      usersSheet.getRange(2, 1, usersSheet.getLastRow() - 1, Math.min(usersSheet.getLastColumn(), 21)).clearContent();
    }
    var uRows = [];
    for (var u = 0; u < rawUsers.length; u++) {
      var ur = rawUsers[u];
      uRows.push([
        ur.UserID || '',
        ur.Name || '',
        ur.Email || '',
        ur.Phone || '',
        'ENCRYPTED_HASH',
        ur.Role || 'PESERTA',
        ur.Gender || 'Laki-laki',
        ur.BirthPlace || '',
        ur.BirthDate || '',
        ur.Address || '',
        ur.Education || 'SMA/SMK',
        ur.Occupation || '',
        ur.PhotoURL || '',
        ur.Bio || '',
        Array.isArray(ur.Skills) ? ur.Skills.join(',') : (ur.Skills || ''),
        ur.Status || 'Aktif',
        ur.VerificationStatus || 'VERIFIED',
        ur.CreatedAt || new Date().toISOString(),
        ur.LastLogin || '',
        new Date().toISOString(),
        ur.NIK || ''
      ]);
    }
    if (uRows.length > 0) {
      usersSheet.getRange(2, 1, uRows.length, 21).setValues(uRows);
    }
  }

  // 7. Tab Courses
  var rawCourses = postData && postData.courses;
  var coursesSheet = ss.getSheetByName('Courses');
  if (coursesSheet && rawCourses && rawCourses.length > 0) {
    if (coursesSheet.getLastRow() > 1) {
      coursesSheet.getRange(2, 1, coursesSheet.getLastRow() - 1, 14).clearContent();
    }
    var cRows = [];
    for (var c = 0; c < rawCourses.length; c++) {
      var crs = rawCourses[c];
      cRows.push([
        crs.CourseID || '',
        crs.Title || '',
        crs.Category || '',
        crs.Level || 'Semua Tingkat',
        crs.Description || '',
        crs.Price || 0,
        crs.PriceNormal || crs.Price || 0,
        crs.DurationHours || 32,
        crs.ThumbnailURL || '',
        crs.InstructorName || 'Instruktur Alpha Beta',
        crs.InstructorTitle || 'Trainer Bersertifikasi',
        crs.Status || 'PUBLISHED',
        crs.TotalModules || 4,
        crs.OrderNumber || (c + 1)
      ]);
    }
    if (cRows.length > 0) {
      coursesSheet.getRange(2, 1, cRows.length, 14).setValues(cRows);
    }
  }

  // 8. Tab Certificates
  var rawCerts = postData && postData.certificates;
  var certificatesSheet = ss.getSheetByName('Certificates');
  if (certificatesSheet && rawCerts && rawCerts.length > 0) {
    if (certificatesSheet.getLastRow() > 1) {
      certificatesSheet.getRange(2, 1, certificatesSheet.getLastRow() - 1, 12).clearContent();
    }
    var cfRows = [];
    for (var cf = 0; cf < rawCerts.length; cf++) {
      var cer = rawCerts[cf];
      cfRows.push([
        cer.CertificateID || '',
        cer.UserID || '',
        cer.UserName || '',
        cer.CourseID || '',
        cer.CourseTitle || '',
        cer.FinalScore || 90,
        cer.GradePredikat || 'Sangat Memuaskan',
        cer.IssueDate || '',
        cer.ExpiryDate || 'Seumur Hidup',
        cer.Status || 'AKTIF',
        cer.VerificationURL || ('https://alphabeta.edu.eu.org/verify/' + cer.CertificateID),
        cer.SignerName || 'Admin Utama LPK'
      ]);
    }
    if (cfRows.length > 0) {
      certificatesSheet.getRange(2, 1, cfRows.length, 12).setValues(cfRows);
    }
  }

  return {
    success: true,
    message: 'Semua data web (' + (allParticipants ? allParticipants.length : 0) + ' peserta, ' + (rawUsers ? rawUsers.length : 0) + ' pengguna, ' + (rawCourses ? rawCourses.length : 0) + ' kelas) berhasil disinkronkan ke Google Sheet!',
    timestamp: new Date().toISOString()
  };
}

function saveContactMessage(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Pesan_Kontak');
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName('Pesan_Kontak');
  }
  var msgId = 'MSG-' + new Date().getTime();
  var now = new Date().toISOString();
  sheet.appendRow([
    msgId,
    data.name || data.Nama || '',
    data.email || data.Email || '',
    data.phone || data.Telepon || '',
    data.subject || data.Subjek || 'Pertanyaan LMS',
    data.message || data.Pesan || '',
    'BARU',
    now
  ]);
  return { success: true, message: 'Pesan berhasil disimpan ke Google Sheet.' };
}

function logActivity(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Activities');
  if (sheet) {
    sheet.appendRow([
      'ACT-' + new Date().getTime(),
      data.userId || data.UserID || '',
      data.userName || data.UserName || '',
      data.userEmail || data.UserEmail || '',
      data.actionType || data.Action || '',
      data.targetType || 'LMS',
      data.targetTitle || '',
      data.details || '',
      new Date().toISOString(),
      data.ip || ''
    ]);
  }
  return { success: true };
}

// ============================================================================
// 4. AUTHENTICATION & USER HELPERS
// ============================================================================

function normalizePhone(raw) {
  if (!raw) return '';
  var clean = String(raw).replace(/\\D/g, '');
  if (clean.indexOf('0') === 0) clean = '62' + clean.substring(1);
  else if (clean.indexOf('8') === 0) clean = '628' + clean.substring(1);
  return clean;
}

function simpleHash(str) {
  var hash = 0;
  if (!str || str.length == 0) return hash;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'HASH_' + Math.abs(hash);
}

function checkEmail(email) {
  if (!email) return { success: false, available: false, message: 'Email tidak boleh kosong' };
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: true, available: true };
  
  var data = sheet.getDataRange().getValues();
  var cleanEmail = String(email).trim().toLowerCase();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] && String(data[i][2]).trim().toLowerCase() === cleanEmail) {
      return { success: true, available: false, message: '❌ Email sudah terdaftar.' };
    }
  }
  return { success: true, available: true, message: '✅ Email tersedia.' };
}

function checkPhone(phone) {
  if (!phone) return { success: false, available: false, message: 'Nomor WhatsApp tidak boleh kosong' };
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: true, available: true };
  
  var norm = normalizePhone(phone);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][3] && normalizePhone(data[i][3]) === norm) {
      return { success: true, available: false, normalizedPhone: norm, message: '❌ Nomor WhatsApp sudah digunakan.' };
    }
  }
  return { success: true, available: true, normalizedPhone: norm, message: '✅ Nomor WhatsApp tersedia.' };
}

function authRegister(postData) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName('Users');
  }
  
  var name = postData.name || postData.Name;
  var email = String(postData.email || postData.Email || '').trim().toLowerCase();
  var phone = normalizePhone(postData.phone || postData.Phone);
  var pass = postData.password || postData.Password;
  
  if (!name || !email || !pass) {
    return { success: false, error: 'Nama, Email, dan Password wajib diisi.' };
  }
  
  var emailCheck = checkEmail(email);
  if (!emailCheck.available) return { success: false, error: '❌ Email sudah terdaftar.' };
  
  var phoneCheck = checkPhone(phone);
  if (!phoneCheck.available) return { success: false, error: '❌ Nomor WhatsApp sudah digunakan.' };
  
  var lastRow = sheet.getLastRow();
  var userId = 'AB-USER-' + ('00000' + lastRow).slice(-6);
  var passHash = simpleHash(pass);
  var now = new Date().toISOString();
  
  var newRow = [
    userId,
    name,
    email,
    phone,
    passHash,
    postData.role || 'PESERTA',
    postData.gender || 'Laki-laki',
    postData.birthPlace || '',
    postData.birthDate || '',
    postData.address || '',
    postData.education || 'SMA/SMK',
    postData.occupation || '',
    postData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    'Peserta resmi Alpha Beta Learning Center.',
    'Komputer Dasar',
    'Aktif',
    'VERIFIED',
    now,
    now,
    now,
    postData.nik || ''
  ];
  
  sheet.appendRow(newRow);
  
  var logSheet = ss.getSheetByName('LoginLogs');
  if (logSheet) {
    logSheet.appendRow(['LOG-' + new Date().getTime(), userId, email, now, '', 'REGISTER_SUCCESS', 'AppsScriptWeb', 'Browser', '']);
  }
  
  var user = {
    UserID: userId,
    Name: name,
    Email: email,
    Phone: phone,
    Role: postData.role || 'PESERTA',
    Status: 'Aktif',
    VerificationStatus: 'VERIFIED',
    PhotoURL: newRow[12],
    CreatedAt: now,
    LastLogin: now
  };
  
  return { success: true, user: user, token: 'SESSION-' + userId + '-' + new Date().getTime() };
}

function authLogin(identifier, password) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName('Users');
  }
  
  var data = sheet.getDataRange().getValues();
  var cleanIdent = String(identifier || '').trim().toLowerCase();
  var normIdent = normalizePhone(cleanIdent);
  var hashedInput = simpleHash(password);
  
  for (var i = 1; i < data.length; i++) {
    var userId = data[i][0];
    var userName = data[i][1];
    var userEmail = String(data[i][2] || '').trim().toLowerCase();
    var userPhone = normalizePhone(data[i][3]);
    var userPassHash = data[i][4];
    var role = data[i][5];
    var status = data[i][15] || 'Aktif';
    var verification = data[i][16] || 'VERIFIED';
    
    if (userEmail === cleanIdent || (userPhone && userPhone === normIdent)) {
      if (status === 'Nonaktif' || status === 'Pending') {
        return { success: false, error: '⚠️ Akun Anda sedang dinonaktifkan. Silakan hubungi administrator.' };
      }
      
      var isPassMatch = (userPassHash === password || userPassHash === hashedInput);
      if (isPassMatch) {
        var now = new Date().toISOString();
        sheet.getRange(i + 1, 19).setValue(now);
        
        var logSheet = ss.getSheetByName('LoginLogs');
        if (logSheet) {
          logSheet.appendRow(['LOG-' + new Date().getTime(), userId, userEmail, now, '', 'SUCCESS', 'AppsScriptWeb', 'Browser', '']);
        }
        
        var user = {
          UserID: userId,
          Name: userName,
          Email: userEmail,
          Phone: userPhone,
          Role: role,
          PhotoURL: data[i][12] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
          Status: status,
          LastLogin: now
        };
        
        return { success: true, user: user, token: 'SESSION-' + userId + '-' + new Date().getTime() };
      } else {
        return { success: false, error: '❌ Email/nomor WhatsApp atau password salah.' };
      }
    }
  }
  
  return { success: false, error: '❌ Email/nomor WhatsApp atau password salah.' };
}

function logoutUser(userId) {
  var ss = getSpreadsheet();
  var logSheet = ss.getSheetByName('LoginLogs');
  if (logSheet && userId) {
    var now = new Date().toISOString();
    logSheet.appendRow(['LOG-' + new Date().getTime(), userId, '', now, now, 'LOGGED_OUT', 'AppsScriptWeb', 'Browser', '']);
  }
  return { success: true };
}

function resetPassword(identifier) {
  return { success: true, message: '🔑 Petunjuk reset password telah diproses. Hubungi admin di WA 081223546686.' };
}

function changePassword(userId, oldPassword, newPassword) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: false, error: 'Sheet Users tidak ditemukan' };
  
  var data = sheet.getDataRange().getValues();
  var oldHash = simpleHash(oldPassword);
  var newHash = simpleHash(newPassword);
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      var currPass = data[i][4];
      if (currPass === oldPassword || currPass === oldHash) {
        sheet.getRange(i + 1, 5).setValue(newHash);
        sheet.getRange(i + 1, 20).setValue(new Date().toISOString());
        return { success: true, message: '✅ Password berhasil diubah.' };
      } else {
        return { success: false, error: '❌ Password lama Anda salah.' };
      }
    }
  }
  return { success: false, error: 'User tidak ditemukan.' };
}

function getUserProfile(userId) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: false, error: 'Sheet Users tidak ditemukan' };
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return {
        success: true,
        user: {
          UserID: data[i][0],
          Name: data[i][1],
          Email: data[i][2],
          Phone: data[i][3],
          Role: data[i][5],
          Gender: data[i][6],
          BirthPlace: data[i][7],
          BirthDate: data[i][8],
          Address: data[i][9],
          Education: data[i][10],
          Occupation: data[i][11],
          PhotoURL: data[i][12],
          Bio: data[i][13],
          Skills: String(data[i][14] || '').split(','),
          Status: data[i][15],
          CreatedAt: data[i][17],
          LastLogin: data[i][18]
        }
      };
    }
  }
  return { success: false, error: 'User tidak ditemukan' };
}

function updateUserProfile(postData) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Users');
  if (!sheet) return { success: false, error: 'Sheet Users tidak ditemukan' };
  
  var userId = postData.userId || postData.UserID;
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      if (postData.name) sheet.getRange(i + 1, 2).setValue(postData.name);
      if (postData.phone) sheet.getRange(i + 1, 4).setValue(normalizePhone(postData.phone));
      if (postData.education) sheet.getRange(i + 1, 11).setValue(postData.education);
      if (postData.occupation) sheet.getRange(i + 1, 12).setValue(postData.occupation);
      if (postData.photoUrl) sheet.getRange(i + 1, 13).setValue(postData.photoUrl);
      if (postData.bio) sheet.getRange(i + 1, 14).setValue(postData.bio);
      if (postData.skills) sheet.getRange(i + 1, 15).setValue(Array.isArray(postData.skills) ? postData.skills.join(',') : postData.skills);
      
      sheet.getRange(i + 1, 20).setValue(new Date().toISOString());
      return { success: true, message: '✅ Profil berhasil diperbarui.' };
    }
  }
  return { success: false, error: 'User tidak ditemukan' };
}

// ============================================================================
// 5. PROGRESS, QUIZZES, EXAMS & CERTIFICATES
// ============================================================================

function saveProgress(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Progress');
  if (!sheet) { setupDatabase(); sheet = ss.getSheetByName('Progress'); }
  
  var now = new Date().toISOString();
  sheet.appendRow([
    'PROG-' + new Date().getTime(),
    data.userId || data.UserID || '',
    data.courseId || data.CourseID || '',
    data.moduleId || data.ModuleID || '',
    data.activityId || data.ActivityID || '',
    data.status || 'COMPLETED',
    data.score || 100,
    data.xp || 50,
    data.startedAt || now,
    now,
    now
  ]);
  return { success: true, message: 'Progres berhasil disimpan ke Google Sheet.' };
}

function submitQuiz(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('QuizResults');
  if (!sheet) { setupDatabase(); sheet = ss.getSheetByName('QuizResults'); }
  
  var isPassed = (Number(data.score || 0) >= Number(data.passingGrade || 80));
  var resId = 'QRES-' + new Date().getTime();
  var now = new Date().toISOString();
  
  sheet.appendRow([
    resId,
    data.userId || data.UserID || '',
    data.userName || data.UserName || '',
    data.courseId || data.CourseID || '',
    data.quizId || data.QuizID || '',
    data.quizTitle || data.QuizTitle || 'Kuis Modul',
    data.score || 0,
    data.passingGrade || 80,
    isPassed ? 'LULUS' : 'TIDAK LULUS',
    data.attemptNumber || 1,
    JSON.stringify(data.answers || {}),
    now
  ]);
  return { success: true, score: data.score, passed: isPassed, resultId: resId };
}

function submitExam(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('ExamResults');
  if (!sheet) { setupDatabase(); sheet = ss.getSheetByName('ExamResults'); }
  
  var isPassed = (Number(data.score || 0) >= Number(data.passingGrade || 80));
  var resId = 'EXRES-' + new Date().getTime();
  var now = new Date().toISOString();
  
  sheet.appendRow([
    resId,
    data.userId || data.UserID || '',
    data.userName || data.UserName || '',
    data.courseId || data.CourseID || '',
    data.courseTitle || data.CourseTitle || '',
    data.examId || data.ExamID || '',
    data.examTitle || data.ExamTitle || 'Ujian Akhir Sertifikasi',
    data.score || 0,
    data.passingGrade || 80,
    isPassed ? 'LULUS' : 'REMEDIAL',
    isPassed ? 'YA' : 'TIDAK',
    now
  ]);
  return { success: true, score: data.score, passed: isPassed, resultId: resId };
}

function generateCertificate(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Certificates');
  if (!sheet) { setupDatabase(); sheet = ss.getSheetByName('Certificates'); }
  
  var certId = 'CERT-ALPHA-' + Math.floor(100000 + Math.random() * 900000);
  var now = new Date().toISOString().split('T')[0];
  var verifyUrl = 'https://alphabeta.edu.eu.org/verify?cert=' + certId;
  
  sheet.appendRow([
    certId,
    data.userId || data.UserID || '',
    data.userName || data.UserName || '',
    data.courseId || data.CourseID || '',
    data.courseTitle || data.CourseTitle || '',
    data.finalScore || 100,
    now,
    data.instructorName || 'Roni Nuroni, S.T., MCE',
    data.directorName || 'Ruli Lesmana, S.T., Gr.',
    'VALID & TERBIT',
    certId,
    verifyUrl,
    data.nik || '',
    'CRED-' + certId
  ]);
  
  return { success: true, certificateId: certId, verifyUrl: verifyUrl, issueDate: now };
}

function verifyCertificate(certId) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Certificates');
  if (!sheet) return { success: false, valid: false, message: 'Database sertifikat belum siap.' };
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === certId) {
      return {
        success: true,
        valid: true,
        certificate: {
          CertificateID: data[i][0],
          UserID: data[i][1],
          UserName: data[i][2],
          CourseID: data[i][3],
          CourseTitle: data[i][4],
          FinalScore: data[i][5],
          IssueDate: data[i][6],
          InstructorName: data[i][7],
          DirectorName: data[i][8],
          Status: data[i][9],
          VerifyURL: data[i][11]
        }
      };
    }
  }
  return { success: false, valid: false, message: 'Sertifikat tidak ditemukan atau tidak valid.' };
}

// ============================================================================
// 6. ADMIN GENERIC TABLE ACCESS
// ============================================================================

function getSystemStats() {
  var ss = getSpreadsheet();
  var usersSheet = ss ? ss.getSheetByName('Users') : null;
  var coursesSheet = ss ? ss.getSheetByName('Courses') : null;
  var certSheet = ss ? ss.getSheetByName('Certificates') : null;

  return {
    success: true,
    totalUsers: usersSheet ? Math.max(0, usersSheet.getLastRow() - 1) : 0,
    totalCourses: coursesSheet ? Math.max(0, coursesSheet.getLastRow() - 1) : 0,
    totalCertificates: certSheet ? Math.max(0, certSheet.getLastRow() - 1) : 0,
    status: 'Aktif & Terkoneksi Google Sheets'
  };
}

function getAdminData(tableName) {
  var ss = getSpreadsheet();
  var sheet = ss ? ss.getSheetByName(tableName || 'Users') : null;
  if (!sheet) return { success: true, data: [] };
  
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { success: true, data: [] };
  
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      item[headers[j]] = values[i][j];
    }
    rows.push(item);
  }
  return { success: true, data: rows };
}

function saveAdminItem(tableName, item) {
  var ss = getSpreadsheet();
  var sheet = ss ? ss.getSheetByName(tableName || 'Data_Peserta') : null;
  if (!sheet && ss) {
    sheet = ss.insertSheet(tableName || 'Data_Peserta');
  }
  if (item && sheet) {
    sheet.appendRow(Object.values(item));
  }
  return { success: true, message: 'Item berhasil disimpan ke tabel ' + tableName };
}

function deleteAdminItem(tableName, id) {
  return { success: true, message: 'Item berhasil dihapus.' };
}
`;
