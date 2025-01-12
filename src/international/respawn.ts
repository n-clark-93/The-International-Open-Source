import { LogOps } from 'utils/logOps'

/**
 * Credit to SemperRabbit for this nice piece of code!
 */
export class RespawnManager {
  static tryRegisterRespawn() {
    if (!this.hasRespawned()) return

    global.clearMemory()
  }

  private static hasRespawned(): boolean {
    if (Game.time === 0) return true

    // Make sure there are no creeps

    for (const key in Game.creeps) {
      return false
    }

    const roomNames = Object.keys(Game.rooms)
    if (roomNames.length > 1) return false

    const room = Game.rooms[roomNames[0]]
    if (
      (!room && !room.controller) ||
      !room.controller.my ||
      room.controller.level !== 1 ||
      room.controller.progress ||
      !room.controller.safeMode ||
      room.controller.safeMode < SAFE_MODE_DURATION - 1
    ) {
      return false
    }

    if (Object.keys(Game.spawns).length > 1) return false

    return true
  }
}
