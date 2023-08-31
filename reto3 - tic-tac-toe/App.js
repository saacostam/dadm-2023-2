import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {Header, Message, Button} from "./components";
import {COLOR, FIELD_FILLER} from "./constants";
import {Game} from "./views";
import {useState} from "react";
import Minimax from "tic-tac-toe-minimax";

const { ComputerMove } = Minimax;

export default function App() {
    const N = 3;

    const [gameOver, setGameOver] = useState(true);
    const [turn, setTurn] = useState(0);
    const [grid, setGrid] = useState(createGrid(N));
    const [isOnePlayerMode, setIsOnePlayerMode] = useState(true);
    const [score, setScore] = useState({
        ONE: 0,
        TWO: 0,
        TIE: 0,
    })

    const handleNewGame = (isOnePlayerMode) => {
        setIsOnePlayerMode(isOnePlayerMode);
        setGameOver(false);
        setGrid(createGrid(N));
    }

    const analyzeGrid = (grid) => {
        let gameOver = false;

        const checkAndUpdateRow = ([ONE, TWO, THREE]) => {
            if (ONE.content === TWO.content && TWO.content === THREE.content && ONE.content !== FIELD_FILLER.EMPTY) {
                gameOver = true;
                ONE.highlighted = true;
                TWO.highlighted = true;
                THREE.highlighted = true;

                setScore(
                    prevState => ({
                        ...prevState,
                        ...(ONE.content === FIELD_FILLER.ONE ? {
                            ONE: prevState.ONE + 1,
                        } : {
                            TWO: prevState.TWO + 1,
                        })
                    })
                )
            }
        }

        const checkGameOver = () => {
            for (let i = 0; i < grid.length; i++){
                checkAndUpdateRow([grid[i][0], grid[i][1], grid[i][2]]);
                checkAndUpdateRow([grid[0][i], grid[1][i], grid[2][i]]);
            }

            checkAndUpdateRow([grid[0][0], grid[1][1], grid[2][2]]);
            checkAndUpdateRow([grid[0][2], grid[1][1], grid[2][0]]);

            let allFilled = true;
            for (let i = 0; i < grid.length; i++){
                for (let j = 0; j < grid[i].length; j++){
                    allFilled = allFilled && grid[i][j].content !== FIELD_FILLER.EMPTY;
                }
            }

            if (allFilled && !gameOver) {
                gameOver = true;
                setScore(prevState => ({
                    ...prevState,
                    ...{TIE: prevState.TIE + 1},
                }))
            }
        }

        checkGameOver();

        if (isOnePlayerMode && !gameOver){
            const symbols = {
                huPlayer: FIELD_FILLER.ONE,
                aiPlayer: FIELD_FILLER.TWO,
            }
            const difficulty = "Normal";
            const board = [
                ...grid[0].map((field,index) => field.content === FIELD_FILLER.EMPTY ? index: field.content),
                ...grid[1].map((field,index) => field.content === FIELD_FILLER.EMPTY ? 3+index: field.content),
                ...grid[2].map((field,index) => field.content === FIELD_FILLER.EMPTY ? 6+index: field.content),
            ];

            const nextMove = ComputerMove( board, symbols, difficulty );

            const j = Math.floor(nextMove/3);
            const i = nextMove%3;

            grid[j][i].content = turn === 1 ? FIELD_FILLER.ONE : FIELD_FILLER.TWO;

            checkGameOver();
        }

        return {
            analyzedGrid: grid,
            gameOver
        }
    }

  return (
    <View style={styles.container}>
      <Header label={`${FIELD_FILLER.ONE} TIC - TAC - TOE ${FIELD_FILLER.TWO}`} isSecondary={true}/>
      <Game
          startingTurn={0}
          gameOver={gameOver}
          setGameOver={setGameOver}
          turn={turn}
          setTurn={setTurn}
          grid={grid}
          setGrid={setGrid}
          isOnePlayerMode={isOnePlayerMode}
          analyzeGrid={analyzeGrid}
      />

        {
            gameOver ?
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Button
                        onPress={() => handleNewGame(true)}
                        title={'1 Player'}
                    />
                    <Button
                        onPress={() => handleNewGame(false)}
                        title={'2 Players'}
                    />
                </View> :
                <Message content={`It is ${ turn === 0 ? FIELD_FILLER.ONE : FIELD_FILLER.TWO }'s player turn`} isSecondary={true }/>
        }
        <Text style={styles.counter} >
            {`${FIELD_FILLER.ONE}: ${score.ONE} ${FIELD_FILLER.TWO}: ${score.TWO}`}
        </Text>
        <Text style={styles.counter} >
            {`TIE: ${score.TIE}`}
        </Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    color: COLOR.SECONDARY,
    fontSize: 18,
    fontWeight: "700",
      marginVertical: 4,
  }
});

const createGrid = (n) => {
    const newGrid = [];
    for (let i = 0; i < n; i++){
        const tempRow = [];
        for (let j = 0; j < n; j++){
            tempRow.push({
                content: FIELD_FILLER.EMPTY,
                id: Math.floor(Math.random() * 2000000),
                highlighted: false,
            });
        }
        newGrid.push(tempRow);
    }
    return newGrid;
}
