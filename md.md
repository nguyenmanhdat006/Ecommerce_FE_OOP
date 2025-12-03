# Tài liệu đặc tả - Gift Feature

## 1. Requirements

### 1.1 Functional Requirements (FR)

#### FR-001: Gift Catalog Display
**Mô tả**: Hiển thị danh sách các loại gift có sẵn khi user truy cập profile của người khác

**Chi tiết**:
- Hiển thị gift catalog dạng grid layout với icon và số coin yêu cầu
- Mỗi gift item hiển thị:
  - Icon/hình ảnh của gift
  - Tên gift (Gift number)
  - Giá trị (coin cần thiết - ví dụ: 100 coins)
  - Badge "Event" nếu là gift đặc biệt/theo sự kiện
- Hiển thị balance hiện tại của user ở bottom bar
- Hỗ trợ scroll để xem nhiều gift

**Sub-requirements**:
- Phân loại gift theo tabs: Hot, Event, Lucky, Friendship, Vip
- Hiển thị badge "Event" cho gift đặc biệt
- Load gift catalog từ server (dynamic)

**Acceptance Criteria**:
1. Gift catalog hiển thị đầy đủ thông tin: icon, tên, giá
2. Balance hiện tại được hiển thị chính xác
3. Gift có event badge được đánh dấu rõ ràng
4. UI responsive và load nhanh (<2s)

---

#### FR-002: Gift Selection
**Mô tả**: User có thể chọn loại gift và số lượng muốn gửi

**Chi tiết**:
- Click vào gift để select
- Gift được chọn có border highlight (pink border như trong image)
- Hiển thị số lượng đã chọn trên gift item (ví dụ: x3, x1)
- Tự động tính tổng cost khi thay đổi selection

**Sub-requirements**:
- Single select gift tại một thời điểm (chọn gift khác sẽ deselect gift trước)
- Visual feedback khi select (border, highlight)
- Hiển thị quantity trên gift item đã chọn

**Acceptance Criteria**:
1. Chỉ một gift được select tại một thời điểm
2. Gift được chọn có visual indicator rõ ràng
3. Số lượng được update real-time trên gift item

---

#### FR-003: Quantity Selection
**Mô tả**: Cho phép user chọn số lượng gift muốn gửi

**Chi tiết**:
- **Main view**: Quick select buttons: 1, 9, 99
- **Bag view**: Quick select buttons: 1, 2, 3
- Default quantity: 1
- Click button để chọn số lượng
- Tự động tính tổng cost = gift price × quantity
- Hiển thị visual feedback cho button được chọn

**Sub-requirements**:
- Quick select cho số lượng phổ biến
- Button active state cho quantity được chọn
- Có thể chọn các mức quantity khác nhau tùy view

**Acceptance Criteria**:
1. Default quantity là 1
2. Click button thay đổi quantity thành công
3. Total cost được tính đúng
4. Button active state hiển thị rõ ràng

---

#### FR-004: Gift Bag View
**Mô tả**: Hiển thị view "Bag" để xem lại các gift đã chọn trước khi gửi

**Chi tiết**:
- Access từ icon bag ở góc phải màn hình
- Hiển thị inventory/selection hiện tại
- Mỗi gift item hiển thị số lượng (x1, x2, x3...)
- Có thể adjust quantity trong bag view
- Giữ nguyên quick select buttons (1, 2, 3)

**Sub-requirements**:
- Header "Bag" với back button
- Grid layout tương tự main view
- Quantity indicator trên mỗi gift
- Quick select với số lượng nhỏ hơn (1-3)

**Acceptance Criteria**:
1. Bag view hiển thị đúng gift đã chọn
2. Quantity hiển thị chính xác
3. Có thể adjust quantity trong bag
4. Back button hoạt động đúng

---

#### FR-005: Balance Validation
**Mô tả**: Validate đủ balance trước khi cho phép gửi gift

**Chi tiết**:
- Real-time check balance vs total cost
- Disable "Send" button nếu insufficient balance
- Hiển thị current balance: format "🧡 100 >"
- Warning/error message khi balance không đủ

**Sub-requirements**:
- Real-time balance check
- Visual indicator khi insufficient balance
- Clear error messaging

**Acceptance Criteria**:
1. Không thể send nếu balance < total cost
2. "Send" button disabled khi insufficient balance
3. Error message rõ ràng và actionable
4. Balance được hiển thị chính xác

---

#### FR-006: Send Gift Transaction
**Mô tả**: Xử lý transaction gửi gift từ sender đến recipient

**Chi tiết**:
- Click "Send" button để initiate transaction
- Validate balance một lần nữa
- Deduct balance từ sender
- Add contribution points cho recipient
- Create transaction record
- Update XP cho cả sender và recipient
- Hiển thị success animation

**Sub-requirements**:
- Transaction phải atomic (all-or-nothing)
- Create audit log/transaction history
- Real-time notification cho recipient
- Success feedback cho sender

**Acceptance Criteria**:
1. Transaction thành công khi balance đủ
2. Balance được deduct chính xác
3. Contribution points được cộng cho recipient
4. Transaction được log đầy đủ
5. Notification được gửi real-time
6. Success animation được hiển thị

---

#### FR-007: Recipient Profile Integration
**Mô tả**: Gift feature được integrate vào recipient profile page

**Chi tiết**:
- Hiển thị gift section dưới profile info
- Show recipient info: name, badges, following/followers, contribution
- Contextual - chỉ hiển thị khi viewing profile của người khác
- Không hiển thị khi viewing own profile

**Sub-requirements**:
- Profile context: name, avatar, stats
- Contribution count display
- Distance indicator (nếu có location feature)

**Acceptance Criteria**:
1. Gift section chỉ hiển thị trên profile người khác
2. Profile info hiển thị đầy đủ
3. Contribution count hiển thị chính xác

---

#### FR-008: Gift Categories/Tabs
**Mô tả**: Phân loại gift theo các categories khác nhau

