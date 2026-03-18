// 战斗系统

class BattleSystem {
    constructor() {
        this.battleLog = [];
        this.isAutoBattle = true;
        this.battleInterval = null;
    }

    // 发起战斗
    startBattle(attackerCity, defenderCity) {
        const attackerGenerals = generalsManager.getGeneralsInCity(attackerCity.id);
        const defenderGenerals = generalsManager.getGeneralsInCity(defenderCity.id);
        
        const attackerGeneral = attackerGenerals[0] || { name: '无名将领', force: 50, intel: 50 };
        const defenderGeneral = defenderGenerals[0] || { name: '守城将领', force: 50, intel: 50 };
        
        this.battleData = {
            attacker: {
                city: attackerCity,
                general: attackerGeneral,
                troops: attackerCity.troops,
                maxTroops: attackerCity.troops
            },
            defender: {
                city: defenderCity,
                general: defenderGeneral,
                troops: defenderCity.troops,
                maxTroops: defenderCity.troops,
                defense: defenderCity.defense
            }
        };
        
        this.battleLog = [];
        this.logBattle(`战斗开始！${attackerCity.name} 进攻 ${defenderCity.name}！`, 'special');
        
        this.showBattleScreen();
        
        if (this.isAutoBattle) {
            this.autoBattle();
        }
    }

    // 显示战斗界面
    showBattleScreen() {
        const battleScreen = document.getElementById('battle-screen');
        const data = this.battleData;
        
        document.getElementById('attacker-name').textContent = 
            `${data.attacker.city.name} (${data.attacker.general.name})`;
        document.getElementById('attacker-troops').textContent = data.attacker.troops;
        document.getElementById('attacker-general').textContent = data.attacker.general.name;
        
        document.getElementById('defender-name').textContent = 
            `${data.defender.city.name} (${data.defender.general.name})`;
        document.getElementById('defender-troops').textContent = data.defender.troops;
        document.getElementById('defender-general').textContent = data.defender.general.name;
        
        document.getElementById('battle-log').innerHTML = '';
        
        battleScreen.classList.add('active');
    }

    hideBattleScreen() {
        document.getElementById('battle-screen').classList.remove('active');
    }

    // 自动战斗
    autoBattle() {
        if (this.battleInterval) {
            clearInterval(this.battleInterval);
        }
        
        this.isAutoBattle = true;
        let round = 0;
        const maxRounds = 20;
        
        this.battleInterval = setInterval(() => {
            round++;
            this.battleRound(round);
            
            if (this.checkBattleEnd() || round >= maxRounds) {
                clearInterval(this.battleInterval);
                this.endBattle();
            }
        }, 800);
    }

    // 手动战斗（单次攻击）
    manualAttack() {
        if (!this.battleData) return;
        
        const round = 1;
        this.battleRound(round);
        
        if (this.checkBattleEnd()) {
            this.endBattle();
        }
    }

    // 战斗回合
    battleRound(round) {
        const { attacker, defender } = this.battleData;
        
        // 攻击方伤害计算
        const attackPower = generalsManager.getCombatPower(attacker.general, attacker.troops);
        const defensePower = defender.defense * 10 + generalsManager.getCombatPower(defender.general, defender.troops) * 0.5;
        
        // 伤害计算
        const baseDamage = Math.floor(attacker.troops * 0.15);
        const forceDiff = attacker.general.force - defender.general.force;
        const intelDiff = attacker.general.intel - defender.general.intel;
        
        const damage = Math.floor(
            baseDamage * (1 + forceDiff * 0.02 + intelDiff * 0.01) * (Math.random() * 0.4 + 0.8)
        );
        
        const actualDamage = Math.min(damage, defender.troops);
        defender.troops -= actualDamage;
        
        this.logBattle(`第${round}回合：${attacker.general.name} 发动攻击，造成 ${actualDamage} 伤害`, 'attack');
        
        // 防守方反击
        if (defender.troops > 0) {
            const counterDamage = Math.floor(defender.troops * 0.1 * (Math.random() * 0.4 + 0.8));
            const actualCounter = Math.min(counterDamage, attacker.troops);
            attacker.troops -= actualCounter;
            
            this.logBattle(`第${round}回合：${defender.general.name} 反击，造成 ${actualCounter} 伤害`, 'defend');
        }
        
        // 更新显示
        this.updateBattleDisplay();
    }

