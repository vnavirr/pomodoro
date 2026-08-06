const BUBBLE_CONFIG = {
    maxBubbles: 24,
    minSize: 3,
    maxSize: 8,
    colours: {
        top: '#a1cf8c',
        right: '#8CA476',
        bottom: '#8CA476',
        left: '#a5cf8c',
        background: '#FFF5EE'
    },
    overOrUnder: 'over',
    opacity: 0.4,
    zIndex: 1001
};

class BubbleCursor {
    constructor(config = BUBBLE_CONFIG) {
        this.config = config;
        this.pool = [];
        this.lastX = 400;
        this.lastY = 300;
        this.trackedX = 400;
        this.trackedY = 300;

        this._buildPool();
        this._bindEvents();
        requestAnimationFrame(this._tick.bind(this));
  }


    _buildPool() {
        const { maxBubbles, colours, overOrUnder, opacity, zIndex } = this.config;

        for (let i = 0; i < maxBubbles; i++) {
            const container = document.createElement('div');
            container.className = 'bubble-cursor';
            container.style.zIndex = overOrUnder === 'over' ? String(zIndex) : '0';
            container.style.visibility = 'hidden';

            const leftRight = document.createElement('div');
            leftRight.className = 'bubble-layer bubble-layer-lr';
            leftRight.style.borderLeftColor = colours.left;
            leftRight.style.borderRightColor = colours.right;

            const topBottom = document.createElement('div');
            topBottom.className = 'bubble-layer bubble-layer-tb';
            topBottom.style.borderTopColor = colours.top;
            topBottom.style.borderBottomColor = colours.bottom;

            const fill = document.createElement('div');
            fill.className = 'bubble-layer bubble-layer-fill';
            fill.style.backgroundColor = colours.background;
            fill.style.opacity = String(opacity);

            container.append(leftRight, topBottom, fill);
            document.body.appendChild(container);

            this.pool.push({
                el: container,
                x: 0,
                y: 0,
                size: this.config.minSize,
                alive: false,
                driftSeed: (i % 5 - 2) / 5,
                fallRate: 0.5 + (i % 2)
            });
        }
    }

    _bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.trackedX = e.clientX;
            this.trackedY = e.clientY;
        });

        document.addEventListener('mousedown', () => this._startHoldSpawn());
        document.addEventListener('mouseup', () => this._stopHoldSpawn());

        window.addEventListener('resize', () => {
            this._viewportW = window.innerWidth;
            this._viewportH = window.innerHeight;
        });

        this._viewportW = window.innerWidth;
        this._viewportH = window.innerHeight;
    }

    _startHoldSpawn() {
        if (this.holdTimer) return;
        this.holdTimer = setInterval(() => this._spawn(this.trackedX, this.trackedY), 100);
    }

    _stopHoldSpawn() {
        if (this.holdTimer) {
        clearInterval(this.holdTimer);
        this.holdTimer = null;
        }
    }

    _spawn(x, y) {
        const bubble = this.pool.find((b) => !b.alive);
        if (!bubble) return;

        bubble.alive = true;
        bubble.x = x;
        bubble.y = y - 3;
        bubble.size = this.config.minSize;
        bubble.el.style.visibility = 'visible';
        this._render(bubble);
    }

    _tick(now) {
        if (this._lastTick === undefined) this._lastTick = now;
        const dtScale = (now - this._lastTick) / 40;
        this._lastTick = now;

        if (Math.abs(this.trackedX - this.lastX) > 8 || Math.abs(this.trackedY - this.lastY) > 8) {
            this.lastX = this.trackedX;
            this.lastY = this.trackedY;
            this._spawn(this.lastX, this.lastY);
        }

        for (const bubble of this.pool) {
            if (!bubble.alive) continue;
            this._updateBubble(bubble, dtScale);
        }

        requestAnimationFrame(this._tick.bind(this));
    }

    _updateBubble(bubble, dtScale) {
        const { minSize, maxSize } = this.config;

        bubble.y -= (bubble.fallRate + bubble.size / 2) * dtScale;
        bubble.x += bubble.driftSeed * dtScale;

        const withinViewport =
        bubble.y > 0 &&
        bubble.x > -bubble.size &&
        bubble.x < this._viewportW + bubble.size;

        if (!withinViewport) {
            bubble.alive = false;
            bubble.el.style.visibility = 'hidden';
            return;
        }

        if (bubble.size < maxSize && Math.random() < (bubble.size / this._viewportH) * 2) {
            bubble.size++;
        }

        this._render(bubble);
    }

    _render(bubble) {
        const { el, x, y, size } = bubble;
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
    }

    destroy() {
        this._stopHoldSpawn();
        for (const bubble of this.pool) bubble.el.remove();
        this.pool = [];
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.bubbleCursor = new BubbleCursor();
});