**Chi tiết**:
- Tabs: Hot, Event, Lucky, Friendship, Vip
- Active tab có underline indicator
- Filter gifts theo category được chọn
- Hot tab là default

**Sub-requirements**:
- Tab navigation
- Filter functionality
- Active state indicator
- Default tab selection

**Acceptance Criteria**:
1. Tabs hiển thị đầy đủ
2. Click tab filter đúng gifts
3. Active tab có visual indicator
4. Default tab là "Hot"

---

#### FR-009: Event Gifts
**Mô tả**: Support cho special/event gifts với badge đặc biệt

**Chi tiết**:
- Event badge (red "Event" label) ở góc gift item
- Event gifts có thể có giá trị đặc biệt
- Có thể limited time availability
- Hiển thị ở cả main view và bag view

**Sub-requirements**:
- Event badge visual
- Time-limited availability (optional)
- Special pricing/value

**Acceptance Criteria**:
1. Event badge hiển thị rõ ràng
2. Event gifts có thể filter qua Event tab
3. Time limit được enforce (nếu có)

---

### 1.2 Non-Functional Requirements (NFR)

#### NFR-001: Performance
**Mô tả**: Đảm bảo performance tốt cho gift feature

**Chi tiết**:
- Gift catalog load time: < 2 seconds
- Transaction processing time: < 1 second
- Real-time notification delay: < 500ms
- UI interactions (select, quantity change): < 100ms response
- Support concurrent transactions: 100+ TPS

**Acceptance Criteria**:
1. 95% requests meet timing requirements
2. No blocking UI operations
3. Smooth animations (60fps)

---

#### NFR-002: Security
**Mô tả**: Bảo mật transactions và user data

**Chi tiết**:
- Server-side validation cho mọi transaction
- Prevent double-spending
- Secure balance check và deduction
- Transaction authentication
- Rate limiting: max 10 gifts/minute per user
- Audit logging cho mọi transaction

**Acceptance Criteria**:
1. Không thể bypass client-side validation
2. Transaction integrity được đảm bảo
3. Audit trail đầy đủ
4. Rate limiting hoạt động đúng

---

#### NFR-003: Scalability
**Mô tả**: Hệ thống scale được với số lượng user lớn

**Chi tiết**:
- Support 10,000+ concurrent users
- Gift catalog cache với CDN
- Database indexing cho quick lookup
- Horizontal scaling cho transaction service
- Queue system cho notifications

**Acceptance Criteria**:
1. Performance không giảm với 10k concurrent users
2. Database queries < 100ms
3. Cache hit rate > 90%

---

#### NFR-004: Reliability
**Mô tả**: Đảm bảo độ tin cậy của transactions

**Chi tiết**:
- Transaction success rate: > 99.9%
- Zero data loss cho completed transactions
- Automatic retry cho failed notifications
- Transaction rollback nếu có lỗi
- Uptime: 99.9%

**Acceptance Criteria**:
1. Transaction không bị mất
2. Balance luôn consistent
3. Failed transactions được rollback đúng

---

#### NFR-005: Usability
**Mô tả**: UI/UX dễ sử dụng và intuitive

**Chi tiết**:
- Responsive design cho multiple screen sizes
- Clear visual feedback cho mọi action
- Error messages dễ hiểu và actionable
- Accessibility compliance (WCAG 2.1 Level AA)
- Support cho multiple languages

**Acceptance Criteria**:
1. User có thể complete flow không cần hướng dẫn
2. Error messages rõ ràng
3. Responsive trên mobile/tablet

---

## 2. Use Cases

### UC-001: Send Gift to User

**Actor**: User A (Sender), User B (Recipient)

**Preconditions**:
- User A đã đăng nhập
- User A có balance > 0 trong wallet
- User B tồn tại và active
- User A đang xem profile của User B

**Main Flow**:
1. User A navigate đến profile của User B
2. System hiển thị profile info của User B (name, avatar, contribution, badges)
3. System load và hiển thị gift catalog với tabs (Hot, Event, Lucky, Friendship, Vip)
4. System hiển thị current balance của User A ở bottom bar
5. User A browse gift catalog (có thể switch tabs)
6. User A click chọn một gift
7. System highlight gift đã chọn (pink border)
8. User A chọn quantity bằng quick select buttons (1, 9, 99)
9. System tính total cost = gift price × quantity
10. System update quantity display trên gift item (ví dụ: x3)
11. System validate: total cost ≤ current balance
12. User A click "Send" button
13. System confirm transaction (có thể có confirmation dialog cho high-value gifts)
14. System xử lý transaction:
    - Create transaction record
    - Deduct balance từ User A wallet
    - Add contribution points cho User B
    - Update XP cho cả User A và User B
    - Create notification record
15. System commit transaction to database
16. System gửi real-time notification cho User B
17. System hiển thị success animation cho User A
18. System refresh balance display
19. System reset gift selection
20. Use case ends successfully

**Alternative Flows**:

**AF-001: Insufficient Balance**
- 11a. Nếu total cost > current balance:
  - System highlight balance indicator (red color)
  - System disable "Send" button
  - System hiển thị error message: "Insufficient balance. Please top up your wallet."
  - System có thể suggest nạp thêm coins
  - Use case ends

**AF-002: Change Gift Selection**
- 6a. User A chọn gift khác sau khi đã chọn gift trước:
  - System deselect gift trước đó
  - System reset quantity về 1
  - System highlight gift mới
  - Resume từ step 8

**AF-003: Use Bag View**
- 10a. User A click vào bag icon:
  - System hiển thị bag view
  - System show selected gift với quantity
  - User A có thể adjust quantity (quick select: 1, 2, 3)
  - User A click back để return main view
  - Resume từ step 11

**AF-004: Transaction Failed**
- 14a. Nếu transaction processing failed:
  - System rollback toàn bộ transaction
  - System log error details
  - System hiển thị error message: "Transaction failed. Please try again."
  - System giữ nguyên gift selection
  - User A có thể retry
  - Use case ends

