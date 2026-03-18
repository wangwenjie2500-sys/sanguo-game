// 地图系统

class GameMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = GAME_CONFIG.tileSize;
        this.cities = JSON.parse(JSON.stringify(CITIES)); // 深拷贝
        this.selectedCity = null;
        this.targetCity = null;
        this.setupCanvas();
        this.bindEvents();
    }

    setupCanvas() {
        // 根据城市坐标计算画布大小
        const maxX = Math.max(...this.cities.map(c => c.x));
        const maxY = Math.max(...this.cities.map(c => c.y));
        
        this.canvas.width = (maxX + 2) * this.tileSize;
        this.canvas.height = (maxY + 2) * this.tileSize;
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        
        const clickedCity = this.getCityAt(tileX, tileY);
        
        if (clickedCity) {
            if (this.selectedCity) {
                // 已有选中城市，选择目标
                this.targetCity = clickedCity;
                game.onCityTargetSelected(clickedCity);
            } else {
                // 选择城市
                this.selectedCity = clickedCity;
                game.onCitySelected(clickedCity);
            }
            this.render();
        } else {
            // 点击空白处，取消选择
            this.selectedCity = null;
            this.targetCity = null;
            game.onCityDeselected();
            this.render();
        }
    }

    getCityAt(x, y) {
        return this.cities.find(city => city.x === x && city.y === y);
    }

    getAdjacentCities(city) {
        const adjacent = [];
        const directions = [
            { dx: 0, dy: -1 }, // 上
            { dx: 0, dy: 1 },  // 下
            { dx: -1, dy: 0 }, // 左
            { dx: 1, dy: 0 },  // 右
            { dx: -1, dy: -1 }, // 左上
            { dx: 1, dy: -1 },  // 右上
            { dx: -1, dy: 1 },  // 左下
            { dx: 1, dy: 1 }    // 右下
        ];
        
        for (const dir of directions) {
            const adjCity = this.getCityAt(city.x + dir.dx, city.y + dir.dy);
            if (adjCity) {
                adjacent.push(adjCity);
            }
        }
        
        return adjacent;
    }

    canMove(fromCity, toCity) {
        if (!fromCity || !toCity) return false;
        if (fromCity.troops < GAME_CONFIG.moveTroopsMin) return false;
        
        const adjacent = this.getAdjacentCities(fromCity);
        return adjacent.some(c => c.id === toCity.id);
    }

    canAttack(fromCity, toCity) {
        if (!fromCity || !toCity) return false;
        if (fromCity.faction === toCity.faction) return false;
        if (fromCity.troops < GAME_CONFIG.moveTroopsMin) return false;
        
        const adjacent = this.getAdjacentCities(fromCity);
        return adjacent.some(c => c.id === toCity.id);
    }

    moveTroops(fromCity, toCity, troops) {
        if (!this.canMove(fromCity, toCity)) return false;
        if (troops > fromCity.troops) troops = fromCity.troops;
        
        fromCity.troops -= troops;
        toCity.troops += troops;
        
        // 移动武将
        const movingGenerals = generals.filter(g => g.city === fromCity.id && g.troops > 0);
        if (movingGenerals.length > 0) {
            const general = movingGenerals[0];
            general.troops = Math.min(troops, general.troops);
        }
        
        return true;
    }

    render() {
        // 清空画布
        this.ctx.fillStyle = '#1a472a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制网格
        this.renderGrid();
        
        // 绘制连接线
        this.renderConnections();
        
        // 绘制城市
        this.renderCities();
        
        // 绘制选中效果
        if (this.selectedCity) {
            this.renderSelection(this.selectedCity, '#ffd700');
        }
        if (this.targetCity) {
            this.renderSelection(this.targetCity, '#ff4444');
        }
    }

    renderGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.width; x += this.tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.height; y += this.tileSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    renderConnections() {
        this.ctx.strokeStyle = 'rgba(218, 165, 32, 0.3)';
        this.ctx.lineWidth = 2;
        
        for (const city of this.cities) {
            const adjacent = this.getAdjacentCities(city);
            for (const adj of adjacent) {
                // 避免重复绘制
                if (city.id < adj.id) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(
                        city.x * this.tileSize + this.tileSize / 2,
                        city.y * this.tileSize + this.tileSize / 2
                    );
                    this.ctx.lineTo(
                        adj.x * this.tileSize + this.tileSize / 2,
                        adj.y * this.tileSize + this.tileSize / 2
                    );
                    this.ctx.stroke();
                }
            }
        }
    }

    renderCities() {
        for (const city of this.cities) {
            const x = city.x * this.tileSize;
            const y = city.y * this.tileSize;
            const cx = x + this.tileSize / 2;
            const cy = y + this.tileSize / 2;
            
            const faction = FACTIONS[city.faction];
            
            // 绘制城池范围
            this.ctx.fillStyle = faction.color + '40';
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, this.tileSize / 2 - 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制城池边框
            this.ctx.strokeStyle = faction.color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, this.tileSize / 2 - 5, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // 绘制城池名称
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Microsoft YaHei';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(city.name, cx, cy);
            
            // 绘制兵力
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = '12px Microsoft YaHei';
            this.ctx.fillText(`${this.formatNumber(city.troops)}`, cx, cy + 20);
            
            // 绘制防御值
            this.ctx.fillStyle = '#aaa';
            this.ctx.font = '10px Microsoft YaHei';
            this.ctx.fillText(`防:${city.defense}`, cx, cy + 35);
        }
    }

    renderSelection(city, color) {
        const x = city.x * this.tileSize;
        const y = city.y * this.tileSize;
        const cx = x + this.tileSize / 2;
        const cy = y + this.tileSize / 2;
        
        // 选中效果动画
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([5, 5]);
        
        const time = Date.now() / 200;
        const offset = (time % 2) * 10;
        this.ctx.lineDashOffset = -offset;
        
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, this.tileSize / 2 - 2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    highlightCities(cities, color) {
        for (const city of cities) {
            const x = city.x * this.tileSize;
            const y = city.y * this.tileSize;
            const cx = x + this.tileSize / 2;
            const cy = y + this.tileSize / 2;
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, this.tileSize / 2 - 3, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    clearSelection() {
        this.selectedCity = null;
        this.targetCity = null;
        this.render();
    }
}
