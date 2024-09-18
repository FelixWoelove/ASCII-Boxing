const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const opponent = {
  name: 'Mike Tyson',
  life: 100,
  stamina: 100,
  strength: 10,
  specialChance: 0.2,
  regen: 10
};

const player = {
  name: 'You',
  life: 100,
  stamina: 100,
  strength: 10,
  specialChance: 0.3,
  regen: 15,
  dodgeChance: 0.5 // 50% chance to dodge
};

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Display simple graphics for both opponent and player
function displayGraphics(playerHit = false, opponentHit = false) {
  console.clear();
  
  console.log(`${colors.red}Opponent: ${colors.reset}`);
  if (opponentHit) {
    animateHit();
  } else {
    console.log("         _____  ");
    console.log("        /     \\ ");
    console.log("       |  O  O  |");
    console.log("       |    >   |");
    console.log("       |  \\_/  |");
    console.log("        \\_____/ ");
    console.log("         / | \\  ");
    console.log("    ____/  |  \\___");
    console.log("   /  _|   |   |_  \\ ");
    console.log("  /  / |   |   | \\  \\ ");
    console.log(" /  /  |___|___|  \\  \\ ");
    console.log(" |  |  |       |   |  |");
    console.log(" |__|  |       |   |__|");
    console.log("       | \\ //  |         ");
    console.log("       |  ---  |       ");
    console.log("       |   /\   |     ");

    
  }

  console.log(`${colors.green}You: ${colors.reset}`);
  if (playerHit) {
    animateHit();
  } else {
    console.log("         _____  ");
    console.log("        /     \\ ");
    console.log("       |  O  O  |");
    console.log("       |    >   |");
    console.log("       |  \\_/  |");
    console.log("        \\_____/ ");
    console.log("         / | \\  ");
    console.log("    ____/  |  \\___");
    console.log("   /  _|   |   |_  \\ ");
    console.log("  /  / |   |   | \\  \\ ");
    console.log(" /  /  |___|___|  \\  \\ ");
    console.log(" |  |  |       |   |  |");
    console.log(" |__|  |       |   |__|");
    console.log("       | \\ //  |         ");
    console.log("       |  ---  |       ");
    console.log("       |   /\   |     ");
  }
}

// Hit animation for either player or opponent
function animateHit() {
  console.log("         _____  ");
  console.log("        /     \\ ");
  console.log("       |  X  X |");
  console.log("       |    >  |");
  console.log("       |  \\_/ |");
  console.log("        \\_____/ ");
  console.log("         / | \\  ");
  console.log("    ____/  |  \\___");
  console.log("   /  _|   |   |_  \\ ");
  console.log("  /  / |   |   | \\  \\ ");
  console.log(" /  /  |___|___|  \\  \\ ");
  console.log(" |  |  |       |   |  |");
  console.log(" |__|  |       |   |__|");
  console.log("       | \\ //  |         ");
  console.log("       |  ---  |       ");
  console.log("       |   /\   |     ");
}

// Attack function, with stamina check and chance for special attack
function attack(attacker, defender, type) {
  let staminaCost;
  let baseDamage;
  
  switch(type) {
    case 'light':
      staminaCost = 10;
      baseDamage = Math.floor(Math.random() * (attacker.strength / 2));
      break;
    case 'medium':
      staminaCost = 20;
      baseDamage = Math.floor(Math.random() * attacker.strength);
      break;
    case 'heavy':
      staminaCost = 40;
      baseDamage = Math.floor(Math.random() * attacker.strength * 1.5);
      break;
    default:
      staminaCost = 10;
      baseDamage = Math.floor(Math.random() * attacker.strength);
  }

  if (attacker.stamina < staminaCost) {
    console.log(`${attacker.name} is too tired to attack!`);
    return false;
  }
  
  attacker.stamina -= staminaCost;
  const isSpecial = Math.random() < attacker.specialChance;
  const damage = isSpecial ? baseDamage * 2 : baseDamage;
  defender.life -= damage;

  console.log(`${isSpecial ? colors.yellow : colors.reset}${attacker.name} ${isSpecial ? 'lands a SPECIAL attack!' : `hits`} ${defender.name} for ${damage} damage!${colors.reset}`);
  return isSpecial;
}

// Player action - can attack or dodge
function playerAction() {
  rl.question('Choose an action - (l)ight, (m)edium, (h)eavy, or (d)odge: ', (input) => {
    if (input === 'd') {
      playerDodge();
    } else {
      let attackType;
      if (input === 'l') {
        attackType = 'light';
      } else if (input === 'm') {
        attackType = 'medium';
      } else if (input === 'h') {
        attackType = 'heavy';
      } else {
        console.log('Invalid input, try again.');
        return playerAction();
      }
      const hit = attack(player, opponent, attackType);
      displayGraphics(hit, false);
      setTimeout(() => opponentAction(), 1000);
    }
  });
}

// Player dodge function
function playerDodge() {
  const dodgeCost = 20;
  if (player.stamina < dodgeCost) {
    console.log(`${player.name} is too tired to dodge!`);
    return playerAction();
  }

  player.stamina -= dodgeCost;
  console.log(`${player.name} attempts to dodge!`);
  setTimeout(() => opponentAction(true), 1000); // Pass true to indicate dodge attempt
}

// Opponent attacks, and checks if the player dodged
function opponentAction(playerDodged = false) {
  if (playerDodged && Math.random() < player.dodgeChance) {
    console.log(`${player.name} dodges the attack!`);
  } else {
    const attackType = Math.random() < 0.5 ? 'light' : 'heavy';
    const hit = attack(opponent, player, attackType);
    displayGraphics(false, hit);
  }
  
  checkForWinner();
  setTimeout(() => gameLoop(), 1000);
}

// Display health and stamina stats
function displayStats() {
  console.log(`${opponent.name} has ${colors.red}${opponent.life}${colors.reset} life and ${colors.blue}${opponent.stamina}${colors.reset} stamina.`);
  console.log(`${player.name} has ${colors.green}${player.life}${colors.reset} life and ${colors.blue}${player.stamina}${colors.reset} stamina.`);
}

// Check if someone has won the match
function checkForWinner() {
  if (opponent.life <= 0) {
    console.log(`${player.name} wins!`);
    rl.close();
  } else if (player.life <= 0) {
    console.log(`${opponent.name} wins!`);
    rl.close();
  }
}

// Regenerate stamina at the end of each round
function regenStamina(character) {
  character.stamina += character.regen;
  if (character.stamina > 100) {
    character.stamina = 100;
  }
}

// Main game loop
function gameLoop() {
  displayStats();
  regenStamina(player);
  regenStamina(opponent);
  playerAction();
}

gameLoop();