**AF-005: Recipient Offline**
- 16a. Nếu User B offline:
  - System lưu notification vào database
  - System gửi push notification
  - User B sẽ thấy notification khi online lại
  - Continue to step 17

**AF-006: Network Error**
- Tại bất kỳ step nào:
  - System hiển thị network error message
  - System retain user's selection/state
  - User có thể retry
  - Use case ends

**AF-007: Switch Category Tab**
- 5a. User A click vào tab khác (Event, Lucky, Friendship, Vip):
  - System filter và hiển thị gifts theo category
  - System highlight active tab
  - System deselect current gift selection (nếu có)
  - Resume từ step 6

**AF-008: High-Value Gift Confirmation**
- 13a. Nếu total cost > threshold (ví dụ: 1000 coins):
  - System hiển thị confirmation dialog
  - Dialog show: gift info, quantity, total cost
  - User A confirm hoặc cancel
  - If cancel: use case ends
  - If confirm: continue to step 14

**Postconditions**:
- **Success scenario**:
  - Balance của User A giảm đúng = total cost
  - Contribution points của User B tăng
  - Transaction record được tạo và lưu
  - Notification được gửi cho User B
  - XP của cả 2 users được update
  - Transaction history được log
  
- **Failed scenario**:
  - Balance không thay đổi
  - Không có transaction record
  - Error được log
  - User có thể retry

---

### UC-002: Browse Gift Catalog

**Actor**: User A (Browser)

**Preconditions**:
- User A đã đăng nhập
- User A đang xem profile của User khác

**Main Flow**:
1. System hiển thị gift catalog section dưới profile header
2. System load gift catalog từ server/cache
3. System hiển thị gifts với default tab "Hot"
4. System show gift grid với items:
   - Gift icon/image
   - Gift name
   - Price (coins)
   - Event badge (nếu có)
5. User A scroll để xem thêm gifts
6. User A có thể switch tabs (Hot, Event, Lucky, Friendship, Vip)
7. System filter gifts theo tab được chọn
8. System highlight active tab
9. Use case ends

**Alternative Flows**:

**AF-001: Slow Network**
- 2a. Network chậm, catalog load lâu:
  - System hiển thị loading skeleton/spinner
  - System load progressively (lazy load)
  - System hiển thị gifts khi available
  - Continue to step 3

**AF-002: Empty Category**
- 7a. Category không có gift:
  - System hiển thị empty state message
  - System suggest switch sang tab khác
  - Use case ends

**Postconditions**:
- Gift catalog được hiển thị đầy đủ
- User có overview về available gifts
- Gift data được cache cho lần xem sau

---

### UC-003: View Gift Bag

**Actor**: User A

**Preconditions**:
- User A đang ở gift catalog view
- User A đã chọn ít nhất 1 gift

**Main Flow**:
1. User A click vào bag icon (góc phải)
2. System transition sang bag view
3. System hiển thị header "Bag" với back button
4. System show selected gift với quantity indicator (x1, x2, x3...)
5. System hiển thị all gifts trong grid
6. User A xem gift đã chọn
7. User A có thể adjust quantity với quick select (1, 2, 3)
8. System update quantity real-time
9. User A click back button
10. System return về main gift catalog view
11. Use case ends

**Alternative Flows**:

**AF-001: No Gift Selected**
- 1a. User click bag icon nhưng chưa chọn gift:
  - System vẫn mở bag view
  - System hiển thị empty state hoặc all gifts với x0
  - Continue to step 4

**AF-002: Send From Bag**
- 8a. User A click "Send" từ bag view:
  - Jump to UC-001 step 12
  - Process transaction
  - Return to main view after success

**Postconditions**:
- User đã xem lại selection
- Quantity có thể đã được adjusted
- System ready cho send action

---

## 3. Sequence Diagrams

### Sequence Diagram - UC-001: Send Gift to User

```
User A          Mobile App       API Gateway      Gift Service     Wallet Service    Notification Service    Database
  |                |                  |                |                  |                   |                 |
  |--Select Gift-->|                  |                |                  |                   |                 |
  |                |                  |                |                  |                   |                 |
  |--Select Qty--->|                  |                |                  |                   |                 |
  |                |                  |                |                  |                   |                 |
  |                |--Validate Balance (local)         |                  |                   |                 |
  |                |                  |                |                  |                   |                 |
  |--Click Send--->|                  |                |                  |                   |                 |
  |                |                  |                |                  |                   |                 |
  |                |--POST /gifts/send--------------->|                  |                   |                 |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |--Check Balance------------------>|                   |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |                  |--Query Balance------------>|         |
  |                |                  |                |                  |<--Return Balance-----------|         |
  |                |                  |                |<--Balance OK-------------------|                   |                 |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |--Begin Transaction--------------------------->|         |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |--Deduct Balance--------------->|                   |                 |
  |                |                  |                |                  |--UPDATE wallets--------->|         |
  |                |                  |                |                  |<--Success---------------|         |
  |                |                  |                |<--Balance Deducted-------------|                   |                 |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |--INSERT gift_transactions----------------------->|         |
  |                |                  |                |<--Transaction Created----------------------------|         |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |--UPDATE user_contributions (User B)------------->|         |
  |                |                  |                |<--Contribution Updated---------------------------|         |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |--UPDATE user_xp (User A & B)-------------------->|         |
  |                |                  |                |<--XP Updated-------------------------------------|         |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |--Commit Transaction---------------------------->|         |
  |                |                  |                |<--Transaction Committed-------------------------|         |
  |                |                  |                |                  |                   |                 |
  |                |                  |                |--Send Notification----------------->|                   |
  |                |                  |                |                  |                   |--INSERT notifications->|
  |                |                  |                |                  |                   |--Push to User B--->|
  |                |                  |                |<--Notification Sent--------------|                   |
  |                |                  |                |                  |                   |                 |
  |                |                  |<--200 OK (transaction_id, new_balance, xp_gained)--|                   |                 |
  |                |<--Success Response-------------|                  |                   |                 |
  |                |                  |                |                  |                   |                 |
  |<--Show Success Animation         |                  |                   |                 |
  |<--Update Balance-|                  |                |                  |                   |                 |
  |<--Reset Selection|                  |                |                  |                   |                 |

---

Alternative Flow: Insufficient Balance

User A          Mobile App       API Gateway      Gift Service     Wallet Service    Database
  |                |                  |                |                  |                 |
  |--Click Send--->|                  |                |                  |                 |
  |                |                  |                |                  |                 |
  |                |--POST /gifts/send--------------->|                  |                 |
  |                |                  |                |                  |                 |
  |                |                  |                |--Check Balance------------------>|                 |
  |                |                  |                |                  |                 |
  |                |                  |                |                  |--Query Balance------------>|
  |                |                  |                |                  |<--Return Balance-----------|
  |                |                  |                |<--Insufficient Balance-----------|                 |
  |                |                  |                |                  |                 |
  |                |                  |<--400 Bad Request (error: "insufficient_balance")--|                 |
  |                |<--Error Response-------------|                  |                 |
  |                |                  |                |                  |                 |
  |<--Show Error Message             |                  |                 |
  |<--Highlight Balance              |                  |                 |
  |<--Disable Send Button            |                  |                 |
```

