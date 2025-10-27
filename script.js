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
    const handRanksMap = { A: 0, K: 1, Q: 2, J: 3, T: 4, '9': 5, '8': 6, '7': 7, '6': 8, '5': 9, '4': 10, '3': 11, '2': 12 };
    const hPositions4max = ['utg', 'btn', 'sb', 'bb']; // 4-max positions
    const oPositions4max = ['utg', 'btn', 'sb', 'bb']; // Omaha positions

    /**
     * S = Shove / Call Shove (สีแดง)
     * R = Raise (Marginal Shove)
     * L = Limp (Marginal Call)
     * F = Fold (สีเทา)
     */

    // --- AoF Hold'em 4-Max Data (Nested by Stack Size) ---
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
             'call-bb-vs-btn': [ // กว้างกว่า 8bb
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
             'call-bb-vs-utg': [ // 66+, A8s+, KTs+, QJs, ATo+, KQo
                ['S','S','S','S','F','F','F','R','L','F','F','F','F'],
                ['S','S','S','R','F','F','F','F','F','F','F','F','F'],
                ['S','R','S','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','S','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','S','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','S','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','S','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','S','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','S','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                ['F','F','F','F','F','F','F','F','F','F','F','F','F']
             ],
            // ... (เพิ่ม vs อื่นๆ ถ้าต้องการ)
             'fallback-call': [ // Same as call-bb-vs-utg
                 ['S','S','S','S','F','F','F','R','L','F','F','F','F'],
                 ['S','S','S','R','F','F','F','F','F','F','F','F','F'],
                 ['S','R','S','F','F','F','F','F','F','F','F','F','F'],
                 ['F','F','F','S','F','F','F','F','F','F','F','F','F'],
                 ['F','F','F','F','S','F','F','F','F','F','F','F','F'],
                 ['F','F','F','F','F','S','F','F','F','F','F','F','F'],
                 ['F','F','F','F','F','F','S','F','F','F','F','F','F'],
                 ['F','F','F','F','F','F','F','S','F','F','F','F','F'],
                 ['F','F','F','F','F','F','F','F','S','F','F','F','F'],
                 ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                 ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                 ['F','F','F','F','F','F','F','F','F','F','F','F','F'],
                 ['F','F','F','F','F','F','F','F','F','F','F','F','F']
             ]
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
             'fallback-call': [ // Same as call-bb-vs-utg
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
             ]
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
             ],
             'fallback-call': [ // Same as 8bb
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
             ],
              'fallback-call': [ // Same as 8bb
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
         }
    };
    // Fill missing stack data with 8bb data as fallback (simple approach)
     ['4bb', '6bb', '10bb', '12bb'].forEach(stack => {
         if (!aofHoldemData[stack]) aofHoldemData[stack] = {}; // Ensure stack exists
         Object.keys(aofHoldemData['8bb']).forEach(key => {
             if (!aofHoldemData[stack][key]) {
                 aofHoldemData[stack][key] = aofHoldemData['8bb'][key]; // Copy 8bb data
             }
         });
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
             'call-bb-vs-btn': [ // Wider than 5bb
                'Top 35%: All AAxx, KKxx, QQxx, JJxx',
                'Top 35%: Good Suited Aces (A(K,Q,J,T)xx)',
                'Top 35%: Premium/Good Rundowns (QJT9, JT98) (ds/suited)'
            ],
             'call-bb-vs-utg': [ // Wider than 5bb
                'Top 15%: AAxx, KKxx (Any)',
                'Top 15%: QQxx (ds/suited)',
                'Top 15%: AKQJ (ds/suited)'
            ],
             'call-sb-vs-utg': [ // Wider than 5bb
                'Top 18%: AAxx, KKxx (Any)',
                'Top 18%: QQxx (ds/suited)',
                'Top 18%: AKQJ, AQJT (ds/suited)'
            ],
        },
        '5bb': { // Data เดิม
            'open-utg': [
                'Top 20%: Premium Pairs (AAxx, KKxx) (Double suited or suited Ace)',
                'Top 20%: High Pairs (QQxx, JJxx, TTxx) (Double suited)',
                'Top 20%: Premium Rundowns (KQJT, QJT9, JT98) (Double suited)',
                'Top 20%: Premium Suited Aces (A(K,Q,J)xx) (Double suited Ace)'
            ],
            'open-btn': [
                'Top 55-60%: All Pairs (AAxx, KKxx, QQxx... 22xx) (Any)',
                'Top 55-60%: All Suited Aces (Axxx) (Suited Ace)',
                'Top 55-60%: Good Connectors (KQJT, T987, 8765) (Any suited or double suited)',
                'Top 55-60%: High Card Hands (KQT, QJ9) (Double suited)'
            ],
            'open-sb': [
                 'Top 85-90%: Any Ace (Axxx)',
                 'Top 85-90%: Any Pair (22xx+)',
                 'Top 85-90%: Any 4 Connected Cards (9876, T876, QJT8)',
                 'Top 85-90%: Any 3 Suited Cards (K,Q,J)s x',
                 'Top 85-90%: Any 4 High Cards (JTxx+)'
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
                 'Top 25-30%: AAxx, KKxx, QQxx (Any)',
                 'Top 25-30%: Good JJxx, TTxx (suited/ds)',
                 'Top 25-30%: Premium/Good Rundowns (KQJT, QJT9, JT98, T987) (suited/ds)',
                 'Top 25-30%: Premium/Good Suited Aces (A(K,Q,J,T)xx) (suited A/ds)'
             ],
             'open-btn': [
                 'Top 65-70%: All Pairs (55xx+)',
                 'Top 65-70%: All Suited Aces',
                 'Top 65-70%: All Rundowns (JT98+)',
                 'Top 65-70%: Good Connectors (T987, 9876, 8765) (suited/ds)',
                 'Top 65-70%: Suited High Cards (KQT, QJ9, JT8)'
             ],
            'open-sb': [ // เกือบ 100%
                'Top 95%+: Any Ace (Axxx)',
                'Top 95%+: Any Pair (22xx+)',
                'Top 95%+: Any 4 Connected Cards (9876+)',
                'Top 95%+: Any 3 Suited Cards',
                'Top 95%+: Any 4 High Cards (Txxx+)'
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
             'call-bb-vs-btn': [ // แคบกว่า 5bb
                 'Top 20%: AAxx, KKxx (Any)',
                 'Top 20%: QQxx (ds/suited)',
                 'Top 20%: Good Suited Aces (A(K,Q)xx)',
                 'Top 20%: Premium Rundowns (KQJT, QJT9) (ds)'
             ],
             'call-bb-vs-utg': [ // แคบกว่า 5bb
                 'Top 6-8%: AAxx (Good)',
                 'Top 6-8%: KKxx (ds/suited K)',
                 'Top 6-8%: AKQJ ds'
             ],
             'call-sb-vs-utg': [ // แคบกว่า 5bb
                 'Top 8-10%: AAxx (Good)',
                 'Top 8-10%: KKxx (ds/suited K)',
                 'Top 8-10%: AKQJ ds'
             ],
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
    // --- End Helper Functions ---
    // (ใหม่) Function to parse hand input
    function parseHand(handString) {
        if (!handString || handString.length < 2 || handString.length > 3) return null;
        
        handString = handString.toUpperCase().trim();
        const r1 = handString[0];
        const r2 = handString[1];
        
        if (!handRanksMap.hasOwnProperty(r1) || !handRanksMap.hasOwnProperty(r2)) return null;

        const idx1 = handRanksMap[r1];
        const idx2 = handRanksMap[r2];

        let type = '';
        if (handString.length === 3) {
            type = handString[2];
        }

        if (idx1 === idx2) { // Pair
            return { row: idx1, col: idx2, type: 'pair' };
        } else if (type === 'S') { // Suited
            return { row: Math.min(idx1, idx2), col: Math.max(idx1, idx2), type: 'suited' };
        } else if (type === 'O' || handString.length === 2) { // Offsuit
             return { row: Math.max(idx1, idx2), col: Math.min(idx1, idx2), type: 'offsuit' };
        }
        
        return null; // Invalid format
    }

    
    // --- (อัปเดต) Tab 1: AoF Hold'em Logic ---
    const aofHStack = document.getElementById('aof-h-stack'); 
    const aofHAction = document.getElementById('aof-h-action');
    const aofHPosition = document.getElementById('aof-h-position');
    const aofHVillainGroup = document.getElementById('aof-h-villain-group');
    const aofHVillainPos = document.getElementById('aof-h-villain-pos');
    const aofHHandInput = document.getElementById('aof-h-hand'); // (ใหม่)
    const aofHEvaluateBtn = document.getElementById('aof-h-evaluate-btn'); // (ใหม่)
    const aofHRecommendation = document.getElementById('aof-h-recommendation'); // (ใหม่)
    const aofHGrid = document.getElementById('aof-h-grid');
    const aofHTitle = document.getElementById('aof-h-title');
    const aofHLegend = document.getElementById('aof-h-legend');

    let currentHoldemRangeData = []; // Store current grid data

    function updateAofHoldemUI() {
        const stack = aofHStack.value; 
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
            if (aofHVillainPos.options.length > 0) {
                 aofHVillainPos.selectedIndex = 0; 
            }
            
            legendHTML = `
                <span class="legend-shove">Call Shove</span>
                <span class="legend-raise">Marginal Call</span>
                <span class="legend-limp">Limp/Fold</span>
                <span class="legend-fold">Fold</span>
            `;
        }
        
        aofHLegend.innerHTML = legendHTML;
        // Hide recommendation initially when UI changes
        aofHRecommendation.style.display = 'none'; 
        aofHHandInput.value = ''; // Clear hand input
        updateAofHoldemGrid();
    }

    function updateAofHoldemGrid() {
        const stack = aofHStack.value; 
        const action = aofHAction.value;
        const myPos = aofHPosition.value;
        const villainPos = aofHVillainPos.value; 
        
        let key = '';
        let title = '';
        
        const currentStackData = aofHoldemData[stack] || aofHoldemData['8bb']; 
        const fallbackCallData = currentStackData['fallback-call'] || aofHoldemData['8bb']['fallback-call'];
        const fallbackOpenData = currentStackData['open-btn'] || aofHoldemData['8bb']['open-btn'];

        if (action === 'open') {
            key = `open-${myPos}`;
            title = `Range: ${stack.toUpperCase()} - Open Shove - ${myPos.toUpperCase()}`;
            currentHoldemRangeData = currentStackData[key] || fallbackOpenData; // Store current data
        } else {
            const actualVillainPos = villainPos || hPositions4max[0]; 
            key = `call-${myPos}-vs-${actualVillainPos}`;
            title = `Range: ${stack.toUpperCase()} - Call Shove - ${myPos.toUpperCase()} (vs ${actualVillainPos.toUpperCase()})`;
            currentHoldemRangeData = currentStackData[key] || fallbackCallData; // Store current data
        }
        
        const data = currentHoldemRangeData; // Use stored data
        
        aofHTitle.textContent = title;
        aofHGrid.innerHTML = ''; // Clear
        
        // Remove previous highlights
        const highlighted = aofHGrid.querySelector('.highlight');
        if(highlighted) highlighted.classList.remove('highlight');
        
        for (let r = 0; r < 13; r++) {
            const row = aofHGrid.insertRow();
            for (let c = 0; c < 13; c++) {
                const cell = row.insertCell();
                cell.textContent = getHandName(r, c);
                // Assign row and col data attributes for easy selection
                cell.dataset.row = r;
                cell.dataset.col = c;
                let handType = (data[r] && data[r][c]) ? data[r][c] : 'F';
                cell.className = getHandClass(handType);
            }
        }
        // Hide recommendation when grid updates without hand evaluation
        if (document.activeElement !== aofHEvaluateBtn) {
             aofHRecommendation.style.display = 'none';
        }
    }
    
    // (ใหม่) Function to evaluate hand and show recommendation
    function evaluateHoldemHand() {
        const handString = aofHHandInput.value;
        const parsedHand = parseHand(handString);
        const action = aofHAction.value; // 'open' or 'call'

        // Clear previous highlights first
        const highlighted = aofHGrid.querySelector('.highlight');
        if(highlighted) highlighted.classList.remove('highlight');
        
        if (!parsedHand) {
            aofHRecommendation.innerHTML = `<p class="action-fold">รูปแบบไพ่ไม่ถูกต้อง (เช่น AKs, 77, T9o)</p>`;
            aofHRecommendation.style.display = 'block';
            return;
        }

        const { row, col } = parsedHand;
        
        // Ensure grid data is up to date before getting hand type
        // updateAofHoldemGrid(); // Re-drawing grid might remove highlight target
        const handType = (currentHoldemRangeData[row] && currentHoldemRangeData[row][col]) ? currentHoldemRangeData[row][col] : 'F';
        
        let recommendationHTML = '';
        let actionText = '';
        let actionClass = '';
        
        // Determine recommendation based on handType and action context
        if (action === 'open') {
            if (handType === 'S' || handType === 'R') { // S=Shove, R=Marginal Shove
                actionText = "SHOVE (All-in)";
                actionClass = "action-shove";
            } else { // L=Limp/Fold, F=Fold
                actionText = "FOLD";
                actionClass = "action-fold";
            }
        } else { // action === 'call'
             if (handType === 'S' || handType === 'R') { // S=Call, R=Marginal Call
                actionText = "CALL";
                actionClass = "action-call";
            } else { // L=Fold, F=Fold
                actionText = "FOLD";
                actionClass = "action-fold";
            }
        }

        recommendationHTML = `
            <p class="${actionClass}">${actionText}</p>
            <p class="action-details">สำหรับไพ่ ${handString.toUpperCase()} ในสถานการณ์นี้</p>
        `;
        
        aofHRecommendation.innerHTML = recommendationHTML;
        aofHRecommendation.style.display = 'block';

        // Highlight the cell
        const targetCell = aofHGrid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if(targetCell) {
            targetCell.classList.add('highlight');
        }
    }

    // Add event listeners for Hold'em tab
    aofHStack.addEventListener('change', updateAofHoldemUI); 
    aofHAction.addEventListener('change', updateAofHoldemUI);
    aofHPosition.addEventListener('change', updateAofHoldemUI);
    aofHVillainPos.addEventListener('change', () => {
         aofHRecommendation.style.display = 'none'; // Hide rec on villain change
         aofHHandInput.value = ''; // Clear hand
         updateAofHoldemGrid();
    });
    aofHEvaluateBtn.addEventListener('click', evaluateHoldemHand); // (ใหม่) Evaluate button
    // (ใหม่) Evaluate on Enter key in hand input
    aofHHandInput.addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission if any
            evaluateHoldemHand();
        }
    });

    
    // Initial call for Hold'em
    updateAofHoldemUI();


    // --- (อัปเดต) Tab 2: AoF Omaha Logic ---
    const aofOStack = document.getElementById('aof-o-stack'); 
    const aofOAction = document.getElementById('aof-o-action');
    const aofOPosition = document.getElementById('aof-o-position');
    const aofOVillainGroup = document.getElementById('aof-o-villain-group');
    const aofOVillainPos = document.getElementById('aof-o-villain-pos');
    const aofOBtn = document.getElementById('aof-o-calc-btn');
    const aofOResult = document.getElementById('aof-o-result');
    
    function updateAofOmahaUI() {
        const stack = aofOStack.value; 
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
        // Clear result when UI changes
        aofOResult.style.display = 'none'; 
    }
    
    function showOmahaResult() {
        const stack = aofOStack.value; 
        const action = aofOAction.value;
        const myPos = aofOPosition.value;
        const villainPos = aofOVillainPos.value || oPositions4max[0]; 
        
        let key = '';
        let title = '';
        
        const currentStackData = aofOmahaData[stack] || aofOmahaData['5bb']; 
        const fallbackCallKey = 'call-btn-vs-utg'; 
        const fallbackOpenKey = 'open-btn';

        if (action === 'open') {
            key = `open-${myPos}`;
            title = `Range: ${stack.toUpperCase()} - Open Shove - ${myPos.toUpperCase()}`;
            data = currentStackData[key] || currentStackData[fallbackOpenKey] || [];
        } else {
            key = `call-${myPos}-vs-${villainPos}`;
            title = `Range: ${stack.toUpperCase()} - Call Shove - ${myPos.toUpperCase()} (vs ${villainPos.toUpperCase()})`;
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
    aofOStack.addEventListener('change', updateAofOmahaUI); 
    aofOAction.addEventListener('change', updateAofOmahaUI);
    aofOPosition.addEventListener('change', updateAofOmahaUI);
    aofOVillainPos.addEventListener('change', () => { aofOResult.style.display = 'none'; }); // Hide result on villain change
    aofOBtn.addEventListener('click', showOmahaResult);
    
    // Initial call for Omaha
    updateAofOmahaUI();
    
});