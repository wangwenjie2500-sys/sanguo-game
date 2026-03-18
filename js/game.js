// 游戏主逻辑

class SanguoGame {
    constructor() {
        this.currentYear = 190;
        this.currentTurn = 1;
        this.playerFaction = 'shu';
        this.gold = 1000;
        this.food = 1000;
        this.selectedAction = null;
        this.selectedCity = null;
        this.gameState = 'title'; // title, playing, battle, menu
        this.map = null;
        this.battle = null;
        this.generals = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadGame();
    }

    bindEvents() {
        // 标题画面按钮
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('load-btn').addEventListener('click', () => this.loadGame());
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());

        // 菜单按钮
        document.getElementById('menu-btn').addEventListener('click', () => this.showMenu());

        // 关闭弹窗
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // 菜单按钮
        document.querySelectorAll('.modal-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleMenuAction(action);
            });
        });

        // 行动按钮
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.selectAction(action);
            });
        });

        // 战斗按钮
        document.getElementById('battle-auto').addEventListener('click', () => {
            this.battle.toggleBattleMode();
        });
        document.getElementById('battle-manual').addEventListener('click', () => {
            this.battle.manualAttack();
        });
        document.getElementById('battle-retreat').addEventListener('click', () => {
            this.battle.retreat();
        });
    }

    startGame() {
        // 初始化游戏数据
        this.currentYear = 190;
        this.currentTurn = 1;
        this.playerFaction = 'shu';
        this.gold = 1000;
        this.food = 1000;
        
        // 重置城市数据
        this.map.cities = JSON.parse(JSON.stringify(CITIES));
        
        // 初始化系统
        this.generals = initGenerals();
        this.battle = initBattle();
        
        // 切换到游戏画面
        this.switchScreen('game-screen');
        this.gameState = 'playing';
        
        // 渲染地图
        this.map.render();
        this.updateInfo();
        
        this.showMessage('游戏开始！你选择了蜀汉势力', 2000);
    }

    loadGame() {
        const saved = localStorage.getItem('sanguo_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentYear = data.year;
                this.currentTurn = data.turn;
                this.playerFaction = data.faction;
                this.gold = data.gold;
                this.food = data.food;
                this.map.cities = data.cities;
                
                this.switchScreen('game-screen');
                this.gameState = 'playing';
                this.map.render();
                this.updateInfo();
                
                this.showMessage('游戏读取成功', 2000);
            } catch (e) {
                this.showMessage('读取存档失败', 2000);
            }
        } else {
            this.showMessage('没有存档', 2000);
        }
    }

    saveGame() {
        const data = {
            year: this.currentYear,
            turn: this.currentTurn,
            faction: this.playerFaction,
            gold: this.gold,
            food: this.food,
            cities: this.map.cities
        };
        
        localStorage.setItem('sanguo_save', JSON.stringify(data));
        this.showMessage('游戏已保存', 2000);
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showHelp() {
        document.getElementById('help-modal').classList.add('active');
    }

    showMenu() {
        document.getElementById('menu-modal').classList.add('active');
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    handleMenuAction(action) {
        switch (action) {
            case 'save':
                this.saveGame();
                break;
            case 'load':
                this.loadGame();
                break;
            case 'settings':
                this.showMessage('游戏设置开发中...', 2000);
                break;
            case 'quit':
                this.switchScreen('title-screen');
                this.gameState = 'title';
                break;
        }
        this.closeModals();
    }

    selectAction(action) {
        // 取消之前的选择
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 选择新动作
        const btn = document.querySelector(`.action-btn[data-action="${action}"]`);
        if (btn) {
            btn.classList.add('selected');
        }
        
        this.selectedAction = action;
        
        const messages = {
            move: '请选择要行军的城池，然后选择目标城池',
            attack: '请选择要进攻的城池，然后选择敌方城池',
            recruit: '请选择要征兵的城池',
            develop: '请选择要发展的城池',
            diplomacy: '外交功能开发中...',
            end: '确定要结束本回合吗？'
        };
        
        this.showMessage(messages[action], 2000);
        
        // 结束回合
        if (action === 'end') {
            setTimeout(() => this.endTurn(), 500);
        }
    }

    onCitySelected(city) {
        this.selectedCity = city;
        
        const faction = FACTIONS[city.faction];
        const isPlayerCity = city.faction === this.playerFaction;
        
        let message = `${city.name} - ${faction.name} (兵力：${city.troops})`;
        
        if (isPlayerCity) {
            message += ' [我方城池]';
            
            if (this.selectedAction === 'recruit') {
                this.recruitTroops(city);
            } else if (this.selectedAction === 'develop') {
                this.developCity(city);
            }
        } else {
            message += ' [敌方城池]';
            
            if (this.selectedAction === 'attack') {
                // 检查是否可以攻击
                const adjacent = this.map.getAdjacentCities(this.selectedCity);
                if (adjacent.some(c => c.id === city.id)) {
                    setTimeout(() => this.startAttack(city), 500);
                } else {
                    this.showMessage('距离太远，无法攻击', 2000);
                }
            }
        }
        
        this.showMessage(message, 2000);
    }

    onCityTargetSelected(city) {
        if (this.selectedAction === 'move' && this.selectedCity) {
            if (this.map.canMove(this.selectedCity, city)) {
                this.moveTroops(this.selectedCity, city);
            } else {
                this.showMessage('无法行军到该城池', 2000);
            }
        }
    }

    onCityDeselected() {
        this.selectedCity = null;
    }

    moveTroops(fromCity, toCity) {
        const moveAmount = Math.floor(fromCity.troops * 0.5);
        if (moveAmount < GAME_CONFIG.moveTroopsMin) {
            this.showMessage('兵力不足，无法行军', 2000);
            return;
        }
        
        fromCity.troops -= moveAmount;
        toCity.troops += moveAmount;
        
        // 移动武将
        const generals = generalsManager.getGeneralsInCity(fromCity.id);
        if (generals.length > 0) {
            generals[0].city = toCity.id;
        }
        
        this.showMessage(`行军完成！${moveAmount} 兵力从${fromCity.name}移动到${toCity.name}`, 2000);
        
        this.map.render();
        this.updateInfo();
        this.map.clearSelection();
        this.selectedAction = null;
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    startAttack(targetCity) {
        if (!this.selectedCity) return;
        
        // 检查是否可以攻击
        if (!this.map.canAttack(this.selectedCity, targetCity)) {
            this.showMessage('无法攻击该城池', 2000);
            return;
        }
        
        // 开始战斗
        this.battle.startBattle(this.selectedCity, targetCity);
        
        this.selectedAction = null;
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    recruitTroops(city) {
        if (city.faction !== this.playerFaction) {
            this.showMessage('只能在我方城池征兵', 2000);
            return;
        }
        
        const recruitAmount = 1000;
        const goldCost = (recruitAmount / 100) * GAME_CONFIG.recruitGold;
        const foodCost = (recruitAmount / 100) * GAME_CONFIG.recruitFood;
        
        if (this.gold < goldCost) {
            this.showMessage(`金钱不足！需要${goldCost}金钱`, 2000);
            return;
        }
        
        if (this.food < foodCost) {
            this.showMessage(`粮食不足！需要${foodCost}粮食`, 2000);
            return;
        }
        
        this.gold -= goldCost;
        this.food -= foodCost;
        city.troops += recruitAmount;
        
        // 增加武将兵力
        const generals = generalsManager.getGeneralsInCity(city.id);
        if (generals.length > 0) {
            generals[0].troops += recruitAmount;
        }
        
        this.showMessage(`征兵成功！招募${recruitAmount}士兵，消耗${goldCost}金钱、${foodCost}粮食`, 2000);
        
        this.map.render();
        this.updateInfo();
        this.map.clearSelection();
        this.selectedAction = null;
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    developCity(city) {
        if (city.faction !== this.playerFaction) {
            this.showMessage('只能在我方城池发展', 2000);
            return;
        }
        
        if (this.gold < GAME_CONFIG.developCost) {
            this.showMessage(`金钱不足！需要${GAME_CONFIG.developCost}金钱`, 2000);
            return;
        }
        
        this.gold -= GAME_CONFIG.developCost;
        
        // 随机提升
        const improvements = [];
        
        if (Math.random() > 0.3) {
            city.gold += 200;
            improvements.push('金钱 +200');
        }
        
        if (Math.random() > 0.3) {
            city.food += 200;
            improvements.push('粮食 +200');
        }
        
        if (Math.random() > 0.5) {
            city.defense += 10;
            improvements.push('防御 +10');
        }
        
        if (Math.random() > 0.7) {
            city.troops += 500;
            improvements.push('兵力 +500');
        }
        
        if (improvements.length === 0) {
            improvements.push('发展不太顺利...');
        }
        
        this.showMessage(`${city.name} 发展完成：${improvements.join(', ')}`, 2000);
        
        this.map.render();
        this.updateInfo();
        this.map.clearSelection();
        this.selectedAction = null;
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    endTurn() {
        this.currentTurn++;
        
        // 每 12 回合增加一年
        if (this.currentTurn % 12 === 1) {
            this.currentYear++;
        }
        
        // 资源收入
        const income = this.calculateIncome();
        this.gold += income.gold;
        this.food += income.food;
        
        // 显示回合信息
        this.showMessage(`第${this.currentTurn}回合 (${this.currentYear}年) 收入：金钱 +${income.gold}, 粮食 +${income.food}`, 2000);
        
        // 更新显示
        this.updateInfo();
        this.map.render();
        
        // 检查胜利条件
        this.checkVictory();
        
        // 清除选择
        this.selectedAction = null;
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    calculateIncome() {
        let gold = 0;
        let food = 0;
        
        // 计算所有玩家城池的收入
        const playerCities = this.map.cities.filter(c => c.faction === this.playerFaction);
        
        for (const city of playerCities) {
            gold += Math.floor(city.gold * 0.1);
            food += Math.floor(city.food * 0.1);
        }
        
        // 基础收入
        gold += 50;
        food += 50;
        
        return { gold, food };
    }

    checkVictory() {
        const playerCities = this.map.cities.filter(c => c.faction === this.playerFaction);
        const totalCities = this.map.cities.length;
        
        if (playerCities.length === totalCities) {
            this.showMessage('🎉 恭喜！你统一了全国！', 3000);
            setTimeout(() => {
                alert('恭喜通关！你成功统一了全国！');
                this.switchScreen('title-screen');
                this.gameState = 'title';
            }, 3000);
        }
    }

    updateInfo() {
        document.getElementById('year-display').textContent = `${this.currentYear}年`;
        document.getElementById('turn-display').textContent = this.currentTurn;
        document.getElementById('faction-display').textContent = FACTIONS[this.playerFaction].name;
        document.getElementById('gold-display').textContent = this.gold;
        document.getElementById('food-display').textContent = this.food;
    }

    showMessage(message, duration = 2000) {
        const toast = document.getElementById('message-toast');
        toast.textContent = message;
        toast.style.display = 'block';
        
        // 重新触发动画
        toast.style.animation = 'none';
        toast.offsetHeight; // 触发重绘
        toast.style.animation = 'fadeInOut 2s ease-in-out';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }
}

// 初始化游戏
let game = null;

window.addEventListener('DOMContentLoaded', () => {
    game = new SanguoGame();
    game.map = new GameMap('game-map');
    game.map.render();
});