---

### Sequence Diagram - UC-002: Browse Gift Catalog

```
User A          Mobile App       API Gateway      Gift Service     Cache (Redis)    Database
  |                |                  |                |                  |                 |
  |--Open Profile->|                  |                |                  |                 |
  |   (User B)     |                  |                |                  |                 |
  |                |                  |                |                  |                 |
  |                |--GET /gifts/catalog?tab=hot----->|                  |                 |
  |                |                  |                |                  |                 |
  |                |                  |                |--Check Cache---->|                 |
  |                |                  |                |<--Cache Hit------|                 |
  |                |                  |                | (or Cache Miss)  |                 |
  |                |                  |                |                  |                 |
  |                |                  |    [If Cache Miss]                |                 |
  |                |                  |                |--Query Gifts-------------------->|
  |                |                  |                |<--Return Gifts-------------------|
  |                |                  |                |                  |                 |
  |                |                  |                |--Store in Cache->|                 |
  |                |                  |                |                  |                 |
  |                |                  |<--200 OK (gift_list, prices, event_flags)---------|
  |                |<--Gift Catalog Data------------|                  |                 |
  |                |                  |                |                  |                 |
  |<--Render Gifts |                  |                |                  |                 |
  |<--Show Hot Tab (active)          |                  |                 |
  |                |                  |                |                  |                 |
  |--Switch to---->|                  |                |                  |                 |
  |  Event Tab     |                  |                |                  |                 |
  |                |                  |                |                  |                 |
  |                |--GET /gifts/catalog?tab=event--->|                  |                 |
  |                |                  |                |--Check Cache---->|                 |
  |                |                  |                |<--Return Cached--|                 |
  |                |                  |<--200 OK (filtered_gift_list)----|                 |
  |                |<--Event Gifts Data-----------|                  |                 |
  |                |                  |                |                  |                 |
  |<--Render Event Gifts             |                  |                 |
  |<--Highlight Event Tab            |                  |                 |
```

---

### Sequence Diagram - UC-003: View Gift Bag

```
User A          Mobile App       Local State
  |                |                  |
  |--Select Gift-->|                  |
  |--Select Qty--->|                  |
  |                |                  |
  |                |--Store Selection------------->|
  |                |  (gift_id, qty) |
  |                |                  |
  |--Click Bag---->|                  |
  |     Icon       |                  |
  |                |                  |
  |                |--Get Selection--------------->|
  |                |<--Return (gift_id, qty)-------|
  |                |                  |
  |<--Transition to|                  |
  |   Bag View     |                  |
  |                |                  |
  |<--Show Selected Gift with x{qty} |
  |<--Show All Gifts                 |
  |                |                  |
  |--Adjust Qty--->|                  |
  | (click 2)      |                  |
  |                |                  |
  |                |--Update Selection------------>|
  |                |  (qty = 2)      |
  |                |                  |
  |<--Update Display (x2)            |
  |                |                  |
  |--Click Back--->|                  |
  |                |                  |
  |                |--Get Selection--------------->|
  |                |<--Return Updated Selection----|
  |                |                  |
  |<--Transition to|                  |
  |   Main View    |                  |
  |                |                  |
  |<--Show Selected Gift with x2     |
```

---

## 4. Database Design & Architecture

### 4.1 Database Design / Data Model

#### Table: `gifts`
Lưu thông tin về các loại gift có sẵn trong hệ thống

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Gift ID |
| name | VARCHAR(100) | NOT NULL | Tên gift |
| description | TEXT | NULLABLE | Mô tả gift |
| icon_url | VARCHAR(255) | NOT NULL | URL của icon/image |
| price | INT | NOT NULL, CHECK (price > 0) | Giá gift (coins) |
| category | ENUM('hot','event','lucky','friendship','vip') | NOT NULL, DEFAULT 'hot' | Category của gift |
| is_event | BOOLEAN | DEFAULT FALSE | Gift có phải event gift không |
| event_start_date | TIMESTAMP | NULLABLE | Ngày bắt đầu event (nếu có) |
| event_end_date | TIMESTAMP | NULLABLE | Ngày kết thúc event (nếu có) |
| is_active | BOOLEAN | DEFAULT TRUE | Gift còn active không |
| xp_sender | INT | NOT NULL, DEFAULT 0 | XP reward cho sender |
| xp_recipient | INT | NOT NULL, DEFAULT 0 | XP reward cho recipient |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Thời gian update |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX `idx_category`: (`category`, `is_active`)
- INDEX `idx_event`: (`is_event`, `event_end_date`)
- INDEX `idx_active`: (`is_active`)

