// Global

import './global/globalFunctions'
import './global/globalVars'

// International

import { internationalManager } from './international/internationalManager'

// Room

import { roomManager } from './room/roomManager'

// External

import { ErrorMapper } from './external/ErrorMapper'

// Other

import { logManager } from 'other/logManager'

// Type declareations for global

declare global {

    interface Memory {
        [key: string]: any

    }

    interface Room {
        [key: string]: any
    }

    interface RoomMemory {
        [key: string]: any
        anchorPoint: {[key: string]: any}
    }

    interface Creep {
        [key: string]: any

    }

    interface CreepMemory {
        [key: string]: any
        role: string
    }

    namespace NodeJS {
        interface Global {
            [key: string]: any

            me: string
            allyList: string[]
            creepRoles: string[]
        }
    }
}

// Loop

export const loop = ErrorMapper.wrapLoop(function() {

    internationalManager()

    roomManager()

    logManager()
})
