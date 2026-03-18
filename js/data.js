// 三国霸业游戏数据

// 势力定义
const FACTIONS = {
    shu: {
        id: 'shu',
        name: '蜀汉',
        color: '#22c55e',
        capital: 'chengdu',
        leader: 'liubei'
    },
    wei: {
        id: 'wei',
        name: '曹魏',
        color: '#3b82f6',
        capital: 'luoyang',
        leader: 'caocao'
    },
    wu: {
        id: 'wu',
        name: '东吴',
        color: '#ef4444',
        capital: 'jianye',
        leader: 'sunquan'
    },
    qun: {
        id: 'qun',
        name: '群雄',
        color: '#a855f7',
        capital: 'chang_an',
        leader: 'dongzhuo'
    }
};

// 城池数据
const CITIES = [
    // 蜀汉区域
    { id: 'chengdu', name: '成都', x: 2, y: 6, faction: 'shu', troops: 5000, gold: 500, food: 500, defense: 100 },
    { id: 'jiangzhou', name: '江州', x: 3, y: 7, faction: 'shu', troops: 3000, gold: 300, food: 400, defense: 80 },
    { id: 'yongchang', name: '永昌', x: 1, y: 8, faction: 'shu', troops: 2000, gold: 200, food: 300, defense: 60 },
    { id: 'hanzhong', name: '汉中', x: 2, y: 4, faction: 'shu', troops: 4000, gold: 400, food: 400, defense: 90 },
    
    // 曹魏区域
    { id: 'luoyang', name: '洛阳', x: 5, y: 3, faction: 'wei', troops: 6000, gold: 600, food: 600, defense: 120 },
    { id: 'chang_an', name: '长安', x: 3, y: 3, faction: 'wei', troops: 5000, gold: 500, food: 500, defense: 110 },
    { id: 'xuchang', name: '许昌', x: 6, y: 4, faction: 'wei', troops: 5500, gold: 550, food: 550, defense: 100 },
    { id: 'ye', name: '邺城', x: 6, y: 2, faction: 'wei', troops: 4500, gold: 450, food: 450, defense: 95 },
    { id: 'pingyang', name: '平阳', x: 5, y: 2, faction: 'wei', troops: 3000, gold: 300, food: 300, defense: 70 },
    
    // 东吴区域
    { id: 'jianye', name: '建业', x: 7, y: 6, faction: 'wu', troops: 5000, gold: 500, food: 500, defense: 100 },
    { id: 'wuchang', name: '武昌', x: 6, y: 6, faction: 'wu', troops: 4000, gold: 400, food: 400, defense: 85 },
    { id: 'kuaiji', name: '会稽', x: 8, y: 6, faction: 'wu', troops: 3500, gold: 350, food: 350, defense: 75 },
    { id: 'yuzhang', name: '豫章', x: 7, y: 7, faction: 'wu', troops: 3000, gold: 300, food: 300, defense: 70 },
    
    // 群雄区域
    { id: 'beiping', name: '北平', x: 7, y: 1, faction: 'qun', troops: 3500, gold: 350, food: 350, defense: 80 },
    { id: 'shangdang', name: '上党', x: 6, y: 3, faction: 'qun', troops: 3000, gold: 300, food: 300, defense: 75 },
    { id: 'xiaopei', name: '小沛', x: 6, y: 5, faction: 'qun', troops: 2500, gold: 250, food: 250, defense: 65 },
    { id: 'xiapi', name: '下邳', x: 7, y: 5, faction: 'qun', troops: 3000, gold: 300, food: 300, defense: 70 }
];

