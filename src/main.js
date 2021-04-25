require("prototype.tower")
require("prototype.terminal")
let cleanMemory = require("module.cleanMemory")
let visuals = ("module.roomVisuals")
let spawns = require("module.spawning")
let roles = require("module.roles")
let constants = require("module.constants")
let labs = require("module.labs")
let links = require("module.links")
let construction = require("module.construction")

const profiler = require('screeps-profiler')

//profiler.enable();
module.exports.loop = function() {
        if (Game.time % 1 == 0) {

            console.log("start: " + Game.cpu.getUsed().toFixed(2))

            //profiler.wrap(function() {
            //Game.profiler.profile(1000)
            
            if (Game.shard.name == "shard2") {
                
                if (Game.cpu.bucket == 10000) {
                    Game.cpu.generatePixel();
                }  
            }
            
            roles.run(roles)

            console.log("roles: " + Game.cpu.getUsed().toFixed(2))

            console.log('--------------------------------------------------------')

            if (Game.time % 10 == 0) {

                cleanMemory.run(cleanMemory)
            }

            console.log("cleanMemory: " + Game.cpu.getUsed().toFixed(2))

            if (Game.time % 10 == 0) {

                construction.run(construction)
            }

            console.log("construction: " + Game.cpu.getUsed().toFixed(2))
                /*
                var storages = _.filter(Game.structures, s => s.structureType == STRUCTURE_STORAGE);

                for (let storage of storages) {

                    storage.visuals()
                    console.log("storage: " + Game.cpu.getUsed().toFixed(2))

                }*/

            if (Game.time % 1 == 0) {

                var terminals = _.filter(Game.structures, s => s.structureType == STRUCTURE_TERMINAL);

                for (let terminal of terminals) {

                    terminal.market()

                }
            }

            console.log("terminals: " + Game.cpu.getUsed().toFixed(2))

            if (Game.time % 10 == 0) {

                constants.run(constants)

            }

            console.log("constants: " + Game.cpu.getUsed().toFixed(2))

            links.run(links)

            console.log("links: " + Game.cpu.getUsed().toFixed(2))

            labs.run(labs)

            console.log("labs: " + Game.cpu.getUsed().toFixed(2))

            var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);

            for (let tower of towers) {

                tower.defend()
            }

            console.log("towers: " + Game.cpu.getUsed().toFixed(2))

            spawns.run(spawns)

            console.log("spawns: " + Game.cpu.getUsed().toFixed(2))
            
            function myRoomsNumber() {
                
                let i = 0
                
                
                
                _.forEach(Game.rooms, function (room) {
                    
                    if (room.controller && room.controller.my) {
                        
                        i++
                    }
                })
                
                return i
            }

            console.log('--------------------------------------------------------')
            console.log("                Time: " + Game.time % 10)
            console.log("              Creeps: " + Object.keys(Memory.creeps).length + " (" + Math.floor(Object.keys(Memory.creeps).length / myRoomsNumber()) + " / room)")
            console.log("       Market Offers: " + Object.keys(Game.market.orders).length)
            console.log("          CPU Bucket: " + Game.cpu.bucket)
            console.log("                 CPU: " + Game.cpu.getUsed().toFixed(2))
            console.log(`
            <div style="dislay: flex; flex-direction: row; background: rgba(255, 255, 255, 0.15); padding: 12px; border-radius: 6px; width: 90vw; box-shadow: rgba(0, 0, 0, 0.19) 0 12px 30px 0;">
                <div style="width: 25%;">
                    <div style="color:green; background: white; width: 20%;">Text</div>
                </div>
                <div style="width: 25%;">
                    <div style="color:green; background: white; width: 20%;">Text</div>
                </div>
            </div>
            `)
            console.log('--------------------------------------------------------')
                //});
        }
    }
    /*
    //-----------------------------------------------------------------------------------------------

Market:

    Game.market.cancelOrder("orderid")

    Game.market.deal('6010553cbfbe5cb167da78a1', 1200, "W17N54")

    Game.rooms['W17N52'].terminal.send(RESOURCE_ENERGY, 30000, 'W17N54','Reason')

    Game.market.createOrder({type: ORDER_SELL, resourceType: PIXEL, price: 1000, totalAmount: 750, roomName: "E25N2"})
    
    //-----------------------------------------------------------------------------------------------

Claim Room:

    Game.spawns.Spawn1.memory.claimRoom = "W17N52"

    Create New Spawner Memory:

    Game.spawns.Spawn2.memory.minimumNumberOfMiners = 1
    
    //-----------------------------------------------------------------------------------------------
    
Flags:

    RDP = Ranged Defensive Position
    MDP = Melee Defensive Position
    AR = Attack Room
    BB = Big Boy Attack

    BR = Build Room

    S = Add Message To Room
    
    //-----------------------------------------------------------------------------------------------
    
Bunker:

    https://screeps.admon.dev/building-planner/?share=N4IgdghgtgpiBcIDqBGA7AOQKwBYQBoQB3AewCcAbAEwRCihIJAGcALCMmxNjqgZiZkAxhQQAOQgCMArgEtqssAHNmCUBUUBrNSAAOJVfADaoAB4I+fQgE8LAJgC+AXQeEyJCF1D7DJkOfhLGwsUVzMLLGDAvjD-CwA2KL4cWIC+OySABlSLNCSsHMCUKLsATkK+PJBbQMd8cPg7CWqEMsKcTPyKqpq+MQrEluiK4qH0ioyx0Pq4+A6klJmA+bGYpYQV3rqGzZDCpqS1hoOx7dmT3unj5t7s9cCcJLO0yKmKq1WRkvj374rHoZ2H73PivGpAiZ-EEfXr9EEA2EVMEWOENPiDREg5EPf5deElcogm57EGlLL7MljRZozqfIlJYE0kqo2ZBMaM1nYpoDEpoCqU3p8+ljFnLWm9DkBC6tUUWcWtSWtAWtIU7Sa9Qlo9W5X5jO5o0YSirywIFYXgzWsnoyilJVWsw0o41JWWNYmBRVuvFo62NT19KFo5WNe1i5ntE1tFyEAAuJCIMDIOh8CD8aRhFmpnPJIO1OJBGLluLpaIRe2jIAoEEkyYMqbRhdqPLeIN9fCuVpzaPdfH1nZLrJ7zxRh35SQ7aWD4wrMcTUEUEFE8G8deMPoWzlcLF0ECIYFrvlLG-xeshp03hGYcbIECUcGXelXaYiTwv4GkmkTB-rrLzljfJCSMwiYAG5fg+KZrr+BJvgAZhAQjXjUK6Hg65IVvoCZkAAyjue7flBaSNqCb4wKYs5gMwsgkPuEFPlq4b3GUo5MVOE5yl2rIZoEoa5Ha3QMl8gKupUvK2oClppJGkkWFOZrdt6g7HkGMHQmJIImuMrGvqSLEGnpXGKS8RkJPxWKqQ2FnQYCvGNFOfZpGWbpCZcxZGuZ7JjlSzbuWi2KVC5OraWM8loTZSLqWi3Hcie4K2b245nr0oVpI6+ZHmM8WabZzGecF4IiZG8XunY8XBjFKl5QpmXOt5GmCeaNpqRJAktQWjEMVVYXJW+N5QDuZAxgRRguA4DhAA

Base:

    https://screeps.admon.dev/building-planner/?share=N4IgdghgtgpiBcIDqAWAHAOQKxpAGhAHcB7AJwBsATBEKKY-EAZwAsJTrFX3KBmR0gGNyCNAQBGAVwCWVaWADmTBKFLEInUAAdiy+AG1QADwS8UBAJ4IAjAE4AvnmOnrlmw6cgT8XgCY38NZojs4+vAFBIV6m5iBWgQDsUd684XE2AGzJpv7pgVmeKa551ljZPrHxpeW8xVVJhaYZAcGNPgktNWJ5HqG83fENfR15BX3NozVYAUPRPtM9UwFlbf3LSyWzKQAMEVsxMzW2h6sjVbxdEShHESuhKLlV120PERcvjza+NWdflyXWG4A8ooOo2QEvXYlMZzUERGHeV4lO6wqFVQEAXUcIEExDATAALqRJIICTBKEgIOQRPBtLoEPosQRyPIANYqEA6PSGOapPY-E73MGBC5MkAwIxk-HSPEcrkMvrHPIolJK+LPPoDBAa3m-eA6lJ6lWmNUIBGmLXwc0+U3wVqazqrW29Xm26zbf5VD2nCLe4YBF0pCbxQNNX0bL01So2P286PwUMVR19Bbxe284PamqZ+DG+YBA0HPKFpOTVbxvO8NHuGrV+C+WNFAINmqfeuNnIRRNViLppslPumNJVbvDhAt8vNjv5vITlNdiM2QelqrLszwxf5TfVVapmwl9clA9jwIHts7vrng-C6wHuu32u3R-Qmon6piwlkCAKOC0zn0gwhSuewxQJYhCBgUg5QAnlET1ax3nueCSxQe8gSqcpfD1RMsPDMVcTAAkIHkSDoO5cZBV5c8klAyCoHkKkyIVVEIm+D8tAgQgwCYwDeT3K0ahva1eDdNjsXICBxB42CLSfH0jwFZFPUydCVNWS0ENUkUtIfSFgL0pSxWIcQmEggA3Ui-3lXiUg0sSCB0CDSAAZQ4rjpPuc9MWxAAzCBSTIeI6XI2Eb3s8BJFZSzguYxEbzKMVSGgDjSAJaSsXsewgA

[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]

constants find a spot where serf can go, save it in memory

    //-----------------------------------------------------------------------------------------------
    
Upkeep costs:

    0.001 / tick / road, plains
    1000 roads = 1 energy
    
    0.005 / tick / road, swamp
    500 roads = 1 energy
    
    0.1 / tick / container
    10 containers = 1 energy
    
    0.03 / tick / rampart
    300 ramparts = 1 energy


    */