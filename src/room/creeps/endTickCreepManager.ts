import {
  MovedTypes,
  RoomMemoryKeys,
  RoomTypes,
  customColors,
  enemyDieChants,
  friendlyDieChants,
  powerCreepClassNames,
} from '../../constants/general'
import { StatsManager } from 'international/stats'
import { LogOps } from 'utils/logOps'
import { forCoordsInRange, randomOf, randomRange, randomTick } from 'utils/utils'
import { RoomManager } from '../room'
import { packCoord, unpackCoord } from 'other/codec'
import { CommuneUtils } from 'room/commune/communeUtils'

export class EndTickCreepManager {
    roomManager: RoomManager

    constructor(roomManager: RoomManager) {
        this.roomManager = roomManager
    }

    public run() {
        if (!this.roomManager.room.myCreeps.length) return

        // Power creeps go first

        for (const className of powerCreepClassNames) {
            for (const creepName of this.roomManager.room.myPowerCreepsByRole[className]) {
                const creep = Game.powerCreeps[creepName]

                creep.endRun()
                creep.recurseMoveRequest()

                if (global.settings.creepSay && creep.message.length) creep.say(creep.message)
            }
        }

        // Normal creeps go second

        for (const role in this.roomManager.room.myCreepsByRole) {
            for (const creepName of this.roomManager.room.myCreepsByRole[role as CreepRoles]) {
                const creep = Game.creeps[creepName]

                creep.endRun()
                creep.recurseMoveRequest()

                if (global.settings.creepSay && creep.message.length) creep.say(creep.message)
            }
        }

        this.runChant()
    }

    /**
     * If enabled and there is a chant this tick, have a random creeps that isn't on an exit say the chant
     */
    private runChant() {
        if (!global.settings.creepChant) return

        const currentChant = global.settings.creepChant[Memory.chantIndex]
        if (!currentChant) return

        let creeps: (Creep | PowerCreep)[] = this.roomManager.room.myCreeps
        creeps = creeps.concat(this.roomManager.room.myPowerCreeps)
        if (!creeps.length) return

        const usedNames = this.runDeadChant()

        creeps.filter(creep => !usedNames.has(creep.name))
        if (!creeps.length) return

        randomOf(creeps).say(currentChant, true)
    }

    /**
     * Seems to be pretty CPU friendly
     */
    private runDeadChant() {
        const usedNames: Set<string> = new Set()

        const tombstones = this.roomManager.room.find(FIND_TOMBSTONES, {
            filter: tombstone => tombstone.deathTime + 3 > Game.time,
        })
        if (!tombstones.length) return usedNames

        for (const tombstone of tombstones) {
            let chant: string
            if (
                tombstone.creep.owner.username === Memory.me ||
                global.settings.allies.includes(tombstone.creep.owner.username)
            ) {
                chant = randomOf(friendlyDieChants)
            } else {
                chant = randomOf(enemyDieChants)
            }

            forCoordsInRange(tombstone.pos, 4, coord => {
                const creepName = this.roomManager.room.creepPositions[packCoord(coord)]
                if (!creepName) return

                usedNames.add(creepName)
                Game.creeps[creepName].say(chant, true)
            })
        }


        return usedNames
    }
}
