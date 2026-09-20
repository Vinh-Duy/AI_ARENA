import extra from "./i18n-extra.json";
export type Language = "vi" | "en";

const translations: Record<string, string> = {
  ...extra,
  "Bản phối cập nhật ngay theo lựa chọn. Dùng Gemini để nhận tư vấn, hoặc lưu ngay bản phối vào lookbook.":
    "Your look updates as you choose. Ask Gemini for styling advice, or save your look directly to your lookbook.",
  "Xem bản phối ↑": "View your look ↑",
  "Bản phối cập nhật ngay theo lựa chọn.": "Your look updates as you choose.",
  "theo cách của bạn.": "your way.",
  "Việt phục": "Vietnamese traditional dress",
  "Gemini đang bận. Bạn có thể thử lại sau hoặc dùng gợi ý cơ bản.":
    "Gemini is busy. Please try again later or use the basic suggestions.",
  "Gemini đã chạm giới hạn lượt gọi hoặc quota. Đợi một chút rồi thử lại; nếu còn lỗi, kiểm tra quota của Google project.":
    "Gemini's request limit or quota has been reached. Wait and try again; if it continues, check the Google project's quota.",
  "Chưa nhận được bản phối hợp lệ từ Gemini. Vui lòng thử lại sau.":
    "Gemini did not return a valid outfit. Please try again later.",
  "Gemini phản hồi quá lâu. Thử lại với yêu cầu ngắn hơn hoặc không kèm ảnh.":
    "Gemini took too long. Try a shorter request or omit the image.",
  "Google không chấp nhận API key. Hãy tạo key Gemini mới trong Google AI Studio, cập nhật phía server rồi khởi động lại hoặc redeploy.":
    "Google rejected the API key. Create a new Gemini key in Google AI Studio, update it on the server, then restart or redeploy.",
  "Google từ chối quyền truy cập. Kiểm tra quyền Gemini API và cấu hình Google project của key.":
    "Google denied access. Check the key's Gemini API permissions and Google project settings.",
  "Model Gemini đang cấu hình không khả dụng. Người triển khai cần đổi GEMINI_MODEL sang model hỗ trợ generateContent rồi khởi động lại hoặc redeploy.":
    "The configured Gemini model is unavailable. Set GEMINI_MODEL to an available generateContent model, then restart or redeploy.",
  Phông: "Backdrop",
  Sau: "Back",
  "Nón lá": "Conical hat",
  "Bối cảnh minh họa 3D cách điệu.": "A stylized 3D illustration.",
  "Phông minh họa AI dạng 2D, phong cách 3D; ma-nơ-canh xoay độc lập.":
    "An AI-illustrated 2D backdrop with a 3D look; the mannequin rotates independently.",
  "Giản dị như một buổi chiều miền Tây.":
    "As relaxed as an afternoon in the Mekong Delta.",
  "Khuê Văn Các với gạch đỏ và cây xanh. Gợi ý biên tập: màu kem, xanh trầm; chú ý bối cảnh di tích.":
    "Khue Van Cac with red brick and green trees. Editorial suggestion: cream or deep green; respect the heritage setting.",
  "Trang chủ": "Home",
  "Điều hướng chính": "Main navigation",
  "Điều hướng di động": "Mobile navigation",
  "Khám phá": "Explore",
  "Phòng phối đồ": "Mix studio",
  "Lookbook của bạn": "Your lookbook",
  "Thử chất riêng": "Try your style",
  "Đóng menu": "Close menu",
  "Mở menu": "Open menu",
  English: "English",
  "Tiếng Việt": "Vietnamese",
  "Về dự án": "About",
  "Quyền riêng tư": "Privacy",
  "Nguồn tư liệu": "Credits",
  "Tự hào bản sắc. Tự do thể hiện.": "Proud of our roots. Free to express.",
  "DI SẢN VIỆT, THẾ HỆ MỚI": "VIETNAMESE HERITAGE, NEW GENERATION",
  "Nếp xưa.": "Old roots.",
  "Chất mới.": "New spirit.",
  "Không chỉ mặc một bộ đồ.": "It is more than an outfit.",
  "Mặc một câu chuyện, kể theo cách của bạn.":
    "Wear a story. Tell it your way.",
  "Khám phá Việt phục, remix cùng AI và tìm thấy":
    "Explore Vietnamese dress, remix it with AI and find",
  "phiên bản rất riêng của chính mình.":
    "a version that feels unmistakably yours.",
  "Bắt đầu phối đồ": "Start styling",
  "Khám phá di sản": "Explore heritage",
  "Sáng tạo cùng": "Create with",
  "Chất Việt, không giới hạn.": "Vietnamese spirit, no limits.",
  "HERITAGE REIMAGINED — EST. 2026": "HERITAGE REIMAGINED — EST. 2026",
  "Nét xưa, cảm hứng mới.": "Old lines, new inspiration.",
  "Một chút đương đại ↗": "A touch of the contemporary ↗",
  "Truyền thống × Bạn": "Tradition × You",
  "Biến tấu, vẫn đậm bản sắc": "Make it yours, keep its soul",
  "RẤT VIỆT. RẤT BẠN.": "VERY VIETNAMESE. VERY YOU.",
  "DI SẢN KHÔNG ĐỨNG YÊN": "HERITAGE NEVER STANDS STILL",
  "PHONG CÁCH KHÔNG GIỚI HẠN": "STYLE WITHOUT LIMITS",
  "01 / CHẠM VÀO DI SẢN": "01 / TOUCH THE HERITAGE",
  "Mỗi nếp áo,": "Every fold",
  "một câu chuyện.": "holds a story.",
  "Hiểu điều mình mặc.": "Understand what you wear.",
  "Yêu thêm điều mình là.": "Love more of who you are.",
  "Lọc trang phục": "Filter garments",
  "BỘ SƯU TẬP VIỆT PHỤC": "VIETNAMESE DRESS COLLECTION",
  "Mỗi vùng một sắc áo. Mỗi người một cách kể.":
    "Every region has its colors. Every person tells it their way.",
  "Mở thư viện Việt phục": "Open the heritage library",
  "YOUR NEXT FAVORITE LOOK": "YOUR NEXT FAVORITE LOOK",
  "BẢNG MÀU CỦA BẠN": "YOUR COLOR PALETTE",
  "Đương đại. Nhưng không phai bản sắc.":
    "Contemporary, without losing its roots.",
  "Gu của bạn.": "Your taste.",
  "AI đồng hành.": "AI by your side.",
  "Một chiếc áo quen, thêm màu bạn thích, một món phụ kiện bất ngờ.":
    "A familiar garment, your favorite color, an unexpected accessory.",
  "Để Gemini gợi mở những bản phối mang dấu ấn riêng.":
    "Let Gemini open up looks that feel like you.",
  "Chọn trang phục, màu sắc & phong cách": "Choose a garment, color and style",
  "Nhận gợi ý phối cùng lưu ý văn hóa": "Get styling ideas with cultural notes",
  "Lưu lại thành lookbook của riêng bạn": "Save it to your own lookbook",
  "Vào phòng phối đồ": "Enter the mix studio",
  "Không cần tài khoản. Cứ thỏa sức sáng tạo.":
    "No account needed. Create freely.",
  "SÁNG TẠO CÓ HIỂU BIẾT": "CREATIVITY WITH CONTEXT",
  "Đổi cách phối.": "Change the way you style.",
  "Giữ điều làm nên bản sắc.": "Keep what makes it meaningful.",
  "Mỗi gợi ý đi cùng câu chuyện nguồn gốc và lưu ý văn hóa.":
    "Every suggestion comes with context and cultural notes.",
  "Để bạn tự do thể hiện, từ sự thấu hiểu và tôn trọng.":
    "Express yourself freely, with understanding and respect.",
  "Cách chúng mình chọn tư liệu": "How we choose our sources",
  "TRUYỀN THỐNG LÀ ĐIỂM BẮT ĐẦU.": "TRADITION IS THE STARTING POINT.",
  "Phần tiếp theo,": "The next chapter",
  "là bạn.": "is you.",
  "Thử một bản phối. Kể một câu chuyện mới.": "Try a look. Tell a new story.",
  "Đi qua những miền.": "Across regions.",
  "Gặp lại nếp xưa.": "Meet old lines again.",
  "Một thư viện nhỏ để hiểu chiếc áo bạn chọn.":
    "A small library for understanding what you wear.",
  "Từ sự gần gũi thường ngày đến vẻ trang trọng của lễ phục.":
    "From everyday ease to the grace of ceremonial dress.",
  "ĐỌC MỘT CHÚT.": "READ A LITTLE.",
  "YÊU THÊM MỘT CHÚT.": "LOVE A LITTLE MORE.",
  "Tìm tên áo, vùng miền…": "Search garments or regions…",
  "Tìm trong thư viện": "Search the library",
  "Xóa từ khóa": "Clear search",
  "Lọc theo vùng": "Filter by region",
  "trang phục": "garments",
  "Vùng gắn với câu chuyện, không giới hạn nơi mặc.":
    "Regions shape the story, not where you can wear it.",
  "Chưa tìm thấy nếp áo này.": "This garment is not in the archive.",
  "Thử tìm “ngũ thân”, “bà ba” hoặc chọn một vùng khác.":
    "Try “ngu than”, “ba ba” or choose another region.",
  "Xem toàn bộ thư viện": "View the full library",
  "Hiểu trước khi biến tấu.": "Understand before you remix.",
  "Đọc cách chọn tư liệu": "Read how sources are selected",
  "Một chút": "A little",
  "rất bạn.": "very you.",
  "Những bản phối đã lưu, những câu chuyện chưa kể.":
    "Saved looks, untold stories.",
  "Tạo bản phối mới": "Create a new look",
  "Lưu trên trình duyệt này · ": "Saved in this browser · ",
  "Đã xóa bản phối.": "Look deleted.",
  "Hoàn tác": "Undo",
  "Đang mở lookbook…": "Opening your lookbook…",
  "Phối tiếp": "Keep styling",
  "Xem gợi ý đã lưu": "View saved suggestions",
  "Thông tin hình ảnh": "Image information",
  "Tối giản phụ kiện": "Minimal accessories",
  "Chương đầu còn để ngỏ.": "The first chapter is still open.",
  "Lưu một bản phối yêu thích để bắt đầu bộ sưu tập của bạn.":
    "Save a favorite look to begin your collection.",
  "Tìm chất riêng": "Find your style",
  "Đang tải phòng thử 3D…": "Loading the 3D studio…",
  "Chọn ảnh JPG, PNG hoặc WebP nhé.": "Choose a JPG, PNG or WebP image.",
  "Ảnh cần nhỏ hơn 5 MB.": "The image must be smaller than 5 MB.",
  "BẢN PHỐI GỢI Ý": "SUGGESTED LOOK",
  "BẢN PHỐI THEO LỰA CHỌN": "LOOK FROM YOUR CHOICES",
  "GỢI Ý TỪ GOOGLE GEMINI": "SUGGESTION FROM GOOGLE GEMINI",
  "Phối lại cùng Gemini": "Remix with Gemini",
  "Xem gợi ý cơ bản": "View basic suggestion",
  "Lưu bản phối": "Save look",
  "Đã lưu": "Saved",
  "Tải ảnh PNG": "Download PNG",
  "Chia sẻ bản phối": "Share look",
  "Đã sao chép liên kết": "Link copied",
  "Màu sắc": "Colors",
  "Phong cách": "Style",
  "Dịp mặc": "Occasion",
  "Phụ kiện": "Accessories",
  "Bối cảnh": "Backdrop",
  Áo: "Garment",
  "Quần / váy": "Bottom",
  Giày: "Shoes",
  "Về Viets Vibe": "About Viets Vibe",
  "Sáng tạo thoải mái.": "Create freely.",
  "Hiểu dữ liệu đi đâu.": "Know where your data goes.",
  "Lookbook nằm ở đâu?": "Where does the lookbook live?",
  "Ảnh tải lên được dùng thế nào?": "How are uploaded images used?",
  "Liên kết chia sẻ chứa gì?": "What do share links contain?",
  "Dữ liệu vận hành": "Operational data",
  "NGƯỜI MẪU CỦA BẠN": "YOUR MODEL",
  "01 / Dáng & sắc da": "01 / Shape & skin tone",
  "Mẫu người": "Presentation",
  "Dáng trình bày": "Presentation",
  "Nữ · tóc búi thấp": "Feminine · low bun",
  "Nam · tóc ngắn rẽ ngôi": "Masculine · short side-part",
  "Phom người": "Body shape",
  "Thanh mảnh": "Slim",
  "Cân đối": "Regular",
  "Đầy đặn": "Broad",
  "Chiều cao minh họa": "Illustrated height",
  "Chiều cao nhanh": "Quick height",
  "Sắc da": "Skin tone",
  "Tóc cố định theo mẫu.": "Hair follows the selected model.",
  "Chiều cao thay đổi tỉ lệ thân và chân, giữ phom":
    "Height changes body and leg proportions while keeping the",
  "đầu. Mọi trang phục đều có thể thử trên cả hai mẫu.":
    "head shape. Every garment can be tried on both models.",
  "LAYER BY LAYER": "LAYER BY LAYER",
  "02 / Các lớp trang phục": "02 / Garment layers",
  "Chất liệu bề mặt": "Surface material",
  "Lụa · mềm, ánh nhẹ": "Silk · soft, subtle sheen",
  "Đũi · thớ mộc, lì": "Linen · raw, matte texture",
  "Gấm · vân dệt nổi": "Brocade · raised weave",
  "Lớp thân dưới": "Bottom layer",
  "Quần dài": "Trousers",
  "Váy dài": "Long skirt",
  "Giày bệt": "Flats",
  "Lớp trong": "Inner layer",
  "Phụ kiện & viền": "Accessories & trim",
  "Giữ chi tiết cổ áo": "Keep collar detail",
  "Bề mặt và nếp rủ được minh họa bằng ánh sáng 3D; chưa mô phỏng chuyển":
    "Surface and drape are illustrated with 3D lighting; fabric motion and",
  "động vải hay độ vừa theo số đo.": "fit by measurements are not simulated.",
  "Xuất bản sao": "Export backup",
  "Nhập bản sao": "Import backup",
  "Nhập file lookbook": "Import lookbook file",
  "Mang bộ sưu tập sang một thiết bị khác.":
    "Bring your collection to another device.",
  "Đặt hai bản phối cạnh nhau": "Compare two looks side by side",
  "Bản phối thứ nhất": "First look",
  "Bản phối thứ hai": "Second look",
  "So sánh các lựa chọn đã lưu": "Compare saved choices",
  "Chi tiết": "Details",
  "Bản phối 1": "Look 1",
  "Bản phối 2": "Look 2",
  "Trang phục": "Garment",
  "Màu chủ đạo": "Main color",
  "Sự kiện": "Occasion",
  "Không có": "None",
  "Xem ảnh gốc & giấy phép ↗": "View original image & license ↗",
  "Ảnh biên tập khác": "Other editorial images",
  "DỮ LIỆU CỦA BẠN": "YOUR DATA",
  "ĐẰNG SAU MỖI NẾP ÁO": "BEHIND EVERY FOLD",
  "VIỆT PHỤC REMIX · DÀNH CHO THẾ HỆ MỚI":
    "VIETNAMESE DRESS REMIX · FOR A NEW GENERATION",
  "TRƯỚC KHI BẮT ĐẦU": "BEFORE YOU BEGIN",
  "Có thể bạn đang": "You may be",
  "thắc mắc.": "wondering.",
  "404 · MỘT NGÃ RẼ KHÁC": "404 · ANOTHER TURN",
  "Sáng tạo từ": "Create from",
  "sự thấu hiểu.": "understanding.",
  "Tư liệu và hình ảnh": "Sources and images",
  "Ghi nguồn là điểm bắt đầu": "Attribution is the beginning",
  "Nguyên tắc biên tập": "Editorial principles",
  "MỘT NGÃ RẼ KHÁC": "ANOTHER TURN",
  "Nếp áo này": "This garment",
  "chưa có trong thư viện.": "is not in the archive.",
  "Trở về thư viện": "Back to the library",
  "Thông tin dự án": "Project information",
  "Tự hào bản sắc, tự do thể hiện": "Proud of our roots, free to express",
  "Bản phối của bạn": "Your look",
  "Việt's Vibe — Trang chủ": "Viets Vibe — Home",
  "Switch to English": "Switch to English",
  "Chuyển sang tiếng Việt": "Switch to Vietnamese",
  "THE HERITAGE ARCHIVE · ": "THE HERITAGE ARCHIVE · ",
  "CÂU CHUYỆN": "STORIES",
  " cho “": " for “",
  "Đang mở phòng phối đồ…": "Opening the mix studio…",
  "MỘT NHỊP NGHỈ NHỎ": "A SMALL PAUSE",
  "Cảm hứng": "Inspiration",
  "đang gián đoạn.": "is interrupted.",
  "Trang này chưa tải được. Bạn thử lại hoặc trở về trang chủ nhé.":
    "This page could not load. Try again or return home.",
  "Thử lại": "Try again",
  "Về trang chủ": "Back home",
  "Đường dẫn có thể đã thay đổi. Những câu chuyện khác vẫn đang chờ bạn.":
    "The path may have changed. Other stories are still waiting for you.",
  "Đang mở một miền cảm hứng…": "Opening a world of inspiration…",
  "THE REMIX STUDIO / 3D": "THE REMIX STUDIO / 3D",
  "Hôm nay, bạn": "Today,",
  "mặc gì?": "what will you wear?",
  "Chọn dáng người. Khoác nếp áo. Xoay để thấy chất riêng.":
    "Choose a silhouette. Layer a story. Turn it to find your style.",
  "Cùng Google": "With Google",
  "Cùng Google Gemini": "With Google Gemini",
  "Di chuyển trong studio": "Studio navigation",
  "Xem mô hình 3D ↑": "View 3D model ↑",
  "Chọn & chỉnh đồ ↓": "Choose & adjust ↓",
  "Tùy chỉnh bản phối": "Customize your look",
  "Nhóm tùy chỉnh": "Customization groups",
  "Người mẫu & lớp": "Model & layers",
  "Bắt đầu từ một nếp áo": "Start with a garment",
  "Bạn sẽ đi đâu?": "Where are you going?",
  "Một sắc màu rất bạn": "A color that feels like you",
  "Chọn chất riêng": "Choose your style",
  "Thêm chút điểm nhấn": "Add a finishing touch",
  "Tùy chọn": "Optional",
  "Thêm ảnh món đồ của bạn": "Add a photo of your garment",
  "JPG, PNG, WebP · tối đa 5 MB": "JPG, PNG, WebP · up to 5 MB",
  "Xóa ảnh": "Remove image",
  "Tải ảnh món đồ": "Upload garment photo",
  "Ảnh chỉ gửi tới Google khi bạn chọn gợi ý từ Gemini.":
    "Your image is sent to Google only when you choose a Gemini suggestion.",
  "Bạn muốn stylist giúp gì?": "What would you like the stylist to help with?",
  "VD: Phối đi chụp kỷ yếu ở Văn Miếu, nhẹ nhàng, ít phụ kiện và dễ tìm đồ.":
    "E.g. Style a gentle, low-accessory look for a yearbook shoot at Van Mieu.",
  "Gemini đang phối đồ…": "Gemini is styling your look…",
  "Gemini đổi bản phối ngay trên người mẫu: màu, chất liệu, quần/váy, giày và phụ kiện. Có thể hoàn tác; gợi ý cơ bản không gọi AI.":
    "Gemini updates the look on the model: color, fabric, bottoms, shoes and accessories. You can undo it; the basic suggestion does not call AI.",
  "YOUR PERSONAL EDIT": "YOUR PERSONAL EDIT",
  "Làm mới": "Reset",
  "MẶC ĐẸP, ĐÚNG KHUNG CẢNH": "DRESS WELL, IN THE RIGHT CONTEXT",
  "Hà Nội trong bản phối của bạn": "Hanoi in your look",
  "Chọn bối cảnh": "Choose a backdrop",
  "Bản phối stylist đề xuất": "Stylist's suggested look",
  "Bản phối mới đang trên người mẫu.": "The new look is on the model.",
  "Thử một cách phối khác.": "Try another way to style it.",
  "Không phụ kiện": "No accessories",
  "Tất cả": "All",
  "Ba miền": "Three regions",
  "Miền Bắc": "Northern Vietnam",
  "Miền Trung": "Central Vietnam",
  "Miền Nam": "Southern Vietnam",
  "Đỏ son": "Cinnabar red",
  "Ngọc bích": "Jade",
  "Kem lụa": "Silk cream",
  "Hồng sen": "Lotus pink",
  "Lam ngọc": "Jade blue",
  "Dạo phố": "City stroll",
  "Chụp kỷ yếu": "Yearbook shoot",
  "Lễ hội": "Festival",
  Tết: "Tet",
  "Dự lễ trang trọng": "Formal ceremony",
  "Thanh lịch": "Elegant",
  "Tối giản": "Minimal",
  "Nàng thơ": "Romantic",
  "Cá tính": "Expressive",
  "Quạt giấy": "Paper fan",
  "Túi cói": "Woven bag",
  "Ngọc trai": "Pearls",
  "Khăn vấn": "Turban",
  "Phòng thử": "Studio",
  "Hồ Gươm": "Hoan Kiem Lake",
  "Văn Miếu": "Temple of Literature",
  "Cầu Long Biên": "Long Bien Bridge",
  "Màu áo": "Garment color",
  "Chất liệu": "Fabric",
  "Đã áp dụng bản phối AI lên ma-nơ-canh.": "AI look applied to the mannequin.",
  "Đã trở lại bản phối trước khi áp dụng AI.":
    "Returned to the look from before AI was applied.",
  "Nền trung tính · một màu làm điểm nhấn": "Neutral base · one accent color",
  "Các sắc gần nhau · tổng thể nhẹ nhàng": "Close hues · a gentle overall look",
  "Tương phản rõ · chọn một màu chủ đạo":
    "Clear contrast · choose one main color",
  "Nhiều nhóm sắc · thử tiết chế phụ kiện": "Many hues · try fewer accessories",
  "Gợi ý theo khoảng cách sắc màu, không phải điểm đánh giá thẩm mỹ.":
    "A suggestion based on color distance, not an aesthetic score.",
  "Lưu ý văn hóa theo bản phối": "Cultural notes for this look",
  "Chưa có lưu ý bổ sung từ các quy tắc của demo. Xem tư liệu cho bối cảnh sử dụng.":
    "No additional notes from the demo rules. See the sources for context.",
  "Đối chiếu ảnh thật & nguồn gốc": "Compare reference image & origins",
  "Ảnh tham khảo": "Reference image",
  "Món đồ bạn tải lên": "Your uploaded garment",
  "Ảnh tham khảo cho Gemini; chưa chuyển thành vật thể 3D.":
    "Reference image for Gemini; not converted into a 3D object.",
  "Ảnh tư liệu dùng để đối chiếu. Ma-nơ-canh là minh họa được dựng riêng cho bản demo.":
    "The source image is for comparison. The mannequin is a separate illustration made for this demo.",
  "BẢN PHÁC THẢO CỦA BẠN": "YOUR DRAFT LOOK",
  "Mô hình 3D cập nhật ngay theo lựa chọn. Nhấn “Tạo bản phối của tôi” để thêm thẻ gợi ý, hoặc lưu ngay mockup vào lookbook.":
    "The 3D model updates with your choices. Create a look to add suggestion cards, or save the mockup to your lookbook.",
  "Đã lưu bản phối": "Look saved",
  "Lưu vào lookbook": "Save to lookbook",
  "Chia sẻ": "Share",
  "Đẹp từ sự thấu hiểu": "Beauty through understanding",
  "Tìm hiểu thêm · ": "Learn more · ",
  "Gợi ý AI có thể chưa chính xác; đối chiếu nguồn tư liệu khi dùng trong bối cảnh nghi lễ.":
    "AI suggestions may be imperfect; compare with sources when using them in ceremonial contexts.",
  "Mở lookbook của bạn": "Open your lookbook",
  "MANG BỘ SƯU TẬP SANG MỘT THIẾT BỊ KHÁC.":
    "BRING YOUR COLLECTION TO ANOTHER DEVICE.",
  "Đã tạo bản sao lookbook. File không chứa ảnh cá nhân.":
    "Lookbook backup created. The file does not contain personal images.",
  "Chọn file JSON nhỏ hơn 10 MB.": "Choose a JSON file smaller than 10 MB.",
  "Đây chưa phải bản sao lookbook hợp lệ.":
    "This is not a valid lookbook backup.",
  "File có bản phối không hợp lệ hoặc không có dữ liệu.":
    "The file contains invalid looks or no data.",
  "Lookbook tối đa 30 bản. Hãy xóa bớt một số bản phối trước khi nhập.":
    "A lookbook can contain up to 30 looks. Delete some looks before importing.",
  "Đã nhập ": "Imported ",
  " bản phối mới; bỏ qua bản đã có.": " new looks; skipped existing ones.",
  "Không đọc được JSON. Hãy dùng file xuất từ Việt’s Vibe.":
    "Could not read JSON. Use a file exported from Viets Vibe.",
  "Chưa thể nhập lookbook.": "Could not import the lookbook.",
  "Đang đọc dữ liệu đã lưu.": "Reading saved data.",
  "Chưa thể đọc dữ liệu đã lưu. Hãy kiểm tra quyền lưu trữ của trình duyệt; dữ liệu hiện tại chưa bị thay đổi.":
    "Could not read saved data. Check browser storage permissions; current data was not changed.",
  "Chưa thể cập nhật lookbook. Bạn thử lại nhé.":
    "Could not update the lookbook. Please try again.",
  "Chưa thể khôi phục bản phối.": "Could not restore the look.",
  "Xóa bản phối": "Delete look",
  "Thử phối": "Try this look",
  "Ảnh áo dài đương đại trong không gian kiến trúc Việt.":
    "A contemporary ao dai in Vietnamese architecture.",
  "Ảnh thực hành Việt phục hiện nay; không phải hiện vật lịch sử.":
    "A contemporary Vietnamese dress practice; not a historical artifact.",
  "Mẫu Nhật Bình hồng pastel đương đại; không dùng để xác định phẩm cấp lịch sử.":
    "A contemporary pastel pink Nhat Binh; not evidence of historical rank.",
  "Mẫu ngũ thân nam đương đại trong không gian Huế.":
    "A contemporary men's ngu than in a Hue setting.",
  "Ảnh phối tứ thân đương đại; không phải tư liệu phục dựng theo niên đại.":
    "A contemporary tu than look; not a dated reconstruction source.",
  "Áo bà ba kết hợp khăn rằn và nón lá trong hoạt động văn hóa.":
    "Ao ba ba paired with a checked scarf and conical hat in a cultural activity.",
};

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const normalized = new Map(
  Object.entries(translations).map(([vi, en]) => [normalize(vi), en]),
);
const englishToVietnamese = new Map(
  Object.entries(translations).map(([vi, en]) => [normalize(en), vi]),
);
const phraseMap = new Map(
  [...normalized].map(([vi, en]) => [vi.toLocaleLowerCase("vi"), en]),
);
const escaped = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const phrases = new RegExp(
  [...normalized.keys()]
    .filter((s) => /[à-ỹĐđ]/u.test(s))
    .sort((a, b) => b.length - a.length)
    .map(escaped)
    .join("|"),
  "giu",
);

