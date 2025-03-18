import './global.css';

// For web hotloading
import '@expo/metro-runtime';

import { StatusBar } from 'expo-status-bar';
import { createContext, useEffect } from 'react';
import React, { useState } from 'react';
import { Vector2 } from 'types/Vector2';
import { CustomModal } from 'components/CustomModal';
import { Canvas } from 'components/Canvas';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { BoardItemProps } from 'components/BoardItem';
import { calcGridAttrs } from 'utils/GridUtils';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import {
    constructInitBoard,
    miniBoardConfig,
    frenchConfig,
    wieglebConfig,
    assym3322Config,
    englishConfig,
    diamondConfig,
    triangularConfig,
    BoardConfig,
} from 'utils/BoardConfig';
import { getPossibleMoves } from 'utils/GameUtils';

// Constant Declarations
const CANVAS_SIZE = 360;

// const INIT_BOARD_CONFIG = triangularConfig;
let INIT_BOARD_CONFIG = miniBoardConfig;

let { boardState: INIT_BOARD, tilesInASide: TILES_IN_A_SIDE } =
    constructInitBoard(INIT_BOARD_CONFIG);

export const Context = createContext<{
    getSelected: () => Vector2;
    setSelected: (s: Vector2) => void;
    playMove: (move: Move) => void;
    readonly canvasSize: number;
    readonly tilesInASide: number;
    readonly gap: number;
    readonly tileSize: number;
}>({
    // Selected Board Item Variable
    getSelected: () => ({ x: -1, y: -1 }),
    setSelected: () => {},
    playMove: () => {},

    // Grid Attributes
    canvasSize: CANVAS_SIZE,
    tilesInASide: TILES_IN_A_SIDE,
    gap: calcGridAttrs(CANVAS_SIZE, TILES_IN_A_SIDE).gap,
    tileSize: calcGridAttrs(CANVAS_SIZE, TILES_IN_A_SIDE).tileSize,
});

