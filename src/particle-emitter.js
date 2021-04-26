import { Sprite } from "./framework";

import { range } from "./utils";

const generateParticle = (sprite) => ({ x: sprite.x, y: sprite.y, scale: sprite.scale, d: Math.random() * Math.PI * 2, ttl: Math.random() * 50 });

export class ParticleEmitter extends Sprite {
    constructor(props) {
        super({dx: 0, dy: 0, ...props, scale: 1, ds: 0.975});
        this.count = 5;
        this.particles = range(0, this.count).map(() => generateParticle(props));
    }

    draw({ images }) {
        this.particles.forEach(p => images.draw({ ...this, ...p}));
    }

    move(props) {
        super.move(props);
        this.particles = this.particles.map(p => p.ttl > 0 ? { ...p, x: p.x + Math.cos(p.d) + this.dx, y: p.y + Math.sin(p.d) + this.dy, ttl: p.ttl - 1, scale: p.scale*this.ds } : generateParticle(this));
    }
}
