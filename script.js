// Variabel Global
let currentScore = 0;
let currentStars = 0;
let currentLevel = 1;
let badges = [];

// Data Game dengan GAMBAR dari assets
const gameLevels = {
    1: { // Sapi - Menghitung
        type: 'count',
        animal: 'sapi',
        question: 'Ada berapakah jumlah sapi di atas?',
        count: 6,
        options: [1,2,3,4,5,6],
        image: 'cow (1).png', 
        sound: 'sapi'
    },
    2: { // Katak - Mencocokkan Warna
        type: 'color',
        animal: 'katak',
        question: 'Apa warna katak?',
        colors: [
            { name: 'hijau', bg: '#2ECC71' },
            { name: 'coklat', bg: '#8B4513' },
            { name: 'kuning', bg: '#F1C40F' }
        ],
        correctColor: 'hijau',
        image: 'frog (1).png',
        sound: 'katak'
    },
    3: { // Gajah - Mencocokkan Warna
        type: 'color',
        animal: 'gajah',
        question: 'Apa warna gajah?',
        colors: [
            { name: 'abu-abu', bg: '#808080' },
            { name: 'coklat', bg: '#8B4513' },
            { name: 'putih', bg: '#FFFFFF' }
        ],
        correctColor: 'abu-abu',
        image: 'elephant (1).png',
        sound: 'gajah'
    },
    4: { // Kambing - Menghitung
        type: 'count',
        animal: 'kambing',
        question: 'Ada berapakah jumlah kambing di atas?',
        count: 2,
        options: [1,2,3,4,5,6],
        image: 'goat (1).png',
        sound: 'kambing'
    },
    5: { // Jerapah - Bagian Tubuh
        type: 'body',
        animal: 'jerapah',
        question: 'Apa bagian tubuh jerapah yang panjang?',
        bodyParts: ['Leher', 'Ekor', 'Kaki'],
        correct: 'Leher',
        image: 'giraffe (1).png',
        sound: 'jerapah'
    },
    6: { // Singa - Bagian Tubuh
        type: 'body',
        animal: 'singa',
        question: 'Apa bagian tubuh singa yang lebat?',
        bodyParts: ['Bulu Kepala', 'Kaki', 'Ekor'],
        correct: 'Bulu Kepala',
        image: 'lion (1).png',
        sound: 'singa'
    },
    7: { // Rubah - Bagian Tubuh
        type: 'body',
        animal: 'rubah',
        question: 'Apa bagian tubuh rubah yang lebat?',
        bodyParts: ['Ekor', 'Telinga', 'Hidung'],
        correct: 'Ekor',
        image: 'fox (1).png',
        sound: 'rubah'
    }
};

