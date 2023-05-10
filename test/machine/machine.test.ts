import {beforeEach, describe, expect, it} from "vitest"
import { interpret, InterpreterFrom } from "xstate"
import {GameMachine, GameModel} from "../../src/machine/GameMachine"

//TESTS UTILITAIRES 
describe("machine/GameMachine", () => {
    describe("join", () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it("should not let a player join a game twice", () => {
            expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true) 
            expect(machine.state.context.players).toHaveLength(1) // Verify if there is one player when one player join

            expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true) 
            expect(machine.state.context.players).toHaveLength(2) // Verify if there is two players if two players join
        })
    })
})