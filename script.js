document.addEventListener('DOMContentLoaded', function() {
    
    // --- Global Tab Navigation Logic ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- Data Definitions ---
    const handRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const hPositions4max = ['utg', 'btn', 'sb', 'bb']; // 4-max positions
    const oPositions4max = ['utg', 'btn', 'sb', 'bb']; // Omaha positions

    /**
     * S = Shove / Call Shove (สีแดง)
     * R = Raise (Marginal Shove)
     * L = Limp (Marginal Call)
     * F = Fold (สีเทา)
     */

    // --- (อัปเดต) AoF Hold'em 4-Max Data (Nested by Stack Size) ---
    // *** ค่าประมาณ ***
    const aofHoldemData = {
        '4bb': {
            'open-utg': [ // แคบมาก
                ['S','S','F','F','F','F','F','F','F','F','F','F','F'], // A
                ['S','S','F','F','F','F','F','F','F','F','F','F','F'], // K
                ['F','F','S','F','F','F','F','F','F','F','F','F','F'], // Q
                ['F','F','F','S','F','F','F','F','F','F','F','F','F'], // J
                ['F','F','F','F','S','F','F','F','F','F','F','F','F'], // T
                ['F','F','F','F','F','S','F','F','F','F','F','F','F'], // 9
                ['F','F','F','F','F','F','S','F','F','F','F','F','F'], // 8
                ['F','F','F','F','F','F','F','S','F','F','F','F','F'], // 7
                ['F','F','F','F','F','F','F','F','S','F','F','F','F'], // 6
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'], // 5
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'], // 4
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'], // 3
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']  // 2
            ],
            'open-btn': [ // กว้างขึ้น
                 ['S','S','S','S','S','R','R','L','F','F','F','F','F'],
                 ['S','S','S','S','R','R','L','F','F','F','F','F','F'],
                 ['S','S','S','R','R','L','F','F','F','F','F','F','F'],
                 ['S','R','R','S','R','L','F','F','F','F','F','F','F'],
                 ['R','R','L','R','S','R','L','F','F','F','F','F','F'],
                 ['L','L','F','L','R','S','R','F','F','F','F','F','F'],
                 ['L','F','F','F','L','R','S','R','F','F','F','F','F'],
                 ['L','F','F','F','F','L','R','S','R','F','F','F','F'],
                 ['F','F','F','F','F','F','F','R','S','L','F','F','F'],
                 ['F','F','F','F','F','F','F','F','L','S','L','F','F'],
                 ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
                 ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
                 ['F','F','F','F','F','F','F','F','F','F','F','F','S']
            ],
            'open-sb': [ // กว้างมาก
                ['S','S','S','S','S','S','S','R','R','R','R','R','R'],
                ['S','S','S','S','S','S','R','R','R','R','R','R','R'],
                ['S','S','S','S','S','R','R','R','R','R','R','R','R'],
                ['S','S','S','S','R','R','R','R','R','R','R','R','R'],
                ['S','S','R','R','S','R','R','R','R','R','R','R','L'],
                ['S','R','R','R','R','S','R','R','R','R','R','L','L'],
                ['S','R','R','R','R','R','S','R','R','R','L','L','L'],
                ['R','R','R','R','R','R','R','S','R','R','L','L','L'],
                ['R','R','L','L','L','R','R','R','S','R','L','L','L'],
                ['R','L','L','L','L','L','R','R','R','S','R','L','L'],
                ['R','L','L','L','L','L','L','L','R','R','S','R','L'],
                ['R','L','L','L','L','L','L','L','L','L','R','S','L'],
                ['R','L','L','L','L','L','L','L','L','L','L','L','S']
            ],
            'call-btn-vs-utg': [ // แคบมาก
                ['S','S','F','F','F','F','F','F','F','F','F','F','F'],
                ['S','S','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','S','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','S','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','S','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','S','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F']
            ],
            'call-sb-vs-btn': [ // กว้างกว่า 8bb
                ['S','S','S','S','S','S','R','R','R','R','L','F','F'],
                ['S','S','S','S','S','R','R','R','L','L','F','F','F'],
                ['S','S','S','S','S','R','R','L','L','F','F','F','F'],
                ['S','R','R','S','S','R','R','L','F','F','F','F','F'],
                ['S','R','R','R','S','S','R','L','F','F','F','F','F'],
                ['R','L','L','L','R','S','R','L','F','F','F','F','F'],
                ['L','L','F','F','L','R','S','R','L','F','F','F','F'],
                ['L','F','F','F','F','L','R','S','R','L','F','F','F'],
                ['F','F','F','F','F','F','F','R','S','L','F','F','F'],
                ['F','F','F','F','F','F','F','F','L','S','L','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
            ],
            'call-bb-vs-sb': [ // กว้างมาก
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','R','R','R','R','L'],
                ['S','S','S','S','S','S','S','R','R','R','R','L','L'],
                ['S','S','S','S','S','S','R','R','R','R','L','L','L'],
                ['S','S','R','R','S','S','S','R','R','R','L','L','L'],
                ['S','R','R','R','R','S','S','R','R','L','L','L','L'],
                ['S','R','R','L','L','R','S','R','R','L','L','L','L'],
                ['S','R','L','L','L','L','R','S','R','L','L','L','L'],
                ['S','R','L','L','F','L','L','R','S','R','L','L','L'],
                ['S','R','L','F','F','F','F','L','L','S','R','L','L'],
                ['S','L','F','F','F','F','F','F','F','L','S','L','L'],
                ['S','L','F','F','F','F','F','F','F','F','L','S','L'],
                ['S','L','F','F','F','F','F','F','F','F','F','L','S']
            ],
            // ... (เพิ่ม vs อื่นๆ ถ้าต้องการ)
        },
        '6bb': { // คล้าย 4bb แต่กว้างกว่านิดหน่อย
            'open-utg': [
                ['S','S','S','R','L','F','F','F','F','F','F','F','F'], // A
                ['S','S','R','L','F','F','F','F','F','F','F','F','F'], // K
                ['R','L','S','L','F','F','F','F','F','F','F','F','F'], // Q
                ['L','F','L','S','L','F','F','F','F','F','F','F','F'], // J
                ['L','F','F','L','S','L','F','F','F','F','F','F','F'], // T
                ['F','F','F','F','L','S','L','F','F','F','F','F','F'], // 9
                ['F','F','F','F','F','L','S','L','F','F','F','F','F'], // 8
                ['F','F','F','F','F','F','L','S','F','F','F','F','F'], // 7
                ['F','F','F','F','F','F','F','F','S','F','F','F','F'], // 6
                ['F','F','F','F','F','F','F','F','F','S','F','F','F'], // 5
                ['F','F','F','F','F','F','F','F','F','F','S','F','F'], // 4
                ['F','F','F','F','F','F','F','F','F','F','F','S','F'], // 3
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']  // 2
            ],
            'open-btn': [
                ['S','S','S','S','S','S','R','R','L','L','L','F','F'],
                ['S','S','S','S','S','R','R','L','L','L','F','F','F'],
                ['S','S','S','S','R','R','L','L','L','F','F','F','F'],
                ['S','R','R','S','S','R','R','L','L','F','F','F','F'],
                ['R','R','R','R','S','S','R','R','L','F','F','F','F'],
                ['L','L','L','L','R','S','R','R','L','F','F','F','F'],
                ['L','L','F','F','L','R','S','R','L','F','F','F','F'],
                ['L','F','F','F','F','L','R','S','R','L','F','F','F'],
                ['L','F','F','F','F','F','L','R','S','L','F','F','F'],
                ['L','F','F','F','F','F','F','F','L','S','L','F','F'],
                ['F','F','F','F','F','F','F','F','F','L','S','L','F'],
                ['F','F','F','F','F','F','F','F','F','F','L','S','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
            ],
             'open-sb': [ // เกือบ 100%
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','R'],
                ['S','S','S','S','S','S','S','S','S','S','S','R','R'],
                ['S','S','S','S','S','S','S','S','S','S','R','R','R'],
                ['S','S','S','S','S','S','S','S','S','R','R','R','R'],
                ['S','S','S','S','S','S','S','S','R','R','R','R','R'],
                ['S','S','S','S','S','S','R','S','R','R','R','R','R'],
                ['S','S','S','S','S','R','R','R','S','R','R','R','R'],
                ['S','S','S','S','R','R','R','R','R','S','R','R','R'],
                ['S','S','S','R','R','R','R','R','R','R','S','R','R'],
                ['S','S','R','R','R','R','R','R','R','R','R','S','R'],
                ['S','S','R','R','R','R','R','R','R','R','R','R','S']
            ],
            'call-btn-vs-utg': [ // 77+, A9s+, KTs+, AQo+
                ['S','S','S','S','R','F','F','F','F','F','F','F','F'],
                ['S','S','S','R','F','F','F','F','F','F','F','F','F'],
                ['S','R','S','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','S','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','S','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','S','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','S','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','S','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
            ],
            'call-sb-vs-btn': [ // กว้างกว่า 8bb
                 ['S','S','S','S','S','S','S','R','R','R','L','F','F'],
                 ['S','S','S','S','S','S','R','R','L','L','F','F','F'],
                 ['S','S','S','S','S','R','R','L','L','F','F','F','F'],
                 ['S','R','R','S','S','R','R','L','F','F','F','F','F'],
                 ['S','R','R','R','S','S','R','L','F','F','F','F','F'],
                 ['R','L','L','L','R','S','R','L','F','F','F','F','F'],
                 ['L','L','F','F','L','R','S','R','L','F','F','F','F'],
                 ['L','F','F','F','F','L','R','S','R','L','F','F','F'],
                 ['L','F','F','F','F','F','L','R','S','L','F','F','F'],
                 ['F','F','F','F','F','F','F','L','L','S','L','F','F'],
                 ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
                 ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
                 ['F','F','F','F','F','F','F','F','F','F','F','F','S']
            ],
            'call-bb-vs-sb': [ // กว้างมาก
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','R','R','R','R','L'],
                ['S','S','S','S','S','S','S','R','R','R','R','L','L'],
                ['S','S','S','S','S','S','R','R','R','R','L','L','L'],
                ['S','S','R','R','S','S','S','R','R','R','L','L','L'],
                ['S','R','R','R','R','S','S','R','R','L','L','L','L'],
                ['S','R','R','L','L','R','S','R','R','L','L','L','L'],
                ['S','R','L','L','L','L','R','S','R','L','L','L','L'],
                ['S','R','L','L','F','L','L','R','S','R','L','L','L'],
                ['S','R','L','F','F','F','F','L','L','S','R','L','L'],
                ['S','L','F','F','F','F','F','F','F','L','S','L','L'],
                ['S','L','F','F','F','F','F','F','F','F','L','S','L'],
                ['S','L','F','F','F','F','F','F','F','F','F','L','S']
            ],
             'call-bb-vs-utg': [ // 77+, ATs+, KJs+, AQo+
                ['S','S','S','S','S','F','F','F','F','F','F','F','F'],
                ['S','S','S','R','F','F','F','F','F','F','F','F','F'],
                ['S','R','S','F','F','F','F','F','F','F','F','F','F'],
                ['S','F','F','S','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','S','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','S','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','S','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','S','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F']
            ],
            // ... (เพิ่ม vs อื่นๆ ถ้าต้องการ)
        },
        '8bb': { // Data เดิมจากเวอร์ชันก่อน
            'open-utg': [
                ['S','S','S','S','S','R','R','L','L','L','F','F','F'],
                ['S','S','S','S','R','R','L','F','F','F','F','F','F'],
                ['S','S','S','S','R','R','L','F','F','F','F','F','F'],
                ['S','R','R','S','S','R','L','F','F','F','F','F','F'],
                ['S','R','R','R','S','S','R','L','F','F','F','F','F'],
                ['R','L','L','L','R','S','R','L','F','F','F','F','F'],
                ['L','L','F','F','L','R','S','R','F','F','F','F','F'],
                ['L','F','F','F','F','L','R','S','R','F','F','F','F'],
                ['F','F','F','F','F','F','F','R','S','L','F','F','F'],
                ['F','F','F','F','F','F','F','F','L','S','L','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
            ],
            'open-btn': [
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','R','R','R','R'],
                ['S','S','S','S','S','S','S','S','R','R','R','R','R'],
                ['S','S','S','S','S','S','S','R','R','R','R','R','L'],
                ['S','S','S','R','S','S','S','S','R','R','R','L','L'],
                ['S','S','R','R','R','S','S','S','S','R','R','L','L'],
                ['S','S','R','R','R','R','S','S','S','S','R','L','L'],
                ['S','R','R','R','R','R','R','S','S','S','S','L','L'],
                ['S','R','R','R','R','R','R','R','S','S','S','R','L'],
                ['S','R','R','L','L','R','R','R','R','S','S','S','R'],
                ['S','R','L','L','L','L','L','R','R','R','S','S','R'],
                ['S','R','L','L','L','L','L','L','L','R','R','S','R'],
                ['S','R','L','L','L','L','L','L','L','L','R','R','S']
            ],
            'open-sb': [
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','R'],
                ['S','S','S','S','S','S','S','S','S','S','S','S','R'],
                ['S','S','S','S','S','S','S','S','S','S','S','R','S']
            ],
            'call-btn-vs-utg': [
                ['S','S','S','S','S','F','F','F','F','F','F','F','F'],
                ['S','S','S','S','F','F','F','F','F','F','F','F','F'],
                ['S','S','S','F','F','F','F','F','F','F','F','F','F'],
                ['S','F','F','S','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','S','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','S','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','S','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','S','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F']
            ],
            'call-sb-vs-btn': [
                ['S','S','S','S','S','S','R','R','L','L','F','F','F'],
                ['S','S','S','S','S','R','R','L','F','F','F','F','F'],
                ['S','S','S','S','S','R','L','F','F','F','F','F','F'],
                ['S','R','R','S','S','R','L','F','F','F','F','F','F'],
                ['S','R','R','R','S','S','R','L','F','F','F','F','F'],
                ['R','L','L','L','R','S','R','L','F','F','F','F','F'],
                ['L','L','F','F','L','R','S','R','F','F','F','F','F'],
                ['L','F','F','F','F','L','R','S','R','F','F','F','F'],
                ['F','F','F','F','F','F','F','R','S','L','F','F','F'],
                ['F','F','F','F','F','F','F','F','L','S','L','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
            ],
            'call-bb-vs-sb': [
                ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
                ['S','S','S','S','S','S','S','S','R','R','R','L','F'],
                ['S','S','S','S','S','S','S','R','R','R','L','F','F'],
                ['S','S','S','S','S','S','R','R','R','L','F','F','F'],
                ['S','S','R','R','S','S','S','R','R','L','F','F','F'],
                ['S','R','R','R','R','S','S','R','R','L','F','F','F'],
                ['S','R','R','L','L','R','S','R','R','L','F','F','F'],
                ['S','R','L','L','L','L','R','S','R','L','F','F','F'],
                ['S','R','L','L','F','L','L','R','S','R','L','F','F'],
                ['S','R','L','F','F','F','F','L','L','S','R','F','F'],
                ['S','L','F','F','F','F','F','F','F','L','S','L','F'],
                ['S','L','F','F','F','F','F','F','F','F','L','S','L'],
                ['S','L','F','F','F','F','F','F','F','F','F','L','S']
            ],
            'call-bb-vs-btn': [
                ['S','S','S','S','S','S','R','R','L','L','F','F','F'],
                ['S','S','S','S','S','R','R','L','F','F','F','F','F'],
                ['S','S','S','S','S','R','L','F','F','F','F','F','F'],
                ['S','R','R','S','S','R','L','F','F','F','F','F','F'],
                ['S','R','R','R','S','S','R','L','F','F','F','F','F'],
                ['R','L','L','L','R','S','R','L','F','F','F','F','F'],
                ['L','L','F','F','L','R','S','R','F','F','F','F','F'],
                ['L','F','F','F','F','L','R','S','R','F','F','F','F'],
                ['F','F','F','F','F','F','F','R','S','L','F','F','F'],
                ['F','F','F','F','F','F','F','F','L','S','L','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
            ],
             'call-bb-vs-utg': [
                ['S','S','S','S','S','F','F','F','F','F','F','F','F'],
                ['S','S','S','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','S','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','S','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','S','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','S','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F']
            ],
            'fallback-call': [ // Same as call-bb-vs-utg
                ['S','S','S','S','S','F','F','F','F','F','F','F','F'],
                ['S','S','S','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','S','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','S','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','S','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','S','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F']
            ]
        },
        '10bb': { // กว้างกว่า 8bb เล็กน้อย
             'open-utg': [
                ['S','S','S','S','S','S','R','R','L','L','L','F','F'],
                ['S','S','S','S','S','R','R','L','L','F','F','F','F'],
                ['S','S','S','S','R','R','L','L','F','F','F','F','F'],
                ['S','R','R','S','S','R','R','L','F','F','F','F','F'],
                ['S','R','R','R','S','S','R','R','L','F','F','F','F'],
                ['R','L','L','L','R','S','R','R','L','F','F','F','F'],
                ['L','L','F','F','L','R','S','R','L','F','F','F','F'],
                ['L','F','F','F','F','L','R','S','R','L','F','F','F'],
                ['L','F','F','F','F','F','L','R','S','L','F','F','F'],
                ['L','F','F','F','F','F','F','L','L','S','L','F','F'],
                ['F','F','F','F','F','F','F','F','F','L','S','L','F'],
                ['F','F','F','F','F','F','F','F','F','F','L','S','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
             ],
             // ... (เพิ่ม Open/Call อื่นๆ สำหรับ 10bb)
             'call-bb-vs-sb': [ // แคบกว่า 8bb เล็กน้อย
                ['S','S','S','S','S','S','S','R','R','R','L','L','F'],
                ['S','S','S','S','S','S','R','R','L','L','F','F','F'],
                ['S','S','S','S','S','R','R','L','L','F','F','F','F'],
                ['S','S','R','S','S','R','R','L','F','F','F','F','F'],
                ['S','R','R','R','S','S','R','L','F','F','F','F','F'],
                ['R','L','L','L','R','S','R','L','F','F','F','F','F'],
                ['L','L','F','F','L','R','S','R','F','F','F','F','F'],
                ['L','F','F','F','F','L','R','S','R','F','F','F','F'],
                ['F','F','F','F','F','F','F','R','S','L','F','F','F'],
                ['F','F','F','F','F','F','F','F','L','S','L','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
             ]
        },
         '12bb': { // กว้างกว่า 10bb เล็กน้อย
             'open-utg': [
                 ['S','S','S','S','S','S','R','R','R','L','L','F','F'],
                 ['S','S','S','S','S','S','R','R','L','F','F','F','F'],
                 ['S','S','S','S','S','R','R','L','L','F','F','F','F'],
                 ['S','R','R','S','S','R','R','L','L','F','F','F','F'],
                 ['S','R','R','R','S','S','R','R','L','F','F','F','F'],
                 ['R','L','L','R','R','S','R','R','L','F','F','F','F'],
                 ['R','L','F','L','L','R','S','R','L','F','F','F','F'],
                 ['L','F','F','F','L','L','R','S','R','L','F','F','F'],
                 ['L','F','F','F','F','L','L','R','S','L','F','F','F'],
                 ['L','F','F','F','F','F','L','L','L','S','L','F','F'],
                 ['L','F','F','F','F','F','F','F','F','L','S','L','F'],
                 ['F','F','F','F','F','F','F','F','F','F','L','S','L'],
                 ['F','F','F','F','F','F','F','F','F','F','F','F','S']
             ],
             // ... (เพิ่ม Open/Call อื่นๆ สำหรับ 12bb)
             'call-bb-vs-sb': [ // แคบกว่า 10bb
                ['S','S','S','S','S','S','R','R','L','L','F','F','F'],
                ['S','S','S','S','S','R','R','L','L','F','F','F','F'],
                ['S','S','S','S','S','R','L','L','F','F','F','F','F'],
                ['S','S','R','S','S','R','L','F','F','F','F','F','F'],
                ['S','R','R','R','S','S','R','L','F','F','F','F','F'],
                ['R','L','L','L','R','S','R','L','F','F','F','F','F'],
                ['L','L','F','F','L','R','S','R','F','F','F','F','F'],
                ['L','F','F','F','F','L','R','S','R','F','F','F','F'],
                ['F','F','F','F','F','F','F','R','S','L','F','F','F'],
                ['F','F','F','F','F','F','F','F','L','S','L','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','S']
             ]
         }
        // เติม Fallback สำหรับ Stack ที่ไม่มีข้อมูล
        // (ทำให้ข้อมูล 8bb เป็น default ถ้า stack อื่นไม่มี)
    };
     if (!aofHoldemData['4bb']) aofHoldemData['4bb'] = JSON.parse(JSON.stringify(aofHoldemData['6bb'] || aofHoldemData['8bb'])); // Approx
     if (!aofHoldemData['6bb']) aofHoldemData['6bb'] = JSON.parse(JSON.stringify(aofHoldemData['8bb'])); // Approx
     if (!aofHoldemData['10bb']) aofHoldemData['10bb'] = JSON.parse(JSON.stringify(aofHoldemData['8bb'])); // Approx
     if (!aofHoldemData['12bb']) aofHoldemData['12bb'] = JSON.parse(JSON.stringify(aofHoldemData['10bb'] || aofHoldemData['8bb'])); // Approx

     // Add fallback-call to all stack sizes if missing
     Object.keys(aofHoldemData).forEach(stack => {
         if (!aofHoldemData[stack]['fallback-call']) {
             aofHoldemData[stack]['fallback-call'] = aofHoldemData['8bb']['fallback-call'];
         }
     });


    // --- (อัปเดต) AoF Omaha 4-Max Data (Nested by Stack Size) ---
    // *** ค่าประมาณ ***
    const aofOmahaData = {
        '3bb': {
            'open-utg': [
                'Top 15%: AAxx, KKxx (Any)',
                'Top 15%: QJT9+ (Suited)',
                'Top 15%: A(KQJ)x (Suited A)'
            ],
            'open-btn': [
                'Top 50%: Any Pair 99xx+',
                'Top 50%: Any Suited Ace',
                'Top 50%: Any Rundown (JT98+)',
                'Top 50%: Decent Connectors (8765+)'
            ],
            'open-sb': [
                'Top 80%: Any Ace',
                'Top 80%: Any Pair',
                'Top 80%: Any 4 Connected Cards',
                'Top 80%: Any 3 High Cards Suited'
            ],
             'call-btn-vs-utg': [
                'Top 8%: AAxx (Good)',
                'Top 8%: KKxx (Suited K)',
                'Top 8%: AKQJ ds'
            ],
            'call-sb-vs-btn': [ // Wider than 5bb
                'Top 40%: All AAxx, KKxx, QQxx',
                'Top 40%: Good Suited Aces (A(K,Q,J)xx)',
                'Top 40%: Good Rundowns (QJT9, JT98) (Double suited)',
                'Top 40%: JJxx, TTxx (Suited or ds)'
            ],
            'call-bb-vs-sb': [ // Wider than 5bb
                'Top 65%: All Pairs (77xx+)',
                'Top 65%: All AAxx, KKxx, QQxx, JJxx, TTxx',
                'Top 65%: All Suited Aces',
                'Top 65%: Good Connectors (Double suited or suited)',
                'Top 65%: High Card Hands (KQJx, QJTx, AJTx)'
            ],
            // ... (เพิ่ม vs อื่นๆ)
        },
        '5bb': { // Data เดิม
            'open-utg': [
                'Premium Pairs (AAxx, KKxx) (Double suited or suited Ace)',
                'High Pairs (QQxx, JJxx, TTxx) (Double suited)',
                'Premium Rundowns (KQJT, QJT9, JT98) (Double suited)',
                'Premium Suited Aces (A(K,Q,J)xx) (Double suited Ace)'
            ],
            'open-btn': [
                'All Pairs (AAxx, KKxx, QQxx... 22xx) (Any)',
                'All Suited Aces (Axxx) (Suited Ace)',
                'Good Connectors (KQJT, T987, 8765) (Any suited or double suited)',
                'High Card Hands (KQT, QJ9) (Double suited)'
            ],
            'open-sb': [
                'Any Ace (Axxx)',
                'Any Pair (22xx+)',
                'Any 4 Connected Cards (9876, T876, QJT8)',
                'Any 3 Suited Cards (K,Q,J)s x',
                'Any 4 High Cards (JTxx+)'
            ],
            'call-btn-vs-utg': [
                'Top 10%: AAxx (Good suits)',
                'Top 10%: KKxx (Double suited)',
                'Top 10%: KQJT (Double suited)'
            ],
            'call-sb-vs-btn': [
                'Top 30%: All AAxx, KKxx, QQxx',
                'Top 30%: Good Suited Aces (A(K,Q,J)xx)',
                'Top 30%: Good Rundowns (QJT9, JT98) (Double suited)'
            ],
            'call-bb-vs-sb': [
                'Top 50%: All Pairs (TTxx+)',
                'Top 50%: All AAxx, KKxx, QQxx, JJxx',
                'Top 50%: All Suited Aces',
                'Top 50%: Good Connectors (Double suited or suited)',
                'Top 50%: High Card Hands (KQJx, QJTx)'
            ],
            'call-bb-vs-btn': [
                'Top 25%: AAxx, KKxx, QQxx (Any)',
                'Top 25%: Good Suited Aces (A(K,Q,J)xx)',
                'Top 25%: Premium Rundowns (QJT9, JT98) (Double suited)'
            ],
            'call-bb-vs-utg': [
                'Top 8-10%: AAxx (Good suits)',
                'Top 8-10%: KKxx (Double suited)',
                'Top 8-10%: A(K,Q)J (Double suited)'
            ],
            'call-sb-vs-utg': [
                'Top 10-12%: AAxx (Good suits)',
                'Top 10-12%: KKxx (Double suited)',
                'Top 10-12%: A(K,Q)J (Double suited)'
            ]
        },
        '7bb': { // กว้างกว่า 5bb
            'open-utg': [
                 'Top 25%: AAxx, KKxx, QQxx (Any)',
                 'Top 25%: Good JJxx, TTxx (suited/ds)',
                 'Top 25%: Premium/Good Rundowns (KQJT, QJT9, JT98, T987) (suited/ds)',
                 'Top 25%: Premium/Good Suited Aces (A(K,Q,J,T)xx) (suited A/ds)'
             ],
             'open-btn': [
                 'Top 60%: All Pairs (55xx+)',
                 'Top 60%: All Suited Aces',
                 'Top 60%: All Rundowns (JT98+)',
                 'Top 60%: Good Connectors (T987, 9876, 8765) (suited/ds)',
                 'Top 60%: Suited High Cards (KQT, QJ9, JT8)'
             ],
            'open-sb': [ // เกือบ 100%
                'Any Ace (Axxx)',
                'Any Pair (22xx+)',
                'Any 4 Connected Cards (9876+)',
                'Any 3 Suited Cards',
                'Any 4 High Cards (Txxx+)'
            ],
            'call-btn-vs-utg': [ // แคบกว่า 5bb
                 'Top 8%: AAxx (Good)',
                 'Top 8%: KKxx (Suited K)',
                 'Top 8%: AKQJ ds'
            ],
            'call-sb-vs-btn': [ // แคบกว่า 5bb
                'Top 25%: All AAxx, KKxx, QQxx (Any)',
                'Top 25%: Good Suited Aces (A(K,Q,J)xx)',
                'Top 25%: Premium Rundowns (QJT9, JT98) (Double suited)'
            ],
            'call-bb-vs-sb': [ // แคบกว่า 5bb
                'Top 40%: All Pairs (JJxx+)',
                'Top 40%: All AAxx, KKxx, QQxx',
                'Top 40%: All Suited Aces (Ax+)',
                'Top 40%: Good Connectors (Double suited or suited)',
                'Top 40%: High Card Hands (KQJx, QJTx)'
            ],
             // ... (เพิ่ม vs อื่นๆ)
        }
    };
    
// --- Helper Functions ---
    function getHandName(r, c) {
        if (r === c) return `${handRanks[r]}${handRanks[c]}`; // Pair
        if (r < c) return `${handRanks[r]}${handRanks[c]}s`; // Suited
        return `${handRanks[c]}${handRanks[r]}o`; // Offsuit
    }

    function getHandClass(char) {
        switch(char) {
            case 'S': return 'shove';
            case 'R': return 'raise'; // Use for marginal shove/call
            case 'L': return 'limp';  // Use for marginal call
            default: return 'fold';
        }
    }
    // --- (อัปเดต) Tab 1: AoF Hold'em Logic ---
    const aofHStack = document.getElementById('aof-h-stack'); // (ใหม่)
    const aofHAction = document.getElementById('aof-h-action');
    const aofHPosition = document.getElementById('aof-h-position');
    const aofHVillainGroup = document.getElementById('aof-h-villain-group');
    const aofHVillainPos = document.getElementById('aof-h-villain-pos');
    const aofHGrid = document.getElementById('aof-h-grid');
    const aofHTitle = document.getElementById('aof-h-title');
    const aofHLegend = document.getElementById('aof-h-legend');

    function updateAofHoldemUI() {
        const stack = aofHStack.value; // (ใหม่) อ่านค่า Stack
        const action = aofHAction.value;
        const myPos = aofHPosition.value;
        
        let legendHTML = '';
        
        if (action === 'open') {
            aofHVillainGroup.classList.add('hidden');
            aofHPosition.querySelector('option[value="bb"]').disabled = true;
            if (myPos === 'bb') aofHPosition.value = 'sb'; 
            aofHPosition.querySelector('option[value="utg"]').disabled = false;
            
            legendHTML = `
                <span class="legend-shove">Shove (All-in)</span>
                <span class="legend-raise">Marginal Shove</span>
                <span class="legend-limp">Limp/Fold</span>
                <span class="legend-fold">Fold</span>
            `;
        } else { // 'call'
            aofHVillainGroup.classList.remove('hidden');
            aofHPosition.querySelector('option[value="utg"]').disabled = true;
            if (myPos === 'utg') aofHPosition.value = 'btn'; 
            aofHPosition.querySelector('option[value="bb"]').disabled = false;
            
            aofHVillainPos.innerHTML = '';
            const myPosIndex = hPositions4max.indexOf(aofHPosition.value); 
            for(let i=0; i < myPosIndex; i++) {
                const posName = hPositions4max[i].toUpperCase();
                aofHVillainPos.add(new Option(posName, hPositions4max[i]));
            }
            // Ensure villain dropdown has a selection if options exist
            if (aofHVillainPos.options.length > 0) {
                 aofHVillainPos.selectedIndex = 0; // Select the first available villain
            }
            
            legendHTML = `
                <span class="legend-shove">Call Shove</span>
                <span class="legend-raise">Marginal Call</span>
                <span class="legend-limp">Limp/Fold</span>
                <span class="legend-fold">Fold</span>
            `;
        }
        
        aofHLegend.innerHTML = legendHTML;
        updateAofHoldemGrid();
    }

    function updateAofHoldemGrid() {
        const stack = aofHStack.value; // (ใหม่) อ่านค่า Stack
        const action = aofHAction.value;
        const myPos = aofHPosition.value;
        const villainPos = aofHVillainPos.value; // อ่านค่า villain แม้จะซ่อนอยู่
        
        let key = '';
        let title = '';
        
        // (ใหม่) เลือก data object ตาม stack
        const currentStackData = aofHoldemData[stack] || aofHoldemData['8bb']; // Fallback to 8bb
        const fallbackCallData = currentStackData['fallback-call'] || aofHoldemData['8bb']['fallback-call'];

        if (action === 'open') {
            key = `open-${myPos}`;
            title = `Range: ${stack.toUpperCase()} - Open Shove - ${myPos.toUpperCase()}`;
            // Use fallback if specific open range doesn't exist for this stack
             data = currentStackData[key] || currentStackData['open-btn'] || fallbackCallData;
        } else {
             // Ensure villainPos has a valid value even if hidden
            const actualVillainPos = villainPos || hPositions4max[0]; // Default to UTG if no selection
            key = `call-${myPos}-vs-${actualVillainPos}`;
            title = `Range: ${stack.toUpperCase()} - Call Shove - ${myPos.toUpperCase()} (vs ${actualVillainPos.toUpperCase()})`;

            // Use fallback if specific call range doesn't exist
            data = currentStackData[key] || fallbackCallData;
        }
        
        aofHTitle.textContent = title;
        aofHGrid.innerHTML = ''; // Clear
        
        for (let r = 0; r < 13; r++) {
            const row = aofHGrid.insertRow();
            for (let c = 0; c < 13; c++) {
                const cell = row.insertCell();
                cell.textContent = getHandName(r, c);
                let handType = (data[r] && data[r][c]) ? data[r][c] : 'F';
                cell.className = getHandClass(handType);
            }
        }
    }
    
    // Add event listeners for Hold'em tab
    aofHStack.addEventListener('change', updateAofHoldemUI); // (ใหม่)
    aofHAction.addEventListener('change', updateAofHoldemUI);
    aofHPosition.addEventListener('change', updateAofHoldemUI);
    aofHVillainPos.addEventListener('change', updateAofHoldemGrid); 
    
    // Initial call for Hold'em
    updateAofHoldemUI();


    // --- (อัปเดต) Tab 2: AoF Omaha Logic ---
    const aofOStack = document.getElementById('aof-o-stack'); // (ใหม่)
    const aofOAction = document.getElementById('aof-o-action');
    const aofOPosition = document.getElementById('aof-o-position');
    const aofOVillainGroup = document.getElementById('aof-o-villain-group');
    const aofOVillainPos = document.getElementById('aof-o-villain-pos');
    const aofOBtn = document.getElementById('aof-o-calc-btn');
    const aofOResult = document.getElementById('aof-o-result');
    
    function updateAofOmahaUI() {
        const stack = aofOStack.value; // (ใหม่)
        const action = aofOAction.value;
        const myPos = aofOPosition.value;

        if (action === 'open') {
            aofOVillainGroup.classList.add('hidden');
            aofOPosition.querySelector('option[value="bb"]').disabled = true;
            if (myPos === 'bb') aofOPosition.value = 'sb';
             aofOPosition.querySelector('option[value="utg"]').disabled = false;
        } else { // 'call'
            aofOVillainGroup.classList.remove('hidden');
            aofOPosition.querySelector('option[value="utg"]').disabled = true;
            if (myPos === 'utg') aofOPosition.value = 'btn';
            aofOPosition.querySelector('option[value="bb"]').disabled = false;
            
            aofOVillainPos.innerHTML = '';
            const myPosIndex = oPositions4max.indexOf(aofOPosition.value);
            for(let i=0; i < myPosIndex; i++) {
                const posName = oPositions4max[i].toUpperCase();
                aofOVillainPos.add(new Option(posName, oPositions4max[i]));
            }
             if (aofOVillainPos.options.length > 0) {
                 aofOVillainPos.selectedIndex = 0;
            }
        }
    }
    
    function showOmahaResult() {
        const stack = aofOStack.value; // (ใหม่)
        const action = aofOAction.value;
        const myPos = aofOPosition.value;
        const villainPos = aofOVillainPos.value || oPositions4max[0]; // Fallback villain
        
        let key = '';
        let title = '';
        
        // (ใหม่) เลือก data object ตาม stack
        const currentStackData = aofOmahaData[stack] || aofOmahaData['5bb']; // Fallback to 5bb
        const fallbackCallKey = 'call-btn-vs-utg'; // Fallback แคบสุด

        if (action === 'open') {
            key = `open-${myPos}`;
            title = `Range: ${stack.toUpperCase()} - Open Shove - ${myPos.toUpperCase()}`;
             // Use fallback if specific open range doesn't exist for this stack
            data = currentStackData[key] || currentStackData['open-btn'] || [];
        } else {
            key = `call-${myPos}-vs-${villainPos}`;
            title = `Range: ${stack.toUpperCase()} - Call Shove - ${myPos.toUpperCase()} (vs ${villainPos.toUpperCase()})`;
             // Use fallback if specific call range doesn't exist
            data = currentStackData[key] || currentStackData[fallbackCallKey] || [];
        }
                
        let resultHTML = `<h3>${title}</h3>`;
        if (data.length > 0) {
            resultHTML += '<ul class="omaha-list">';
            data.forEach(handType => {
                const parts = handType.split(': ');
                if(parts.length > 1) {
                    resultHTML += `<li><div class="omaha-list-title">${parts[0]}</div>${parts[1]}</li>`;
                } else {
                    resultHTML += `<li>${handType}</li>`;
                }
            });
            resultHTML += '</ul>';
        } else {
            resultHTML += '<ul class="omaha-list"><li class="fold">ไม่มีข้อมูลสำหรับสถานการณ์นี้ (หรือควร Fold 100%)</li></ul>';
        }
        
        aofOResult.innerHTML = resultHTML;
        aofOResult.style.display = 'block';
    }
    
    // Add event listeners for Omaha tab
    aofOStack.addEventListener('change', updateAofOmahaUI); // (ใหม่)
    aofOAction.addEventListener('change', updateAofOmahaUI);
    aofOPosition.addEventListener('change', updateAofOmahaUI);
    aofOVillainPos.addEventListener('change', showOmahaResult); // Update result on villain change
    aofOBtn.addEventListener('click', showOmahaResult);
    
    // Initial call for Omaha
    updateAofOmahaUI();
    
});