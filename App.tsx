import './global.css';

// For web hotloading
import '@expo/metro-runtime';

import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useEffect } from 'react';
import React, { useState } from 'react';
import { Vector2 } from 'types/Vector2';
import { CustomModal } from 'components/CustomModal';
import { Canvas } from 'components/Canvas';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { BoardItemProps } from 'components/BoardItem';
import { calcGridAttrs } from 'utils/GridUtils';
import { BoardItemType } from 'types/BoardItemType';
import { getItem, getPossibleMoves } from 'utils/GameUtils';
import { Move } from 'types/Move';
import { Direction } from 'types/Direction';

// Constant Declarations
const CANVAS_SIZE = 360;
const TILES_IN_A_SIDE = 8;

const INIT_BOARD: BoardItemProps[] = [];

const boardSetup = () => {
    let x = 0;
    for (let i = 0; i < TILES_IN_A_SIDE; i++) {
        for (let j = 0; j < TILES_IN_A_SIDE; j++) {
            if (x > 0)
                INIT_BOARD.push({
                    _key: i * TILES_IN_A_SIDE + j + '',
                    position: { x: i, y: j },
                    type: BoardItemType.PEG,
                    canMove: true,
                });
            else
                INIT_BOARD.push({
                    _key: i * TILES_IN_A_SIDE + j + '',
                    position: { x: i, y: j },
                    type: BoardItemType.HOLE,
                    canMove: true,
                });

            x = (x + 1) % 3;
        }
    }
};

boardSetup();

export const Context = createContext<{
    getSelected: () => Vector2;
    setSelected: (s: Vector2) => void;
    readonly canvasSize: number;
    readonly tilesInASide: number;
    readonly gap: number;
    readonly tileSize: number;
}>({
    // Selected Board Item Variable
    getSelected: () => ({ x: -1, y: -1 }),
    setSelected: () => {},

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
            }}>
            <SafeAreaView className="justify-center items-center bg-gray-950 size-full">
                <CustomModal isActive={modalState} buttons={modalButtons} />
                {/* <ScreenContent title="Home" path="App.tsx"></ScreenContent> */}
                <Canvas boardState={boardState}></Canvas>
                <TextTracker boardState={boardState} />
                <StatusBar style="auto" />
            </SafeAreaView>
        </Context.Provider>
    );
}

const TextTracker = ({ boardState = [] }: { boardState: BoardItemProps[] }) => {
    const { getSelected } = useContext(Context);
    const text =
        getSelected().x == -1 || getSelected().y == -1
            ? 'No Selection'
            : `Selected: ${getSelected().x}, ${getSelected().y}`;

    const moves = getPossibleMoves(getSelected(), boardState, TILES_IN_A_SIDE);

    return (
        <View className="flex-col">
            <Text className="text-white">{text}</Text>

            <Text className="text-white">
                Possible Moves:{' '}
                {moves
                    .map((m) => {
                        if (m.dir == Direction.UP) return 'Up';
                        if (m.dir == Direction.DOWN) return 'Down';
                        if (m.dir == Direction.LEFT) return 'Left';
                        if (m.dir == Direction.RIGHT) return 'Right';
                    })
                    .join(', ')}
            </Text>
        </View>
    );
};
