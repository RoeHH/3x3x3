import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";


type Field = {x: number, y: number, z: number, value?: Player};

type Player = 'X' | 'O';

enum Plain {
    XY = 'z',
    YZ = 'x',
    ZX = 'y'
}


export class tictactoex3 {

    private board: Field[] = [];

    public setField(field: Field): Player | string {
        // check if field is in board
        if(field.x < 0 || field.x > 2 || field.y < 0 || field.y > 2 || field.z < 0 || field.z > 2)
            return 'Field is not in board';

        // check if field is already taken
        if(this.getField(field))
            return 'Field is already taken';

        // check if field is on top of another field
        if(!!!this.getField(field, {plain: Plain.XY, modifier: -1}) && field.z !== 0)
            return 'Field is not on top of another field';

        this.board.push(field);

        return this.checkWin(field);
    }

    private checkWin(field1: Field): Player | undefined {
        for(const x of [-1, 0, 1]){
            for(const y of [-1, 0, 1]){
                for(const z of [-1, 0, 1]){
                    if(x === 0 && y === 0 && z === 0)
                        continue;
                    const f2 = this.getField({x: field1.x + x, y: field1.y + y, z: field1.z + z});
                    const f3 = this.getField({x: field1.x + x*2, y: field1.y + y*2, z: field1.z + z*2});                    
                    if(f2 && f3 && f2.value === field1.value && f3.value === field1.value){
                        console.log("Partie gewonnen");
                        
                        return field1.value;
                    }
                }
            }
        }
        
    }

    public getPlain(plain: Plain, layer: number) {
        let grid = Array.from({ length: 3 }, () => Array(3).fill(' '));

        this.board.forEach(field => {
            if (field.z === layer) {
                grid[field.x][field.y] = field.value || ' ';
            }
        });

        // Log the grid
        return grid.map(column => column.join('|')).map((row, i) => i + ' ' + row).join('\n') + '\n  0 1 2';
    }
    
    private getField (field: Field, modifier?: { plain: Plain, modifier: number }): Field | undefined {
        return this.board.find(f => 
            f.x === field.x + (modifier ? modifier.plain === Plain.YZ ? modifier.modifier : 0 : 0) && 
            f.y === field.y + (modifier ? modifier.plain === Plain.ZX ? modifier.modifier : 0 : 0) &&
            f.z === field.z + (modifier ? modifier.plain === Plain.XY ? modifier.modifier : 0 : 0)
        );
    }

    private revertFieldPlayer = (field: Field) => {
        field.value = field.value === 'X' ? 'O' : 'X';
        return field;
    }

}

const game = new tictactoex3();

let player: Player = 'X';

while (true) {
    const x: number = Number(await Input.prompt(`x`));
    const y: number = Number(await Input.prompt(`y`));
    const z: number = Number(await Input.prompt(`z`));
    console.log(x, y, z);
    
    const field = {x, y, z, value: player};
    const winner = game.setField(field);

    console.log('\n');
    console.log(game.getPlain(Plain.XY, 0));
    console.log('\n');
    console.log(game.getPlain(Plain.XY, 1));
    console.log('\n');
    console.log(game.getPlain(Plain.XY, 2));
    console.log('\n');
    if(winner){
        console.log(`${winner} hat die Partie gewonnen`);
    }
    else {
        player = player === 'X' ? 'O' : 'X';
    }

}
