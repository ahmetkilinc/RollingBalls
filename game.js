document.addEventListener('DOMContentLoaded', () => {
    const { Engine, Render, Runner, Bodies, Composite, World, Events } = Matter;

    const canvas = document.getElementById('gameCanvas');
    const startButton = document.getElementById('startButton');
    const winnerDiv = document.getElementById('winner');

    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
    const radius = 15;
    const pathWidth = 600; // Width of the path
    let marbles = [];
    let finishLine;
    let isRaceStarted = false;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;

    // Create renderer
    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: 1080,
            height: 1080,
            wireframes: false,
            background: '#f0f0f0'
        }
    });

    // Create runner
    const runner = Runner.create();

    // Create path edges
    function createPath() {
        const pathPoints = [
            { x: 100, y: 0 },
            { x: 100, y: 300 },
            { x: 400, y: 600 },
            { x: 700, y: 300 },
            { x: 800, y: 800 },
            { x: 1080, y: 1080 }
        ];

        const pathEdges = [];
        for (let i = 0; i < pathPoints.length - 1; i++) {
            const p1 = pathPoints[i];
            const p2 = pathPoints[i + 1];
            const edgeLeft = Bodies.rectangle((p1.x + p2.x) / 2 - pathWidth / 2 * Math.sin(Math.atan2(p2.y - p1.y, p2.x - p1.x)), (p1.y + p2.y) / 2 + pathWidth / 2 * Math.cos(Math.atan2(p2.y - p1.y, p2.x - p1.x)), Math.hypot(p2.x - p1.x, p2.y - p1.y), 10, {
                isStatic: true,
                angle: Math.atan2(p2.y - p1.y, p2.x - p1.x),
                render: { fillStyle: 'black' }
            });
            const edgeRight = Bodies.rectangle((p1.x + p2.x) / 2 + pathWidth / 2 * Math.sin(Math.atan2(p2.y - p1.y, p2.x - p1.x)), (p1.y + p2.y) / 2 - pathWidth / 2 * Math.cos(Math.atan2(p2.y - p1.y, p2.x - p1.x)), Math.hypot(p2.x - p1.x, p2.y - p1.y), 10, {
                isStatic: true,
                angle: Math.atan2(p2.y - p1.y, p2.x - p1.x),
                render: { fillStyle: 'black' }
            });
            pathEdges.push(edgeLeft, edgeRight);
        }

        World.add(world, pathEdges);
    }

    // Create marbles
    function createMarbles() {
        marbles = colors.map((color, index) => {
            const x = 100 + index * (2 * radius + 20);
            const y = 50;
            return Bodies.circle(x, y, radius, {
                restitution: 0.9,
                render: { fillStyle: color }
            });
        });
        World.add(world, marbles);
    }

    // Create finish line
    function createFinishLine() {
        finishLine = Bodies.rectangle(540, 1070, 1080, 10, {
            isStatic: true,
            render: { fillStyle: 'red' }
        });
        World.add(world, finishLine);
    }

    // Check for finish
    Events.on(engine, 'collisionStart', event => {
        event.pairs.forEach(pair => {
            if (pair.bodyA === finishLine || pair.bodyB === finishLine) {
                const winningMarble = pair.bodyA === finishLine ? pair.bodyB : pair.bodyA;
                if (colors.includes(winningMarble.render.fillStyle)) {
                    isRaceStarted = false;
                    winnerDiv.textContent = `Kazanan: ${winningMarble.render.fillStyle}`;
                    Runner.stop(runner);
                }
            }
        });
    });

    // Randomize marble speeds
    function randomizeMarbleSpeeds() {
        marbles.forEach(marble => {
            Matter.Body.setVelocity(marble, { x: (Math.random() - 0.5) * 2, y: (Math.random() * 2) + 1 });
        });
    }

    // Initialize the game
    function initializeGame() {
        World.clear(world);
        Engine.clear(engine);
        createPath();
        createMarbles();
        createFinishLine();
        winnerDiv.textContent = '';
        isRaceStarted = false;
    }

    // Start the race
    function startRace() {
        if (!isRaceStarted) {
            initializeGame();
            Runner.start(runner, engine);
            randomizeMarbleSpeeds();
            isRaceStarted = true;
        }
    }

    startButton.addEventListener('click', startRace);

    Render.run(render);
    initializeGame();
});
