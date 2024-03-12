class ExplosionHandler {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
    }

    explode(N, brick) {
        // Create N new explosion particles around the given brick object
        for (let i = 0; i < N; i++) {
            this.particles.push(new ExplosionParticle(this.ctx, brick));
        }
    }

    draw() {
        // Decided whether to call step() or remove() for every particle
        this.particles.forEach((particle, i) => {
            if (particle.alpha <= 0) {
                this.particles.splice(i, 1);
            } else {
                particle.step();
            }
        });
    }
}

class ExplosionParticle {
    constructor(ctx, brick) {
        this.ctx = ctx;
        this.color = brick.colors[1];
        this.alpha = 0.8;

        // Set random x, y, dx, dy and radius using a brick object as the particles starting point
        // Random particle values
        this.radius = Math.random() * 3;
        this.x = randomInt(brick.x, brick.x + brick.width);
        this.y = randomInt(brick.y, brick.y + brick.height);
        this.dx = (Math.random() - 0.5) * (Math.random() * 6);
        this.dy = (Math.random() - 0.5) * (Math.random() * 6);
        // Adjust particle direction for it to go outwards
        if (this.x > brick.x + brick.width / 2) {
            this.dx = Math.abs(this.dx);
        } else {
            this.dx = -Math.abs(this.dx);
        }
        if (this.y > brick.y + brick.height / 2) {
            this.dy = Math.abs(this.dy);
        } else {
            this.dy = -Math.abs(this.dy);
        }
    }

    drawParticle() {
        // Draw particle on the canvas
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = this.color;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.restore();
    }

    step() {
        // Particle takes a step and slowly disappears
        this.drawParticle();
        this.alpha -= 0.02;
        this.x += this.dx;
        this.y += this.dy;
    }
}