---

#### Table: `users`
Thông tin user (giả sử đã có)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY | User ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Username |
| display_name | VARCHAR(100) | NOT NULL | Display name |
| avatar_url | VARCHAR(255) | NULLABLE | Avatar URL |
| balance | BIGINT | NOT NULL, DEFAULT 0, CHECK (balance >= 0) | Balance hiện tại (coins) |
| total_contribution | BIGINT | NOT NULL, DEFAULT 0 | Tổng contribution nhận được |
| xp | BIGINT | NOT NULL, DEFAULT 0 | Experience points |
| level | INT | NOT NULL, DEFAULT 1 | User level |
| is_active | BOOLEAN | DEFAULT TRUE | Account còn active không |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Thời gian update |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE INDEX `idx_username`: (`username`)
- INDEX `idx_active`: (`is_active`)

---

#### Table: `gift_transactions`
Lưu lịch sử transactions gửi gift

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Transaction ID |
| sender_id | BIGINT | NOT NULL, FOREIGN KEY -> users(id) | ID của người gửi |
| recipient_id | BIGINT | NOT NULL, FOREIGN KEY -> users(id) | ID của người nhận |
| gift_id | BIGINT | NOT NULL, FOREIGN KEY -> gifts(id) | ID của gift |
| quantity | INT | NOT NULL, CHECK (quantity > 0) | Số lượng gift |
| unit_price | INT | NOT NULL | Giá gift tại thời điểm gửi |
| total_cost | BIGINT | NOT NULL | Tổng chi phí = unit_price * quantity |
| sender_balance_before | BIGINT | NOT NULL | Balance của sender trước giao dịch |
| sender_balance_after | BIGINT | NOT NULL | Balance của sender sau giao dịch |
| recipient_contribution_before | BIGINT | NOT NULL | Contribution của recipient trước |
| recipient_contribution_after | BIGINT | NOT NULL | Contribution của recipient sau |
| xp_sender_gained | INT | NOT NULL, DEFAULT 0 | XP sender nhận được |
| xp_recipient_gained | INT | NOT NULL, DEFAULT 0 | XP recipient nhận được |
| status | ENUM('pending','completed','failed','rolled_back') | NOT NULL, DEFAULT 'pending' | Trạng thái transaction |
| error_code | VARCHAR(50) | NULLABLE | Mã lỗi nếu failed |
| error_message | TEXT | NULLABLE | Chi tiết lỗi nếu failed |
| ip_address | VARCHAR(45) | NULLABLE | IP của sender |
| user_agent | VARCHAR(255) | NULLABLE | User agent |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo transaction |
| completed_at | TIMESTAMP | NULLABLE | Thời gian hoàn thành |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX `idx_sender`: (`sender_id`, `created_at` DESC)
- INDEX `idx_recipient`: (`recipient_id`, `created_at` DESC)
- INDEX `idx_status`: (`status`, `created_at` DESC)
- INDEX `idx_created`: (`created_at` DESC)
- FOREIGN KEY: `sender_id` REFERENCES `users(id)`
- FOREIGN KEY: `recipient_id` REFERENCES `users(id)`
- FOREIGN KEY: `gift_id` REFERENCES `gifts(id)`

---

#### Table: `notifications`
Lưu notifications cho users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Notification ID |
| user_id | BIGINT | NOT NULL, FOREIGN KEY -> users(id) | User nhận notification |
| type | VARCHAR(50) | NOT NULL | Loại notification (gift_received) |
| title | VARCHAR(255) | NOT NULL | Tiêu đề notification |
| message | TEXT | NOT NULL | Nội dung notification |
| data | JSON | NULLABLE | Data thêm (gift_id, sender_id, etc.) |
| is_read | BOOLEAN | DEFAULT FALSE | Đã đọc chưa |
| is_sent | BOOLEAN | DEFAULT FALSE | Đã gửi push notification chưa |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo |
| read_at | TIMESTAMP | NULLABLE | Thời gian đọc |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX `idx_user_unread`: (`user_id`, `is_read`, `created_at` DESC)
- INDEX `idx_user_created`: (`user_id`, `created_at` DESC)
- INDEX `idx_unsent`: (`is_sent`, `created_at`) - for push notification queue
- FOREIGN KEY: `user_id` REFERENCES `users(id)`

---

#### Table: `user_gift_stats` (Optional)
Aggregate statistics cho gifts (optional, có thể dùng để optimize queries)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | BIGINT | PRIMARY KEY, FOREIGN KEY -> users(id) | User ID |
| total_gifts_sent | INT | NOT NULL, DEFAULT 0 | Tổng gifts đã gửi |
| total_gifts_received | INT | NOT NULL, DEFAULT 0 | Tổng gifts đã nhận |
| total_spent | BIGINT | NOT NULL, DEFAULT 0 | Tổng coins đã spend |
| total_received_value | BIGINT | NOT NULL, DEFAULT 0 | Tổng giá trị gifts nhận |
| favorite_gift_id | BIGINT | NULLABLE, FOREIGN KEY -> gifts(id) | Gift gửi nhiều nhất |
| last_sent_at | TIMESTAMP | NULLABLE | Lần cuối gửi gift |
| last_received_at | TIMESTAMP | NULLABLE | Lần cuối nhận gift |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Thời gian update |

**Indexes**:
- PRIMARY KEY: `user_id`
- FOREIGN KEY: `user_id` REFERENCES `users(id)`
- FOREIGN KEY: `favorite_gift_id` REFERENCES `gifts(id)`

---

### 4.2 API Design

#### Base URL
```
https://api.idollivdream.com/v1
```

#### Authentication
Tất cả endpoints yêu cầu authentication header:
```
Authorization: Bearer {access_token}
```

---

