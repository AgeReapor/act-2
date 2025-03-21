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
import { BoardConfig, constructInitBoard, stdCheckers } from 'utils/BoardConfig';
import { getItem, getPossibleMoves } from 'utils/GameUtils';

// Constant Declarations
const CANVAS_SIZE = 360;

// const INIT_BOARD_CONFIG = triangularConfig;
let INIT_BOARD_CONFIG = stdCheckers;

let { boardState: INIT_BOARD, tilesInASide: TILES_IN_A_SIDE } =
    constructInitBoard(INIT_BOARD_CONFIG);

const canvasColor = `bg-orange-400`;

const defaultDarkTile = `bg-gray-950`;
const focusDarkTile = `bg-gray-800`;
const defaultLightTile = `bg-red-500`;
const focusLightTile = `bg-red-400`;

const moveTile = `bg-green-800`;

const defaultRed = `bg-red-800`;
const selectedRed = `bg-red-600`;

const defaultWhite = `bg-gray-200`;
const selectedWhite = `bg-white`;

export const Context = createContext<{
    getSelected: () => Vector2;
    setSelected: (s: Vector2) => void;
    playMove: (move: Move) => void;
    readonly canvasSize: number;
    readonly tilesInASide: number;
    readonly gap: number;
    readonly tileSize: number;

    readonly canvasColor?: string;

    readonly defaultDarkTile?: string;
    readonly focusDarkTile?: string;
    readonly defaultLightTile?: string;
    readonly focusLightTile?: string;
    readonly moveTile?: string;

    readonly defaultRed?: string;
    readonly selectedRed?: string;
    readonly disabledRed?: string;
    readonly defaultWhite?: string;
    readonly selectedWhite?: string;
    readonly disabledWhite?: string;
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

    // Styles
    canvasColor,
    defaultDarkTile,
    focusDarkTile,
    defaultLightTile,
    focusLightTile,
    moveTile,
    defaultRed,
    selectedRed,
    defaultWhite,
    selectedWhite,
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
        const { from, to, eaten } = move;

        const newBoardState = [...boardState];
        const fromItem = newBoardState.find(
            (item) => item.position.x == from.x && item.position.y == from.y
        )!;
        const toItem = newBoardState.find(
            (item) => item.position.x == to.x && item.position.y == to.y
        )!;
        const eatenItem = eaten
            ? newBoardState.find((item) => item.position.x == eaten.x && item.position.y == eaten.y)
            : null;

        fromItem.position = to;
        toItem.position = from;
        if (eatenItem) eatenItem.type = BoardItemType.HOLE;

        setBoardState(newBoardState);

        const winner = getWinner(boardState);
        if (winner) {
            setTimeout(() => {
                setGameState('won');
            }, 500);
        }
        setSelected({ x: -1, y: -1 });
    };

    const getWinner = (newBoardState: BoardItemProps[]) => {
        let red = 0;
        let white = 0;
        for (const item of newBoardState) {
            if (item.owner == 'red' && item.type != BoardItemType.HOLE) red++;
            if (item.owner == 'white' && item.type != BoardItemType.HOLE) white++;
        }
        console.log(`Red: ${red}, White: ${white}`);

        if (red && white) return null;
        if (red) return 'red';
        if (white) return 'white';
    };

    // Dynamically Resize Canvas
    const resizeCanvas = () => {
        console.log('RESIZED');
        setCanvasSize(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8));
    };

    useEffect(() => {
        resizeCanvas();

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

    const [title, setTitle] = useState<string>('');

    const startSelection = [
        {
            text: 'White goes First',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(stdCheckers);
                setTitle('Checkers');
                setGameState('playing');
            },
        },
        {
            text: 'Red goes First',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => {
                reloadBoard(stdCheckers);
                setTitle('Checkers');
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

                canvasColor,
                defaultDarkTile,
                defaultLightTile,
                focusDarkTile,
                focusLightTile,
                moveTile,
                defaultRed,
                selectedRed,
                defaultWhite,
                selectedWhite,
            }}>
            <SafeAreaView className="size-full items-center justify-center gap-4 bg-gray-950">
                {/*
                <CustomModal
                    isActive={gameState == 'start' || gameState == 'won' || gameState == 'lost'}
                    title="Checkers"
                    message="Who will play first?"
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
                */}
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
                            // undoMove();
                        }}
                        disabled={playedMoves.length == 0}></Button>

                    <Button
                        title="Return to Menu"
                        onPress={() => {
                            let restart = confirm('Are you sure you want to return to the menu?');
                            if (restart) setGameState('start');
                        }}
                    />
                </View>
                <StatusBar style="auto" />
            </SafeAreaView>
        </Context.Provider>
    );
}
