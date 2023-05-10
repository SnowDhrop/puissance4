// La commande npm run test scanne les dossiers et cherche les tests. Elle est en watch mode

import {beforeEach, describe, expect, it} from "vitest"
import { interpret, InterpreterFrom } from "xstate"
import {GameMachine, GameModel} from "../../src/machine/GameMachine"

//TESTS UTILITAIRES
describe("machine/guards", () => {
    describe("canJoinGame", () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it("should let a player join", () => {
            expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true) // When a player "1", "1", want to join, it must be true
        })

        it("should not let a player join a game twice", () => {
            expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true) 
            expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(false) // A player can't join the same game twice
        })
    })
})