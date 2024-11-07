// Function to calculate distance between two points in 3D space
function calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// HTML color for pink
const messageColor = "#c2749d";

// /me command
mp.events.addCommand('me', (player, _, ...action) => {
    if (action.length === 0) {
        player.outputChatBox('Naudojimas: /me <veiksmas>');
        return;
    }

    const actionMessage = action.join(' ');
    const message = `!{${messageColor}}* ${player.name} ${actionMessage}`;

    mp.players.forEachInRange(player.position, 10, (nearbyPlayer) => {
        nearbyPlayer.outputChatBox(message);
    });
});

// /do command
mp.events.addCommand('do', (player, _, ...description) => {
    if (description.length === 0) {
        player.outputChatBox('Naudojimas: /do <apibudinimas>');
        return;
    }

    const descriptionMessage = description.join(' ');
    const message = `!{${messageColor}}* ${descriptionMessage} ((${player.name}))`;

    mp.players.forEachInRange(player.position, 10, (nearbyPlayer) => {
        nearbyPlayer.outputChatBox(message);
    });
});

// /s command for shouting
mp.events.addCommand('s', (player, _, ...shoutMessage) => {
    if (shoutMessage.length === 0) {
        player.outputChatBox('Naudojimas: /s <žodis>');
        return;
    }

    const shoutText = shoutMessage.join(' ');
    const message = `* ${player.name} šaukia: ${shoutText}`;

    mp.players.forEachInRange(player.position, 50, (nearbyPlayer) => {
        nearbyPlayer.outputChatBox(message);
    });
});

// /low command for whispering
mp.events.addCommand('low', (player, _, ...whisperMessage) => {
    if (whisperMessage.length === 0) {
        player.outputChatBox('Naudojimas: /low <žodis>');
        return;
    }

    const whisperText = whisperMessage.join(' ');
    const whisperColor = "#A0A0A0"; // Gray color for whispering
    const message = `!{${whisperColor}}* ${player.name} šnabžda: ${whisperText}`;

    // Get nearby players within 5 units and send message
    mp.players.forEachInRange(player.position, 5, (nearbyPlayer) => {
        nearbyPlayer.outputChatBox(message);
    });
});

// Proximity chat system
mp.events.add("playerChat", (player, message) => {
    const chatMessage = `${player.name} sako: ${message}`;
    mp.players.forEachInRange(player.position, 10, (nearbyPlayer) => {
        nearbyPlayer.outputChatBox(chatMessage);
    });
});

mp.events.addCommand('b', (player, _, ...messageArray) => {
    if (messageArray.length === 0) {
        // Show usage message if no message was provided
        player.outputChatBox(`!{#B0C4DE}Naudojimas: /b [žinutė] - Nusiusti OOC žinutę šalia esantiems žaidėjams.`);
        return;
    }

    const message = messageArray.join(" ");
    const chatMessage = `((${player.name}: ${message}))`;

    mp.players.forEachInRange(player.position, 10, (nearbyPlayer) => {
        nearbyPlayer.outputChatBox(chatMessage);
    });
});



mp.events.addCommand('help', (player) => {
    player.outputChatBox(`!{#ADD8E6}Galimos komandos: /me, /do, /b, /s, /low, /pm, /id`);
});




// PM and ID

mp.events.addCommand('id', (player, fullText, partialName) => {
    if (!partialName) {
        // Show the player's own ID if no name is provided
        player.outputChatBox(`Jūsų žaidėjo ID: ${player.id}`);
    } else {
        // Find all players with names containing the partial name
        const matchingPlayers = mp.players.toArray().filter(p => p.name.toLowerCase().includes(partialName.toLowerCase()));

        if (matchingPlayers.length === 0) {
            player.outputChatBox(`Nerastas žaidėjas "${partialName}".`);
        } else {
            // List all matching players and their IDs
            matchingPlayers.forEach(target => {
                player.outputChatBox(`ID: ${target.id} | Vardas: ${target.name}`);
            });
        }
    }
});


mp.events.addCommand('pm', (player, fullText, targetIdentifier, ...messageArray) => {
    if (!targetIdentifier || messageArray.length === 0) {
        player.outputChatBox(`Naudojimas: /pm [ID ar dalis vardo] [žinutė]`);
        return;
    }

    const message = messageArray.join(" ");
    let target;

    // Check if the identifier is a player ID
    if (!isNaN(targetIdentifier)) {
        const targetId = parseInt(targetIdentifier);
        target = mp.players.at(targetId);
    } else {
        // Find players with names containing the partial name
        const matchingPlayers = mp.players.toArray().filter(p => p.name.toLowerCase().includes(targetIdentifier.toLowerCase()));

        if (matchingPlayers.length === 0) {
            player.outputChatBox(`Nerastas žaidėjas vardu "${targetIdentifier}".`);
            return;
        } else if (matchingPlayers.length > 1) {
            player.outputChatBox(`Rasti keli žaidėjai vardu "${targetIdentifier}":`);
            matchingPlayers.forEach(target => {
                player.outputChatBox(`ID: ${target.id} | Vardas: ${target.name}`);
            });
            player.outputChatBox(`Įveskite tikslų vardą.`);
            return;
        } else {
            target = matchingPlayers[0];
        }
    }

    // Send the private message if a single target was found
    if (target) {
        target.outputChatBox(`!{#FFFF00}((PM iš ${player.name}: ${message}))`);
        player.outputChatBox(`!{#FFFF00}((PM nusiųsta ${target.name}: ${message}))`);
    } else {
        player.outputChatBox(`Žaidėjas "${targetIdentifier}" nerastas.`);
    }
});

mp.events.add('playerJoin', (player) => {
    player.cash = 1000; // Starting cash
    player.call('createCashTextDraw', [player.cash]); // Create the TextDraw with the starting cash
    console.log(`Player joined: ${player.name}, Starting Cash: ${player.cash}`); // Log for confirmation
});

// Command to add cash
mp.events.add('playerCommand', (player, command) => {
    if (command === 'addcash') { // Use 'addcash' without the slash
        player.cash += 100; // Increase cash by $100
        player.call('updateCashDisplay', [player.cash]); // Update the TextDraw with the new cash
        player.outputChatBox(`You received $100. Your new balance is $${player.cash}.`);
        console.log(`New cash for ${player.name}: $${player.cash}`); // Log for confirmation
    }
});