export default function App() {
    const [_selected, _setSelected] = useState<Vector2>({ x: -1, y: -1 });

    const getSelected: () => Vector2 = () => {
        return _selected;
    };

    const setSelected = (s: Vector2) => {
        _setSelected(s);
    };

    const [canvasSize, setCanvasSize] = useState<number>(CANVAS_SIZE);

    const playMove = (move: Move) => {
        const { dir, from, to, eaten } = move;

        const newBoardState = [...boardState];
        newBoardState.forEach((item) => {
            // set from type to hole
            if (item.position.x == from.x && item.position.y == from.y)
                item.type = BoardItemType.HOLE;

            // set to type to peg
            if (item.position.x == to.x && item.position.y == to.y) item.type = BoardItemType.PEG;

            // set eaten type to hole
            if (item.position.x == eaten.x && item.position.y == eaten.y)
                item.type = BoardItemType.HOLE;
        });

        let pegsLeft = 0;
        let playablePegs = 0;
        newBoardState.forEach((item) => {
            if (item.type == BoardItemType.HOLE) return;

            pegsLeft++;

            const moves = getPossibleMoves(item.position, newBoardState, TILES_IN_A_SIDE);
            if (moves.length <= 0) item.canMove = false;
            else {
                item.canMove = true;
                playablePegs++;
            }
        });

        setBoardState(newBoardState);
        setSelected({ x: -1, y: -1 });

        if (pegsLeft == 1) {
            setTimeout(() => {
                setGameState('won');
            }, 500);
        } else if (playablePegs == 0) {
            setTimeout(() => {
                setGameState('lost');
            }, 500);
        }

        setPlayedMoves([...playedMoves, move]);
    };

    const undoMove = () => {
        if (playedMoves.length == 0) return;

        const move = playedMoves[playedMoves.length - 1];

        const { from, to, eaten } = move;

        const newBoardState = [...boardState];
        boardState.forEach((item) => {
            // set from type to peg
            if (item.position.x == from.x && item.position.y == from.y)
                item.type = BoardItemType.PEG;

            // set to type to hole
            if (item.position.x == to.x && item.position.y == to.y) item.type = BoardItemType.HOLE;

            // set eaten type to peg
            if (item.position.x == eaten.x && item.position.y == eaten.y)
                item.type = BoardItemType.PEG;
        });
        newBoardState.forEach((item) => {
            if (item.type == BoardItemType.HOLE) return;

            const moves = getPossibleMoves(item.position, newBoardState, TILES_IN_A_SIDE);
            item.canMove = moves.length > 0;
        });

        setBoardState(newBoardState);
        setSelected({ x: -1, y: -1 });

        setPlayedMoves(playedMoves.slice(0, playedMoves.length - 1));
    };

    // Dynamically Resize Canvas
    const resizeCanvas = () => {
        console.log('RESIZED');
        setCanvasSize(Math.min(window.innerWidth * 0.9, window.innerHeight - 132));
    };

    useEffect(() => {
        window.addEventListener('resize', resizeCanvas);

        return () => window.removeEventListener('resize', resizeCanvas);
        // unload
    }, []);

    // CANVAS_SIZE = Math.min(window.innerWidth, window.innerHeight) * 0.8;

    type GameState = 'start' | 'selection' | 'playing' | 'won' | 'lost';
    const [gameState, setGameState] = useState<GameState>('start');

    const [playedMoves, setPlayedMoves] = useState<Move[]>([]);

    const [boardState, setBoardState] = useState<BoardItemProps[]>(INIT_BOARD);

    const [modalState, setModalState] = useState<boolean>(false);

    const modalButtons = [
        {
            text: 'Reset Board',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => setModalState(false),
        },
    ];

    const reloadBoard = (config: BoardConfig) => {
        let { boardState: newBoardState, tilesInASide: newTilesInASide } =
            constructInitBoard(config);
        INIT_BOARD_CONFIG = config;
        TILES_IN_A_SIDE = newTilesInASide;

        newBoardState.forEach((item) => {
            if (item.type == BoardItemType.HOLE) return;

            const moves = getPossibleMoves(item.position, newBoardState, TILES_IN_A_SIDE);
            item.canMove = moves.length > 0;
        });

        setBoardState(newBoardState);
        setPlayedMoves([]);
    };

    type GameDetails = {
        title: string;
        description: string;
    };

    const [title, setTitle] = useState<string>('');

    const startSelection = [
        {
            text: 'French (European) Style (7x7)',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(frenchConfig);
                setTitle('French (European) Style (7x7)');
                setGameState('playing');
            },
        },
        {
            text: 'J.C Wiegleb Version (9x9)',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(wieglebConfig);
                setTitle('J.C Wiegleb Version (9x9)');
                setGameState('playing');
            },
        },
        {
            text: 'Asymmetrical 3-3-2-2 (8x8)',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(assym3322Config);
                setTitle('Asymmetrical 3-3-2-2 (8x8)');
                setGameState('playing');
            },
        },
        {
            text: 'English Standard Style (7x7)',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(englishConfig);
                setTitle('English Standard Style (7x7)');
                setGameState('playing');
            },
        },
        {
            text: 'Diamond Variation (9x9)',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(diamondConfig);
                setTitle('Diamond Variation (9x9)');
                setGameState('playing');
            },
        },
        {
            text: 'Triangular Variation (9x9)',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(triangularConfig);
                setTitle('Triangular Variation (9x9)');
                setGameState('playing');
            },
        },
        {
            text: 'Mini-Grid Test (3x3)',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(miniBoardConfig);
                setTitle('Mini-Grid Test (3x3)');
                setGameState('playing');
            },
        },
    ];

    const lostButtons = [
        {
            text: 'Try again',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                setGameState('start');
            },
        },
        {
            text: 'Undo your last move',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                undoMove();
                setGameState('playing');
            },
        },
    ];

    const wonButton = {
        text: 'Play Again',
        textColor: 'text-white',
        color: 'bg-slate-500',
        onPress: () => {
            setGameState('start');
        },
    };

    return (
        <Context.Provider
            value={{
                getSelected,
                setSelected,
                canvasSize,
                tilesInASide: TILES_IN_A_SIDE,
                gap: calcGridAttrs(canvasSize, TILES_IN_A_SIDE).gap,
                tileSize: calcGridAttrs(canvasSize, TILES_IN_A_SIDE).tileSize,
                playMove: playMove,
            }}>
            <SafeAreaView className="size-full items-center justify-center gap-4 bg-gray-950">
                <CustomModal
                    isActive={gameState == 'start' || gameState == 'won' || gameState == 'lost'}
                    title="Peg Solitaire"
                    // message='Instructions: Each peg can jump over and "eat"  one peg in any of the four directions, given that it lands in a hole. Your goal is to remove all but one peg from the board.'
                    message="Pick your Peg Solitaire Variation"
                    buttons={startSelection}></CustomModal>
                <CustomModal
                    isActive={gameState == 'lost'}
                    title="You Lost!"
                    message="You lost! Try again!"
                    buttons={lostButtons}></CustomModal>
                <CustomModal
                    isActive={gameState == 'won'}
                    title="You Won!"
                    message="You won! Play again?"
                    buttons={[wonButton]}></CustomModal>
                <View className="w-full items-center">
                    <Text className="text-center text-2xl font-bold text-white">{title}</Text>
                </View>
                <Canvas boardState={boardState}></Canvas>
                <View className="w-full flex-row flex-wrap justify-center gap-2">
                    <Button
                        title="Restart"
                        onPress={() => reloadBoard(INIT_BOARD_CONFIG)}
                        disabled={playedMoves.length == 0}></Button>
                    <Button
                        title="Undo Move"
                        onPress={() => {
                            undoMove();
                        }}
                        disabled={playedMoves.length == 0}></Button>

                    <Button
                        title="Return to Menu"
                        onPress={() => {
                            setGameState('start');
                        }}
                    />
                </View>
                <StatusBar style="auto" />
            </SafeAreaView>
        </Context.Provider>
    );
}