// 武将数据
const GENERALS = [
    // 蜀汉武将
    { id: 'liubei', name: '刘备', faction: 'shu', force: 75, intel: 85, politics: 90, city: 'chengdu', troops: 2000 },
    { id: 'guanyu', name: '关羽', faction: 'shu', force: 97, intel: 75, politics: 70, city: 'jiangzhou', troops: 3000 },
    { id: 'zhangfei', name: '张飞', faction: 'shu', force: 98, intel: 60, politics: 50, city: 'chengdu', troops: 2500 },
    { id: 'zhugeliang', name: '诸葛亮', faction: 'shu', force: 50, intel: 100, politics: 95, city: 'chengdu', troops: 1000 },
    { id: 'zhaoyun', name: '赵云', faction: 'shu', force: 96, intel: 80, politics: 70, city: 'hanzhong', troops: 2800 },
    { id: 'huangzhong', name: '黄忠', faction: 'shu', force: 92, intel: 70, politics: 60, city: 'hanzhong', troops: 2200 },
    { id: 'machaao', name: '马超', faction: 'shu', force: 95, intel: 65, politics: 55, city: 'hanzhong', troops: 2500 },
    
    // 曹魏武将
    { id: 'caocao', name: '曹操', faction: 'wei', force: 80, intel: 95, politics: 95, city: 'luoyang', troops: 3000 },
    { id: 'xiadouhou', name: '夏侯惇', faction: 'wei', force: 90, intel: 70, politics: 65, city: 'luoyang', troops: 2500 },
    { id: 'zhangliao', name: '张辽', faction: 'wei', force: 93, intel: 80, politics: 70, city: 'xiaopei', troops: 2800 },
    { id: 'simayi', name: '司马懿', faction: 'wei', force: 65, intel: 98, politics: 90, city: 'chang_an', troops: 2000 },
    { id: 'xuchu', name: '许褚', faction: 'wei', force: 95, intel: 55, politics: 50, city: 'xuchang', troops: 2300 },
    { id: 'guojia', name: '郭嘉', faction: 'wei', force: 45, intel: 98, politics: 85, city: 'xuchang', troops: 800 },
    { id: 'dianwei', name: '典韦', faction: 'wei', force: 96, intel: 50, politics: 45, city: 'ye', troops: 2200 },
    
    // 东吴武将
    { id: 'sunquan', name: '孙权', faction: 'wu', force: 75, intel: 85, politics: 90, city: 'jianye', troops: 2500 },
    { id: 'sunce', name: '孙策', faction: 'wu', force: 92, intel: 75, politics: 75, city: 'kuaiji', troops: 2800 },
    { id: 'zhouyu', name: '周瑜', faction: 'wu', force: 75, intel: 96, politics: 85, city: 'wuchang', troops: 2000 },
    { id: 'lvmeng', name: '吕蒙', faction: 'wu', force: 85, intel: 90, politics: 80, city: 'jianye', troops: 2300 },
    { id: 'lusu', name: '鲁肃', faction: 'wu', force: 65, intel: 90, politics: 85, city: 'wuchang', troops: 1800 },
    { id: 'ganning', name: '甘宁', faction: 'wu', force: 93, intel: 75, politics: 65, city: 'yuzhang', troops: 2500 },
    { id: 'taishici', name: '太史慈', faction: 'wu', force: 90, intel: 70, politics: 60, city: 'kuaiji', troops: 2400 },
    
    // 群雄武将
    { id: 'dongzhuo', name: '董卓', faction: 'qun', force: 90, intel: 60, politics: 50, city: 'chang_an', troops: 3000 },
    { id: 'lvbu', name: '吕布', faction: 'qun', force: 100, intel: 60, politics: 45, city: 'xiaopei', troops: 3500 },
    { id: 'diaochan', name: '貂蝉', faction: 'qun', force: 40, intel: 85, politics: 80, city: 'xiaopei', troops: 500 },
    { id: 'yuanshao', name: '袁绍', faction: 'qun', force: 70, intel: 75, politics: 80, city: 'ye', troops: 2500 },
    { id: 'yanliang', name: '颜良', faction: 'qun', force: 92, intel: 60, politics: 50, city: 'ye', troops: 2200 },
    { id: 'wenchou', name: '文丑', faction: 'qun', force: 91, intel: 58, politics: 48, city: 'ye', troops: 2100 },
    { id: 'gongsunzan', name: '公孙瓒', faction: 'qun', force: 82, intel: 70, politics: 65, city: 'beiping', troops: 2300 }
];

// 地形类型
const TERRAIN = {
    plain: { name: '平原', defense: 1.0, move: 1 },
    mountain: { name: '山地', defense: 1.5, move: 2 },
    river: { name: '河流', defense: 1.3, move: 2 },
    forest: { name: '森林', defense: 1.2, move: 1.5 },
    city: { name: '城池', defense: 2.0, move: 1 }
};

// 事件数据
const EVENTS = [
    { id: 1, year: 190, name: '黄巾之乱', description: '黄巾军起义，天下大乱' },
    { id: 2, year: 192, name: '董卓乱政', description: '董卓掌控朝政，诸侯讨伐' },
    { id: 3, year: 194, name: '曹操迎天子', description: '曹操迎汉献帝至许昌' },
    { id: 4, year: 196, name: '刘备得徐州', description: '刘备获得徐州之地' },
    { id: 5, year: 198, name: '吕布殒命', description: '吕布在下邳被擒' },
    { id: 6, year: 200, name: '官渡之战', description: '曹操与袁绍决战官渡' },
    { id: 7, year: 207, name: '三顾茅庐', description: '刘备三顾茅庐请诸葛亮' },
    { id: 8, year: 208, name: '赤壁之战', description: '孙刘联军大破曹军' }
];

// 游戏配置
const GAME_CONFIG = {
    tileSize: 60,
    mapWidth: 10,
    mapHeight: 9,
    maxTurns: 100,
    recruitCost: 100,  // 每 100 兵消耗
    recruitGold: 10,   // 每 100 兵金钱
    recruitFood: 15,   // 每 100 兵粮食
    developCost: 200,  // 发展消耗
    moveTroopsMin: 1000,  // 行军最少兵力
    battleBaseDamage: 0.3, // 基础伤害系数
    forceBonus: 0.01,  // 武力加成
    intelBonus: 0.005  // 智力加成
};