#### **GET** `/gifts/catalog`
Lấy danh sách gifts available

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category: hot, event, lucky, friendship, vip |
| page | int | No | Page number (default: 1) |
| limit | int | No | Items per page (default: 50, max: 100) |

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "gifts": [
      {
        "id": 123,
        "name": "Gift number",
        "description": "A special gift",
        "icon_url": "https://cdn.example.com/gifts/123.png",
        "price": 100,
        "category": "hot",
        "is_event": false,
        "event_end_date": null,
        "xp_sender": 10,
        "xp_recipient": 5
      },
      {
        "id": 124,
        "name": "Event Gift",
        "description": "Limited time event gift",
        "icon_url": "https://cdn.example.com/gifts/124.png",
        "price": 200,
        "category": "event",
        "is_event": true,
        "event_end_date": "2025-12-31T23:59:59Z",
        "xp_sender": 20,
        "xp_recipient": 10
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 12,
      "limit": 50
    }
  }
}
```

**Error Responses**:
- **400 Bad Request**: Invalid category
- **401 Unauthorized**: Missing or invalid auth token
- **500 Internal Server Error**: Server error

---

#### **GET** `/users/{user_id}/balance`
Lấy balance hiện tại của user

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | int64 | Yes | User ID (hoặc "me" cho current user) |

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "user_id": 123,
    "balance": 15000,
    "currency": "coins"
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid auth token
- **403 Forbidden**: Cannot view other user's balance
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error

---

#### **POST** `/gifts/send`
Gửi gift cho user khác

**Request Body**:
```json
{
  "recipient_id": 456,
  "gift_id": 123,
  "quantity": 9,
  "message": "Optional message"
}
```

**Validation Rules**:
- `recipient_id`: required, must be valid user ID, cannot be sender
- `gift_id`: required, must be valid and active gift
- `quantity`: required, min: 1, max: 999
- `message`: optional, max length: 500 characters

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "transaction_id": 789012,
    "sender_id": 123,
    "recipient_id": 456,
    "gift_id": 123,
    "quantity": 9,
    "unit_price": 100,
    "total_cost": 900,
    "new_balance": 14100,
    "xp_gained": 90,
    "recipient_xp_gained": 45,
    "status": "completed",
    "created_at": "2025-11-19T17:00:29Z"
  }
}
```

**Error Responses**:

**400 Bad Request - Validation Error**:
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Invalid request data",
    "details": [
      {
        "field": "quantity",
        "message": "Quantity must be between 1 and 999"
      }
    ]
  }
}
```

**400 Bad Request - Insufficient Balance**:
```json
{
  "success": false,
  "error": {
    "code": "insufficient_balance",
    "message": "Insufficient balance to complete this transaction",
    "details": {
      "current_balance": 500,
      "required": 900,
      "shortage": 400
    }
  }
}
```

**400 Bad Request - Invalid Recipient**:
```json
{
  "success": false,
  "error": {
    "code": "invalid_recipient",
    "message": "Cannot send gift to yourself"
  }
}
```

**404 Not Found - Gift Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "gift_not_found",
    "message": "Gift not found or no longer available"
  }
}
```

