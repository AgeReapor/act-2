import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { createContext } from 'react';

import './global.css';

// For web hotloading
import '@expo/metro-runtime';
import React, { useState } from 'react';
import { Vector2 } from 'types/Vector2';
import { CustomModal } from 'components/CustomModal';
import { Canvas } from 'components/Canvas';
import { View } from 'react-native';
import { BoardItem, BoardItemProps } from 'components/BoardItem';
import { calcGridAttrs } from 'utils/GridUtils';
import { BoardItemType } from 'types/BoardItemType';

// Constant Declarations
const CANVAS_SIZE = 360;
const TILES_IN_A_SIDE = 8;

const INIT_BOARD: BoardItemProps[] = [];

for (let i = 0; i < TILES_IN_A_SIDE; i++) {
    for (let j = 0; j < TILES_IN_A_SIDE; j++) {
        INIT_BOARD.push({
            key: i * TILES_IN_A_SIDE + j + '',
            position: { x: i, y: j },
            type: BoardItemType.PEG,
        });
    }
}

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
            <View className="size-full items-center justify-center bg-gray-950">
                <CustomModal isActive={modalState} buttons={modalButtons} />
                {/* <ScreenContent title="Home" path="App.tsx"></ScreenContent> */}
                <Canvas boardState={boardState}></Canvas>
                <StatusBar style="auto" />
            </View>
        </Context.Provider>
    );
}
