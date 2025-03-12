import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { createContext } from 'react';

import './global.css';

// For web hotloading
import '@expo/metro-runtime';
import React, { useState } from 'react';
import { Vector2 } from 'types/Vector2';

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

    return (
        <SelectContext.Provider value={{ getSelected, setSelected }}>
            <ScreenContent title="Home" path="App.tsx"></ScreenContent>
            <StatusBar style="auto" />
        </SelectContext.Provider>
    );
}
