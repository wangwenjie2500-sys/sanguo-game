// 武将系统

class GeneralManager {
    constructor() {
        this.generals = JSON.parse(JSON.stringify(GENERALS)); // 深拷贝
    }

    getGeneral(id) {
        return this.generals.find(g => g.id === id);
    }

    getGeneralsByFaction(faction) {
        return this.generals.filter(g => g.faction === faction);
    }

    getGeneralsInCity(cityId) {
        return this.generals.filter(g => g.city === cityId);
    }

    getAvailableGenerals(cityId) {
        return this.generals.filter(g => g.city === cityId && g.troops > 0);
    }

    // 获取武将综合评分
    getGeneralScore(general) {
        return Math.floor(
            (general.force * 0.4 + general.intel * 0.35 + general.politics * 0.25)
        );
    }

    // 计算战斗能力
    getCombatPower(general, troops) {
        const basePower = troops * GAME_CONFIG.battleBaseDamage;
        const forceBonus = general.force * GAME_CONFIG.forceBonus;
        const intelBonus = general.intel * GAME_CONFIG.intelBonus;
        return basePower * (1 + forceBonus + intelBonus);
    }

    // 征兵
    recruit(general, amount) {
        const cost = Math.floor(amount / 100);
        const goldCost = cost * GAME_CONFIG.recruitGold;
        const foodCost = cost * GAME_CONFIG.recruitFood;
        
        const city = game.map.getCityAt(
            game.cities.find(c => c.id === general.city)?.x,
            game.cities.find(c => c.id === general.city)?.y
        );
        
        if (!city) return { success: false, message: '城市不存在' };
        if (game.gold < goldCost) return { success: false, message: '金钱不足' };
        if (game.food < foodCost) return { success: false, message: '粮食不足' };
        
        game.gold -= goldCost;
        game.food -= foodCost;
        general.troops += amount;
        city.troops += amount;
        
        return {
            success: true,
            message: `${general.name} 招募了 ${amount} 名士兵`,
            cost: { gold: goldCost, food: foodCost }
        };
    }

    // 移动武将
    moveGeneral(general, toCityId) {
        const oldCity = general.city;
        general.city = toCityId;
        
        return {
            success: true,
            message: `${general.name} 从${this.getCityName(oldCity)}移动到${this.getCityName(toCityId)}`
        };
    }

    getCityName(cityId) {
        const city = CITIES.find(c => c.id === cityId);
        return city ? city.name : cityId;
    }

    // 武将升级
    levelUp(general) {
        const increase = Math.floor(Math.random() * 3) + 1;
        const stats = ['force', 'intel', 'politics'];
        const stat = stats[Math.floor(Math.random() * stats.length)];
        
        general[stat] += increase;
        
        return {
            success: true,
            message: `${general.name} 的${this.getStatName(stat)}提升了 ${increase} 点`,
            stat: stat,
            increase: increase
        };
    }

    getStatName(stat) {
        const names = {
            force: '武力',
            intel: '智力',
            politics: '政治'
        };
        return names[stat] || stat;
    }

    // 搜索在野武将（简化版）
    searchGenerals(faction) {
        // 随机事件：发现新武将
        const events = [
            { name: '赵云', force: 96, intel: 80, politics: 70 },
            { name: '典韦', force: 96, intel: 50, politics: 45 },
            { name: '太史慈', force: 90, intel: 70, politics: 60 }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        
        return {
            success: true,
            message: `发现武将：${event.name}`,
            general: event
        };
    }

    // 显示武将信息
    showGeneralInfo(general) {
        return `
            <div class="general-info">
                <h3>${general.name}</h3>
                <p>势力：${FACTIONS[general.faction].name}</p>
                <p>武力：${general.force}</p>
                <p>智力：${general.intel}</p>
                <p>政治：${general.politics}</p>
                <p>兵力：${general.troops}</p>
                <p>所在：${this.getCityName(general.city)}</p>
                <p>综合评分：${this.getGeneralScore(general)}</p>
            </div>
        `;
    }
}

// 全局武将管理器
let generalsManager = null;

function initGenerals() {
    generalsManager = new GeneralManager();
    return generalsManager;
}