**404 Not Found - User Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "user_not_found",
    "message": "Recipient user not found"
  }
}
```

**429 Too Many Requests - Rate Limit**:
```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded the gift sending limit. Please try again later.",
    "details": {
      "limit": 10,
      "window": "1 minute",
      "retry_after": 45
    }
  }
}
```

**500 Internal Server Error - Transaction Failed**:
```json
{
  "success": false,
  "error": {
    "code": "transaction_failed",
    "message": "Failed to process transaction. Please try again.",
    "transaction_id": "partial_789012"
  }
}
```

---

#### **GET** `/gifts/transactions`
Lấy lịch sử gift transactions

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | int64 | No | Filter by user (sender or recipient). Default: current user |
| type | string | No | Filter type: "sent", "received", "all". Default: "all" |
| page | int | No | Page number (default: 1) |
| limit | int | No | Items per page (default: 20, max: 100) |

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 789012,
        "sender": {
          "id": 123,
          "username": "user_a",
          "display_name": "User A",
          "avatar_url": "https://cdn.example.com/avatars/123.jpg"
        },
        "recipient": {
          "id": 456,
          "username": "darlene_bears",
          "display_name": "Darlene Bears",
          "avatar_url": "https://cdn.example.com/avatars/456.jpg"
        },
        "gift": {
          "id": 123,
          "name": "Gift number",
          "icon_url": "https://cdn.example.com/gifts/123.png"
        },
        "quantity": 9,
        "total_cost": 900,
        "status": "completed",
        "created_at": "2025-11-19T17:00:29Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 87,
      "limit": 20
    }
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid auth token
- **403 Forbidden**: Cannot view other user's transactions
- **500 Internal Server Error**: Server error

---

#### **GET** `/users/{user_id}/profile`
Lấy profile info của user (including gift-related stats)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | int64 | Yes | User ID |

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 456,
      "username": "darlene_bears",
      "display_name": "Darlene Bears",
      "avatar_url": "https://cdn.example.com/avatars/456.jpg",
      "bio": "I am an enthusiastic and curious individual with a passion for technology and creativity.",
      "following_count": 360,
      "followers_count": 160000,
      "contribution": 1000,
      "badges": [
        {
          "id": "badge_1",
          "icon_url": "https://cdn.example.com/badges/1.png",
          "count": 56
        },
        {
          "id": "badge_2",
          "icon_url": "https://cdn.example.com/badges/2.png",
          "count": 56
        }
      ],
      "distance": "2.5 Km",
      "level": 15,
      "xp": 12500,
      "is_vip": false
    },
    "gift_stats": {
      "total_gifts_received": 523,
      "total_received_value": 45000
    }
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid auth token
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error

---

### 4.3 UI Design

#### Screen 1: Gift Catalog (Main View)

**Components**:

1. **Profile Header** (top section):
   - Avatar (circular, left)
   - Display name + verified badge
   - Following/Followers count
   - Contribution count with icon
   - Distance indicator
   - Bio text
   - Banner/promotional section ("Hân mỹ rừng idol livdream")

2. **Category Tabs** (horizontal scroll):
   - Hot (active - underline)
   - Event
   - Lucky
   - Friendship
   - Vip

3. **Gift Grid**:
   - Grid layout: 4 columns
   - Each gift card:
     - Gift icon/image (top)
     - Gift name (center)
     - Price with coin icon (bottom)
     - Event badge (top-right corner if applicable)
     - Selection border (pink/highlight when selected)
     - Quantity indicator (x1, x3, etc. when selected)

4. **Bottom Action Bar**:
   - Current balance display (left): "🧡 100 >"
   - Quantity quick select buttons: 1, 9, 99
   - Send button (right, pink): "Send"
   - Bag icon (absolute position, top-right)

**Layout**:
```
┌─────────────────────────────────────┐
│  ← [Profile Header Section]     ⋯  │
│                                     │
│  [Avatar] Darlene Bears ✓           │
│  360 Following  160k Followers      │
│  🔶56  🟢56  Contribution: 1k 🧡    │
│  2.5 Km                             │
│                                     │
│  Bio text...                        │
│                                     │
│  [Banner: Hân mỹ rừng...]          │
├─────────────────────────────────────┤
│  Hot | Event | Lucky | Friendship...│
├─────────────────────────────────────┤
│  [Gift] [Gift] [Gift] [Gift]       │
│  [Gift] [Gift] [Gift] [Gift]       │
│  [Gift] [Gift] [Gift] [Gift]       │
│                                     │
│                          [Bag Icon] │
├─────────────────────────────────────┤
│  🧡100 >  [ 1 ] [ 9 ] [ 99 ] [Send] │
└─────────────────────────────────────┘
```

---

#### Screen 2: Gift Bag View

**Components**:

1. **Header**:
   - Back button (left): "<"
   - Title: "Bag"

2. **Gift Grid**:
   - Same grid layout as main view
   - All gifts visible
   - Selected gift highlighted with pink border
   - Quantity indicator on each gift (x1, x2, x3...)

3. **Bottom Action Bar**:
   - Quantity quick select: 1, 2, 3 (smaller range)
   - Send button (right, pink): "Send"

**Layout**:
```
┌─────────────────────────────────────┐
│  <  Bag                             │
├─────────────────────────────────────┤
│  [Gift x3] [Gift x1] [Gift x1] [Gift│
│  [Gift x1] [Gift x1] [Gift x1] [Gift│
│  [Gift x1] [Gift x1] [Gift x1] [Gift│
│  [Gift x1] [Gift x1] [Gift x1] [Gift│
│                                     │
├─────────────────────────────────────┤
│           [ 1 ] [ 2 ] [ 3 ]   [Send]│
└─────────────────────────────────────┘
```

**Interaction States**:

1. **Gift Item - Default**:
   - Normal border
   - Gift icon displayed
   - Price shown below

2. **Gift Item - Selected**:
   - Pink/highlight border (3px)
   - Quantity badge (top-left): "x{quantity}"
   - Gift icon slightly larger/emphasized

3. **Gift Item - Event**:
   - Red "Event" badge (top-right corner)
   - Slightly different background or glow effect

4. **Quantity Button - Default**:
   - Light gray background
   - Dark gray text
   - Rounded corners

5. **Quantity Button - Selected**:
   - Pink background
   - White text
   - Rounded corners

6. **Send Button - Enabled**:
   - Pink gradient background
   - White text: "Send"
   - Rounded corners
   - Slightly elevated (shadow)

7. **Send Button - Disabled**:
   - Gray background
   - Gray text
   - No shadow
   - Not clickable

**Animations**:

1. **Gift Selection**:
   - Scale up slightly (1.05x)
   - Border color transition (0.2s)
   - Quantity badge fade in

2. **Tab Switch**:
   - Underline slide animation
   - Content fade transition

3. **Send Success**:
   - Gift icon animates flying from sender to recipient
   - Confetti/sparkle effect
   - Success toast message
   - Balance counter animation (counting down)

4. **View Transition**:
   - Slide animation: main view <-> bag view
   - Smooth transition (0.3s ease-in-out)

**Colors**:
- Primary: Pink/Magenta (#FF4081 or similar)
- Secondary: Orange (for coins/contribution)
- Background: Light gray/white gradient
- Text: Dark gray (#333333)
- Border: Light gray (#E0E0E0)
- Selection: Pink (#FF4081)
- Event badge: Red (#F44336)

**Typography**:
- Display name: Bold, 18px
- Stats (following/followers): Regular, 14px
- Gift name: Medium, 12px
- Price: Medium, 11px
- Buttons: Medium, 14px

---

### 4.4 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Mobile App (iOS/Android)                 │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────────┐  │
│  │ Profile View  │  │  Gift Catalog │  │  Gift Bag View     │  │
│  │               │  │  Component    │  │  Component         │  │
│  └───────────────┘  └───────────────┘  └────────────────────┘  │
│           │                  │                      │            │
│           └──────────────────┴──────────────────────┘            │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                             ▼                                    │
│                    ┌──────────────────┐                          │
│                    │   API Gateway    │                          │
│                    │  (Load Balancer) │                          │
│                    └──────────────────┘                          │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐                │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────┐        │
│  │Gift Service │    │Wallet Service│   │User Service  │        │
│  │             │    │              │    │              │        │
│  │- Get Catalog│    │- Check Balance│   │- Get Profile │        │
│  │- Send Gift  │    │- Deduct Balance│  │- Update XP   │        │
│  │- Get History│    │- Add Coins   │    │- Get Stats   │        │
│  └─────────────┘    └─────────────┘    └──────────────┘        │
│         │                   │                   │                │
│         └───────────────────┼───────────────────┘                │
│                             │                                    │
│                             ▼                                    │
│                    ┌──────────────────┐                          │
│                    │Transaction Service│                         │
│                    │                  │                          │
│                    │- Process Gift TX │                          │
│                    │- Rollback        │                          │
│                    │- Audit Log       │                          │
│                    └──────────────────┘                          │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐                │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────┐        │
│  │Notification │    │  Analytics  │    │  Cache Layer │        │
│  │  Service    │    │  Service    │    │   (Redis)    │        │
│  │             │    │             │    │              │        │
│  │- Push Notif │    │- Log Events │    │- Gift Catalog│        │
│  │- In-app Alert│   │- User Metrics│   │- User Balance│        │
│  └─────────────┘    └─────────────┘    └──────────────┘        │
│         │                                       │                │
└─────────┼───────────────────────────────────────┼────────────────┘
          │                                       │
          ▼                                       │
┌──────────────────┐                              │
│ Push Notification│                              │
│   Gateway        │                              │
│ (FCM/APNs)       │                              │
└──────────────────┘                              │
                                                  │
          ┌───────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Primary DB   │  │ Replica DB   │  │ Replica DB   │      │
│  │ (MySQL)      │  │ (Read-only)  │  │ (Read-only)  │      │
│  │              │  │              │  │              │      │
│  │- gifts       │  │- Read Queries│  │- Read Queries│      │
│  │- users       │  │              │  │              │      │
│  │- gift_txs    │  │              │  │              │      │
│  │- notifications│ │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                                                    │
│         └─────────► (Replication) ──────────────────►       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Architecture Notes**:

1. **Mobile App Layer**:
   - Native iOS/Android apps
   - Local state management
   - Real-time UI updates

2. **API Gateway**:
   - Load balancing
   - Rate limiting
   - Authentication/Authorization
   - Request routing

3. **Microservices**:
   - **Gift Service**: Gift catalog, gift sending logic
   - **Wallet Service**: Balance management, transactions
   - **User Service**: User profiles, XP, levels
   - **Transaction Service**: Orchestrate gift transactions, ensure atomicity
   - **Notification Service**: Push notifications, in-app alerts
   - **Analytics Service**: Logging, metrics, monitoring

4. **Cache Layer (Redis)**:
   - Gift catalog cache (TTL: 5 minutes)
   - User balance cache (TTL: 30 seconds)
   - Session data
   - Rate limiting counters

5. **Database**:
   - Primary DB: Write operations
   - Replica DBs: Read operations (load balancing)
   - Master-slave replication

6. **External Services**:
   - FCM (Firebase Cloud Messaging) for Android push
   - APNs (Apple Push Notification service) for iOS push

---

## 5. Implementation Notes

### 5.1 Transaction Flow (Critical)

Gift sending transaction MUST be atomic và follow ACID principles:

1. **BEGIN TRANSACTION**
2. **Check balance** (SELECT ... FOR UPDATE để lock row)
3. **Validate** gift availability, recipient existence
4. **Deduct balance** from sender
5. **Add contribution** to recipient
6. **Update XP** for both users
7. **Insert transaction record**
8. **COMMIT TRANSACTION**
9. Async: Send notification (không blocking transaction)

Nếu bất kỳ step nào fail → **ROLLBACK** toàn bộ transaction.

---

### 5.2 Error Handling

- Validation errors: Return 400 với chi tiết lỗi
- Insufficient balance: Return 400 với thông tin shortage
- Not found errors: Return 404
- Rate limit: Return 429 với retry_after
- Server errors: Return 500, log error, có thể retry

---

### 5.3 Performance Optimization

- **Cache gift catalog**: Redis, TTL 5 minutes
- **Cache user balance**: Redis, TTL 30 seconds
- **Database indexing**: Ensure proper indexes trên transaction queries
- **Read replicas**: Route read queries to replicas
- **Lazy loading**: Load gifts progressively (pagination)
- **CDN**: Serve gift icons/images từ CDN

---

### 5.4 Security Considerations

- **Server-side validation**: Không trust client
- **Rate limiting**: 10 gifts/minute per user
- **Authentication**: Bearer token required
- **Authorization**: User chỉ có thể gửi gift với balance của mình
- **SQL injection prevention**: Use parameterized queries
- **XSS prevention**: Sanitize user inputs (messages)
- **Audit logging**: Log mọi transaction với IP, user agent

---

### 5.5 Monitoring & Alerting

**Metrics to track**:
- Gift transaction success rate
- Transaction processing time (p50, p95, p99)
- Balance validation failures
- API error rates (4xx, 5xx)
- Cache hit rate
- Database query performance
- Push notification delivery rate

**Alerts**:
- Transaction success rate < 99%
- Transaction processing time > 2s (p95)
- Error rate > 1%
- Database connection pool exhausted
- Cache unavailable

---

## 6. Testing Strategy

### 6.1 Unit Tests

- Gift selection logic
- Quantity calculation
- Balance validation
- Transaction atomicity
- Error handling

### 6.2 Integration Tests

- API endpoints
- Database transactions
- Cache integration
- Notification service integration

### 6.3 E2E Tests

- Complete gift sending flow
- Insufficient balance scenario
- Rate limiting
- Concurrent transactions
- UI interactions

### 6.4 Performance Tests

- Load testing: 100 TPS
- Stress testing: Find breaking point
- Spike testing: Sudden traffic increase
- Endurance testing: Sustained load

---

## 7. Deployment & Rollout

### 7.1 Phased Rollout

1. **Phase 1**: Deploy to staging, internal testing
2. **Phase 2**: Beta release to 5% users
3. **Phase 3**: Gradual rollout to 25%, 50%, 100%
4. **Phase 4**: Monitor metrics, fix issues

### 7.2 Feature Flags

Enable/disable gift feature via feature flag:
- Allows quick rollback nếu có issue
- A/B testing different UI variations

### 7.3 Database Migration

- Add new