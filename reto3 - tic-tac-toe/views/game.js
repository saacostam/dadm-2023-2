import {FIELD_FILLER} from "../constants";
import {StyleSheet, Text, View} from "react-native";
import {Field} from "../components";

export const Game = ({turn, setTurn, gameOver, setGameOver, grid, setGrid, isOnePlayerMode, analyzeGrid}) => {
    const updateGrid = (grid, i, j) => {
        return grid.map(
            (row, y) => {
                return ( y === j ?
                        row.map(
                            (field, x) => {
                                if (x === i) field.content = turn === 0 ? FIELD_FILLER.ONE : FIELD_FILLER.TWO;
                                return field
                            }
                        ) : row
                )
            }
        )
    }

    const onPressField = (id) => {
        for (let j = 0; j < grid.length; j++){
            const row = grid[j];
            for (let i = 0; i < grid[j].length; i++){
                if (row[i].id === id && row[i].content === FIELD_FILLER.EMPTY && !gameOver) {
                    const updatedGrid = updateGrid(grid, i, j);
                    const { analyzedGrid, gameOver} = analyzeGrid(updatedGrid);

                    setGrid(analyzedGrid);
                    setGameOver(gameOver);

                    if (!isOnePlayerMode) setTurn((turn+1)%2);
                }
            }
        }
    }

    return (
        <View>
            {
                (grid.map(
                    row => (
                        <View
                            style={styles.row}
                        >
                            {
                                row.map(
                                    field => (
                                        <Field
                                            label={field.content}
                                            highlighted={field.highlighted}
                                            key={field.id}
                                            onPress={() => onPressField(field.id)}
                                            gameOver={gameOver}
                                        />
                                    )
                                )
                            }
                        </View>
                    )
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
});
