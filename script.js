
document.addEventListener('DOMContentLoaded', function () {
    const commandInput = document.getElementById('commandInput');
    const executeButton = document.getElementById('executeCommand');
    const moveButton = document.getElementById('moveButton');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    const attackButton = document.getElementById('attackButton');
    const reportButton = document.getElementById('reportButton');
    const outputText = document.getElementById('outputText');
    const gridTable = document.getElementById('grid-table');

    let drone = null;
    createGrid();

// Update the createGrid function to create the grid with 0,0 at the bottom left
function createGrid() {
    const table = document.createElement('table');
    table.classList.add('grid');
    for (let row = 9; row >= 0; row--) { // Start from 9 (bottom) and go up to 0
        const tr = document.createElement('tr');
        for (let col = 0; col < 10; col++) {
            const td = document.createElement('td');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    if (gridTable) {
        gridTable.innerHTML = ''; // Check if gridTable exists
        gridTable.appendChild(table);
    }
}

// Update the updateGrid function to adjust the drone position for the reversed grid
let droneIcon = null;

function updateGrid() {
    if (!drone) return;

    const cells = gridTable.querySelectorAll('td');

    // Remove the previous drone icon if it exists
    if (droneIcon) {
        droneIcon.remove();
    }

    const cellIndex = (9 - drone.y) * 10 + drone.x; // Adjust the cellIndex calculation

    // Check if cellIndex is valid
    if (cellIndex < 0 || cellIndex >= cells.length) return;

    const droneCell = cells[cellIndex];

    // Create the drone image element
    droneIcon = document.createElement('img');
    droneIcon.src = 'drone.png'; // Set the image source
    droneIcon.alt = 'Drone Icon';
    droneIcon.classList.add('drone-icon');
    droneCell.appendChild(droneIcon);

    // Add the appropriate class based on drone orientation
    droneIcon.classList.add('drone-' + drone.f.toLowerCase());
}

    executeButton.addEventListener('click', () => {
        const command = commandInput.value.trim().toUpperCase();
        if (command.length === 0) return;
        const result = executeCommand(command);
        outputText.textContent = result;
        document.getElementById("grid-table").style.display = 'block';
        updateGrid();
    });

    moveButton.addEventListener('click', () => {
        executeCommand('MOVE');
        updateGrid();
    });

    leftButton.addEventListener('click', () => {
        executeCommand('LEFT');
        updateGrid();
    });

    rightButton.addEventListener('click', () => {
        executeCommand('RIGHT');
        updateGrid();
    });

    attackButton.addEventListener('click', () => {
        executeCommand('ATTACK');
        updateGrid();
    });

    reportButton.addEventListener('click', () => {
        const result = executeCommand('REPORT');
        outputText.textContent = result;
    });
    function executeCommand(command) {
        const parts = command.split(' ');
        const action = parts[0];

        switch (action) {
            case 'PLACE':
                const placeArgs = parts[1].split(',');
                const x = parseInt(placeArgs[0]);
                const y = parseInt(placeArgs[1]);
                const f = placeArgs[2];
                drone = new Drone(x, y, f);
                return '';
            case 'MOVE':
                if (drone) drone.move();
                return '';
            case 'LEFT':
                if (drone) drone.turnLeft();
                return '';
            case 'RIGHT':
                if (drone) drone.turnRight();
                return '';
            case 'ATTACK':
                if (drone) drone.attack();
                return '';
            case 'REPORT':
                if (drone) return drone.report();
                return 'Drone not placed yet.';
            default:
                return 'Invalid command.';
        }
    }

    class Drone {
        constructor(x, y, f) {
            this.x = x;
            this.y = y;
            this.f = f;
        }
    
        move() {
            if (!this.isPlaced()) return;
            switch (this.f) {
                case 'NORTH':
                    if (this.y < 9) this.y++;
                    break;
                case 'EAST':
                    if (this.x < 9) this.x++;
                    break;
                case 'SOUTH':
                    if (this.y > 0) this.y--;
                    break;
                case 'WEST':
                    if (this.x > 0) this.x--;
                    break;
            }
        }
    
        turnLeft() {
            if (!this.isPlaced()) return;
            switch (this.f) {
                case 'NORTH':
                    this.f = 'WEST';
                    break;
                case 'EAST':
                    this.f = 'NORTH';
                    break;
                case 'SOUTH':
                    this.f = 'EAST';
                    break;
                case 'WEST':
                    this.f = 'SOUTH';
                    break;
            }
        }
    
        turnRight() {
            if (!this.isPlaced()) return;
            switch (this.f) {
                case 'NORTH':
                    this.f = 'EAST';
                    break;
                case 'EAST':
                    this.f = 'SOUTH';
                    break;
                case 'SOUTH':
                    this.f = 'WEST';
                    break;
                case 'WEST':
                    this.f = 'NORTH';
                    break;
            }
        }
    
        attack() {
            if (!drone) return;
        
            // Calculate the position 2 units ahead in the direction the drone is facing
            let targetX = drone.x;
            let targetY = drone.y;
        
            switch (drone.f) {
                case 'NORTH':
                    targetY += 2;
                    break;
                case 'EAST':
                    targetX += 2;
                    break;
                case 'SOUTH':
                    targetY -= 2;
                    break;
                case 'WEST':
                    targetX -= 2;
                    break;
                default:
                    return; // Invalid direction
            }
        
            // Check if the target position is within bounds
            if (targetX < 0 || targetX >= 10 || targetY < 0 || targetY >= 10) {
                return; // Target position is out of bounds
            }
        
            // Check if the target position is already occupied
            const cells = gridTable.querySelectorAll('td');
            const targetCellIndex = (9 - targetY) * 10 + targetX;
            const targetCell = cells[targetCellIndex];
        
            if (targetCell.querySelector('.drone-icon')) {
                return; // Target position is already occupied
            }
        
            // Create an explosion effect using an image element
            const explosion = document.createElement('img');
            explosion.src = 'ex.gif'; // Set the image source to ex.gif
            explosion.alt = 'Explosion Icon';
            explosion.classList.add('explosion');
            targetCell.appendChild(explosion);
        
            // Optional: Delay the removal of the explosion effect for a visual effect
            setTimeout(() => {
                targetCell.removeChild(explosion);
            }, 1000);
        }
        
    
        report() {

            if (!this.isPlaced()) return 'Drone not placed yet.';
            return `${this.x},${this.y},${this.f}`;
        }
    
        isPlaced() {
            return this.f && this.x >= 0 && this.x <= 9 && this.y >= 0 && this.y <= 9;
        }
    }
    
});
