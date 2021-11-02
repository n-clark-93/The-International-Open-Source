import { creepClasses } from '../room/creeps/creepClasses'

export function creepOrganizer() {

    // Loop through all of my creeps

    for (const creepName in Memory.creeps) {

        const creep: Creep = Game.creeps[creepName]

        // If creep doesn't exist

        if (!creep) {

            // Delete creep from memory and iterate

            delete Memory.creeps[creepName]
            continue
        }

        const room: Room = creep.room

        // Construct object for role if it doesn't exist

        if (!room.myCreeps[creep.memory.role]) room.myCreeps[creep.memory.role] = []

        // Organize creep by room and role

        room.myCreeps[creep.memory.role].push(new creepClasses[creep.memory.role](creep))

        // See if creep is dying

        creep.isDying()

        // Stop if creep is dying

        if (creep.memory.dying) continue

        // Increase creepCount for this role

        room.creepCount[creep.memory.role] += 1
    }
}
