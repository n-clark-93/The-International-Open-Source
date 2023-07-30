import { CreepMemoryKeys, RoomMemoryKeys, packedPosLength } from 'international/constants'

export class ControllerUpgrader extends Creep {
    constructor(creepID: Id<Creep>) {
        super(creepID)
    }

    public isDying() {
        // Stop if creep is spawning

        if (this.spawning) return false

        // If the creep's remaining ticks are more than the estimated spawn time plus travel time, inform false

        if (
            this.ticksToLive >
            this.body.length * CREEP_SPAWN_TIME +
                this.room.memory[RoomMemoryKeys.upgradePath].length / packedPosLength
        )
            return false

        // Record creep as isDying

        return true
    }

    preTickManager() {
        this.room.communeManager.upgradeStrength += this.room.communeManager.upgradeStrength
    }

    public static roleManager(room: Room, creepsOfRole: string[]) {
        // Loop through creepNames

        for (const creepName of creepsOfRole) {
            // Get the creep using its creepName

            const creep: ControllerUpgrader = Game.creeps[creepName]
            const creepMemory = Memory.creeps[creep.name]

            if (
                creepMemory[CreepMemoryKeys.targetID] === room.controller.id ||
                room.controller.ticksToDowngrade <
                    room.communeManager.controllerDowngradeUpgradeThreshold
            ) {
                creep.advancedUpgradeController()
                continue
            }

            const cSiteTarget = creep.room.roomManager.cSiteTarget
            if (cSiteTarget && !creep.room.enemyAttackers.length) {
                creep.advancedBuild()
                continue
            }

            creep.advancedUpgradeController()
        }
    }
}
