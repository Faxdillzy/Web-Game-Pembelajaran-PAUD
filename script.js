// Variabel Global
        let currentScore = 0;
        let currentStars = 0;
        let currentLevel = 1;
        let badges = [];

        // Data Game //
        const gameLevels = {
            1: { // Sapi - Menghitung
                type: 'count',
                animal: 'Sapi',
                question: 'Ada berapakah jumlah sapi di atas?',
                count: 6,
                options: [1,2,3,4,5,6],
                image: 'cow (1).png',
                sound: 'sapi'
            },
            2: { // Katak - Mencocokkan Warna
                type: 'color',
                animal: 'Katak',
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
                animal: 'Gajah',
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
                animal: 'Kambing',
                question: 'Ada berapakah jumlah kambing di atas?',
                count: 2,
                options: [1,2,3,4,5,6],
                image: 'goat (1).png',
                sound: 'kambing'
            },
            5: { // Jerapah - Bagian Tubuh
                type: 'body',
                animal: 'Jerapah',
                question: 'Apa bagian tubuh jerapah yang panjang?',
                bodyParts: ['Leher', 'Ekor', 'Kaki'],
                correct: 'Leher',
                image: 'giraffe (1).png',
                sound: 'jerapah'
            },
            6: { // Singa - Bagian Tubuh
                type: 'body',
                animal: 'Singa',
                question: 'Apa bagian tubuh singa yang lebat?',
                bodyParts: ['Bulu Kepala', 'Kaki', 'Ekor'],
                correct: 'Bulu Kepala',
                image: 'lion (1).png',
                sound: 'singa'
            },
            7: { // Rubah - Bagian Tubuh
                type: 'body',
                animal: 'Rubah',
                question: 'Apa bagian tubuh rubah yang lebat?',
                bodyParts: ['Ekor', 'Telinga', 'Hidung'],
                correct: 'Ekor',
                image: 'fox (1).png',
                sound: 'rubah'
            },
            8: { // Habitat Alam
                type: 'habitat',
                habitatType: 'alam',
                habitatName: 'Alam',
                habitatImage: 'forest (1).png',
                question: 'Hewan yang hidup di habitat ALAM?',
                animals: [
                    { name: 'Elang', file: 'eagle (1).png', sound: 'elang', correct: true },
                    { name: 'Ayam', file: 'chicken (1).png', sound: 'ayam', correct: true },
                    { name: 'Ikan', file: 'fish.png', sound: 'ikan', correct: false }
                ]
            },
            9: { // Habitat Air
                type: 'habitat',
                habitatType: 'air',
                habitatName: 'Air',
                habitatImage: 'beach.png',
                question: 'Hewan yang hidup di habitat AIR?',
                animals: [
                    { name: 'Ikan', file: 'fish.png', sound: 'ikan', correct: true },
                    { name: 'Ayam', file: 'chicken (1).png', sound: 'ayam', correct: false },
                    { name: 'Elang', file: 'eagle (1).png', sound: 'elang', correct: false }
                ]
            }
        };

        // ========== FUNGSI AUDIO ========== //
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
                case 'elang': audioId = 'soundElang'; break;
                case 'ayam': audioId = 'soundAyam'; break;
                case 'ikan': audioId = 'soundIkan'; break;
                case 'applause': audioId = 'soundApplause'; break;
                case 'sad': audioId = 'soundSad'; break;
                default: return;
            }
            const audio = document.getElementById(audioId);
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log('Error audio:', e));
            }
        }

        // ========== FUNGSI UTAMA ========== //
        function startGame() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('gamePage').style.display = 'block';
            document.getElementById('displayName').textContent = 'Halo, Teman Hebat!';
            loadFromStorage();
            changeLevel(1);
        }

        function logout() {
            document.getElementById('gamePage').style.display = 'none';
            document.getElementById('loginPage').style.display = 'block';
        }

        function changeLevel(level) {
            currentLevel = level;
            document.querySelectorAll('.level-btn').forEach((btn, index) => {
                if (index === level - 1) btn.classList.add('active');
                else btn.classList.remove('active');
            });
            loadGameLevel(level);
        }

        // ========== LOAD GAME LEVEL ========== //
        function loadGameLevel(level) {
            const gameData = gameLevels[level];
            const gameArea = document.getElementById('gameArea');
            
            if (!gameData) {
                gameArea.innerHTML = '<div class="error-message">Game tidak tersedia</div>';
                return;
            }

            // CEK TYPE DAN PANGGIL FUNGSI YANG SESUAI //
            if (gameData.type === 'habitat') {
                loadHabitatGame(level);
                return;
            }
            
            let html = '';
            
            if (gameData.type === 'count') {
                html = `
                    <div class="question-text">${gameData.question}</div>
                    <div class="animal-grid">
                        ${Array(gameData.count).fill(`
                            <div class="animal-card">
                                <img src="img/${gameData.image}" alt="${gameData.animal}" onerror="this.src='https://via.placeholder.com/100?text=${gameData.animal}'">
                                <span class="sound-icon" onclick="playSound('${gameData.sound}')">🔊</span>
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
                html = `
                    <div class="question-text">${gameData.question}</div>
                    <div class="animal-card" style="margin: 0 auto; max-width: 250px;">
                        <img src="img/${gameData.image}" alt="${gameData.animal}" style="width:150px; height:150px; object-fit:contain;">
                        <span class="animal-name">${gameData.animal}</span>
                        <span class="sound-icon" onclick="playSound('${gameData.sound}')">🔊</span>
                    </div>
                    <div class="color-options">
                        ${gameData.colors.map(color => `
                            <div class="color-picker" style="background-color: ${color.bg};" onclick="checkColor(${level}, '${color.name}')" title="${color.name}"></div>
                        `).join('')}
                    </div>
                `;
            } else if (gameData.type === 'body') {
                html = `
                    <div class="question-text">${gameData.question}</div>
                    <div class="animal-card" style="margin: 0 auto; max-width: 250px;">
                        <img src="img/${gameData.image}" alt="${gameData.animal}" style="width:150px; height:150px; object-fit:contain;">
                        <span class="animal-name">${gameData.animal}</span>
                        <span class="sound-icon" onclick="playSound('${gameData.sound}')">🔊</span>
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

        // ========== LOAD GAME HABITAT ==========
        function loadHabitatGame(level) {
            const gameData = gameLevels[level];
            const gameArea = document.getElementById('gameArea');
    
        // Tentukan warna berdasarkan tipe habitat
        let titleColor, questionColor, bgColor;
        if (gameData.habitatType === 'alam') {
            titleColor = '#2E7D32'; // Hijau tua
            questionColor = '#2E7D32';
            bgColor = '#E8F5E9'; // Hijau muda
        } else {
            titleColor = '#01579B'; // Biru tua
            questionColor = '#01579B';
            bgColor = '#E1F5FE'; // Biru muda
        }
    
        let emoji = gameData.habitatType === 'alam' ? '' : '';
    
        let fallbackImage = gameData.habitatType === 'alam' 
        ? 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&h=500&fit=crop'
        : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=500&fit=crop';
    
        let html = `
        <div class="habitat-game-container">
            <div class="habitat-section ${gameData.habitatType}" style="background: ${bgColor};">
                <div class="habitat-title" style="background: ${titleColor}; color: white;">
                    <span style="font-size: 3.5rem;">${emoji}</span> 
                    <span>HABITAT ${gameData.habitatName.toUpperCase()}</span>
                    <span style="font-size: 3.5rem;">${emoji}</span>
                </div>
                
                <div class="habitat-image-container">
                    <div class="habitat-image" data-habitat="${gameData.habitatName}">
                        <img src="img/${gameData.habitatImage}" 
                            alt="Habitat ${gameData.habitatName}"
                            onerror="this.src='${fallbackImage}'; this.onerror=null;">
                    </div>
                </div>
                
                <div class="question-text" style="background: ${questionColor}; color: white;">
                    ${gameData.question}
                </div>
                
                <div class="animal-choices">
    `;
    
    gameData.animals.forEach(animal => {
        html += `
            <div class="animal-choice-card" onclick="checkHabitatAnswer(${level}, '${animal.name}')">
                <img src="img/${animal.file}" 
                    alt="${animal.name}"
                    onerror="this.src='https://via.placeholder.com/300x300?text=${animal.name}';">
                <div class="animal-choice-name">${animal.name}</div>
                <span class="choice-sound-icon" onclick="event.stopPropagation(); playSound('${animal.sound}')">🔊</span>
            </div>
        `;
    });
    
    html += `</div></div></div>`;
    
    gameArea.innerHTML = html;
    document.getElementById('feedbackArea').innerHTML = '';
}

        // ========== FUNGSI CEK JAWABAN ==========
        function checkAnswer(level, answer) {
            const gameData = gameLevels[level];
            const feedback = document.getElementById('feedbackArea');
            
            if (answer === gameData.count) {
                feedback.innerHTML = '✨🎉 BENAR! 🎉✨';
                feedback.className = 'feedback-area correct';
                currentScore += 10;
                updateScore();
                playSound('applause');
                showReward('Benar! +10 Poin ⭐');
                checkAchievements();
            } else {
                feedback.innerHTML = '😢 Coba lagi!';
                feedback.className = 'feedback-area wrong';
                playSound('sad');
            }
        }

        function checkColor(level, color) {
            const gameData = gameLevels[level];
            const feedback = document.getElementById('feedbackArea');
            
            if (color === gameData.correctColor) {
                feedback.innerHTML = '✅ BENAR!';
                feedback.className = 'feedback-area correct';
                currentScore += 5;
                updateScore();
                playSound('applause');
                showReward('Warna tepat! +5 Poin ⭐');
                checkAchievements();
            } else {
                feedback.innerHTML = '❌ Coba lagi!';
                feedback.className = 'feedback-area wrong';
                playSound('sad');
            }
        }

        function checkBodyPart(level, part) {
            const gameData = gameLevels[level];
            const feedback = document.getElementById('feedbackArea');
            
            if (part === gameData.correct) {
                feedback.innerHTML = '✅ BENAR!';
                feedback.className = 'feedback-area correct';
                currentScore += 8;
                updateScore();
                playSound('applause');
                showReward('Tepat! +8 Poin ⭐');
                checkAchievements();
            } else {
                feedback.innerHTML = '❌ Coba lagi!';
                feedback.className = 'feedback-area wrong';
                playSound('sad');
            }
        }

        function checkHabitatAnswer(level, animalName) {
            const gameData = gameLevels[level];
            const feedback = document.getElementById('feedbackArea');
            const selectedAnimal = gameData.animals.find(a => a.name === animalName);
            
            if (selectedAnimal.correct) {
                feedback.innerHTML = `✨🎉 BENAR! ${animalName} tinggal di habitat ${gameData.habitatName}! 🎉✨`;
                feedback.className = 'feedback-area correct';
                currentScore += 10;
                updateScore();
                playSound(selectedAnimal.sound);
                playSound('applause');
                showReward('Benar! +10 Poin ⭐');
                checkAchievements();
            } else {
                feedback.innerHTML = `😢 ${animalName} tidak tinggal di habitat ${gameData.habitatName}!`;
                feedback.className = 'feedback-area wrong';
                playSound('sad');
            }
        }

        // ========== FUNGSI SKOR DAN REWARD ==========
        function updateScore() {
            document.getElementById('scoreDisplay').textContent = currentScore;
            saveToStorage();
        }

        function addStar(starNumber) {
            const stars = document.querySelectorAll('.star');
            currentStars = starNumber;
            stars.forEach((star, i) => {
                if (i < starNumber) star.classList.add('active');
                else star.classList.remove('active');
            });
            saveToStorage();
        }

        function showReward(message) {
            const reward = document.getElementById('rewardPopup');
            document.getElementById('rewardText').textContent = message;
            reward.classList.remove('hidden');
            setTimeout(() => reward.classList.add('hidden'), 1500);
        }

        function checkAchievements() {
            if (currentScore >= 50 && !badges.includes('Skor 50')) addBadge('🏅 Skor 50');
            if (currentScore >= 100 && !badges.includes('Skor 100')) addBadge('🏆 Skor 100');
            if (currentStars >= 5 && !badges.includes('Bintang 5')) addBadge('⭐ Bintang 5');
        }

        function addBadge(badgeName) {
            if (badges.includes(badgeName)) return;
            badges.push(badgeName);
            const container = document.getElementById('badgesContainer');
            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge';
            badgeEl.innerHTML = `🏅 ${badgeName}`;
            container.appendChild(badgeEl);
            saveToStorage();
            showReward(`🎉 Dapat Lencana: ${badgeName}`);
        }

        function saveToStorage() {
            localStorage.setItem('funAnimalKingdom', JSON.stringify({
                score: currentScore,
                stars: currentStars,
                badges: badges
            }));
        }

        function loadFromStorage() {
            const saved = localStorage.getItem('funAnimalKingdom');
            if (saved) {
                const data = JSON.parse(saved);
                currentScore = data.score || 0;
                currentStars = data.stars || 0;
                badges = data.badges || [];
                document.getElementById('scoreDisplay').textContent = currentScore;
                addStar(currentStars);
                
                const container = document.getElementById('badgesContainer');
                container.innerHTML = '';
                badges.forEach(badge => {
                    const el = document.createElement('div');
                    el.className = 'badge';
                    el.innerHTML = `🏅 ${badge}`;
                    container.appendChild(el);
                });
            }
        }

        document.addEventListener('DOMContentLoaded', loadFromStorage);