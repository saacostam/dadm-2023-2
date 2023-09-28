import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, BackHandler, Modal, Pressable} from 'react-native';
import {Header, Message, MenuButton} from "./components";
import {COLOR, FIELD_FILLER} from "./constants";
import {useState, useEffect, useRef} from "react";
import Minimax from "tic-tac-toe-minimax";
import {Audio} from "expo-av";
import Canvas from "react-native-canvas";
const { ComputerMove } = Minimax;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function App() {
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync( require('./assets/nope.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    const [sound, setSound] = useState();

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const N = 3;

    const [gameOver, setGameOver] = useState(true);
    const [turn, setTurn] = useState(0);
    const [grid, setGrid] = useState(createGrid(N));
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleDiffModal, setVisibleDiffModal] = useState(false);
    const [difficulty, setDifficulty] = useState("Normal");
    const [isOnePlayerMode, setIsOnePlayerMode] = useState(true);
    const [score, setScore] = useState({
        ONE: 0,
        TWO: 0,
        TIE: 0,
    })

    const drawGrid = (ctx) => {
        const width = 300;
        const height = 300;

        const drawLine = (ctx, begin, end, stroke = 'black', width = 1) => {
            if (stroke) {
                ctx.strokeStyle = stroke;
            }

            if (width) {
                ctx.lineWidth = width;
            }
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(...begin);
            ctx.lineTo(...end);
            ctx.stroke();
        }

        if (!grid) return;

        ctx.clearRect(0, 0, width, height);
        drawLine(ctx, [width/3, 0], [width/3, width], COLOR.SECONDARY, 3);
        drawLine(ctx, [width*2/3, 0], [width*2/3, width], COLOR.SECONDARY, 3);
        drawLine(ctx, [0, height/3], [width, height/3], COLOR.SECONDARY, 3);
        drawLine(ctx, [0, height*2/3], [width, height*2/3], COLOR.SECONDARY, 3);

        grid.forEach(
            (row, y) => {
                row.map(
                    (field, x) => {
                        const cX = (x*100)+50;
                        const cY = (y*100)+50;

                        const { content, highlighted } = grid[y][x];

                        if (content !== FIELD_FILLER.EMPTY){
                            ctx.beginPath();
                            ctx.strokeStyle = content === FIELD_FILLER.ONE ? COLOR.PRIMARY : COLOR.SECONDARY;
                            ctx.fillStyle = highlighted ? COLOR.SUCCESS : 'transparent';
                            ctx.arc(cX, cY, 25, 0, 2*Math.PI, false);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                )
            }
        )
    }

    const handleNewGame = (isOnePlayerMode) => {
        setIsOnePlayerMode(isOnePlayerMode);
        setGameOver(false);
        setGrid(createGrid(N));
    }

    const analyzeGrid = async (grid) => {
        let gameOver = false;

        const checkAndUpdateRow = ([ONE, TWO, THREE]) => {
            if (ONE.content === TWO.content && TWO.content === THREE.content && ONE.content !== FIELD_FILLER.EMPTY) {
                playSuccess();

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
            const board = [
                ...grid[0].map((field,index) => field.content === FIELD_FILLER.EMPTY ? index: field.content),
                ...grid[1].map((field,index) => field.content === FIELD_FILLER.EMPTY ? 3+index: field.content),
                ...grid[2].map((field,index) => field.content === FIELD_FILLER.EMPTY ? 6+index: field.content),
            ];

            drawGrid( ref.current.getContext('2d') );
            await timeout(500);

            const nextMove = ComputerMove( board, symbols, difficulty );

            const j = Math.floor(nextMove/3);
            const i = nextMove%3;

            grid[j][i].content = turn === 1 ? FIELD_FILLER.ONE : FIELD_FILLER.TWO;

            playSound();

            checkGameOver();
        }

        return {
            analyzedGrid: grid,
            gameOver
        }
    }

    const width = 300;
    const height = 300;

    async function playSoundYeh() {
        const { sound } = await Audio.Sound.createAsync( require('./assets/info.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    async function playSuccess() {
        const { sound } = await Audio.Sound.createAsync( require('./assets/yeah.mp3'));
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const updateGrid = (grid, i, j) => {
        return grid.map(
            (row, y) => {
                return (y === j ?
                        row.map(
                            (field, x) => {
                                if (x === i) field.content = turn === 0 ? FIELD_FILLER.ONE : FIELD_FILLER.TWO;
                                return field
                            }
                        ) : row
                )
            }
        );
    }

    const onPressField = async (x, y) => {
        const i = Math.min(Math.floor(x/100), 2);
        const j = Math.min(Math.floor(y/100), 2);

        const current = grid[j][i];

        if (current.content === FIELD_FILLER.EMPTY && !gameOver) {
            playSoundYeh();

            const updatedGrid = updateGrid(grid, i, j);
            const { analyzedGrid, gameOver} = await analyzeGrid(updatedGrid);

            setGrid(analyzedGrid);
            setGameOver(gameOver);

            if (!isOnePlayerMode) setTurn((turn+1)%2);
        }
    }

    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const ctx = ref.current.getContext('2d');
            ref.current.width = width;
            ref.current.height = height;
            drawGrid(ctx);
        }
    }, [ref]);

    useEffect(() => {
        drawGrid( ref.current.getContext('2d') );
    }, [grid])

  return (
    <View style={styles.container}>
          <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 70,
            }}
          >
              <Header label={`${FIELD_FILLER.ONE} TIC - TAC - TOE ${FIELD_FILLER.TWO}`} isSecondary={true}/>
              <View
                  style={{
                      position: 'relative',
                      width: 300,
                      height: 300,
                  }}
              >
                  <Canvas
                      style={{
                          backgroundColor: COLOR.DARK,
                          position: 'absolute',
                      }}
                      ref={ref}
                  />
                  <Pressable
                      style={{
                          position: 'absolute',
                          backgroundColor: 'transparent',
                          width: 300,
                          height: 300,
                      }}
                      onPress={(e) => onPressField(e.nativeEvent.locationX, e.nativeEvent.locationY)}
                  ></Pressable>
              </View>

              {
                  gameOver ?
                      <Message content={`Game is Over!`} isSecondary={true }/>:
                      <Message content={`Game on!`} isSecondary={true }/>
              }
              <Text style={styles.counter} >
                  {`${FIELD_FILLER.ONE}: ${score.ONE} ${FIELD_FILLER.TWO}: ${score.TWO}`}
              </Text>
              <Text style={styles.counter} >
                  {`TIE: ${score.TIE}`}
              </Text>
          </View>
        <View style={{
            height: 150,
            flexDirection: 'row',
        }}>
            <MenuButton
                emoji={'🔁'}
                title={'New Game'}
                onPress={() => handleNewGame(true)}
            />
            <MenuButton
                emoji={'🔰'}
                title={'Difficulty'}
                onPress={() => setVisibleDiffModal(!visibleDiffModal)}
            />
            <Modal
                visible={visibleDiffModal}
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={styles.modal}
                    >
                        <Text
                            style={{
                                paddingBottom: 10,
                                color: COLOR.SECONDARY,
                            }}
                        >Choose a difficulty level:</Text>
                        {
                            ['🧸 Easy', '🧩 Normal', '🥊 Hard'].map(
                                diff => {
                                    return (
                                        <Pressable
                                            onPress={() => {
                                                setDifficulty(diff.split(' ')[1]);
                                                setVisibleDiffModal(!visibleDiffModal);
                                                handleNewGame(true);
                                            }}
                                            style={styles.yesnobuttons}
                                        >
                                            <Text
                                                style={{
                                                    color: COLOR.SECONDARY,
                                                    textAlign: 'center',
                                                }}
                                            >{diff}</Text>
                                        </Pressable>
                                    )
                                }
                            )
                        }
                    </View>
                </View>
            </Modal>
            <MenuButton
                emoji={'🔚'}
                title={'Quit'}
                onPress={() => setVisibleModal(!visibleModal)}
            />
            <Modal
                visible={visibleModal}
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={styles.modal}
                    >
                        <Text>Are you sure you want to quit?</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly'
                            }}
                        >
                            <Pressable
                                onPress={() => setVisibleModal(!visibleModal)}
                                style={styles.yesnobuttons}
                            >
                                <Text
                                    style={{
                                        color: COLOR.SECONDARY,
                                    }}
                                >No</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    setVisibleModal(!visibleModal);
                                    BackHandler.exitApp();
                                }}
                                style={styles.yesnobuttons}
                            >
                                <Text
                                    style={{
                                        color: COLOR.SECONDARY,
                                    }}
                                >Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
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
  },
    modal: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLOR.SECONDARY,
    backgroundColor: COLOR.DARK,
    },
    yesnobuttons: {
        fontWeight: 400,
        marginTop: 10,
        marginHorizontal: 8,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: COLOR.SECONDARY,
        backgroundColor: COLOR.PRIMARY,
        paddingVertical: 8,
        paddingHorizontal: 16,
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