export function translateText(value: string, language: Language): string {
  const clean = normalize(value);
  const direct =
    language === "en" ? normalized.get(clean) : englishToVietnamese.get(clean);
  if (direct) return direct;
  if (language === "en") {
    return clean
      .replace(
        /^Lấy (.+) làm màu chủ đạo; dùng bảng màu từng lớp bạn đã chọn để cân bằng tổng thể\.$/,
        (_, color) =>
          `Use ${translateText(color, "en")} as the main color, and balance the outfit with your layer palette.`,
      )
      .replace(
        /Bản hiện tại dùng (.+?) và (.+?)\./g,
        (_, bottom, shoes) =>
          `This look uses ${translateText(bottom, "en")} and ${translateText(shoes, "en")}.`,
      )
      .replace(
        /^Điểm xuyết (.+); chọn một món làm điểm nhấn để tổng thể không quá nhiều chi tiết\.$/,
        (_, items) =>
          `Accessorize with ${translateText(items, "en")}; choose one focal piece to keep the outfit uncluttered.`,
      )
      .replace(
        /^(\d+) trang phục( cho “.*”)?$/,
        (_, count, query = "") =>
          `${count} garments${query ? ` for “${query.slice(3, -1)}”` : ""}`,
      )
      .replace(/^Sắc da (\d+)$/, "Skin tone $1")
      .replace(
        /^Màu (.+)$/,
        (_, label) => `Color ${translations[label] || label}`,
      )
      .replace(/^Xóa bản phối (.+)$/, "Delete look $1")
      .replace(/^Phối (.+) theo chất riêng$/, "Style $1 your way")
      .replace(/^Đọc câu chuyện (.+)$/, "Read the story of $1")
      .replace(/^HÀ NỘI \/ (.+)$/, "HANOI / $1")
      .replace(
        /^Đã nhập (\d+) bản phối mới; bỏ qua bản đã có\.$/,
        "Imported $1 new looks; skipped duplicates.",
      )
      .replace(
        phrases,
        (match) => phraseMap.get(match.toLocaleLowerCase("vi")) || match,
      );
  }
  return value;
}

export function translationEntries() {
  return Object.entries(translations);
}
