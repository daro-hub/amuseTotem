// Sistema di traduzioni per l'applicazione
export interface Translations {
  [key: string]: {
    [languageCode: string]: string
  }
}

export const translations: Translations = {
  // Generale
  'app.title': {
    it: 'Museo Interattivo', en: 'Interactive Museum', es: 'Museo Interactivo', fr: 'Musée Interactif', de: 'Interaktives Museum',
    sv: 'Interaktivt Museum', pt: 'Museu Interativo', zh: '互动博物馆', jp: 'インタラクティブ博物館', ko: '인터랙티브 박물관',
    ar: 'متحف تفاعلي', pl: 'Muzeum Interaktywne', ru: 'Интерактивный музей', sl: 'Interaktivni muzej', hu: 'Interaktív múzeum',
    sk: 'Interaktívne múzeum', uk: 'Інтерактивний музей', ro: 'Muzeu Interactiv', da: 'Interaktivt Museum', tr: 'İnteraktif Müze',
    el: 'Διαδραστικό Μουσείο', bn: 'ইন্টারঅ্যাক্টিভ যাদুঘর', nl: 'Interactief Museum', sq: 'Muzeu Interaktiv', id: 'Museum Interaktif',
    th: 'พิพิธภัณฑ์แบบโต้ตอบ', vi: 'Bảo tàng Tương tác', he: 'מוזיאון אינטראקטיבי', fa: 'موزه تعاملی', tl: 'Interactive Museum',
    ms: 'Muzium Interaktif', sw: 'Makumbusho ya Kujumuisha', cs: 'Interaktivní muzeum', fi: 'Interaktiivinen museo',
    no: 'Interaktivt museum', hi: 'इंटरैक्टिव संग्रहालय'
  },
  'app.subtitle': {
    it: 'Biglietti', en: 'Tickets', es: 'Entradas', fr: 'Billets', de: 'Tickets',
    sv: 'Biljetter', pt: 'Bilhetes', zh: '门票', jp: 'チケット', ko: '티켓',
    ar: 'تذاكر', pl: 'Bilety', ru: 'Билеты', sl: 'Vstopnice', hu: 'Jegyek',
    sk: 'Lístky', uk: 'Квитки', ro: 'Bilete', da: 'Billetter', tr: 'Biletler',
    el: 'Εισιτήρια', bn: 'টিকিট', nl: 'Tickets', sq: 'Biletat', id: 'Tiket',
    th: 'ตั๋ว', vi: 'Vé', he: 'כרטיסים', fa: 'بلیط', tl: 'Mga Tiket',
    ms: 'Tiket', sw: 'Tiketi', cs: 'Lístky', fi: 'Liput',
    no: 'Billetter', hi: 'टिकट'
  },
  
  // Selezione lingua
  'language.select': {
    it: 'Seleziona la tua lingua', en: 'Select your language', es: 'Selecciona tu idioma', fr: 'Sélectionnez votre langue', de: 'Wählen Sie Ihre Sprache',
    sv: 'Välj ditt språk', pt: 'Selecione seu idioma', zh: '选择您的语言', jp: '言語を選択', ko: '언어를 선택하세요',
    ar: 'اختر لغتك', pl: 'Wybierz swój język', ru: 'Выберите язык', sl: 'Izberite svoj jezik', hu: 'Válassza ki a nyelvét',
    sk: 'Vyberte si jazyk', uk: 'Виберіть мову', ro: 'Selectați limba', da: 'Vælg dit sprog', tr: 'Dilinizi seçin',
    el: 'Επιλέξτε τη γλώσσα σας', bn: 'আপনার ভাষা নির্বাচন করুন', nl: 'Selecteer uw taal', sq: 'Zgjidhni gjuhën tuaj', id: 'Pilih bahasa Anda',
    th: 'เลือกภาษาของคุณ', vi: 'Chọn ngôn ngữ của bạn', he: 'בחר את השפה שלך', fa: 'زبان خود را انتخاب کنید', tl: 'Piliin ang inyong wika',
    ms: 'Pilih bahasa anda', sw: 'Chagua lugha yako', cs: 'Vyberte si jazyk', fi: 'Valitse kielesi',
    no: 'Velg ditt språk', hi: 'अपनी भाषा चुनें'
  },
  
  // Pulsanti
  'button.continue': {
    it: 'Continua', en: 'Continue', es: 'Continuar', fr: 'Continuer', de: 'Weiter',
    sv: 'Fortsätt', pt: 'Continuar', zh: '继续', jp: '続行', ko: '계속',
    ar: 'متابعة', pl: 'Kontynuuj', ru: 'Продолжить', sl: 'Nadaljuj', hu: 'Folytatás',
    sk: 'Pokračovať', uk: 'Продовжити', ro: 'Continuă', da: 'Fortsæt', tr: 'Devam Et',
    el: 'Συνέχεια', bn: 'চালিয়ে যান', nl: 'Doorgaan', sq: 'Vazhdo', id: 'Lanjutkan',
    th: 'ดำเนินการต่อ', vi: 'Tiếp tục', he: 'המשך', fa: 'ادامه', tl: 'Magpatuloy',
    ms: 'Teruskan', sw: 'Endelea', cs: 'Pokračovat', fi: 'Jatka',
    no: 'Fortsett', hi: 'जारी रखें'
  },
  'button.back': {
    it: 'Indietro', en: 'Back', es: 'Atrás', fr: 'Retour', de: 'Zurück',
    sv: 'Tillbaka', pt: 'Voltar', zh: '返回', jp: '戻る', ko: '뒤로',
    ar: 'رجوع', pl: 'Wstecz', ru: 'Назад', sl: 'Nazaj', hu: 'Vissza',
    sk: 'Späť', uk: 'Назад', ro: 'Înapoi', da: 'Tilbage', tr: 'Geri',
    el: 'Πίσω', bn: 'ফিরে যান', nl: 'Terug', sq: 'Kthehu', id: 'Kembali',
    th: 'กลับ', vi: 'Quay lại', he: 'חזור', fa: 'بازگشت', tl: 'Bumalik',
    ms: 'Kembali', sw: 'Rudi', cs: 'Zpět', fi: 'Takaisin',
    no: 'Tilbake', hi: 'वापस'
  },
  'button.buy': {
    it: 'Acquista', en: 'Buy', es: 'Comprar', fr: 'Acheter', de: 'Kaufen',
    sv: 'Köp', pt: 'Comprar', zh: '购买', jp: '購入', ko: '구매',
    ar: 'شراء', pl: 'Kup', ru: 'Купить', sl: 'Kupi', hu: 'Vásárlás',
    sk: 'Kúpiť', uk: 'Купити', ro: 'Cumpără', da: 'Køb', tr: 'Satın Al',
    el: 'Αγορά', bn: 'ক্রয় করুন', nl: 'Kopen', sq: 'Bli', id: 'Beli',
    th: 'ซื้อ', vi: 'Mua', he: 'קנה', fa: 'خرید', tl: 'Bumili',
    ms: 'Beli', sw: 'Nunua', cs: 'Koupit', fi: 'Osta',
    no: 'Kjøp', hi: 'खरीदें'
  },
  
  // Messaggi di errore
  'error.generic': {
    it: 'Si è verificato un errore', en: 'An error occurred', es: 'Se produjo un error', fr: 'Une erreur s\'est produite', de: 'Ein Fehler ist aufgetreten',
    sv: 'Ett fel uppstod', pt: 'Ocorreu um erro', zh: '发生错误', jp: 'エラーが発生しました', ko: '오류가 발생했습니다',
    ar: 'حدث خطأ', pl: 'Wystąpił błąd', ru: 'Произошла ошибка', sl: 'Prišlo je do napake', hu: 'Hiba történt',
    sk: 'Vyskytla sa chyba', uk: 'Сталася помилка', ro: 'A apărut o eroare', da: 'Der opstod en fejl', tr: 'Bir hata oluştu',
    el: 'Παρουσιάστηκε σφάλμα', bn: 'একটি ত্রুটি ঘটেছে', nl: 'Er is een fout opgetreden', sq: 'Ndodhi një gabim', id: 'Terjadi kesalahan',
    th: 'เกิดข้อผิดพลาด', vi: 'Đã xảy ra lỗi', he: 'אירעה שגיאה', fa: 'خطایی رخ داد', tl: 'May naganap na error',
    ms: 'Ralat berlaku', sw: 'Hitilafu ilitokea', cs: 'Došlo k chybě', fi: 'Tapahtui virhe',
    no: 'En feil oppstod', hi: 'एक त्रुटि हुई'
  },
  
  // Loading
  'loading': {
    it: 'Caricamento...', en: 'Loading...', es: 'Cargando...', fr: 'Chargement...', de: 'Laden...',
    sv: 'Laddar...', pt: 'Carregando...', zh: '加载中...', jp: '読み込み中...', ko: '로딩 중...',
    ar: 'جاري التحميل...', pl: 'Ładowanie...', ru: 'Загрузка...', sl: 'Nalaganje...', hu: 'Betöltés...',
    sk: 'Načítanie...', uk: 'Завантаження...', ro: 'Se încarcă...', da: 'Indlæser...', tr: 'Yükleniyor...',
    el: 'Φόρτωση...', bn: 'লোড হচ্ছে...', nl: 'Laden...', sq: 'Duke u ngarkuar...', id: 'Memuat...',
    th: 'กำลังโหลด...', vi: 'Đang tải...', he: 'טוען...', fa: 'در حال بارگذاری...', tl: 'Naglo-load...',
    ms: 'Memuatkan...', sw: 'Inapakia...', cs: 'Načítání...', fi: 'Ladataan...',
    no: 'Laster...', hi: 'लोड हो रहा है...'
  },
  
  // Quantity Selector
  'quantityDescription': {
    it: 'Quanti biglietti vuoi acquistare?', en: 'How many tickets do you want to buy?', es: '¿Cuántas entradas quieres comprar?', fr: 'Combien de billets voulez-vous acheter?', de: 'Wie viele Tickets möchten Sie kaufen?',
    sv: 'Hur många biljetter vill du köpa?', pt: 'Quantos bilhetes você quer comprar?', zh: '您想购买多少张票？', jp: '何枚のチケットを購入しますか？', ko: '몇 장의 티켓을 구매하시겠습니까?',
    ar: 'كم تذكرة تريد شراءها؟', pl: 'Ile biletów chcesz kupić?', ru: 'Сколько билетов вы хотите купить?', sl: 'Koliko vstopnic želite kupiti?', hu: 'Hány jegyet szeretne vásárolni?',
    sk: 'Koľko lístkov chcete kúpiť?', uk: 'Скільки квитків ви хочете придбати?', ro: 'Câte bilete vreți să cumpărați?', da: 'Hvor mange billetter vil du købe?', tr: 'Kaç bilet satın almak istiyorsunuz?',
    el: 'Πόσα εισιτήρια θέλετε να αγοράσετε;', bn: 'আপনি কতটি টিকিট কিনতে চান?', nl: 'Hoeveel tickets wilt u kopen?', sq: 'Sa bileta doni të blini?', id: 'Berapa tiket yang ingin Anda beli?',
    th: 'คุณต้องการซื้อตั๋วกี่ใบ?', vi: 'Bạn muốn mua bao nhiêu vé?', he: 'כמה כרטיסים אתה רוצה לקנות?', fa: 'چند بلیط می‌خواهید بخرید؟', tl: 'Ilang tiket ang gusto mong bilhin?',
    ms: 'Berapa tiket yang anda mahu beli?', sw: 'Unataka tiketi ngapi?', cs: 'Kolik lístků chcete koupit?', fi: 'Kuinka monta lippua haluat ostaa?',
    no: 'Hvor mange billetter vil du kjøpe?', hi: 'आप कितने टिकट खरीदना चाहते हैं?'
  },
  'selectQuantity': {
    it: 'Seleziona quantità', en: 'Select quantity', es: 'Selecciona cantidad', fr: 'Sélectionnez la quantité', de: 'Menge auswählen',
    sv: 'Välj kvantitet', pt: 'Selecione quantidade', zh: '选择数量', jp: '数量を選択', ko: '수량 선택',
    ar: 'اختر الكمية', pl: 'Wybierz ilość', ru: 'Выберите количество', sl: 'Izberite količino', hu: 'Válassza ki a mennyiséget',
    sk: 'Vyberte množstvo', uk: 'Виберіть кількість', ro: 'Selectați cantitatea', da: 'Vælg antal', tr: 'Miktarı seçin',
    el: 'Επιλέξτε ποσότητα', bn: 'পরিমাণ নির্বাচন করুন', nl: 'Selecteer hoeveelheid', sq: 'Zgjidhni sasinë', id: 'Pilih jumlah',
    th: 'เลือกจำนวน', vi: 'Chọn số lượng', he: 'בחר כמות', fa: 'مقدار را انتخاب کنید', tl: 'Piliin ang dami',
    ms: 'Pilih kuantiti', sw: 'Chagua kiasi', cs: 'Vyberte množství', fi: 'Valitse määrä',
    no: 'Velg antall', hi: 'मात्रा चुनें'
  },
  'proceed': {
    it: 'Procedi', en: 'Proceed', es: 'Proceder', fr: 'Procéder', de: 'Fortfahren',
    sv: 'Fortsätt', pt: 'Prosseguir', zh: '继续', jp: '続行', ko: '진행',
    ar: 'متابعة', pl: 'Kontynuuj', ru: 'Продолжить', sl: 'Nadaljuj', hu: 'Folytatás',
    sk: 'Pokračovať', uk: 'Продовжити', ro: 'Continuă', da: 'Fortsæt', tr: 'Devam Et',
    el: 'Συνέχεια', bn: 'এগিয়ে যান', nl: 'Doorgaan', sq: 'Vazhdo', id: 'Lanjutkan',
    th: 'ดำเนินการต่อ', vi: 'Tiếp tục', he: 'המשך', fa: 'ادامه', tl: 'Magpatuloy',
    ms: 'Teruskan', sw: 'Endelea', cs: 'Pokračovat', fi: 'Jatka',
    no: 'Fortsett', hi: 'आगे बढ़ें'
  },
  'back': {
    it: 'Indietro', en: 'Back', es: 'Atrás', fr: 'Retour', de: 'Zurück',
    sv: 'Tillbaka', pt: 'Voltar', zh: '返回', jp: '戻る', ko: '뒤로',
    ar: 'رجوع', pl: 'Wstecz', ru: 'Назад', sl: 'Nazaj', hu: 'Vissza',
    sk: 'Späť', uk: 'Назад', ro: 'Înapoi', da: 'Tilbage', tr: 'Geri',
    el: 'Πίσω', bn: 'ফিরে যান', nl: 'Terug', sq: 'Kthehu', id: 'Kembali',
    th: 'กลับ', vi: 'Quay lại', he: 'חזור', fa: 'بازگشت', tl: 'Bumalik',
    ms: 'Kembali', sw: 'Rudi', cs: 'Zpět', fi: 'Takaisin',
    no: 'Tilbake', hi: 'वापस'
  },
  
  // Payment Confirm
  'paymentConfirm.title': {
    it: 'Conferma Pagamento', en: 'Payment Confirmation', es: 'Confirmación de Pago', fr: 'Confirmation de Paiement', de: 'Zahlungsbestätigung',
    sv: 'Betalningsbekräftelse', pt: 'Confirmação de Pagamento', zh: '支付确认', jp: '支払い確認', ko: '결제 확인',
    ar: 'تأكيد الدفع', pl: 'Potwierdzenie Płatności', ru: 'Подтверждение Оплаты', sl: 'Potrditev Plačila', hu: 'Fizetés Megerősítése',
    sk: 'Potvrdenie Platby', uk: 'Підтвердження Оплати', ro: 'Confirmare Plată', da: 'Betalingsbekræftelse', tr: 'Ödeme Onayı',
    el: 'Επιβεβαίωση Πληρωμής', bn: 'পেমেন্ট নিশ্চিতকরণ', nl: 'Betalingsbevestiging', sq: 'Konfirmimi i Pagesës', id: 'Konfirmasi Pembayaran',
    th: 'ยืนยันการชำระเงิน', vi: 'Xác Nhận Thanh Toán', he: 'אישור תשלום', fa: 'تأیید پرداخت', tl: 'Kumpirmasyon ng Bayad',
    ms: 'Pengesahan Pembayaran', sw: 'Uthibitisho wa Malipo', cs: 'Potvrzení Platby', fi: 'Maksun Vahvistus',
    no: 'Betalingsbekreftelse', hi: 'भुगतान पुष्टि'
  },
  'paymentConfirm.description': {
    it: 'Verifica i dettagli del tuo ordine prima di procedere con il pagamento', en: 'Review your order details before proceeding with payment', es: 'Revisa los detalles de tu pedido antes de proceder con el pago', fr: 'Vérifiez les détails de votre commande avant de procéder au paiement', de: 'Überprüfen Sie Ihre Bestelldetails vor der Zahlung',
    sv: 'Granska din orderdetaljer innan du fortsätter med betalningen', pt: 'Revise os detalhes do seu pedido antes de prosseguir com o pagamento', zh: '在继续付款之前查看您的订单详情', jp: '支払いを続行する前に注文の詳細を確認してください', ko: '결제를 진행하기 전에 주문 세부사항을 검토하세요',
    ar: 'راجع تفاصيل طلبك قبل المتابعة مع الدفع', pl: 'Przejrzyj szczegóły zamówienia przed przejściem do płatności', ru: 'Проверьте детали заказа перед оплатой', sl: 'Preglejte podrobnosti naročila pred nadaljevanjem s plačilom', hu: 'Ellenőrizze a rendelés részleteit a fizetés előtt',
    sk: 'Pred pokračovaním v platbe si prečítajte podrobnosti objednávky', uk: 'Перевірте деталі замовлення перед оплатою', ro: 'Verificați detaliile comenzii înainte de plată', da: 'Gennemgå dine ordredetaljer før du fortsætter med betalingen', tr: 'Ödemeye devam etmeden önce sipariş detaylarınızı gözden geçirin',
    el: 'Ελέγξτε τις λεπτομέρειες της παραγγελίας σας πριν προχωρήσετε με την πληρωμή', bn: 'পেমেন্টের সাথে এগিয়ে যাওয়ার আগে আপনার অর্ডারের বিবরণ পর্যালোচনা করুন', nl: 'Bekijk uw bestelgegevens voordat u doorgaat met betalen', sq: 'Rishikoni detajet e porosisë suaj para se të vazhdoni me pagesën', id: 'Tinjau detail pesanan Anda sebelum melanjutkan pembayaran',
    th: 'ตรวจสอบรายละเอียดคำสั่งซื้อของคุณก่อนดำเนินการชำระเงิน', vi: 'Xem lại chi tiết đơn hàng của bạn trước khi thanh toán', he: 'סקור את פרטי ההזמנה שלך לפני המשך התשלום', fa: 'جزئیات سفارش خود را قبل از ادامه پرداخت بررسی کنید', tl: 'Suriin ang mga detalye ng inyong order bago magpatuloy sa pagbabayad',
    ms: 'Semak butiran pesanan anda sebelum meneruskan pembayaran', sw: 'Kagua maelezo ya agizo lako kabla ya kuendelea na malipo', cs: 'Před pokračováním v platbě si prohlédněte podrobnosti objednávky', fi: 'Tarkista tilauksen tiedot ennen maksun jatkamista',
    no: 'Gå gjennom bestillingsdetaljene dine før du fortsetter med betalingen', hi: 'भुगतान के साथ आगे बढ़ने से पहले अपने ऑर्डर का विवरण देखें'
  },
  'paymentConfirm.quantity': {
    it: 'Quantità:', en: 'Quantity:', es: 'Cantidad:', fr: 'Quantité:', de: 'Menge:',
    sv: 'Kvantitet:', pt: 'Quantidade:', zh: '数量:', jp: '数量:', ko: '수량:',
    ar: 'الكمية:', pl: 'Ilość:', ru: 'Количество:', sl: 'Količina:', hu: 'Mennyiség:',
    sk: 'Množstvo:', uk: 'Кількість:', ro: 'Cantitate:', da: 'Antal:', tr: 'Miktar:',
    el: 'Ποσότητα:', bn: 'পরিমাণ:', nl: 'Hoeveelheid:', sq: 'Sasia:', id: 'Jumlah:',
    th: 'จำนวน:', vi: 'Số lượng:', he: 'כמות:', fa: 'مقدار:', tl: 'Dami:',
    ms: 'Kuantiti:', sw: 'Kiasi:', cs: 'Množství:', fi: 'Määrä:',
    no: 'Antall:', hi: 'मात्रा:'
  },
  'paymentConfirm.total': {
    it: 'Totale:', en: 'Total:', es: 'Total:', fr: 'Total:', de: 'Gesamt:',
    sv: 'Totalt:', pt: 'Total:', zh: '总计:', jp: '合計:', ko: '총계:',
    ar: 'المجموع:', pl: 'Razem:', ru: 'Итого:', sl: 'Skupaj:', hu: 'Összesen:',
    sk: 'Celkom:', uk: 'Всього:', ro: 'Total:', da: 'I alt:', tr: 'Toplam:',
    el: 'Σύνολο:', bn: 'মোট:', nl: 'Totaal:', sq: 'Gjithsej:', id: 'Total:',
    th: 'รวม:', vi: 'Tổng cộng:', he: 'סה"כ:', fa: 'مجموع:', tl: 'Kabuuan:',
    ms: 'Jumlah:', sw: 'Jumla:', cs: 'Celkem:', fi: 'Yhteensä:',
    no: 'Totalt:', hi: 'कुल:'
  },
  'paymentConfirm.pay': {
    it: 'Paga Ora', en: 'Pay Now', es: 'Pagar Ahora', fr: 'Payer Maintenant', de: 'Jetzt Bezahlen',
    sv: 'Betala Nu', pt: 'Pagar Agora', zh: '立即支付', jp: '今すぐ支払う', ko: '지금 결제',
    ar: 'ادفع الآن', pl: 'Zapłać Teraz', ru: 'Оплатить Сейчас', sl: 'Plajaj Zdaj', hu: 'Fizess Most',
    sk: 'Zaplať Teraz', uk: 'Сплатити Зараз', ro: 'Plătește Acum', da: 'Betal Nu', tr: 'Şimdi Öde',
    el: 'Πλήρωσε Τώρα', bn: 'এখনই পেমেন্ট করুন', nl: 'Nu Betalen', sq: 'Paguaj Tani', id: 'Bayar Sekarang',
    th: 'ชำระเงินตอนนี้', vi: 'Thanh Toán Ngay', he: 'שלם עכשיו', fa: 'الان پرداخت করুন', tl: 'Magbayad Ngayon',
    ms: 'Bayar Sekarang', sw: 'Lipa Sasa', cs: 'Zaplatit Nyní', fi: 'Maksa Nyt',
    no: 'Betal Nå', hi: 'अभी भुगतान करें'
  },
  
  // Payment Process
  'paymentProcess.title': {
    it: 'Avvicina la carta al lettore', en: 'Bring your card to the reader', es: 'Acerca tu tarjeta al lector', fr: 'Approchez votre carte du lecteur', de: 'Halten Sie Ihre Karte an den Leser',
    sv: 'För kortet till läsaren', pt: 'Aproxime seu cartão do leitor', zh: '将卡片靠近读卡器', jp: 'カードをリーダーに近づけてください', ko: '카드를 리더기에 가져가세요',
    ar: 'اقترب بالبطاقة من القارئ', pl: 'Zbliż kartę do czytnika', ru: 'Поднесите карту к считывателю', sl: 'Približajte kartico k bralniku', hu: 'Közelítse a kártyát az olvasóhoz',
    sk: 'Priblížte kartu k čítačke', uk: 'Піднесіть картку до зчитувача', ro: 'Apropiați cardul de cititor', da: 'Bring kortet til læseren', tr: 'Kartınızı okuyucuya yaklaştırın',
    el: 'Φέρτε την κάρτα σας στον αναγνώστη', bn: 'কার্ডটি রিডারে আনুন', nl: 'Breng uw kaart naar de lezer', sq: 'Afroni kartën te lexuesi', id: 'Dekatkan kartu ke pembaca',
    th: 'นำบัตรมาที่เครื่องอ่าน', vi: 'Đưa thẻ đến đầu đọc', he: 'הביאו את הכרטיס לקורא', fa: 'کارت را به خواننده نزدیک کنید', tl: 'Ilapit ang inyong card sa reader',
    ms: 'Bawa kad ke pembaca', sw: 'Lete kadi kwa msomaji', cs: 'Přiložte kartu k čtečce', fi: 'Tuo kortti lukijaan',
    no: 'Før kortet til leseren', hi: 'कार्ड को रीडर के पास लाएं'
  },
  'paymentProcess.instructions': {
    it: 'e segui le istruzioni sul pin pad', en: 'and follow the instructions on the pin pad', es: 'y sigue las instrucciones en el pin pad', fr: 'et suivez les instructions sur le pin pad', de: 'und folgen Sie den Anweisungen auf dem Pin-Pad',
    sv: 'och följ instruktionerna på pin-padden', pt: 'e siga as instruções no pin pad', zh: '并按照密码键盘上的说明操作', jp: 'ピンパッドの指示に従ってください', ko: '핀패드의 지시사항을 따르세요',
    ar: 'واتبع التعليمات على لوحة المفاتيح', pl: 'i postępuj zgodnie z instrukcjami na pin pad', ru: 'и следуйте инструкциям на пин-паде', sl: 'in sledite navodilom na pin pad', hu: 'és kövesse a pin pad utasításait',
    sk: 'a postupujte podľa pokynov na pin pade', uk: 'і дотримуйтесь інструкцій на пін-паді', ro: 'și urmați instrucțiunile de pe pin pad', da: 'og følg instruktionerne på pin-pad', tr: 've pin paddeki talimatları takip edin',
    el: 'και ακολουθήστε τις οδηγίες στο pin pad', bn: 'এবং পিন প্যাডের নির্দেশাবলী অনুসরণ করুন', nl: 'en volg de instructies op de pin pad', sq: 'dhe ndiqni udhëzimet në pin pad', id: 'dan ikuti instruksi di pin pad',
    th: 'และทำตามคำแนะนำบน pin pad', vi: 'và làm theo hướng dẫn trên pin pad', he: 'ועקבו אחר ההוראות על ה-pin pad', fa: 'و دستورالعمل های روی pin pad را دنبال کنید', tl: 'at sundin ang mga tagubilin sa pin pad',
    ms: 'dan ikut arahan pada pin pad', sw: 'na ufuate maagizo kwenye pin pad', cs: 'a postupujte podle pokynů na pin pad', fi: 'ja seuraa ohjeita pin-padissa',
    no: 'og følg instruksjonene på pin-pad', hi: 'और पिन पैड पर निर्देशों का पालन करें'
  },
  'paymentProcess.success': {
    it: 'Pagamento Completato!', en: 'Payment Completed!', es: '¡Pago Completado!', fr: 'Paiement Terminé!', de: 'Zahlung Abgeschlossen!',
    sv: 'Betalning Slutförd!', pt: 'Pagamento Concluído!', zh: '付款完成！', jp: '支払い完了！', ko: '결제 완료!',
    ar: 'تم إكمال الدفع!', pl: 'Płatność Zakończona!', ru: 'Платеж Завершен!', sl: 'Plačilo Zaključeno!', hu: 'Fizetés Befejezve!',
    sk: 'Platba Dokončená!', uk: 'Платіж Завершено!', ro: 'Plata Finalizată!', da: 'Betaling Fuldført!', tr: 'Ödeme Tamamlandı!',
    el: 'Η Πληρωμή Ολοκληρώθηκε!', bn: 'পেমেন্ট সম্পূর্ণ!', nl: 'Betaling Voltooid!', sq: 'Pagesa e Përfunduar!', id: 'Pembayaran Selesai!',
    th: 'การชำระเงินเสร็จสิ้น!', vi: 'Thanh Toán Hoàn Tất!', he: 'התשלום הושלם!', fa: 'پرداخت تکمیل شد!', tl: 'Tapos na ang Bayad!',
    ms: 'Pembayaran Selesai!', sw: 'Malipo Yamekamilika!', cs: 'Platba Dokončena!', fi: 'Maksu Valmis!',
    no: 'Betaling Fullført!', hi: 'भुगतान पूरा!'
  },
  
  // Thank You
  'thankYou.title': {
    it: 'Grazie per il tuo acquisto!', en: 'Thank you for your purchase!', es: '¡Gracias por tu compra!', fr: 'Merci pour votre achat!', de: 'Vielen Dank für Ihren Kauf!',
    sv: 'Tack för ditt köp!', pt: 'Obrigado pela sua compra!', zh: '感谢您的购买！', jp: 'ご購入ありがとうございます！', ko: '구매해 주셔서 감사합니다!',
    ar: 'شكراً لك على مشترياتك!', pl: 'Dziękujemy za zakup!', ru: 'Спасибо за покупку!', sl: 'Hvala za nakup!', hu: 'Köszönjük a vásárlást!',
    sk: 'Ďakujeme za nákup!', uk: 'Дякуємо за покупку!', ro: 'Mulțumim pentru cumpărare!', da: 'Tak for dit køb!', tr: 'Satın aldığınız için teşekkürler!',
    el: 'Ευχαριστούμε για την αγορά σας!', bn: 'আপনার কেনাকাটার জন্য ধন্যবাদ!', nl: 'Bedankt voor uw aankoop!', sq: 'Faleminderit për blerjen tuaj!', id: 'Terima kasih atas pembelian Anda!',
    th: 'ขอบคุณสำหรับการซื้อของคุณ!', vi: 'Cảm ơn bạn đã mua hàng!', he: 'תודה על הרכישה שלך!', fa: 'از خرید شما متشکریم!', tl: 'Salamat sa inyong pagbili!',
    ms: 'Terima kasih atas pembelian anda!', sw: 'Asante kwa ununuzi wako!', cs: 'Děkujeme za váš nákup!', fi: 'Kiitos ostoksestasi!',
    no: 'Takk for ditt kjøp!', hi: 'आपकी खरीदारी के लिए धन्यवाद!'
  },
  'thankYou.subtitle': {
    it: 'Inquadra i QR codes e goditi la visita!', en: 'Scan the QR codes and enjoy your visit!', es: '¡Escanea los códigos QR y disfruta tu visita!', fr: 'Scannez les codes QR et profitez de votre visite!', de: 'Scannen Sie die QR-Codes und genießen Sie Ihren Besuch!',
    sv: 'Skanna QR-koderna och njut av ditt besök!', pt: 'Escaneie os códigos QR e aproveite sua visita!', zh: '扫描二维码，享受您的访问！', jp: 'QRコードをスキャンして訪問をお楽しみください！', ko: 'QR 코드를 스캔하고 방문을 즐기세요!',
    ar: 'امسح رموز QR واستمتع بزيارتك!', pl: 'Zeskanuj kody QR i ciesz się wizytą!', ru: 'Сканируйте QR-коды и наслаждайтесь посещением!', sl: 'Skenirajte QR kode in uživajte v obisku!', hu: 'Szkenneld be a QR kódokat és élvezd a látogatást!',
    sk: 'Naskenujte QR kódy a užívajte si návštevu!', uk: 'Скануйте QR-коди та насолоджуйтесь відвідуванням!', ro: 'Scanează codurile QR și bucură-te de vizită!', da: 'Scan QR-koderne og nyd dit besøg!', tr: 'QR kodları tarayın ve ziyaretinizin tadını çıkarın!',
    el: 'Σαρώστε τους QR κωδικούς και απολαύστε την επίσκεψή σας!', bn: 'QR কোড স্ক্যান করুন এবং আপনার ভিজিট উপভোগ করুন!', nl: 'Scan de QR-codes en geniet van uw bezoek!', sq: 'Skanoni kodet QR dhe shijoni vizitën tuaj!', id: 'Pindai kode QR dan nikmati kunjungan Anda!',
    th: 'สแกน QR codes และเพลิดเพลินกับการเยี่ยมชม!', vi: 'Quét mã QR và tận hưởng chuyến tham quan!', he: 'סרוק את קודי ה-QR ותהנה מהביקור!', fa: 'کدهای QR را اسکن کنید و از بازدید لذت ببرید!', tl: 'I-scan ang mga QR code at mag-enjoy sa inyong pagbisita!',
    ms: 'Imbas kod QR dan nikmati lawatan anda!', sw: 'Skani nambari za QR na ufurahiye ziara yako!', cs: 'Naskenujte QR kódy a užijte si návštěvu!', fi: 'Skannaa QR-koodit ja nauti vierailustasi!',
    no: 'Skann QR-kodene og nyt besøket!', hi: 'QR कोड स्कैन करें और अपनी यात्रा का आनंद लें!'
  },
  'thankYou.email': {
    it: 'Se desideri ricevere la ricevuta e i QR codes anche via email inseriscila qui', en: 'If you want to receive the receipt and QR codes by email, enter it here', es: 'Si deseas recibir el recibo y los códigos QR por email, ingrésalo aquí', fr: 'Si vous souhaitez recevoir le reçu et les codes QR par email, entrez-le ici', de: 'Wenn Sie die Quittung und QR-Codes per E-Mail erhalten möchten, geben Sie sie hier ein',
    sv: 'Om du vill ta emot kvittot och QR-koderna via e-post, ange det här', pt: 'Se quiser receber o recibo e os códigos QR por email, digite aqui', zh: '如果您想通过电子邮件接收收据和二维码，请在此输入', jp: 'レシートとQRコードをメールで受け取りたい場合は、ここに入力してください', ko: '영수증과 QR 코드를 이메일로 받고 싶다면 여기에 입력하세요',
    ar: 'إذا كنت تريد استلام الإيصال ورموز QR عبر البريد الإلكتروني، أدخلها هنا', pl: 'Jeśli chcesz otrzymać paragon i kody QR e-mailem, wprowadź go tutaj', ru: 'Если вы хотите получить чек и QR-коды по электронной почте, введите её здесь', sl: 'Če želite prejeti račun in QR kode po e-pošti, jih vnesite tukaj', hu: 'Ha szeretné e-mailben megkapni a nyugtát és a QR kódokat, írja be ide',
    sk: 'Ak chcete dostať účtenku a QR kódy e-mailom, zadajte to tu', uk: 'Якщо ви хочете отримати чек і QR-коди електронною поштою, введіть її тут', ro: 'Dacă doriți să primiți chitanța și codurile QR prin email, introduceți-o aici', da: 'Hvis du vil modtage kvitteringen og QR-koderne via e-mail, indtast det her', tr: 'Makbuzu ve QR kodları e-posta ile almak istiyorsanız, buraya girin',
    el: 'Αν θέλετε να λάβετε την απόδειξη και τους QR κωδικούς μέσω email, εισάγετέ το εδώ', bn: 'আপনি যদি রসিদ এবং QR কোড ইমেইলে পেতে চান, এখানে লিখুন', nl: 'Als u de bon en QR-codes per e-mail wilt ontvangen, voer het hier in', sq: 'Nëse doni të merrni faturën dhe kodet QR me email, shkruajeni këtu', id: 'Jika Anda ingin menerima kwitansi dan kode QR melalui email, masukkan di sini',
    th: 'หากคุณต้องการรับใบเสร็จและ QR codes ทางอีเมล กรอกที่นี่', vi: 'Nếu bạn muốn nhận hóa đơn và mã QR qua email, hãy nhập ở đây', he: 'אם אתה רוצה לקבל את הקבלה וקודי ה-QR באימייל, הכנס כאן', fa: 'اگر می‌خواهید رسید و کدهای QR را از طریق ایمیل دریافت کنید، اینجا وارد کنید', tl: 'Kung gusto mong makatanggap ng resibo at QR codes sa email, ilagay dito',
    ms: 'Jika anda mahu menerima resit dan kod QR melalui email, masukkan di sini', sw: 'Iki unataka kupokea risiti na nambari za QR kupitia barua pepe, ingiza hapa', cs: 'Pokud chcete dostat účtenku a QR kódy e-mailem, zadejte to zde', fi: 'Jos haluat vastaanottaa kuitin ja QR-koodit sähköpostitse, syötä se tähän',
    no: 'Hvis du vil motta kvitteringen og QR-kodene via e-post, skriv inn her', hi: 'यदि आप रसीद और QR कोड ईमेल से प्राप्त करना चाहते हैं, तो यहाँ दर्ज करें'
  },
  'thankYou.send': {
    it: 'Invia', en: 'Send', es: 'Enviar', fr: 'Envoyer', de: 'Senden',
    sv: 'Skicka', pt: 'Enviar', zh: '发送', jp: '送信', ko: '보내기',
    ar: 'إرسال', pl: 'Wyślij', ru: 'Отправить', sl: 'Pošlji', hu: 'Küldés',
    sk: 'Odoslať', uk: 'Надіслати', ro: 'Trimite', da: 'Send', tr: 'Gönder',
    el: 'Αποστολή', bn: 'পাঠান', nl: 'Verzenden', sq: 'Dërgo', id: 'Kirim',
    th: 'ส่ง', vi: 'Gửi', he: 'שלח', fa: 'ارسال', tl: 'Ipadala',
    ms: 'Hantar', sw: 'Tuma', cs: 'Odeslat', fi: 'Lähetä',
    no: 'Send', hi: 'भेजें'
  },
  'thankYou.timer': {
    it: 'Tempo rimanente:', en: 'Time remaining:', es: 'Tiempo restante:', fr: 'Temps restant:', de: 'Verbleibende Zeit:',
    sv: 'Återstående tid:', pt: 'Tempo restante:', zh: '剩余时间:', jp: '残り時間:', ko: '남은 시간:',
    ar: 'الوقت المتبقي:', pl: 'Pozostały czas:', ru: 'Оставшееся время:', sl: 'Preostali čas:', hu: 'Hátralévő idő:',
    sk: 'Zostávajúci čas:', uk: 'Час, що залишився:', ro: 'Timp rămas:', da: 'Resterende tid:', tr: 'Kalan süre:',
    el: 'Υπολειπόμενος χρόνος:', bn: 'অবশিষ্ট সময়:', nl: 'Resterende tijd:', sq: 'Koha e mbetur:', id: 'Waktu tersisa:',
    th: 'เวลาที่เหลือ:', vi: 'Thời gian còn lại:', he: 'זמן נותר:', fa: 'زمان باقی مانده:', tl: 'Natitirang oras:',
    ms: 'Masa yang tinggal:', sw: 'Muda uliobaki:', cs: 'Zbývající čas:', fi: 'Jäljellä oleva aika:',
    no: 'Gjenværende tid:', hi: 'शेष समय:'
  },
  'thankYou.newPurchase': {
    it: 'Nuovo Acquisto', en: 'New Purchase', es: 'Nueva Compra', fr: 'Nouvel Achat', de: 'Neuer Kauf',
    sv: 'Ny Köp', pt: 'Nova Compra', zh: '新购买', jp: '新しい購入', ko: '새 구매',
    ar: 'شراء جديد', pl: 'Nowy Zakup', ru: 'Новая Покупка', sl: 'Nov Nakup', hu: 'Új Vásárlás',
    sk: 'Nový Nákup', uk: 'Нова Покупка', ro: 'Cumpărare Nouă', da: 'Nyt Køb', tr: 'Yeni Satın Alma',
    el: 'Νέα Αγορά', bn: 'নতুন কেনাকাটা', nl: 'Nieuwe Aankoop', sq: 'Blerje e Re', id: 'Pembelian Baru',
    th: 'การซื้อใหม่', vi: 'Mua Mới', he: 'רכישה חדשה', fa: 'خرید جدید', tl: 'Bagong Pagbili',
    ms: 'Pembelian Baru', sw: 'Ununuzi Mpya', cs: 'Nový Nákup', fi: 'Uusi Osto',
    no: 'Nytt Kjøp', hi: 'नई खरीदारी'
  }
}

export const t = (key: string, language: string = 'it'): string => {
  return translations[key]?.[language] || translations[key]?.['it'] || key
}
