import './global.css';

// For web hotloading
import '@expo/metro-runtime';

import { StatusBar } from 'expo-status-bar';
import { createContext } from 'react';
import React, { useState } from 'react';
import { Vector2 } from 'types/Vector2';
import { CustomModal } from 'components/CustomModal';
import { Canvas } from 'components/Canvas';
import { Button, SafeAreaView } from 'react-native';
import { BoardItemProps } from 'components/BoardItem';
import { calcGridAttrs } from 'utils/GridUtils';
import { BoardItemType } from 'types/BoardItemType';
import { Move } from 'types/Move';
import { constructInitBoard, miniBoardConfig, triangularConfig } from 'utils/BoardConfig';
import { getPossibleMoves } from 'utils/GameUtils';

// Constant Declarations
const CANVAS_SIZE = 360;

// const INIT_BOARD_CONFIG = triangularConfig;
const INIT_BOARD_CONFIG = miniBoardConfig;

const { boardState: INIT_BOARD, tilesInASide: TILES_IN_A_SIDE } =
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
            if (item.type == BoardItemType.PEG) pegsLeft++;

            const moves = getPossibleMoves(item.position, newBoardState, TILES_IN_A_SIDE);
            if (moves.length <= 0) return;
            item.canMove = true;

            playablePegs++;
        });

        setBoardState(newBoardState);
        setSelected({ x: -1, y: -1 });

        if (pegsLeft == 1) {
            console.log('You won!');
            setGameState('won');
        } else if (playablePegs == 0) {
            console.log('You lost!');
            setGameState('lost');
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

        setBoardState(newBoardState);
        setSelected({ x: -1, y: -1 });

        setPlayedMoves(playedMoves.slice(0, playedMoves.length - 1));
    };

    type GameState = 'start' | 'playing' | 'won' | 'lost';
    const [gameState, setGameState] = useState<GameState>('start');

    const [onboarding, setOnboarding] = useState<boolean>(false);

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

    return (
        <Context.Provider
            value={{
                getSelected,
                setSelected,
                canvasSize: CANVAS_SIZE,
                tilesInASide: TILES_IN_A_SIDE,
                gap: calcGridAttrs(CANVAS_SIZE, TILES_IN_A_SIDE).gap,
                tileSize: calcGridAttrs(CANVAS_SIZE, TILES_IN_A_SIDE).tileSize,
                playMove: playMove,
            }}>
            <SafeAreaView className="size-full items-center justify-center bg-gray-950">
                <CustomModal isActive={modalState} buttons={modalButtons} />
                {/* <ScreenContent title="Home" path="App.tsx"></ScreenContent> */}
                <Canvas boardState={boardState}></Canvas>
                <Button
                    title="Undo Move"
                    onPress={() => {
                        undoMove();
                    }}
                    disabled={playedMoves.length == 0}></Button>
                <StatusBar style="auto" />
            </SafeAreaView>
        </Context.Provider>
    );
}
