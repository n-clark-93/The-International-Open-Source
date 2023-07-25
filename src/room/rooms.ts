import {
    RoomMemoryKeys,
    RoomTypes,
    customColors,
    roomTypesUsedForStats,
} from '../international/constants'

import './roomFunctions'

import './commune/commune'

import { CreepRoleManager } from './creeps/creepRoleManager'

import { PowerCreepRoleManager } from './creeps/powerCreepRoleManager'
import './roomVisuals'
import { createPosMap, customLog } from 'international/utils'
import { updateStat, statsManager } from 'international/statsManager'
import './creeps/endTickCreepManager'
import { CommuneManager } from './commune/commune'
import { RoomManager } from './room'

class RoomsManager {
    constructor() {}
    updateRun() {
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName]

            room.roomManager = global.roomManagers[room.name]

            if (!room.roomManager) {
                room.roomManager = new RoomManager()
                global.roomManagers[room.name] = room.roomManager
            }

            room.roomManager.update(room)
        }
    }
    initRun() {
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName]
            room.roomManager.preTickRun()
        }
    }
    run() {
        // If CPU logging is enabled, get the CPU used at the start

        if (global.settings.CPULogging === true) var managerCPUStart = Game.cpu.getUsed()
        const statName: RoomCommuneStatNames = 'rocu'

        // Loop through room names in Game.rooms

        for (const roomName in Game.rooms) {
            // Get the CPU used at the start

            if (global.settings.CPULogging === true) var roomCPUStart = Game.cpu.getUsed()

            // Get the room using the roomName

            const room = Game.rooms[roomName]
            const roomMemory = Memory.rooms[room.name]
            const roomType = roomMemory[RoomMemoryKeys.type]

            // If the room is a commune, run its specific manager

            room.roomManager.run()

            // Log room stats

            let logMessage = `Type: ${RoomTypes[roomType]} Creeps: ${room.myCreepsAmount}`

            if (global.settings.CPULogging === true) {
                const cpuUsed = Game.cpu.getUsed() - roomCPUStart
                logMessage += `, CPU: ${cpuUsed.toFixed(2)}`
                updateStat(roomName, statName, cpuUsed)
            }
            customLog(
                `<a style="cursor: pointer" href="https://screeps.com/a/#!/${Game.shard.name}/${room.name}">${room.name}</a>`,
                logMessage,
                {
                    textColor: customColors.white,
                    bgColor: customColors.lightBlue,
                    superPosition: 2,
                },
            )
            if (global.settings.roomStats > 0 && roomTypesUsedForStats.includes(roomType))
                statsManager.roomEndTick(room.name, roomType)
        }

        // If CPU logging is enabled, log the CPU used by this manager

        if (global.settings.CPULogging === true) {
            const cpuUsed = Game.cpu.getUsed() - managerCPUStart
            customLog('Room Manager', cpuUsed.toFixed(2), {
                textColor: customColors.white,
                bgColor: customColors.lightBlue,
                superPosition: 1,
            })
            const statName: InternationalStatNames = 'roomcu'
            updateStat('', statName, cpuUsed, true)
        }
    }
}

export const roomsManager = new RoomsManager()