    // 更新战斗显示
    updateBattleDisplay() {
        document.getElementById('attacker-troops').textContent = this.battleData.attacker.troops;
        document.getElementById('defender-troops').textContent = this.battleData.defender.troops;
    }

    // 检查战斗结束
    checkBattleEnd() {
        const { attacker, defender } = this.battleData;
        
        if (defender.troops <= 0) {
            return 'attacker_win';
        }
        if (attacker.troops <= 0) {
            return 'defender_win';
        }
        if (attacker.troops < attacker.maxTroops * 0.1) {
            return 'attacker_retreat';
        }
        
        return false;
    }

    // 结束战斗
    endBattle() {
        const result = this.checkBattleEnd();
        const { attacker, defender } = this.battleData;
        
        let message = '';
        
        switch (result) {
            case 'attacker_win':
                message = `🎉 战斗胜利！${attacker.city.name} 占领了 ${defender.city.name}！`;
                this.logBattle(message, 'special');
                
                // 更新城池归属
                defender.city.faction = attacker.city.faction;
                defender.city.troops = Math.floor(attacker.maxTroops * 0.5);
                attacker.city.troops = Math.floor(attacker.maxTroops * 0.5);
                
                // 更新武将位置
                const movingGenerals = generalsManager.getGeneralsInCity(attacker.city.id);
                if (movingGenerals.length > 0) {
                    movingGenerals[0].city = defender.city.id;
                }
                
                game.showMessage(message, 3000);
                break;
                
            case 'defender_win':
                message = `🛡️ 防守成功！${defender.city.name} 击退了敌军！`;
                this.logBattle(message, 'special');
                
                attacker.city.troops = Math.floor(attacker.troops * 0.5);
                game.showMessage(message, 3000);
                break;
                
            case 'attacker_retreat':
                message = `⚠️ 进攻方兵力不足，撤退了！`;
                this.logBattle(message, 'special');
                
                attacker.city.troops = Math.floor(attacker.troops * 0.7);
                game.showMessage(message, 3000);
                break;
        }
        
        // 延迟关闭战斗界面
        setTimeout(() => {
            this.hideBattleScreen();
            game.map.clearSelection();
            game.map.render();
        }, 2000);
    }

    // 撤退
    retreat() {
        if (this.battleInterval) {
            clearInterval(this.battleInterval);
        }
        
        const { attacker } = this.battleData;
        attacker.city.troops = Math.floor(attacker.troops * 0.7);
        
        this.logBattle('⚠️ 进攻方选择撤退！', 'special');
        
        setTimeout(() => {
            this.hideBattleScreen();
            game.map.clearSelection();
            game.map.render();
            game.showMessage('撤退成功，损失 30% 兵力', 2000);
        }, 1500);
    }

    // 记录战斗日志
    logBattle(message, type = 'normal') {
        this.battleLog.push({ message, type });
        
        const logElement = document.getElementById('battle-log');
        const entry = document.createElement('div');
        entry.className = `battle-log-entry ${type}`;
        entry.textContent = message;
        logElement.appendChild(entry);
        
        logElement.scrollTop = logElement.scrollHeight;
    }

    // 切换自动/手动
    toggleBattleMode() {
        this.isAutoBattle = !this.isAutoBattle;
        
        if (this.isAutoBattle) {
            this.autoBattle();
            document.getElementById('battle-auto').textContent = '自动战斗中...';
            document.getElementById('battle-manual').disabled = false;
        } else {
            if (this.battleInterval) {
                clearInterval(this.battleInterval);
            }
            document.getElementById('battle-auto').textContent = '自动战斗';
            document.getElementById('battle-manual').disabled = false;
        }
    }
}

// 全局战斗系统
let battleSystem = null;

function initBattle() {
    battleSystem = new BattleSystem();
    return battleSystem;
}
