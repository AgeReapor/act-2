import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { createContext } from 'react';

import './global.css';

// For web hotloading
import '@expo/metro-runtime';
import React, { useState } from 'react';
import { Vector2 } from 'types/Vector2';
import { CustomModal } from 'components/CustomModal';

export const SelectContext = createContext<{
    getSelected: () => Vector2;
    setSelected: (s: Vector2) => void;
}>({
    getSelected: () => ({ x: -1, y: -1 }),
    setSelected: () => {},
});

export default function App() {
    const [_selected, _setSelected] = useState<Vector2>({ x: -1, y: -1 });

    const getSelected: () => Vector2 = () => {
        return _selected;
    };
    const setSelected = (s: Vector2) => {
        _setSelected(s);
    };

    const [modalState, setModalState] = useState<boolean>(true);

    const modalButtons = [
        {
            text: 'Reset Board',
            textColor: 'text-white',
            color: 'bg-slate-500',
            onPress: () => setModalState(false),
        },
    ];

    return (
        <SelectContext.Provider value={{ getSelected, setSelected }}>
            <CustomModal isActive={modalState} buttons={modalButtons} />
            <ScreenContent title="Home" path="App.tsx"></ScreenContent>
            <StatusBar style="auto" />
        </SelectContext.Provider>
    );
}
