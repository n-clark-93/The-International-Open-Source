import { remoteNeedsIndex } from 'international/constants'
import { getRange } from 'international/generalFunctions'
import { creepClasses, RemoteCoreAttacker, RemoteDismantler } from 'room/creeps/creepClasses'

export function remoteDismantlerManager(room: Room, creepsOfRole: string[]) {
     for (const creepName of creepsOfRole) {
          const creep: RemoteDismantler = Game.creeps[creepName]

          // Try to find a remote

          if (!creep.findRemote()) {
               // If the room is the creep's commune

               if (room.name === creep.memory.communeName) {
                    // Advanced recycle and iterate

                    creep.advancedRecycle()
                    continue
               }

               // Otherwise, have the creep make a moveRequest to its commune and iterate

               creep.createMoveRequest({
                    origin: creep.pos,
                    goal: {
                         pos: new RoomPosition(25, 25, creep.memory.communeName),
                         range: 25,
                    },
                    cacheAmount: 200,
               })

               continue
          }

          creep.say(creep.memory.remoteName)

          if (creep.advancedDismantle()) continue

          // If the creep is its remote

          if (room.name === creep.memory.remoteName) {
               delete creep.memory.remoteName
               continue
          }

          // Otherwise, create a moveRequest to its remote

          creep.createMoveRequest({
               origin: creep.pos,
               goal: {
                    pos: new RoomPosition(25, 25, creep.memory.remoteName),
                    range: 25,
               },
               cacheAmount: 200,
          })
     }
}

RemoteDismantler.prototype.findRemote = function () {
     const creep = this

     // If the creep already has a remote, inform true

     if (creep.memory.remoteName) return true

     // Otherwise, get the creep's role

     const role = creep.memory.role as 'remoteCoreAttacker'

     // Get remotes by their efficacy

     const remoteNamesByEfficacy: string[] = Game.rooms[creep.memory.communeName]?.get('remoteNamesByEfficacy')

     // Loop through each remote name

     for (const roomName of remoteNamesByEfficacy) {
          // Get the remote's memory using its name

          const roomMemory = Memory.rooms[roomName]

          // If the needs of this remote are met, iterate

          if (roomMemory.needs[remoteNeedsIndex[role]] <= 0) continue

          // Otherwise assign the remote to the creep and inform true

          creep.memory.remoteName = roomName
          roomMemory.needs[remoteNeedsIndex[role]] -= 1

          return true
     }

     // Inform false

     return false
}

RemoteDismantler.prototype.advancedDismantle = function () {
     const { room } = this

     if (room.structures.constructedWall.length) {

          return true
     }

     const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES)

     if (enemyStructures.length) {

          return true
     }

     return false
}