// ========== FUNGSI AUDIO MENGGUNAKAN FILE MP3 ==========
        function playSound(animal) {
            let audioId;
            
            switch(animal) {
                case 'sapi': audioId = 'soundSapi'; break;
                case 'kambing': audioId = 'soundKambing'; break;
                case 'katak': audioId = 'soundKatak'; break;
                case 'gajah': audioId = 'soundGajah'; break;
                case 'jerapah': audioId = 'soundJerapah'; break;
                case 'singa': audioId = 'soundSinga'; break;
                case 'rubah': audioId = 'soundRubah'; break;
                case 'applause': audioId = 'soundApplause'; break;
                case 'sad': audioId = 'soundSad'; break;
                default: return;
            }
            
            const audio = document.getElementById(audioId);
            if (audio) {
                audio.currentTime = 0; // Reset ke awal
                audio.play().catch(e => {
                    console.log('Error memutar audio:', e);
                    // Fallback notifikasi
                    showNotification(`🔊 Memainkan suara ${animal}`);
                });
            }
        }

        // Fungsi notifikasi sementara
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.background = '#FF9F1C';
            notification.style.color = 'white';
            notification.style.padding = '15px 30px';
            notification.style.borderRadius = '50px';
            notification.style.fontSize = '1.5rem';
            notification.style.zIndex = '2000';
            notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 1500);
        }

        // Fungsi Memulai Game
        function startGame() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('gamePage').style.display = 'block';
            
            // Set display name
            const randomNames = ['Teman Hebat', 'Adik Pintar', 'Sahabat Ceria', 'Anak Baik'];
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
            document.getElementById('displayName').textContent = `Halo, ${randomName}!`;
            
            // Load data dari localStorage
            loadFromStorage();
            
            // Tampilkan level 1
            changeLevel(1);
        }

        // Fungsi Logout
        function logout() {
            document.getElementById('gamePage').style.display = 'none';
            document.getElementById('loginPage').style.display = 'block';
        }

        // Fungsi Ganti Level
        function changeLevel(level) {
            currentLevel = level;
            
            // Update active button
            document.querySelectorAll('.level-btn').forEach((btn, index) => {
                if (index === level - 1) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Load game untuk level ini
            loadGameLevel(level);
        }

        // Fungsi Load Game Level dengan GAMBAR
        function loadGameLevel(level) {
            const gameData = gameLevels[level];
            const gameArea = document.getElementById('gameArea');
            
            let html = '';
            
            if (gameData.type === 'count') {
                // Game Menghitung dengan GAMBAR
                html = `
                    <div class="question-text">${gameData.question}</div>
                    <div class="animal-grid">
                        ${Array(gameData.count).fill(`
                            <div class="animal-card" onclick="playSound('${gameData.sound}')">
                                <img src="img/${gameData.image}" 
                                    alt="${gameData.animal}"
                                    onerror="this.src='https://via.placeholder.com/100?text=${gameData.animal}'">
                                <span class="sound-icon">🔊 Klik gambar</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="options-container">
                        ${gameData.options.map(opt => `
                            <button class="option-btn" onclick="checkAnswer(${level}, ${opt})">${opt}</button>
                        `).join('')}
                    </div>
                `;
            } else if (gameData.type === 'color') {
                // Game Mencocokkan Warna dengan GAMBAR
                html = `
                    <div class="question-text">${gameData.question}</div>
                    <div class="animal-card" style="margin: 0 auto; max-width: 250px;" onclick="playSound('${gameData.sound}')">
                        <img src="img/${gameData.image}" 
                            alt="${gameData.animal}"
                            style="width: 150px; height: 150px; object-fit: contain;"
                            onerror="this.src='https://via.placeholder.com/150?text=${gameData.animal}'">
                        <span class="animal-name">${gameData.animal}</span>
                        <span class="sound-icon">🔊 Klik gambar</span>
                    </div>
                    <div class="color-options">
                        ${gameData.colors.map(color => `
                            <div class="color-picker" style="background-color: ${color.bg};" 
                                onclick="checkColor(${level}, '${color.name}')" title="${color.name}"></div>
                        `).join('')}
                    </div>
                `;
            } else if (gameData.type === 'body') {
                // Game Bagian Tubuh dengan GAMBAR
                html = `
                    <div class="question-text">${gameData.question}</div>
                    <div class="animal-card" style="margin: 0 auto; max-width: 250px;" onclick="playSound('${gameData.sound}')">
                        <img src="img/${gameData.image}" 
                            alt="${gameData.animal}"
                            style="width: 150px; height: 150px; object-fit: contain;"
                            onerror="this.src='https://via.placeholder.com/150?text=${gameData.animal}'">
                        <span class="animal-name">${gameData.animal}</span>
                        <span class="sound-icon">🔊 Klik gambar</span>
                    </div>
                    <div class="body-parts">
                        ${gameData.bodyParts.map(part => `
                            <button class="body-btn" onclick="checkBodyPart(${level}, '${part}')">${part}</button>
                        `).join('')}
                    </div>
                `;
            }
            
            gameArea.innerHTML = html;
            document.getElementById('feedbackArea').innerHTML = '';
        }

        // Fungsi Cek Jawaban Menghitung
        function checkAnswer(level, answer) {
            const gameData = gameLevels[level];
            const feedback = document.getElementById('feedbackArea');
            
            if (answer === gameData.count) {
                // Jawaban benar
                feedback.innerHTML = '✨🎉 HORE! Jawaban kamu benar! 🎉✨';
                feedback.className = 'feedback-area correct';
                
                // Tambah skor
                currentScore += 10;
                updateScore();
                
                // Mainkan suara
                playSound('applause');
                
                // Tampilkan reward
                showReward('Benar! +10 Poin ⭐');
                
                // Cek pencapaian
                checkAchievements();
            } else {
                // Jawaban salah
                feedback.innerHTML = '😢 Aduh, kurang tepat. Yuk coba lagi!';
                feedback.className = 'feedback-area wrong';
                playSound('sad');
            }
        }

        // Fungsi Cek Warna
        function checkColor(level, color) {
            const gameData = gameLevels[level];
            const feedback = document.getElementById('feedbackArea');
            
            if (color === gameData.correctColor) {
                feedback.innerHTML = '✅ Wah hebat! Warna nya tepat!';
                feedback.className = 'feedback-area correct';
                
                currentScore += 5;
                updateScore();
                playSound('applause');
                showReward('Warna tepat! +5 Poin ⭐');
                checkAchievements();
            } else {
                feedback.innerHTML = '❌ Coba pilih warna yang lain ya!';
                feedback.className = 'feedback-area wrong';
                playSound('sad');
            }
        }

        // Fungsi Cek Bagian Tubuh
        function checkBodyPart(level, part) {
            const gameData = gameLevels[level];
            const feedback = document.getElementById('feedbackArea');
            
            if (part === gameData.correct) {
                feedback.innerHTML = '✅ Pintar! Kamu benar!';
                feedback.className = 'feedback-area correct';
                
                currentScore += 8;
                updateScore();
                playSound('applause');
                showReward('Tepat sekali! +8 Poin ⭐');
                checkAchievements();
            } else {
                feedback.innerHTML = '❌ Bukan itu, coba lihat lagi yuk!';
                feedback.className = 'feedback-area wrong';
                playSound('sad');
            }
        }

        // Fungsi Update Skor
        function updateScore() {
            document.getElementById('scoreDisplay').textContent = currentScore;
            saveToStorage();
        }

        // Fungsi Tambah Bintang
        function addStar(starNumber) {
            const stars = document.querySelectorAll('.star');
            currentStars = starNumber;
            
            for (let i = 0; i < stars.length; i++) {
                if (i < starNumber) {
                    stars[i].classList.add('active');
                } else {
                    stars[i].classList.remove('active');
                }
            }
            
            saveToStorage();
        }

        // Fungsi Tampilkan Reward
        function showReward(message) {
            const reward = document.getElementById('rewardPopup');
            document.getElementById('rewardText').textContent = message;
            reward.classList.remove('hidden');
            
            setTimeout(() => {
                reward.classList.add('hidden');
            }, 1500);
        }

        // Fungsi Cek Pencapaian
        function checkAchievements() {
            // Lencana Skor 50
            if (currentScore >= 50 && !badges.includes('Skor 50')) {
                addBadge('🏅 Skor 50', 'badge_score_50');
            }
            
            // Lencana Skor 100
            if (currentScore >= 100 && !badges.includes('Skor 100')) {
                addBadge('🏆 Skor 100', 'badge_score_100');
            }
            
            // Lencana Bintang 5
            if (currentStars >= 5 && !badges.includes('Bintang 5')) {
                addBadge('⭐ Bintang 5', 'badge_stars_5');
            }
        }

        // Fungsi Tambah Lencana
        function addBadge(badgeName, badgeKey) {
            if (badges.includes(badgeName)) return;
            
            badges.push(badgeName);
            
            const container = document.getElementById('badgesContainer');
            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge';
            badgeEl.innerHTML = `🏅 ${badgeName}`;
            container.appendChild(badgeEl);
            
            // Animasi
            badgeEl.style.animation = 'bounce 0.5s';
            
            // Simpan
            saveToStorage();
            
            // Notifikasi
            showReward(`🎉 Dapat Lencana: ${badgeName}`);
        }

        // Fungsi Simpan ke localStorage
        function saveToStorage() {
            const gameData = {
                score: currentScore,
                stars: currentStars,
                badges: badges
            };
            
            localStorage.setItem('funAnimalKingdom', JSON.stringify(gameData));
        }

        // Fungsi Load dari localStorage
        function loadFromStorage() {
            const saved = localStorage.getItem('funAnimalKingdom');
            if (saved) {
                const data = JSON.parse(saved);
                currentScore = data.score || 0;
                currentStars = data.stars || 0;
                badges = data.badges || [];
                
                document.getElementById('scoreDisplay').textContent = currentScore;
                addStar(currentStars);
                
                // Load badges
                const container = document.getElementById('badgesContainer');
                container.innerHTML = '';
                badges.forEach(badge => {
                    const badgeEl = document.createElement('div');
                    badgeEl.className = 'badge';
                    badgeEl.innerHTML = `🏅 ${badge}`;
                    container.appendChild(badgeEl);
                });
            }
        }

        // Inisialisasi saat halaman dimuat
        document.addEventListener('DOMContentLoaded', function() {
            // Load data dari localStorage
            loadFromStorage();
        });

